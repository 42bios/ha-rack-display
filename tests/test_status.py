"""Rack state for the Home Assistant entities."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from custom_components.rack_display.status import device_status, rack_status


def _device(name: str, roles: dict[str, str], **extra: Any) -> dict[str, Any]:
    return {"id": name, "name": name, "template": "server", "roles": roles, **extra}


async def test_ok(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.srv_temp", "40")
    status = device_status(hass, _device("srv", {"temperature": "sensor.srv_temp"}))

    assert status["state"] == "ok"
    assert status["temperature"] == 40
    assert status["watch"] == ["sensor.srv_temp"]


async def test_temperature_thresholds(hass: HomeAssistant) -> None:
    dev = _device("srv", {"temperature": "sensor.srv_temp"})

    hass.states.async_set("sensor.srv_temp", "85")
    assert device_status(hass, dev)["state"] == "warn"

    hass.states.async_set("sensor.srv_temp", "95")
    assert device_status(hass, dev)["state"] == "alert"


async def test_cpu_temperature_wins(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.srv_temp", "30")
    hass.states.async_set("sensor.srv_cpu_temp", "90")
    dev = _device("srv", {"temperature": "sensor.srv_temp", "cpu_temp": "sensor.srv_cpu_temp"})

    assert device_status(hass, dev)["temperature"] == 90


async def test_no_values_is_a_fault(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.srv_temp", "unavailable")

    assert device_status(hass, _device("srv", {"temperature": "sensor.srv_temp"}))["state"] == "alert"


async def test_unreachable_is_a_fault(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.srv_state", "disconnected")
    hass.states.async_set("sensor.srv_temp", "40")
    dev = _device("srv", {"state": "sensor.srv_state", "temperature": "sensor.srv_temp"})

    assert device_status(hass, dev)["state"] == "alert"


async def test_passive_and_unlinked_devices_are_ignored(hass: HomeAssistant) -> None:
    assert device_status(hass, {"id": "p", "name": "Patch", "template": "patch"}) is None
    assert device_status(hass, {"id": "s", "name": "Server", "template": "server"}) is None
    assert device_status(hass, _device("srv", {"temperature": "sensor.x"}, passive=True)) is None


async def test_switched_off_device_is_still_watched(hass: HomeAssistant) -> None:
    hass.states.async_set("device_tracker.srv", "not_home")
    hass.states.async_set("sensor.srv_temp", "unavailable")
    dev = _device(
        "srv",
        {"state": "device_tracker.srv", "temperature": "sensor.srv_temp"},
        options={"sometimes_off": True},
    )

    status = device_status(hass, dev)
    assert status["state"] == "off"
    assert status["watch"] == ["device_tracker.srv", "sensor.srv_temp"]

    rack = rack_status(hass, {"devices": [dev]})
    assert rack["state"] == "ok"
    assert rack["off_devices"] == ["srv"]
    assert rack["active_devices"] == 0
    assert "device_tracker.srv" in rack["watch"]

    hass.states.async_set("device_tracker.srv", "home")
    hass.states.async_set("sensor.srv_temp", "40")
    assert device_status(hass, dev)["state"] == "ok"


async def test_rack_status(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.a_temp", "40")
    hass.states.async_set("sensor.b_temp", "88")
    hass.states.async_set("sensor.c_temp", "97")
    rack = {
        "devices": [
            _device("a", {"temperature": "sensor.a_temp"}),
            _device("b", {"temperature": "sensor.b_temp"}),
            _device("c", {"temperature": "sensor.c_temp"}),
        ]
    }

    status = rack_status(hass, rack)

    assert status["state"] == "problem"
    assert status["faulty_devices"] == 1
    assert status["warning_devices"] == 1
    assert status["active_devices"] == 3
    assert status["hottest"] == {"name": "c", "temperature": 97}
    assert len(status["problems"]) == 1
    assert len(status["warnings"]) == 1
    assert status["watch"] == ["sensor.a_temp", "sensor.b_temp", "sensor.c_temp"]
