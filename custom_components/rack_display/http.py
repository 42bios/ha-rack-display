"""Upload von Front- und Rückseitenbildern (nur Administratoren)."""

from __future__ import annotations

import uuid
from http import HTTPStatus
from pathlib import Path

from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import IMAGE_DIR, IMAGE_MAX_BYTES, IMAGE_TYPES, URL_FRONTEND, URL_IMAGES


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
        return self.json({"url": f"{URL_IMAGES}/{name}"})

    def _write(self, name: str, content: bytes) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        (self.folder / name).write_bytes(content)
