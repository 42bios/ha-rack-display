/* Rack Display – Oberfläche für Panel, Karte und Kiosk.
   Dieser Teil ist neu geschrieben (Daten aus Home Assistant). Die Darstellungsfunktionen
   (Rack, Fronten, Kacheln, Diagramme) stehen in render.js und werden beim Build eingesetzt:
*/
const RD_BASE = "/rack_display/frontend";
const RD_VERSION = "1794923008";
// Katalog aus blocks.json; Texte sind beim Build markiert und werden je Sprache aufgelöst (rdCatalog())
const RD_CATALOG_RAW = {"version": 1, "blocks": {"header": {"name": "\u0001header", "size": "full", "desc": "\u0001name_model_position_front_image_up_to_4_key", "items": true, "group": "kopf"}, "tiles": {"name": "\u0001current_values", "size": "full", "desc": "\u0001tiles_with_the_key_measurements", "group": "werte"}, "values": {"name": "\u0001values", "size": "full", "desc": "\u0001any_entities_as_tiles", "items": true, "group": "werte"}, "entity": {"name": "\u0001single_value", "size": "half", "desc": "\u0001one_value_as_its_own_tile_optionally_with_a_24", "items": true, "group": "werte"}, "bars": {"name": "\u0001bars", "size": "half", "desc": "\u0001load_as_bars_0100_or_custom_range", "items": true, "group": "werte"}, "status": {"name": "Status", "size": "half", "desc": "\u0001states_as_a_list_with_traffic_lights", "items": true, "group": "zustand"}, "ports": {"name": "Ports", "size": "full", "desc": "\u0001all_ports_with_speed_poe_and_live_throughput", "group": "netzwerk"}, "poe": {"name": "PoE", "size": "half", "desc": "\u0001poe_power_in_total_and_per_port", "group": "netzwerk"}, "system": {"name": "System", "size": "half", "desc": "\u0001cpu_ram_and_temperature_over_24_h", "slots": ["cpu", "ram", "cpu_temp"], "group": "system"}, "internet": {"name": "Internet", "size": "half", "desc": "\u0001download_and_upload_over_24_h", "slots": ["wan_down", "wan_up"], "group": "netzwerk"}, "flow": {"name": "\u0001energy_flow", "size": "full", "desc": "\u0001online_ups_mains_battery_load", "group": "strom"}, "voltage": {"name": "\u0001voltage", "size": "half", "desc": "\u0001input_and_output_voltage_over_24_h", "slots": ["input_voltage", "output_voltage"], "group": "strom"}, "chart": {"name": "\u0001history_2", "size": "half", "desc": "\u0001one_to_three_measurements_over_24_h", "slots": ["source"], "items": true, "group": "diagramme"}, "outlets": {"name": "\u0001outlets", "size": "full", "desc": "\u0001outlets_of_a_pdu_with_assignments", "group": "strom"}, "disks": {"name": "\u0001disks", "size": "full", "desc": "\u0001bays_state_and_usage", "group": "speicher"}, "recording": {"name": "\u0001recording_2", "size": "half", "desc": "\u0001retention_recording_types_cameras", "group": "speicher"}, "messages": {"name": "\u0001messages", "size": "full", "desc": "\u0001faults_notices_and_info_of_the_device", "group": "sonstiges"}, "note": {"name": "\u0001note", "size": "full", "desc": "\u0001free_text_e_g_patch_panel_assignments", "group": "sonstiges"}, "gauge": {"name": "\u0001gauge", "size": "half", "desc": "\u0001one_value_as_a_semicircle_gauge_with_min_max", "items": true, "group": "werte"}, "ring": {"name": "Ring", "size": "half", "desc": "\u0001one_value_as_a_ring_e_g_load_in", "items": true, "group": "werte"}, "stat": {"name": "\u0001key_figure_2", "size": "half", "desc": "\u0001big_number_with_change_vs_yesterday", "items": true, "group": "werte"}, "progress": {"name": "\u0001progress", "size": "half", "desc": "\u0001one_value_as_a_bar_with_min_max", "items": true, "group": "werte"}, "histogram": {"name": "\u0001bar_chart", "size": "half", "desc": "\u0001hourly_values_of_the_last_24_h_as_bars", "items": true, "group": "diagramme"}, "chips": {"name": "\u0001status_chips", "size": "full", "desc": "\u0001several_states_as_compact_chips_with_traffic", "items": true, "group": "zustand"}, "switch": {"name": "\u0001switches_2", "size": "half", "desc": "\u0001control_switches_lights_and_fans_directly", "items": true, "group": "steuerung"}, "button": {"name": "\u0001actions", "size": "half", "desc": "\u0001run_scripts_scenes_and_buttons", "items": true, "group": "steuerung"}, "camera": {"name": "\u0001camera", "size": "half", "desc": "\u0001camera_still_image_refreshes_continuously", "items": true, "group": "speicher"}, "heading": {"name": "\u0001heading", "size": "full", "desc": "\u0001title_with_subtitle_for_structure", "group": "sonstiges"}, "clock": {"name": "\u0001clock", "size": "half", "desc": "\u0001time_and_date", "group": "sonstiges"}, "ov_power": {"name": "\u0001power_overview", "size": "full", "desc": "\u0001rack_power_ups_battery_consumers_and_24_h", "group": "uebersicht"}, "ov_temp": {"name": "\u0001temperature_overview", "size": "full", "desc": "\u0001warmest_device_and_temperatures_of_all_devices", "group": "uebersicht"}, "ov_hints": {"name": "\u0001notices_overview", "size": "full", "desc": "\u0001warnings_and_faults_of_all_devices", "group": "uebersicht"}, "ov_stats": {"name": "\u0001key_figure_bar", "size": "full", "desc": "\u0001internet_poe_pdu_ups_at_a_glance", "group": "uebersicht"}, "bays": {"name": "\u0001drive_bays", "size": "full", "desc": "\u0001bays_with_parity_data_and_cache_temperature", "items": true, "group": "speicher"}, "array": {"name": "Array", "size": "half", "desc": "\u0001usage_state_cache_pools_and_parity_of_an_array", "items": true, "group": "speicher"}, "batteries": {"name": "\u0001mod.batteries.0", "desc": "\u0001mod.batteries.1", "group": "zustand", "items": true, "size": "half", "layout": {"w": 6, "h": 3}, "min_layout": {"w": 3, "h": 2}, "suggest": {"domain": "sensor", "device_class": "battery"}, "options": [{"key": "warn", "label": "\u0001mod.batteries.2", "type": "number", "default": 25}, {"key": "alert", "label": "\u0001mod.batteries.3", "type": "number", "default": 10}, {"key": "sort", "label": "\u0001mod.batteries.4", "type": "select", "default": "low", "choices": [["low", "\u0001mod.batteries.5"], ["name", "\u0001mod.batteries.6"]]}], "author": "@42bios", "community": true}}, "templates": {"gw": ["header", "ports", "internet", "system", "messages"], "switch": ["header", "ports", "poe", "system", "messages"], "sfp": ["header", "ports", "poe", "system", "messages"], "nvr": ["header", "disks", "recording", "system", "messages"], "fanpanel": ["header", "tiles", "system", "messages"], "server": ["header", "tiles", "system", "messages"], "ups": ["header", "flow", {"type": "chart", "source": "load", "label": "\u0001load_2"}, "voltage", "messages"], "pdu": ["header", "outlets", {"type": "chart", "source": "power", "label": "\u0001total_power"}, {"type": "chart", "source": "current", "label": "\u0001power", "color": "--teal", "dec": 1, "warn": 13}, "messages"], "generic": ["header", "tiles", "messages"], "passive": ["header", "note"]}, "passive_templates": ["patch", "ks", "lwl", "cm", "bl", "blank", "frame"], "displays": [{"key": "pi-portrait", "name": "\u00017_pi_display_portrait", "w": 480, "h": 800, "inch": 7}, {"key": "pi-landscape", "name": "\u00017_pi_display_landscape", "w": 800, "h": 480, "inch": 7}, {"key": "hd", "name": "HD 1280 × 720", "w": 1280, "h": 720, "inch": 10.1}, {"key": "hd-portrait", "name": "\u0001hd_portrait_720_1280", "w": 720, "h": 1280, "inch": 10.1}, {"key": "fhd", "name": "Full HD 1920 × 1080", "w": 1920, "h": 1080, "inch": 23.8}, {"key": "tablet", "name": "Tablet 1024 × 768", "w": 1024, "h": 768, "inch": 9.7}, {"key": "custom", "name": "\u0001custom_size"}, {"key": "fill", "name": "\u0001dashboard_only_use_the_whole_area"}], "groups": {"uebersicht": "\u0001overview", "kopf": "\u0001header", "werte": "\u0001values_gauges", "diagramme": "\u0001charts", "zustand": "\u0001state", "steuerung": "\u0001controls", "netzwerk": "\u0001network", "system": "System", "strom": "\u0001power_ups", "speicher": "\u0001storage_video", "sonstiges": "\u0001text_other"}};
const rdCatalog = rdPerLang(() => rdResolve(RD_CATALOG_RAW));
// Community-Module: werden beim Bauen aus modules/<typ>/render.js eingesetzt
const RD_MODULES = {};
RD_MODULES["batteries"] = { de: {"Batteries": "Akkus", "Battery levels of several devices as a list, weakest first": "Akkustände mehrerer Geräte als Liste, schwache zuerst", "Warning below (%)": "Warnung unter (%)", "Critical below (%)": "Kritisch unter (%)", "Sort order": "Sortierung", "Weakest first": "Schwache zuerst", "By name": "Nach Name"}, render: (() => {
// Batteries: one row per entity with a battery icon and fill level.
// ctx.items: [{ id, name, value, unit, number, status, available, attributes }], ctx.option(key), ctx.fmt, ctx.esc
function render(ctx, block) {
  const warn = ctx.option("warn"), alert = ctx.option("alert");
  const rows = ctx.items.filter(it => it.number != null);
  if (!rows.length) return "";
  rows.sort((a, b) => ctx.option("sort") === "name" ? a.name.localeCompare(b.name) : a.number - b.number);
  return `<div class="list">${rows.map(it => {
    const p = Math.max(0, Math.min(100, it.number)), lvl = p < alert ? "alert" : p < warn ? "warn" : "ok";
    return `<div class="row ${lvl}"><span class="name">${ctx.esc(it.name)}</span>
      <span class="bat"><i style="width:${p}%"></i></span><b>${ctx.fmt(p)}<small>%</small></b></div>`;
  }).join("")}</div>`;
}

return render;
})() };
/* ---------- Sprache ----------
   Alle Texte der Oberfläche stehen unter Schlüsseln in i18n/<sprache>.json (Englisch ist die Quellsprache).
   TR("schluessel", wert0, wert1 …) liefert den Text der aktuellen Sprache und setzt die Werte für {0}, {1} … ein;
   fehlt ein Schlüssel in einer Sprache, gilt der englische Text. Eine weitere Sprache ist eine weitere Datei. */
const RD_TEXT = {"de": {"door_closed": "Tür zu", "door_open": "Tür offen", "rear": "Rückseite", "door": "Tür", "server_rack": "Serverrack", "back_to_overview": "Zurück zur Übersicht", "back": "Zurück", "power": "Strom", "today": "heute", "battery": "Akku", "on_mains": "Netzbetrieb", "power_24_h": "Leistung 24 Std.", "temperature": "Temperatur", "warmest_device": "wärmstes Gerät", "warmest_device_2": "Wärmstes Gerät", "device_temperatures_no_rack_sensors": "Gerätetemperaturen · keine Rack-Sensoren", "device_temperatures": "Gerätetemperaturen", "device": "Gerät", "notices": "Hinweise", "notice": "Hinweis", "1_notice": "1 Hinweis", "no_data": "Keine Daten", "no_values": "Keine Werte", "no_home_assistant_device_linked_yet": "Noch kein Home-Assistant-Gerät verknüpft", "latency": "Antwortzeit", "pdu": "Stromleiste", "ups": "USV", "now": "jetzt", "too_hot": "Zu heiß", "ok": "In Ordnung", "fault": "Störung", "faults": "Störungen", "1_fault": "1 Störung", "warning": "Warnung", "passive": "Passiv", "off": "Aus", "running": "Läuft", "running_2": "läuft", "stopped": "Gestoppt", "inactive": "Inaktiv", "active": "Aktiv", "active_2": "aktiv", "switched_off": "Ausgeschaltet", "off_since": "Aus seit", "state": "Zustand", "no_problem": "ohne Problem", "all_good": "Alles in Ordnung", "reports_a_problem": "meldet ein Problem", "all_sensors_are_unavailable": "Alle Sensoren sind nicht verfügbar", "no_rack_created_yet": "Noch kein Rack angelegt.", "open_the_rack_editor": "Rack-Editor öffnen", "the_device_does_not_run_permanently": "Das Gerät läuft nicht dauerhaft.", "values_appear_here_automatically_once_it_is": "Sobald es eingeschaltet wird, erscheinen die Werte hier automatisch.", "the_device_does_not_run_permanently_values": "Das Gerät läuft nicht dauerhaft. Sobald es eingeschaltet wird, erscheinen die Werte hier automatisch.", "power_on": "⏻ Einschalten", "tap_again": "Nochmal tippen", "tap_again_to_power_on": "Nochmal tippen zum Einschalten", "off_2": "⏻ Aus", "server_off": "Server aus", "usage_cache_and_parity_appear_after_power_on": "Belegung, Cache und Parität erscheinen nach dem Einschalten.", "passive_element_without_sensors_assignments_or": "Passives Element ohne Sensoren. Im Editor der Integration lässt sich hier eine Belegung oder Notiz hinterlegen.", "history_2": "Verlauf", "messages": "Meldungen", "load": "Auslastung", "processor": "Prozessor", "memory": "Arbeitsspeicher", "cpu_temp": "CPU-Temp.", "temperatures": "Temperaturen", "temperature_history": "Temperaturverlauf", "storage": "Speicher", "network": "Netzwerk", "throughput": "Durchsatz", "active_ports": "Aktive Ports", "bundle": "Bündel", "connected_to": "Verbunden mit", "not_connected": "Nicht verbunden", "connected": "verbunden", "free": "frei", "free_2": "Frei", "used": "belegt", "used_2": "Belegt", "empty": "leer", "total": "Gesamt", "available": "Verfügbar", "unavailable": "Nicht verfügbar", "unknown": "Unbekannt", "on": "An", "home": "Zuhause", "away": "Abwesend", "open": "Offen", "closed": "Geschlossen", "connected_2": "Verbunden", "disconnected": "Getrennt", "ready": "Bereit", "recording": "Nimmt auf", "streaming": "Streamt", "playing": "Spielt", "paused": "Pausiert", "started": "Gestartet", "disks_missing": "Platten fehlen", "invalid_expansion": "Ungültige Erweiterung", "parity_check": "Paritätsprüfung", "rebuilding": "Wird neu aufgebaut", "maintenance": "Wartung", "safe": "Sicher", "unsafe": "Unsicher", "new_unassigned": "Neu, nicht zugewiesen", "missing": "Fehlt", "disabled": "Deaktiviert", "invalid": "Ungültig", "wrong_disk": "Falsche Platte", "emulated": "Emuliert", "completed": "abgeschlossen", "cancelled": "abgebrochen", "paused_2": "pausiert", "failed": "fehlgeschlagen", "never_run": "nie ausgeführt", "bays": "Schächte", "internal": "Intern", "parity": "Parität", "data": "Daten", "faded_spun_down": "blass = schläft", "spun_down": "schläft", "array_stopped": "Array gestoppt", "no_usage": "Keine Belegung", "the_sensor_does_not_report_sizes_yet": "Der Sensor liefert noch keine Größen.", "disks_missing_disks_and_shares_are_available": "Platten fehlen. Platten und Freigaben sind erst nach dem Start verfügbar.", "missing_disks": "Fehlende Platten", "invalid_disks": "Ungültige Platten", "disabled_disks": "Deaktivierte Platten", "configuration": "Konfiguration", "peripheral": "Peripherie", "fans_in_rpm": "Lüfter in U/min", "fans": "Lüfter", "rpm": "U/min", "recording_2": "Aufnahme", "continuous": "Dauer", "motion": "Bewegung", "detections": "Erkennungen", "detections_today": "Erkennungen heute", "timelapse": "Zeitraffer", "cameras": "Kameras", "camera": "Kamera", "camera_offline": "Kamera offline", "disks": "Festplatten", "drive": "Laufwerk", "satisfaction": "Zufriedenheit", "guests": "Gäste", "top_client": "Top-Client", "wi_fi_channel_utilisation": "WLAN-Kanalauslastung", "connection": "Anbindung", "interfaces": "Schnittstellen", "containers": "Container", "slots": "Steckplätze", "installed": "Eingebaut", "runtime": "Reserve", "load_2": "Last", "input": "Eingang", "output": "Ausgang", "voltage": "Spannung", "rectifier": "Gleichrichter", "inverter": "Wechselrichter", "bypass_active": "Bypass aktiv", "online_ups": "Online-USV", "mains": "Netz", "mains_2": "Netz ↓", "mains_off": "Netz aus", "protection": "Schutz", "self_test": "Selbsttest", "self_test_passed": "Selbsttest bestanden", "passed": "bestanden", "fully_functional": "Voll funktionsfähig", "battery_charging": "Akku wird geladen", "charging": "lädt", "discharging": "entlädt", "load_runs_directly_on_mains": "Last hängt direkt am Netz", "mains_failed_load_runs_on_battery": "Netz ausgefallen, Last läuft aus dem Akku", "mains_failed_the_load_runs_on_battery": "Netz ausgefallen: Die Last läuft aus dem Akku.", "power_always_flows_through_battery_and_inverter": "Der Strom läuft immer über Akku und Wechselrichter. Fällt das Netz aus, gibt es keine Umschaltzeit.", "everything_powered": "Alles versorgt", "outlets": "Ausgänge", "current": "Aktuell", "current_values": "Aktuelle Werte", "peak": "Spitze", "month": "Monat", "last_hour": "letzte Stunde", "restarted": "Neu gestartet", "unreachable": "Nicht erreichbar", "device_is_not_on_the_network": "Gerät ist nicht im Netzwerk", "installing_firmware": "Firmware wird installiert", "firmware_update_available": "Firmware-Update verfügbar", "setting_up": "Wird eingerichtet", "adopting": "Wird übernommen", "overheating_reported": "Überhitzung gemeldet", "overheating": "Überhitzung", "the_pdu_currently_does_not_report_the_switching": "Schaltzustand wird von der Stromleiste derzeit nicht korrekt gemeldet.", "rack_thermal_sensor": "Rack-Thermosensor", "days": "Tage", "day": "Tag", "h": "Std.", "24_h": "24 Std.", "other": "Übrige", "vs_yesterday": "ggü. gestern", "overview": "Übersicht", "retention": "Speicherdauer", "no_temperature_values_available": "Keine Temperaturwerte vorhanden.", "rear_0_u": "Rückseite (0 HE)", "on_2": "Ein", "high_temperature": "Hohe Temperatur", "rack_editor": "Rack-Editor", "loading": "Wird geladen …", "choose_rack": "Rack wählen", "edit_device": "Gerät bearbeiten", "choose_device": "Gerät wählen …", "overview_home_page": "▦ Übersicht (Startseite)", "new_version_reload": "Neue Version · neu laden", "the_editor_was_updated": "Der Editor wurde aktualisiert", "undo_z": "Rückgängig (⌘Z)", "redo_z": "Wiederholen (⇧⌘Z)", "undo": "Rückgängig", "unsaved_changes": "Ungespeicherte Änderungen", "saved": "Gespeichert", "discard": "Verwerfen", "save": "Speichern", "up_one_level_esc": "Eine Ebene zurück (Esc)", "devices": "Geräte", "home_page_next_to_the_rack": "Startseite neben dem Rack", "passive_elements": "Passive Elemente", "tap_to_edit_in_the_rack_on_the_right_drag_to": "Antippen zum Bearbeiten. Im Rack rechts: ziehen zum Verschieben, ＋ zum Einsetzen.", "rack_units": "Höheneinheiten", "ups_capacity_w": "USV-Kapazität (W)", "door_labels": "Tür & Beschriftung", "badge": "Schild", "e_g_company_name": "z. B. Firmenname", "type_plate": "Typenschild", "top_label": "Beschriftung oben", "bottom_label": "Beschriftung unten", "appearance": "Aussehen", "cabinet_colour": "Gehäusefarbe", "light_grey_default": "Hellgrau (Standard)", "white": "Weiß", "graphite": "Graphit", "black": "Schwarz", "custom_colour": "Eigene Farbe …", "custom_colour_2": "Eigene Farbe", "perforated": "Lochgitter", "glass": "Glas", "solid": "Blech", "no_door": "Ohne Tür", "label_colour": "Farbe Beschriftung", "display": "Anzeige", "show_on": "Darstellen auf", "back_to_overview_after": "Zurück zur Übersicht nach", "never": "nie", "after_30_seconds": "nach 30 Sekunden", "after_1_minute": "nach 1 Minute", "after_2_minutes": "nach 2 Minuten", "after_5_minutes": "nach 5 Minuten", "width_px": "Breite (px)", "height_px": "Höhe (px)", "diagonal_inch": "Diagonale (Zoll)", "scaling": "Skalierung", "cells": "Felder", "the_view_is_built_for_this_area_and_scaled": "Die Ansicht wird für diese Fläche gebaut und überall (Seite „Rack“, Karten, Pi) passend skaliert. „Nur Dashboard“ nutzt immer die ganze verfügbare Fläche.", "7_pi_display_portrait": "7\" Pi-Display hochkant", "7_pi_display_landscape": "7\" Pi-Display quer", "hd_portrait_720_1280": "HD hochkant 720 × 1280", "custom_size": "Eigene Größe", "dashboard_only_use_the_whole_area": "Nur Dashboard – ganze Fläche nutzen", "insert_device": "Gerät einsetzen", "first_free_slot_from_the_top": "erste freie Stelle von oben", "tip_tap_in_the_rack_to_choose_the_position_or": "Tipp: ＋ im Rack antippen, um die Höhe vorzugeben, oder eine Vorlage ins Rack ziehen.", "servers_storage": "Server & Speicher", "accessories": "Zubehör", "sfp_switch": "SFP-Switch", "patch_panel": "Patchfeld", "fibre_patch_panel": "LWL-Patchfeld", "server_1_u": "Server 1 HE", "server_2_u": "Server 2 HE", "server_4_u": "Server 4 HE", "recorder": "Rekorder", "generic_device": "Gerät allgemein", "battery_pack": "Zusatzbatterie", "pdu_rear": "Stromleiste (hinten)", "shelf": "Fachboden", "module_frame": "Modulrahmen", "cable_management": "Kabelführung", "blanking_panel": "Blende", "server_with_fan_panel": "Server mit Lüfterblende", "ups_battery": "USV / Batterie", "general": "Allgemein", "model": "Modell", "template": "Vorlage", "height_u": "Höhe (HE)", "front_in_u": "Vorne in HE", "passive_no_sensors": "Passiv (ohne Sensoren)", "not_always_on": "Nicht immer eingeschaltet", "off_grey_no_warnings": "Aus = grau, keine Warnungen", "detect_off_via": "„Aus“ erkennen über", "automatic_all_values_gone": "automatisch (alle Werte weg)", "power_on_button": "Einschalt-Taste", "none": "– keine –", "belongs_to_e_g_battery_pack_ups": "Gehört zu (z. B. Zusatzbatterie → USV)", "standalone": "– eigenständig –", "linked": "verknüpft", "not_linked": "nicht verknüpft", "not_linked_yet": "Noch nicht verknüpft", "not_linked_2": "Nicht verknüpft", "linked_to_home_assistant": "Mit Home Assistant verknüpft", "detected_automatically": "Automatisch erkannt:", "link_another_device": "Weiteres Gerät verknüpfen", "search_device": "Gerät suchen", "name_model_or_manufacturer": "Name, Modell oder Hersteller", "no_match": "Kein Treffer", "name_outlets": "Ausgänge benennen", "modules": "Module", "photos": "Fotos", "photo_available": "Foto vorhanden", "front": "Vorderseite", "no_photo": "Kein Foto", "upload_2": "Hochladen", "remove": "Entfernen", "vertical_image_rear_view": "Senkrechtes Bild (in der Rückansicht)", "remove_2": "🗑 Entfernen", "remove_device": "🗑 Gerät entfernen", "copy_to_another_rack": "In anderes Rack übernehmen …", "copy_device_with_its_popup_to_another_rack": "Gerät samt Popup in ein anderes Rack übernehmen", "grid_used": "Raster belegt", "tap_new_modules_in_the_library_in_the_middle_or": "Neue Module aus der Bibliothek in der Mitte antippen oder ins Popup ziehen. Im Popup: ⋮⋮ verschieben, Ecke ziehen = Größe.", "the_home_page_next_to_the_rack_is_a_grid_like": "Die Startseite neben dem Rack ist ein Raster wie die Popups: Karten aus der Bibliothek hinzufügen, ⋮⋮ verschieben, an der Ecke skalieren, antippen für Einstellungen und Entitäten.", "restore_default": "Standard wiederherstellen", "remove_custom_overview": "Eigene Übersicht entfernen", "back_to_the_fixed_default_overview": "Zurück zur festen Standard-Übersicht", "search_modules": "Module suchen …", "tap_or_drag_into_the_popup": "antippen oder ins Popup ziehen", "all": "Alle", "recently_used": "Zuletzt benutzt", "no_data_for_this_device": "Für dieses Gerät keine Daten", "choose_entities_after_adding": "Entitäten nach dem Hinzufügen wählen", "resize": "Größe ändern", "move": "Verschieben", "type_a_name": "Name eintippen", "upload_front_photo": "Foto der Vorderseite hochladen", "photo": "📷 Foto", "size_width": "Größe · Breite", "display_style": "Darstellung", "title": "Titel", "subtitle": "Untertitel", "e_g_network": "z. B. Netzwerk", "warning_from": "Warnung ab", "critical_from": "Kritisch ab", "entity": "+ Entität", "key_figure": "+ Kennzahl", "search_entity": "Entität suchen", "name_or_entity_id": "Name oder entity_id", "display_name": "Anzeigename", "no_entity_yet": "Noch keine Entität", "automatic": "Automatisch", "key_figures_at_the_top_up_to_4_empty_automatic": "Kennzahlen oben (bis zu 4). Leer = automatisch (z. B. Uptime, Clients, Ports, Durchsatz).", "suggestions_from_this_device": "Vorschläge von diesem Gerät", "type_to_search_all_entities": "Tippe, um alle Entitäten zu durchsuchen", "this_device": "dieses Gerät", "always_on_top": "immer oben", "tiles": "Kacheln", "tiles_with_24_h_curve": "Kacheln mit 24-Std.-Kurve", "compact_rows": "Kompakt (Zeilen)", "hardware_temperatures_fans": "Hardware (Temperaturen + Lüfter)", "bars": "Balken", "thermometer_temperatures": "Thermometer (Temperaturen)", "curve_tiles": "Kurven-Kacheln", "trackable_history": "Verfolgbarer Verlauf", "value": "Wert", "value_with_24_h_curve": "Wert mit 24-Std.-Kurve", "list_problems_first": "Liste (Probleme zuerst)", "front_bays": "Schächte vorne", "columns": "Spalten", "cache_drives_sit_in_bays_otherwise_internal": "Cache-Laufwerke stecken in Schächten (sonst „Intern“)", "done": "Fertig", "remove_module": "🗑 Modul entfernen", "module_moved": "Modul verschoben", "no_room_there_reverted": "Dort ist kein Platz – zurückgesetzt", "no_free_space": "Kein freier Platz", "no_free_space_at_the_front": "Vorne ist kein Platz frei", "uploading_image": "Bild wird hochgeladen …", "up": "Nach oben", "down": "Nach unten", "my_rack": "Mein Rack", "close_esc": "Schließen (Esc)", "discard_all_unsaved_changes": "Alle ungespeicherten Änderungen verwerfen?", "unsaved_changes_will_be_lost_switch_anyway": "Ungespeicherte Änderungen gehen verloren. Trotzdem wechseln?", "unsaved_changes_will_be_lost_when_reloading": "Ungespeicherte Änderungen gehen beim Neuladen verloren. Trotzdem neu laden?", "remove_the_custom_overview_and_return_to_the": "Eigene Übersicht entfernen und zur Standard-Übersicht zurückkehren?", "tap_a_free_rack_unit_to_insert_a_device_or_a": "Tippe auf eine freie Höheneinheit, um ein Gerät einzusetzen, oder auf ein Gerät, um es zu bearbeiten.", "values_as_tiles": "Werte als Kacheln", "values_with_curves": "Werte mit Kurven", "single_value": "Einzelwert", "single_value_with_curve": "Einzelwert mit Kurve", "curves": "Kurven", "gauge": "Tacho", "key_figure_2": "Kennzahl", "progress": "Fortschritt", "bar_chart": "Balkendiagramm", "status_chips": "Status-Chips", "switches_2": "Schalter", "actions": "Aktionen", "heading": "Überschrift", "clock": "Uhr", "note": "Notiz", "note_enter_text_in_the_module_panel": "Notiz – Text im Modulfenster eintragen", "section": "Abschnitt", "header": "Kopf", "server_rack_with_live_values": "Server-Rack mit Live-Werten", "values_gauges": "Werte & Anzeigen", "charts": "Diagramme", "controls": "Steuerung", "power_ups": "Strom & USV", "storage_video": "Speicher & Video", "text_other": "Text & Sonstiges", "values": "Werte", "energy_flow": "Energiefluss", "drive_bays": "Laufwerksschächte", "key_figure_bar": "Kennzahlen-Leiste", "power_overview": "Strom (Übersicht)", "temperature_overview": "Temperatur (Übersicht)", "notices_overview": "Hinweise (Übersicht)", "all_ports_with_speed_poe_and_live_throughput": "Alle Ports mit Geschwindigkeit, PoE und Live-Durchsatz", "outlets_of_a_pdu_with_assignments": "Ausgänge einer Stromleiste mit Belegung", "load_as_bars_0100_or_custom_range": "Auslastung als Balken (0–100 % oder eigener Bereich)", "usage_state_cache_pools_and_parity_of_an_array": "Belegung, Zustand, Cache-Pools und Parität eines Arrays", "any_entities_as_tiles": "Beliebige Entitäten als Kacheln", "cpu_ram_and_temperature_over_24_h": "CPU, RAM und Temperatur über 24 Std.", "download_and_upload_over_24_h": "Download und Upload über 24 Std.", "one_value_as_a_bar_with_min_max": "Ein Wert als Balken mit Min/Max", "one_value_as_a_semicircle_gauge_with_min_max": "Ein Wert als Halbkreis-Anzeige mit Min/Max und Warnfarben", "one_value_as_a_ring_e_g_load_in": "Ein Wert als Ring (z. B. Auslastung in %)", "one_value_as_its_own_tile_optionally_with_a_24": "Ein Wert als eigene Kachel – wahlweise mit 24-Std.-Kurve", "one_to_three_measurements_over_24_h": "Ein bis drei Messwerte über 24 Std.", "input_and_output_voltage_over_24_h": "Ein- und Ausgangsspannung über 24 Std.", "free_text_e_g_patch_panel_assignments": "Freier Text, z. B. Belegung eines Patchfelds", "big_number_with_change_vs_yesterday": "Große Zahl mit Veränderung gegenüber gestern", "internet_poe_pdu_ups_at_a_glance": "Internet, PoE, Stromleiste, USV auf einen Blick", "tiles_with_the_key_measurements": "Kacheln mit den wichtigsten Messwerten", "rack_power_ups_battery_consumers_and_24_h": "Leistung des Racks, USV-Akku, Verbraucher und 24-Std.-Verlauf", "several_states_as_compact_chips_with_traffic": "Mehrere Zustände kompakt als Chips mit Ampel", "name_model_position_front_image_up_to_4_key": "Name, Modell, Position, Frontbild, bis zu 4 Kennzahlen", "online_ups_mains_battery_load": "Online-USV: Netz, Akku, Last", "poe_power_in_total_and_per_port": "PoE-Leistung gesamt und je Port", "control_switches_lights_and_fans_directly": "Schalter, Lichter, Lüfter direkt bedienen", "bays_with_parity_data_and_cache_temperature": "Schächte mit Parität, Daten und Cache, Temperatur, Belegung und Ruhezustand", "bays_state_and_usage": "Schächte, Zustand und Belegung", "run_scripts_scenes_and_buttons": "Skripte, Szenen und Tasten auslösen", "retention_recording_types_cameras": "Speicherdauer, Aufnahmearten, Kameras", "camera_still_image_refreshes_continuously": "Standbild einer Kamera (aktualisiert sich laufend)", "hourly_values_of_the_last_24_h_as_bars": "Stundenwerte der letzten 24 Std. als Balken", "faults_notices_and_info_of_the_device": "Störungen, Hinweise und Infos des Geräts", "title_with_subtitle_for_structure": "Titel mit Untertitel zum Gliedern", "time_and_date": "Uhrzeit und Datum", "warnings_and_faults_of_all_devices": "Warnungen und Störungen aller Geräte", "warmest_device_and_temperatures_of_all_devices": "Wärmstes Gerät und Temperaturen aller Geräte", "states_as_a_list_with_traffic_lights": "Zustände als Liste mit Ampel", "cpu_load": "CPU-Auslastung", "memory_usage": "Speicherauslastung", "disk_usage": "Speicherplatzauslastung", "uptime_2": "Betriebszeit", "cpu_temperature": "CPU-Temperatur", "poe_power": "PoE-Leistung", "recording_capacity": "Aufnahmekapazität", "1_day": "1 Tag", "drops": "Abbrüche", "wan_drops": "WAN-Abbrüche", "width": "Breite", "height": "Höhe", "rows": "Zeilen", "full": "ganz", "row": "Zeile", "lower": "Niedriger", "taller": "Höher", "no_room_for_that_in_the_grid": "Dafür ist im Raster kein Platz", "language": "Sprache", "automatic_ha_user_language": "Automatisch (Sprache des HA-Benutzers)", "loss": "Verlust", "numbering": "Nummerierung", "by_row_1_2_3_to_the_right": "zeilenweise (1 2 3 … nach rechts)", "by_column_1_2_3_downwards": "spaltenweise (1 2 3 … nach unten)", "disk_bay": "Platte → Schacht", "empty_next_free_bay_duplicate_numbers_the_first": "Leer = nächster freier Schacht. Doppelte Nummern: die erste Platte gewinnt.", "number_of_slots": "Anzahl Steckplätze", "installed_2": "eingebaut", "planned": "geplant", "description_e_g_lan_oled": "Beschreibung, z. B. LAN · OLED", "entity_for_live_value_optional": "Entität für Live-Wert (optional)", "entering_a_name_occupies_the_slot_clearing_it": "Name eintragen belegt den Steckplatz; leeren gibt ihn frei. Mit Entität zeigt das Popup den aktuellen Wert.", "create_ha_entities": "HA-Entitäten anlegen", "state_faults_warnings_hottest_device_for": "Zustand, Störungen, Warnungen, wärmstes Gerät – für Automationen und Benachrichtigungen", "electricity_price_kwh": "Strompreis (€/kWh)", "or_price_entity": "oder Preis-Entität", "e_g_0_30": "z. B. 0,30", "export": "⇩ Exportieren", "import": "⇧ Importieren", "save_the_rack_with_devices_popups_and_settings": "Rack mit Geräten, Popups und Einstellungen als Datei sichern", "rack_exported": "Rack exportiert", "night_mode_from": "Nachtmodus von", "until": "bis", "brightness_at_night": "Helligkeit nachts", "100_dark_only": "100 % (nur dunkel)", "heat": "Wärme", "heat_map": "Wärmekarte", "a_heat_button_below_the_rack_colours_devices_by": "Knopf „Wärme“ unter dem Rack färbt die Geräte nach Temperatur (ab zwei Geräten mit Temperaturwert)", "on_the_shelf": "Auf dem Fachboden", "cloud_key_small_controller": "Cloud Key / kleiner Controller", "mini_pc": "Mini-PC", "small_nas": "kleines NAS", "generic_box": "Box allgemein", "access_point": "Access Point", "is_this_device_state_led": "ist dieses Gerät (Zustand, LED)", "device_on_the_shelf": "＋ Gerät auf den Fachboden", "small_devices_lying_on_the_shelf_the_linked_ha": "Kleingeräte, die auf der Ablage liegen. Das verknüpfte HA-Gerät zeigt seinen Zustand an der LED.", "assignment_from_entity_optional": "Zuordnung aus Entität (optional)", "entity_does_not_provide_an_assignment_yet": "Entität liefert (noch) keine Zuordnung – manuelle Werte gelten", "horizontal_tiles": "Liegend (Kacheln)", "vertical_like_the_enclosure": "Stehend (wie im Gehäuse)", "screen_touchkio": "Bildschirm (TouchKio)", "none_2": "– keiner –", "switch_off_after": "Ausschalten nach", "never_always_on": "nie (immer an)", "1_minute": "1 Minute", "2_minutes": "2 Minuten", "5_minutes": "5 Minuten", "10_minutes": "10 Minuten", "30_minutes": "30 Minuten", "without_touch_ha_switches_the_screen_off_a": "Ohne Berührung schaltet HA den Bildschirm aus; eine Berührung schaltet ihn wieder ein.", "vertical_all_in_one_row": "stehend: alle in einer Reihe", "rack_temperature": "Rack-Temperatur", "ntp_time_server": "NTP-Zeitserver", "cloud_key_module": "Cloud-Key-Modul", "width_in_slots": "Breite in Steckplätzen", "slot": "Platz", "slots_2": "Plätze", "edit_own_popup": "Eigenes Popup bearbeiten ›", "own_popup_link_ha_device": "+ Eigenes Popup (HA-Gerät verknüpfen)", "popup_removed": "Popup entfernt", "remove_device_2": "Gerät entfernen", "meter": "Zähler", "today_2": "Heute", "restarted_with_firmware_n": "Neu gestartet mit Firmware {0}", "started_with_firmware_n": "Gestartet mit Firmware {0}", "n_assignments_from_the_entity_manual_values": "{0} Zuordnungen aus der Entität · manuelle Werte gelten nur für Platten ohne Eintrag", "n_devices": "{0} Geräte", "on_shelf_u_n": "auf Fachboden HE {0}", "import_failed_n": "Import fehlgeschlagen: {0}", "create_n_as_a_new_rack": "„{0}“ als neues Rack anlegen?", "n_imported": "„{0}“ importiert", "today_n": "heute · ≈ {0}", "n_month": "≈ {0} / Monat", "n_rows": "{0} Zeilen", "n_of_12_columns": "{0} von 12 Spalten", "n_n_drag_the_corner_in_the_preview_or_use_arrow": "{0} × {1} · in der Vorschau an der Ecke ziehen oder Pfeiltasten (⇧ = Größe)", "bullet_n": "· {0}", "n_days": "{0} Tage", "n_h": "{0} Std.", "n_u": "{0} HE", "from_u_n": "ab HE {0}", "n_u_from_u_n": "{0} HE · ab HE {1}", "n_u_does_not_fit_here": "{0} HE · passt hier nicht", "n_of_n_u": "{0} von {1} HE", "n_of_n_used": "{0} von {1} belegt", "n_of_n_used_n_planned": "{0} von {1} belegt · {2} geplant", "n_of_n_connected": "{0} von {1} verbunden", "n_of_n_cameras": "{0} von {1} Kameras", "n_faults": "{0} Störungen", "n_notices": "{0} Hinweise", "n_with_problems": "{0} mit Problem", "n_warm": "{0} warm", "n_more": "{0} weitere", "n_more_2": "+{0} weitere", "n_devices_powered": "{0} Geräte versorgt", "n_outlets": "{0} Ausgänge", "n_errors": "{0} Fehler", "n_u_n_used_n_active_devices": "{0} HE · {1} belegt · {2} aktive Geräte", "n_n_u_n_used_n_items": "{0} · {1} HE · {2} belegt · {3} Elemente", "n_of_ups_capacity_via_pdu": "{0} % der USV-Kapazität · laut Stromleiste", "n_of_ups_capacity": "{0} % der USV-Kapazität", "ups_load_n": "Auslastung der USV {0} %", "ups_battery_n_percent_n_minutes_runtime": "USV-Akku {0} Prozent, {1} Minuten Reserve", "warmest_device_n_degrees": "Wärmstes Gerät {0} Grad", "currently_n": "aktuell {0}", "limit_n": "Grenze {0}", "temperature_above_n": "Temperatur über {0}", "n_at_n": "{0} um {1}", "since_n_values_appear_here_automatically_once": "seit {0}. Sobald es eingeschaltet wird, erscheinen die Werte hier automatisch.", "since_n": "seit {0}", "battery_n": "Akku {0}", "bay_n": "Schacht {0}", "internal_n": "Intern {0}", "disk_n": "Platte {0}", "parity_n": "Parität {0}", "cache_n": "Cache {0}", "n_used": "{0} % belegt", "fans_n": "Lüfter ({0})", "n_peak_n": "Ø {0} · Spitze {1}", "n_y_n_mo_ago": "vor {0} J. {1} Mon.", "n_ago": "vor {0}", "automatic_n": "automatisch ({0})", "after_n_seconds": "nach {0} Sekunden", "after_n_minutes": "nach {0} Minuten", "size_width_n_of_12_height_n_rows": "Größe · Breite {0} von 12, Höhe {1} Zeilen", "n_n_in_popup": "{0} × {1} · im Popup", "of_n_rows": "von {0} Zeilen", "of_n_rows_too_tall": "von {0} Zeilen – zu hoch", "n_n_px_n_ppi_detail_view_grid": "{0} × {1} px · {2} ppi · Raster der Detailansicht", "n_no_data_for_n_yet_choose_entities_in_the": "{0} · Für „{1}“ noch keine Daten – nach dem Hinzufügen Entitäten im Modul wählen", "n_already_in_the_popup": "{0} · schon im Popup", "sizes_as_in_the_popup_preview_with_data_from_n": "Größen wie im Popup, Vorschau mit den Daten von „{0}“.", "which_device_is_plugged_into_which_outlet_can": "Welches Gerät an welchem Ausgang hängt, lässt sich im Rack-Editor beim Gerät „{0}“ eintragen.", "n_removed": "„{0}“ entfernt", "module_n_removed": "Modul „{0}“ entfernt", "n_added": "„{0}“ hinzugefügt", "n_inserted_at_u_n": "„{0}“ eingesetzt in HE {1}", "n_inserted_rear": "„{0}“ eingesetzt (Rückseite)", "n_moved_to_u_n": "„{0}“ nach HE {1}", "size_n_n": "Größe {0} × {1}", "n_copied_to_n": "„{0}“ in „{1}“ übernommen", "no_room_for_n_u_in_n": "In „{0}“ ist kein Platz für {1} HE", "replace_n_in_n_popup_photos_and_link_are_copied": "„{0}“ in „{1}“ ersetzen? Popup, Fotos und Verknüpfung werden übernommen, die Position dort bleibt.", "copy_n_with_its_popup_to_n": "„{0}“ samt Popup in „{1}“ übernehmen?", "copy_failed_n": "Übernehmen fehlgeschlagen: {0}", "upload_failed_n": "Hochladen fehlgeschlagen: {0}", "not_saved_n": "Nicht gespeichert: {0}", "no_room_for_n_u_here": "Für {0} HE ist an dieser Stelle kein Platz", "n_device_s_do_not_fit_in_n_u": "{0} Gerät(e) passen nicht in {1} HE:", "insert_n": "{0} einsetzen", "u_n_insert_device": "HE {0}: Gerät einsetzen", "n_u_n": "{0}, HE {1}", "n_rear": "{0}, Rückseite", "port_n_n": "Port {0}, {1}", "n_rear_2": "{0} (Rückseite)", "remove_n_from_the_rack": "„{0}“ aus dem Rack entfernen?", "online_ups_n": "Online-USV · {0}", "wled_n": "WLED · {0}", "of_n": "von {0}", "value_n_2": "{0} ·", "part_of_n": "gehört zu {0}", "n_slots": "{0} Plätze", "1_slot": "1 Platz", "popup_for_n_created_now_pick_the_ha_device": "Popup für „{0}“ angelegt – jetzt HA-Gerät wählen", "slots_nn": "Platz {0}–{1}", "slot_n": "Platz {0}", "n_slot_n": "{0} · Platz {1}", "u_n": "HE {0}", "total_power": "Gesamtleistung", "updated_to_n": "Auf {0} aktualisiert", "new_firmware": "neue Firmware", "n_is_back_online": "{0} ist wieder online", "n_was_offline": "{0} war offline", "poe_on_port_n_switched_on": "PoE an Port {0} eingeschaltet", "poe_on_port_n_switched_off": "PoE an Port {0} ausgeschaltet", "switched_on_when_needed": "wird bei Bedarf eingeschaltet", "state_n": "Zustand: {0}", "power_output": "Leistung", "ip_address": "IP-Adresse", "connection_type": "Anschluss", "wifi": "WLAN", "wired": "Kabel", "battery_source": "Batterie", "error": "Fehler", "no_test": "kein Test", "network_card": "Netzwerkkarte", "battery_temp_short": "Akku-Temp.", "battery_date": "Akku-Datum", "battery_operation": "Batteriebetrieb", "n_alarms_at_the_ups": "{0} Alarm(e) an der USV", "self_test_n": "Selbsttest: {0}", "bay_n_reports_a_problem": "Schacht {0} ({1}) meldet ein Problem", "switch_wled_on_or_off": "WLED ein- oder ausschalten", "according_to_the_pdu": "laut Stromleiste", "input_min": "Eingang min", "check_n_drive": "{0} Laufwerk prüfen", "check_n_drives": "{0} Laufwerke prüfen", "check_drives": "Laufwerke prüfen", "check": "Prüfen", "drives": "Laufwerke", "battery_mode": "Akkubetrieb", "mains_failed_battery_supplies": "Netz ausgefallen – Akku versorgt", "n_years_n_months": "{0} J. {1} Mon.", "n_months": "{0} Mon.", "too_warm": "zu warm", "load_lower": "Last", "n_min": "{0} Min.", "on_shelf": "auf Fachboden", "disconnected_lower": "getrennt", "disk": "Platte", "disks_and_shares_after_start": "Platten und Freigaben sind erst nach dem Start verfügbar.", "module_error": "Fehler im Modul", "no_ha_device_linked": "Mit diesem Gerät ist noch kein Home-Assistant-Gerät verknüpft. Sobald es eine Integration gibt (z. B. Unraid), lässt es sich im Editor verknüpfen; Temperaturen, Auslastung und Festplatten erscheinen dann hier.", "card_rack_id": "Rack-ID (leer = erstes Rack)", "card_view": "Ansicht", "card_height": "Höhe in Pixel", "card_view_full": "Rack mit Detailansicht", "card_view_rack": "Nur Rack mit Status", "pdu_rear_label": "Stromleiste, Rückseite", "already_in_the_popup": "schon im Popup", "in_the_popup": "im Popup", "n_devices_do_not_fit": "{0} Gerät(e) passen nicht in {1} HE:", "too_high": "zu hoch", "default_oled_lan": "Standard (OLED + LAN)", "half_or_full_width": "Halbe oder ganze Breite", "entity_word": "Entität", "already_used_by_n": "bereits bei „{0}“", "too_high_lower_modules_cut_off": "zu hoch, untere Module werden abgeschnitten", "module": "Modul", "n_inserted_in_u_n": "„{0}“ eingesetzt in HE {1}", "no_devices": "keine Geräte", "last_24_hours": "letzte 24 Stunden", "double_conversion": "Doppelwandlung", "at_time": "um", "n_of_n_on": "{0} von {1} an", "n_device_powered": "{0} Gerät versorgt", "n_on": "{0} an", "mod.batteries.0": "Akkus", "mod.batteries.1": "Akkustände mehrerer Geräte als Liste, schwache zuerst", "mod.batteries.2": "Warnung unter (%)", "mod.batteries.3": "Kritisch unter (%)", "mod.batteries.4": "Sortierung", "mod.batteries.5": "Schwache zuerst", "mod.batteries.6": "Nach Name"}, "en": {"door_closed": "Door closed", "door_open": "Door open", "rear": "Rear", "door": "Door", "server_rack": "Server rack", "back_to_overview": "Back to overview", "back": "Back", "power": "Power", "today": "today", "battery": "Battery", "on_mains": "On mains", "power_24_h": "Power · 24 h", "temperature": "Temperature", "warmest_device": "warmest device", "warmest_device_2": "Warmest device", "device_temperatures_no_rack_sensors": "Device temperatures · no rack sensors", "device_temperatures": "Device temperatures", "device": "Device", "notices": "Notices", "notice": "Notice", "1_notice": "1 notice", "no_data": "No data", "no_values": "No values", "no_home_assistant_device_linked_yet": "No Home Assistant device linked yet", "latency": "Latency", "pdu": "PDU", "ups": "UPS", "now": "now", "too_hot": "Too hot", "ok": "OK", "fault": "Fault", "faults": "Faults", "1_fault": "1 fault", "warning": "Warning", "passive": "Passive", "off": "Off", "running": "Running", "running_2": "running", "stopped": "Stopped", "inactive": "Inactive", "active": "Active", "active_2": "active", "switched_off": "Switched off", "off_since": "Off since", "state": "State", "no_problem": "no problem", "all_good": "All good", "reports_a_problem": "reports a problem", "all_sensors_are_unavailable": "All sensors are unavailable", "no_rack_created_yet": "No rack created yet.", "open_the_rack_editor": "Open the rack editor", "the_device_does_not_run_permanently": "The device does not run permanently.", "values_appear_here_automatically_once_it_is": "Values appear here automatically once it is switched on.", "the_device_does_not_run_permanently_values": "The device does not run permanently. Values appear here automatically once it is switched on.", "power_on": "⏻ Power on", "tap_again": "Tap again", "tap_again_to_power_on": "Tap again to power on", "off_2": "⏻ Off", "server_off": "Server off", "usage_cache_and_parity_appear_after_power_on": "Usage, cache and parity appear after power-on.", "passive_element_without_sensors_assignments_or": "Passive element without sensors. Assignments or notes can be added in the integration's editor.", "history_2": "History", "messages": "Messages", "load": "Load", "processor": "Processor", "memory": "Memory", "cpu_temp": "CPU temp.", "temperatures": "Temperatures", "temperature_history": "Temperature history", "storage": "Storage", "network": "Network", "throughput": "Throughput", "active_ports": "Active ports", "bundle": "Bundle", "connected_to": "Connected to", "not_connected": "Not connected", "connected": "connected", "free": "free", "free_2": "Free", "used": "used", "used_2": "Used", "empty": "empty", "total": "Total", "available": "Available", "unavailable": "Unavailable", "unknown": "Unknown", "on": "On", "home": "Home", "away": "Away", "open": "Open", "closed": "Closed", "connected_2": "Connected", "disconnected": "Disconnected", "ready": "Ready", "recording": "Recording", "streaming": "Streaming", "playing": "Playing", "paused": "Paused", "started": "Started", "disks_missing": "Disks missing", "invalid_expansion": "Invalid expansion", "parity_check": "Parity check", "rebuilding": "Rebuilding", "maintenance": "Maintenance", "safe": "Safe", "unsafe": "Unsafe", "new_unassigned": "New, unassigned", "missing": "Missing", "disabled": "Disabled", "invalid": "Invalid", "wrong_disk": "Wrong disk", "emulated": "Emulated", "completed": "completed", "cancelled": "cancelled", "paused_2": "paused", "failed": "failed", "never_run": "never run", "bays": "Bays", "internal": "Internal", "parity": "Parity", "data": "Data", "faded_spun_down": "faded = spun down", "spun_down": "spun down", "array_stopped": "Array stopped", "no_usage": "No usage", "the_sensor_does_not_report_sizes_yet": "The sensor does not report sizes yet.", "disks_missing_disks_and_shares_are_available": "Disks missing. Disks and shares are available after the array starts.", "missing_disks": "Missing disks", "invalid_disks": "Invalid disks", "disabled_disks": "Disabled disks", "configuration": "Configuration", "peripheral": "Peripheral", "fans_in_rpm": "Fans in rpm", "fans": "Fans", "rpm": "rpm", "recording_2": "Recording", "continuous": "Continuous", "motion": "Motion", "detections": "Detections", "detections_today": "Detections today", "timelapse": "Timelapse", "cameras": "Cameras", "camera": "Camera", "camera_offline": "Camera offline", "disks": "Disks", "drive": "Drive", "satisfaction": "Satisfaction", "guests": "Guests", "top_client": "Top client", "wi_fi_channel_utilisation": "Wi-Fi channel utilisation", "connection": "Connection", "interfaces": "Interfaces", "containers": "Containers", "slots": "Slots", "installed": "Installed", "runtime": "Runtime", "load_2": "Load", "input": "Input", "output": "Output", "voltage": "Voltage", "rectifier": "Rectifier", "inverter": "Inverter", "bypass_active": "Bypass active", "online_ups": "Online UPS", "mains": "Mains", "mains_2": "Mains ↓", "mains_off": "Mains off", "protection": "Protection", "self_test": "Self-test", "self_test_passed": "Self-test passed", "passed": "passed", "fully_functional": "Fully functional", "battery_charging": "Battery charging", "charging": "charging", "discharging": "discharging", "load_runs_directly_on_mains": "Load runs directly on mains", "mains_failed_load_runs_on_battery": "Mains failed, load runs on battery", "mains_failed_the_load_runs_on_battery": "Mains failed: the load runs on battery.", "power_always_flows_through_battery_and_inverter": "Power always flows through battery and inverter. If mains fails there is no transfer time.", "everything_powered": "Everything powered", "outlets": "Outlets", "current": "Current", "current_values": "Current values", "peak": "Peak", "month": "Month", "last_hour": "last hour", "restarted": "Restarted", "unreachable": "Unreachable", "device_is_not_on_the_network": "Device is not on the network", "installing_firmware": "Installing firmware", "firmware_update_available": "Firmware update available", "setting_up": "Setting up", "adopting": "Adopting", "overheating_reported": "Overheating reported", "overheating": "Overheating", "the_pdu_currently_does_not_report_the_switching": "The PDU currently does not report the switching state correctly.", "rack_thermal_sensor": "Rack thermal sensor", "days": "days", "day": "day", "h": "h", "24_h": "24 h", "other": "Other", "vs_yesterday": "vs. yesterday", "overview": "Overview", "retention": "Retention", "no_temperature_values_available": "No temperature values available.", "rear_0_u": "Rear (0 U)", "on_2": "On", "high_temperature": "High temperature", "rack_editor": "Rack editor", "loading": "Loading …", "choose_rack": "Choose rack", "edit_device": "Edit device", "choose_device": "Choose device …", "overview_home_page": "▦ Overview (home page)", "new_version_reload": "New version · reload", "the_editor_was_updated": "The editor was updated", "undo_z": "Undo (⌘Z)", "redo_z": "Redo (⇧⌘Z)", "undo": "Undo", "unsaved_changes": "Unsaved changes", "saved": "Saved", "discard": "Discard", "save": "Save", "up_one_level_esc": "Up one level (Esc)", "devices": "Devices", "home_page_next_to_the_rack": "Home page next to the rack", "passive_elements": "Passive elements", "tap_to_edit_in_the_rack_on_the_right_drag_to": "Tap to edit. In the rack on the right: drag to move, ＋ to insert.", "rack_units": "Rack units", "ups_capacity_w": "UPS capacity (W)", "door_labels": "Door & labels", "badge": "Badge", "e_g_company_name": "e.g. company name", "type_plate": "Type plate", "top_label": "Top label", "bottom_label": "Bottom label", "appearance": "Appearance", "cabinet_colour": "Cabinet colour", "light_grey_default": "Light grey (default)", "white": "White", "graphite": "Graphite", "black": "Black", "custom_colour": "Custom colour …", "custom_colour_2": "Custom colour", "perforated": "Perforated", "glass": "Glass", "solid": "Solid", "no_door": "No door", "label_colour": "Label colour", "display": "Display", "show_on": "Show on", "back_to_overview_after": "Back to overview after", "never": "never", "after_30_seconds": "after 30 seconds", "after_1_minute": "after 1 minute", "after_2_minutes": "after 2 minutes", "after_5_minutes": "after 5 minutes", "width_px": "Width (px)", "height_px": "Height (px)", "diagonal_inch": "Diagonal (inch)", "scaling": "Scaling", "cells": "cells", "the_view_is_built_for_this_area_and_scaled": "The view is built for this area and scaled everywhere (“Rack” page, cards, Pi). “Dashboard only” always uses the whole available area.", "7_pi_display_portrait": "7\" Pi display portrait", "7_pi_display_landscape": "7\" Pi display landscape", "hd_portrait_720_1280": "HD portrait 720 × 1280", "custom_size": "Custom size", "dashboard_only_use_the_whole_area": "Dashboard only – use the whole area", "insert_device": "Insert device", "first_free_slot_from_the_top": "first free slot from the top", "tip_tap_in_the_rack_to_choose_the_position_or": "Tip: tap ＋ in the rack to choose the position, or drag a template into the rack.", "servers_storage": "Servers & storage", "accessories": "Accessories", "sfp_switch": "SFP switch", "patch_panel": "Patch panel", "fibre_patch_panel": "Fibre patch panel", "server_1_u": "Server 1 U", "server_2_u": "Server 2 U", "server_4_u": "Server 4 U", "recorder": "Recorder", "generic_device": "Generic device", "battery_pack": "Battery pack", "pdu_rear": "PDU (rear)", "shelf": "Shelf", "module_frame": "Module frame", "cable_management": "Cable management", "blanking_panel": "Blanking panel", "server_with_fan_panel": "Server with fan panel", "ups_battery": "UPS / battery", "general": "General", "model": "Model", "template": "Template", "height_u": "Height (U)", "front_in_u": "Front in U", "passive_no_sensors": "Passive (no sensors)", "not_always_on": "Not always on", "off_grey_no_warnings": "Off = grey, no warnings", "detect_off_via": "Detect “off” via", "automatic_all_values_gone": "automatic (all values gone)", "power_on_button": "Power-on button", "none": "– none –", "belongs_to_e_g_battery_pack_ups": "Belongs to (e.g. battery pack → UPS)", "standalone": "– standalone –", "linked": "linked", "not_linked": "not linked", "not_linked_yet": "Not linked yet", "not_linked_2": "Not linked", "linked_to_home_assistant": "Linked to Home Assistant", "detected_automatically": "Detected automatically:", "link_another_device": "Link another device", "search_device": "Search device", "name_model_or_manufacturer": "Name, model or manufacturer", "no_match": "No match", "name_outlets": "Name outlets", "modules": "Modules", "photos": "Photos", "photo_available": "Photo available", "front": "Front", "no_photo": "No photo", "upload_2": "Upload", "remove": "Remove", "vertical_image_rear_view": "Vertical image (rear view)", "remove_2": "🗑 Remove", "remove_device": "🗑 Remove device", "copy_to_another_rack": "Copy to another rack …", "copy_device_with_its_popup_to_another_rack": "Copy device with its popup to another rack", "grid_used": "Grid used", "tap_new_modules_in_the_library_in_the_middle_or": "Tap new modules in the library in the middle or drag them into the popup. In the popup: ⋮⋮ to move, drag the corner to resize.", "the_home_page_next_to_the_rack_is_a_grid_like": "The home page next to the rack is a grid like the popups: add cards from the library, ⋮⋮ to move, drag the corner to resize, tap for settings and entities.", "restore_default": "Restore default", "remove_custom_overview": "Remove custom overview", "back_to_the_fixed_default_overview": "Back to the fixed default overview", "search_modules": "Search modules …", "tap_or_drag_into_the_popup": "tap or drag into the popup", "all": "All", "recently_used": "Recently used", "no_data_for_this_device": "No data for this device", "choose_entities_after_adding": "Choose entities after adding", "resize": "Resize", "move": "Move", "type_a_name": "Type a name", "upload_front_photo": "Upload front photo", "photo": "📷 Photo", "size_width": "Size · width", "display_style": "Display style", "title": "Title", "subtitle": "Subtitle", "e_g_network": "e.g. Network", "warning_from": "Warning from", "critical_from": "Critical from", "entity": "+ Entity", "key_figure": "+ Key figure", "search_entity": "Search entity", "name_or_entity_id": "Name or entity_id", "display_name": "Display name", "no_entity_yet": "No entity yet", "automatic": "Automatic", "key_figures_at_the_top_up_to_4_empty_automatic": "Key figures at the top (up to 4). Empty = automatic (e.g. uptime, clients, ports, throughput).", "suggestions_from_this_device": "Suggestions from this device", "type_to_search_all_entities": "Type to search all entities", "this_device": "this device", "always_on_top": "always on top", "tiles": "Tiles", "tiles_with_24_h_curve": "Tiles with 24 h curve", "compact_rows": "Compact (rows)", "hardware_temperatures_fans": "Hardware (temperatures + fans)", "bars": "Bars", "thermometer_temperatures": "Thermometer (temperatures)", "curve_tiles": "Curve tiles", "trackable_history": "Trackable history", "value": "Value", "value_with_24_h_curve": "Value with 24 h curve", "list_problems_first": "List (problems first)", "front_bays": "Front bays", "columns": "Columns", "cache_drives_sit_in_bays_otherwise_internal": "Cache drives sit in bays (otherwise “Internal”)", "done": "Done", "remove_module": "🗑 Remove module", "module_moved": "Module moved", "no_room_there_reverted": "No room there – reverted", "no_free_space": "No free space", "no_free_space_at_the_front": "No free space at the front", "uploading_image": "Uploading image …", "up": "Up", "down": "Down", "my_rack": "My rack", "close_esc": "Close (Esc)", "discard_all_unsaved_changes": "Discard all unsaved changes?", "unsaved_changes_will_be_lost_switch_anyway": "Unsaved changes will be lost. Switch anyway?", "unsaved_changes_will_be_lost_when_reloading": "Unsaved changes will be lost when reloading. Reload anyway?", "remove_the_custom_overview_and_return_to_the": "Remove the custom overview and return to the default overview?", "tap_a_free_rack_unit_to_insert_a_device_or_a": "Tap a free rack unit to insert a device, or a device to edit it.", "values_as_tiles": "Values as tiles", "values_with_curves": "Values with curves", "single_value": "Single value", "single_value_with_curve": "Single value with curve", "curves": "Curves", "gauge": "Gauge", "key_figure_2": "Key figure", "progress": "Progress", "bar_chart": "Bar chart", "status_chips": "Status chips", "switches_2": "Switches", "actions": "Actions", "heading": "Heading", "clock": "Clock", "note": "Note", "note_enter_text_in_the_module_panel": "Note – enter text in the module panel", "section": "Section", "header": "Header", "server_rack_with_live_values": "Server rack with live values", "values_gauges": "Values & gauges", "charts": "Charts", "controls": "Controls", "power_ups": "Power & UPS", "storage_video": "Storage & video", "text_other": "Text & other", "values": "Values", "energy_flow": "Energy flow", "drive_bays": "Drive bays", "key_figure_bar": "Key figure bar", "power_overview": "Power (overview)", "temperature_overview": "Temperature (overview)", "notices_overview": "Notices (overview)", "all_ports_with_speed_poe_and_live_throughput": "All ports with speed, PoE and live throughput", "outlets_of_a_pdu_with_assignments": "Outlets of a PDU with assignments", "load_as_bars_0100_or_custom_range": "Load as bars (0–100 % or custom range)", "usage_state_cache_pools_and_parity_of_an_array": "Usage, state, cache pools and parity of an array", "any_entities_as_tiles": "Any entities as tiles", "cpu_ram_and_temperature_over_24_h": "CPU, RAM and temperature over 24 h", "download_and_upload_over_24_h": "Download and upload over 24 h", "one_value_as_a_bar_with_min_max": "One value as a bar with min/max", "one_value_as_a_semicircle_gauge_with_min_max": "One value as a semicircle gauge with min/max and warning colours", "one_value_as_a_ring_e_g_load_in": "One value as a ring (e.g. load in %)", "one_value_as_its_own_tile_optionally_with_a_24": "One value as its own tile – optionally with a 24 h curve", "one_to_three_measurements_over_24_h": "One to three measurements over 24 h", "input_and_output_voltage_over_24_h": "Input and output voltage over 24 h", "free_text_e_g_patch_panel_assignments": "Free text, e.g. patch panel assignments", "big_number_with_change_vs_yesterday": "Big number with change vs. yesterday", "internet_poe_pdu_ups_at_a_glance": "Internet, PoE, PDU, UPS at a glance", "tiles_with_the_key_measurements": "Tiles with the key measurements", "rack_power_ups_battery_consumers_and_24_h": "Rack power, UPS battery, consumers and 24 h history", "several_states_as_compact_chips_with_traffic": "Several states as compact chips with traffic lights", "name_model_position_front_image_up_to_4_key": "Name, model, position, front image, up to 4 key figures", "online_ups_mains_battery_load": "Online UPS: mains, battery, load", "poe_power_in_total_and_per_port": "PoE power in total and per port", "control_switches_lights_and_fans_directly": "Control switches, lights and fans directly", "bays_with_parity_data_and_cache_temperature": "Bays with parity, data and cache, temperature, usage and spin-down", "bays_state_and_usage": "Bays, state and usage", "run_scripts_scenes_and_buttons": "Run scripts, scenes and buttons", "retention_recording_types_cameras": "Retention, recording types, cameras", "camera_still_image_refreshes_continuously": "Camera still image (refreshes continuously)", "hourly_values_of_the_last_24_h_as_bars": "Hourly values of the last 24 h as bars", "faults_notices_and_info_of_the_device": "Faults, notices and info of the device", "title_with_subtitle_for_structure": "Title with subtitle for structure", "time_and_date": "Time and date", "warnings_and_faults_of_all_devices": "Warnings and faults of all devices", "warmest_device_and_temperatures_of_all_devices": "Warmest device and temperatures of all devices", "states_as_a_list_with_traffic_lights": "States as a list with traffic lights", "cpu_load": "CPU load", "memory_usage": "Memory usage", "disk_usage": "Disk usage", "uptime_2": "Uptime", "cpu_temperature": "CPU temperature", "poe_power": "PoE power", "recording_capacity": "Recording capacity", "1_day": "1 day", "drops": "drops", "wan_drops": "WAN drops", "width": "Width", "height": "Height", "rows": "rows", "full": "full", "row": "row", "lower": "Lower", "taller": "Taller", "no_room_for_that_in_the_grid": "No room for that in the grid", "language": "Language", "automatic_ha_user_language": "Automatic (HA user language)", "loss": "Loss", "numbering": "Numbering", "by_row_1_2_3_to_the_right": "by row (1 2 3 … to the right)", "by_column_1_2_3_downwards": "by column (1 2 3 … downwards)", "disk_bay": "Disk → bay", "empty_next_free_bay_duplicate_numbers_the_first": "Empty = next free bay. Duplicate numbers: the first disk wins.", "number_of_slots": "Number of slots", "installed_2": "installed", "planned": "planned", "description_e_g_lan_oled": "Description, e.g. LAN · OLED", "entity_for_live_value_optional": "Entity for live value (optional)", "entering_a_name_occupies_the_slot_clearing_it": "Entering a name occupies the slot; clearing it frees the slot. With an entity the popup shows its current value.", "create_ha_entities": "Create HA entities", "state_faults_warnings_hottest_device_for": "State, faults, warnings, hottest device – for automations and notifications", "electricity_price_kwh": "Electricity price (€/kWh)", "or_price_entity": "or price entity", "e_g_0_30": "e.g. 0.30", "export": "⇩ Export", "import": "⇧ Import", "save_the_rack_with_devices_popups_and_settings": "Save the rack with devices, popups and settings as a file", "rack_exported": "Rack exported", "night_mode_from": "Night mode from", "until": "until", "brightness_at_night": "Brightness at night", "100_dark_only": "100 % (dark only)", "heat": "Heat", "heat_map": "Heat map", "a_heat_button_below_the_rack_colours_devices_by": "A “Heat” button below the rack colours devices by temperature (needs two devices with temperatures)", "on_the_shelf": "On the shelf", "cloud_key_small_controller": "Cloud Key / small controller", "mini_pc": "Mini PC", "small_nas": "small NAS", "generic_box": "Generic box", "access_point": "Access point", "is_this_device_state_led": "is this device (state, LED)", "device_on_the_shelf": "＋ Device on the shelf", "small_devices_lying_on_the_shelf_the_linked_ha": "Small devices lying on the shelf. The linked HA device shows its state on the LED.", "assignment_from_entity_optional": "Assignment from entity (optional)", "entity_does_not_provide_an_assignment_yet": "Entity does not provide an assignment (yet) – manual values apply", "horizontal_tiles": "Horizontal (tiles)", "vertical_like_the_enclosure": "Vertical (like the enclosure)", "screen_touchkio": "Screen (TouchKio)", "none_2": "– none –", "switch_off_after": "Switch off after", "never_always_on": "never (always on)", "1_minute": "1 minute", "2_minutes": "2 minutes", "5_minutes": "5 minutes", "10_minutes": "10 minutes", "30_minutes": "30 minutes", "without_touch_ha_switches_the_screen_off_a": "Without touch HA switches the screen off; a touch switches it back on.", "vertical_all_in_one_row": "vertical: all in one row", "rack_temperature": "Rack temperature", "ntp_time_server": "NTP time server", "cloud_key_module": "Cloud Key module", "width_in_slots": "Width in slots", "slot": "slot", "slots_2": "slots", "edit_own_popup": "Edit own popup ›", "own_popup_link_ha_device": "+ Own popup (link HA device)", "popup_removed": "Popup removed", "remove_device_2": "Remove device", "meter": "Meter", "today_2": "Today", "restarted_with_firmware_n": "Restarted with firmware {0}", "started_with_firmware_n": "Started with firmware {0}", "n_assignments_from_the_entity_manual_values": "{0} assignments from the entity · manual values only apply to disks without an entry", "n_devices": "{0} devices", "on_shelf_u_n": "on shelf U {0}", "import_failed_n": "Import failed: {0}", "create_n_as_a_new_rack": "Create “{0}” as a new rack?", "n_imported": "“{0}” imported", "today_n": "today · ≈ {0}", "n_month": "≈ {0} / month", "n_rows": "{0} rows", "n_of_12_columns": "{0} of 12 columns", "n_n_drag_the_corner_in_the_preview_or_use_arrow": "{0} × {1} · drag the corner in the preview or use arrow keys (⇧ = size)", "bullet_n": "· {0}", "n_days": "{0} days", "n_h": "{0} h", "n_u": "{0} U", "from_u_n": "from U {0}", "n_u_from_u_n": "{0} U · from U {1}", "n_u_does_not_fit_here": "{0} U · does not fit here", "n_of_n_u": "{0} of {1} U", "n_of_n_used": "{0} of {1} used", "n_of_n_used_n_planned": "{0} of {1} used · {2} planned", "n_of_n_connected": "{0} of {1} connected", "n_of_n_cameras": "{0} of {1} cameras", "n_faults": "{0} faults", "n_notices": "{0} notices", "n_with_problems": "{0} with problems", "n_warm": "{0} warm", "n_more": "{0} more", "n_more_2": "+{0} more", "n_devices_powered": "{0} devices powered", "n_outlets": "{0} outlets", "n_errors": "{0} errors", "n_u_n_used_n_active_devices": "{0} U · {1} used · {2} active devices", "n_n_u_n_used_n_items": "{0} · {1} U · {2} used · {3} items", "n_of_ups_capacity_via_pdu": "{0} % of UPS capacity · via PDU", "n_of_ups_capacity": "{0} % of UPS capacity", "ups_load_n": "UPS load {0} %", "ups_battery_n_percent_n_minutes_runtime": "UPS battery {0} percent, {1} minutes runtime", "warmest_device_n_degrees": "Warmest device {0} degrees", "currently_n": "currently {0}", "limit_n": "Limit {0}", "temperature_above_n": "Temperature above {0}", "n_at_n": "{0} at {1}", "since_n_values_appear_here_automatically_once": "since {0}. Values appear here automatically once it is switched on.", "since_n": "since {0}", "battery_n": "Battery {0}", "bay_n": "Bay {0}", "internal_n": "Internal {0}", "disk_n": "Disk {0}", "parity_n": "Parity {0}", "cache_n": "Cache {0}", "n_used": "{0} % used", "fans_n": "Fans ({0})", "n_peak_n": "Ø {0} · peak {1}", "n_y_n_mo_ago": "{0} y {1} mo ago", "n_ago": "{0} ago", "automatic_n": "automatic ({0})", "after_n_seconds": "after {0} seconds", "after_n_minutes": "after {0} minutes", "size_width_n_of_12_height_n_rows": "Size · width {0} of 12, height {1} rows", "n_n_in_popup": "{0} × {1} · in popup", "of_n_rows": "of {0} rows", "of_n_rows_too_tall": "of {0} rows – too tall", "n_n_px_n_ppi_detail_view_grid": "{0} × {1} px · {2} ppi · detail view grid", "n_no_data_for_n_yet_choose_entities_in_the": "{0} · No data for “{1}” yet – choose entities in the module after adding", "n_already_in_the_popup": "{0} · already in the popup", "sizes_as_in_the_popup_preview_with_data_from_n": "Sizes as in the popup, preview with data from “{0}”.", "which_device_is_plugged_into_which_outlet_can": "Which device is plugged into which outlet can be set in the rack editor on the device “{0}”.", "n_removed": "“{0}” removed", "module_n_removed": "Module “{0}” removed", "n_added": "“{0}” added", "n_inserted_at_u_n": "“{0}” inserted at U {1}", "n_inserted_rear": "“{0}” inserted (rear)", "n_moved_to_u_n": "“{0}” moved to U {1}", "size_n_n": "Size {0} × {1}", "n_copied_to_n": "“{0}” copied to “{1}”", "no_room_for_n_u_in_n": "No room for {1} U in “{0}”", "replace_n_in_n_popup_photos_and_link_are_copied": "Replace “{0}” in “{1}”? Popup, photos and link are copied, its position there stays.", "copy_n_with_its_popup_to_n": "Copy “{0}” with its popup to “{1}”?", "copy_failed_n": "Copy failed: {0}", "upload_failed_n": "Upload failed: {0}", "not_saved_n": "Not saved: {0}", "no_room_for_n_u_here": "No room for {0} U here", "n_device_s_do_not_fit_in_n_u": "{0} device(s) do not fit in {1} U:", "insert_n": "Insert {0}", "u_n_insert_device": "U {0}: insert device", "n_u_n": "{0}, U {1}", "n_rear": "{0}, rear", "port_n_n": "Port {0}, {1}", "n_rear_2": "{0} (rear)", "remove_n_from_the_rack": "Remove “{0}” from the rack?", "online_ups_n": "Online UPS · {0}", "wled_n": "WLED · {0}", "of_n": "of {0}", "value_n_2": "{0} ·", "part_of_n": "part of {0}", "n_slots": "{0} slots", "1_slot": "1 slot", "popup_for_n_created_now_pick_the_ha_device": "Popup for “{0}” created – now pick the HA device", "slots_nn": "Slots {0}–{1}", "slot_n": "Slot {0}", "n_slot_n": "{0} · slot {1}", "u_n": "U {0}", "total_power": "Total power", "updated_to_n": "Updated to {0}", "new_firmware": "new firmware", "n_is_back_online": "{0} is back online", "n_was_offline": "{0} was offline", "poe_on_port_n_switched_on": "PoE on port {0} switched on", "poe_on_port_n_switched_off": "PoE on port {0} switched off", "switched_on_when_needed": "switched on when needed", "state_n": "State: {0}", "power_output": "Power", "ip_address": "IP address", "connection_type": "Connection", "wifi": "Wi-Fi", "wired": "Wired", "battery_source": "Battery", "error": "Error", "no_test": "no test", "network_card": "Network card", "battery_temp_short": "Battery temp.", "battery_date": "Battery date", "battery_operation": "On battery", "n_alarms_at_the_ups": "{0} alarm(s) at the UPS", "self_test_n": "Self-test: {0}", "bay_n_reports_a_problem": "Bay {0} ({1}) reports a problem", "switch_wled_on_or_off": "Switch WLED on or off", "according_to_the_pdu": "according to the PDU", "input_min": "Input min", "check_n_drive": "Check {0} drive", "check_n_drives": "Check {0} drives", "check_drives": "Check drives", "check": "Check", "drives": "drives", "battery_mode": "On battery", "mains_failed_battery_supplies": "Mains failed – battery supplies the load", "n_years_n_months": "{0} y {1} mo", "n_months": "{0} mo", "too_warm": "too warm", "load_lower": "load", "n_min": "{0} min", "on_shelf": "on shelf", "disconnected_lower": "disconnected", "disk": "Disk", "disks_and_shares_after_start": "Disks and shares are only available after the array has started.", "module_error": "Module error", "no_ha_device_linked": "No Home Assistant device is linked to this device yet. As soon as there is an integration (e.g. Unraid), it can be linked in the editor; temperatures, load and disks then appear here.", "card_rack_id": "Rack ID (empty = first rack)", "card_view": "View", "card_height": "Height in pixels", "card_view_full": "Rack with detail view", "card_view_rack": "Rack with status only", "pdu_rear_label": "PDU, rear", "already_in_the_popup": "already in the popup", "in_the_popup": "in popup", "n_devices_do_not_fit": "{0} device(s) do not fit into {1} U:", "too_high": "too high", "default_oled_lan": "Default (OLED + LAN)", "half_or_full_width": "Half or full width", "entity_word": "Entity", "already_used_by_n": "already used by “{0}”", "too_high_lower_modules_cut_off": "too high, the lower modules are cut off", "module": "Module", "n_inserted_in_u_n": "“{0}” inserted in U {1}", "no_devices": "no devices", "last_24_hours": "last 24 hours", "double_conversion": "double conversion", "at_time": "at", "n_of_n_on": "{0} of {1} on", "n_device_powered": "{0} device powered", "n_on": "{0} on", "mod.batteries.0": "Batteries", "mod.batteries.1": "Battery levels of several devices as a list, weakest first", "mod.batteries.2": "Warning below (%)", "mod.batteries.3": "Critical below (%)", "mod.batteries.4": "Sort order", "mod.batteries.5": "Weakest first", "mod.batteries.6": "By name"}};
// Sprache: fest im Rack eingestellt (Anzeige → Sprache) oder die des HA-Benutzers (z. B. Kiosk-Benutzer auf dem Pi)
let RD_LANG = "en", RD_RAW = "en", RD_FORCE = "", RD_USER = "en";
function TR(key, ...args) {
  const s = RD_TEXT[RD_LANG]?.[key] ?? RD_TEXT.en[key] ?? key;
  return args.length ? s.replace(/\{(\d)\}/g, (_, i) => args[+i] ?? "") : s;
}
const rdIsDe = () => RD_LANG === "de";
// Zahlen und Datumsangaben folgen der Sprache des Benutzers, auch wenn es dafür keine Textdatei gibt
const rdLoc = () => RD_RAW.startsWith("de") ? "de-DE" : RD_RAW.startsWith("en") ? "en-GB" : RD_RAW;
// Tabellen mit Texten: je Sprache einmal aufbauen (Aufruf liefert die Fassung der aktuellen Sprache)
function rdPerLang(make) { let lang, value; return () => { if (lang !== RD_LANG) { lang = RD_LANG; value = make(); } return value; }; }
// Wer Texte gezeichnet hat, zeichnet bei einem Sprachwechsel neu
const RD_ON_LANG = new Set();
function rdOnLang(fn) { RD_ON_LANG.add(fn); return () => RD_ON_LANG.delete(fn); }
function rdApply() {
  const raw = RD_FORCE || RD_USER, short = raw.split("-")[0], lang = RD_TEXT[raw] ? raw : RD_TEXT[short] ? short : "en";
  if (raw === RD_RAW && lang === RD_LANG) return;
  const wasDe = rdIsDe(); RD_RAW = raw; RD_LANG = lang;
  RD_ON_LANG.forEach(fn => { try { fn(); } catch (e) { console.warn("Rack Display:", e); } });
  if (wasDe !== rdIsDe()) RD_OBS.forEach(r => rdIsDe() ? rdRestore(r) : rdTrNode(r));
}
function rdSetLang(h) { RD_USER = String(h?.locale?.language || h?.language || "en").toLowerCase(); rdApply(); }
function rdForceLang(l) { RD_FORCE = l ? String(l).toLowerCase() : ""; rdApply(); }
// Feste Texte im Grundgerüst (rack.html): data-i18n = Text, data-i18n-label = aria-label
function rdFill(root) {
  root.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = TR(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-label]").forEach(el => el.setAttribute("aria-label", TR(el.dataset.i18nLabel)));
}
// Katalog (blocks.json): beim Build markierte Texte ("\u0001schluessel") in der aktuellen Sprache
function rdResolve(o) {
  if (typeof o === "string") return o[0] === "\u0001" ? TR(o.slice(1)) : o;
  if (Array.isArray(o)) return o.map(rdResolve);
  return o && typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, rdResolve(v)])) : o;
}
// Beschriftungen, die das Backend aus den Gerätevorlagen in gespeicherte Racks übernimmt (blocks.json → templates):
// in jeder Sprache erkennen und in der aktuellen zeigen
const RD_DEFAULT_KEYS = ["load_2", "power", "total_power"];
const RD_DEFAULT = new Map(RD_DEFAULT_KEYS.flatMap(k => Object.values(RD_TEXT).map(t => [t[k], k])).filter(x => x[0]));
const rdLabel = s => RD_DEFAULT.has(s) ? TR(RD_DEFAULT.get(s)) : s;

/* ---------- Altbestand: deutsche Texte in gespeicherten Racks ----------
   Bis 0.1.x war Deutsch die Quellsprache; Racks aus dieser Zeit enthalten deutsche Standardbeschriftungen.
   Für andere Sprachen ersetzt ein Beobachter gezeichnete Texte, die genau einem deutschen Text entsprechen.
   Bei Deutsch läuft nichts davon (keine Kosten auf dem Pi). */
const RD_LEGACY = new Map();
{
  const de = RD_TEXT.de || {}, en = RD_TEXT.en, enTexts = new Set(Object.values(en));
  // nicht anfassen: Texte mit Platzhaltern und deutsche Texte, die zugleich ein englischer Text sind
  for (const [k, v] of Object.entries(de)) if (!/\{\d\}/.test(v) && !enTexts.has(v) && !RD_LEGACY.has(v)) RD_LEGACY.set(v, k);
}
// Übersetzte Texte merken sich ihr Original, damit ein Wechsel zurück auf Deutsch ohne Neuzeichnen geht
const RD_ORIG = new WeakMap(), RD_ORIG_ATTR = new WeakMap();
function rdRestore(root) {
  const els = root.nodeType === 1 ? [root, ...root.querySelectorAll("*")] : [...root.querySelectorAll("*")];
  for (const el of els) {
    const oa = RD_ORIG_ATTR.get(el); if (oa) { for (const [a, v] of Object.entries(oa)) el.setAttribute(a, v); RD_ORIG_ATTR.delete(el); }
    for (const c of el.childNodes) if (c.nodeType === 3 && RD_ORIG.has(c)) { c.nodeValue = RD_ORIG.get(c); RD_ORIG.delete(c); }
  }
}
// Einzelnen Text ersetzen (Leerraum am Rand bleibt erhalten)
function rdT(s) {
  if (rdIsDe() || !s) return s;
  const k = s.trim(), key = k && RD_LEGACY.get(k);
  if (!key) return s;
  const r = TR(key);
  return r === k ? s : s.replace(k, r);
}
const RD_ATTRS = ["title", "aria-label", "placeholder", "data-confirm"];
function rdTrNode(n) {
  if (rdIsDe() || !n) return;
  if (n.nodeType === 3) { const v = rdT(n.nodeValue); if (v !== n.nodeValue) { RD_ORIG.set(n, n.nodeValue); n.nodeValue = v; } return; }
  if (n.nodeType !== 1 && n.nodeType !== 11) return;
  if (n.nodeName === "STYLE" || n.nodeName === "SCRIPT") return;
  const els = n.nodeType === 1 ? [n, ...n.querySelectorAll("*")] : [...n.querySelectorAll("*")];
  for (const el of els) {
    if (el.nodeName === "STYLE" || el.nodeName === "SCRIPT") continue;
    for (const a of RD_ATTRS) { const v = el.getAttribute(a); if (v) { const t = rdT(v); if (t !== v) { const o = RD_ORIG_ATTR.get(el) || {}; o[a] ??= v; RD_ORIG_ATTR.set(el, o); el.setAttribute(a, t); } } }
    if (el.isContentEditable) continue;
    for (const c of el.childNodes) if (c.nodeType === 3) { const t = rdT(c.nodeValue); if (t !== c.nodeValue) { RD_ORIG.set(c, c.nodeValue); c.nodeValue = t; } }
  }
}
const RD_OBS = new Set();
// Wurzel (Shadow Root) beobachten: alles, was neu gezeichnet wird, wird geprüft
function rdObserve(root) {
  if (!root || root._rdObs) return;
  root._rdObs = new MutationObserver(ms => {
    if (rdIsDe()) return;
    for (const m of ms) {
      if (m.type === "characterData") rdTrNode(m.target);
      else if (m.type === "attributes") { const v = m.target.getAttribute(m.attributeName); const t = v && rdT(v); if (t && t !== v) { const o = RD_ORIG_ATTR.get(m.target) || {}; o[m.attributeName] = v; RD_ORIG_ATTR.set(m.target, o); m.target.setAttribute(m.attributeName, t); } }
      else m.addedNodes.forEach(rdTrNode);
    }
  });
  root._rdObs.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: RD_ATTRS });
  RD_OBS.add(root); rdTrNode(root);
}


/* Animierte Skizze eines Moduls (Editor: Module ohne Daten zeigen, wie sie aussehen werden) */
function rdSkeleton(type) {
  const i = (n, cls = "") => Array.from({ length: n }, () => `<i class="${cls}"></i>`).join("");
  const K = {
    ports: () => `<div class="sk-ports">${i(12)}</div><div class="sk-ports">${i(12)}</div><div class="sk-lines"><i style="width:60%"></i></div>`,
    poe: () => `<div class="sk-big"></div><div class="sk-bar"><i></i></div><div class="sk-ports">${i(8)}</div>`,
    bays: () => `<div class="sk-bays">${i(24)}</div>`, disks: () => `<div class="sk-ring"></div><div class="sk-bays">${i(4)}</div>`,
    values: () => `<div class="sk-tiles">${i(3)}</div>`, tiles: () => `<div class="sk-tiles">${i(3)}</div>`, header: () => `<div class="sk-tiles">${i(4)}</div>`, system: () => `<div class="sk-rows">${i(3)}</div>`,
    bars: () => `<div class="sk-bars">${i(4)}</div>`, progress: () => `<div class="sk-bars">${i(1)}</div>`, outlets: () => `<div class="sk-ports">${i(12)}</div><div class="sk-ports">${i(12)}</div>`,
    chart: () => SK_CHART, histogram: () => `<div class="sk-hist">${i(12)}</div>`, internet: () => SK_CHART, voltage: () => SK_CHART, flow: () => `<div class="sk-flow"><i></i><i></i><i></i></div>`,
    gauge: () => `<div class="sk-ring half"></div>`, ring: () => `<div class="sk-ring"></div>`, stat: () => `<div class="sk-big"></div><div class="sk-lines"><i style="width:40%"></i></div>`,
    chips: () => `<div class="sk-chips">${i(5)}</div>`, status: () => `<div class="sk-chips">${i(5)}</div>`, switch: () => `<div class="sk-rows tg">${i(3)}</div>`, button: () => `<div class="sk-chips big">${i(3)}</div>`,
    messages: () => `<div class="sk-rows">${i(2)}</div>`, recording: () => `<div class="sk-ring"></div><div class="sk-bars">${i(3)}</div>`, camera: () => `<div class="sk-cam"></div>`,
    array: () => `<div class="sk-big"></div><div class="sk-bar"><i></i></div><div class="sk-bars">${i(2)}</div>`, clock: () => `<div class="sk-big c"></div>`,
  };
  return `<div class="sk" aria-hidden="true">${(K[type] || (() => `<div class="sk-lines">${i(3)}</div>`))()}</div>`;
}
const SK_CHART = `<svg class="sk-chart" viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 45 C20 40 30 20 50 28 S80 50 100 34 S140 10 160 22 S190 30 200 18"/></svg>`;
function createApp(ROOT, WRAP) {
  let DEAD = false;
  rdObserve(ROOT);
  let RACK = { name: "", units: 42, badge: "", plate: "", label1: "", label2: "", power: {}, color: "light", door: "mesh", labelColor: "" };
  // Während des Hereingleitens kein Neuaufbau des Popups (sonst startet die Animation von vorn und es „wackelt“)
  const NAV = { until: 0, now: false, pending: false };
  let DEVICES = [], ZERO_U = [], SLOTTED = [], PDU_IMG = "", RAW = null, HASS = null;
  let ARMED = null;
  const S = { sel: null, mode: "view", door: true, side: "front", port: null };
  const $ = id => ROOT.getElementById(id);
  const nf = { format: x => new Intl.NumberFormat(rdLoc()).format(x) };
  const css = v => getComputedStyle(WRAP).getPropertyValue(v).trim();
  const allDevices = () => [...DEVICES, ...ZERO_U, ...SLOTTED];
  const members = id => DEVICES.filter(d => d.id === id || d.group === id).sort((a, b) => b.u - a.u);
  const selOf = d => d.group || d.id;
  const isSel = d => S.sel && selOf(d) === S.sel;
  const byId = id => allDevices().find(d => d.id === id);

  /* ---------- Werte aus Home Assistant ---------- */
  // Alles aus Home Assistant und aus der Rack-Konfiguration landet in HTML-Vorlagen: Texte werden deshalb beim Eintritt
  // einmal maskiert (Zustände je Zustandsobjekt zwischengespeichert), damit Namen oder Zustände mit Markup nie als HTML wirken
  const escH = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const unescH = s => String(s ?? "").replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }[e]));
  const escDeep = v => typeof v === "string" ? escH(v) : Array.isArray(v) ? v.map(escDeep) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, escDeep(x)])) : v;
  const unescDeep = v => typeof v === "string" ? unescH(v) : Array.isArray(v) ? v.map(unescDeep) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, unescDeep(x)])) : v;
  const SAFE = new WeakMap();
  const st = id => { const s = id && HASS ? HASS.states[id] : undefined; if (!s) return s;
    let c = SAFE.get(s); if (!c) { c = { ...s, state: escH(s.state), attributes: escDeep(s.attributes) }; SAFE.set(s, c); } return c; };
  const ok = s => s && !["unknown", "unavailable", ""].includes(s.state);
  const num = id => { const s = st(id); if (!ok(s)) return null; const x = parseFloat(s.state); if (isNaN(x)) return null;
    const u = s.attributes.unit_of_measurement; return u === "kW" ? x * 1000 : x; };
  const round = (x, d = 0) => x == null ? null : Math.round(x * 10 ** d) / 10 ** d;
  const fmt = (x, d = 0) => x == null ? "–" : x.toLocaleString(rdLoc(), { maximumFractionDigits: d, minimumFractionDigits: d });
  const since = id => { const s = st(id); if (!ok(s)) return null;
    let sec; const x = parseFloat(s.state);
    if (s.attributes.unit_of_measurement === "s") sec = x; else { const t = Date.parse(s.state); if (isNaN(t)) return null; sec = (Date.now() - t) / 1000; }
    const d = Math.floor(sec / 86400); return d >= 1 ? `${d} ${d === 1 ? TR("day") : TR("days")}` : TR("n_h", Math.floor(sec / 3600)); };

  /* ---------- Verläufe (24 Std.) aus der Historie ---------- */
  const HIST = { data: {}, raw: {}, tried: new Set(), fine: new Set(), energyStart: {}, loading: false, last: 0, want: new Set() };
  const HS = (entity, fallback) => { const h = entity && HIST.data[entity]; if (h && h.length > 1) return h;
    const cur = entity ? num(entity) : null; return Array(49).fill(cur ?? fallback ?? 0); };
  // 24-Std.-Verläufe: zuerst aus den 5-Minuten-Statistiken des Recorders (je Sensor höchstens 288 Werte, klein und schnell),
  // nur Sensoren ohne Statistik über die Historie. Erneut geladen wird alle 5 Minuten oder wenn neue Sensoren dazukommen.
  async function loadHistory(force) {
    if (HIST.loading || !HASS) return;
    const ids = [...HIST.want].filter(Boolean); if (!ids.length) return;
    const fresh = ids.filter(id => !HIST.tried.has(id));
    if (!fresh.length && Date.now() - HIST.last < (force ? 60e3 : 5 * 60e3)) return;
    HIST.loading = true;
    const end = new Date(), start = new Date(end - 24 * 3600e3), midnight = new Date(); midnight.setHours(0, 0, 0, 0);
    const take = (id, pts) => {
      if (!pts.length) return;
      const unitKw = st(id)?.attributes.unit_of_measurement === "kW";
      const out = []; let k = 0, cur = pts[0][1];
      for (let i = 0; i < 49; i++) { const t = +start + i * 1800e3; while (k < pts.length && pts[k][0] <= t) cur = pts[k++][1]; out.push(unitKw ? cur * 1000 : cur); }
      const now = num(id); if (now != null) out[48] = now;
      HIST.data[id] = out; HIST.raw[id] = pts;
      const first = pts.find(p => p[0] >= +midnight); if (first) HIST.energyStart[id] = first[1];
    };
    try {
      let rest = ids;
      try {
        // Stundenwerte genügen für die kleinen Kurven; 5-Minuten-Werte nur für den verfolgbaren Verlauf
        const ask = (sids, period) => sids.length ? HASS.connection.sendMessagePromise({ type: "recorder/statistics_during_period", start_time: start.toISOString(), end_time: end.toISOString(),
          statistic_ids: sids, period, types: ["mean", "state"] }) : Promise.resolve({});
        const fine = ids.filter(id => HIST.fine.has(id)), [hourly, five] = await Promise.all([ask(ids.filter(id => !HIST.fine.has(id)), "hour"), ask(fine, "5minute")]);
        const stats = { ...hourly, ...five };
        for (const [id, rows] of Object.entries(stats)) {
          const half = (HIST.fine.has(id) ? 150e3 : 1800e3);
          const pts = rows.map(r => [(typeof r.start === "number" ? r.start : Date.parse(r.start)) + half, r.mean ?? r.state]).filter(p => p[1] != null && !isNaN(p[1]));
          take(id, pts);
        }
        rest = ids.filter(id => !stats?.[id]?.length);
      } catch (e) { /* ältere HA-Version: alles über die Historie */ }
      // Energiezähler: Stand um Mitternacht direkt aus der Historie (Statistiken können Lücken haben, z. B. nach einem Neustart)
      const eIds = ids.filter(id => st(id)?.attributes.device_class === "energy");
      if (eIds.length) try {
        const r0 = await HASS.connection.sendMessagePromise({ type: "history/history_during_period", start_time: midnight.toISOString(), end_time: new Date(+midnight + 60e3).toISOString(),
          entity_ids: eIds, minimal_response: true, no_attributes: true, include_start_time_state: true });
        for (const [id, rows] of Object.entries(r0)) { const v = rows.map(x => parseFloat(x.s)).find(x => !isNaN(x)); if (v != null) HIST.energyStart[id] = v; }
      } catch (e) { /* bleibt beim Wert aus den Statistiken */ }
      if (rest.length) {
        const res = await HASS.connection.sendMessagePromise({ type: "history/history_during_period", start_time: start.toISOString(), end_time: end.toISOString(),
          entity_ids: rest, minimal_response: true, no_attributes: true, significant_changes_only: false });
        for (const [id, rows] of Object.entries(res)) take(id, rows.map(r => [(r.lu ?? r.lc) * 1000, parseFloat(r.s)]).filter(p => !isNaN(p[1])));
      }
      ids.forEach(id => HIST.tried.add(id));
      HIST.last = Date.now();
    } catch (e) { console.warn("Rack Display: history not loaded", e); }
    HIST.loading = false;
    if (!DEAD) renderPanel();
  }

  /* ---------- Erkennungen heute (Anzahl Auslösungen seit Mitternacht) ---------- */
  const EVT = { want: new Set(), on: {}, last: 0, loading: false,
    count(ids) { return ids.reduce((s, id) => s + (this.on[id] || 0), 0); } };
  async function loadEvents() {
    if (EVT.loading || !HASS || !EVT.want.size || Date.now() - EVT.last < 5 * 60e3) return;
    EVT.loading = true;
    try {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const res = await HASS.connection.sendMessagePromise({ type: "history/history_during_period", start_time: start.toISOString(), entity_ids: [...EVT.want], minimal_response: true, no_attributes: true, significant_changes_only: false });
      for (const [id, rows] of Object.entries(res)) EVT.on[id] = rows.filter((r, i) => r.s === "on" && (i > 0 || (r.lc ?? r.lu) * 1000 >= +start)).length;
      EVT.last = Date.now();
      if (!DEAD) renderPanel();
    } catch (e) { /* optional */ }
    EVT.loading = false;
  }

  // Geräteverlauf wie im UniFi-Controller (Firmware, online/offline, Überhitzung, PoE) aus dem Logbuch der letzten 30 Tage
  const DLOG = {};
  const LOG_TXT = (id, s, d) => {
    const dom = id.split(".")[0];
    if (dom === "update") return s === "on" ? TR("firmware_update_available") : s === "off" ? TR("updated_to_n", st(id)?.attributes.installed_version || TR("new_firmware")) : null;
    if (dom === "device_tracker") return s === "home" ? TR("n_is_back_online", d.name) : s === "not_home" ? TR("n_was_offline", d.name) : null;
    if (dom === "binary_sensor" && /hitz|overheat/.test(id)) return s === "on" ? TR("overheating_reported") : null;
    if (dom === "switch" && /_poe$/.test(id)) { const n = id.match(/_(\d+)_poe$/)?.[1]; return TR(s === "on" ? "poe_on_port_n_switched_on" : "poe_on_port_n_switched_off", n); }
    if (dom === "sensor" && /_(zustand|state)$/.test(id)) return { connected: TR("connected_2"), disconnected: TR("disconnected"), upgrading: TR("installing_firmware"), adopting: TR("adopting"), provisioning: TR("setting_up") }[s] || null;
    return null;
  };
  async function loadDevLog(d, devs) {
    const c = DLOG[d.id] || (DLOG[d.id] = { last: 0, rows: [] });
    if (c.loading || !HASS || !devs?.length || Date.now() - c.last < 10 * 60e3) return;
    c.loading = true;
    try {
      const res = await HASS.connection.sendMessagePromise({ type: "logbook/get_events", start_time: new Date(Date.now() - 30 * 864e5).toISOString(), device_ids: devs });
      const rows = [];
      for (const e of res || []) { const t = e.entity_id && e.state != null && LOG_TXT(e.entity_id, e.state, d); if (t && !(rows.at(-1)?.[0] === t)) rows.push([t, e.when * 1000]); }
      c.rows = rows.reverse().slice(0, 6); c.last = Date.now();
      if (!DEAD) renderPanel();
    } catch (e) { c.last = Date.now(); }
    c.loading = false;
  }
  const whenTxt = ms => new Date(ms).toLocaleString(rdLoc(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(",", " " + TR("at_time"));

  /* ---------- Modell: Rack aus dem Backend + Live-Zustände ---------- */
  const SPD_COL = { "25G": "--sp25g", "10G": "--sp10g", "2.5G": "--sp2g5", "1G": "--sp1g", "100M": "--sp100" };
  const SPD_SHORT = { "25G": "25 GbE", "10G": "10 GbE", "2.5G": "2,5 GbE", "1G": "GbE", "100M": "FE" };
  const TEMP_WARN = 85, TEMP_ALERT = 95;  // Gerätetemperaturen (CPU), keine Raumluft
  const speedOf = mbit => mbit == null || mbit <= 10 ?  // 10 Mbit/s meldet UniFi auch für freie Ports
     null : mbit >= 25000 ? "25G" : mbit >= 10000 ? "10G" : mbit >= 2500 ? "2.5G" : mbit >= 1000 ? "1G" : "100M";

  const LIVE = {}, LIVE_SEEN = {}, LIVE_WATCH = new Set();
  const PORT_ENT = /^sensor\.(.+?)_(port|sfp|sfp28)_(\d+)_(link_speed|verbindungsgeschwindigkeit|download|upload|rx|tx|poe_power)$/;
  const PORT_FIELD = { link_speed: "speed", verbindungsgeschwindigkeit: "speed", download: "rx", rx: "rx", upload: "tx", tx: "tx", poe_power: "poe" };
  // PoE++-Ports je Modell (die Integration liefert nur die Leistung, nicht die Port-Klasse)
  const POE_PP = [[/usw.?pro.?48.?poe/i, 41, 48], [/usw.?pro.?24.?poe/i, 17, 24], [/usw.?pro.?max.?48.?poe/i, 33, 48], [/usw.?enterprise.?48.?poe/i, 1, 48]];
  const poePlusPlus = (model, n, kind) => kind === "rj45" && POE_PP.some(([re, lo, hi]) => re.test(model || "") && n >= lo && n <= hi);
  const DISC = new Map();  // Gerät → gefundene Port-Entitäten (wird bei setRack geleert)
  function discoverPorts(m, R, devId) {
    if (m.ports.some(p => p.rx || p.tx)) return m.ports;  // Backend liefert bereits alles
    if (DISC.has(devId)) return DISC.get(devId);
    const map = {};
    for (const p of m.ports) map[`${p.kind}${p.n}`] = { ...p };
    const objs = [...Object.entries(R).filter(([k]) => !/^(wan_|isp)/.test(k)).map(e => e[1]), ...m.ports.flatMap(p => [p.speed, p.poe])].filter(Boolean).map(e => e.split(".")[1]);
    if (!objs.length || !HASS) return Object.values(map);
    let pre = objs[0];
    for (const o of objs) { let k = 0; while (k < pre.length && pre[k] === o[k]) k++; pre = pre.slice(0, k); }
    if (!objs.every(o => o.length === pre.length || o[pre.length] === "_")) pre = pre.replace(/_[^_]*$/, "");
    pre = pre.replace(/_+$/, "");
    if (pre.length < 4) return Object.values(map);
    for (const id in HASS.states) {
      const x = id.match(PORT_ENT);
      if (!x || x[1] !== pre) continue;
      const key = `${x[2] === "port" ? "rj45" : x[2]}${+x[3]}`, f = PORT_FIELD[x[4]];
      const p = map[key] || (map[key] = { kind: x[2] === "port" ? "rj45" : x[2], n: +x[3] });
      if (!p[f]) p[f] = id;
    }
    const order = ["rj45", "sfp", "sfp28"];
    const out = Object.values(map).filter(p => p.speed || p.rx).sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.n - b.n);
    DISC.set(devId, out);
    return out;
  }
  // Live-Puffer: jede neue Messung eines Port-Durchsatzes wird gemerkt (für die Live-Kurve)
  function recordLive(h) {
    for (const id of LIVE_WATCH) {
      const s = h.states[id]; if (!s || s.last_updated === LIVE_SEEN[id]) continue;
      LIVE_SEEN[id] = s.last_updated; const v = parseFloat(s.state); if (isNaN(v)) continue;
      const arr = LIVE[id] || (LIVE[id] = []); arr.push([Date.parse(s.last_updated), v]); if (arr.length > 120) arr.shift();
    }
  }
  const PORT_HIST = new Set(), LIVE_SPAN = 3 * 60e3;
  let LIVE_SEL = null;
  // Beim Öffnen eines Ports: letzte Messwerte aus dem Live-Puffer der Integration (sonst aus dem Verlauf)
  async function loadPortHistory(p) {
    const ids = [p.ids.rx, p.ids.tx].filter(Boolean).filter(id => !PORT_HIST.has(id));
    if (!ids.length || !HASS) return;
    ids.forEach(id => PORT_HIST.add(id));
    const merge = (id, old) => { const cur = LIVE[id] || []; LIVE[id] = [...old.filter(x => !cur.length || x[0] < cur[0][0]), ...cur].slice(-120); };
    try {
      const res = await HASS.connection.sendMessagePromise({ type: "rack_display/live", entity_ids: ids });
      for (const [id, rows] of Object.entries(res)) merge(id, rows.map(([t, v]) => [t * 1000, v]));
    } catch (e) {
      try {
        const end = new Date(), start = new Date(end - LIVE_SPAN);
        const res = await HASS.connection.sendMessagePromise({ type: "history/history_during_period", start_time: start.toISOString(), end_time: end.toISOString(), entity_ids: ids, minimal_response: true, no_attributes: true });
        for (const [id, rows] of Object.entries(res)) merge(id, rows.map(r => [(r.lu ?? r.lc) * 1000, parseFloat(r.s)]).filter(x => !isNaN(x[1])));
      } catch (e2) { /* optional */ }
    }
    if (!DEAD) renderPanel();
  }


  // Blöcke eines Geräts: gespeicherte Liste, sonst die der Vorlage (gleiche Logik wie blocks.py)
  function blocksOf(r) {
    if (Array.isArray(r.blocks)) return r.blocks;
    if (r.group) return [];
    const C = rdCatalog(), key = r.passive || C.passive_templates.includes(r.template) ? "passive" : C.templates[r.template] ? r.template : "generic";
    return C.templates[key].map(b => typeof b === "string" ? { type: b } : b);
  }
  // Verlauf-Block: Quelle ist eine Rolle (z. B. "load") oder eine Entitäts-ID
  const entOf = (ref, R) => ref && (ref.includes(".") ? ref : R?.[ref]);
  function chartOf(b, R) {
    if (b.items?.length > 1) {
      const COL = ["--blue", "--orange", "--green", "--purple"];
      const series = b.items.slice(0, 4).map(ref => [ref, entOf(ref, R)]).filter(([, id]) => st(id)).map(([ref, id], i) => { HIST.want.add(id);
        return { id, label: b.names?.[ref] || shortName(id), unit: st(id).attributes.unit_of_measurement || "", color: b.colors?.[i] || COL[i], dec: Math.abs(num(id) || 0) < 10 ? 1 : 0, warn: b.warns?.[ref] }; });
      if (b.style === "trace") series.forEach(s => HIST.fine.add(s.id));
      return series.length ? { multi: true, style: b.style, label: rdLabel(b.label) || TR("history_2"), series } : null;
    }
    const id = entOf(b.items?.[0] || b.source, R);
    const s = st(id); if (!s) return null;
    HIST.want.add(id); if (b.style === "trace") HIST.fine.add(id);
    return { style: b.style, label: rdLabel(b.label) || s.attributes.friendly_name || b.source, unit: s.attributes.unit_of_measurement || "", entity: id, base: num(id) || 0,
      color: b.color || "--blue", dec: b.dec ?? (Math.abs(num(id) || 0) < 10 ? 1 : 0), warn: b.warn };
  }

  // Kurzname: Entitätsname ohne Gerätenamen (vom Backend), sonst friendly_name
  let LABELS = {};
  const shortName = id => LABELS[id] || st(id)?.attributes.friendly_name || id.split(".")[1];
  const nameOf = (b, ref, id) => b?.names?.[ref] || b?.names?.[id] || shortName(id);
  const STATE_DE = rdPerLang(() => ({ on: TR("on"), off: TR("off"), home: TR("home"), not_home: TR("away"), open: TR("open"), closed: TR("closed"), unavailable: TR("unavailable"), unknown: TR("unknown"), connected: TR("connected_2"), disconnected: TR("disconnected"), idle: TR("ready"), recording: TR("recording"), streaming: TR("streaming"), playing: TR("playing"), paused: TR("paused"), started: TR("started"), stopped: TR("stopped"), too_many_missing_disks: TR("disks_missing"), invalid_expansion: TR("invalid_expansion"), parity_check: TR("parity_check"), rebuilding: TR("rebuilding"), maintenance: TR("maintenance") }));
  // Binärsensoren nach Geräteklasse in Klartext (Problem-Sensoren: OK/Problem statt Aus/An)
  const BIN_DE = rdPerLang(() => ({ problem: ["OK", "Problem"], running: [TR("stopped"), TR("running")], connectivity: [TR("disconnected"), TR("connected_2")], power: [TR("off"), TR("on")], safety: [TR("safe"), TR("unsafe")] }));
  function valueOf(id) {
    const s = st(id); if (!s) return { v: "–", u: "" };
    const x = parseFloat(s.state), u = s.attributes.unit_of_measurement || "";
    if (!isNaN(x) && /^-?[\d.]+$/.test(s.state)) { if (u === "Mbit/s" && x >= 1000) return { v: fmt(x / 1000, x % 1000 ? 1 : 0), u: "Gbit/s", n: x };
      return { v: fmt(x, Math.abs(x) < 10 && x % 1 ? 1 : 0), u, n: x }; }
    const bin = id.startsWith("binary_sensor.") && (/_active$/.test(id) && s.attributes.device_class === "running" ? [TR("inactive"), TR("active")] : BIN_DE()[s.attributes.device_class]); if (bin && (s.state === "on" || s.state === "off")) return { v: bin[s.state === "on" ? 1 : 0], u: "" };
    if (s.attributes.device_class === "timestamp") { const t = Date.parse(s.state); if (!isNaN(t)) {
      const sec = (Date.now() - t) / 1000;
      if (sec > 0) { const dd = Math.floor(sec / 86400); return dd >= 1 ? { v: fmt(dd), u: dd === 1 ? TR("day") : TR("days") } : { v: fmt(Math.floor(sec / 3600)), u: TR("h") }; }
      return { v: new Date(t).toLocaleString(rdLoc(), { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }), u: "" }; } }
    return { v: STATE_DE()[s.state] || (/^[a-z0-9]+(_[a-z0-9]+)+$/.test(s.state) ? s.state[0].toUpperCase() + s.state.slice(1).replace(/_/g, " ") : s.state), u: "" };
  }
  // Für Einzel-Module: erste Entität eines Moduls
  function oneEnt(d, b) { const ref = b.items?.[0] || b.source, id = ref && entOf(ref, d.R); if (!id || !st(id)) return null; return { id, ref, label: nameOf(b, ref, id), v: valueOf(id) }; }
  const frac = (n, lo, hi) => n == null ? 0 : Math.max(0, Math.min(1, (n - lo) / ((hi - lo) || 1)));
  const autoMax = v => v.u === "%" ? 100 : v.u === "°C" ? 100 : Math.max(10, Math.ceil(((v.n || 0) * 1.5) / 10) * 10);
  const thrCol = (b, n) => n != null && b.alert != null && n >= b.alert ? "--red" : n != null && b.warn != null && n >= b.warn ? "--orange" : b.colors?.[0] || "--blue";
  function lamp(id) {
    const s = st(id); if (!ok(s)) return "warn";
    const ip = s.attributes.ipmi_status; if (ip === "cr" || ip === "nr") return "alert"; if (ip === "nc") return "warn";
    const dc = s.attributes.device_class;
    if (dc === "problem" || dc === "safety" || dc === "smoke" || dc === "moisture") return s.state === "on" ? "alert" : "ok";
    return ["on", "home", "connected", "open", "playing", "recording", "streaming", "ok"].includes(s.state) ? "ok" : ["off", "not_home", "idle", "closed", "paused"].includes(s.state) ? "off" : "ok";
  }

  function buildDevice(r) {
    const o = r.options || {};
    const d = { haDevs: r.ha_devices || [], options: r.options || {}, blocks: blocksOf(r), id: r.id, name: r.name, model: r.model || "", type: r.template === "fanpanel" ? "server" : r.template, u: r.u, h: r.h,
      group: r.group || null, passive: !!r.passive, image: r.front_image || null, rearImage: r.rear_image || null,
      ledMap: o.led_map || null, state: r.passive ? "off" : "ok", msgs: [], tiles: [] };
    if (r.template === "fanpanel") { d.fans = o.fans || [66, 86]; d.fanImage = o.fan_image || ""; }
    if (r.template === "frame") { d.slots = o.slots || 10; d.modules = o.modules || []; }
    // Fachboden: offene Ablage mit Kleingeräten (options.items); ohne Liste liegt das Gerät selbst darauf
    if (r.template === "shelf") d.shelfItems = o.items?.length ? o.items : r.passive ? [] : [{ name: r.name, kind: /cloud ?key/i.test(`${r.model} ${r.name}`) ? "ck" : "box", self: true }];
    const m = r.map;
    if (r.passive) return d;
    if (!m && r.group) return d;  // Teil einer Gruppe (z. B. Zusatzbatterie), Werte kommen vom Hauptgerät
    if (!m) { d.state = "off"; d.msgs.push(["warn", TR("no_data"), TR("no_home_assistant_device_linked_yet")]); d.noData = true; return d; }
    const R = m.roles;
    d.R = R;
    const temp = num(R.cpu_temp) ?? num(R.temperature), tempId = R.cpu_temp || R.temperature;
    const cpu = round(num(R.cpu)), ram = round(num(R.ram)), power = num(R.power);
    if (power != null && r.side !== "rear0u") d.power = Math.round(power);
    // Geräte, die nicht immer laufen (z. B. Storage-Server): aus = grau „Ausgeschaltet“, keine Warnungen
    if (o.sometimes_off) {
      // Zustand über Tracker, Strom-Sensor (z. B. IPMI, läuft auch bei ausgeschaltetem Server) oder Schalter; sonst: alle Werte nicht verfügbar
      const trk = /^(device_tracker|binary_sensor|switch)\./.test(R.state || "") ? st(R.state) : null, vals = Object.values(R).filter(id => id && id !== R.state);
      if ((trk && ["not_home", "off", "offline", "disconnected"].includes(trk.state)) || (vals.length && vals.every(id => !ok(st(id))))) {
        const since = trk?.last_changed || vals.map(id => st(id)?.last_changed).filter(Boolean).sort().at(-1);
        d.state = "off"; d.off = true; d.offSince = since;
        d.msgs.push(["ok", TR("switched_off"), since ? TR("since_n", new Date(since).toLocaleString(rdLoc(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })) : TR("switched_on_when_needed")]);
        d.facts = [[TR("state"), TR("switched_off")], ...(since ? [[TR("off_since"), new Date(since).toLocaleString(rdLoc(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })]] : [])]; return d;
      }
    }
    // Zustand und Meldungen
    if (Object.values(R).length && Object.values(R).every(id => !ok(st(id)))) { d.state = "alert"; d.msgs.push(["alert", TR("no_values"), TR("all_sensors_are_unavailable")]); }
    const stt = /load_state$/.test(R.state || "") ? undefined : st(R.state);
    if (ok(stt) && !["connected", "online", "on", "home"].includes(stt.state)) { d.state = "alert"; d.msgs.push(["alert", TR("unreachable"), stt.state === "not_home" ? TR("device_is_not_on_the_network") : TR("state_n", stt.state)]); }
    const tracker = R.state?.startsWith("device_tracker.") && ok(stt);
    for (const p of m.problems) if (st(p)?.state === "on") { d.state = "alert"; d.msgs.push(["alert", st(p).attributes.friendly_name || "Problem", TR("reports_a_problem")]); }
    if (temp != null && temp >= TEMP_ALERT) { d.state = "alert"; d.msgs.push(["alert", TR("temperature_above_n", `${TEMP_ALERT} °C`), TR("currently_n", `${fmt(temp)} °C`)]); }
    else if (temp != null && temp >= TEMP_WARN) { if (d.state === "ok") d.state = "warn"; d.msgs.push(["warn", TR("temperature_above_n", `${TEMP_WARN} °C`), TR("currently_n", `${fmt(temp)} °C`)]); }
    if (st(R.firmware)?.state === "on") d.msgs.push(["ok", TR("firmware_update_available"), st(R.firmware).attributes.latest_version || ""]);
    // Kacheln (für Geräte ohne eigene Spezialansicht)
    const T = d.tiles;
    if (temp != null) T.push([TR("temperature"), fmt(temp), "°C", null, temp >= TEMP_ALERT ? "alert" : temp >= TEMP_WARN ? "warn" : "", temp >= TEMP_WARN ? TR("limit_n", `${TEMP_WARN} °C`) : ""]);
    if (cpu != null) T.push([TR("processor"), fmt(cpu), "%", cpu]);
    if (ram != null) T.push([TR("memory"), fmt(ram), "%", ram]);
    if (num(R.storage) != null) T.push([TR("storage"), fmt(round(num(R.storage))), "%", round(num(R.storage))]);
    if (d.power != null) T.push([TR("power_output"), fmt(d.power), "W"]);
    if (num(R.clients) != null) T.push(["Clients", fmt(num(R.clients)), ""]);
    // Kopf-Fakten
    const facts = [];
    if (since(R.uptime)) facts.push(["Uptime", since(R.uptime)]);
    if (num(R.clients) != null) facts.push(["Clients", fmt(num(R.clients))]);
    if (num(R.latency) != null) facts.push([TR("latency"), `${fmt(num(R.latency))} ms`]);
    if (num(R.active_ports) != null) facts.push([TR("active_ports"), fmt(num(R.active_ports))]);
    if (tracker) {
      const on = stt.state === "home";
      T.push([TR("network"), on ? "Online" : "Offline", "", null, on ? "" : "alert"]);
      if (stt.attributes.ip) facts.push([TR("ip_address"), stt.attributes.ip]);
      if (stt.attributes.network) facts.push([TR("mains"), stt.attributes.network]);
      facts.push([TR("connection_type"), stt.attributes.is_wired === false ? TR("wifi") : TR("wired")]);
    }
    if (facts.length) d.facts = facts.slice(0, 4);
    // System-Diagramm oder Einzeldiagramm
    if ((cpu != null || ram != null) && temp != null) {
      d.sys = { cpu, ram, temp: round(temp), ids: { cpu: R.cpu, ram: R.ram, temp: tempId } };
      [R.cpu, R.ram, tempId].forEach(x => x && HIST.want.add(x));
    }
    d.temp = temp != null ? round(temp) : null;
    // Internet (Gateway)
    if (R.wan_down || R.wan_up) {
      d.wan = { down: num(R.wan_down), up: num(R.wan_up), ids: { down: R.wan_down, up: R.wan_up }, loss: num(R.wan_loss), avail: num(R.wan_avail),
        isp: ok(st(R.isp)) ? st(R.isp).state : "", drops: num(R.wan_drops) };
      HIST.want.add(R.wan_down); HIST.want.add(R.wan_up);
    }
    // Ports (inkl. Live-Durchsatz). Fehlen Port-Entitäten in der Zuordnung (z. B. vor einem Neustart mit neuen Regeln),
    // werden sie über das gemeinsame Entitäts-Präfix des Geräts aus den Zuständen gesucht.
    const ports = discoverPorts(m, R, r.id);
    if (ports.length) {
      const maxRj = Math.max(0, ...ports.filter(p => p.kind === "rj45").map(p => p.n));
      d.ports = ports.map(p => {
        const n = p.kind !== "rj45" && p.n <= maxRj ? maxRj + p.n : p.n, poe = num(p.poe);
        const speed = speedOf(num(p.speed)), rx = num(p.rx), tx = num(p.tx);
        [p.rx, p.tx].forEach(id => id && LIVE_WATCH.add(id));
        const at = st(p.speed)?.attributes || {};
        return { n, label: `${n}`, kind: p.kind, speed, poeCap: !!p.poe, poePP: poePlusPlus(d.model, n, p.kind), peer: speed ? at.connected_device || at.connected_ip || "" : "", poe: poe > 0 ? round(poe, 1) : 0, rx, tx, ids: { rx: p.rx, tx: p.tx } };
      });
      const byKind = k => d.ports.filter(p => p.kind === k).map(p => p.n);
      const groups = [], rj = byKind("rj45"), sf = byKind("sfp"), s28 = byKind("sfp28");
      if (rj.length) groups.push(["rj45", rj]);
      if (sf.length) groups.push(["sfp", sf]);
      if (s28.length) groups.push(["sfp28", s28]);
      d.portLayout = groups;
      d.traffic = d.ports.reduce((a, p) => [a[0] + (p.rx || 0), a[1] + (p.tx || 0)], [0, 0]);
      if (d.facts && d.facts.length < 4) { d.facts.push([TR("throughput"), `${rateK(d.traffic[0] + d.traffic[1]).replace(/ (.)$/, " $1bit/s")}`]); }
      if (R.poe_total && num(R.poe_total) != null) d.poe = { used: Math.round(num(R.poe_total)), budget: o.poe_budget || (/48.?poe/i.test(d.model) ? 600 : null) };
    }
    // USV
    if (R.battery) {
      // apc_rack_power ab 0.4 liefert Zustände als Text, ältere Versionen als RFC-1628-Zahl
      const srcText = ok(st(R.source)) ? st(R.source).state : "";
      const src = { battery: 5, bypass: 4, normal: 3 }[srcText] ?? num(R.source), lv = round(num(R.battery)), rt = round(num(R.runtime));
      const outV = round(num(R.output_voltage)), outA = num(R.output_current);
      d.flow = { inV: round(num(R.input_voltage)), hz: round(num(R.input_frequency), 1), outV, batt: lv, runtime: rt, loadPct: round(num(R.load)),
        load: outV && outA ? Math.round(outV * outA) : null, source: src === 5 ? TR("battery_source") : TR("mains"), bypass: src === 4, ids: { in: R.input_voltage, out: R.output_voltage } };
      HIST.want.add(R.input_voltage); HIST.want.add(R.output_voltage); HIST.want.add(R.load);
      const stc = { 1: TR("passed"), 2: TR("warning"), 3: TR("error"), 4: TR("cancelled"), 5: TR("running_2"), 6: TR("no_test") }[num(R.selftest)]
        || { passed: TR("passed"), warning: TR("warning"), error: TR("error"), aborted: TR("cancelled"), in_progress: TR("running_2"), none: TR("no_test") }[ok(st(R.selftest)) ? st(R.selftest).state : ""];
      const bdRaw = ok(st(R.battery_replace)) ? st(R.battery_replace).state : "", bdm = bdRaw.match(/^(\d{1,2})\/\d{1,2}\/(\d{4})$/) || bdRaw.match(/^(\d{4})-(\d{2})/);
      const bdate = !bdm ? bdRaw.slice(0, 10) : bdm[1].length === 4 ? `${bdm[2]}/${bdm[1]}` : `${bdm[1].padStart(2, "0")}/${bdm[2]}`;
      const nmc = ok(st(R.nmc_model)) ? st(R.nmc_model).state : null, bt = round(num(R.battery_temp)), bv = num(R.battery_voltage);
      d.ups = { bt, bv, bdate, nmc, selftest: stc, onBattSec: num(R.on_battery_seconds) };
      d.facts = [nmc ? [TR("network_card"), nmc] : [TR("runtime"), `${fmt(rt)} min`], bt != null ? [TR("battery_temp_short"), `${fmt(bt)} °C`] : [TR("battery_source"), `${fmt(lv)} %`], bdate ? [TR("battery_date"), bdate] : [TR("load_2"), `${fmt(round(num(R.load)))} %`], [TR("self_test"), stc === TR("passed") ? "✓ OK" : stc || "–"]];
      if (stc === TR("passed")) d.msgs.push(["ok", TR("self_test_passed"), [bv != null ? `${TR("battery")} ${fmt(bv, 1)} V` : "", bt != null ? `${fmt(bt)} °C` : ""].filter(Boolean).join(" · ")]);
      if (src === 5) { d.state = "alert"; d.msgs.unshift(["alert", TR("battery_operation"), TR("mains_failed_load_runs_on_battery")]); }
      d.facts = null;   // Kennzahlen stehen in der USV-Karte
      if (num(R.alarms) > 0) { d.state = "alert"; d.msgs.unshift(["alert", TR("n_alarms_at_the_ups", fmt(num(R.alarms))), ""]); }
      if (stc && [TR("warning"), TR("error")].includes(stc)) { if (d.state === "ok") d.state = "warn"; d.msgs.push(["warn", TR("self_test_n", stc), ""]); }
    }
    // Stromleiste
    if (Object.keys(m.outlets).length) {
      const names = o.outlet_names || {};
      d.outlets = Object.entries(m.outlets).map(([n, id]) => ({ n: +n, kind: +n % 8 === 0 ? "C19" : "C13", on: st(id)?.state === "on", name: names[n] || "" }));
      // apc_rack_power meldet derzeit alle Ausgänge als „aus“, obwohl Last anliegt → Zustand unbekannt
      d.outletsUnknown = d.outlets.every(x => !x.on) && power > 20;
      d.totalPower = power;
      d.facts = [[TR("power_output"), `${fmt(power)} W`], [TR("power"), `${fmt(num(R.current), 1)} A`], [TR("voltage"), `${fmt(num(R.voltage))} V`], (() => { const e = num(R.energy), e0 = HIST.energyStart?.[R.energy]; // Zählerstand seit Inbetriebnahme ist wenig aussagekräftig: lieber „heute“
        return e != null && e0 != null ? [TR("today_2"), `${fmt(e - e0, 1)} kWh`] : [TR("meter"), e >= 1000 ? `${fmt(e / 1000, 2)} MWh` : `${fmt(e)} kWh`]; })()];
      HIST.want.add(R.power); HIST.want.add(R.current); if (R.energy) HIST.want.add(R.energy);
      d.energyId = R.energy;
    }
    // Rekorder
    if (m.disks.length) {
      d.disks = m.disks.map((id, i) => { const x = id.match(/_(hdd|ssd|disk)_(\d+)$/) || []; return { n: +(x[2] || i + 1), label: (x[1] || "Disk").toUpperCase(), state: st(id)?.state === "on" ? "warn" : ok(st(id)) ? "ok" : "off" }; }).sort((p, q) => p.n - q.n);
      d.disks.filter(x => x.state === "warn").forEach(x => { d.state = "alert"; d.msgs.unshift(["alert", TR("bay_n_reports_a_problem", x.n, x.label), ""]); });
      d.raid = { used: num(R.storage), ...(o.storage || {}) };   // feste Angaben (RAID, Kapazität, Platten) aus dem Editor
      if (o.storage?.disk_label) d.disks.forEach(x => x.label = o.storage.disk_label);
      const TN = { continuous: [TR("continuous"), "--blue"], detections: [TR("detections"), "--purple"], timelapse: [TR("timelapse"), "--orange"] };
      const types = Object.entries(m.rec_types).map(([k, id]) => [TN[k]?.[0] || k, num(id) || 0, TN[k]?.[1] || "--teal"]).filter(t => t[1] >= 0.05);
      // Kameras am Rekorder (aus der Zuordnung, sonst über die Protect-Namensgebung gesucht)
      const cams = m.cameras || Object.keys(HASS?.states || {}).filter(id => /^camera\..+_high_resolution_channel$/.test(id));
      const dets = m.detections || cams.map(id => `binary_sensor.${id.slice(7).replace(/_high_resolution_channel$/, "")}_object_detected`).filter(id => st(id));
      dets.forEach(id => EVT.want.add(id));
      const camOn = cams.filter(id => ok(st(id)));
      if (num(R.recording) != null || types.length) d.rec = { days: Math.round((num(R.recording) || 0) / 86400), types, cams: cams.length, camsOn: camOn.length, events: dets.length ? EVT.count(dets) : null };
      if (cams.length) {
        if (camOn.length < cams.length) cams.filter(id => !ok(st(id))).forEach(id => { if (d.state === "ok") d.state = "warn"; d.msgs.unshift(["warn", TR("camera_offline"), (st(id)?.attributes.friendly_name || id).replace(/ High Resolution Channel$/i, "")]); });
      }
      d.model = `${d.model} · ${m.disks.length} ${TR("bays")}`;
      d.facts = null;
    }
    for (const b of d.blocks) if (b.type === "chart") chartOf(b, R);
    return d;
  }

  function buildModel(rack) {
    const s = rack.style || {};
    RACK = { name: rack.name, units: rack.units, badge: s.badge || "", plate: s.plate || "", label1: s.label1 || "", label2: s.label2 || "", power: rack.power || {}, color: s.color || "light", door: s.door || "mesh", labelColor: s.label_color || "", heatmap: !!s.heatmap };
    const front = [], rear = [];
    LABELS = Object.assign({}, ...rack.devices.map(r => r.labels || {}));
    const kids = [];
    for (const r of rack.devices) (r.parent ? kids : r.side === "rear0u" ? rear : front).push(buildDevice(r));
    // Geräte in einem Modulrahmen (z. B. Cloud Key): eigenes Popup, Zustand fließt in den Rahmen ein
    for (const k of kids) { const r = rack.devices.find(x => x.id === k.id); k.parent = r.parent; const f = front.find(x => x.id === k.parent); k.mod = f?.modules?.find(m => m.device === k.id) || null; k.frameName = f?.name || ""; }
    for (const f of front) { const ks = kids.filter(k => k.parent === f.id && k.mod); if (!ks.length) continue;
      f.kids = ks; f.passive = false; const ss = ks.filter(k => !k.passive).map(k => k.state); f.state = ss.includes("alert") ? "alert" : ss.includes("warn") ? "warn" : "ok"; }
    // Gruppen (z. B. USV + Zusatzbatterie) teilen sich Zustand und Meldungen des Hauptgeräts
    for (const d of front) if (d.group) { const g = front.find(x => x.id === d.group); if (g) d.state = g.state; }
    for (const d of front) { const sub = front.filter(x => x.group === d.id); if (sub.length) d.model = [d.model, ...sub.map(x => x.model.replace(/^APC /, ""))].join(" + "); }
    DEVICES = front; ZERO_U = rear; SLOTTED = kids;
    const pdu = rack.devices.find(r => r.side === "rear0u");
    PDU_IMG = pdu?.options?.vertical_image || "";
    const w = st(rack.wled?.entity_id);
    WLED.on = w?.state === "on";
    if (WLED.on && !WLED.loop && WLED.effects) { WLED.loop = true; requestAnimationFrame(wledFrame); }
    if (w) { const i = WLED.effects.findIndex(e => e[0].toLowerCase() === unescH(w.attributes.effect || "").toLowerCase()); WLED.fx = i < 0 ? 0 : i; }
  }

  function leds48(d){
  if (!d.ports) return "";
  // aus dem Frontfoto ausgelesen: x-Position je Port-Spalte (Prozent), y für obere/untere Reihe
  const G = [11.35,14.5,17.65,20.85,24,27.15,31.1,34.25,37.45,40.6,43.75,46.95,50.9,54.05,57.2,60.4,63.55,66.7,70.7,73.85,77,80.15,83.3,86.5];
  const A = [9,12.2,15.3,18.5,21.75,24.85,28.75,31.95,35.15,38.3,41.45,44.65,48.6,51.75,54.9,58.1,61.3,64.45,68.4,71.55,74.7,77.85,81.05,84.2];
  const out = [];
  for (let c = 0; c < 24; c++) for (let r = 0; r < 2; r++){
    const n = c * 2 + r + 1, p = d.ports.find(x => x.n === n) || {}, y = r ? 76.5 : 22.4, h = (n * 7919) % 100;
    out.push(`<i class="pl-led ${p.speed ? "link" : "off"}" data-n="${n}" style="left:${G[c]}%;top:${y}%;${p.speed ? `animation-duration:${ledDur(p, h)}s;animation-delay:-${(h / 50).toFixed(2)}s` : ""}"></i>`);
    out.push(`<i class="pl-led poe ${p.poe ? "on" : "off"}" style="left:${A[c]}%;top:${y}%"></i>`);
  }
  return `<div class="leds" data-dev="${d.id}">${out.join("")}</div>`;
}

function face(d){
  if (d.fans){
    const spd = d.state === "off" ? 0 : 0.9;
    return `<div class="face f-panel" style="--panel-img:url('${d.image}');--fan-img:url('${d.fanImage}')">${d.fans.map(x => `<i class="fan" style="left:${x}%;${spd ? `animation-duration:${spd}s` : "animation:none"}"></i>`).join("")}<i class="pl"></i>${d.passive ? "" : `<i class="led ${d.state}" style="left:6%;right:auto"></i>`}</div>`;
  }
  const inner = {
    server:'<div class="bays"></div><div class="ctl"></div>',
    switch:'<div class="logo"></div><div class="ports"></div>',
    sfp:'<div class="logo"></div><div class="ports"></div>',
    gw:'<div class="lcd"></div><div class="ports"></div>',
    nvr:'<div class="lcd"></div><div class="bays"></div>',
    ups:'<div class="lcd"></div><div class="btns"></div><div class="vent"></div>',
    patch:'<div class="strip"></div><div class="ports"></div>',
    shelf:shelfInner(d),
    blank:'', frame:frameInner(d), pdu:'<div class="ports"></div>', cm:'<i class="lip"></i>', bl:'<i class="slot"></i>', ks:'<div class="ksr"></div>', lwl:'<div class="lwr"></div>'
  }[d.type] || '';
  const cls = d.type === "sfp" ? "f-switch f-sfp" : d.type === "pdu" ? "f-patch" : "f-" + d.type;
  const img = d.image ? ` f-image" style="background-image:url('${d.image}')` : '';
  const ledl = d.ledMap === "usw48" ? leds48(d) : "";
  const led = d.passive ? '' : `<i class="led ${d.state}"></i>`;
  return `<div class="face ${cls}${img}">${d.image ? '' : inner}${ledl}${led}</div>`;
}

function rowOf(d){ return `${RACK.units - (d.u + d.h - 1) + 1} / span ${d.h}`; }

function renderRack(){
  const rack = $("rack");
  rack.style.setProperty("--units", RACK.units); rackLook(rack); { const k = 45.75 / (RACK.units + 3.75); rack.style.setProperty("--ar", (0.34 * k).toFixed(4)); rack.style.setProperty("--wt", (3.6 * k).toFixed(2) + "%"); rack.style.setProperty("--wb", (4.6 * k).toFixed(2) + "%"); rack.style.setProperty("--hf", Math.min(1, 1 / k).toFixed(4)); rack.closest(".app")?.classList.toggle("short-rack", RACK.units <= 32); }
  rack.classList.toggle("open", !S.door || S.side === "rear" || RACK.door === "none");
  rack.classList.toggle("edit", S.mode === "edit");
  rack.classList.toggle("has-sel", !!S.sel && !!DEVICES.find(d => selOf(d) === S.sel));
  rack.classList.toggle("rear", S.side === "rear");
  $("badge").textContent = unescH(RACK.badge); $("cap").textContent = unescH(RACK.badge); $("plate").textContent = unescH(RACK.plate); $("plate").hidden = !RACK.plate; $("badge").hidden = !RACK.badge;
  $("doorL1").textContent = unescH(RACK.label1);
  $("doorL2").textContent = unescH(RACK.label2);

  $("unums").innerHTML = Array.from({length:RACK.units}, (_, i) => `<span>${RACK.units - i}</span>`).join("");
  $("bay").innerHTML = DEVICES.map(d =>
    `<div class="dev ${isSel(d) ? "sel" : ""}" style="grid-row:${rowOf(d)}">${S.side === "rear" ? rearFace(d) : face(d)}</div>`).join("");

  const used = new Set(); DEVICES.forEach(d => { for (let u = d.u; u < d.u + d.h; u++) used.add(u); });
  const empties = [];
  for (let u = 1; u <= RACK.units; u++) if (!used.has(u)) empties.push(u);
  $("hits").innerHTML =
    DEVICES.filter(d => !["bl", "cm", "blank"].includes(d.type)).map(d => `<button class="hit ${d.passive ? "" : d.state} ${isSel(d) ? "sel" : ""}" style="grid-row:${rowOf(d)}" data-id="${selOf(d)}" aria-label="${TR("n_u_n", d.name, `${d.u}${d.h > 1 ? "–" + (d.u + d.h - 1) : ""}`)}"></button>`).join("") +
    "" ;
  $("hits").innerHTML += S.side === "rear" ? "" : DEVICES.filter(f => f.kids).flatMap(f => f.kids.map(k => { const n = f.slots || 10, L = 4.5 + 91 * (0.035 + 0.93 * (0.01 + 0.98 * (k.mod.slot - 1) / n)), W = 91 * 0.93 * 0.98 * (k.mod.w || 1) / n; return `<button class="hit sub ${k.state} ${isSel(k) ? "sel" : ""}" style="grid-row:${rowOf(f)};margin:0 0 0 ${L.toFixed(2)}%;width:${W.toFixed(2)}%;justify-self:start" data-id="${k.id}" aria-label="${k.name}"></button>`; })).join("");
  $("pduHit").hidden = S.side !== "rear";
  const pdu0 = ZERO_U[0]; $("pduHit").hidden = S.side !== "rear" || !pdu0; if (pdu0){ $("pduHit").dataset.id = pdu0.id; $("pduHit").setAttribute("aria-label", TR("n_rear", pdu0.name)); }
  $("pduHit").classList.toggle("sel", !!pdu0 && S.sel === pdu0.id);
  $("pduHit").style.backgroundImage = `url('${PDU_IMG}')`;
  $("hits").innerHTML +=
    "";
}

function chartSVG(c, seed, W = 600, H = 150){
  const v = HS(c.entity, c.base), pl = 34, pr = 8, pt = 10, pb = 22;
  const lo = Math.min(...v, c.warn ?? Infinity) * .95, hi = Math.max(Math.max(...v, c.warn ?? -Infinity) * 1.04, lo + 1);
  const X = i => pl + (i / (v.length - 1)) * (W - pl - pr), Y = y => pt + (1 - (y - lo) / (hi - lo)) * (H - pt - pb);
  const line = v.map((y, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(y).toFixed(1)}`).join("");
  const col = css(c.color) || "#0a84ff", gid = "g" + seed;
  const dec = c.dec ?? 0, f = y => y.toLocaleString(rdLoc(), {maximumFractionDigits: dec, minimumFractionDigits: dec});
  const ticks = H < 120 ? [lo + (hi - lo) * .15, hi - (hi - lo) * .15] : [lo + (hi - lo) * .15, (lo + hi) / 2, hi - (hi - lo) * .15];
  const hours = ["−24 h","−18 h","−12 h","−6 h",TR("now")];
  return `<svg class="chart" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="height:${H}px" role="img" aria-label="${c.label}, ${TR("last_24_hours")}">
    <defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".45"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
    ${ticks.map(t => `<line class="gl" x1="${pl}" x2="${W - pr}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${pl - 6}" y="${Y(t) + 4}" text-anchor="end">${f(t)}</text>`).join("")}
    ${c.warn ? `<line x1="${pl}" x2="${W - pr}" y1="${Y(c.warn)}" y2="${Y(c.warn)}" stroke="${css("--orange")}" stroke-dasharray="4 4" stroke-width="1.2"/>` : ""}
    <path d="${line}L${X(v.length - 1)},${H - pb}L${pl},${H - pb}Z" fill="url(#${gid})"/>
    <path d="${line}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
    <circle cx="${X(v.length - 1)}" cy="${Y(v[v.length - 1])}" r="4" fill="${col}" stroke="var(--glass)" stroke-width="2"/>
    ${hours.map((h, i) => (W < 340 && i % 2) ? "" : `<text x="${pl + i * (W - pl - pr) / 4}" y="${H - 5}" text-anchor="${i === 0 ? "start" : i === 4 ? "end" : "middle"}">${h}</text>`).join("")}
  </svg>`;
}

const ICONS = {
  bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  temp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1.8 20.5h20.4zm-1 6h2v6h-2zm0 8h2v2h-2z"/></svg>',
  plug:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 2h2v5h4V2h2v5h1a1 1 0 0 1 1 1v4a6 6 0 0 1-5 5.9V22h-2v-4.1A6 6 0 0 1 6 12V8a1 1 0 0 1 1-1h1z"/></svg>',
  chev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
};

const STATE_TXT = rdPerLang(() => ({ ok:TR("ok"), warn:TR("notice"), alert:TR("fault"), off:TR("passive") }));

const worst = () => { const s = DEVICES.concat(ZERO_U).filter(d => !d.passive).map(d => d.state); const m = allDevices().filter(d => !d.passive && !d.group).flatMap(d => (d.msgs || []).map(x => x[0])); return s.includes("alert") || m.includes("alert") ? "alert" : s.includes("warn") || m.includes("warn") ? "warn" : "ok"; };

const SEG_COLORS = ["--blue","--indigo","--teal","--orange","--purple","--green"];

const CHARTS = [];

const lazy = fn => `<div class="cw" data-ci="${CHARTS.push(fn) - 1}"></div>`;

function fillCharts(){
  ROOT.querySelectorAll(".cw").forEach(el => {
    const box = el.closest(".ov-chart");
    if (box && el.clientHeight < 56){ box.classList.add("nochart"); return; }
    el.innerHTML = CHARTS[+el.dataset.ci](el.closest(".mt") ? el.clientWidth : Math.max(160, el.clientWidth), Math.max(el.closest(".tr2,.mt") ? 14 : 70, el.clientHeight));
  });
}

const SPEED_TXT = {"100M":"100 Mbit/s","2.5G":"2,5 Gbit/s","1G":"1 Gbit/s","10G":"10 Gbit/s","25G":"25 Gbit/s"};

const KIND_TXT = {rj45:"RJ45", sfp:"SFP+", sfp28:"SFP28"};

function chartMulti(sers, {lo, hi, fmt = v => nf.format(Math.round(v)), mirror = false, W = 600, H = 150} = {}){
  const pl = 36, pr = 8, pt = 10, pb = 22;
  const X = (i, n) => pl + (i / (n - 1)) * (W - pl - pr);
  if (!(hi - lo > 1e-6)) hi = lo + 1;
  const Y = y => pt + (1 - (y - lo) / (hi - lo)) * (H - pt - pb);
  const path = v => v.map((y, i) => `${i ? "L" : "M"}${X(i, v.length).toFixed(1)},${Y(y).toFixed(1)}`).join("");
  const ticks = mirror ? (H < 120 ? [hi * .8, lo * .8] : [hi * .8, 0, lo * .8]) : (H < 120 ? [lo + (hi - lo) * .2, hi - (hi - lo) * .2] : [lo + (hi - lo) * .2, (lo + hi) / 2, hi - (hi - lo) * .2]);
  const hours = ["−24 h","−18 h","−12 h","−6 h",TR("now")];
  const gid = "m" + Math.random().toString(36).slice(2, 7);
  return `<svg class="chart" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="height:${H}px" role="img">
    <defs>${sers.map((s, k) => `<linearGradient id="${gid}${k}" x1="0" x2="0" y1="${s.neg ? 1 : 0}" y2="${s.neg ? 0 : 1}"><stop offset="0" stop-color="${s.color}" stop-opacity=".42"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient>`).join("")}</defs>
    ${ticks.map(t => `<line class="gl" x1="${pl}" x2="${W - pr}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${pl - 6}" y="${Y(t) + 4}" text-anchor="end">${fmt(Math.abs(t))}</text>`).join("")}
    ${sers.map((s, k) => {
      const v = s.neg ? s.v.map(x => -x) : s.v, p = path(v), base = Y(mirror ? 0 : lo), e = v.length - 1;
      return (s.fill ? `<path d="${p}L${X(e, v.length)},${base}L${pl},${base}Z" fill="url(#${gid}${k})"/>` : "") +
        `<path d="${p}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
         <circle cx="${X(e, v.length)}" cy="${Y(v[e])}" r="3.5" fill="${s.color}"/>`;
    }).join("")}
    ${hours.map((h, i) => (W < 340 && i % 2) ? "" : `<text x="${pl + i * (W - pl - pr) / 4}" y="${H - 5}" text-anchor="${i === 0 ? "start" : i === 4 ? "end" : "middle"}">${h}</text>`).join("")}
  </svg>`;
}

function flowCard(d){
  const f = d.flow, onBatt = f.source !== TR("mains"), bypass = !!f.bypass;
  const rackIco = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 2v3h12V4Zm0 5v3h12V9Zm0 5v3h12v-3Z"/></svg>';
  const w = on => `<div class="fw ${on ? "on" : ""}"></div>`;
  return `<section class="card"><h2>${TR("energy_flow")} <em>${TR("online_ups_n", bypass ? TR("bypass_active") : onBatt ? TR("battery_operation") : TR("double_conversion"))}</em></h2>
    <div class="flow2">
      <div class="byp ${bypass ? "on" : ""}"><span>Bypass ${bypass ? TR("active_2") : "inaktiv"}</span></div>
      <div class="frow">
        <div class="fn ${onBatt ? "" : "on"}"><div class="ic">${ICONS.plug}</div><b>${fmt(f.inV)} V</b><span>${TR("mains")}</span></div>
        ${w(!onBatt && !bypass)}
        <div class="fn conv"><div class="ic">AC<i>→</i>DC</div><b>&nbsp;</b><span>${TR("rectifier")}</span></div>
        ${w(!onBatt && !bypass)}
        <div class="fn bat ${bypass ? "" : "on"}"><div class="ic"><span class="bglyph"><b style="width:${f.batt}%"></b></span></div><b>${fmt(f.batt)} %</b><span>${fmt(f.runtime)} min</span></div>
        ${w(!bypass)}
        <div class="fn conv"><div class="ic">DC<i>→</i>AC</div><b>&nbsp;</b><span>${TR("inverter")}</span></div>
        ${w(!bypass)}
        <div class="fn on"><div class="ic">${rackIco}</div><b>${fmt(f.load)} W</b><span>${fmt(f.outV)} V · ${fmt(f.loadPct)} %</span></div>
      </div>
      <p class="fnote">${onBatt ? TR("mains_failed_the_load_runs_on_battery") : TR("power_always_flows_through_battery_and_inverter")}</p>
    </div>
  </section>`;
}

function rearFace(d){
  if (d.rearImage) return `<div class="face f-image" style="background-image:url('${d.rearImage}')">${d.passive ? "" : `<i class="led ${d.state}"></i>`}</div>`;
  if (["blank", "cm", "bl", "frame"].includes(d.type)) return "";
  if (["ks", "lwl"].includes(d.type)) return `<div class="face f-patch"><div class="ports"></div></div>`;
  if (d.type === "patch") return `<div class="face f-patch"><div class="ports"></div></div>`;
  if (d.type === "shelf") return `<div class="face f-shelf"><div class="plate"></div><div class="box"></div></div>`;
  return `<div class="face f-rear"><div class="grill" style="left:4%;width:${d.h > 1 ? 34 : 24}%"></div><div class="nic"></div><div class="psu"></div>${d.passive ? "" : `<i class="led ${d.state}" style="right:auto;left:40%"></i>`}</div>`;
}

function headThumb(d){
  if (d.parent) return slotThumb(d);
  const m = d.group ? [] : members(d.id);
  if (m.length > 1){
    const total = m.reduce((a, x) => a + x.h, 0);
    return `<div class="thumb multi" style="aspect-ratio:${9.9 / total};--ar:${9.9 / total}">${m.map(x => `<div style="flex:${x.h}">${face(x)}</div>`).join("")}</div>`;
  }
  const ar = imgAr(d.image) || d.thumbAspect || (d.u ? 9.9 / d.h : 9.9);
  return `<div class="thumb" style="aspect-ratio:${ar};--ar:${ar}">${face(d)}</div>`;
}

function renderPanel(){
  if (Date.now() < NAV.until && !NAV.now) { if (!NAV.pending) { NAV.pending = true; setTimeout(() => { NAV.pending = false; renderPanel(); }, NAV.until - Date.now() + 10); } return; }
  let body;
  if (S.sel && byId(S.sel)) body = showDetail(byId(S.sel));
  else body = (S.mode === "edit" ? `<div class="edit-banner">${TR("tap_a_free_rack_unit_to_insert_a_device_or_a")}</div>` : "") + overview();
  $("panel").innerHTML = header() + body;
  $("panel").classList.toggle("fit", !S.slot && S.mode === "view");
  $("panel").classList.toggle("detail", !!(S.sel && byId(S.sel)));
  fitDetail(); fillCharts(); CHARTS.length = 0;
  tick();
}

const hsl = (h, s, l) => { h = ((h % 360) + 360) % 360 / 360; const f = n => { const k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l); return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))); }; return [f(0), f(8), f(4)]; };

const WLED = { n:120, fx:0, last:0, live:null, gw:22, gh:66, on:true, level:1,
  effects:[
    ["Rainbow",  (i, n, t) => hsl(i / n * 360 + t * 60, 1, .5)],
    ["Colorloop",(i, n, t) => hsl(t * 40, 1, .5)],
    ["Breathe",  (i, n, t) => hsl(200, 1, .5).map(v => v * (.2 + .8 * (.5 + .5 * Math.sin(t * 2))))],
    ["Running",  (i, n, t) => { const p = (t * 30) % n, d = Math.min(Math.abs(i - p), n - Math.abs(i - p)); return hsl(30, 1, .5).map(v => v * (d < 10 ? 1 - d / 10 : .06)); }],
    ["Solid",    () => hsl(200, .9, .5)],
  ]};

function wledLayout(){
  const c = $("wledCanvas"), win = ROOT.querySelector(".door .win");
  c.style.left = win.offsetLeft + "px"; c.style.top = win.offsetTop + "px";
  c.style.width = win.offsetWidth + "px"; c.style.height = win.offsetHeight + "px";
  c.style.borderRadius = getComputedStyle(win).borderTopLeftRadius;
  WLED.gw = 22; WLED.gh = Math.max(20, Math.round(22 * win.offsetHeight / Math.max(1, win.offsetWidth)));
  c.width = WLED.gw; c.height = WLED.gh;
  WLED.ctx = c.getContext("2d"); WLED.img = WLED.ctx.createImageData(WLED.gw, WLED.gh);
  // Randzellen im Uhrzeigersinn ab oben links
  const W = WLED.gw, H = WLED.gh, cells = [];
  for (let x = 0; x < W; x++) cells.push([x, 0]);
  for (let y = 1; y < H; y++) cells.push([W - 1, y]);
  for (let x = W - 2; x >= 0; x--) cells.push([x, H - 1]);
  for (let y = H - 2; y > 0; y--) cells.push([0, y]);
  WLED.cells = cells;
}

function wledFrame(ts){
  if (DEAD) return;
  if (!WLED.on && WLED.level < 0.02) { WLED.level = 0; $("wledCanvas").hidden = true; WLED.loop = false; return; }
  requestAnimationFrame(wledFrame);
  const c = $("wledCanvas");
  WLED.level += ((WLED.on ? 1 : 0) - WLED.level) * 0.15;
  c.style.opacity = (0.85 * WLED.level).toFixed(3);
  c.hidden = !S.door || S.side === "rear" || (!WLED.on && WLED.level < 0.02);
  if (c.hidden || !WLED.ctx || ts - WLED.last < 50) return;          // ~20 Bilder/s
  WLED.last = ts;
  const { gw:W, gh:H, n, cells } = WLED, t = ts / 1000, fx = WLED.effects[WLED.fx][1];
  let R = new Float32Array(W * H), G = new Float32Array(W * H), B = new Float32Array(W * H);
  for (let i = 0; i < n; i++){
    const col = WLED.live ? WLED.live[i] : fx(i, n, t), [x, y] = cells[Math.floor(i / n * cells.length)], k = y * W + x;
    R[k] += col[0]; G[k] += col[1]; B[k] += col[2];
  }
  // Licht vom Rand nach innen verteilen (Boxfilter, mehrfach)
  const blur = (A) => { const T = new Float32Array(A.length);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++){ let s = 0, m = 0; for (let d = -2; d <= 2; d++){ const xx = x + d; if (xx >= 0 && xx < W){ s += A[y * W + xx]; m++; } } T[y * W + x] = s / m; }
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++){ let s = 0, m = 0; for (let d = -2; d <= 2; d++){ const yy = y + d; if (yy >= 0 && yy < H){ s += T[yy * W + x]; m++; } } A[y * W + x] = s / m; } };
  for (let p = 0; p < 3; p++){ blur(R); blur(G); blur(B); }
  const d = WLED.img.data, gain = 9;
  for (let k = 0; k < W * H; k++){
    const r = Math.min(255, R[k] * gain), g = Math.min(255, G[k] * gain), b = Math.min(255, B[k] * gain);
    d[k * 4] = r; d[k * 4 + 1] = g; d[k * 4 + 2] = b; d[k * 4 + 3] = Math.max(r, g, b);
  }
  WLED.ctx.putImageData(WLED.img, 0, 0);
}

function cutDoor(){
  const sh = $("sheet"), win = ROOT.querySelector(".door .win");
  if (!sh || !win) return;
  const w = sh.offsetWidth, h = sh.offsetHeight, x = win.offsetLeft, y = win.offsetTop, ww = win.offsetWidth, hh = win.offsetHeight;
  const r = Math.min(parseFloat(getComputedStyle(win).borderTopLeftRadius) || 0, ww / 2, hh / 2);
  sh.style.clipPath = `path(evenodd, "M0 0H${w}V${h}H0Z M${x + r} ${y}H${x + ww - r}A${r} ${r} 0 0 1 ${x + ww} ${y + r}V${y + hh - r}A${r} ${r} 0 0 1 ${x + ww - r} ${y + hh}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + hh - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z")`;
}

  // Echtes Seitenverhältnis der Frontfotos (Detailbild soll nie verzerrt sein); wird beim ersten Mal nachgeladen
  const IMG_AR = {};
  function imgAr(url) {
    if (!url) return null;
    if (url in IMG_AR) return IMG_AR[url];
    IMG_AR[url] = null;
    const im = new Image();
    im.onload = () => { IMG_AR[url] = im.naturalWidth / im.naturalHeight; if (!DEAD && S.sel) renderPanel(); };
    im.src = url;
    return null;
  }

  /* ---------- Kopfzeile ---------- */
  function header() {
    const st_ = worst();
    const inDetail = !!(S.sel && byId(S.sel));
    const nMsg = allDevices().flatMap(d => d.msgs || []).filter(m => m[0] === st_).length;
    const w = RAW?.wled?.entity_id && st(RAW.wled.entity_id);
    return `<div class="bar">
      ${inDetail ? `<button class="back pill" data-back aria-label="${TR("back_to_overview")}">${ICONS.chev}</button>` : ""}
      <div><h1>${RACK.name}</h1><div class="sub">${TR("n_u_n_used_n_active_devices", RACK.units, DEVICES.reduce((a, d) => a + d.h, 0), DEVICES.filter(d => !d.passive && !d.group).length + ZERO_U.length)}</div></div>
      <span class="chip ${st_}"><i></i>${st_ === "ok" ? TR("all_good") : TR(st_ === "warn" ? (nMsg === 1 ? "1_notice" : "n_notices") : (nMsg === 1 ? "1_fault" : "n_faults"), nMsg)}</span>
      ${w ? `<span class="wled-chip ${w.state === "on" ? "" : "off"}"><button class="wsw" data-wled-power role="switch" aria-checked="${w.state === "on"}" aria-label="${TR("switch_wled_on_or_off")}"></button><span class="wfx">${TR("wled_n", w.state === "on" ? (w.attributes.effect || TR("on")) : TR("off"))}</span></span>` : ""}
      <span class="spacer"></span>
      <span class="clock" id="clock"></span>
    </div>`;
  }

  /* ---------- Übersicht ---------- */
  // Übersicht: gemeinsame Daten, daraus vier Karten (auch als Module für eine eigene Übersicht)
  function ovData() {
    const active = allDevices().filter(d => !d.passive && !d.group);
    const ups = DEVICES.find(d => d.flow), pdu = ZERO_U.find(d => d.outlets) || DEVICES.find(d => d.outlets);
    const powered = DEVICES.filter(d => d.power).sort((a, b) => b.power - a.power);
    const total = pdu?.totalPower ?? (powered.length ? powered.reduce((a, d) => a + d.power, 0) : null);
    const cap = RACK.power.capacity_w || 2700, pct = total != null ? total / cap : 0;
    const other = Math.max(0, (total || 0) - powered.reduce((a, d) => a + d.power, 0));
    const segs = powered.map((d, i) => ({ name: d.name, id: d.id, w: d.power, c: `var(${SEG_COLORS[i % SEG_COLORS.length]})` }))
      .concat([{ name: powered.length ? "nicht zugeordnet" : TR("total"), w: other, c: "var(--label-3)" }]);
    const eId = pdu?.energyId, eNow = num(eId), eStart = HIST.energyStart[eId];
    const today = eNow != null && eStart != null ? eNow - eStart : null;
    const warnMsgs = active.flatMap(d => (d.msgs || []).filter(m => m[0] !== "ok").map(m => ({ d, m }))).sort((a, b) => (b.m[0] === "alert") - (a.m[0] === "alert"));
    const temps = DEVICES.filter(d => !d.passive).map(d => ({ d, t: d.sys?.temp ?? d.temp })).filter(x => x.t != null).sort((a, b) => b.t - a.t);
    const hot = temps[0];
    const chipT = !hot ? "off" : hot.t >= TEMP_ALERT ? "alert" : hot.t >= TEMP_WARN ? "warn" : "ok";
    const lv = ups?.flow.batt, rt = ups?.flow.runtime, bc = lv == null ? "var(--fill-2)" : lv < 20 ? "var(--red)" : lv < 50 ? "var(--orange)" : "var(--green)";
    const powerVals = HS(pdu?.R?.power, total || 0);
    const gw = DEVICES.find(d => d.ports && d.facts?.some(f => f[0] === TR("latency")));
    const poeSw = DEVICES.find(d => d.poe);
    return { active, bc, cap, chipT, eId, eNow, eStart, gw, hot, lv, other, pct, pdu, poeSw, powerVals, powered, rt, segs, temps, today, total, ups, warnMsgs };
  }
  // Energiekosten (nur mit Strompreis im Rack: power.price in €/kWh oder power.price_entity); Monat = heutiger Verbrauch hochgerechnet
  function energyCost(kwhToday) {
    const P = RAW?.power || {}, price = P.price_entity && ok(st(P.price_entity)) ? num(P.price_entity) : +P.price || null;
    if (!price || kwhToday == null) return null;
    const cur = P.currency || "€", h = Math.max(1, (Date.now() - new Date().setHours(0, 0, 0, 0)) / 3600e3), money = x => `${fmt(x, x < 10 ? 2 : 0)} ${cur}`;
    return { day: money(kwhToday * price), month: money(kwhToday / h * 24 * 30.4 * price) };
  }
  function ovPower(v) { const { active, bc, cap, chipT, eId, eNow, eStart, gw, hot, lv, other, pct, pdu, poeSw, powerVals, powered, rt, segs, temps, today, total, ups, warnMsgs } = v; return `<section class="card en">
      <h2>${TR("power")}</h2>
      <div class="en-head">
        <div class="en-big">${fmt(total)}<small>W</small></div>
        <div class="en-today"><b>${today != null ? fmt(today, 1) + " kWh" : "–"}</b><span>${TR("today")}${(() => { const c = energyCost(today); return c ? ` · ≈ ${c.day}` : ""; })()}</span>${(() => { const c = energyCost(today); return c ? `<em class="en-cost">${TR("n_month", c.month)}</em>` : ""; })()}</div>
      </div>
      <div class="en-bar" role="img" aria-label="${TR("ups_load_n", Math.round(pct * 100))}">
        ${segs.map(x => `<i style="width:${x.w / cap * 100}%;background:${x.c}"></i>`).join("")}
        <span class="en-warn" style="left:70%"></span>
      </div>
      <div class="en-scale"><span>${TR("n_of_ups_capacity", Math.round(pct * 100))}${powered.length ? "" : " · " + TR("according_to_the_pdu")}</span><span>${fmt(cap / 1000, 1)} kW</span></div>
      ${ups ? `<button class="ups-bar" data-id="${selOf(ups)}" aria-label="${TR("ups_battery_n_percent_n_minutes_runtime", lv, rt)}">
        <div class="en-bar bat"><i style="width:${lv || 0}%;background:${bc}"></i></div>
        <div class="en-scale"><span>${TR("battery")} <b>${fmt(lv)} %</b> · ${fmt(rt)} min</span><span class="ups-ok" style="${ups.flow.source === TR("mains") ? "" : "color:var(--red)"}"><i class="dot ${ups.flow.source === TR("mains") ? "ok" : ""}" style="${ups.flow.source === TR("mains") ? "" : "background:var(--red)"}"></i>${ups.flow.bypass ? "Bypass" : ups.flow.source === TR("mains") ? TR("on_mains") : TR("battery_operation")}</span></div></button>` : ""}
      ${powered.length ? `<div class="en-list">${segs.slice(0, -1).slice(0, 5).map(x => `<button data-id="${x.id}"><i style="background:${x.c}"></i><span>${x.name}</span><b>${fmt(x.w)} W</b></button>`).join("")}
        <div class="rest"><i style="background:var(--label-3)"></i><span>${TR("other")}</span><b>${fmt(segs.slice(5).reduce((a, x) => a + x.w, 0))} W</b></div></div>` : ""}
      <div class="ov-chart"><div class="ov-leg"><span><i style="background:var(--blue)"></i>${TR("power_24_h")}</span><span>Ø ${fmt(Math.round(powerVals.reduce((a, b) => a + b, 0) / powerVals.length))} W · ${TR("peak")} ${fmt(Math.round(Math.max(...powerVals)))} W</span></div>
        ${lazy((W, H) => { const lo = Math.min(...powerVals) * .9, hi = Math.max(...powerVals) * 1.08 || 1; return chartMulti([{ v: powerVals, color: css("--blue"), fill: true }], { lo, hi, W, H }); })}</div>
    </section>`; }
  function ovTemp(v) { const { active, bc, cap, chipT, eId, eNow, eStart, gw, hot, lv, other, pct, pdu, poeSw, powerVals, powered, rt, segs, temps, today, total, ups, warnMsgs } = v; return `<section class="card en th3">
      <h2>${TR("temperature")} <span class="chip ${chipT}" style="text-transform:none;letter-spacing:0"><i></i>${chipT === "alert" ? TR("too_hot") : chipT === "warn" ? "Warm" : chipT === "off" ? TR("no_values") : "Normal"}</span></h2>
      ${hot ? `<div class="en-head">
        <div class="en-big">${fmt(hot.t)}<small>°C</small></div>
        <div class="en-today"><b>${hot.d.name}</b><span>${TR("warmest_device")}</span></div>
      </div>
      <div class="tscale" role="img" aria-label="${TR("warmest_device_n_degrees", hot.t)}">
        <i class="tz ok" style="width:${tpd(TEMP_WARN)}%"></i><i class="tz warn" style="width:${tpd(TEMP_ALERT) - tpd(TEMP_WARN)}%"></i><i class="tz alert" style="width:${100 - tpd(TEMP_ALERT)}%"></i>
        <em class="tmark out" style="left:${tpd(hot.t)}%"></em>
      </div>
      <div class="en-scale"><span>${TR("device_temperatures_no_rack_sensors")}</span><span>${TR("limit_n", `${TEMP_WARN} °C`)}</span></div>
      <div class="ztab dev">
        <span class="zh">${TR("device")}</span><span class="zh">${TR("temperature")}</span>
        ${temps.slice(0, 6).map(({ d, t }) => `<button class="zn ${d.name.length > 16 ? "long" : ""}" data-id="${selOf(d)}" title="${d.name}">${d.name}</button><b style="color:${t >= TEMP_ALERT ? "var(--red)" : t >= TEMP_WARN ? "var(--warn-ink)" : "var(--label)"}">${fmt(t)} °C</b>`).join("")}
      </div>` : `<p class="note">${TR("no_temperature_values_available")}</p>`}
    </section>`; }
  function ovHints(v) { const { active, bc, cap, chipT, eId, eNow, eStart, gw, hot, lv, other, pct, pdu, poeSw, powerVals, powered, rt, segs, temps, today, total, ups, warnMsgs } = v; return `${warnMsgs.length ? `<section class="card wide hints"><h2><span>${TR("notices")} <i class="cnt ${warnMsgs.some(x => x.m[0] === "alert") ? "alert" : ""}">${warnMsgs.length}</i></span>${warnMsgs.length > 2 ? `<em>${TR("n_more_2", warnMsgs.length - 2)}</em>` : ""}</h2><div class="hint-grid">
      ${warnMsgs.slice(0, 2).map(({ d, m }) => `<button class="hint ${m[0]}" data-id="${selOf(d)}">
        <span class="hic">${ICONS.warn}</span>
        <span class="ht"><b>${m[1]}</b><span><i>${d.name}</i>${m[2]}</span></span><span class="chev">›</span></button>`).join("")}
    </div></section>` : ""}`; }
  function ovStats(v) { const { active, bc, cap, chipT, eId, eNow, eStart, gw, hot, lv, other, pct, pdu, poeSw, powerVals, powered, rt, segs, temps, today, total, ups, warnMsgs } = v; return `<div class="stats wide">
      ${gw ? `<button data-id="${gw.id}"><span>Internet</span><b>${gw.facts.find(f => f[0] === TR("latency"))[1].replace(" ms", "")}<small>ms</small></b><em>${TR("latency")}</em></button>` : ""}
      ${poeSw ? `<button data-id="${poeSw.id}"><span>PoE</span><b>${fmt(poeSw.poe.used)}<small>W</small></b><em>${poeSw.poe.budget ? TR("of_n", `${poeSw.poe.budget} W`) : poeSw.name}</em></button>` : ""}
      ${pdu ? `<button data-id="${pdu.id}"><span>${TR("pdu")}</span><b>${fmt(num(pdu.R?.current), 1)}<small>A</small></b><em>${pdu.facts[2][1]}</em></button>` : ""}
      ${ups ? `<button data-id="${selOf(ups)}"><span>${TR("ups")}</span><b>${fmt(ups.flow.loadPct)}<small>%</small></b><em>${TR("load_2")} · ${fmt(ups.flow.runtime)} min</em></button>` : ""}
    </div>`; }
  // Pseudo-Gerät für die eigene Übersicht (Module mit beliebigen Entitäten)
  function ovModel() { return { id: "__ov", name: RACK.name, model: "", R: {}, msgs: [], blocks: RAW?.overview?.blocks || [], options: { grid: true } }; }
  function overview() {
    if (RAW?.overview?.blocks?.length) return ovGrid();
    const v = ovData();
    return `<div class="ov">${ovPower(v)}${ovTemp(v)}${ovHints(v)}${ovStats(v)}</div>`;
  }
  function ovGrid() {
    const d = ovModel(), G = rdGeometry(RAW?.display);
    const cells = d.blocks.map((b, bi) => {
      const f = BLOCK_RENDER[b.type]; if (!f) return "";
      const html = f(d, b), l = b.layout || {}, w = Math.max(1, Math.min(12, l.w || 12)), h = Math.max(1, l.h || 3), fixed = Number.isInteger(l.x) && Number.isInteger(l.y);
      const st = fixed ? `grid-column:${l.x + 1} / span ${Math.min(w, 12 - l.x)} !important;grid-row:${l.y + 1} / span ${h} !important` : `grid-column:span ${w} !important;grid-row:span ${h} !important`;
      if (!html) return EDIT_HOOK ? `<section data-bi="${bi}" style="${st}" class="gcell card empty-mod"><h2>${rdCatalog().blocks[b.type]?.name || b.type}</h2>${rdSkeleton(b.type)}</section>` : "";
      return html.replace(/<(section|div) class="/, `<$1 data-bi="${bi}" style="${st}" class="gcell card `);
    }).join("");
    return `<div class="dgrid gm ovg" style="--gc:12;--gr:${G.frows || 15}">${cells}</div>`;
  }
  const tpd = t => Math.max(0, Math.min(100, (t - 20) / (100 - 20) * 100));

  /* ---------- Gerätekarten mit echten Verläufen ---------- */
  /* ---------- Verläufe als Zeilen: jeder Wert mit eigener Skala, aktuellem Wert und Min/Max ---------- */
  // Skala je Einheit: Prozent 0–100, Temperatur 20 °C bis über die Warngrenze, Mengen ab 0 – kleine Schwankungen bleiben klein
  function trendRange(v, unit, warn) {
    const lo = Math.min(...v), hi = Math.max(...v);
    if (unit === "%") return [0, Math.max(100, hi)];
    if (unit === "°C") return [Math.min(20, lo - 5), Math.max(warn != null ? warn + 5 : 90, hi + 5)];
    if (unit === "V") return [Math.min(lo, 200) - 5, Math.max(hi, 250) + 5];
    return [Math.min(0, lo), Math.max(hi * 1.25, warn != null ? warn * 1.05 : 0, 1e-6)];
  }
  // Gleitender Mittelwert (3 Punkte) gegen Treppen- und Zickzack-Effekte bei ganzzahligen Sensoren
  const smooth = v => v.map((y, i) => (v[Math.max(0, i - 1)] + y + v[Math.min(v.length - 1, i + 1)]) / 3);
  function sparkSvg(v, color, W, H, warn, range) {
    const [lo, hi] = range || trendRange(v, "", warn), s = smooth(smooth(v));
    const X = i => (i / (s.length - 1)) * (W - 6) + 1, Y = y => 3 + (1 - (Math.min(hi, Math.max(lo, y)) - lo) / ((hi - lo) || 1)) * (H - 6);
    const P = s.map((y, i) => [X(i), Y(y)]);
    let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    const gid = "s" + Math.random().toString(36).slice(2, 7), showWarn = warn != null && warn <= hi;
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <line x1="0" x2="${W}" y1="${H - .5}" y2="${H - .5}" stroke="${css("--sep")}" stroke-width="1"/>
      ${showWarn ? `<line x1="0" x2="${W}" y1="${Y(warn)}" y2="${Y(warn)}" stroke="${css("--orange")}" stroke-dasharray="3 3" stroke-width="1" opacity=".8"/>` : ""}
      <path d="${d}L${P.at(-1)[0]},${H}L${P[0][0]},${H}Z" fill="url(#${gid})"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${P.at(-1)[0]}" cy="${Y(v.at(-1))}" r="3" fill="${color}" stroke="var(--glass)" stroke-width="1.5"/></svg>`;
  }
  // series: [{ label, id, cur, unit, color, dec, warn }]
  // Kennzahl-Kacheln: großer Wert, Pegel auf fester Skala (mit Warngrenze), darunter eine flache 24-Std.-Kurve.
  // Die Kurve skaliert auf ihren eigenen Bereich, aber mit Mindestspanne – Form sichtbar, ohne Rauschen aufzublasen.
  function trendCard(title, series, sub = TR("24_h")) {
    const tiles = series.filter(s => s.id || s.cur != null).map(s => {
      const v = HS(s.id, s.cur ?? 0), dec = s.dec ?? 0, cur = s.cur ?? v.at(-1), col = css(s.color || "--blue");
      const [flo, fhi] = trendRange(v, s.unit, s.warn), lo = Math.min(...v), hi = Math.max(...v), span = Math.max(hi - lo, (fhi - flo) * .15);
      const mid = (lo + hi) / 2, range = [Math.max(flo, mid - span * .6), Math.min(fhi, mid + span * .6)];
      const lvl = s.unit === "%" || s.unit === "°C", pct = x => Math.max(0, Math.min(100, (x - flo) / (fhi - flo) * 100));
      const st = s.warn != null && cur >= s.warn ? "alert" : s.warn != null && cur >= s.warn - 5 ? "warn" : "";
      return `<div class="mt ${st}" style="--c:var(${s.color || "--blue"})">
        <div class="mth"><span>${s.label}</span>${hi - cur >= (fhi - flo) * .04 ? `<em>max ${fmt(hi, dec)}</em>` : ""}</div>
        <b class="mtv">${fmt(cur, dec)}<small>${s.unit || ""}</small></b>
        ${lvl ? `<div class="mtl"><i style="width:${pct(cur).toFixed(1)}%"></i>${s.warn != null ? `<u style="left:${pct(s.warn).toFixed(1)}%"></u>` : ""}</div>` : ""}
        ${lazy((W, H) => sparkSvg(v, col, W, H, null, range))}</div>`;
    }).join("");
    return tiles ? `<section class="card mtc"><h2>${title} <em>${sub}</em></h2><div class="mtw"><div class="mts">${tiles}</div></div></section>` : "";
  }

  function sysCard(d) {
    const s = d.sys;
    return trendCard("System", [
      s.cpu != null && { label: TR("processor"), id: s.ids.cpu, cur: s.cpu, unit: "%", color: "--blue" },
      s.ram != null && { label: TR("memory"), id: s.ids.ram, cur: s.ram, unit: "%", color: "--indigo" },
      { label: TR("temperature"), id: s.ids.temp, cur: s.temp, unit: "°C", color: "--orange", warn: TEMP_WARN },
    ].filter(Boolean));
  }
  function sysCardOld(d) {
    const s = d.sys, cpu = HS(s.ids.cpu, s.cpu), ram = HS(s.ids.ram, s.ram), tmp = HS(s.ids.temp, s.temp);
    return `<section class="card grow"><h2>System <em>${TR("24_h")}</em></h2>
      <div class="serleg">${s.cpu != null ? `<span><i style="background:var(--blue)"></i>CPU <b>${fmt(s.cpu)} %</b></span>` : ""}${s.ram != null ? `<span><i style="background:var(--indigo)"></i>RAM <b>${fmt(s.ram)} %</b></span>` : ""}<span><i style="background:var(--orange)"></i>Temp. <b>${fmt(s.temp)} °C</b></span></div>
      ${lazy((W, H) => chartMulti([s.cpu != null && { v: cpu, color: css("--blue"), fill: true }, s.ram != null && { v: ram, color: css("--indigo") }, { v: tmp, color: css("--orange") }].filter(Boolean), { lo: 0, hi: 100, W, H }))}
      <div class="mini" style="margin-top:10px"><span>${TR("peak")} ${s.cpu != null ? `<b>${Math.round(Math.max(...cpu))} %</b> · ` : ""}<b>${Math.round(Math.max(...tmp))} °C</b></span>${s.ram != null ? `<span>Ø RAM <b>${Math.round(ram.reduce((a, b) => a + b) / ram.length)} %</b></span>` : ""}</div>
    </section>`;
  }
  function voltCard(d) {
    const f = d.flow;
    return trendCard(TR("voltage"), [
      { label: TR("input"), id: f.ids.in, cur: f.inV, unit: "V", color: "--orange" },
      { label: TR("output"), id: f.ids.out, cur: f.outV, unit: "V", color: "--green" },
    ]);
  }
  function voltCardOld(d) {
    const f = d.flow, vin = HS(f.ids.in, f.inV), vout = HS(f.ids.out, f.outV);
    const lo = Math.min(...vin, ...vout) - 3, hi = Math.max(...vin, ...vout) + 3;
    return `<section class="card grow"><h2>${TR("voltage")} <em>${TR("24_h")}</em></h2>
      <div class="serleg"><span><i style="background:var(--orange)"></i>${TR("input")} <b>${fmt(f.inV)} V</b></span><span><i style="background:var(--green)"></i>${TR("output")} <b>${fmt(f.outV)} V</b></span></div>
      ${lazy((W, H) => chartMulti([{ v: vin, color: css("--orange") }, { v: vout, color: css("--green") }], { lo, hi, W, H }))}
      <div class="mini" style="margin-top:10px"><span>${TR("input_min")} <b>${Math.round(Math.min(...vin))} V</b> · max <b>${Math.round(Math.max(...vin))} V</b></span><span>${f.hz != null ? `${fmt(f.hz, 1)} Hz` : ""}</span></div>
    </section>`;
  }
  // Speicher wie im UNVR: Status, Belegungsbalken (belegt/frei/Schutz), Laufwerksliste
  function diskCard(d) {
    const r = d.raid, okN = d.disks.filter(x => x.state === "ok").length, allOk = okN === d.disks.length;
    const cap = r.capacity_tb, used = r.used != null && cap ? cap * r.used / 100 : null, prot = r.protection_tb || 0, tot = cap ? cap + prot : null;
    const tb = x => x >= 1 ? `${fmt(x, 2)} TB` : `${fmt(x * 1000)} GB`;
    const info = n => (r.disks || []).find(x => x.n === n) || {};
    // Ring wie in der UNVR-Oberfläche: Belegt / Frei / Schutz, in der Mitte der Füllstand
    const RR = 46, C = 2 * Math.PI * RR, segs = tot ? [[used, "--blue"], [cap - used, "--label-3"], [prot, "--purple"]].filter(s => s[0] > 0) : r.used != null ? [[r.used, "--blue"], [100 - r.used, "--fill-2"]] : [];
    // Jeder vorhandene Anteil bleibt sichtbar (mind. 5 % des Umfangs), auch wenn z. B. nur 0,5 % frei sind
    const sum = segs.reduce((s, x) => s + x[0], 0) || 1, gap = 0, MIN = C * .05;
    const raw = segs.map(([v]) => C * v / sum), small = raw.filter(x => x < MIN), big = raw.reduce((s, x) => s + (x >= MIN ? x : 0), 0);
    const lens = raw.map(x => x < MIN ? MIN : x * (C - MIN * small.length) / (big || 1)); let off = 0;
    const arcs = segs.map(([, c], i) => { const len = Math.max(0.5, lens[i] - gap), el = `<circle cx="56" cy="56" r="${RR}" fill="none" stroke="var(${c})" stroke-width="12" stroke-dasharray="${len.toFixed(1)} ${C.toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}"/>`; off += lens[i]; return el; }).join("");
    const pct = r.used != null ? r.used : used != null && cap ? used / cap * 100 : null;
    const rows = tot ? [[TR("used_2"), tb(used), "--blue"], [TR("free_2"), tb(cap - used), "--label-3"], prot && [TR("protection"), tb(prot), "--purple"]].filter(Boolean) : pct != null ? [[TR("used_2"), `${fmt(pct)} %`, "--blue"]] : [];
    const ring = segs.length ? `<div class="sring"><div class="ring"><svg viewBox="0 0 112 112">${arcs}</svg><div class="c"><b>${fmt(pct)}<small>%</small></b><span>${TR("used")}</span></div></div>
        <div class="srows"><div class="sstat ${allOk ? "ok" : "warn"}"><i></i>${allOk ? TR("fully_functional") : TR(d.disks.length - okN === 1 ? "check_n_drive" : "check_n_drives", d.disks.length - okN)}</div>
          ${rows.map(([k, v, c]) => `<div class="srow"><span><i style="background:var(${c})"></i>${k}</span><b>${v}</b></div>`).join("")}
          ${tot ? `<div class="srow tot"><span>${TR("total")}</span><b>${tb(tot)}</b></div>` : ""}</div></div>` : `<div class="sstat ${allOk ? "ok" : "warn"}"><i></i>${allOk ? TR("fully_functional") : TR("check_drives")}</div>`;
    // Schächte als Kacheln nebeneinander (wie die Laufwerksansicht der UNVR)
    const bays = `<div class="dbays" style="grid-template-columns:repeat(${Math.min(4, d.disks.length)},minmax(0,1fr))">${d.disks.map(x => { const k = info(x.n); return `<div class="dbay ${x.state}" title="${k.model || ""}"><div class="bt"><i></i><b>${x.label} ${x.n}</b></div><span>${x.state === "ok" ? "Optimal" : x.state === "warn" ? TR("check") : TR("no_data")}</span><em>${k.size || ""}${k.model ? ` ${TR("bullet_n", k.model)}` : ""}</em></div>`; }).join("")}</div>`;
    return `<section class="card"><h2>${TR("storage")} <em>${[r.raid, `${d.disks.length} ${r.disk_label || TR("drives")}`, cap && `${fmt(cap, 2)} TB`].filter(Boolean).join(" · ")}</em></h2>
      ${ring}${bays}
    </section>`;
  }
  // USV-Karte: großer Akku-Ring mit Reserve, Betriebsart in Klartext, schmaler Stromweg Netz → USV → Last, Kennwerte als Kacheln
  function upsFlow(d) {
    const f = d.flow, u = d.ups || {}, onBatt = f.source !== TR("mains"), bypass = !!f.bypass, charging = !onBatt && !bypass && f.batt != null && f.batt < 99.5;
    const bp = Math.max(0, Math.min(100, f.batt ?? 0)), lp = Math.max(0, Math.min(100, f.loadPct ?? 0));
    const bcol = bp < 20 ? "--red" : bp < 50 ? "--orange" : "--green", mcol = bypass ? "--yellow" : onBatt ? "--orange" : "--green";
    const mode = bypass ? ["Bypass", "warn", TR("load_runs_directly_on_mains")] : onBatt ? [TR("battery_mode"), "alert", TR("mains_failed_battery_supplies")] : [TR("on_mains"), "ok", charging ? TR("battery_charging") : TR("everything_powered")];
    const RR = 52, C = 2 * Math.PI * RR;
    const ring = `<svg viewBox="0 0 124 124" class="ug-svg"><circle cx="62" cy="62" r="${RR}" class="ug-tr"/>
      <circle cx="62" cy="62" r="${RR}" class="ug-v" style="--c:var(${bcol})" stroke-dasharray="${(C * bp / 100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 62 62)"/></svg>`;
    // Stromweg wie im Gerät: Online-USV (Doppelwandlung). Netz → Gleichrichter → DC-Zwischenkreis (Akku) → Wechselrichter → Last,
    // parallel dazu der statische Bypass. Die Leuchtpunkte setzt eine Schleife anhand der Uhrzeit (kein Springen beim Neuzeichnen).
    const online = !/smt|smc|line.?interactive|back.?ups|\bbx\d/i.test(d.model || "");
    const Y = 72, YB = 38, NX = 24, LX = 376, J1 = 70, J2 = 330, RX = 122, IX = 278, BW = 66, BX = 200, BYB = 102;
    const P = { plug: "M8 2h2v5h4V2h2v5h1a1 1 0 0 1 1 1v4a6 6 0 0 1-5 5.9V22h-2v-4.1A6 6 0 0 1 6 12V8a1 1 0 0 1 1-1h1z", rack: "M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 2v3h12V4Zm0 5v3h12V9Zm0 5v3h12v-3Z" };
    const S = 17, mains = !onBatt && !bypass;
    const wire = (dd, on, c) => `<path d="${dd}" class="ul ${on ? "on" : ""}" style="--c:var(${c})"/>`;
    // Bewegungspfade: Punkte in festem Abstand, Position kommt aus upsDots()
    const mp = [];
    const motion = (pts, c) => { let len = 0; for (let n = 1; n < pts.length; n++) len += Math.hypot(pts[n][0] - pts[n - 1][0], pts[n][1] - pts[n - 1][1]);
      const m = mp.length; mp.push(`<path class="um" d="M${pts.map(p => p.join(",")).join(" L")}"/>`);
      return Array.from({ length: Math.max(2, Math.round(len / 26)) }, (_, q) => `<circle r="3" class="ud" data-m="${m}" data-q="${q}" data-n="${Math.max(2, Math.round(len / 26))}" style="--c:var(${c})" cx="-9" cy="-9"/>`).join(""); };
    let dts = "";
    if (mains) dts += motion([[NX + S, Y], [RX - BW / 2, Y]], "--green") + motion([[RX + BW / 2, Y], [IX - BW / 2, Y]], "--green") + motion([[IX + BW / 2, Y], [LX - S, Y]], "--green");
    if (mains && charging) dts += motion([[BX, Y], [BX, BYB - 11]], "--green");
    if (onBatt && !bypass) dts += motion([[BX, BYB - 11], [BX, Y], [IX - BW / 2, Y]], "--orange") + motion([[IX + BW / 2, Y], [LX - S, Y]], "--orange");
    if (bypass) dts += motion([[NX + S, Y], [J1, Y], [J1, YB], [J2, YB], [J2, Y], [LX - S, Y]], "--yellow");
    const sw = bypass ? `<line x1="${BX - 12}" y1="${YB}" x2="${BX + 12}" y2="${YB}" class="usw on"/>` : `<line x1="${BX - 12}" y1="${YB}" x2="${BX + 10}" y2="${YB - 10}" class="usw"/>`;
    const box = (x, t1, t2, on, c) => `<rect x="${x - BW / 2}" y="${Y - 13}" width="${BW}" height="26" rx="4" class="ubx ${on ? "on" : ""}" style="--c:var(${c})"/><text x="${x}" y="${Y + 4}" text-anchor="middle" class="ubt">${t1}</text><text x="${x}" y="${Y + 26}" text-anchor="middle" class="ubs">${t2}</text>`;
    const node = (x, on, c, ic, name, val) => `<rect x="${x - S}" y="${Y - S}" width="${2 * S}" height="${2 * S}" rx="11" class="un ${on ? "on" : ""}" style="--c:var(${c})"/>
      <g transform="translate(${x - 9.5},${Y - 9.5}) scale(.79)" class="uic ${on ? "on" : ""}" style="--c:var(${c})"><path d="${ic}"/></g>
      <text x="${x}" y="${Y + S + 15}" text-anchor="middle" class="uval">${val}</text><text x="${x}" y="${Y + S + 27}" text-anchor="middle" class="ulb">${name}</text>`;
    const bfill = (34 * bp / 100).toFixed(1);
    const path = `<svg viewBox="0 0 400 120" class="upath" data-v="${(40 + lp * 0.8).toFixed(0)}">
      <rect x="${J1 - 14}" y="12" width="${J2 - J1 + 28}" height="${BYB + 5}" rx="6" class="uenc"/>
      <g class="ubl"><rect x="${BX - 52}" y="4" width="104" height="16" rx="8"/><text x="${BX}" y="15.5" text-anchor="middle">${online ? TR("online_ups") : "Line-Interactive"}</text></g>
      ${wire(`M${NX + S},${Y} L${RX - BW / 2},${Y}`, mains || bypass, bypass ? "--yellow" : "--green")}
      ${wire(`M${J1},${Y} L${J1},${YB} L${BX - 12},${YB} M${BX + 12},${YB} L${J2},${YB} L${J2},${Y}`, bypass, "--yellow").replace('class="ul ', 'class="ul byp ')}
      ${sw}<circle cx="${BX - 12}" cy="${YB}" r="2.2" class="ujn"/><circle cx="${BX + 12}" cy="${YB}" r="2.2" class="ujn"/>
      <text x="${J1 + 8}" y="${YB - 5}" class="ulb">${bypass ? TR("bypass_active") : "Bypass"}</text>
      ${wire(`M${RX + BW / 2},${Y} L${IX - BW / 2},${Y}`, !bypass, onBatt ? "--orange" : "--green")}
      ${wire(`M${BX},${Y} L${BX},${BYB - 11}`, onBatt || charging, onBatt ? "--orange" : "--green")}
      ${wire(`M${IX + BW / 2},${Y} L${LX - S},${Y}`, true, mcol)}
      
      ${box(RX, "AC → DC", TR("rectifier"), mains, "--green")}${box(IX, "DC → AC", TR("inverter"), !bypass, onBatt ? "--orange" : "--green")}
      <rect x="${BX - 21}" y="${BYB - 11}" width="40" height="22" rx="5" class="ubat"/><rect x="${BX + 20}" y="${BYB - 4}" width="3" height="8" rx="1.5" class="ubatk"/>
      <rect x="${BX - 18}" y="${BYB - 8}" width="${bfill}" height="16" rx="3" style="fill:var(${bcol})"/>
      
      ${node(NX, !onBatt, "--green", P.plug, onBatt ? TR("mains_off") : f.hz ? `${fmt(f.hz, 1)} Hz` : TR("mains"), onBatt ? "–" : `${fmt(f.inV)} V`)}
      ${node(LX, true, mcol, P.rack, TR("load_2"), f.load != null ? `${fmt(f.load)} W` : `${fmt(lp)} %`)}
      ${mp.join("")}${dts}</svg>`;
    const cell = (k, v, s, c) => `<div class="ukc"><span>${k}</span><b${c ? ` style="color:var(${c})"` : ""}>${v}</b>${s ? `<em>${s}</em>` : ""}</div>`;
    const age = (() => { const m = (u.bdate || "").match(/^(\d{2})\/(\d{4})$/); if (!m) return ""; const mo = (new Date().getFullYear() - +m[2]) * 12 + new Date().getMonth() + 1 - +m[1]; return mo >= 12 ? TR("since_n", TR("n_years_n_months", Math.floor(mo / 12), mo % 12)) : TR("since_n", TR("n_months", mo)); })();
    // Kacheln nur mit dem, was der Stromweg nicht schon zeigt: Akku-Zustand und Wartung
    const cells = [
      cell(TR("temperature"), u.bt != null ? `${fmt(u.bt)} °C` : "–", u.bt != null ? (u.bt >= 40 ? `${TR("battery")} · ${TR("too_warm")}` : `${TR("battery")} · normal`) : TR("battery"), u.bt >= 40 ? "--orange" : ""),
      cell(TR("voltage"), u.bv != null ? `${fmt(u.bv, 1)} V` : "–", TR("battery")),
      cell(TR("installed"), u.bdate || "–", age ? age.replace("seit", "vor") : TR("battery")),
      cell(TR("self_test"), u.selftest === TR("passed") ? "✓ OK" : u.selftest || "–", u.selftest === TR("passed") ? TR("passed") : "", u.selftest && u.selftest !== TR("passed") ? "--orange" : ""),
    ].join("");
    return `<section class="card wide ups2" style="--uc:var(${mcol})">
      <div class="uh">
        <div class="ug">${ring}<div class="ugc"><b>${fmt(bp)}<small>%</small></b><span>${charging ? TR("charging") : onBatt ? TR("discharging") : TR("battery")}</span></div></div>
        <div class="ui">
          <span class="umode ${mode[1]}"><i></i>${mode[0]}</span>
          <b class="ut">${mode[2]}</b>
          <span class="us">${fmt(lp)} % ${TR("load_lower")}${f.runtime != null ? ` · <b>${fmt(f.runtime)} min</b> ${TR("runtime")}` : ""}</span>
        </div>
      </div>
      ${path}
      <div class="ukv">${cells}</div>
    </section>`;
  }
  // Leuchtpunkte im USV-Stromweg: Position nur aus der Uhrzeit (gleichmäßige Geschwindigkeit in px/s), daher kein Springen
  function placeDots() {
    const t = performance.timeOrigin + performance.now();
    ROOT.querySelectorAll("svg.upath").forEach(svg => {
      const v = +svg.dataset.v || 50, ms = svg.querySelectorAll("path.um");
      svg.querySelectorAll("circle.ud").forEach(c => {
        const p = ms[+c.dataset.m]; if (!p) return;
        const L = p._len || (p._len = p.getTotalLength()), n = +c.dataset.n, s = ((t / 1000 * v) + (+c.dataset.q) * L / n) % L;
        const pt = p.getPointAtLength(s); c.setAttribute("cx", pt.x.toFixed(1)); c.setAttribute("cy", pt.y.toFixed(1));
      });
    });
  }
  function upsDots() {
    if (DEAD) return;
    const svgs = ROOT.querySelectorAll("svg.upath");
    if (!svgs.length) { setTimeout(upsDots, 500); return; }   // keine USV offen: selten nachsehen
    requestAnimationFrame(upsDots);
    // Auf dem Pi (lite) reichen 30 Bilder pro Sekunde
    const now = performance.now(); if (WRAP.classList.contains("lite") && now - (upsDots.t || 0) < 32) return; upsDots.t = now;
    placeDots();
  }
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(upsDots);
  function recCard(d) {
    const r = d.rec, R = 52, C = 2 * Math.PI * R; let off = 0;
    const arcs = r.types.map(([n, v, c]) => { const a = `<circle cx="62" cy="62" r="${R}" fill="none" stroke="var(${c})" stroke-width="14" stroke-dasharray="${Math.max(0.5, C * v / 100)} ${C}" stroke-dashoffset="${-off}"/>`; off += C * v / 100; return a; }).join("");
    return `<section class="card grow"><h2>${TR("recording_2")} <em>${r.cams ? TR("n_of_n_cameras", r.camsOn, r.cams) : TR("retention")}</em></h2>
      <div class="rec">
        <div class="ring"><svg viewBox="0 0 124 124"><circle cx="62" cy="62" r="${R}" fill="none" stroke="var(--fill-2)" stroke-width="14"/>${arcs}</svg><div class="c"><b>${r.days}</b><span>${TR("days")}</span></div></div>
        <div class="rows">${r.types.map(([n, v, c]) => `<div class="row"><span><i style="background:var(${c})"></i>${n}</span><b>${fmt(v, v < 1 ? 1 : 0)} %</b></div>`).join("")}
          ${r.events != null ? `<div class="row" style="padding-top:8px;border-top:1px solid var(--sep)"><span>${TR("detections_today")}</span><b>${fmt(r.events)}</b></div>` : ""}</div>
      </div>
    </section>`;
  }

  const actLevel = p => p.rx == null && p.tx == null ? -1 : Math.min(4, Math.round(Math.log10(1 + (p.rx || 0) + (p.tx || 0)) * 1.5));
  // Blinktakt der Port-LEDs am Rack folgt dem echten Verkehr: viel Durchsatz = schnelles Flackern
  function ledDur(p, h) {
    if (p.rx == null && p.tx == null) return (0.12 + (h % 9) * 0.07).toFixed(2);
    const t = (p.rx || 0) + (p.tx || 0);
    return (t < 0.02 ? 2.6 : Math.max(0.06, 0.95 - Math.log10(1 + t) * 0.3)).toFixed(2);
  }
  function rate(x) {
    if (x == null) return "–";
    if (x >= 1000) return `${fmt(x / 1000, 2)} Gbit/s`;
    if (x >= 1) return `${fmt(x, x < 10 ? 1 : 0)} Mbit/s`;
    return `${fmt(x * 1000)} kbit/s`;
  }
  // Live-Kurve eines Ports: Download nach oben, Upload nach unten gespiegelt
  // Port-Historie: Balken je 2 Minuten über die letzte Stunde (aus dem Live-Puffer), Download nach oben, Upload nach unten
  const HIST_SPAN = 60 * 60e3, HIST_BINS = 30;
  function portBins(id, now) {
    const all = LIVE[id] || [], w = HIST_SPAN / HIST_BINS, out = [];
    let k = 0, last = null;
    for (let b = 0; b < HIST_BINS; b++) {
      const t0 = now - HIST_SPAN + b * w, t1 = t0 + w, vals = [];
      while (k < all.length && all[k][0] < t1) { if (all[k][0] >= t0) vals.push(all[k][1]); else last = all[k][1]; k++; }
      if (vals.length) last = vals.at(-1);
      out.push(vals.length ? vals.reduce((s, x) => s + x, 0) / vals.length : last);
    }
    const cur = num(id); if (cur != null) out[HIST_BINS - 1] = cur;
    return out;
  }
  function liveSvg(p) {
    const now = Date.now(), rx = portBins(p.ids.rx, now), tx = portBins(p.ids.tx, now);
    const mx = Math.max(0.01, ...rx.filter(x => x != null), ...tx.filter(x => x != null)) * 1.1;
    const W = HIST_BINS * 10, H = 100, mid = H / 2, bw = 7;
    const bar = (v, i, dir, col) => v == null ? "" : `<rect x="${i * 10 + 1.5}" y="${dir > 0 ? mid - 1 - Math.max(.8, v / mx * (mid - 2)) : mid + 1}" width="${bw}" height="${Math.max(.8, v / mx * (mid - 2))}" fill="var(${col})" opacity="${i === HIST_BINS - 1 ? 1 : .75}"/>`;
    const first = (LIVE[p.ids.rx] || [])[0]?.[0], mins = first ? Math.min(60, Math.max(1, Math.round((now - first) / 60e3))) : 0;
    return `<div class="phist-ax"><span>↓ ${rateK(mx / 1.1)}</span><span>${mins >= 60 ? TR("last_hour") : mins ? TR("since_n", TR("n_min", mins)) : ""}</span></div>
      <svg class="plive" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      ${rx.map((v, i) => bar(v, i, 1, "--rx")).join("")}${tx.map((v, i) => bar(v, i, -1, "--tx")).join("")}
      <line x1="0" x2="${W}" y1="${mid}" y2="${mid}" stroke="var(--sep)" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>
      <div class="phist-ax"><span>↑ ${rateK(mx / 1.1)}</span><span>${TR("now")}</span></div>`;
  }
  // Nachbarn: Uplink (Gerät weiter oben in der Kette: Gateway > Aggregation > Switch) und Bündel (mehrere Ports zum selben Gerät)
  const portRange = l => { const n = l.map(Number).sort((x, y) => x - y); return n.length > 2 && n.at(-1) - n[0] === n.length - 1 ? `${n[0]}–${n.at(-1)}` : n.join(", "); };
  // Port-Symbole wie im UniFi-Controller (weiß auf der Portfarbe)
  const PI = (d, extra = "") => `<svg class="pi" viewBox="0 0 12 12" aria-hidden="true"><path d="${d}"/>${extra}</svg>`;
  const PORT_ICON = {
    poe: PI("M6.6 1.5 3.4 6.4h2.4l-.5 4.1 3.3-5.2H6.2z", '<path d="M9 1.3v2.4M7.8 2.5h2.4"/>'),
    poe2: PI("M5.6 1.5 2.4 6.4h2.4l-.5 4.1 3.3-5.2H5.2z", '<path d="M9 1.3v2.4M7.8 2.5h2.4M9 6.8v2.4M7.8 8h2.4"/>'),
    up: PI("M2.8 7.6 6 4.4l3.2 3.2"),
    lag: PI("M3.2 2.6c0 2.6.8 3.4 3 3.4h3.3M3.2 9.4c0-2.6.8-3.4 3-3.4M8 4.4 9.6 6 8 7.6", '<circle cx="3.2" cy="2" r=".9"/><circle cx="3.2" cy="10" r=".9"/>'),
  };
  const NET_TIER = { gw: 0, sfp: 1, switch: 2 };
  const devNamed = n => n && DEVICES.concat(ZERO_U).find(x => x.name && x.name.toLowerCase() === String(n).toLowerCase());
  function portRoles(d) {
    const cnt = {}, me = NET_TIER[d.type] ?? 3;
    d.ports.forEach(p => p.peer && (cnt[p.peer] = (cnt[p.peer] || 0) + 1));
    let up = null;
    for (const p of d.ports) { const o = devNamed(p.peer), t = o ? NET_TIER[o.type] ?? 3 : 9; if (t < me && (!up || t < up.t)) up = { o, t, name: p.peer }; }
    // Kein eigener Hinweis (z. B. UniFi ohne Nachbar-Attribute): umgekehrt suchen, wer dieses Gerät als Nachbar meldet
    if (!up) for (const o of DEVICES) { const t = NET_TIER[o.type] ?? 3; if (o !== d && t < me && (o.ports || []).some(x => x.peer && x.peer.toLowerCase() === d.name.toLowerCase()) && (!up || t < up.t)) up = { o, t, name: o.name }; }
    const back = up ? (up.o.ports || []).filter(x => x.peer && x.peer.toLowerCase() === d.name.toLowerCase()) : [];
    return { lag: n => cnt[n] > 1, up, remote: back.map(x => x.label), back, isUp: p => !!up && p.peer === up.name };
  }
  function portCard(d) {
    const busy = p => (p.rx || 0) + (p.tx || 0), R = portRoles(d);
    if (!S.port || !d.ports.find(p => p.n === S.port)) S.port = ([...d.ports].filter(p => p.speed).sort((a, b) => busy(b) - busy(a))[0] || d.ports[0]).n;
    const sel = d.ports.find(p => p.n === S.port), up = d.ports.filter(p => p.speed).length;
    if (sel.ids?.rx) loadPortHistory(sel);
    LIVE_SEL = sel.ids?.rx ? sel : null;
    const poeIc = p => p.poePP ? PORT_ICON.poe2 : PORT_ICON.poe;
    const icon = p => R.isUp(p) ? PORT_ICON.up : R.lag(p.peer) ? PORT_ICON.lag : p.poeCap ? poeIc(p) : !p.speed && p.kind !== "rj45" ? `<span class="pt">${p.kind === "sfp28" ? "SFP28" : "SFP"}</span>` : "";
    // Je Gruppe zwei Portreihen (oben ungerade, unten gerade) – wie im UniFi-Controller
    const grp = ([kind, nums]) => { const cols = Math.ceil(nums.length / 2); return `<div class="pgrp" style="flex:${cols} 1 0;grid-template-columns:repeat(${cols},minmax(0,1fr))">${nums.map((n, k) => {
      const p = d.ports.find(x => x.n === n), c = Math.floor(k / 2) + 1, top = k % 2 === 0;
      return `<button class="port ${kind} ${p.speed ? "up s" + p.speed.replace(".", "_") : ""} ${S.port === n ? "sel" : ""}" style="grid-area:${top ? 1 : 2}/${c}" data-port="${n}" aria-label="Port ${p.label}${p.peer ? ", " + p.peer : ""}">${icon(p)}</button>`;
    }).join("")}</div>`; };
    const tr = d.traffic;
    const head = `<h2>Ports <em>${TR("n_of_n_connected", up, d.ports.length)}${tr && (tr[0] || tr[1]) ? ` · ↓ ${rateK(tr[0])} ↑ ${rateK(tr[1])}` : ""}</em></h2>`;
    const upl = R.up ? `<div class="conn">${TR("connected_to")} <button data-id="${R.up.o.id}">${R.up.o.name}</button>${R.remote.length ? `<span>Port ${portRange(R.remote)}</span>` : ""}</div>`
      : d.wan && d.wan.isp ? `<div class="conn">Internet <span>${d.wan.isp}</span></div>` : "";
    const peerDev = devNamed(sel.peer), role = R.isUp(sel) ? "Uplink" : R.lag(sel.peer) ? TR("bundle") : "";
    const info = `<div class="pinfo"><span class="pn">${sel.label}</span>
        <span class="pd">${sel.peer ? peerDev ? `<button class="peer" data-id="${peerDev.id}">${sel.peer} ›</button>` : `<b>${sel.peer}</b>` : `<b>Port ${sel.label}${sel.speed ? "" : (" " + TR("bullet_n", TR("free")))}</b>`}
          <span>${sel.peer ? `Port ${sel.label} · ` : ""}${KIND_TXT[sel.kind] || sel.kind}${sel.speed ? " · " + SPEED_TXT[sel.speed] : ""}${role ? " · " + role : ""}${sel.poe ? ` · ${sel.poePP ? "PoE++" : "PoE+"} ${fmt(sel.poe, 1)} W` : ""}</span></span>
        ${sel.speed ? `<span class="tr"><span><i class="dl"></i>↓ <b>${rate(sel.rx)}</b></span><span><i class="ul"></i>↑ <b>${rate(sel.tx)}</b></span></span>` : ""}</div>`;
    const live = sel.ids?.rx && sel.speed ? `<div class="plive-wrap">${liveSvg(sel)}</div>` : "";
    // Wenige Ports (z. B. Gateway): Kacheln wie bei den Schnittstellen eines Servers
    if (d.ports.length <= 8) {
      const tiles = d.ports.map(p => `<button class="if2 ${p.speed ? "up s" + p.speed.replace(".", "_") : "down"} ${S.port === p.n ? "sel" : ""}" data-port="${p.n}" aria-label="Port ${p.label}">
        <span class="ifg">${IF_GLYPH[p.kind === "rj45" ? "rj45" : "sfp"]}</span><b>Port ${p.label}</b>
        <span class="ifs-sp">${p.speed ? p.peer || SPEED_TXT[p.speed] : TR("free")}</span>
        <span class="ifrates">${p.speed && (p.rx != null || p.tx != null) ? `<span><i></i>${rateK(p.rx)}</span><span><i class="ul"></i>${rateK(p.tx)}</span>` : `<span>${p.peer && p.speed ? SPEED_TXT[p.speed] : KIND_TXT[p.kind] || p.kind}</span>`}</span></button>`).join("");
      return `<section class="card${live ? " pgrow" : ""}">${head}${upl}<div class="ifs" style="grid-template-columns:repeat(${Math.min(4, d.ports.length)},minmax(0,1fr))">${tiles}</div>${info}${live}</section>`;
    }
    const has = f => d.ports.some(f), sw = c => `<i class="sw" style="background:var(${c})"></i>`;
    const legend = [...["100M", "1G", "2.5G", "10G", "25G"].filter(x => has(p => p.speed === x)).map(x => `<span>${sw(SPD_COL[x])}${SPD_SHORT[x]}</span>`),
      `<span>${sw("--fill-2")}${TR("not_connected")}</span>`,
      has(p => p.poeCap && !p.poePP) && `<span>${PORT_ICON.poe}PoE+</span>`, has(p => p.poeCap && p.poePP) && `<span>${PORT_ICON.poe2}PoE++</span>`,
      has(R.isUp) && `<span>${PORT_ICON.up}Uplink</span>`, has(p => !R.isUp(p) && R.lag(p.peer)) && `<span>${PORT_ICON.lag}${TR("bundle")}</span>`].filter(Boolean).join("");
    return `<section class="card${live ? " pgrow" : ""}">${head}${upl}
      <div class="ports pp">${d.portLayout.map(grp).join("")}</div>
      <div class="plegend pl3">${legend}</div>${info}${live}
    </section>`;
  }

  function wanCard(d) {
    const w = d.wan;
    const card = trendCard("Internet", [
      { label: "Download", id: w.ids.down, cur: w.down, unit: "Mbit/s", color: "--rx", dec: 1 },
      { label: "Upload", id: w.ids.up, cur: w.up, unit: "Mbit/s", color: "--tx", dec: 1 },
    ]);
    const foot = [w.avail != null && `${TR("available")} <b>${fmt(w.avail, 1)} %</b>`, w.loss != null && `${TR("loss")} <b>${fmt(w.loss, 1)} %</b>`, w.drops != null && `${TR("drops")} <b>${fmt(w.drops)}</b>`].filter(Boolean).join(" · ");
    return card.replace(/<\/section>$/, `${foot || w.isp ? `<div class="wanfoot"><span>${foot}</span></div>` : ""}</section>`);
  }
  function poeCard(d) {
    const top = d.ports.filter(p => p.poe).sort((a, b) => b.poe - a.poe), max = top[0]?.poe || 1;
    const pct = d.poe.budget ? Math.round(d.poe.used / d.poe.budget * 100) : null;
    return `<section class="card grow"><h2>PoE <em>${TR(top.length === 1 ? "n_device_powered" : "n_devices_powered", top.length)}</em></h2>
      <div class="mini" style="border-top:0;padding-top:0"><span><b style="font:700 26px var(--font-display)">${fmt(d.poe.used)} W</b>${d.poe.budget ? ` ${TR("of_n", `${d.poe.budget} W`)}` : ""}</span>${pct != null ? `<b>${pct} %</b>` : ""}</div>
      ${pct != null ? `<div class="meter"><b style="width:${pct}%;background:var(--orange)"></b></div>` : ""}
      <div class="poelist">${top.slice(0, 8).map(p => `<div><span>Port ${p.label}</span><i><b style="width:${p.poe / max * 100}%"></b></i><em>${fmt(p.poe, 1)} W</em></div>`).join("")}</div>
    </section>`;
  }

  // Ausgänge senkrecht wie an der Stromleiste: je Gruppe eine Liste mit Nummer, Belegung und Zustand
  function outletCard(d) {
    const os = d.outlets, unk = d.outletsUnknown, on = os.filter(x => x.on).length;
    const groups = []; for (let i = 0; i < os.length; i += 8) groups.push(os.slice(i, i + 8));
    const named = os.filter(x => x.name).length;
    // Noch nichts benannt: kompakte Leiste wie am Gerät statt 24 Zeilen „frei“
    if (!named) return `<section class="card"><h2>${TR("outlets")} <em>${TR("n_outlets", os.length)}${unk ? "" : ` · ${TR("n_on", on)}`}</em></h2>
      <div class="ostrip">${groups.map(g => `<div class="og"><span class="ogl">${g[0].n}–${g.at(-1).n}</span>${g.map(x => `<span class="sock ${x.kind} ${x.on && !unk ? "on" : ""}">${x.n}</span>`).join("")}</div>`).join("")}</div>
      <p class="note" style="margin:8px 0 0;font-size:12px">${TR("which_device_is_plugged_into_which_outlet_can", d.name)}</p></section>`;
    return `<section class="card ocard"><h2>${TR("outlets")} <em>${unk ? TR("n_of_n_used", named, os.length) : TR("n_of_n_on", on, os.length)}</em></h2>
      <div class="ovlist">${groups.map(g => `<div class="obank"><span class="obh">${g[0].n}–${g.at(-1).n}</span>${g.map(x => `
        <div class="orow"><span class="onum ${x.on && !unk ? "on" : ""}">${x.n}</span><span class="onm ${x.name ? "" : "empty"}">${x.name || TR("free")}</span><i class="okind">${x.kind}</i>${unk ? "" : `<i class="ost ${x.on ? "on" : ""}">${x.on ? "an" : "aus"}</i>`}</div>`).join("")}</div>`).join("")}</div>
      ${unk ? `<span class="note onote">${TR("the_pdu_currently_does_not_report_the_switching")}</span>` : ""}
    </section>`;
  }

  /* ---------- Detailansicht aus Blöcken ---------- */
  // Modulrahmen: Steckplätze mit eingebauten (gefüllt) oder geplanten (gestrichelt) Modulen
  // Fachboden-Front: Rückwand, Wangen, Boden mit Kante; Kleingeräte nebeneinander (Breite in % der Rackbreite)
  const SHELF_KIND = { ck: { w: 27, h: 36 }, mini: { w: 16, h: 42 }, nas: { w: 20, h: 70 }, box: { w: 30, h: 52 }, ap: { w: 18, h: 16 } };
  function shelfInner(d) {
    const items = d.shelfItems || [], tot = items.reduce((s, it) => s + (SHELF_KIND[it.kind] || SHELF_KIND.box).w, 0) + Math.max(0, items.length - 1) * 4;
    let x = Math.max(6, (100 - tot) / 2);
    return `<i class="sh-back"></i><i class="sh-wall l"></i><i class="sh-wall r"></i>${items.map(it => { const k = SHELF_KIND[it.kind] || SHELF_KIND.box, el = `<i class="sh-it ${it.kind || "box"}" style="left:${x}%;width:${k.w}%;height:${k.h}%">${it.self || it.kind === "ck" ? `<b class="sh-led ${it.self ? d.state : "ok"}"></b>` : ""}</i>`; x += k.w + 4; return el; }).join("")}<i class="plate"></i>`;
  }
  // Modulrahmen: Steckplätze, Module können mehrere Plätze breit sein (m.w); Fronten je Art (m.kind) als Zeichnung
  const SLOT_FACE = {
    temp: { w: 56, c: "#d0621f", draw: (m, v, on) => `<text x="8" y="24" class="t1">RACK</text><text x="8" y="33" class="t1" style="fill:#d0621f">TEMP</text>
      <rect x="41.5" y="13" width="5" height="17" rx="2.5" fill="none" stroke="#c9c5ba" stroke-width="1.4"/><circle cx="44" cy="32" r="4.2" fill="none" stroke="#c9c5ba" stroke-width="1.4"/><circle cx="44" cy="32" r="2.5" fill="#d0621f"/><rect x="43.3" y="19" width="1.4" height="11" fill="#d0621f"/>
      <path d="M49 16h3M49 20h3M49 24h3" stroke="#c9c5ba" stroke-width="1.2"/>
      <rect x="11" y="39" width="34" height="1.3" fill="#d0621f"/><rect x="12" y="41.5" width="32" height="10" fill="#2a2926"/><rect x="11" y="53.3" width="34" height="1.3" fill="#d0621f"/>
      ${v ? `<text x="28" y="49.4" class="lcd" style="fill:${on}">${v}</text>` : ""}
      <rect x="11" y="59" width="1.3" height="19" fill="#d0621f"/><rect x="43.7" y="59" width="1.3" height="19" fill="#d0621f"/>${SLOT_RJ(19, 61)}<text x="28" y="85" class="t2">LAN / PoE</text>` },
    ntp: { w: 56, c: "#1f4f8f", draw: (m, v, on) => `<text x="28" y="23" class="t0">NTP</text><text x="28" y="28.5" class="t2">TIME SERVER</text>
      <rect x="11" y="31.5" width="34" height="1.3" fill="#1f4f8f"/><rect x="12" y="34" width="32" height="8.5" fill="#2a2926"/><rect x="11" y="44" width="34" height="1.3" fill="#1f4f8f"/>
      <text x="28" y="40.6" class="lcd" style="fill:#9fe7ff">${new Date().toLocaleTimeString(rdLoc(), { hour: "2-digit", minute: "2-digit" })}</text>
      <text x="17" y="51" class="t3">DISPLAY</text><text x="37.5" y="51" class="t3">PWR PPS</text>
      <circle cx="17" cy="56.5" r="4.2" fill="#1f4f8f"/><circle cx="33" cy="56.5" r="2.4" fill="#1a1a1a" stroke="#c9c5ba" stroke-width=".9"/><circle cx="33" cy="56.5" r="1.4" fill="${on}"/>
      <circle cx="42" cy="56.5" r="2.4" fill="#1a1a1a" stroke="#c9c5ba" stroke-width=".9"/><circle cx="42" cy="56.5" r="1.4" fill="${on}" class="${on === SLOT_OK ? "pps" : ""}"/>
      <circle cx="17" cy="70" r="5" fill="#55534f" stroke="#1d1d1d" stroke-width="1.4"/>${SLOT_RJ(29, 63)}
      <text x="17" y="82" class="t2">GNSS</text><text x="38" y="82" class="t2">LAN / PoE</text><text x="28" y="88" class="t3">GNSS DISCIPLINED</text>` },
    cloudkey: { w: 168, c: null, plate: "#2e2e2e", draw: (m, v, on, k) => { const f = k?.blocks ? factsOf(k) : [], num = re => f.find(x => re.test(x[0]))?.[1]?.split(" ")[0];
      const cl = num(/client/i) ?? "–", dv = (+num(/ap/i) || 0) + (+num(/switch/i) || 0) || "–", up = on === SLOT_OK;
      return `<rect x="22" y="27" width="124" height="28" rx="5" fill="#0d0e10"/>
      <rect x="26" y="29.5" width="116" height="23" rx="4.5" fill="url(#ckb)"/><rect x="28" y="31.2" width="112" height="19.6" rx="3.4" fill="#0a0a0b"/>
      <rect x="99" y="33" width="38" height="12.6" rx="1" fill="#141416"/>
      <text x="101" y="36.4" style="font-size:2.6px;text-anchor:start;fill:#6e6e73">UniFi Network</text>
      <circle cx="102.4" cy="39.6" r="1.5" fill="none" stroke="#e6e6e8" stroke-width=".35"/><path d="M100.9 39.6h3M102.4 38.1v3" stroke="#e6e6e8" stroke-width=".3"/>
      <text x="104.6" y="40.6" style="font-size:3px;text-anchor:start;fill:${up ? "#f2f2f4" : "#ff9f0a"}">${up ? "Online" : "Offline"}</text>
      <circle cx="133.6" cy="38.2" r="2.3" fill="#f2f2f4"/><circle cx="133.6" cy="38.2" r="1.2" fill="none" stroke="#141416" stroke-width=".35"/>
      <path d="M99 42.4h38M106 42.4v3.2" stroke="#2c2c2e" stroke-width=".3"/>
      <path d="M101.2 44.6a1 1 0 0 1 .4-1.9a1.4 1.4 0 0 1 2.6.3a.8.8 0 0 1 .1 1.6z" fill="none" stroke="#e6e6e8" stroke-width=".3"/>
      <circle cx="117" cy="44" r="1.1" fill="none" stroke="#6e6e73" stroke-width=".3"/><text x="118.8" y="45.1" style="font-size:3px;text-anchor:start;fill:#f2f2f4">${cl}</text>
      <rect x="127" y="42.9" width="2" height="2.1" rx=".3" fill="none" stroke="#6e6e73" stroke-width=".3"/><text x="130.3" y="45.1" style="font-size:3px;text-anchor:start;fill:#f2f2f4">${dv}</text>
      <text x="118" y="49.2" style="font-size:2.7px;font-weight:600;fill:#5a5a5e">Cloud Key Plus</text>
      <text x="108" y="75" class="t2" style="font-size:5.5px">LAN/PoE</text><rect x="118" y="68" width="11" height="10" fill="#0c0d0f" stroke="#555" stroke-width=".6"/><rect x="120.5" y="70" width="6" height="3" fill="#1d1e20"/>`; } },
  };
  const SLOT_OK = "#34c759";
  const SLOT_RJ = (x, y) => `<rect x="${x}" y="${y}" width="18" height="14" fill="#5a5853"/><rect x="${x + 2}" y="${y + 2}" width="14" height="10" fill="#161616"/><rect x="${x + 6}" y="${y + 2}" width="6" height="2.5" fill="#5a5853"/><path d="M${x + 4.5} ${y + 9}h9" stroke="#8c8a84" stroke-width="1.6" stroke-dasharray=".7 .7"/>`;
  function slotFace(m, d) {
    const f = SLOT_FACE[m.kind]; if (!f) return '<i class="oled"></i><i class="rj"></i>';
    const s = m.entity && st(m.entity), v = s && m.kind === "temp" ? (() => { const x = valueOf(m.entity); return x.v + (x.u === "°C" ? "°" : ""); })() : "";
    const lp = m.entity ? (s ? lamp(m.entity) : "warn") : d.state === "alert" ? "alert" : d.state === "warn" ? "warn" : "ok";
    const on = lp === "alert" ? "#ff3b30" : lp === "warn" ? "#ffcc00" : lp === "off" ? "#3a3a3a" : SLOT_OK;
    const W = f.w, holes = W > 60 ? [[14, 10], [W - 14, 10], [14, 90], [W - 14, 90]] : [[W / 2, 9], [W / 2, 91]];
    return `<svg class="sface" viewBox="0 0 ${W} 100" preserveAspectRatio="none"><defs><linearGradient id="ckb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfbfc"/><stop offset="1" stop-color="#dcdee2"/></linearGradient></defs>
      <rect width="${W}" height="100" rx="2" fill="${f.plate || "#0b0b0c"}"/>${f.c ? `<rect x="3" y="3" width="${W - 6}" height="94" rx="3" fill="none" stroke="${f.c}" stroke-width="1.6"/>` : ""}
      ${holes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#8d9096"/><circle cx="${x}" cy="${y}" r="1.6" fill="#4a4c50"/>`).join("")}${f.draw(m, v, on, d)}</svg>`;
  }
  // Steckplätze mit Belegung: [{n, m, w}] – ein breites Modul belegt die folgenden Plätze mit
  function slotRuns(d) {
    const n = d.slots || 10, mods = d.modules || [], out = [];
    for (let i = 1; i <= n;) { const m = mods.find(x => x.slot === i), w = m ? Math.max(1, Math.min(+m.w || 1, n - i + 1)) : 1; out.push({ n: i, m, w }); i += w; }
    return out;
  }
  const kidOf = (f, m) => m?.device ? (f.kids || []).find(k => k.id === m.device) : null;
  // Kopfbild eines Moduls: der ganze Rahmen, das Modul hervorgehoben
  function slotThumb(d) {
    const f = DEVICES.find(x => x.id === d.parent); if (!f || !d.mod) return "";
    f._hl = d.mod.slot; const html = face(f); f._hl = null; const ar = 9.9 / (f.h || 2);
    return `<div class="thumb" style="aspect-ratio:${ar};--ar:${ar}">${html}</div>`;
  }
  // Kennzahlen eines Geräts aus seinem Kopf-Modul (für Übersichten)
  function factsOf(k) {
    const hb = k.blocks?.find(b => b.type === "header"); if (!hb?.items?.length || k.off) return k.facts || [];
    return hb.items.slice(0, 4).map(ref => [ref, entOf(ref, k.R)]).filter(x => x[1] && st(x[1])).map(([ref, id]) => { const v = valueOf(id); return [nameOf(hb, ref, id), `${v.v}${v.u ? " " + v.u : ""}`]; });
  }
  function frameInner(d) {
    const n = d.slots || 10;
    return `<i class="in"><span class="slots ${d._hl ? "hl" : ""}" style="--n:${n}">${slotRuns(d).map(({ m, w }) =>
      `<span class="slot ${m ? (m.status === "planned" ? "planned" : "mod " + (m.kind || "")) : ""} ${m && d._hl === m.slot ? "on" : ""}" style="${w > 1 ? `grid-column:span ${w}` : ""}">${m && m.status !== "planned" ? slotFace(m, kidOf(d, m) || d) : ""}</span>`).join("")}</span></i>`;
  }
  function slotsCard(d) {
    const n = d.slots || 10, mods = d.modules || [], runs = [];
    // aufeinanderfolgende freie Plätze zu einer Zeile zusammenfassen
    slotRuns(d).forEach(x => { const p = runs[runs.length - 1]; if (!x.m && p && !p.m) p.w += x.w; else runs.push({ ...x }); });
    const used = runs.filter(x => x.m && x.m.status !== "planned").reduce((a, x) => a + x.w, 0), plan = mods.filter(m => m.status === "planned").length;
    const tile = ({ n: i, m, w }) => {
      const pos = w > 1 ? `${i}–${i + w - 1}` : `${i}`;
      if (!m) return `<div class="slt free"><span class="sn">${pos}</span><b>${TR("free")}</b></div>`;
      const k = kidOf(d, m), s = m.entity && st(m.entity), trk = s && m.entity.startsWith("device_tracker.");
      const state = k ? (k.passive ? "off" : k.state) : s ? ({ alert: "alert", warn: "warn", off: "off" }[lamp(m.entity)] || "ok") : m.status === "planned" ? "off" : "";
      const txt = k ? STATE_TXT()[state] : trk ? (s.state === "home" ? "Online" : "Offline") : m.status === "planned" ? TR("planned") : s ? "" : "";
      const facts = k ? factsOf(k).slice(0, 3) : s && !trk ? [[TR("value"), (v => `${v.v}${v.u ? " " + v.u : ""}`)(valueOf(m.entity))]] : trk && s.attributes.ip ? [["IP", s.attributes.ip]] : [];
      const tag = k ? "button" : "div";
      return `<${tag} class="slt ${m.status === "planned" ? "planned" : ""} ${k ? "link" : ""}" ${k ? `data-id="${k.id}"` : ""} style="--w:${w}">
        <span class="slf">${m.status !== "planned" ? `<span class="slot mod ${m.kind || ""}">${slotFace(m, k || d)}</span>` : ""}</span>
        <span class="slm"><span class="slh"><b>${m.name}</b>${txt ? `<span class="chip ${state}"><i></i>${txt}</span>` : ""}</span>
          <em>${TR("slot")} ${pos}${m.desc ? ` ${TR("bullet_n", m.desc)}` : ""}</em>
          ${facts.length ? `<span class="slx">${facts.map(([a, b]) => `<span><small>${a}</small><b>${b}</b></span>`).join("")}</span>` : ""}</span>${k ? '<i class="chev">›</i>' : ""}</${tag}>`; };
    return `<section class="card slotc"><h2>${TR("slots")} <em>${TR("n_of_n_used", used, n)}${plan ? ` · ${plan} ${TR("planned")}` : ""}</em></h2>
      <div class="sltl">${runs.map(tile).join("")}</div></section>`;
  }
  // Einschalten (z. B. IPMI): erst beim zweiten Tippen innerhalb von 4 s
  function powerOnBtn(d) {
    const id = d.options.power_on, arm = ARMED?.id === id && Date.now() - ARMED.t < 4000;
    return `<button class="pwrchip ${arm ? "armed" : ""}" data-press="${id}" data-confirm="${TR("tap_again")}">${arm ? TR("tap_again") : TR("power_on")}</button>`;
  }
  // Module, die bei ausgeschaltetem Gerät als graues Gerüst (ohne Werte) stehen bleiben; alle anderen werden zum Platzhalter
  const OFF_SKELETON = ["bays", "array"];
  // Entitäten eines Moduls (für „läuft auch bei ausgeschaltetem Gerät“)
  const blockEnts = (d, b) => [...(b.items || []), b.source].filter(Boolean).map(ref => entOf(ref, d.R)).filter(Boolean);
  function headCard(d) {
    const hb = d.blocks.find(b => b.type === "header");
    if (hb?.items?.length && !d.off) d.facts = hb.items.slice(0, 4).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1]).map(([ref, id]) => { const v = valueOf(id); return [nameOf(hb, ref, id), `${v.v}${v.u ? " " + v.u : ""}`]; });
    const mm = members(d.id), lo = Math.min(...mm.map(x => x.u)), hi = Math.max(...mm.map(x => x.u + x.h - 1));
    const where = d.parent ? `${d.frameName || TR("module_frame")} · ${d.mod?.w > 1 ? TR("slots_nn", d.mod.slot, d.mod.slot + d.mod.w - 1) : TR("slot_n", d.mod?.slot ?? "–")}` : d.u ? `${d.type === "shelf" ? TR("on_shelf") + " " : ""}${TR("u_n", `${lo}${hi > lo ? "–" + hi : ""}`)}` : `${TR("rear")}, ${TR("n_u", 0)}`;
    return `<section class="card"><div class="dhero">
      <div class="top"><div style="min-width:0"><h1 data-ed-name style="font:700 24px/1.1 var(--font-display);margin:0 0 4px">${d.name}</h1><div class="sub" style="color:var(--label-2);font-size:13px">${d.model} · ${where}</div></div>
        ${d.off && d.options?.power_on && st(d.options.power_on) ? powerOnBtn(d) : `<span class="chip ${d.passive ? "off" : d.state}"><i></i>${d.off ? TR("off") : STATE_TXT()[d.passive ? "off" : d.state]}</span>`}</div>
      ${headThumb(d)}
      ${d.facts ? `<div class="facts4">${d.facts.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>` : ""}
      ${warnMsgsOf(d).slice(0, 2).map(m => `<div class="hmsg ${m[0]}"><i></i><b>${m[1]}</b><span>${m[2] || ""}</span></div>`).join("")}
    </div></section>`;
  }
  function tilesCard(d) {
    return `<section class="card"><h2>${TR("current")}</h2><div class="grid t3">${d.tiles.slice(0, 6).map(([k, v, unit, meter, stt, hint]) => `
      <div class="tile ${stt || ""}"><span class="k">${k}</span><span class="v">${v}<small>${unit}</small></span>
      ${meter != null ? `<div class="meter"><b style="width:${meter}%;${meter > 85 && !hint ? "background:var(--orange)" : ""}"></b></div>` : ""}
      ${hint ? `<span class="h">${hint}</span>` : ""}</div>`).join("")}</div></section>`;
  }
  // Durchsatz-Sensor in Mbit/s umrechnen (System Monitor liefert z. B. kB/s oder MB/s)
  function mbit(id) {
    const s = st(id), x = num(id); if (x == null) return null;
    const f = { "bit/s": 1e-6, "kbit/s": 1e-3, "Mbit/s": 1, "Gbit/s": 1e3, "B/s": 8e-6, "kB/s": 8e-3, "KiB/s": 8.192e-3, "MB/s": 8, "MiB/s": 8.389, "GB/s": 8e3 }[s.attributes.unit_of_measurement];
    return f == null ? x : x * f;
  }
  // Kurzform für enge Kacheln: 224 k / 7,2 M / 1,2 G (bit/s)
  const rateK = x => x == null ? "–" : x >= 1000 ? `${fmt(x / 1000, 1)} G` : x >= 1 ? `${fmt(x, x < 10 ? 1 : 0)} M` : `${fmt(x * 1000)} k`;
  // Schnittstellen eines Servers: Link-Status und Geschwindigkeit (Attribute eines Sensors) + Live-Durchsatz je Port.
  // Ports eines Bündels (z. B. LACP) stehen gemeinsam unter einer Klammer.
  const IF_GLYPH = {
    sfp: '<svg viewBox="0 0 40 28" aria-hidden="true"><rect x="2" y="3" width="36" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="8" y="9" width="24" height="10" rx="1.5" fill="currentColor" opacity=".35"/><path d="M8 14h24" stroke="currentColor" stroke-width="2"/></svg>',
    rj45: '<svg viewBox="0 0 40 28" aria-hidden="true"><path d="M6 4h28v16h-7v4H13v-4H6z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M12 9v4M16 9v4M20 9v4M24 9v4M28 9v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".55"/></svg>',
  };
  function ifacesCard(d, b) {
    const src = st(b.source)?.attributes, ports = b.ifaces || [];
    if (!ports.length || !src) return "";                       // ohne Link-Daten lieber nichts als falschen Zustand
    const spd = m => m >= 25000 ? "25G" : m >= 10000 ? "10G" : m >= 2500 ? "2.5G" : m >= 1000 ? "1G" : m > 0 ? "100M" : null;
    const spdTxt = s => ({ "25G": "25 Gbit/s", "10G": "10 Gbit/s", "2.5G": "2,5 Gbit/s", "1G": "1 Gbit/s", "100M": "100 Mbit/s" })[s] || TR("connected");
    const tile = p => {
      const a = src[p.key] || {}, up = a.state === "up", sp = up ? spd(a.speed) : null, rx = up ? mbit(p.rx) : null, tx = up ? mbit(p.tx) : null;
      return `<div class="if2 ${up ? "up" : "down"} ${sp ? "s" + sp.replace(".", "_") : ""}">
        <span class="ifg">${IF_GLYPH[p.kind] || IF_GLYPH.rj45}</span>
        <b>${p.name}</b><span class="ifs-sp">${up ? spdTxt(sp) : a.state === "missing" ? "fehlt" : TR("free")}</span>
        <span class="ifrates">${up ? `<span><i></i>${rateK(rx)}</span><span><i class="ul"></i>${rateK(tx)}</span>` : "&nbsp;"}</span></div>`;
    };
    const bondKeys = new Set(b.bond?.members || ports.filter(p => p.kind === "sfp").map(p => p.key));
    const bd = b.bond && src[b.bond.key], inBond = ports.filter(p => bd && bondKeys.has(p.key)), rest = ports.filter(p => !inBond.includes(p));
    const bond = inBond.length ? `<div class="ifgrp ${bd.state === "up" ? "up" : ""}" style="grid-column:span ${inBond.length}">
        <div class="ifbr"><span>${b.bond.name || TR("bundle")}${bd.state === "up" ? ` · ${fmt(bd.speed / 1000)}G` : " · " + TR("disconnected_lower")}</span>${bd.state === "up" ? `<em>↓ ${rateK(mbit(b.bond.rx))} · ↑ ${rateK(mbit(b.bond.tx))}</em>` : ""}</div>
        <div class="ifrow" style="grid-template-columns:repeat(${inBond.length},minmax(0,1fr))">${inBond.map(tile).join("")}</div></div>` : "";
    const upN = ports.filter(p => src[p.key]?.state === "up").length;
    return `<section class="card"><h2>${b.label || TR("interfaces")} <em>${TR("n_of_n_connected", upN, ports.length)}</em></h2>
      <div class="ifs" style="grid-template-columns:repeat(${ports.length},minmax(0,1fr))">${bond}${rest.map(tile).join("")}</div></section>`;
  }
  // Ringe: Auslastung auf einen Blick (Prozent, sonst Bereich min–max)
  // Auslastung im selben Kachel-Stil wie System (Wert, Pegel, 24-Std.-Kurve)
  function ringsCard(d, b) {
    const COL = ["--blue", "--indigo", "--teal", "--green", "--orange"];
    const items = b.items.map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && st(x[1]));
    items.forEach(([, id]) => HIST.want.add(id));
    return trendCard(b.label || TR("load"), items.map(([ref, id], i) => ({ label: nameOf(b, ref, id), id, cur: num(id), unit: st(id).attributes.unit_of_measurement || "%", color: b.colors?.[i] || COL[i % COL.length], dec: 0 })));
  }
  // Laufwerksschächte (z. B. Unraid): je Platte Gesundheits- und/oder Belegungssensor, Attribute liefern Typ, Größe, Temperatur, Ruhezustand
  const sizeTB = s => { const m = String(s ?? "").match(/([\d.,]+)\s*([KMGTP]?)i?B/i); if (!m) return null; const x = parseFloat(m[1].replace(",", ".")); return x * ({ "": 1e-12, K: 1e-9, M: 1e-6, G: 1e-3, T: 1, P: 1e3 }[m[2].toUpperCase()] ?? 0); };
  const tbTxt = x => x >= 1 ? `${fmt(x, x >= 10 || Math.abs(x - Math.round(x)) < .05 ? 0 : 1)} TB` : `${fmt(x * 1000)} GB`;
  const DISK_ST = rdPerLang(() => ({ DISK_OK: "OK", DISK_NEW: TR("new_unassigned"), DISK_NP: TR("missing"), DISK_NP_DSBL: TR("missing"), DISK_DSBL: TR("disabled"), DISK_DSBL_NEW: TR("disabled"), DISK_INVALID: TR("invalid"), DISK_WRONG: TR("wrong_disk"), DISK_EMULATED: TR("emulated") }));
  function bayDisks(d, b) {
    const ROLE = { PARITY: "parity", DATA: "data", CACHE: "cache", FLASH: "flash" };
    const seen = new Set();
    return (b.items || []).map(ref => entOf(ref, d.R)).filter(Boolean).map(id => {
      const key = (id.match(/_disk_([a-z0-9]+)_(?:health|usage)$/) || [])[1] || id;
      if (seen.has(key)) return null; seen.add(key);
      const h = id.startsWith("binary_sensor.") ? id : id.replace(/^sensor\.(.*)_usage$/, "binary_sensor.$1_health");
      const u = id.startsWith("sensor.") ? id : id.replace(/^binary_sensor\.(.*)_health$/, "sensor.$1_usage");
      const hs = st(h), us = st(u); if (!hs && !us) return null;
      const A = { ...(hs?.attributes || {}), ...(us?.attributes || {}) };
      const role = ROLE[String(A.type || "").toUpperCase()] || (/parity/.test(key) ? "parity" : /cache/.test(key) ? "cache" : /flash/.test(key) ? "flash" : "data");
      const nr = (key.match(/\d+$/) || [""])[0];
      const short = role === "parity" ? "P" + (nr || "") : role === "cache" ? "C" + (nr || "1") : nr || key.slice(0, 3);
      const name = b.names?.[id] || b.names?.[h] || b.names?.[u] || (role === "parity" ? TR("parity") + (nr ? " " + nr : "") : role === "cache" ? "Cache" + (nr ? " " + nr : "") : TR("disk") + " " + (nr || key));
      const spun = A.spin_state ? A.spin_state === "active" : A.standby != null ? !A.standby : A.spinning !== false;
      const used = num(u), tb = sizeTB(A.total);
      return { id: hs ? h : u, key, dev: A.device || null, serial: A.serial || A.serial_number || null, role, short, name, tb: tb > 0 ? tb : null, temp: A.temperature_celsius ?? A.temperature ?? null, used: used != null ? Math.round(used) : null, spun,
        bad: hs?.state === "on" || (A.num_errors > 0), status: A.status ? (DISK_ST()[A.status] || A.status) : hs ? (hs.state === "on" ? "Problem" : "OK") : null, errors: A.num_errors || 0 };
    }).filter(x => x && x.role !== "flash");
  }
  function baysCard(d, b) {
    const disks = bayDisks(d, b); if (!disks.length) return "";
    if (d.off) disks.forEach(x => { x.temp = null; x.bad = false; x.used = null; x.spun = true; x.status = null; x.errors = 0; });   // aus: nur das Gerüst
    // Front-Schächte: Parität und Daten; Cache-SSDs sitzen intern (zusätzlich zu den Schächten), außer b.cache_in_bays
    const inBay = x => x.role !== "cache" || b.cache_in_bays, ord = { parity: 0, data: 1, cache: 2 };
    const list = disks.filter(inBay).sort((x, y) => ord[x.role] - ord[y.role]), internal = disks.filter(x => !inBay(x));
    // Zuordnung: im Editor je Platte eine Schacht-Nummer (bay_map), sonst der Reihe nach
    const M = b.bay_map || {}, slotOf = x => +(M[x.key] ?? NaN);
    // Stehend: alle Schächte in einer Reihe (wie die Front eines Storage-Gehäuses), Anzahl = „Schächte vorne“
    const vert = b.style === "vertical", slots = Math.max(list.length, b.slots || (vert ? 12 : 24)), cols = vert ? slots : b.cols || 4;
    // Zuordnung: Platten mit fester Schacht-Nummer zuerst, die übrigen in die freien Schächte der Reihe nach
    const at = Array(slots).fill(null);
    list.forEach(x => { const n = slotOf(x); if (n >= 1 && n <= slots && !at[n - 1]) at[n - 1] = x; });
    list.filter(x => !at.includes(x)).forEach(x => { const k = at.indexOf(null); if (k >= 0) at[k] = x; });
    const bays = at.map((x, i) => x ? { ...x, n: i + 1 } : { n: i + 1, role: "empty" });
    internal.forEach((x, i) => { x.n = null; x.slot = TR("internal_n", i + 1); });
    const all = [...bays, ...internal];
    const sel = (S.bay && all.find(x => x.key === S.bay)) || all.find(x => x.bad) || all.find(x => x.role !== "empty");
    // Temperatur: HDD ab 45/55 °C, SSD ab 55/65 °C gelb/rot (warn/alert im Modul überschreibbar)
    const tcol = x => { if (x.temp == null || !x.spun) return ""; const ssd = x.role === "cache", w = b.warn ?? (ssd ? 55 : 45), al = b.alert ?? (ssd ? 65 : 55);
      return x.temp >= al ? "t-alert" : x.temp >= w ? "t-warn" : ""; };
    // Stehend: Einschübe senkrecht wie in einem Storage-Gehäuse (Griff in Rollenfarbe, LEDs, Füllstand = Belegung)
    const vtile = x => `<button class="bv ${x.role} ${x.spun ? "" : "down"} ${x.bad ? "bad" : ""} ${sel === x && !d.off ? "sel" : ""}" data-bay="${x.key}" aria-label="${x.name}"><i class="bv-h"></i><i class="bv-led ${x.bad ? "alert" : x.spun ? "ok" : "off"}"></i>${x.used != null ? `<b style="height:${x.used}%"></b>` : ""}<em class="${tcol(x)}">${x.spun ? (x.temp != null ? fmt(x.temp) + "°" : "") : "zz"}</em><span>${x.short}</span></button>`;
    const tile = x => vert ? vtile(x) : `<button class="bay24 ${x.role} ${x.spun ? "" : "down"} ${x.bad ? "bad" : ""} ${sel === x && !d.off ? "sel" : ""}" data-bay="${x.key}" aria-label="${x.name}"><i></i><span>${x.short}</span><em class="${tcol(x)}">${x.spun ? (x.temp != null ? fmt(x.temp) + "°" : "") : "zz"}</em>${x.used != null ? `<b style="width:${x.used}%"></b>` : ""}</button>`;
    const roleTxt = { parity: TR("parity"), data: TR("data"), cache: "Cache" };
    const bad = disks.filter(x => x.bad).length, hot = disks.filter(x => tcol(x)).length;
    const temps = disks.filter(x => x.spun && x.temp != null).map(x => x.temp), tmax = temps.length ? Math.max(...temps) : null;
    return `<section class="card bayc"><h2>${b.label || TR("bays")} <em>${bad ? `<b class="hv" style="color:var(--red)">${TR("n_with_problems", bad)}</b> · ` : ""}${hot ? `<b class="hv" style="color:var(--warn-ink)">${TR("n_warm", hot)}</b> · ` : ""}${TR("n_of_n_used", list.length, slots)}${tmax != null ? ` · max. ${fmt(tmax)} °C` : ""}</em></h2>
      <div class="${vert ? `baysv ${slots > 14 ? "dense" : ""}` : "bays24"} ${b.order === "cols" && !vert ? "bycol" : ""}" style="--bc:${cols};--br:${Math.ceil(slots / cols)}">${bays.map(x => x.role === "empty" ? (vert ? `<div class="bv empty"><i class="bv-h"></i><span>${x.n}</span></div>` : `<div class="bay24"><span>${x.n}</span></div>`) : tile(x)).join("")}</div>
      ${internal.length ? `<div class="bayint"><span class="lbl">${TR("internal")}</span><div class="${vert ? "baysv int" : "bays24"}" style="--bc:${vert ? Math.max(internal.length, Math.min(slots, 12)) : cols}">${internal.map(tile).join("")}</div></div>` : ""}
      <div class="plegend blg"><span><i style="background:var(--indigo)"></i>${TR("parity")}</span><span><i style="background:var(--blue)"></i>${TR("data")}</span><span><i style="background:var(--teal)"></i>Cache</span><span><i style="background:var(--fill-2)"></i>${TR("empty")}</span><span class="hint-sleep">${TR("faded_spun_down")}</span></div>
      ${d.off ? "" : `<div class="pinfo"><span class="pn" ${sel.bad ? `style="color:var(--red)"` : ""}>${sel.short}</span><span class="pd"><b>${sel.name}${sel.tb ? " · " + tbTxt(sel.tb) : ""}</b><span>${sel.n ? TR("bay_n", sel.n) : sel.slot} · ${roleTxt[sel.role]}${sel.used != null ? ` · ${sel.used} % ${TR("used")}` : ""}${sel.status ? ` · <em style="font-style:normal;${sel.bad ? "color:var(--red)" : ""}">${sel.status}</em>` : ""}${sel.errors ? ` · ${TR("n_errors", sel.errors)}` : ""}</span></span>
        <span class="tr ${tcol(sel)}">${sel.spun ? (sel.temp != null ? `<b>${fmt(sel.temp)} °C</b>` : "") : TR("spun_down")}</span></div>`}
    </section>`;
  }
  // Array (z. B. Unraid): Belegung aus dem Belegungssensor (Attribute total/used/free), Zustand, Cache-Pools, Parität
  function arrayCard(d, b) {
    const ids = (b.items || []).map(ref => entOf(ref, d.R)).filter(id => id && st(id)); if (!ids.length) return "";
    if (d.off) return `<section class="card grow arrc"><h2>${b.label || "Array"}</h2><div class="arr2"><div class="arroff off"><b>${TR("server_off")}</b><span>${TR("usage_cache_and_parity_appear_after_power_on")}</span></div>
      ${ids.filter(id => /_disk_cache\d*_usage$/.test(id)).map(id => { const nr = (id.match(/cache(\d*)_usage$/) || [])[1]; return `<div class="crow"><span>${b.names?.[id] || "Cache" + (nr ? " " + nr : "")}</span><div class="meter"><b style="width:0"></b></div><b>–</b></div>`; }).join("")}</div></section>`;
    const find = re => ids.find(id => re.test(id));
    const uid = find(/_array_usage$/) || ids.find(id => st(id).attributes.unit_of_measurement === "%" && st(id).attributes.total != null);
    const sid = find(/_array_state$/), pid = find(/_parity_status$/) || find(/_parity_valid$/), cids = ids.filter(id => /_disk_cache\d*_usage$/.test(id));
    const U = uid ? st(uid).attributes : {}, tot = sizeTB(U.total), usedTB = sizeTB(U.used), freeTB = sizeTB(U.free), pct = num(uid);
    const state = sid && st(sid).state, running = !state || state === "started" || state === "STARTED";
    const stTxt = sid ? valueOf(sid).v : "";
    const P = pid ? st(pid) : null, pst = P?.attributes?.status;
    const PST = { completed: TR("completed"), cancelled: TR("cancelled"), running: TR("running_2"), paused: TR("paused_2"), failed: TR("failed"), never_run: TR("never_run") };
    const parTxt = P ? [P.state === "on" ? "Problem" : "", pst ? PST[pst] || pst : P.state === "on" ? "" : "OK", P.attributes?.errors ? TR("n_errors", P.attributes.errors) : ""].filter(Boolean).join(" · ") : "";
    return `<section class="card grow arrc"><h2>${b.label || "Array"} <em ${running ? "" : `style="color:var(--warn-ink)"`}>${stTxt || ""}</em></h2>
      <div class="arr2">
        ${running && tot ? `<div><div class="big2">${tbTxt(usedTB || 0)}<small>${TR("of_n", tbTxt(tot))}</small></div>
          <div class="capb"><b style="width:${Math.round(pct ?? 0)}%"></b></div>
          <div class="mini" style="border-top:0;padding-top:0"><span>${TR("n_used", fmt(pct ?? 0))}</span><span>${TR("free")} <b>${tbTxt(freeTB || 0)}</b></span></div></div>`
        : `<div class="arroff"><b>${running ? TR("no_usage") : TR("array_stopped")}</b><span>${running ? TR("the_sensor_does_not_report_sizes_yet") : `${stTxt}. ${TR("disks_and_shares_after_start")}`}</span></div>`}
        ${cids.map(id => { const A = st(id).attributes, t = sizeTB(A.total), v = num(id); const nr = (id.match(/cache(\d*)_usage$/) || [])[1];
          return `<div class="crow"><span>${b.names?.[id] || "Cache" + (nr ? " " + nr : "")}${t > 0 ? ` <small>${tbTxt(t)}</small>` : ""}</span><div class="meter"><b style="width:${v ?? 0}%;background:var(--teal)"></b></div><b>${v != null ? fmt(v) + " %" : "–"}</b></div>`; }).join("")}
        ${P ? `<div class="mini"><span>${TR("parity_check")}</span><b ${P.state === "on" ? `style="color:var(--red)"` : ""}>${parTxt}</b></div>` : ""}
      </div>
    </section>`;
  }
  // Hardware (z. B. IPMI): Temperaturen als Kacheln mit Balken, Lüfter als drehende Symbole (Tempo = Drehzahl)
  function hwCard(d, b) {
    const ids = (b.items || []).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && st(x[1]));
    const temps = ids.filter(([, id]) => st(id).attributes.unit_of_measurement === "°C" && ok(st(id)) && !(d.off && num(id) === 0)), fans = ids.filter(([, id]) => st(id).attributes.unit_of_measurement === "rpm" && ok(st(id)));
    if (!temps.length && !fans.length) return "";
    const warn = b.warn ?? 60, alert = b.alert ?? 75, lo = b.min ?? 20, hi = b.max ?? 90;
    const tcol = (id, n) => lamp(id) === "alert" || n >= alert ? "--red" : lamp(id) === "warn" || n >= warn ? "--yellow" : n >= 45 ? "--green" : "--teal";
    const tiles = temps.map(([ref, id]) => { const n = num(id), c = tcol(id, n), p = Math.max(4, Math.min(100, (n - lo) / (hi - lo) * 100));
      return `<div class="hwt"><span>${nameOf(b, ref, id)}</span><b ${c === "--red" ? `style="color:var(--red)"` : c === "--yellow" ? `style="color:var(--warn-ink)"` : ""}>${fmt(n)}<small>°C</small></b><i><em style="width:${p}%;background:var(${c})"></em></i></div>`; }).join("");
    const fanEl = fans.map(([ref, id]) => { const n = num(id) || 0, bad = !d.off && (lamp(id) === "alert" || n < (b.fan_min ?? 200)), dur = n > 0 ? Math.max(.25, Math.min(4, 900 / n)).toFixed(2) : 0;
      const nm = nameOf(b, ref, id).replace(/^(FAN|Lüfter)\s*/i, "");
      return `<div class="hwf ${bad ? "bad" : ""}" title="${nameOf(b, ref, id)}"><svg viewBox="0 0 24 24" style="${dur ? `--fd:${dur}s` : ""}"><circle class="ring" cx="12" cy="12" r="11"/><g class="${dur && !bad ? "spin" : ""}"><g transform="translate(12 12)">${[0, 120, 240].map(r => `<path transform="rotate(${r})" d="M0-2C1.6-5 3.8-8.4 1.4-9.4-1.4-10.2-2.2-5.8-1.4-2.2Z"/>`).join("")}<circle r="2"/></g></g></svg><b>${n >= 1000 ? fmt(n / 1000, 1) + "k" : fmt(n)}</b><span>${nm}</span></div>`; }).join("");
    return `<section class="card mod hwc"><h2>${b.label || "Hardware"}${fans.length ? ` <em>${TR("fans_in_rpm")}</em>` : ""}</h2>${tiles ? `<div class="hwts">${tiles}</div>` : ""}${fanEl ? `<div class="hwfs">${fanEl}</div>` : ""}</section>`;
  }
  function compactCard(d, b) {
    const ids = (b.items || []).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && ok(st(x[1]))); if (!ids.length) return "";
    const col = (id, v) => { const l = lamp(id); if (l === "alert") return "--red"; if (l === "warn") return "--warn-ink";
      if (v.u === "°C" && v.n != null) return v.n >= (b.alert ?? 75) ? "--red" : v.n >= (b.warn ?? 60) ? "--warn-ink" : ""; return ""; };
    const fans = ids.filter(([, id]) => st(id).attributes.unit_of_measurement === "rpm"), rest = ids.filter(x => !fans.includes(x));
    const pair = (k, v, c) => `<span class="cp"><span>${k}</span><b ${c ? `style="color:var(${c})"` : ""}>${v}</b></span>`;
    return `<section class="card mod cmpc">${b.label ? `<h2>${b.label}</h2>` : ""}<div class="cps">${rest.map(([ref, id]) => { const v = valueOf(id); return pair(nameOf(b, ref, id), `${v.v}${v.u ? " " + v.u : ""}`, col(id, v)); }).join("")}
      ${fans.length ? (() => { const fv = fans.map(([, id]) => { const v = valueOf(id); return { v, c: col(id, v) }; }), bad = fv.filter(x => x.c), ns = fv.map(x => x.v.n).filter(n => n != null);
        // Alle Lüfter in Ordnung: Spanne min–max, sonst die auffälligen einzeln
        const txt = bad.length ? bad.map(x => `<em style="color:var(${x.c})">${x.v.v}</em>`).join(" · ") : ns.length ? (Math.min(...ns) === Math.max(...ns) ? fmt(ns[0]) : `${fmt(Math.min(...ns))}–${fmt(Math.max(...ns))}`) : "–";
        return pair(`${b.fan_label || TR("fans")}${fans.length > 1 ? ` (${fans.length})` : ""}`, `${txt} <small>${TR("rpm")}</small>`, ""); })() : ""}</div></section>`;
  }
  // Thermometer: Temperaturen als Balken mit Ampelfarbe (Grenzen warn/alert, Standard 80/90 °C)
  function thermoCard(d, b) {
    const warn = b.warn ?? 80, alert = b.alert ?? 90, lo = b.min ?? 20, hi = b.max ?? 100;
    const rows = b.items.map(ref => entOf(ref, d.R)).filter(Boolean).map(id => ({ id, v: valueOf(id) })).filter(x => x.v.n != null).sort((x, y) => y.v.n - x.v.n);
    const hot = rows.reduce((m, x) => Math.max(m, x.v.n), -Infinity), wp = ((warn - lo) / (hi - lo) * 100).toFixed(1);
    return `<section class="card grow"><h2>${b.label || TR("temperatures")} <em>max. <b class="hv">${fmt(hot)} °C</b></em></h2><div class="thermo2">${rows.map(({ id, v }) => {
      const p = Math.max(3, Math.min(100, (v.n - lo) / (hi - lo) * 100)), col = v.n >= alert ? "--red" : v.n >= warn ? "--yellow" : v.n >= 60 ? "--green" : "--teal";
      const name = shortName(id).replace(/[- ]?Temperatur$/i, "").replace(/^CPU-Chiplet/, "Chiplet") || shortName(id);
      return `<div class="t2"><span>${name}</span><i style="--w:${wp}%"><b style="width:${p}%;background:var(${col})"></b></i><em style="${v.n >= warn ? `color:var(${v.n >= alert ? "--red" : "--warn-ink"})` : ""}">${fmt(v.n)}°</em></div>`; }).join("")}</div></section>`;
  }
  // Verfolgbarer Verlauf: 24 Std. in 5-Minuten-Schritten, Achsen, Warngrenze; Finger/Maus zeigt Zeitpunkt und Werte
  const TRACE = {};
  function fineSeries(id) {
    const pts = HIST.raw[id], now = Date.now(), start = now - 24 * 3600e3, out = [];
    if (!pts?.length) return HS(id, num(id) ?? 0).flatMap((v, i, arr) => i < arr.length - 1 ? Array(6).fill(v) : [v]);
    let k = 0, cur = null;
    for (let i = 0; i <= 288; i++) { const t = start + i * 300e3; const bin = []; while (k < pts.length && pts[k][0] <= t) { bin.push(pts[k][1]); cur = pts[k++][1]; } out.push(bin.length ? bin.reduce((s, x) => s + x, 0) / bin.length : cur); }
    const c = num(id); if (c != null) out[288] = c;
    return out;
  }
  function traceSvg(key, series, W, H, warn, unit) {
    const all = series.flatMap(s => s.v.filter(x => x != null)), pl = 4, pr = 30, pt = 8, pb = 16;
    let lo = Math.min(...all), hi = Math.max(...all, warn ?? -Infinity);
    const span = Math.max(hi - lo, unit === "°C" ? 10 : 1); lo = Math.floor((lo - span * .15) / 5) * 5; hi = Math.ceil((hi + span * .1) / 5) * 5;
    const n = series[0].v.length, X = i => pl + i / (n - 1) * (W - pl - pr), Y = y => pt + (1 - (y - lo) / ((hi - lo) || 1)) * (H - pt - pb);
    const path = v => { let d = "", on = false; v.forEach((y, i) => { if (y == null) { on = false; return; } d += `${on ? "L" : "M"}${X(i).toFixed(1)},${Y(y).toFixed(1)}`; on = true; }); return d; };
    const grid = [0, .5, 1].map(f => lo + (hi - lo) * f).map(y => `<line x1="${pl}" x2="${W - pr}" y1="${Y(y)}" y2="${Y(y)}" stroke="var(--sep)"/><text x="${W - pr + 4}" y="${Y(y) + 3.5}" class="tax">${fmt(y)}${unit === "°C" ? "°" : ""}</text>`).join("");
    const now = new Date(), hrs = [18, 12, 6].map(h => { const t = new Date(now - h * 3600e3); return [24 - h, `${String(t.getHours()).padStart(2, "0")}:00`]; });
    const times = hrs.map(([h, l]) => `<text x="${X(h / 24 * (n - 1))}" y="${H - 3}" class="tax" text-anchor="middle">${l}</text>`).join("");
    TRACE[key] = { series, X, Y, n, W, pl, pr, H, pt, pb, unit };
    const gid = "tg" + key;
    return `<svg class="trace-svg" data-k="${key}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${series[0].color}" stop-opacity=".22"/><stop offset="1" stop-color="${series[0].color}" stop-opacity="0"/></linearGradient></defs>
      ${grid}${times}${warn != null && warn <= hi ? `<line x1="${pl}" x2="${W - pr}" y1="${Y(warn)}" y2="${Y(warn)}" stroke="var(--orange)" stroke-dasharray="4 3"/>` : ""}
      <path d="${path(series[0].v)}L${X(n - 1)},${H - pb}L${X(0)},${H - pb}Z" fill="url(#${gid})"/>
      ${series.map(s => `<path d="${path(s.v)}" fill="none" stroke="${s.color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`).join("")}
      <g class="tguide" style="display:none"><line y1="${pt}" y2="${H - pb}" stroke="var(--label-2)" stroke-width="1"/>${series.map(s => `<circle r="3.5" fill="${s.color}" stroke="var(--glass)" stroke-width="1.5"/>`).join("")}</g></svg>`;
  }
  function traceCard(c) {
    const key = Math.random().toString(36).slice(2, 8), unit = c.series[0].unit;
    const soft = v => { const f = v.map(x => x ?? null); if (f.some(x => x == null)) return f; return smooth(smooth(f)); };  // leicht glätten, Messrauschen raus
    const series = c.series.map(s => ({ ...s, v: soft(fineSeries(s.id)), color: css(s.color) }));
    const warn = c.series.find(s => s.warn != null)?.warn ?? c.warn;
    return `<section class="card grow trace"><h2>${c.label} <em class="tread" data-k="${key}">${TR("24_h")}</em></h2>
      <div class="serleg">${c.series.map(s => `<span><i style="background:var(${s.color})"></i>${s.label} <b data-s="${s.id}">${valueOf(s.id).v} ${s.unit}</b></span>`).join("")}</div>
      ${lazy((W, H) => traceSvg(key, series, W, H, warn, unit))}</section>`;
  }
  function traceMove(e) {
    const svg = e.target.closest?.(".trace-svg"); if (!svg) return;
    const T = TRACE[svg.dataset.k]; if (!T) return;
    const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) * (T.W / r.width);
    const i = Math.max(0, Math.min(T.n - 1, Math.round((x - T.pl) / (T.W - T.pl - T.pr) * (T.n - 1))));
    const g = svg.querySelector(".tguide"); g.style.display = "";
    g.querySelector("line").setAttribute("x1", T.X(i)); g.querySelector("line").setAttribute("x2", T.X(i));
    g.querySelectorAll("circle").forEach((c, k) => { const v = T.series[k].v[i]; c.style.display = v == null ? "none" : ""; c.setAttribute("cx", T.X(i)); if (v != null) c.setAttribute("cy", T.Y(v)); });
    const card = svg.closest(".card"), t = new Date(Date.now() - (T.n - 1 - i) * 300e3);
    card.querySelector(".tread").textContent = i === T.n - 1 ? TR("now") : t.toLocaleTimeString(rdLoc(), { hour: "2-digit", minute: "2-digit" }) + (" " + TR("clock"));
    T.series.forEach(s => { const b = card.querySelector(`b[data-s="${s.id}"]`); if (b) b.textContent = `${fmt(s.v[i], s.dec ?? 0)} ${unescH(s.unit)}`; });
  }
  function traceLeave(e) {
    const card = e.target.closest?.(".trace"); if (!card) return;
    const svg = card.querySelector(".trace-svg"), T = svg && TRACE[svg.dataset.k]; if (!T) return;
    svg.querySelector(".tguide").style.display = "none"; card.querySelector(".tread").textContent = TR("24_h");
    T.series.forEach(s => { const b = card.querySelector(`b[data-s="${s.id}"]`); if (b) b.textContent = unescH(`${valueOf(s.id).v} ${s.unit}`); });
  }
  function chartCard(c) {
    if (c.style === "trace") return traceCard(c.multi ? c : { label: c.label, warn: c.warn, series: [{ id: c.entity, label: c.label, unit: c.unit, color: c.color, dec: c.dec, warn: c.warn }] });
    if (c.multi) return trendCard(c.label, c.series.map(x => ({ ...x, cur: num(x.id) })));
    if (false) {
      const COL = ["--blue", "--orange", "--green"], vals = c.series.map(x => HS(x.id, num(x.id) || 0));
      const all = vals.flat(), lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo) * .1 || 1;
      return `<section class="card grow"><h2>${c.label} <em>${TR("24_h")}</em></h2>
        <div class="serleg">${c.series.map((x, i) => `<span><i style="background:var(${COL[i]})"></i>${x.label} <b>${valueOf(x.id).v} ${x.unit}</b></span>`).join("")}</div>
        ${lazy((W, H) => chartMulti(c.series.map((x, i) => ({ v: vals[i], color: css(COL[i]), fill: i === 0 })), { lo: lo - pad, hi: hi + pad, W, H }))}</section>`;
    }
    const now = HS(c.entity, c.base).at(-1);
    return `<section class="card grow"><h2>${c.label} <em><b class="hv">${fmt(now, c.dec)} ${c.unit}</b> ${TR("bullet_n", c.warn != null ? TR("limit_n", `${fmt(c.warn)} ${c.unit}`) : TR("24_h"))}</em></h2>${lazy((W, H) => chartSVG(c, 0, W, H))}</section>`;
  }
  // Warnungen/Störungen stehen im Gerätekopf; die Karte „Meldungen“ zeigt die übrigen Infos
  const warnMsgsOf = d => (d.msgs || []).filter(m => m[0] !== "ok");
  let EDIT_HOOK = null, HOLD = false;
  function fitDetail() {
    // Rastermodus: Zellen markieren, deren Inhalt nicht ganz passt (Listen bekommen dann einen weichen Auslauf)
    ROOT.querySelectorAll(".dgrid.gm>.card").forEach(c => c.classList.toggle("cut", c.scrollHeight > c.clientHeight + 2));
    if (EDIT_HOOK) queueMicrotask(EDIT_HOOK);
    placeDots();
    const g = ROOT.querySelector(".panel.detail .dgrid"); if (!g) return;
    if (![...g.children].some(c => c.scrollHeight > c.clientHeight + 2)) return;
    const h = g.querySelector(".msgs.hasl"); if (!h) return;
    if (h.querySelector(".msg")) h.querySelector(".dlog")?.remove(); else h.remove();
  }
  function msgsCard(d) {
    const rest = (d.msgs || []).filter(m => m[0] === "ok").concat(warnMsgsOf(d).slice(2));
    loadDevLog(d, d.haDevs);
    const log = [...(DLOG[d.id]?.rows || [])];
    // Letzter Start mit Firmware-Stand (wie „has updated to …“ im Controller); Zeitpunkt aus der Laufzeit
    const up = st(d.R?.uptime), fw = st(d.R?.firmware)?.attributes.installed_version;
    if (up && ok(up)) { const x = parseFloat(up.state), t = up.attributes.unit_of_measurement === "s" ? Date.now() - x * 1000 : Date.parse(up.state);
      if (!isNaN(t) && !log.some(r => Math.abs(r[1] - t) < 30 * 60e3)) log.push([fw ? TR("started_with_firmware_n", fw.split(".").slice(0, 3).join(".")) : TR("restarted"), t]); }
    log.sort((p, q) => q[1] - p[1]);
    if (!rest.length && !log.length) return "";
    const ms = rest.slice(0, 2);
    const hist = log.length ? `<div class="dlog"><h2>History</h2>${log.slice(0, rest.length ? 2 : 3).map(([t, w]) => `<div class="dl"><span>${t}</span><time>${whenTxt(w)}</time></div>`).join("")}</div>` : "";
    return `<section class="card wide msgs${hist ? " hasl" : ""}">${ms.length ? `<h2>${TR("messages")}${d.msgs.length > 2 ? ` <em>${TR("n_more_2", d.msgs.length - 2)}</em>` : ""}</h2>${ms.map(m => `<div class="msg ${m[0]}"><i></i><div>${m[1]}<time>${m[2]}</time></div></div>`).join("")}` : ""}${hist}</section>`;
  }
  // Jeder Block liefert eine Karte oder nichts (keine Daten). half = darf neben einem zweiten halben Block stehen.
  const BLOCK_RENDER = {
    tiles: d => d.tiles?.length && tilesCard(d),
    ports: d => d.ports && portCard(d),
    poe: d => d.poe && poeCard(d),
    system: d => d.sys && sysCard(d),
    internet: d => d.wan && wanCard(d),
    flow: d => d.flow && upsFlow(d),
    voltage: d => d.flow && voltCard(d),
    chart: (d, b) => { const c = chartOf(b, d.R); return c && chartCard(c); },
    outlets: d => d.outlets && outletCard(d),
    disks: d => d.disks && diskCard(d),
    recording: d => d.rec && recCard(d),
    messages: d => msgsCard(d),
    values: (d, b) => b.style === "hw" ? hwCard(d, b) : b.style === "compact" ? compactCard(d, b) : b.style === "ifaces" ? ifacesCard(d, b) : b.items?.length && (b.style === "rings" ? ringsCard(d, b) : `<section class="card"><h2>${b.label || TR("values")}</h2><div class="grid t3">${b.items.map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1]).map(([ref, id]) => { const v = valueOf(id);
      const txt = v.n == null && String(v.v).length > 9;   // Text statt Zahl (z. B. Client-Name): kleiner, höchstens zwei Zeilen
      return `<div class="tile"><span class="k">${nameOf(b, ref, id)}</span><span class="v ${txt ? "txt" : ""}" ${txt ? `title="${String(v.v).replace(/"/g, "&quot;")}"` : ""}>${v.v}<small>${v.u}</small></span>${v.u === "%" && v.n != null ? `<div class="meter"><b style="width:${Math.max(0, Math.min(100, v.n))}%"></b></div>` : ""}</div>`; }).join("")}</div></section>`),
    bars: (d, b) => b.items?.length && (b.style === "thermo" ? thermoCard(d, b) : `<section class="card grow"><h2>${b.label || TR("load")}</h2><div class="bars2 ${b.items.length > 5 && b.size === "full" ? "two" : ""}">${b.items.map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1]).map(([ref, id]) => { const v = valueOf(id), lo = b.min ?? 0, hi = b.max ?? 100;
      const p = v.n == null ? 0 : Math.max(0, Math.min(100, (v.n - lo) / ((hi - lo) || 1) * 100));
      return `<div class="b2"><span>${nameOf(b, ref, id)}</span><b>${v.v} ${v.u}</b><div class="meter"><b style="width:${p}%;${p > 85 ? "background:var(--orange)" : ""}"></b></div></div>`; }).join("")}</div></section>`),
    // Einzelwert: eine Entität als eigene Kachel, wahlweise mit 24-Std.-Kurve (wie eine Kachel aus „Auslastung“)
    entity: (d, b) => { const ref = b.items?.[0] || b.source, id = ref && entOf(ref, d.R); if (!id || !st(id)) return "";
      const v = valueOf(id), label = nameOf(b, ref, id);
      if (b.style !== "chart") return `<section class="card one"><span class="k">${label}</span><b class="v">${v.v}<small>${v.u}</small></b></section>`;
      HIST.want.add(id);
      return trendCard("", [{ label, id, cur: num(id), unit: v.u, color: b.colors?.[0] || "--blue", dec: Math.abs(num(id) || 0) < 10 ? 1 : 0, warn: b.warn }]).replace('<section class="card mtc">', '<section class="card mtc one">').replace(/<h2>[\s\S]*?<\/h2>/, ""); },
    status: (d, b) => b.items?.length && `<section class="card grow"><h2>${b.label || "Status"}</h2><div class="stat2">${b.items.map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1]).map(([ref, id]) => { const v = valueOf(id);
      return `<div class="s2 ${lamp(id)}"><i></i><span>${nameOf(b, ref, id)}</span><b>${v.v}${v.u ? " " + v.u : ""}</b></div>`; }).join("")}</div></section>`,
    ov_power: () => ovPower(ovData()),
    ov_temp: () => ovTemp(ovData()),
    ov_hints: () => ovHints(ovData()),
    ov_stats: () => ovStats(ovData()).replace('<div class="stats wide">', '<div class="stats ovstats">'),
    bays: (d, b) => baysCard(d, b),
    array: (d, b) => arrayCard(d, b),
    // ---- Einzel- und Bedien-Module (frei gestaltbar) ----
    gauge: (d, b) => { const o = oneEnt(d, b); if (!o) return ""; const lo = b.min ?? 0, hi = b.max ?? autoMax(o.v), p = frac(o.v.n, lo, hi), C = Math.PI * 40;
      return `<section class="card mod gauge"><span class="k">${o.label}</span><div class="gw"><svg viewBox="0 0 100 56"><path d="M10,50 A40,40 0 0 1 90,50" class="gtr"/><path d="M10,50 A40,40 0 0 1 90,50" class="gv" style="stroke:var(${thrCol(b, o.v.n)})" stroke-dasharray="${(C * p).toFixed(1)} ${C.toFixed(1)}"/></svg>
        <b class="gval">${o.v.v}<small>${o.v.u}</small></b></div><span class="gmm"><i>${fmt(lo)}</i><i>${fmt(hi)}</i></span></section>`; },
    ring: (d, b) => { const o = oneEnt(d, b); if (!o) return ""; const lo = b.min ?? 0, hi = b.max ?? autoMax(o.v), p = frac(o.v.n, lo, hi), C = 2 * Math.PI * 42;
      return `<section class="card mod ringm"><div class="rw"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" class="gtr"/><circle cx="50" cy="50" r="42" class="gv" style="stroke:var(${thrCol(b, o.v.n)})" stroke-dasharray="${(C * p).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 50 50)"/></svg>
        <b class="gval">${o.v.v}<small>${o.v.u}</small></b></div><span class="k">${o.label}</span></section>`; },
    stat: (d, b) => { const o = oneEnt(d, b); if (!o) return ""; HIST.want.add(o.id); const h = HIST.data[o.id], d0 = h ? h[0] : null, dv = o.v.n != null && d0 != null ? o.v.n - d0 : null;
      const tr = dv == null || Math.abs(dv) < 1e-9 ? "" : `<span class="trd ${dv > 0 ? "up" : "dn"}">${dv > 0 ? "▲" : "▼"} ${fmt(Math.abs(dv), Math.abs(dv) < 10 ? 1 : 0)} ${o.v.u} <em>${TR("vs_yesterday")}</em></span>`;
      return `<section class="card mod statm"><span class="k">${o.label}</span><b class="sv" style="color:var(${b.warn != null || b.alert != null ? thrCol(b, o.v.n) : "--label"})">${o.v.v}<small>${o.v.u}</small></b>${tr}</section>`; },
    progress: (d, b) => { const o = oneEnt(d, b); if (!o) return ""; const lo = b.min ?? 0, hi = b.max ?? autoMax(o.v), p = frac(o.v.n, lo, hi);
      return `<section class="card mod prog"><div class="ph"><span class="k">${o.label}</span><b>${o.v.v}<small>${o.v.u}</small></b></div><div class="pbar"><i style="width:${(p * 100).toFixed(1)}%;background:var(${thrCol(b, o.v.n)})"></i></div><span class="gmm"><i>${fmt(lo)}</i><i>${fmt(hi)}</i></span></section>`; },
    histogram: (d, b) => { const o = oneEnt(d, b); if (!o) return ""; HIST.want.add(o.id); const h = HS(o.id, o.v.n ?? 0), bars = [];
      for (let i = 0; i < 24; i++) bars.push(((h[i * 2] ?? 0) + (h[i * 2 + 1] ?? h[i * 2] ?? 0)) / 2);
      const mx = Math.max(...bars, 1e-9), col = b.colors?.[0] || "--blue", now = new Date().getHours();
      return `<section class="card mod histo"><div class="ph"><span class="k">${o.label}</span><b>${o.v.v}<small>${o.v.u}</small></b></div>
        <div class="hb">${bars.map((v, i) => `<i style="height:${Math.max(3, v / mx * 100).toFixed(0)}%;background:var(${col});opacity:${i === 23 ? 1 : .55}" title="${fmt(v, 1)} ${o.v.u}"></i>`).join("")}</div>
        <span class="gmm"><i>${String((now + 1) % 24).padStart(2, "0")}:00</i><i>${TR("now")}</i></span></section>`; },
    chips: (d, b) => { const ids = (b.items || []).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && st(x[1])); if (!ids.length) return "";
      if (b.style === "list") { const ICON = { ok: "✓", alert: "!", warn: "!", off: "–" };
        return `<section class="card mod stlist">${b.label ? `<h2>${b.label}</h2>` : ""}<div class="sts">${ids.map(x => [...x, lamp(x[1])]).sort((x, y) => ({ alert: 0, warn: 1 }[x[2]] ?? 2) - ({ alert: 0, warn: 1 }[y[2]] ?? 2)).map(([ref, id, l]) => { const v = valueOf(id);
          return `<div class="st ${l}"><i>${ICON[l] || "✓"}</i><span>${nameOf(b, ref, id)}</span><b>${v.v}${v.u ? " " + v.u : ""}</b></div>`; }).join("")}${(() => { const okn = ids.filter(x => !["alert", "warn"].includes(lamp(x[1]))); return okn.length ? `<div class="st ok sum"><i>✓</i><span>${okn.length === ids.length ? TR("all_good") : TR("n_more", okn.length)}</span><b>${TR("no_problem")}</b></div>` : ""; })()}</div></section>`; }
      return `<section class="card mod chipsm">${b.label ? `<h2>${b.label}</h2>` : ""}<div class="chs">${ids.map(x => [...x, { alert: 0, warn: 1 }[lamp(x[1])] ?? 2]).sort((x, y) => x[2] - y[2]).map(([ref, id]) => { const v = valueOf(id); return `<span class="ch ${lamp(id)}"><i></i>${nameOf(b, ref, id)}<b>${v.v}${v.u ? " " + v.u : ""}</b></span>`; }).join("")}</div></section>`; },
    switch: (d, b) => { const ids = (b.items || []).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && st(x[1])); if (!ids.length) return "";
      return `<section class="card mod swm">${b.label ? `<h2>${b.label}</h2>` : ""}${ids.map(([ref, id]) => { const on = ["on", "open", "playing", "home"].includes(st(id).state);
        return `<div class="swr"><span>${nameOf(b, ref, id)}</span><button class="tgl ${on ? "on" : ""}" data-toggle="${id}" role="switch" aria-checked="${on}" aria-label="${nameOf(b, ref, id)}"><i></i></button></div>`; }).join("")}</section>`; },
    button: (d, b) => { const ids = (b.items || []).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && st(x[1])); if (!ids.length) return "";
      return `<section class="card mod btnm">${b.label ? `<h2>${b.label}</h2>` : ""}<div class="bts">${ids.map(([ref, id]) => `<button class="actb" data-press="${id}">${nameOf(b, ref, id)}</button>`).join("")}</div></section>`; },
    camera: (d, b) => { const o = oneEnt(d, b); if (!o) return ""; const pic = st(o.id).attributes.entity_picture; if (!pic) return "";
      return `<section class="card mod camm"><img src="${pic}${pic.includes("?") ? "&" : "?"}t=${Math.floor(Date.now() / 10000)}" alt="${o.label}" loading="lazy"><span class="camn">${o.label}</span></section>`; },
    heading: (d, b) => (b.label || b.text) && `<section class="card mod headm"><b>${b.label || ""}</b>${b.text ? `<span>${b.text}</span>` : ""}</section>`,
    clock: () => { const n = new Date(); return `<section class="card mod clockm"><b class="clk">${n.toLocaleTimeString(rdLoc(), { hour: "2-digit", minute: "2-digit" })}</b><span class="clkd">${n.toLocaleDateString(rdLoc(), { weekday: "long", day: "numeric", month: "long" })}</span></section>`; },
    note: (d, b) => d.slots ? slotsCard(d) : (b.text || d.passive) && `<section class="card"><p class="note" style="margin:0">${b.text || TR("passive_element_without_sensors_assignments_or")}</p></section>`,
  };
  // Community-Module (modules/<typ>/render.js): bekommen nur ctx mit fertig aufbereiteten Werten und liefern HTML
  for (const [type, mod] of Object.entries(RD_MODULES)) {
    const render = mod.render, tr = s => rdIsDe() ? (mod.de?.[s] ?? s) : s;   // Module schreiben Englisch, „de“ übersetzt
    const meta = rdCatalog().blocks[type] || {};
    BLOCK_RENDER[type] = (d, b) => {
      const items = (b.items || (b.source ? [b.source] : [])).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && st(x[1])).map(([ref, id]) => { const s = st(id), v = valueOf(id);
        return { id, name: nameOf(b, ref, id), state: s.state, value: v.v, unit: v.u, number: v.n ?? null, status: lamp(id), available: ok(s), attributes: { ...s.attributes } }; });
      if (meta.items && !items.length) return "";
      const opt = k => b[k] ?? (meta.options || []).find(o => o.key === k)?.default;
      const ctx = { device: unescDeep({ id: d.id, name: d.name, model: d.model, state: d.state, off: !!d.off }), items: unescDeep(items), option: k => unescDeep(opt(k)), fmt, esc: escH, t: tr, lang: () => RD_LANG };
      let html = "";
      try { html = render(ctx, unescDeep(b)) || ""; } catch (err) { console.warn(`Rack Display: Modul ${type}:`, err); html = `<p class="note">${TR("module_error")} ${escH(type)}</p>`; }
      return html && `<section class="card mod mod-${type}">${b.label !== "" ? `<h2>${b.label || escH(meta.name || type)}</h2>` : ""}${html}</section>`;
    };
  }
  function renderBlocks(d) {
    // Eigenes Layout (im Editor eingeschaltet): 12 Spalten × feste Zeilenzahl, Module der Reihe nach mit Breite × Höhe (wie HA-Abschnitte)
    if (d.options?.grid) {
      const G = rdGeometry(RAW?.display), span = b => { const l = b.layout || {}; return [Math.max(1, Math.min(12, l.w || 12)), Math.max(1, l.h || 3)]; };
      const cells = d.blocks.map((b, bi) => {
        if (!BLOCK_RENDER[b.type] && b.type !== "header") return "";
        const html = b.type === "header" ? headCard(d) : BLOCK_RENDER[b.type](d, b);
        const [w, h] = span(b), l = b.layout || {}, fixed = Number.isInteger(l.x) && Number.isInteger(l.y);
        // Feste Position (im Editor platziert) oder der Reihe nach einfüllen
        const stl = fixed ? `grid-column:${l.x + 1} / span ${Math.max(1, Math.min(w, 12 - l.x))} !important;grid-row:${l.y + 1} / span ${h} !important` : `grid-column:span ${w} !important;grid-row:span ${h} !important`;
        // Module ohne Daten: im Editor als leeres Feld sichtbar (damit man es anordnen kann), in der Anzeige ausgeblendet
        // Gerät aus: Module ohne erreichbare Werte grau (Platzhalter mit Titel, damit das Layout stehen bleibt)
        const dim = d.off && b.type !== "header" && !blockEnts(d, b).some(id => ok(st(id)));
        if (!html || (dim && !OFF_SKELETON.includes(b.type))) return dim ? `<section data-bi="${bi}" style="${stl}" class="gcell card offdim offph"><h2>${b.label || rdCatalog().blocks[b.type]?.name || b.type}</h2><p class="note">${TR("off_2")}</p></section>`
          : EDIT_HOOK ? `<section data-bi="${bi}" style="${stl}" class="gcell card empty-mod"><h2>${rdCatalog().blocks[b.type]?.name || b.type}</h2>${rdSkeleton(b.type)}</section>` : "";
        return html.replace(/<section class="/, `<section data-bi="${bi}" style="${stl}" class="gcell ${dim ? "offdim " : ""}`);
      }).join("");
      return `<div class="dgrid gm" style="--gc:12;--gr:${G.frows}">${cells}</div>`;
    }
    const items = [];
    for (const b of d.blocks) {
      if (b.type === "header" || !BLOCK_RENDER[b.type]) continue;
      const html = BLOCK_RENDER[b.type](d, b);
      if (html) items.push({ html, half: (b.size || rdCatalog().blocks[b.type]?.size) === "half" });
    }
    // Halbe Blöcke paarweise nebeneinander; ein halber Block ohne Partner geht über die volle Breite
    const wide = h => h.replace(/class="card(?![^"]*\bwide\b)/, 'class="card wide'), isWide = h => /class="card[^"]*\bwide\b/.test(h), grows = h => /class="card[^"]*\bgrow\b/.test(h);
    for (let i = 0; i < items.length; i++) {
      if (!items[i].half) { items[i].html = wide(items[i].html); continue; }
      if (items[i + 1]?.half) { i++; continue; }
      items[i].html = wide(items[i].html);
    }
    // Zeilen fürs Hochformat: Kopf + je Zeile (ganzes Modul oder Paar halber Module); Zeilen mit Verlauf/Liste wachsen mit
    const rows = ["auto"];
    for (let i = 0; i < items.length; i++) {
      const pair = items[i].half && items[i + 1]?.half && !isWide(items[i].html);
      const grow = grows(items[i].html) || (pair && grows(items[i + 1].html));
      rows.push(grow ? "minmax(0,1fr)" : "auto"); if (pair) i++;
    }
    // Port-Historie füllt nur dann den Rest, wenn sonst nichts wächst
    const pg = items.map((x, i) => /\bpgrow\b/.test(x.html) ? i : -1).filter(i => i >= 0);
    if (pg.length && rows.filter(r => r !== "auto").length > pg.length) {
      let ri = 1;
      for (let i = 0; i < items.length; i++) { const pair = items[i].half && items[i + 1]?.half && !isWide(items[i].html); if (/\bpgrow\b/.test(items[i].html)) { rows[ri] = "auto"; items[i].html = items[i].html.replace(" grow pgrow", " pgrow"); } ri++; if (pair) i++; }
    }
    if (!rows.includes("minmax(0,1fr)")) rows.push("minmax(0,1fr)");   // nichts wächst: freier Platz bleibt unten
    return `<div class="dgrid" style="--rows:${rows.join(" ")}">${headCard(d)}${items.map(x => x.html).join("")}</div>`;
  }

  function showDetail(d) {
    if (d.off && d.options?.grid && d.blocks?.length) return renderBlocks(d);
    if (d.off) return `<div class="dgrid nodata">${headCard(d)}<section class="card wide offc"><span class="offi">⏻</span><b>${TR("switched_off")}</b><span>${d.offSince ? TR("since_n", `${new Date(d.offSince).toLocaleString(rdLoc(), { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}.`) : TR("the_device_does_not_run_permanently")} ${TR("values_appear_here_automatically_once_it_is")}</span>${d.options?.power_on && st(d.options.power_on) ? (() => { const arm = ARMED?.id === d.options.power_on && Date.now() - ARMED.t < 4000;
      return `<button class="actb pwron ${arm ? "armed" : ""}" data-press="${d.options.power_on}" data-confirm="${TR("tap_again_to_power_on")}">${arm ? TR("tap_again_to_power_on") : TR("power_on")}</button>`; })() : ""}</section></div>`;
    if (!d.noData) return renderBlocks(d);
    const mm = members(d.id), lo = Math.min(...mm.map(x => x.u)), hi = Math.max(...mm.map(x => x.u + x.h - 1));
    return `<div class="dgrid nodata"><section class="card wide"><div class="dhero">
      <div class="top"><div style="min-width:0"><h1 style="font:700 24px/1.1 var(--font-display);margin:0 0 4px">${d.name}</h1><div class="sub" style="color:var(--label-2);font-size:13px">${d.model} · ${TR("u_n", `${lo}${hi > lo ? "–" + hi : ""}`)}</div></div>
        <span class="chip warn"><i></i>${TR("no_data")}</span></div>
      ${headThumb(d)}
      <p class="note" style="margin:6px 0 0">${TR("no_ha_device_linked")}</p>
    </div></section></div>`;
  }

  // Wärmekarte (Rack → Aussehen → Wärmekarte): Geräte im Rack nach Temperatur einfärben, eigener Knopf „Wärme“
  function heatPaint() {
    const temps = DEVICES.filter(d => d.temp != null), can = !!RACK.heatmap && temps.length >= 2, seg = ROOT.querySelector(".rack-meta .seg");
    let btn = $("sideHeat");
    if (can && !btn && seg) { seg.insertAdjacentHTML("beforeend", `<button id="sideHeat" aria-pressed="false">${TR("heat")}</button>`); btn = $("sideHeat"); }
    if (!can) { btn?.remove(); if (S.heat) { S.heat = false; } }
    const rack = $("rack"); rack?.classList.toggle("heat", !!S.heat);
    btn?.setAttribute("aria-pressed", String(!!S.heat));
    ROOT.querySelectorAll(".hits [data-id]").forEach(h => { const d = DEVICES.find(x => x.id === h.dataset.id), t = d?.temp;
      h.querySelector(":scope>.heat-t")?.remove(); h.style.removeProperty("--heat");
      if (!S.heat || t == null) return;
      const c = t >= TEMP_ALERT ? "#ff453a" : t >= TEMP_WARN ? "#ff9f0a" : t >= 65 ? "#ffd60a" : t >= 45 ? "#30d158" : "#64d2ff";
      h.style.setProperty("--heat", c); h.insertAdjacentHTML("beforeend", `<b class="heat-t">${fmt(t)}°</b>`); });
  }
  // Nachtmodus (Rack → Anzeige → Nachtmodus von/bis): dunkel, gedimmt, ohne Blinken
  function nightCheck() {
    const N = RAW?.display?.night, m = s => { const [h, mi] = String(s || "").split(":").map(Number); return h * 60 + (mi || 0); };
    let on = false;
    if (N?.from && N?.to) { const now = new Date(), t = now.getHours() * 60 + now.getMinutes(), a0 = m(N.from), b0 = m(N.to); on = a0 <= b0 ? t >= a0 && t < b0 : t >= a0 || t < b0; }
    if (WRAP.classList.contains("night") !== on) { WRAP.classList.toggle("night", on); WRAP.style.setProperty("--night-dim", String(N?.dim ?? 0.55)); WRAP.dispatchEvent(new CustomEvent("rd-night", { bubbles: true, composed: true })); }
  }
  function tick() { nightCheck(); ROOT.querySelectorAll(".clk").forEach(c => { c.textContent = new Date().toLocaleTimeString(rdLoc(), { hour: "2-digit", minute: "2-digit" }); }); const c = $("clock"); if (c) c.textContent = new Date().toLocaleTimeString(rdLoc(), { hour: "2-digit", minute: "2-digit" }); }

  /* ---------- Rendern ---------- */
  // Aussehen des Schranks: Gehäusefarbe (Vorgabe oder eigene Farbe), Türart, Farbe der Türbeschriftung
  const RACK_COLORS = { light: ["#f1f2f4", "#d6d8dc", "#b9bcc1"], graphite: ["#7b7f86", "#5d6168", "#45484e"], black: ["#3b3e43", "#26282c", "#17181b"], white: ["#ffffff", "#eef0f2", "#d5d8dc"] };
  function rackLook(rack) {
    const c = RACK.color || "light", set = RACK_COLORS[c];
    const v = set || [`color-mix(in srgb,${c} 70%,white)`, c, `color-mix(in srgb,${c} 72%,black)`];
    ["--steel-1", "--steel-2", "--steel-3"].forEach((k, i) => rack.style.setProperty(k, v[i]));
    rack.dataset.door = RACK.door || "mesh";
    rack.classList.toggle("rk-dark", c === "black" || c === "graphite" || (!set && /^#/.test(c) && parseInt(c.slice(1, 3), 16) * .3 + parseInt(c.slice(3, 5), 16) * .59 + parseInt(c.slice(5, 7), 16) * .11 < 110));
    rack.style.setProperty("--door-label", RACK.labelColor || "#e2372b");
  }
  let rackSig = "";
  function updateLeds() {
    for (const d of DEVICES) {
      if (!d.ports) continue;
      ROOT.querySelectorAll(`.leds[data-dev="${d.id}"] .pl-led.link`).forEach(el => {
        const n = +el.dataset.n, p = d.ports.find(x => x.n === n); if (!p) return;
        const v = `${ledDur(p, (n * 7919) % 100)}s`; if (el.style.animationDuration !== v) el.style.animationDuration = v;
      });
    }
  }
  function render(forceRack) {
    // Blinktempo der LEDs ändert sich mit dem Verkehr ständig: nicht neu zeichnen, sondern nur die Dauer anpassen
    const sig = JSON.stringify([RACK, S.sel, S.door, S.side, DEVICES.map(d => [d.id, d.u, d.h, d.state, d.image, (d.ports || []).map(p => [p.speed, p.poe ? 1 : 0])])]);
    if (forceRack || sig !== rackSig) { rackSig = sig; renderRack(); requestAnimationFrame(() => { cutDoor(); wledLayout(); }); }
    else updateLeds();
    heatPaint();
    renderPanel();
  }

  /* ---------- Bedienung ---------- */
  ROOT.addEventListener("pointermove", traceMove);
  ROOT.addEventListener("pointerdown", traceMove);
  ROOT.addEventListener("pointerleave", traceLeave, true);
  ROOT.addEventListener("click", e => {
    const t = e.target.closest("button,[data-back]");
    if (!t) return;
    const prevSel = S.sel;
    if (t.dataset.toggle) { const id = t.dataset.toggle, dom = id.split(".")[0]; HASS.callService(["light", "switch", "fan", "input_boolean", "cover", "lock"].includes(dom) ? dom : "homeassistant", "toggle", { entity_id: id }); t.classList.toggle("on"); return; }
    // Tasten mit Rückfrage: erst beim zweiten Tippen innerhalb von 4 s auslösen (Zustand übersteht Neuaufbau des Popups)
    if (t.dataset.press && t.dataset.confirm && !(ARMED?.id === t.dataset.press && Date.now() - ARMED.t < 4000)) { ARMED = { id: t.dataset.press, t: Date.now() };
      t.classList.add("armed"); t.textContent = t.dataset.confirm; setTimeout(() => { if (ARMED && Date.now() - ARMED.t >= 4000) { ARMED = null; renderPanel(); } }, 4100); return; }
    if (t.dataset.confirm) ARMED = null;
    if (t.dataset.press) { const id = t.dataset.press, dom = id.split(".")[0]; const [svc, act] = dom === "script" ? ["script", "turn_on"] : dom === "scene" ? ["scene", "turn_on"] : dom === "automation" ? ["automation", "trigger"] : [dom, "press"];
      HASS.callService(svc, act, { entity_id: id }); t.classList.add("pressed"); setTimeout(() => t.classList.remove("pressed"), 400); return; }
    if (t.dataset.wledPower !== undefined) { if (RAW?.wled?.entity_id) HASS.callService("light", "toggle", { entity_id: RAW.wled.entity_id }); return; }
    else if (t.dataset.port) { S.port = +t.dataset.port; }
    else if (t.dataset.bay) { S.bay = t.dataset.bay; }
    else if (t.dataset.id) { S.port = null; S.sel = S.sel === t.dataset.id && t.classList.contains("hit") ? null : t.dataset.id; }
    else if (t.dataset.back !== undefined) { S.sel = byId(S.sel)?.parent || null; }
    else if (t.id === "doorOpen" || t.id === "doorClosed" || t.id === "sideRear" || t.id === "sideHeat") {
      S.heat = t.id === "sideHeat";
      S.side = t.id === "sideRear" ? "rear" : "front"; S.door = t.id === "doorClosed";
      ["doorOpen", "doorClosed", "sideRear"].forEach(x => $(x).setAttribute("aria-pressed", x === t.id));
    }
    else return;
    if (S.sel !== prevSel) navAnim(S.sel ? "nav-in" : "nav-out");
    NAV.now = true; try { render(); } finally { NAV.now = false; }
  });
  let navT;
  function navAnim(cls) {
    WRAP.classList.remove("nav-in", "nav-out"); void WRAP.offsetWidth;
    WRAP.classList.add(cls); clearTimeout(navT); navT = setTimeout(() => WRAP.classList.remove(cls), 460);
    NAV.until = Date.now() + 480;
  }

  const timer = setInterval(tick, 10000);
  // Port-Historie alle 5 s auffrischen (nur die Balken, nicht die Karte)
  const liveTimer = setInterval(() => {
    const w = LIVE_SEL && ROOT.querySelector(".plive-wrap");
    if (w) w.innerHTML = liveSvg(LIVE_SEL);
  }, 5000);
  // Nach einer Weile ohne Berührung zurück zur Übersicht (Einstellung „display.idle“ in Sekunden, 0 = aus; Standard 60 s).
  // Die Editor-Vorschau wählt Geräte selbst aus und bleibt davon unberührt.
  let LAST_TOUCH = Date.now(), IDLE_OFF = false;
  ["pointerdown", "keydown", "wheel"].forEach(ev => ROOT.addEventListener(ev, () => { LAST_TOUCH = Date.now(); }, { passive: true, capture: true }));
  const idleTimer = setInterval(() => {
    const idle = RAW?.display?.idle ?? 60;
    if (IDLE_OFF || !idle || !(S.sel || S.side !== "front" || !S.door) || Date.now() - LAST_TOUCH < idle * 1000) return;
    S.sel = null; S.port = null; S.side = "front"; S.door = true; render();
  }, 5000);
  const histTimer = setInterval(() => { loadHistory(); loadEvents(); }, 60e3);
  const ro = new ResizeObserver(() => { if (!DEAD && RAW) { cutDoor(); wledLayout(); renderPanel(); } });
  ro.observe(WRAP);
  WLED.loop = true; requestAnimationFrame(wledFrame);

  // Beobachtete Entitäten einmal je Rack bestimmen; bei HA-Updates nur Objektvergleich (HA ersetzt geänderte Zustände)
  let WATCH = [], seen = [];
  function computeWatch() {
    WATCH = [...new Set(RAW.devices.flatMap(r => r.map ? [...Object.values(r.map.roles), ...r.map.problems, ...r.map.disks, ...Object.values(r.map.outlets),
      ...r.map.ports.flatMap(p => [p.speed, p.poe, p.rx, p.tx]), ...(r.map.cameras || [])] : []).concat(
      RAW.devices.flatMap(r => JSON.stringify(r.blocks || []).match(/\b(sensor|binary_sensor|switch|device_tracker)\.[a-z0-9_]+/g) || []),RAW.wled?.entity_id || [], [...LIVE_WATCH]).filter(Boolean))];
    seen = [];
  }
  let lastRender = 0, pending = null;
  // Sprachwechsel (HA-Benutzer oder Rack → Anzeige → Sprache): feste Texte und Anzeige neu zeichnen
  rdFill(ROOT);
  const offLang = rdOnLang(() => { if (DEAD) return; rdFill(ROOT); if (RAW) { buildModel(RAW); render(true); } });
  return {
    setRack(rack) { rdForceLang(rack?.display?.lang); RAW = escDeep(rack); rack = RAW; setTimeout(nightCheck, 0); HIST.want.clear(); DISC.clear(); buildModel(rack); computeWatch(); render(true); loadHistory(true); loadEvents(); },
    setHass(h) {
      HASS = h; rdSetLang(h);
      if (!RAW) return;
      // nur neu zeichnen, wenn sich ein Zustand des Racks geändert hat (max. alle 2 s)
      let changed = false;
      for (let i = 0; i < WATCH.length; i++) { const s = h.states[WATCH[i]]; if (s !== seen[i]) { seen[i] = s; changed = true; } }
      if (!changed) return;
      recordLive(h);
      const go = () => { pending = null; if (HOLD) { pending = setTimeout(go, 500); return; } lastRender = Date.now(); buildModel(RAW); render(); };
      if (Date.now() - lastRender > 2000) go(); else if (!pending) pending = setTimeout(go, 2000);
    },
    // Für die Editor-Vorschau: Gerät von außen anzeigen (null = Übersicht)
    select(id) { IDLE_OFF = true; const g = id && byId(id); S.sel = g ? selOf(g) : null; S.port = null; if (g && ZERO_U.includes(g)) { S.side = "rear"; S.door = false; } render(); },
    // Editor: nach jedem Zeichnen der Detailansicht aufrufen (Bearbeitungsgriffe), Aktualisieren während Ziehen anhalten
    onPanel(fn) { EDIT_HOOK = fn; },
    // Editor-Bibliothek: ein Modul für ein Gerät in einen Behälter zeichnen (inkl. Kurven); false = keine Daten
    renderBlockInto(el, id, b) {
      b = escDeep(b);
      const d = id === "__ov" ? ovModel() : byId(id); if (!d) return false;
      const html = b.type === "header" ? headCard(d) : BLOCK_RENDER[b.type]?.(d, b); if (!html) { el.innerHTML = ""; return false; }
      const start = CHARTS.length; el.innerHTML = html;
      el.querySelectorAll(".cw").forEach(c => { const f = CHARTS[+c.dataset.ci]; if (+c.dataset.ci >= start && f) c.innerHTML = f(Math.max(120, c.clientWidth), Math.max(24, c.clientHeight || 40)); });
      CHARTS.length = start; return true;
    },
    hold(v) { HOLD = !!v; },
    destroy() { DEAD = true; offLang(); clearInterval(timer); clearInterval(idleTimer); clearInterval(liveTimer); clearInterval(histTimer); clearTimeout(pending); ro.disconnect(); },
  };
}

/* ---------- Anzeigegröße: Rack in fester Display-Fläche, passend skaliert (oder ganze Fläche) ---------- */
// Anzeige-Geometrie: Auflösung + Diagonale → Skalierung (gleiche Schriftgröße in mm wie auf dem 7"-Pi) und Raster der Detailansicht
const RD_INCH = { "pi-portrait": 7, "pi-landscape": 7, hd: 10.1, "hd-portrait": 10.1, fhd: 23.8, tablet: 9.7, custom: 15.6 };
function rdGeometry(disp = {}) {
  const D = rdCatalog().displays, p = D.find(x => x.key === (disp.preset || "pi-portrait")) || D[0];
  if (p.key === "fill") return { fill: true, key: "fill", frows: 14 };
  const w = p.key === "custom" ? Math.max(320, +disp.w || 480) : p.w || 480, h = p.key === "custom" ? Math.max(320, +disp.h || 800) : p.h || 800;
  const inch = +disp.inch || p.inch || RD_INCH[p.key] || 7, dpi = Math.hypot(w, h) / inch;
  const zoom = disp.scale ? disp.scale / 100 : Math.max(0.75, Math.min(3, Math.round(dpi / 133 * 20) / 20));
  const lw = Math.round(w / zoom), lh = Math.round(h / zoom);
  // Fläche der Detailansicht: hochkant die ganze Breite, quer nur rechts neben dem Rack; oben die Titelzeile
  const aw = lw > lh * 1.1 ? lw * 0.62 : lw, ah = lh - 50;
  const cols = Math.max(2, Math.min(16, Math.round(aw / 115))), rows = Math.max(3, Math.min(16, Math.round(ah / 95)));
  // Feines Raster für eigene Layouts: 12 Spalten wie bei HA, Zeilen à ca. 50 px
  const frows = Math.max(6, Math.min(40, Math.round(ah / 50)));
  return { w, h, inch, dpi: Math.round(dpi), zoom, lw, lh, cols, rows, frows, key: `${cols}x${rows}` };
}
function rdFrame(stage, wrap, rack, fill) {
  const g = rdGeometry(rack?.display), isFill = fill || g.fill;
  stage.classList.toggle("framed", !isFill); wrap.classList.toggle("framed", !isFill);
  wrap.style.width = isFill ? "" : `${g.lw}px`; wrap.style.height = isFill ? "" : `${g.lh}px`;
  wrap._fw = g.lw; wrap._fh = g.lh;
  const fit = () => { if (!wrap.classList.contains("framed")) return; const s = Math.min(stage.clientWidth / wrap._fw, stage.clientHeight / wrap._fh); if (s > 0) wrap.style.setProperty("--s", s.toFixed(4)); };
  if (!stage._ro) { stage._ro = new ResizeObserver(fit); stage._ro.observe(stage); }
  fit();
}

/* ---------- Web-Komponenten ---------- */
// Liefert true, wenn auf dem Server eine neuere Fassung liegt als die geladene
async function rdNewVersion() {
  try { const r = await fetch(`${RD_BASE}/version.txt`, { cache: "no-store" }); const v = r.ok ? (await r.text()).trim() : ""; return !!v && v !== RD_VERSION; }
  catch (e) { return false; }
}
const RD_HTML = `

<div class="app">
  <div class="rack-col">
    <div class="rack" id="rack">
      <div class="frame" aria-hidden="true">
        <div class="cap" id="cap"></div><div class="vent"></div>
        <div class="pdu"></div>
        <div class="rail l"></div><div class="rail r"></div>
        <div class="sticker" style="left:3.6%;top:40%"></div><div class="sticker" style="left:3.6%;top:44%"></div><div class="sticker" style="left:3.6%;top:63%"></div>
        <div class="sticker" style="right:3%;top:40%"></div><div class="sticker" style="right:3%;top:63%"></div>
        <div class="cable" style="left:7.6%;top:12%"></div><div class="cable" style="left:7.6%;top:82%"></div><div class="cable" style="right:5%;top:30%"></div>
        <div class="plinth"></div>
      </div>
      <div class="unums" id="unums"></div>
      <div class="bay" id="bay"></div>
      <div class="door" aria-hidden="true">
        <div class="sheet" id="sheet"></div>
        <div class="top st"></div>
        <div class="lbl st"><span class="l1" id="doorL1"></span><span class="l2" id="doorL2"></span></div>
        <div class="win"></div>
        <div class="handle st"></div>
        <div class="bot st"></div>
        <div class="badge" id="badge"></div>
        <div class="plate" id="plate"></div>
      </div>
      <canvas class="wled-glow" id="wledCanvas" aria-hidden="true"></canvas>
      <div class="hits" id="hits"></div>
      <button class="pdu-hit" id="pduHit" data-id="pdu" data-i18n-label="pdu_rear_label" hidden></button>
    </div>
    <div class="rack-meta">
      <div class="seg" role="group" data-i18n-label="door">
        <button id="doorClosed" aria-pressed="true" data-i18n="door_closed"></button>
        <button id="doorOpen" aria-pressed="false" data-i18n="door_open"></button>
        <button id="sideRear" aria-pressed="false" data-i18n="rear"></button>
      </div>
    </div>
  </div>
  <main class="panel" id="panel"></main>
</div>

`;

class RackDisplayElement extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  // Vor der Definition gesetzte Werte (HA ist schneller als der asynchrone Lader) an die Setter weiterreichen
  connectedCallback() { for (const k of ["narrow", "route", "panel", "hass"]) if (Object.prototype.hasOwnProperty.call(this, k)) { const v = this[k]; delete this[k]; this[k] = v; } }
  // Ändert sich die Karten-Konfiguration (Formular im Dashboard), die Anzeige damit neu aufbauen
  setConfig(config) { this._config = config || {}; if (this._started && this._app) { this.disconnectedCallback(); if (this._hass) this.hass = this._hass; } }
  _applyDark() { if (!this._wrap) return; const dk = !!this._hass?.themes?.darkMode || this._wrap.classList.contains("night"); this._wrap.classList.toggle("dark", dk); this._stage?.classList.toggle("dark", dk); }
  getCardSize() { return 12; }
  set narrow(v) {} set route(v) {} set panel(v) {}
  set hass(h) {
    this._hass = h; rdSetLang(h);
    if (!this._started) { this._started = true; this._start(); }
    else if (this._app) this._app.setHass(h);
    if (this._wrap) { this._applyDark(); }
  }
  async _start() {
    const isCard = this.tagName.toLowerCase() === "rack-display-card";
    // Anzeigegröße kommt aus dem Rack (Editor → Anzeige), Standard: Pi-Display hochkant 480 × 800, passend skaliert.
    // Karte mit layout: fill nutzt immer die ganze verfügbare Fläche.
    this.shadowRoot.innerHTML = `<link rel="stylesheet" href="${RD_BASE}/rack-display.css?v=${RD_VERSION}"><div class="stage"><div class="rd ${isCard ? "as-card" : ""}">${RD_HTML}</div></div>`;
    this._wrap = this.shadowRoot.querySelector(".rd");
    this._stage = this.shadowRoot.querySelector(".stage");
    rdFrame(this._stage, this._wrap, null, (this._config?.layout === "fill" || this._config?.view === "rack"));
    if (/touchkio|electron/i.test(navigator.userAgent)) this._wrap.classList.add("lite");
    this._applyDark(); this._wrap.addEventListener("rd-night", () => this._applyDark());
    this.style.height = isCard ? (this._config?.height || 720) + "px" : "100dvh";
    const app = this._app = createApp(this.shadowRoot, this._wrap);
    // Karte mit view: rack – nur Rack + Kopfzeile (mehrere Racks nebeneinander im Dashboard); Antippen öffnet das Gerät auf der Seite „Rack“
    if (isCard && this._config?.view === "rack") {
      this._wrap.classList.add("rack-only");
      if (!this._rackClick) this.shadowRoot.addEventListener("click", this._rackClick = e => { if (this._config?.view !== "rack") return; const h = e.target.closest?.(".hits [data-id], #pduHit"); if (!h) return; e.stopPropagation(); e.preventDefault();
        history.pushState(null, "", `/rack?rack=${encodeURIComponent(this._rackId || "")}&sel=${encodeURIComponent(h.dataset.id)}`); window.dispatchEvent(new CustomEvent("location-changed")); }, true);
    }
    // Seite „Rack“ / Kiosk: nach einem Update der Integration selbst neu laden (Karten in Dashboards nicht)
    if (!isCard) this._vt = setInterval(() => rdNewVersion().then(v => v && location.reload()), 3 * 60e3);
    this._app.setHass(this._hass);
    await this._load();
    const unsub = await this._hass.connection.subscribeMessage(() => this._app && this._load(), { type: "rack_display/subscribe" });
    // Foto-Adressen sind signiert und laufen ab: einmal am Tag frisch laden (Kiosk läuft oft tagelang)
    clearInterval(this._rt); this._rt = setInterval(() => this._app && this._load(), 24 * 3600e3);
    if (this._app === app) this._unsub = unsub; else unsub();  // während des Starts geschlossen oder neu aufgebaut
  }
  async _load() {
    const r = await this._hass.connection.sendMessagePromise({ type: "rack_display/racks" });
    if (!this._app) return;
    const want = this._config?.rack_id || new URLSearchParams(location.search).get("rack");   // /rack?rack=<id> zeigt ein anderes Rack
    const rack = r.racks.find(x => x.id === want) || r.racks[0];
    if (rack) { this._rackId = rack.id; rdFrame(this._stage, this._wrap, rack, (this._config?.layout === "fill" || this._config?.view === "rack")); this._app.setRack(rack);
      // /rack?sel=<Gerät> öffnet direkt das Popup (z. B. aus einer Rack-Karte im Dashboard)
      const sel = !this._selDone && new URLSearchParams(location.search).get("sel"); this._selDone = true; if (sel) setTimeout(() => this._app?.select(sel), 300); }
    else this._wrap.innerHTML = `<p style="padding:24px">${TR("no_rack_created_yet")}${this._hass.user?.is_admin ? ` <a href="/rack-editor" style="color:var(--primary-color)">${TR("open_the_rack_editor")}</a>` : ""}</p>`;
  }
  disconnectedCallback() {
    this._app?.destroy(); this._unsub?.(); this._stage?._ro?.disconnect(); clearInterval(this._vt); clearInterval(this._rt);
    this._app = null; this._unsub = null; this._started = false;
  }
}
class RackDisplayPanel extends RackDisplayElement {}
class RackDisplayCard extends RackDisplayElement {
  // Karten-Auswahl im Dashboard: Vorgabe und Formular statt reinem YAML
  static getStubConfig() { return {}; }
  static getConfigForm() {
    // Sprache des HA-Benutzers (das Formular kann erscheinen, bevor eine Karte Daten bekommen hat)
    rdSetLang(document.querySelector("home-assistant")?.hass || { language: RD_USER });
    const L = { rack_id: TR("card_rack_id"), view: TR("card_view"), height: TR("card_height"), full: TR("card_view_full"), rack: TR("card_view_rack") };
    return {
      schema: [
        { name: "rack_id", selector: { text: {} } },
        { name: "view", selector: { select: { mode: "dropdown", options: [{ value: "full", label: L.full }, { value: "rack", label: L.rack }] } } },
        { name: "height", selector: { number: { min: 200, max: 2000, step: 10, mode: "box", unit_of_measurement: "px" } } },
      ],
      computeLabel: s => L[s.name],
    };
  }
}
if (!customElements.get("rack-display-panel")) customElements.define("rack-display-panel", RackDisplayPanel);
if (!customElements.get("rack-display-card")) customElements.define("rack-display-card", RackDisplayCard);
window.customCards = window.customCards || [];
if (!window.customCards.find(c => c.type === "rack-display-card")) {
  window.customCards.push({ type: "rack-display-card", name: "Rack Display", description: "Server rack with live values" });
}

// Für den Editor: Anzeige-Kern als Vorschau wiederverwenden
window.__rackDisplay = { rdSkeleton, rdT, rdObserve, rdSetLang, rdForceLang, rdLoc, createApp, RD_HTML, RD_BASE, RD_VERSION, get RD_CATALOG() { return rdCatalog(); }, TR, rdOnLang, rdNewVersion, rdFrame, rdGeometry };
