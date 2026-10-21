"""Gemeinsame Basis der Rack-Entitäten: ein HA-Gerät je Rack, Aktualisierung bei Zustandsänderungen."""

from __future__ import annotations

from typing import Any

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.event import async_track_state_change_event

from .const import DOMAIN, SIGNAL_UPDATED
from .status import rack_status


def wanted_racks(store) -> list[dict[str, Any]]:
    """Racks, für die Entitäten angelegt werden (Rack-Einstellung „HA-Entitäten“, Standard an)."""
    return [r for r in store.list() if r.get("entities", True)]


class RackEntity(Entity):
    PLATFORM = "sensor"
    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, hass: HomeAssistant, store, rack_id: str, key: str) -> None:
        self.hass, self._store, self._rack_id, self._key = hass, store, rack_id, key
        rack = store.get(rack_id) or {}
        self._attr_unique_id = f"{DOMAIN}_{rack_id}_{key}"
        # Englische, sprachunabhängige Entitäts-IDs (z. B. sensor.serverrack_faults), Anzeigename bleibt übersetzt
        slug = "".join(c if c.isalnum() else "_" for c in (rack.get("id") or rack_id).lower()).strip("_")
        self.entity_id = f"{self.PLATFORM}.{slug}_{key}"
        self._attr_translation_key = key
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, rack_id)}, name=rack.get("name") or rack_id, manufacturer="Rack Display", model=f"{rack.get('units', 42)} HE")
        self._status: dict[str, Any] = {}
        self._unsub_track = None

    async def async_added_to_hass(self) -> None:
        self._recompute(write=False)
        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL_UPDATED, self._rack_changed))
        self.async_on_remove(self._untrack)

    @callback
    def _untrack(self) -> None:
        if self._unsub_track:
            self._unsub_track()
            self._unsub_track = None

    @callback
    def _rack_changed(self, rack_id: str | None) -> None:
        if rack_id in (None, self._rack_id):
            self._recompute()

    @callback
    def _recompute(self, write: bool = True) -> None:
        rack = self._store.get(self._rack_id)
        if not rack:
            return
        self._status = rack_status(self.hass, rack)
        self._untrack()
        if self._status["watch"]:
            self._unsub_track = async_track_state_change_event(self.hass, self._status["watch"], self._state_changed)
        if write:
            self.async_write_ha_state()

    @callback
    def _state_changed(self, _event: Event) -> None:
        rack = self._store.get(self._rack_id)
        if rack:
            self._status = rack_status(self.hass, rack)
            self.async_write_ha_state()
