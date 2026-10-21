"""Speicher für Racks und ihre Belegung (.storage/rack_display.racks)."""

from __future__ import annotations

import copy
import uuid
from typing import Any

import voluptuous as vol

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .blocks import BLOCK_SCHEMA, default_blocks
from .const import SIGNAL_UPDATED, STORAGE_KEY, STORAGE_VERSION

DEVICE_SCHEMA = vol.Schema(
    {
        vol.Required("id"): cv.string,
        vol.Required("name"): cv.string,
        vol.Optional("model", default=""): cv.string,
        # Vorlage: server, switch, sfp, gw, nvr, ups, pdu, patch, ks, lwl, cm, bl, blank, shelf, fanpanel
        vol.Required("template"): cv.string,
        vol.Optional("u", default=0): vol.All(vol.Coerce(int), vol.Range(min=0, max=60)),
        vol.Optional("h", default=1): vol.All(vol.Coerce(int), vol.Range(min=1, max=12)),
        # front = in den Höheneinheiten, rear0u = Rückseite ohne HE (z. B. Stromleiste)
        vol.Optional("side", default="front"): vol.In(["front", "rear0u"]),
        vol.Optional("group"): vol.Any(None, cv.string),
        vol.Optional("passive", default=False): cv.boolean,
        vol.Optional("ha_devices", default=list): [cv.string],
        vol.Optional("roles", default=dict): {cv.string: vol.Any(None, cv.string)},
        vol.Optional("front_image"): vol.Any(None, cv.string),
        vol.Optional("rear_image"): vol.Any(None, cv.string),
        vol.Optional("options", default=dict): dict,
        # Aufbau der Detailansicht; fehlt die Liste, gilt die Vorlage
        vol.Optional("blocks"): [BLOCK_SCHEMA],
    },
    extra=vol.ALLOW_EXTRA,
)

RACK_SCHEMA = vol.Schema(
    {
        vol.Required("id"): cv.string,
        vol.Required("name"): cv.string,
        vol.Optional("units", default=42): vol.All(vol.Coerce(int), vol.Range(min=4, max=60)),
        vol.Optional("style", default=dict): dict,
        vol.Optional("zones", default=list): [dict],
        vol.Optional("power", default=dict): dict,
        vol.Optional("wled", default=dict): dict,
        vol.Optional("devices", default=list): [DEVICE_SCHEMA],
        vol.Optional("entities", default=True): bool,
    },
    extra=vol.ALLOW_EXTRA,
)


class RackStore:
    """Hält alle Racks im Speicher und schreibt Änderungen verzögert weg."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.racks: dict[str, dict[str, Any]] = {}

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self.racks = data.get("racks", {})
        # Umstellung auf Blöcke: Geräte ohne Blockliste bekommen die ihrer Vorlage
        migrated = False
        for rack in self.racks.values():
            for dev in rack.get("devices", []):
                if "blocks" not in dev:
                    dev["blocks"] = default_blocks(dev)
                    migrated = True
        if migrated:
            self._store.async_delay_save(lambda: {"racks": self.racks}, 1.0)

    @callback
    def _changed(self, rack_id: str | None) -> None:
        self._store.async_delay_save(lambda: {"racks": self.racks}, 1.0)
        async_dispatcher_send(self.hass, SIGNAL_UPDATED, rack_id)

    def list(self) -> list[dict[str, Any]]:
        return [copy.deepcopy(r) for r in self.racks.values()]

    def get(self, rack_id: str) -> dict[str, Any] | None:
        rack = self.racks.get(rack_id)
        return copy.deepcopy(rack) if rack else None

    @callback
    def save(self, rack: dict[str, Any]) -> dict[str, Any]:
        rack = dict(rack)
        rack.setdefault("id", uuid.uuid4().hex[:12])
        rack = RACK_SCHEMA(rack)
        for dev in rack["devices"]:
            dev.setdefault("blocks", default_blocks(dev))
        self._check_units(rack)
        self.racks[rack["id"]] = rack
        self._changed(rack["id"])
        return copy.deepcopy(rack)

    @callback
    def delete(self, rack_id: str) -> bool:
        if self.racks.pop(rack_id, None) is None:
            return False
        self._changed(rack_id)
        return True

    @staticmethod
    def _check_units(rack: dict[str, Any]) -> None:
        """Keine zwei Geräte in derselben Höheneinheit."""
        used: dict[int, str] = {}
        for dev in rack["devices"]:
            if dev["side"] != "front" or dev["u"] < 1:
                continue
            if dev["u"] + dev["h"] - 1 > rack["units"]:
                raise vol.Invalid(f"{dev['name']} ragt über HE {rack['units']} hinaus")
            for unit in range(dev["u"], dev["u"] + dev["h"]):
                if unit in used:
                    raise vol.Invalid(f"HE {unit} ist doppelt belegt ({used[unit]} / {dev['name']})")
                used[unit] = dev["name"]
