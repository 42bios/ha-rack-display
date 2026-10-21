"""Rack Display: Server-Racks zusammenstellen und live anzeigen.

Stellt bereit:
- Speicher für Racks und Geräte (.storage/rack_display.racks)
- WebSocket-Befehle für Anzeige und Editor
- Bild-Upload für Front- und Rückseiten
- die Seite „Rack“ in der Seitenleiste (Vollbild, auch für TouchKio-Displays)
- die Lovelace-Karte `rack-display-card` (wird global geladen)
"""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.const import Platform
from homeassistant.core import CoreState, Event, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from . import websocket_api
from .const import (
    SIGNAL_UPDATED,
    DOMAIN,
    EDITOR_COMPONENT,
    EDITOR_FILE,
    EDITOR_URL,
    FRONTEND_FILE,
    IMAGE_DIR,
    PANEL_COMPONENT,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL,
    URL_FRONTEND,
    URL_IMAGES,
)
from .http import FrontendView, ImageUploadView
from .live import LiveBuffer
from .screen import ScreenTimeout
from .entity import wanted_racks
from .storage import RackStore

PLATFORMS = [Platform.SENSOR, Platform.BINARY_SENSOR]

VERSION = "0.1.0"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = RackStore(hass)
    await store.async_load()
    live = LiveBuffer(hass, store)
    screen = ScreenTimeout(hass, store)
    hass.data[DOMAIN] = {"store": store, "live": live, "screen": screen}
    # Live-Puffer erst starten, wenn alle Integrationen ihre Entitäten angelegt haben
    if hass.state is CoreState.running:
        live.start()
        screen.start()
    else:
        @callback
        def _start(_event: Event) -> None:
            live.start()
            screen.start()

        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _start)

    # Zustand je Rack als HA-Entitäten; kommen Racks hinzu/weg (oder „HA-Entitäten“ wird umgeschaltet), neu laden
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    have = {r["id"] for r in wanted_racks(store)}

    @callback
    def _racks_changed(_rack_id: str | None) -> None:
        if {r["id"] for r in wanted_racks(store)} != have:
            hass.async_create_task(hass.config_entries.async_reload(entry.entry_id))

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_UPDATED, _racks_changed))

    image_dir = Path(hass.config.path(IMAGE_DIR))
    await hass.async_add_executor_job(lambda: image_dir.mkdir(parents=True, exist_ok=True))
    # Pfade, Ansichten und Befehle lassen sich pro HA-Lauf nur einmal registrieren
    if hass.data.get(f"{DOMAIN}_registered"):
        await _register_panel(hass)
        return True
    hass.data[f"{DOMAIN}_registered"] = True
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(URL_IMAGES, str(image_dir), True),
        ]
    )
    hass.http.register_view(FrontendView())
    hass.http.register_view(ImageUploadView(hass))
    websocket_api.async_register(hass)

    await _register_panel(hass)
    return True


def _build_version() -> str:
    """Version des eingespielten Frontends (frontend/version.txt), damit die Lader-Adresse je Stand neu ist."""
    try:
        return (Path(__file__).parent / "frontend" / "version.txt").read_text().strip() or VERSION
    except OSError:
        return VERSION


async def _register_panel(hass: HomeAssistant) -> None:
    build = await hass.async_add_executor_job(_build_version)
    hass.data[f"{DOMAIN}_module"] = module = f"{URL_FRONTEND}/{FRONTEND_FILE}?v={build}"
    # Karte in allen Dashboards verfügbar machen
    frontend.add_extra_js_url(hass, module)
    # Seite in der Seitenleiste (Anzeige für alle, Bearbeiten nur für Admins)
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL,
        webcomponent_name=PANEL_COMPONENT,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=module,
        require_admin=False,
        config={},
    )
    # Editor zum Aufbauen der Racks: nicht in der Seitenleiste, erreichbar über
    # Einstellungen → Integrationen → Rack Display → Konfigurieren (Link auf /rack-editor)
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=EDITOR_URL,
        webcomponent_name=EDITOR_COMPONENT,
        module_url=f"{URL_FRONTEND}/{EDITOR_FILE}?v={build}",
        require_admin=True,
        config={},
    )


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    frontend.async_remove_panel(hass, PANEL_URL)
    frontend.async_remove_panel(hass, EDITOR_URL)
    if module := hass.data.pop(f"{DOMAIN}_module", None):
        frontend.remove_extra_js_url(hass, module)
    if live := hass.data.get(DOMAIN, {}).get("live"):
        live.stop()
    if screen := hass.data.get(DOMAIN, {}).get("screen"):
        screen.stop()
    hass.data.pop(DOMAIN, None)  # "rack_display_registered" bleibt bis zum Neustart gesetzt
    return True
