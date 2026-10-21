"""Block-Katalog und Gerätevorlagen (gemeinsame Quelle: blocks.json, wird auch ins Frontend gebaut).

Ein Gerät besteht in der Detailansicht aus einer Liste von Blöcken, z. B.
[{"type": "header"}, {"type": "ports"}, {"type": "chart", "source": "load", "label": "Last"}].
Blöcke ohne passende Daten werden in der Anzeige ausgelassen.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.helpers import config_validation as cv

CATALOG: dict[str, Any] = json.loads((Path(__file__).parent / "blocks.json").read_text(encoding="utf-8"))
# Community-Module (modules/<typ>/ im Repository, beim Bauen nach modules.json übernommen)
_MODULES = Path(__file__).parent / "modules.json"
if _MODULES.exists():
    CATALOG["blocks"].update(json.loads(_MODULES.read_text(encoding="utf-8")).get("blocks", {}))

BLOCK_SCHEMA = vol.Schema(
    {
        vol.Required("type"): vol.In(list(CATALOG["blocks"])),
        vol.Optional("size"): vol.In(["half", "full"]),
        vol.Optional("label"): cv.string,
        # Rolle (z. B. "load") oder Entitäts-ID (z. B. "sensor.x")
        vol.Optional("source"): cv.string,
        vol.Optional("entities", default=dict): {cv.string: vol.Any(None, cv.string)},
    },
    extra=vol.ALLOW_EXTRA,
)


def template_key(device: dict[str, Any]) -> str:
    tpl = device.get("template", "")
    if device.get("passive") or tpl in CATALOG["passive_templates"]:
        return "passive"
    return tpl if tpl in CATALOG["templates"] else "generic"


def default_blocks(device: dict[str, Any]) -> list[dict[str, Any]]:
    """Blöcke der Vorlage für ein Gerät (Teile einer Gruppe, z. B. Zusatzbatterie, haben keine eigenen)."""
    if device.get("group"):
        return []
    return [b if isinstance(b, dict) else {"type": b} for b in CATALOG["templates"][template_key(device)]]
