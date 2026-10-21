"""Konstanten für Rack Display."""

DOMAIN = "rack_display"

STORAGE_KEY = f"{DOMAIN}.racks"
STORAGE_VERSION = 1

# Statische Pfade
URL_FRONTEND = "/rack_display/frontend"
URL_IMAGES = "/rack_display/images"
FRONTEND_FILE = "rack-display.js"

# Seitenleiste
PANEL_URL = "rack"
PANEL_TITLE = "Rack"
PANEL_ICON = "mdi:server"
PANEL_COMPONENT = "rack-display-panel"

# Editor (nur Administratoren)
EDITOR_URL = "rack-editor"
EDITOR_COMPONENT = "rack-display-editor"
EDITOR_FILE = "rack-editor.js"

# Ereignis, wenn sich ein Rack geändert hat (Karte/Panel laden neu)
SIGNAL_UPDATED = f"{DOMAIN}_updated"

IMAGE_DIR = "rack_display/images"
IMAGE_MAX_BYTES = 8 * 1024 * 1024
IMAGE_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
