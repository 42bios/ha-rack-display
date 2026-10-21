"""Binärsensor je Rack: an, sobald ein Gerät eine Störung meldet (für Automationen/Benachrichtigungen)."""

from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import RackEntity, wanted_racks


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, add: AddEntitiesCallback) -> None:
    store = hass.data[DOMAIN]["store"]
    add(ProblemSensor(hass, store, r["id"]) for r in wanted_racks(store))


class ProblemSensor(RackEntity, BinarySensorEntity):
    PLATFORM = "binary_sensor"
    _attr_device_class = BinarySensorDeviceClass.PROBLEM

    def __init__(self, hass, store, rack_id):
        super().__init__(hass, store, rack_id, "problem")

    @property
    def is_on(self):
        return self._status.get("state") == "problem"

    @property
    def extra_state_attributes(self):
        return {"problems": self._status.get("problems", [])}
