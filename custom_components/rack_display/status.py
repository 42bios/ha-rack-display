"""Zustand eines Racks für HA-Entitäten (gleiche Regeln wie die Anzeige).

Je Gerät: Störung, wenn alle Werte fehlen, das Gerät nicht erreichbar ist, ein Problem-Sensor
meldet oder die Temperatur ≥ 95 °C ist; Warnung ab 85 °C. Geräte mit „nicht immer eingeschaltet“
zählen im ausgeschalteten Zustand nicht.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .mapping import resolve

TEMP_WARN, TEMP_ALERT = 85.0, 95.0
PASSIVE = {"ks", "lwl", "cm", "bl", "frame", "patch", "blank", "shelf"}
OFF_STATES = {"not_home", "off", "offline", "disconnected"}
ON_STATES = {"connected", "online", "on", "home"}


def _ok(hass: HomeAssistant, eid: str | None) -> bool:
    s = eid and hass.states.get(eid)
    return bool(s) and s.state not in ("unavailable", "unknown")


def _num(hass: HomeAssistant, eid: str | None) -> float | None:
    s = eid and hass.states.get(eid)
    try:
        return float(s.state) if s else None
    except (TypeError, ValueError):
        return None


def device_status(hass: HomeAssistant, dev: dict[str, Any]) -> dict[str, Any] | None:
    """Zustand eines Geräts oder None (passiv / ohne HA-Verknüpfung / ausgeschaltet)."""
    if dev.get("passive") or dev.get("template") in PASSIVE or dev.get("group"):
        return None
    if not dev.get("ha_devices") and not dev.get("roles"):
        return None
    m = resolve(hass, dev.get("ha_devices", []), dev.get("roles"))
    roles = {k: v for k, v in (m.get("roles") or {}).items() if v}
    opts = dev.get("options") or {}
    state_id = roles.get("state")
    out = {"name": dev.get("name") or dev.get("id"), "state": "ok", "messages": [], "temperature": None}
    if opts.get("sometimes_off"):
        trk = hass.states.get(state_id) if state_id and state_id.split(".")[0] in ("device_tracker", "binary_sensor", "switch") else None
        vals = [v for v in roles.values() if v != state_id]
        if (trk and trk.state in OFF_STATES) or (vals and not any(_ok(hass, v) for v in vals)):
            return {**out, "state": "off"}

    def add(level: str, text: str) -> None:
        out["messages"].append(f"{out['name']}: {text}")
        if level == "alert" or out["state"] == "ok":
            out["state"] = level

    if roles and not any(_ok(hass, v) for v in roles.values()):
        add("alert", "keine Werte")
    if state_id and _ok(hass, state_id) and hass.states.get(state_id).state not in ON_STATES:
        add("alert", "nicht erreichbar")
    for p in m.get("problems") or []:
        s = hass.states.get(p)
        if s and s.state == "on":
            add("alert", s.attributes.get("friendly_name") or p)
    temp = _num(hass, roles.get("cpu_temp")) if roles.get("cpu_temp") else _num(hass, roles.get("temperature"))
    if temp is not None:
        out["temperature"] = temp
        if temp >= TEMP_ALERT:
            add("alert", f"Temperatur {temp:.0f} °C")
        elif temp >= TEMP_WARN:
            add("warn", f"Temperatur {temp:.0f} °C")
    out["watch"] = sorted({*roles.values(), *(m.get("problems") or [])})
    return out


def rack_status(hass: HomeAssistant, rack: dict[str, Any]) -> dict[str, Any]:
    devs = [s for d in rack.get("devices", []) if (s := device_status(hass, d))]
    active = [s for s in devs if s["state"] != "off"]
    alerts = [msg for s in active if s["state"] == "alert" for msg in s["messages"]]
    warns = [msg for s in active if s["state"] == "warn" for msg in s["messages"]]
    hot = max((s for s in active if s["temperature"] is not None), key=lambda s: s["temperature"], default=None)
    return {
        "state": "problem" if alerts else "warning" if warns else "ok",
        "problems": alerts,
        "warnings": warns,
        "faulty_devices": sum(1 for s in active if s["state"] == "alert"),
        "warning_devices": sum(1 for s in active if s["state"] == "warn"),
        "active_devices": len(active),
        "off_devices": [s["name"] for s in devs if s["state"] == "off"],
        "hottest": hot and {"name": hot["name"], "temperature": hot["temperature"]},
        "watch": sorted({e for s in devs for e in s.get("watch", [])} | {v for d in rack.get("devices", []) for v in ((d.get("roles") or {}).values()) if v}),
    }
