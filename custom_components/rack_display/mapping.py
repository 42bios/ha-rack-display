"""Ordnet die Entitäten eines HA-Geräts automatisch Rollen zu (Temperatur, CPU, Ports …).

Die Regeln arbeiten mit Geräteklasse, Einheit und Entity-ID. Sie decken die gängigen
Integrationen ab (UniFi, UniFi Network Plus, UniFi Protect, APC, System Monitor) und
fallen bei unbekannten Geräten auf allgemeine Rollen zurück. Jede Rolle lässt sich im
Editor von Hand überschreiben.
"""

from __future__ import annotations

import re
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

# (Rolle, Domain, Muster auf die Objekt-ID, erlaubte Einheiten/Geräteklassen oder None)
# Reihenfolge = Priorität; die erste passende Entität gewinnt.
ROLE_RULES: list[tuple[str, str, str, set[str] | None]] = [
    # USV
    ("battery", "sensor", r"ladezustand|battery_charge|battery_level|batteriestand", None),
    ("runtime", "sensor", r"restlaufzeit|runtime", None),
    ("load", "sensor", r"ausgangslast|ups_load|output_load", None),
    ("input_voltage", "sensor", r"eingangsspannung|input_voltage", None),
    ("output_voltage", "sensor", r"ausgangsspannung|output_voltage", None),
    ("output_current", "sensor", r"ausgangsstrom|output_current", None),
    ("input_frequency", "sensor", r"eingangsfrequenz|input_frequency", None),
    ("source", "sensor", r"ausgangsquelle|output_source", None),
    ("battery_temp", "sensor", r"batterietemperatur|battery_temp", None),
    ("battery_voltage", "sensor", r"batteriespannung|battery_voltage", None),
    ("nmc_model", "sensor", r"(^|_)modellnummer$|_model_number$|(^|_)netzwerkkarte$|_network_card_model$", None),
    ("selftest", "sensor", r"selbsttest|self_test", None),
    ("battery_replace", "sensor", r"battery_replace|batterie_austausch|batterie_eingebaut|battery_installed", None),
    ("alarms", "sensor", r"alarme|alarms", None),
    ("on_battery_seconds", "sensor", r"sekunden_auf_batterie|seconds_on_battery|zeit_auf_batterie|time_on_battery", None),
    # Stromleiste
    ("power", "sensor", r"pdu_last_watt|(^|_)leistung$|(?<!phase)(?<!peak)(?<!apparent)_power$", None),
    ("current", "sensor", r"phasenstrom|phase_current", None),
    ("voltage", "sensor", r"phasenspannung|phase_voltage", None),
    ("energy", "sensor", r"pdu_energie|pdu_energy|(^|_)energie$|_energy$", None),
    ("peak_power", "sensor", r"spitzenleistung|peak_power", None),
    # Rekorder
    ("storage", "sensor", r"storage_utilization|speicherauslastung_platte|massenspeicher_auslastung|disk_use_percent", None),
    ("recording", "sensor", r"recording_capacity", None),
    # Netzwerk
    ("wan_down", "sensor", r"_wan_download$", None),
    ("wan_up", "sensor", r"_wan_upload$", None),
    ("wan_loss", "sensor", r"_wan_paketverlust$|_wan_packet_loss$", None),
    ("wan_avail", "sensor", r"_wan_verfugbarkeit$|_wan_availability$", None),
    ("wan_drops", "sensor", r"_wan_abbruche$|_wan_drops$", None),
    ("isp", "sensor", r"internetanbieter|_isp$", None),
    ("latency", "sensor", r"cloudflare_wan_latency|google_wan_latency|wan_latency", None),
    ("clients", "sensor", r"(^|_)clients(_\d+)?$", None),
    ("active_ports", "sensor", r"aktive_ports|active_ports", None),
    ("poe_total", "sensor", r"_poe_(leistung|power)$", None),  # Port-Werte sind vorher schon vergeben
    ("satisfaction", "sensor", r"zufriedenheit|satisfaction", None),
    # Allgemein
    ("cpu_temp", "sensor", r"cpu_temp|prozessortemperatur|processor_temperature", {"temperature"}),
    ("temperature", "sensor", r".", {"temperature"}),
    ("cpu", "sensor", r"cpu_utilization|cpu_auslastung|(^|_)cpu$|prozessor(_auslastung)?$|prozessornutzung|processor_use", None),
    ("ram", "sensor", r"memory_utilization|speicherauslastung|arbeitsspeicher|memory_use", None),
    ("power", "sensor", r".", {"power"}),
    ("uptime", "sensor", r"uptime|betriebszeit|systemlaufzeit", None),
    # Verbindungs-/Gerätezustand; Lastzustände (z. B. apc_rack_power load_state) sind keiner
    ("state", "sensor", r"(^|_)(?<!load_)(state|zustand)$", None),
    ("firmware", "update", r".", None),
]

# Einmal kompiliert (resolve läuft bei jeder Abfrage der Anzeige)
ROLE_RX = [(role, domain, re.compile(pattern), classes) for role, domain, pattern, classes in ROLE_RULES]

PORT_RE = [
    # Linkgeschwindigkeit (UniFi: link_speed, UniFi Network Plus: verbindungsgeschwindigkeit)
    (re.compile(r"_port_(\d+)_(link_speed|verbindungsgeschwindigkeit)$"), "rj45", "speed"),
    (re.compile(r"_sfp_(\d+)_(link_speed|verbindungsgeschwindigkeit)$"), "sfp", "speed"),
    (re.compile(r"_sfp28_(\d+)_(link_speed|verbindungsgeschwindigkeit)$"), "sfp28", "speed"),
    (re.compile(r"_port_(\d+)_poe_power$"), "rj45", "poe"),
    (re.compile(r"_port_(\d+)_poe$"), "rj45", "poe_switch"),
    # Durchsatz je Port (rx = Download, tx = Upload)
    (re.compile(r"_port_(\d+)_(rx|download)$"), "rj45", "rx"),
    (re.compile(r"_port_(\d+)_(tx|upload)$"), "rj45", "tx"),
    (re.compile(r"_sfp_(\d+)_(rx|download)$"), "sfp", "rx"),
    (re.compile(r"_sfp_(\d+)_(tx|upload)$"), "sfp", "tx"),
    (re.compile(r"_sfp28_(\d+)_(rx|download)$"), "sfp28", "rx"),
    (re.compile(r"_sfp28_(\d+)_(tx|upload)$"), "sfp28", "tx"),
]
OUTLET_RE = re.compile(r"_outlet_(\d+)$")
DISK_RE = re.compile(r"_(hdd|ssd|disk)_(\d+)$")
REC_TYPE_RE = re.compile(r"_type_([a-z]+)_video$")


def _meta(hass: HomeAssistant, entry: er.RegistryEntry) -> tuple[str | None, str | None]:
    state = hass.states.get(entry.entity_id)
    attrs = state.attributes if state else {}
    dclass = attrs.get("device_class") or entry.device_class or entry.original_device_class
    unit = attrs.get("unit_of_measurement") or entry.unit_of_measurement
    return dclass, unit


def _has_value(hass: HomeAssistant, entity_id: str) -> bool:
    state = hass.states.get(entity_id)
    if state is None or state.state in ("unknown", "unavailable", ""):
        return False
    try:
        return float(state.state) != 0
    except ValueError:
        return True


def resolve(hass: HomeAssistant, device_ids: list[str], overrides: dict[str, Any] | None = None) -> dict[str, Any]:
    """Liefert die Rollen-Zuordnung für ein oder mehrere HA-Geräte."""
    reg = er.async_get(hass)
    entries = [
        e
        for did in device_ids
        for e in er.async_entries_for_device(reg, did)
        if not e.disabled_by
    ]
    entries.sort(key=lambda e: e.entity_id)

    roles: dict[str, str] = {}
    ports: dict[str, dict[str, Any]] = {}
    outlets: dict[int, str] = {}
    disks: list[str] = []
    rec_types: dict[str, str] = {}
    problems: list[str] = []
    used: set[str] = set()

    for e in entries:
        domain, obj = e.entity_id.split(".", 1)
        if domain == "binary_sensor":
            dclass, _ = _meta(hass, e)
            if DISK_RE.search(obj):
                disks.append(e.entity_id)
                used.add(e.entity_id)
            elif dclass == "problem":
                problems.append(e.entity_id)
                used.add(e.entity_id)
            continue
        for rx, kind, field in PORT_RE:
            if (m := rx.search(obj)) and domain in ("sensor", "switch"):
                key = f"{kind}{m.group(1)}"
                ports.setdefault(key, {"kind": kind, "n": int(m.group(1))})[field] = e.entity_id
                used.add(e.entity_id)
                break
        if e.entity_id in used:
            continue
        if domain == "switch" and (m := OUTLET_RE.search(obj)):
            outlets[int(m.group(1))] = e.entity_id
            used.add(e.entity_id)
            continue
        if domain == "sensor" and (m := REC_TYPE_RE.search(obj)):
            rec_types[m.group(1)] = e.entity_id
            used.add(e.entity_id)

    for role, domain, rx, classes in ROLE_RX:
        if role in roles:
            continue
        candidates = []
        for e in entries:
            if e.entity_id in used:
                continue
            dom, obj = e.entity_id.split(".", 1)
            if dom != domain or not rx.search(obj):
                continue
            if classes is not None:
                if _meta(hass, e)[0] not in classes:
                    continue
            candidates.append(e.entity_id)
        if candidates:
            # Bei mehreren Treffern (z. B. zwei Integrationen für ein Gerät) die mit echtem Wert nehmen
            best = next((c for c in candidates if _has_value(hass, c)), candidates[0])
            roles[role] = best
            used.add(best)

    # Angeschlossene Geräte (z. B. Kameras am Rekorder: via_device = dieses Gerät)
    cameras: list[str] = []
    detections: list[str] = []
    dev_reg = dr.async_get(hass)
    children = [d.id for d in dev_reg.devices if d.via_device_id in device_ids]
    for cid in children:
        for e in er.async_entries_for_device(reg, cid):
            if e.disabled_by:
                continue
            if e.domain == "camera" and not e.entity_id.endswith(("_package_camera", "_low_resolution_channel", "_medium_resolution_channel")):
                cameras.append(e.entity_id)
            elif e.domain == "binary_sensor" and e.entity_id.endswith("_object_detected"):
                detections.append(e.entity_id)

    for role, entity_id in (overrides or {}).items():
        if entity_id:
            roles[role] = entity_id
        else:
            roles.pop(role, None)

    return {
        "roles": roles,
        "ports": sorted(ports.values(), key=lambda p: (["rj45", "sfp", "sfp28"].index(p["kind"]), p["n"])),
        "outlets": {str(k): v for k, v in sorted(outlets.items())},
        "disks": disks,
        "rec_types": rec_types,
        "problems": problems,
        **({"cameras": sorted(cameras), "detections": sorted(detections)} if cameras else {}),
    }
