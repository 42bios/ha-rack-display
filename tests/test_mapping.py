"""Automatic assignment of entities to roles, ports and outlets."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from custom_components.rack_display.mapping import resolve

from .conftest import Registry


async def test_ups_roles(hass: HomeAssistant, registry: Registry) -> None:
    ups = registry.device("ups")
    registry.entity(ups, "sensor.ups_battery_charge", "100")
    registry.entity(ups, "sensor.ups_runtime", "45")
    registry.entity(ups, "sensor.ups_output_load", "23")
    registry.entity(ups, "sensor.ups_input_voltage", "231")
    registry.entity(ups, "sensor.ups_battery_temperature", "27", "temperature")
    registry.entity(ups, "binary_sensor.ups_on_battery", "off", "problem")

    result = resolve(hass, [ups])

    assert result["roles"] == {
        "battery": "sensor.ups_battery_charge",
        "runtime": "sensor.ups_runtime",
        "load": "sensor.ups_output_load",
        "input_voltage": "sensor.ups_input_voltage",
        "battery_temp": "sensor.ups_battery_temperature",
    }
    assert result["problems"] == ["binary_sensor.ups_on_battery"]


async def test_switch_ports_and_outlets(hass: HomeAssistant, registry: Registry) -> None:
    switch = registry.device("switch")
    registry.entity(switch, "sensor.switch_port_2_link_speed", "1000")
    registry.entity(switch, "sensor.switch_port_1_link_speed", "1000")
    registry.entity(switch, "sensor.switch_port_1_poe_power", "4.2")
    registry.entity(switch, "sensor.switch_port_1_rx", "12")
    registry.entity(switch, "sensor.switch_port_1_tx", "3")
    registry.entity(switch, "sensor.switch_sfp_1_link_speed", "10000")
    registry.entity(switch, "switch.switch_outlet_2", "on")
    registry.entity(switch, "switch.switch_outlet_1", "on")

    result = resolve(hass, [switch])

    assert result["ports"] == [
        {
            "kind": "rj45",
            "n": 1,
            "speed": "sensor.switch_port_1_link_speed",
            "poe": "sensor.switch_port_1_poe_power",
            "rx": "sensor.switch_port_1_rx",
            "tx": "sensor.switch_port_1_tx",
        },
        {"kind": "rj45", "n": 2, "speed": "sensor.switch_port_2_link_speed"},
        {"kind": "sfp", "n": 1, "speed": "sensor.switch_sfp_1_link_speed"},
    ]
    assert result["outlets"] == {"1": "switch.switch_outlet_1", "2": "switch.switch_outlet_2"}
    # port values are not reused for general roles
    assert "power" not in result["roles"]


async def test_temperature_needs_device_class(hass: HomeAssistant, registry: Registry) -> None:
    server = registry.device("server")
    registry.entity(server, "sensor.server_fan_temperature", "55")
    registry.entity(server, "sensor.server_board", "40", "temperature")

    assert resolve(hass, [server])["roles"]["temperature"] == "sensor.server_board"


async def test_load_state_is_not_the_device_state(hass: HomeAssistant, registry: Registry) -> None:
    pdu = registry.device("pdu")
    registry.entity(pdu, "sensor.pdu_load_state", "normal")

    assert "state" not in resolve(hass, [pdu])["roles"]

    registry.entity(pdu, "sensor.pdu_state", "connected")
    assert resolve(hass, [pdu])["roles"]["state"] == "sensor.pdu_state"


async def test_prefers_entity_with_a_value(hass: HomeAssistant, registry: Registry) -> None:
    """Two integrations for one device: the entity that reports a value wins."""
    ups = registry.device("ups")
    registry.entity(ups, "sensor.ups_a_runtime", "unavailable")
    registry.entity(ups, "sensor.ups_b_runtime", "45")

    assert resolve(hass, [ups])["roles"]["runtime"] == "sensor.ups_b_runtime"


async def test_overrides(hass: HomeAssistant, registry: Registry) -> None:
    ups = registry.device("ups")
    registry.entity(ups, "sensor.ups_battery_charge", "100")
    registry.entity(ups, "sensor.ups_runtime", "45")

    roles = resolve(hass, [ups], {"battery": None, "load": "sensor.elsewhere"})["roles"]

    assert roles == {"runtime": "sensor.ups_runtime", "load": "sensor.elsewhere"}


async def test_cameras_of_a_recorder(hass: HomeAssistant, registry: Registry) -> None:
    nvr = registry.device("nvr")
    camera = registry.device("camera", via="nvr")
    registry.entity(camera, "camera.door_high_resolution_channel", "idle")
    registry.entity(camera, "camera.door_low_resolution_channel", "idle")
    registry.entity(camera, "binary_sensor.door_object_detected", "off")

    result = resolve(hass, [nvr])

    assert result["cameras"] == ["camera.door_high_resolution_channel"]
    assert result["detections"] == ["binary_sensor.door_object_detected"]
