"""Upload von Front- und Rückseitenbildern (nur Administratoren)."""

from __future__ import annotations

import re
import uuid
from datetime import timedelta
from http import HTTPStatus
from pathlib import Path

from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.components.http.auth import async_sign_path
from homeassistant.components.http.const import KEY_HASS_REFRESH_TOKEN_ID
from homeassistant.core import HomeAssistant

from .const import IMAGE_DIR, IMAGE_MAX_BYTES, IMAGE_SIGN_DAYS, IMAGE_TYPES, URL_FRONTEND, URL_IMAGES

_IMAGE_NAME = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*\.(jpg|jpeg|png|webp)$")


def sign_image(hass: HomeAssistant, url: str, refresh_token_id: str | None) -> str:
    """Signierte Adresse eines hochgeladenen Fotos (für <img> und CSS, die keinen Login-Header senden)."""
    return async_sign_path(hass, url.split("?", 1)[0], timedelta(days=IMAGE_SIGN_DAYS), refresh_token_id=refresh_token_id)


def map_images(value, fn):
    """Wendet fn auf jede Foto-Adresse in einer Rack-Konfiguration an (gibt eine Kopie zurück)."""
    if isinstance(value, str):
        return fn(value) if value.startswith(URL_IMAGES + "/") else value
    if isinstance(value, list):
        return [map_images(v, fn) for v in value]
    if isinstance(value, dict):
        return {k: map_images(v, fn) for k, v in value.items()}
    return value


class ImageView(HomeAssistantView):
    """Liefert hochgeladene Fotos aus, nur mit Anmeldung (Login-Header oder signierte Adresse)."""

    url = URL_IMAGES + "/{filename}"
    name = "rack_display:images"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.folder = Path(hass.config.path(IMAGE_DIR))

    async def get(self, request: web.Request, filename: str) -> web.StreamResponse:
        if not _IMAGE_NAME.match(filename):
            raise web.HTTPNotFound
        path = self.folder / filename
        if not await self.hass.async_add_executor_job(path.is_file):
            raise web.HTTPNotFound
        return web.FileResponse(path, headers={"Cache-Control": "private, max-age=86400"})


class FrontendView(HomeAssistantView):
    """Liefert Skript und Stile der Anzeige aus. `no-cache`: der Browser fragt bei jedem Laden kurz nach
    (Antwort 304, solange sich nichts geändert hat) und bekommt nach einem Update sofort die neue Fassung."""

    url = URL_FRONTEND + "/{filename}"
    name = "rack_display:frontend"
    requires_auth = False
    FILES = {"rack-display.js", "rack-display.app.js", "rack-display.css", "rack-editor.js", "rack-editor.app.js", "version.txt"}

    def __init__(self) -> None:
        self.folder = Path(__file__).parent / "frontend"

    async def get(self, request: web.Request, filename: str) -> web.StreamResponse:
        if filename not in self.FILES:
            raise web.HTTPNotFound
        return web.FileResponse(self.folder / filename, headers={"Cache-Control": "no-cache"})


class ImageUploadView(HomeAssistantView):
    """POST /api/rack_display/image mit Formularfeld `file` → {"url": …}."""

    url = "/api/rack_display/image"
    name = "api:rack_display:image"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.folder = Path(hass.config.path(IMAGE_DIR))

    async def post(self, request: web.Request) -> web.Response:
        user = request["hass_user"]
        if not user.is_admin:
            return self.json_message("Nur Administratoren dürfen Bilder hochladen", HTTPStatus.FORBIDDEN)
        data = await request.post()
        field = data.get("file")
        if field is None or not hasattr(field, "file"):
            return self.json_message("Feld 'file' fehlt", HTTPStatus.BAD_REQUEST)
        ext = IMAGE_TYPES.get(field.content_type)
        if ext is None:
            return self.json_message("Nur JPEG, PNG oder WebP", HTTPStatus.UNSUPPORTED_MEDIA_TYPE)
        content = await self.hass.async_add_executor_job(field.file.read, IMAGE_MAX_BYTES + 1)
        if len(content) > IMAGE_MAX_BYTES:
            return self.json_message("Bild zu groß (max. 8 MB)", HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
        name = f"{uuid.uuid4().hex}.{ext}"
        await self.hass.async_add_executor_job(self._write, name, content)
        return self.json({"url": sign_image(self.hass, f"{URL_IMAGES}/{name}", request.get(KEY_HASS_REFRESH_TOKEN_ID))})

    def _write(self, name: str, content: bytes) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        (self.folder / name).write_bytes(content)
