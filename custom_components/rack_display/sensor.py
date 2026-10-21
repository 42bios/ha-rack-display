"""Sensoren je Rack: Zustand, Anzahl Störungen/Warnungen, wärmstes Gerät."""

from __future__ import annotations

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import RackEntity, wanted_racks


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, add: AddEntitiesCallback) -> None:
    store = hass.data[DOMAIN]["store"]
    add(e for r in wanted_racks(store) for e in (StateSensor(hass, store, r["id"]), CountSensor(hass, store, r["id"], "faults"),
        CountSensor(hass, store, r["id"], "warnings"), HottestSensor(hass, store, r["id"])))


class StateSensor(RackEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = ["ok", "warning", "problem"]
    _attr_icon = "mdi:server"

    def __init__(self, hass, store, rack_id):
        super().__init__(hass, store, rack_id, "state")

    @property
    def native_value(self):
        return self._status.get("state")

    @property
    def extra_state_attributes(self):
        s = self._status
        return {"problems": s.get("problems", []), "warnings": s.get("warnings", []), "active_devices": s.get("active_devices"), "switched_off": s.get("off_devices", [])}


class CountSensor(RackEntity, SensorEntity):
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, hass, store, rack_id, key):
        super().__init__(hass, store, rack_id, key)
        self._attr_icon = "mdi:alert-circle" if key == "faults" else "mdi:alert"

    @property
    def native_value(self):
        return self._status.get("faulty_devices" if self._key == "faults" else "warning_devices", 0)


class HottestSensor(RackEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, hass, store, rack_id):
        super().__init__(hass, store, rack_id, "hottest")

    @property
    def native_value(self):
        h = self._status.get("hottest")
        return h and h["temperature"]

    @property
    def extra_state_attributes(self):
        h = self._status.get("hottest")
        return {"device": h and h["name"]}
