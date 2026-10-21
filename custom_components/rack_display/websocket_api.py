"""WebSocket-Befehle für Karte, Vollbild-Seite und Editor."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .blocks import CATALOG
from .const import DOMAIN, SIGNAL_UPDATED
from .mapping import resolve


def _store(hass: HomeAssistant):
    return hass.data[DOMAIN]["store"]


def _entity_label(reg: er.EntityRegistry, entity_id: str) -> str | None:
    """Name einer Entität ohne vorangestellten Gerätenamen (wie HA ihn in Dashboards zeigt)."""
    entry = reg.async_get(entity_id)
    return (entry.name or entry.original_name) if entry else None


def _with_mapping(hass: HomeAssistant, rack: dict[str, Any]) -> dict[str, Any]:
    """Ergänzt jedes Gerät um die aufgelösten Entitäten (Rollen, Ports, Ausgänge …) und
    die Kurznamen der Entitäten, die in frei belegten Modulen stehen."""
    reg = er.async_get(hass)
    for dev in rack.get("devices", []):
        dev["map"] = resolve(hass, dev.get("ha_devices", []), dev.get("roles")) if dev.get("ha_devices") or dev.get("roles") else None
        ids = {i for b in dev.get("blocks", []) for i in [*b.get("items", []), b.get("source") or ""] if "." in i}
        if ids:
            dev["labels"] = {i: label for i in ids if (label := _entity_label(reg, i))}
    return rack


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/live", vol.Required("entity_ids"): [str]})
@callback
def ws_live(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Letzte Messwerte aus dem Live-Puffer (Zeitstempel in Sekunden, Wert)."""
    live = hass.data.get(DOMAIN, {}).get("live")
    connection.send_result(msg["id"], live.get(msg["entity_ids"]) if live else {})


def async_register(hass: HomeAssistant) -> None:
    for cmd in (ws_racks, ws_rack_save, ws_rack_delete, ws_resolve, ws_subscribe, ws_live):
        websocket_api.async_register_command(hass, cmd)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/racks"})
@callback
def ws_racks(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Alle Racks inklusive aufgelöster Entitäten (für Anzeige und Editor)."""
    racks = [_with_mapping(hass, r) for r in _store(hass).list()]
    connection.send_result(msg["id"], {"racks": racks, "catalog": CATALOG})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/rack/save", vol.Required("rack"): dict})
@websocket_api.require_admin
@callback
def ws_rack_save(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    try:
        rack = _store(hass).save(msg["rack"])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    connection.send_result(msg["id"], {"rack": _with_mapping(hass, rack)})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/rack/delete", vol.Required("rack_id"): str})
@websocket_api.require_admin
@callback
def ws_rack_delete(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    connection.send_result(msg["id"], {"deleted": _store(hass).delete(msg["rack_id"])})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/resolve",
        vol.Required("ha_devices"): [str],
        vol.Optional("roles", default=dict): dict,
    }
)
@websocket_api.require_admin
@callback
def ws_resolve(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Vorschau im Editor: welche Entitäten würden einem Gerät zugeordnet?"""
    connection.send_result(msg["id"], resolve(hass, msg["ha_devices"], msg["roles"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@callback
def ws_subscribe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Meldet Änderungen an Racks, damit Karte und Display ohne Neuladen aktualisieren."""

    @callback
    def forward(rack_id: str | None) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], {"rack_id": rack_id}))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_UPDATED, forward)
    connection.send_result(msg["id"])
