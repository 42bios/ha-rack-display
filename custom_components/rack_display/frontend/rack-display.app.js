/* Rack Display – Oberfläche für Panel, Karte und Kiosk.
   Dieser Teil ist neu geschrieben (Daten aus Home Assistant). Die Darstellungsfunktionen
   (Rack, Fronten, Kacheln, Diagramme) werden beim Build aus dem Prototyp eingesetzt: 
*/
const RD_BASE = "/rack_display/frontend";
const RD_VERSION = "1792961465";
const RD_CATALOG = {"version": 1, "blocks": {"header": {"name": "Kopf", "size": "full", "desc": "Name, Modell, Position, Frontbild, bis zu 4 Kennzahlen", "items": true, "group": "kopf"}, "tiles": {"name": "Aktuelle Werte", "size": "full", "desc": "Kacheln mit den wichtigsten Messwerten", "group": "werte"}, "values": {"name": "Werte", "size": "full", "desc": "Beliebige Entitäten als Kacheln", "items": true, "group": "werte"}, "entity": {"name": "Einzelwert", "size": "half", "desc": "Ein Wert als eigene Kachel – wahlweise mit 24-Std.-Kurve", "items": true, "group": "werte"}, "bars": {"name": "Balken", "size": "half", "desc": "Auslastung als Balken (0–100 % oder eigener Bereich)", "items": true, "group": "werte"}, "status": {"name": "Status", "size": "half", "desc": "Zustände als Liste mit Ampel", "items": true, "group": "zustand"}, "ports": {"name": "Ports", "size": "full", "desc": "Alle Ports mit Geschwindigkeit, PoE und Live-Durchsatz", "group": "netzwerk"}, "poe": {"name": "PoE", "size": "half", "desc": "PoE-Leistung gesamt und je Port", "group": "netzwerk"}, "system": {"name": "System", "size": "half", "desc": "CPU, RAM und Temperatur über 24 Std.", "slots": ["cpu", "ram", "cpu_temp"], "group": "system"}, "internet": {"name": "Internet", "size": "half", "desc": "Download und Upload über 24 Std.", "slots": ["wan_down", "wan_up"], "group": "netzwerk"}, "flow": {"name": "Energiefluss", "size": "full", "desc": "Online-USV: Netz, Akku, Last", "group": "strom"}, "voltage": {"name": "Spannung", "size": "half", "desc": "Ein- und Ausgangsspannung über 24 Std.", "slots": ["input_voltage", "output_voltage"], "group": "strom"}, "chart": {"name": "Verlauf", "size": "half", "desc": "Ein bis drei Messwerte über 24 Std.", "slots": ["source"], "items": true, "group": "diagramme"}, "outlets": {"name": "Ausgänge", "size": "full", "desc": "Ausgänge einer Stromleiste mit Belegung", "group": "strom"}, "disks": {"name": "Festplatten", "size": "full", "desc": "Schächte, Zustand und Belegung", "group": "speicher"}, "recording": {"name": "Aufnahme", "size": "half", "desc": "Speicherdauer, Aufnahmearten, Kameras", "group": "speicher"}, "messages": {"name": "Meldungen", "size": "full", "desc": "Störungen, Hinweise und Infos des Geräts", "group": "sonstiges"}, "note": {"name": "Notiz", "size": "full", "desc": "Freier Text, z. B. Belegung eines Patchfelds", "group": "sonstiges"}, "gauge": {"name": "Tacho", "size": "half", "desc": "Ein Wert als Halbkreis-Anzeige mit Min/Max und Warnfarben", "items": true, "group": "werte"}, "ring": {"name": "Ring", "size": "half", "desc": "Ein Wert als Ring (z. B. Auslastung in %)", "items": true, "group": "werte"}, "stat": {"name": "Kennzahl", "size": "half", "desc": "Große Zahl mit Veränderung gegenüber gestern", "items": true, "group": "werte"}, "progress": {"name": "Fortschritt", "size": "half", "desc": "Ein Wert als Balken mit Min/Max", "items": true, "group": "werte"}, "histogram": {"name": "Balkendiagramm", "size": "half", "desc": "Stundenwerte der letzten 24 Std. als Balken", "items": true, "group": "diagramme"}, "chips": {"name": "Status-Chips", "size": "full", "desc": "Mehrere Zustände kompakt als Chips mit Ampel", "items": true, "group": "zustand"}, "switch": {"name": "Schalter", "size": "half", "desc": "Schalter, Lichter, Lüfter direkt bedienen", "items": true, "group": "steuerung"}, "button": {"name": "Aktionen", "size": "half", "desc": "Skripte, Szenen und Tasten auslösen", "items": true, "group": "steuerung"}, "camera": {"name": "Kamera", "size": "half", "desc": "Standbild einer Kamera (aktualisiert sich laufend)", "items": true, "group": "speicher"}, "heading": {"name": "Überschrift", "size": "full", "desc": "Titel mit Untertitel zum Gliedern", "group": "sonstiges"}, "clock": {"name": "Uhr", "size": "half", "desc": "Uhrzeit und Datum", "group": "sonstiges"}, "ov_power": {"name": "Strom (Übersicht)", "size": "full", "desc": "Leistung des Racks, USV-Akku, Verbraucher und 24-Std.-Verlauf", "group": "uebersicht"}, "ov_temp": {"name": "Temperatur (Übersicht)", "size": "full", "desc": "Wärmstes Gerät und Temperaturen aller Geräte", "group": "uebersicht"}, "ov_hints": {"name": "Hinweise (Übersicht)", "size": "full", "desc": "Warnungen und Störungen aller Geräte", "group": "uebersicht"}, "ov_stats": {"name": "Kennzahlen-Leiste", "size": "full", "desc": "Internet, PoE, Stromleiste, USV auf einen Blick", "group": "uebersicht"}, "bays": {"name": "Laufwerksschächte", "size": "full", "desc": "Schächte mit Parität, Daten und Cache, Temperatur, Belegung und Ruhezustand", "items": true, "group": "speicher"}, "array": {"name": "Array", "size": "half", "desc": "Belegung, Zustand, Cache-Pools und Parität eines Arrays", "items": true, "group": "speicher"}, "batteries": {"name": "Akkus", "desc": "Akkustände mehrerer Geräte als Liste, schwache zuerst", "group": "zustand", "items": true, "size": "half", "layout": {"w": 6, "h": 3}, "min_layout": {"w": 3, "h": 2}, "suggest": {"domain": "sensor", "device_class": "battery"}, "options": [{"key": "warn", "label": "Warnung unter (%)", "type": "number", "default": 25}, {"key": "alert", "label": "Kritisch unter (%)", "type": "number", "default": 10}, {"key": "sort", "label": "Sortierung", "type": "select", "default": "low", "choices": [["low", "Schwache zuerst"], ["name", "Nach Name"]]}], "author": "@42bios", "community": true}}, "templates": {"gw": ["header", "ports", "internet", "system", "messages"], "switch": ["header", "ports", "poe", "system", "messages"], "sfp": ["header", "ports", "poe", "system", "messages"], "nvr": ["header", "disks", "recording", "system", "messages"], "fanpanel": ["header", "tiles", "system", "messages"], "server": ["header", "tiles", "system", "messages"], "ups": ["header", "flow", {"type": "chart", "source": "load", "label": "Last"}, "voltage", "messages"], "pdu": ["header", "outlets", {"type": "chart", "source": "power", "label": "Gesamtleistung"}, {"type": "chart", "source": "current", "label": "Strom", "color": "--teal", "dec": 1, "warn": 13}, "messages"], "generic": ["header", "tiles", "messages"], "passive": ["header", "note"]}, "passive_templates": ["patch", "ks", "lwl", "cm", "bl", "blank", "frame"], "displays": [{"key": "pi-portrait", "name": "7\" Pi-Display hochkant", "w": 480, "h": 800, "inch": 7}, {"key": "pi-landscape", "name": "7\" Pi-Display quer", "w": 800, "h": 480, "inch": 7}, {"key": "hd", "name": "HD 1280 × 720", "w": 1280, "h": 720, "inch": 10.1}, {"key": "hd-portrait", "name": "HD hochkant 720 × 1280", "w": 720, "h": 1280, "inch": 10.1}, {"key": "fhd", "name": "Full HD 1920 × 1080", "w": 1920, "h": 1080, "inch": 23.8}, {"key": "tablet", "name": "Tablet 1024 × 768", "w": 1024, "h": 768, "inch": 9.7}, {"key": "custom", "name": "Eigene Größe"}, {"key": "fill", "name": "Nur Dashboard – ganze Fläche nutzen"}], "groups": {"uebersicht": "Übersicht", "kopf": "Kopf", "werte": "Werte & Anzeigen", "diagramme": "Diagramme", "zustand": "Zustand", "steuerung": "Steuerung", "netzwerk": "Netzwerk", "system": "System", "strom": "Strom & USV", "speicher": "Speicher & Video", "sonstiges": "Text & Sonstiges"}};
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
   Deutsch ist die Quellsprache der Oberfläche. Für andere Sprachen übersetzt ein Beobachter jeden neu
   gezeichneten Text (und title/aria-label/placeholder) über ein Wörterbuch; Texte mit Zahlen über Muster.
   Fehlende Einträge bleiben deutsch. Bei Deutsch läuft nichts davon (keine Kosten auf dem Pi). */
let RD_LANG = "de";
const rdIsDe = () => RD_LANG.startsWith("de");
const rdLoc = () => rdIsDe() ? "de-DE" : RD_LANG.startsWith("en") ? "en-GB" : RD_LANG;
// Sprache: fest im Rack eingestellt (Anzeige → Sprache) oder die des HA-Benutzers (z. B. Kiosk-Benutzer auf dem Pi)
let RD_FORCE = "", RD_USER = "de";
function rdApply() { const l = RD_FORCE || RD_USER; if (l === RD_LANG) return; RD_LANG = l; RD_OBS.forEach(r => rdIsDe() ? rdRestore(r) : rdTrNode(r)); }
// Übersetzte Texte merken sich ihr Original, damit ein Wechsel zurück auf Deutsch ohne Neuzeichnen geht
const RD_ORIG = new WeakMap(), RD_ORIG_ATTR = new WeakMap();
function rdRestore(root) {
  const els = root.nodeType === 1 ? [root, ...root.querySelectorAll("*")] : [...root.querySelectorAll("*")];
  for (const el of els) {
    const oa = RD_ORIG_ATTR.get(el); if (oa) { for (const [a, v] of Object.entries(oa)) el.setAttribute(a, v); RD_ORIG_ATTR.delete(el); }
    for (const c of el.childNodes) if (c.nodeType === 3 && RD_ORIG.has(c)) { c.nodeValue = RD_ORIG.get(c); RD_ORIG.delete(c); }
  }
}
function rdSetLang(h) { RD_USER = String(h?.locale?.language || h?.language || "de").toLowerCase(); rdApply(); }
function rdForceLang(l) { RD_FORCE = l ? String(l).toLowerCase() : ""; rdApply(); }
const RD_EN = {"Tür zu": "Door closed", "Tür offen": "Door open", "Rückseite": "Rear", "Tür": "Door", "Serverrack": "Server rack", "Zurück zur Übersicht": "Back to overview", "Zurück": "Back", "Strom": "Power", "heute": "today", "Akku": "Battery", "Netzbetrieb": "On mains", "Leistung 24 Std.": "Power · 24 h", "Temperatur": "Temperature", "wärmstes Gerät": "warmest device", "Wärmstes Gerät": "Warmest device", "Gerätetemperaturen · keine Rack-Sensoren": "Device temperatures · no rack sensors", "Gerätetemperaturen": "Device temperatures", "Gerät": "Device", "Hinweise": "Notices", "Hinweis": "Notice", "1 Hinweis": "1 notice", "Keine Daten": "No data", "Keine Werte": "No values", "Noch kein Home-Assistant-Gerät verknüpft": "No Home Assistant device linked yet", "Antwortzeit": "Latency", "Stromleiste": "PDU", "USV": "UPS", "jetzt": "now", "Normal": "Normal", "Warm": "Warm", "Zu heiß": "Too hot", "In Ordnung": "OK", "Störung": "Fault", "Störungen": "Faults", "1 Störung": "1 fault", "Warnung": "Warning", "Passiv": "Passive", "Aus": "Off", "Läuft": "Running", "läuft": "running", "Gestoppt": "Stopped", "Inaktiv": "Inactive", "Aktiv": "Active", "aktiv": "active", "Ausgeschaltet": "Switched off", "Aus seit": "Off since", "Zustand": "State", "Status": "Status", "Problem": "Problem", "ohne Problem": "no problem", "OK": "OK", "✓ OK": "✓ OK", "Alles in Ordnung": "All good", "meldet ein Problem": "reports a problem", "Alle Sensoren sind nicht verfügbar": "All sensors are unavailable", "Noch kein Rack angelegt.": "No rack created yet.", "Das Gerät läuft nicht dauerhaft.": "The device does not run permanently.", "Sobald es eingeschaltet wird, erscheinen die Werte hier automatisch.": "Values appear here automatically once it is switched on.", "Das Gerät läuft nicht dauerhaft. Sobald es eingeschaltet wird, erscheinen die Werte hier automatisch.": "The device does not run permanently. Values appear here automatically once it is switched on.", "⏻ Einschalten": "⏻ Power on", "Nochmal tippen": "Tap again", "Nochmal tippen zum Einschalten": "Tap again to power on", "⏻ Aus": "⏻ Off", "Server aus": "Server off", "Belegung, Cache und Parität erscheinen nach dem Einschalten.": "Usage, cache and parity appear after power-on.", "Passives Element ohne Sensoren. Im Editor der Integration lässt sich hier eine Belegung oder Notiz hinterlegen.": "Passive element without sensors. Assignments or notes can be added in the integration's editor.", "Uptime": "Uptime", "History": "History", "Verlauf": "History", "Meldungen": "Messages", "Auslastung": "Load", "Prozessor": "Processor", "Arbeitsspeicher": "Memory", "RAM": "RAM", "CPU": "CPU", "GPU": "GPU", "CPU-Temp.": "CPU temp.", "Temp.": "Temp.", "Temperaturen": "Temperatures", "Temperaturverlauf": "Temperature history", "Speicher": "Storage", "Netzwerk": "Network", "Internet": "Internet", "System": "System", "Durchsatz": "Throughput", "Download": "Download", "Upload": "Upload", "Clients": "Clients", "Ports": "Ports", "Aktive Ports": "Active ports", "Uplink": "Uplink", "Bündel": "Bundle", "Verbunden mit": "Connected to", "Nicht verbunden": "Not connected", "verbunden": "connected", "frei": "free", "Frei": "Free", "belegt": "used", "Belegt": "Used", "leer": "empty", "Gesamt": "Total", "Verfügbar": "Available", "Nicht verfügbar": "Unavailable", "Unbekannt": "Unknown", "An": "On", "Zuhause": "Home", "Abwesend": "Away", "Offen": "Open", "Geschlossen": "Closed", "Verbunden": "Connected", "Getrennt": "Disconnected", "Bereit": "Ready", "Nimmt auf": "Recording", "Streamt": "Streaming", "Spielt": "Playing", "Pausiert": "Paused", "Gestartet": "Started", "Platten fehlen": "Disks missing", "Ungültige Erweiterung": "Invalid expansion", "Paritätsprüfung": "Parity check", "Wird neu aufgebaut": "Rebuilding", "Wartung": "Maintenance", "Sicher": "Safe", "Unsicher": "Unsafe", "Neu, nicht zugewiesen": "New, unassigned", "Fehlt": "Missing", "Deaktiviert": "Disabled", "Ungültig": "Invalid", "Falsche Platte": "Wrong disk", "Emuliert": "Emulated", "abgeschlossen": "completed", "abgebrochen": "cancelled", "pausiert": "paused", "fehlgeschlagen": "failed", "nie ausgeführt": "never run", "Schächte": "Bays", "Intern": "Internal", "Parität": "Parity", "Daten": "Data", "Cache": "Cache", "blass = schläft": "faded = spun down", "schläft": "spun down", "Array": "Array", "Array gestoppt": "Array stopped", "Keine Belegung": "No usage", "Der Sensor liefert noch keine Größen.": "The sensor does not report sizes yet.", "Platten fehlen. Platten und Freigaben sind erst nach dem Start verfügbar.": "Disks missing. Disks and shares are available after the array starts.", "Fehlende Platten": "Missing disks", "Ungültige Platten": "Invalid disks", "Deaktivierte Platten": "Disabled disks", "Konfiguration": "Configuration", "Mover": "Mover", "Hardware": "Hardware", "Peripherie": "Peripheral", "Lüfter in U/min": "Fans in rpm", "Lüfter": "Fans", "U/min": "rpm", "Aufnahme": "Recording", "Dauer": "Continuous", "Bewegung": "Motion", "Erkennungen": "Detections", "Erkennungen heute": "Detections today", "Zeitraffer": "Timelapse", "Kameras": "Cameras", "Kamera": "Camera", "Kamera offline": "Camera offline", "Festplatten": "Disks", "Laufwerk": "Drive", "Zufriedenheit": "Satisfaction", "Gäste": "Guests", "Switches": "Switches", "APs": "APs", "Top-Client": "Top client", "WLAN-Kanalauslastung": "Wi-Fi channel utilisation", "Anbindung": "Connection", "Schnittstellen": "Interfaces", "Container": "Containers", "Steckplätze": "Slots", "Eingebaut": "Installed", "Reserve": "Runtime", "Last": "Load", "Eingang": "Input", "Ausgang": "Output", "Spannung": "Voltage", "Gleichrichter": "Rectifier", "Wechselrichter": "Inverter", "Bypass": "Bypass", "Bypass aktiv": "Bypass active", "Online-USV": "Online UPS", "Netz": "Mains", "Netz ↓": "Mains ↓", "Netz aus": "Mains off", "Schutz": "Protection", "Selbsttest": "Self-test", "Selbsttest bestanden": "Self-test passed", "bestanden": "passed", "Voll funktionsfähig": "Fully functional", "Optimal": "Optimal", "Akku wird geladen": "Battery charging", "lädt": "charging", "entlädt": "discharging", "Last hängt direkt am Netz": "Load runs directly on mains", "Netz ausgefallen, Last läuft aus dem Akku": "Mains failed, load runs on battery", "Netz ausgefallen: Die Last läuft aus dem Akku.": "Mains failed: the load runs on battery.", "Der Strom läuft immer über Akku und Wechselrichter. Fällt das Netz aus, gibt es keine Umschaltzeit.": "Power always flows through battery and inverter. If mains fails there is no transfer time.", "Alles versorgt": "Everything powered", "Ausgänge": "Outlets", "Aktuell": "Current", "Aktuelle Werte": "Current values", "Spitze": "Peak", "Monat": "Month", "letzte Stunde": "last hour", "max.": "max.", "max": "max", "Neu gestartet": "Restarted", "Nicht erreichbar": "Unreachable", "Gerät ist nicht im Netzwerk": "Device is not on the network", "Firmware wird installiert": "Installing firmware", "Firmware-Update verfügbar": "Firmware update available", "Wird eingerichtet": "Setting up", "Wird übernommen": "Adopting", "Überhitzung gemeldet": "Overheating reported", "Überhitzung": "Overheating", "Schaltzustand wird von der Stromleiste derzeit nicht korrekt gemeldet.": "The PDU currently does not report the switching state correctly.", "Rack-Thermosensor": "Rack thermal sensor", "Tage": "days", "Tag": "day", "Std.": "h", "24 Std.": "24 h", "Ø RAM": "Ø RAM", "Übrige": "Other", "ggü. gestern": "vs. yesterday", "Übersicht": "Overview", "Speicherdauer": "Retention", "Keine Temperaturwerte vorhanden.": "No temperature values available.", "Rückseite (0 HE)": "Rear (0 U)", "Ein": "On", "Hohe Temperatur": "High temperature", "Port": "Port", "Rack-Editor": "Rack editor", "Wird geladen …": "Loading …", "Rack wählen": "Choose rack", "Gerät bearbeiten": "Edit device", "Gerät wählen …": "Choose device …", "▦ Übersicht (Startseite)": "▦ Overview (home page)", "Neue Version · neu laden": "New version · reload", "Der Editor wurde aktualisiert": "The editor was updated", "Rückgängig (⌘Z)": "Undo (⌘Z)", "Wiederholen (⇧⌘Z)": "Redo (⇧⌘Z)", "Rückgängig": "Undo", "Ungespeicherte Änderungen": "Unsaved changes", "Gespeichert": "Saved", "Verwerfen": "Discard", "Speichern": "Save", "Eine Ebene zurück (Esc)": "Up one level (Esc)", "Rack": "Rack", "Geräte": "Devices", "Startseite neben dem Rack": "Home page next to the rack", "Passive Elemente": "Passive elements", "Antippen zum Bearbeiten. Im Rack rechts: ziehen zum Verschieben, ＋ zum Einsetzen.": "Tap to edit. In the rack on the right: drag to move, ＋ to insert.", "Name": "Name", "Höheneinheiten": "Rack units", "USV-Kapazität (W)": "UPS capacity (W)", "Tür & Beschriftung": "Door & labels", "Schild": "Badge", "z. B. Firmenname": "e.g. company name", "Typenschild": "Type plate", "Beschriftung oben": "Top label", "Beschriftung unten": "Bottom label", "Aussehen": "Appearance", "Gehäusefarbe": "Cabinet colour", "Hellgrau (Standard)": "Light grey (default)", "Weiß": "White", "Graphit": "Graphite", "Schwarz": "Black", "Eigene Farbe …": "Custom colour …", "Eigene Farbe": "Custom colour", "Lochgitter": "Perforated", "Glas": "Glass", "Blech": "Solid", "Ohne Tür": "No door", "Farbe Beschriftung": "Label colour", "Anzeige": "Display", "Darstellen auf": "Show on", "Zurück zur Übersicht nach": "Back to overview after", "nie": "never", "nach 30 Sekunden": "after 30 seconds", "nach 1 Minute": "after 1 minute", "nach 2 Minuten": "after 2 minutes", "nach 5 Minuten": "after 5 minutes", "Breite (px)": "Width (px)", "Höhe (px)": "Height (px)", "Diagonale (Zoll)": "Diagonal (inch)", "Skalierung": "Scaling", "Felder": "cells", "Die Ansicht wird für diese Fläche gebaut und überall (Seite „Rack“, Karten, Pi) passend skaliert. „Nur Dashboard“ nutzt immer die ganze verfügbare Fläche.": "The view is built for this area and scaled everywhere (“Rack” page, cards, Pi). “Dashboard only” always uses the whole available area.", "7\" Pi-Display hochkant": "7\" Pi display portrait", "7\" Pi-Display quer": "7\" Pi display landscape", "Full HD 1920 × 1080": "Full HD 1920 × 1080", "HD 1280 × 720": "HD 1280 × 720", "HD hochkant 720 × 1280": "HD portrait 720 × 1280", "Tablet 1024 × 768": "Tablet 1024 × 768", "Eigene Größe": "Custom size", "Nur Dashboard – ganze Fläche nutzen": "Dashboard only – use the whole area", "Gerät einsetzen": "Insert device", "erste freie Stelle von oben": "first free slot from the top", "Tipp: ＋ im Rack antippen, um die Höhe vorzugeben, oder eine Vorlage ins Rack ziehen.": "Tip: tap ＋ in the rack to choose the position, or drag a template into the rack.", "Server & Speicher": "Servers & storage", "Zubehör": "Accessories", "Gateway": "Gateway", "Switch": "Switch", "SFP-Switch": "SFP switch", "Patchfeld": "Patch panel", "LWL-Patchfeld": "Fibre patch panel", "Server 1 HE": "Server 1 U", "Server 2 HE": "Server 2 U", "Server 4 HE": "Server 4 U", "Rekorder": "Recorder", "Gerät allgemein": "Generic device", "Zusatzbatterie": "Battery pack", "Stromleiste (hinten)": "PDU (rear)", "Fachboden": "Shelf", "Modulrahmen": "Module frame", "Kabelführung": "Cable management", "Blende": "Blanking panel", "Server": "Server", "Server mit Lüfterblende": "Server with fan panel", "USV / Batterie": "UPS / battery", "Allgemein": "General", "Modell": "Model", "Vorlage": "Template", "Höhe (HE)": "Height (U)", "Position": "Position", "Vorne in HE": "Front in U", "Passiv (ohne Sensoren)": "Passive (no sensors)", "Nicht immer eingeschaltet": "Not always on", "Aus = grau, keine Warnungen": "Off = grey, no warnings", "„Aus“ erkennen über": "Detect “off” via", "automatisch (alle Werte weg)": "automatic (all values gone)", "Einschalt-Taste": "Power-on button", "– keine –": "– none –", "Gehört zu (z. B. Zusatzbatterie → USV)": "Belongs to (e.g. battery pack → UPS)", "– eigenständig –": "– standalone –", "Home Assistant": "Home Assistant", "verknüpft": "linked", "nicht verknüpft": "not linked", "Noch nicht verknüpft": "Not linked yet", "Nicht verknüpft": "Not linked", "Mit Home Assistant verknüpft": "Linked to Home Assistant", "Automatisch erkannt:": "Detected automatically:", "Weiteres Gerät verknüpfen": "Link another device", "Gerät suchen": "Search device", "Name, Modell oder Hersteller": "Name, model or manufacturer", "Kein Treffer": "No match", "Ausgänge benennen": "Name outlets", "Module": "Modules", "Fotos": "Photos", "Foto vorhanden": "Photo available", "Vorderseite": "Front", "Kein Foto": "No photo", "Hochladen": "Upload", "Entfernen": "Remove", "Senkrechtes Bild (in der Rückansicht)": "Vertical image (rear view)", "🗑 Entfernen": "🗑 Remove", "🗑 Gerät entfernen": "🗑 Remove device", "In anderes Rack übernehmen …": "Copy to another rack …", "Gerät samt Popup in ein anderes Rack übernehmen": "Copy device with its popup to another rack", "Raster belegt": "Grid used", "Neue Module aus der Bibliothek in der Mitte antippen oder ins Popup ziehen. Im Popup: ⋮⋮ verschieben, Ecke ziehen = Größe.": "Tap new modules in the library in the middle or drag them into the popup. In the popup: ⋮⋮ to move, drag the corner to resize.", "Die Startseite neben dem Rack ist ein Raster wie die Popups: Karten aus der Bibliothek hinzufügen, ⋮⋮ verschieben, an der Ecke skalieren, antippen für Einstellungen und Entitäten.": "The home page next to the rack is a grid like the popups: add cards from the library, ⋮⋮ to move, drag the corner to resize, tap for settings and entities.", "Standard wiederherstellen": "Restore default", "Eigene Übersicht entfernen": "Remove custom overview", "Zurück zur festen Standard-Übersicht": "Back to the fixed default overview", "Module suchen …": "Search modules …", "antippen oder ins Popup ziehen": "tap or drag into the popup", "Alle": "All", "Zuletzt benutzt": "Recently used", "Für dieses Gerät keine Daten": "No data for this device", "Entitäten nach dem Hinzufügen wählen": "Choose entities after adding", "Größe ändern": "Resize", "Verschieben": "Move", "Name eintippen": "Type a name", "Foto der Vorderseite hochladen": "Upload front photo", "📷 Foto": "📷 Photo", "Größe · Breite": "Size · width", "Darstellung": "Display style", "Titel": "Title", "Untertitel": "Subtitle", "optional": "optional", "z. B. Netzwerk": "e.g. Network", "Text": "Text", "Minimum": "Minimum", "Maximum": "Maximum", "Warnung ab": "Warning from", "Kritisch ab": "Critical from", "+ Entität": "+ Entity", "+ Kennzahl": "+ Key figure", "Entität suchen": "Search entity", "Name oder entity_id": "Name or entity_id", "Anzeigename": "Display name", "Noch keine Entität": "No entity yet", "Automatisch": "Automatic", "Kennzahlen oben (bis zu 4). Leer = automatisch (z. B. Uptime, Clients, Ports, Durchsatz).": "Key figures at the top (up to 4). Empty = automatic (e.g. uptime, clients, ports, throughput).", "Vorschläge von diesem Gerät": "Suggestions from this device", "Tippe, um alle Entitäten zu durchsuchen": "Type to search all entities", "dieses Gerät": "this device", "immer oben": "always on top", "Kacheln": "Tiles", "Kacheln mit 24-Std.-Kurve": "Tiles with 24 h curve", "Kompakt (Zeilen)": "Compact (rows)", "Hardware (Temperaturen + Lüfter)": "Hardware (temperatures + fans)", "Balken": "Bars", "Thermometer (Temperaturen)": "Thermometer (temperatures)", "Kurven-Kacheln": "Curve tiles", "Verfolgbarer Verlauf": "Trackable history", "Wert": "Value", "Wert mit 24-Std.-Kurve": "Value with 24 h curve", "Chips": "Chips", "Liste (Probleme zuerst)": "List (problems first)", "Schächte vorne": "Front bays", "Spalten": "Columns", "Cache-Laufwerke stecken in Schächten (sonst „Intern“)": "Cache drives sit in bays (otherwise “Internal”)", "Fertig": "Done", "🗑 Modul entfernen": "🗑 Remove module", "Modul verschoben": "Module moved", "Dort ist kein Platz – zurückgesetzt": "No room there – reverted", "Kein freier Platz": "No free space", "Vorne ist kein Platz frei": "No free space at the front", "Bild wird hochgeladen …": "Uploading image …", "Nach oben": "Up", "Nach unten": "Down", "Mein Rack": "My rack", "Schließen (Esc)": "Close (Esc)", "Alle ungespeicherten Änderungen verwerfen?": "Discard all unsaved changes?", "Ungespeicherte Änderungen gehen verloren. Trotzdem wechseln?": "Unsaved changes will be lost. Switch anyway?", "Ungespeicherte Änderungen gehen beim Neuladen verloren. Trotzdem neu laden?": "Unsaved changes will be lost when reloading. Reload anyway?", "Eigene Übersicht entfernen und zur Standard-Übersicht zurückkehren?": "Remove the custom overview and return to the default overview?", "Tippe auf eine freie Höheneinheit, um ein Gerät einzusetzen, oder auf ein Gerät, um es zu bearbeiten.": "Tap a free rack unit to insert a device, or a device to edit it.", "Werte als Kacheln": "Values as tiles", "Werte mit Kurven": "Values with curves", "Einzelwert": "Single value", "Einzelwert mit Kurve": "Single value with curve", "Kurven": "Curves", "Tacho": "Gauge", "Ring": "Ring", "Kennzahl": "Key figure", "Fortschritt": "Progress", "Balkendiagramm": "Bar chart", "Status-Chips": "Status chips", "Schalter": "Switches", "Aktionen": "Actions", "Überschrift": "Heading", "Uhr": "Clock", "Notiz": "Note", "Notiz – Text im Modulfenster eintragen": "Note – enter text in the module panel", "Abschnitt": "Section", "Kopf": "Header", "Rack Display": "Rack Display", "Server-Rack mit Live-Werten": "Server rack with live values", "Werte & Anzeigen": "Values & gauges", "Diagramme": "Charts", "Steuerung": "Controls", "Strom & USV": "Power & UPS", "Speicher & Video": "Storage & video", "Text & Sonstiges": "Text & other", "Werte": "Values", "Energiefluss": "Energy flow", "Laufwerksschächte": "Drive bays", "Kennzahlen-Leiste": "Key figure bar", "Strom (Übersicht)": "Power (overview)", "Temperatur (Übersicht)": "Temperature (overview)", "Hinweise (Übersicht)": "Notices (overview)", "Alle Ports mit Geschwindigkeit, PoE und Live-Durchsatz": "All ports with speed, PoE and live throughput", "Ausgänge einer Stromleiste mit Belegung": "Outlets of a PDU with assignments", "Auslastung als Balken (0–100 % oder eigener Bereich)": "Load as bars (0–100 % or custom range)", "Belegung, Zustand, Cache-Pools und Parität eines Arrays": "Usage, state, cache pools and parity of an array", "Beliebige Entitäten als Kacheln": "Any entities as tiles", "CPU, RAM und Temperatur über 24 Std.": "CPU, RAM and temperature over 24 h", "Download und Upload über 24 Std.": "Download and upload over 24 h", "Ein Wert als Balken mit Min/Max": "One value as a bar with min/max", "Ein Wert als Halbkreis-Anzeige mit Min/Max und Warnfarben": "One value as a semicircle gauge with min/max and warning colours", "Ein Wert als Ring (z. B. Auslastung in %)": "One value as a ring (e.g. load in %)", "Ein Wert als eigene Kachel – wahlweise mit 24-Std.-Kurve": "One value as its own tile – optionally with a 24 h curve", "Ein bis drei Messwerte über 24 Std.": "One to three measurements over 24 h", "Ein- und Ausgangsspannung über 24 Std.": "Input and output voltage over 24 h", "Freier Text, z. B. Belegung eines Patchfelds": "Free text, e.g. patch panel assignments", "Große Zahl mit Veränderung gegenüber gestern": "Big number with change vs. yesterday", "Internet, PoE, Stromleiste, USV auf einen Blick": "Internet, PoE, PDU, UPS at a glance", "Kacheln mit den wichtigsten Messwerten": "Tiles with the key measurements", "Leistung des Racks, USV-Akku, Verbraucher und 24-Std.-Verlauf": "Rack power, UPS battery, consumers and 24 h history", "Mehrere Zustände kompakt als Chips mit Ampel": "Several states as compact chips with traffic lights", "Name, Modell, Position, Frontbild, bis zu 4 Kennzahlen": "Name, model, position, front image, up to 4 key figures", "Online-USV: Netz, Akku, Last": "Online UPS: mains, battery, load", "PoE-Leistung gesamt und je Port": "PoE power in total and per port", "Schalter, Lichter, Lüfter direkt bedienen": "Control switches, lights and fans directly", "Schächte mit Parität, Daten und Cache, Temperatur, Belegung und Ruhezustand": "Bays with parity, data and cache, temperature, usage and spin-down", "Schächte, Zustand und Belegung": "Bays, state and usage", "Skripte, Szenen und Tasten auslösen": "Run scripts, scenes and buttons", "Speicherdauer, Aufnahmearten, Kameras": "Retention, recording types, cameras", "Standbild einer Kamera (aktualisiert sich laufend)": "Camera still image (refreshes continuously)", "Stundenwerte der letzten 24 Std. als Balken": "Hourly values of the last 24 h as bars", "Störungen, Hinweise und Infos des Geräts": "Faults, notices and info of the device", "Titel mit Untertitel zum Gliedern": "Title with subtitle for structure", "Uhrzeit und Datum": "Time and date", "Warnungen und Störungen aller Geräte": "Warnings and faults of all devices", "Wärmstes Gerät und Temperaturen aller Geräte": "Warmest device and temperatures of all devices", "Zustände als Liste mit Ampel": "States as a list with traffic lights", "CPU-Auslastung": "CPU load", "Speicherauslastung": "Memory usage", "Speicherplatzauslastung": "Disk usage", "Betriebszeit": "Uptime", "CPU-Temperatur": "CPU temperature", "PoE-Leistung": "PoE power", "Aufnahmekapazität": "Recording capacity", "1 Tag": "1 day", "Abbrüche": "drops", "WAN-Abbrüche": "WAN drops", "Breite": "Width", "Höhe": "Height", "Zeilen": "rows", "ganz": "full", "Zeile": "row", "Niedriger": "Lower", "Höher": "Taller", "Dafür ist im Raster kein Platz": "No room for that in the grid", "Sprache": "Language", "Automatisch (Sprache des HA-Benutzers)": "Automatic (HA user language)", "Verlust": "Loss", "Nummerierung": "Numbering", "zeilenweise (1 2 3 … nach rechts)": "by row (1 2 3 … to the right)", "spaltenweise (1 2 3 … nach unten)": "by column (1 2 3 … downwards)", "Platte → Schacht": "Disk → bay", "auto": "auto", "Leer = nächster freier Schacht. Doppelte Nummern: die erste Platte gewinnt.": "Empty = next free bay. Duplicate numbers: the first disk wins.", "Anzahl Steckplätze": "Number of slots", "eingebaut": "installed", "geplant": "planned", "Beschreibung, z. B. LAN · OLED": "Description, e.g. LAN · OLED", "Entität für Live-Wert (optional)": "Entity for live value (optional)", "Name eintragen belegt den Steckplatz; leeren gibt ihn frei. Mit Entität zeigt das Popup den aktuellen Wert.": "Entering a name occupies the slot; clearing it frees the slot. With an entity the popup shows its current value.", "HA-Entitäten anlegen": "Create HA entities", "Zustand, Störungen, Warnungen, wärmstes Gerät – für Automationen und Benachrichtigungen": "State, faults, warnings, hottest device – for automations and notifications", "Strompreis (€/kWh)": "Electricity price (€/kWh)", "oder Preis-Entität": "or price entity", "z. B. 0,30": "e.g. 0.30", "⇩ Exportieren": "⇩ Export", "⇧ Importieren": "⇧ Import", "Rack mit Geräten, Popups und Einstellungen als Datei sichern": "Save the rack with devices, popups and settings as a file", "Rack exportiert": "Rack exported", "Nachtmodus von": "Night mode from", "bis": "until", "Helligkeit nachts": "Brightness at night", "100 % (nur dunkel)": "100 % (dark only)", "Wärme": "Heat", "Wärmekarte": "Heat map", "Knopf „Wärme“ unter dem Rack färbt die Geräte nach Temperatur (ab zwei Geräten mit Temperaturwert)": "A “Heat” button below the rack colours devices by temperature (needs two devices with temperatures)", "Auf dem Fachboden": "On the shelf", "Cloud Key / kleiner Controller": "Cloud Key / small controller", "Mini-PC": "Mini PC", "kleines NAS": "small NAS", "Box allgemein": "Generic box", "Access Point": "Access point", "ist dieses Gerät (Zustand, LED)": "is this device (state, LED)", "＋ Gerät auf den Fachboden": "＋ Device on the shelf", "Kleingeräte, die auf der Ablage liegen. Das verknüpfte HA-Gerät zeigt seinen Zustand an der LED.": "Small devices lying on the shelf. The linked HA device shows its state on the LED.", "Zuordnung aus Entität (optional)": "Assignment from entity (optional)", "Entität liefert (noch) keine Zuordnung – manuelle Werte gelten": "Entity does not provide an assignment (yet) – manual values apply", "Liegend (Kacheln)": "Horizontal (tiles)", "Stehend (wie im Gehäuse)": "Vertical (like the enclosure)", "Bildschirm (TouchKio)": "Screen (TouchKio)", "– keiner –": "– none –", "Ausschalten nach": "Switch off after", "nie (immer an)": "never (always on)", "1 Minute": "1 minute", "2 Minuten": "2 minutes", "5 Minuten": "5 minutes", "10 Minuten": "10 minutes", "30 Minuten": "30 minutes", "Ohne Berührung schaltet HA den Bildschirm aus; eine Berührung schaltet ihn wieder ein.": "Without touch HA switches the screen off; a touch switches it back on.", "stehend: alle in einer Reihe": "vertical: all in one row", "Akkus": "Batteries", "Akkustände mehrerer Geräte als Liste, schwache zuerst": "Battery levels of several devices as a list, weakest first", "Warnung unter (%)": "Warning below (%)", "Kritisch unter (%)": "Critical below (%)", "Sortierung": "Sort order", "Schwache zuerst": "Weakest first", "Nach Name": "By name"};
const RD_EN_RE = [["^Neu gestartet mit Firmware (.+)$", "Restarted with firmware $1"], ["^Gestartet mit Firmware (.+)$", "Started with firmware $1"], ["^(\\d+) Zuordnungen aus der Entität · manuelle Werte gelten nur für Platten ohne Eintrag$", "$1 assignments from the entity · manual values only apply to disks without an entry"], ["^(\\d+) Geräte$", "$1 devices"], ["^auf Fachboden HE (.+)$", "on shelf U $1"], ["^Import fehlgeschlagen: (.+)$", "Import failed: $1"], ["^„(.+)“ als neues Rack anlegen\\?$", "Create “$1” as a new rack?"], ["^„(.+)“ importiert$", "“$1” imported"], ["^heute · ≈ (.+)$", "today · ≈ $1"], ["^≈ (.+) / Monat$", "≈ $1 / month"], ["^(\\d+) Zeilen$", "$1 rows"], ["^(\\d+) von 12 Spalten$", "$1 of 12 columns"], ["^(\\d+) × (\\d+) · in der Vorschau an der Ecke ziehen oder Pfeiltasten \\(⇧ = Größe\\)$", "$1 × $2 · drag the corner in the preview or use arrow keys (⇧ = size)"], ["^· (.+)$", "· $1"], ["^(\\d+) Tage$", "$1 days"], ["^(\\d+) Std\\.$", "$1 h"], ["^(\\d+) HE$", "$1 U"], ["^HE (\\d+(?:–\\d+)?)$", "U $1"], ["^ab HE (\\d+)$", "from U $1"], ["^(\\d+) HE · ab HE (\\d+)$", "$1 U · from U $2"], ["^(\\d+) HE · passt hier nicht$", "$1 U · does not fit here"], ["^(\\d+) von (\\d+) HE$", "$1 of $2 U"], ["^(\\d+) von (\\d+) belegt$", "$1 of $2 used"], ["^(\\d+) von (\\d+) belegt · (\\d+) geplant$", "$1 of $2 used · $3 planned"], ["^(\\d+) von (\\d+) verbunden$", "$1 of $2 connected"], ["^(\\d+) von (\\d+) Kameras$", "$1 of $2 cameras"], ["^(\\d+) Störungen$", "$1 faults"], ["^(\\d+) Hinweise$", "$1 notices"], ["^(\\d+) mit Problem$", "$1 with problems"], ["^(\\d+) warm$", "$1 warm"], ["^(\\d+) weitere$", "$1 more"], ["^\\+(\\d+) weitere$", "+$1 more"], ["^(\\d+) Geräte versorgt$", "$1 devices powered"], ["^(\\d+) Ausgänge$", "$1 outlets"], ["^(\\d+) Fehler$", "$1 errors"], ["^(\\d+) HE · (\\d+) belegt · (\\d+) aktive Geräte$", "$1 U · $2 used · $3 active devices"], ["^(.+) · (\\d+) HE · (\\d+) belegt · (\\d+) Elemente$", "$1 · $2 U · $3 used · $4 items"], ["^([\\d.,]+) % der USV-Kapazität · laut Stromleiste$", "$1 % of UPS capacity · via PDU"], ["^([\\d.,]+) % der USV-Kapazität$", "$1 % of UPS capacity"], ["^([\\d.,]+) % Last ·?$", "$1 % load"], ["^Auslastung der USV ([\\d.,]+) %$", "UPS load $1 %"], ["^USV-Akku (\\d+) Prozent, (\\d+) Minuten Reserve$", "UPS battery $1 percent, $2 minutes runtime"], ["^Wärmstes Gerät (\\d+) Grad$", "Warmest device $1 degrees"], ["^aktuell (.+)$", "currently $1"], ["^Grenze (.+)$", "Limit $1"], ["^Temperatur über (.+)$", "Temperature above $1"], ["^(.+) um (\\d+:\\d+)$", "$1 at $2"], ["^seit (.+)\\. Sobald es eingeschaltet wird, erscheinen die Werte hier automatisch\\.$", "since $1. Values appear here automatically once it is switched on."], ["^seit (.+)$", "since $1"], ["^Akku (.+)$", "Battery $1"], ["^Schacht (\\d+)$", "Bay $1"], ["^Intern (\\d+)$", "Internal $1"], ["^Platte (\\w+)$", "Disk $1"], ["^Parität (\\d+)$", "Parity $1"], ["^Cache (\\d+)$", "Cache $1"], ["^([\\d.,]+) % belegt$", "$1 % used"], ["^Lüfter \\((\\d+)\\)$", "Fans ($1)"], ["^Ø (.+) · Spitze (.+)$", "Ø $1 · peak $2"], ["^vor (\\d+) J\\. (\\d+) Mon\\.$", "$1 y $2 mo ago"], ["^vor (.+)$", "$1 ago"], ["^automatisch \\((.+)\\)$", "automatic ($1)"], ["^nach (\\d+) Sekunden$", "after $1 seconds"], ["^nach (\\d+) Minuten$", "after $1 minutes"], ["^Größe · Breite (\\d+) von 12, Höhe (\\d+) Zeilen$", "Size · width $1 of 12, height $2 rows"], ["^(\\d+) × (\\d+) · im Popup$", "$1 × $2 · in popup"], ["^von (\\d+) Zeilen$", "of $1 rows"], ["^von (\\d+) Zeilen – zu hoch$", "of $1 rows – too tall"], ["^(\\d+) × (\\d+) px · (\\d+) ppi · Raster der Detailansicht$", "$1 × $2 px · $3 ppi · detail view grid"], ["^(.+) · Für „(.+)“ noch keine Daten – nach dem Hinzufügen Entitäten im Modul wählen$", "$1 · No data for “$2” yet – choose entities in the module after adding"], ["^(.+) · schon im Popup$", "$1 · already in the popup"], ["^Größen wie im Popup, Vorschau mit den Daten von „(.+)“\\.$", "Sizes as in the popup, preview with data from “$1”."], ["^Welches Gerät an welchem Ausgang hängt, lässt sich im Rack-Editor beim Gerät „(.+)“ eintragen\\.$", "Which device is plugged into which outlet can be set in the rack editor on the device “$1”."], ["^„(.+)“ entfernt$", "“$1” removed"], ["^Modul „(.+)“ entfernt$", "Module “$1” removed"], ["^„(.+)“ hinzugefügt$", "“$1” added"], ["^„(.+)“ eingesetzt in HE (.+)$", "“$1” inserted at U $2"], ["^„(.+)“ eingesetzt \\(Rückseite\\)$", "“$1” inserted (rear)"], ["^„(.+)“ nach HE (\\d+)$", "“$1” moved to U $2"], ["^Größe (\\d+) × (\\d+)$", "Size $1 × $2"], ["^„(.+)“ in „(.+)“ übernommen$", "“$1” copied to “$2”"], ["^In „(.+)“ ist kein Platz für (\\d+) HE$", "No room for $2 U in “$1”"], ["^„(.+)“ in „(.+)“ ersetzen\\? Popup, Fotos und Verknüpfung werden übernommen, die Position dort bleibt\\.$", "Replace “$1” in “$2”? Popup, photos and link are copied, its position there stays."], ["^„(.+)“ samt Popup in „(.+)“ übernehmen\\?$", "Copy “$1” with its popup to “$2”?"], ["^Übernehmen fehlgeschlagen: (.+)$", "Copy failed: $1"], ["^Hochladen fehlgeschlagen: (.+)$", "Upload failed: $1"], ["^Nicht gespeichert: (.+)$", "Not saved: $1"], ["^Für (\\d+) HE ist an dieser Stelle kein Platz$", "No room for $1 U here"], ["^(\\d+) Gerät\\(e\\) passen nicht in (\\d+) HE:$", "$1 device(s) do not fit in $2 U:"], ["^(.+) einsetzen$", "Insert $1"], ["^HE (\\d+): Gerät einsetzen$", "U $1: insert device"], ["^(.+), HE (.+)$", "$1, U $2"], ["^(.+), Rückseite$", "$1, rear"], ["^Port (\\d+), (.+)$", "Port $1, $2"], ["^(.+) \\(Rückseite\\)$", "$1 (rear)"], ["^„(.+)“ aus dem Rack entfernen\\?$", "Remove “$1” from the rack?"], ["^Online-USV · (.+)$", "Online UPS · $1"], ["^WLED · (.+)$", "WLED · $1"], ["^von ([\\d.,]+ \\S+)$", "of $1"], ["^(.+) ·$", "$1 ·"]];
const RD_EN_RX = RD_EN_RE.map(([a, b]) => [new RegExp(a), b]);
// Einzelnen Text übersetzen (Leerraum am Rand bleibt erhalten)
function rdT(s) {
  if (rdIsDe() || !s) return s;
  const k = s.trim(); if (!k || !/[A-Za-zÄÖÜäöüß]/.test(k)) return s;
  let r = RD_EN[k];
  if (r == null) for (const [re, to] of RD_EN_RX) if (re.test(k)) { r = k.replace(re, (...m) => to.replace(/\$(\d)/g, (_, i) => rdT(m[+i]))); break; }
  // Zusammengesetzte Texte („Akku · normal“, „Patchfeld, HE 40“): Teile einzeln übersetzen
  if (r == null) for (const sep of [" · ", " – ", ", "]) {
    if (!k.includes(sep)) continue;
    const parts = k.split(sep); if (sep === ", " && parts.some(x => x.split(" ").length > 4)) continue;
    const tr = parts.map(x => rdT(x)); if (tr.some((x, i) => x !== parts[i])) { r = tr.join(sep); break; }
  }
  return r == null || r === k ? s : s.replace(k, r);
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
// Wurzel (Shadow Root) beobachten: alles, was neu gezeichnet wird, wird übersetzt
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
  let DEVICES = [], ZERO_U = [], PDU_IMG = "", RAW = null, HASS = null;
  let ARMED = null;
  const S = { sel: null, mode: "view", door: true, side: "front", port: null };
  const $ = id => ROOT.getElementById(id);
  const nf = { format: x => new Intl.NumberFormat(rdLoc()).format(x) };
  const css = v => getComputedStyle(WRAP).getPropertyValue(v).trim();
  const allDevices = () => [...DEVICES, ...ZERO_U];
  const members = id => DEVICES.filter(d => d.id === id || d.group === id).sort((a, b) => b.u - a.u);
  const selOf = d => d.group || d.id;
  const isSel = d => S.sel && selOf(d) === S.sel;
  const byId = id => allDevices().find(d => d.id === id);

  /* ---------- Werte aus Home Assistant ---------- */
  const st = id => (id && HASS ? HASS.states[id] : undefined);
  const ok = s => s && !["unknown", "unavailable", ""].includes(s.state);
  const num = id => { const s = st(id); if (!ok(s)) return null; const x = parseFloat(s.state); if (isNaN(x)) return null;
    const u = s.attributes.unit_of_measurement; return u === "kW" ? x * 1000 : x; };
  const round = (x, d = 0) => x == null ? null : Math.round(x * 10 ** d) / 10 ** d;
  const fmt = (x, d = 0) => x == null ? "–" : x.toLocaleString(rdLoc(), { maximumFractionDigits: d, minimumFractionDigits: d });
  const since = id => { const s = st(id); if (!ok(s)) return null;
    let sec; const x = parseFloat(s.state);
    if (s.attributes.unit_of_measurement === "s") sec = x; else { const t = Date.parse(s.state); if (isNaN(t)) return null; sec = (Date.now() - t) / 1000; }
    const d = Math.floor(sec / 86400); return d >= 1 ? `${d} ${d === 1 ? "Tag" : "Tage"}` : `${Math.floor(sec / 3600)} Std.`; };

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
      if (rest.length) {
        const res = await HASS.connection.sendMessagePromise({ type: "history/history_during_period", start_time: start.toISOString(), end_time: end.toISOString(),
          entity_ids: rest, minimal_response: true, no_attributes: true, significant_changes_only: false });
        for (const [id, rows] of Object.entries(res)) take(id, rows.map(r => [(r.lu ?? r.lc) * 1000, parseFloat(r.s)]).filter(p => !isNaN(p[1])));
      }
      ids.forEach(id => HIST.tried.add(id));
      HIST.last = Date.now();
    } catch (e) { console.warn("Rack Display: Historie nicht geladen", e); }
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
    if (dom === "update") return s === "on" ? "Firmware-Update verfügbar" : s === "off" ? `Auf ${st(id)?.attributes.installed_version || "neue Firmware"} aktualisiert` : null;
    if (dom === "device_tracker") return s === "home" ? `${d.name} ist wieder online` : s === "not_home" ? `${d.name} war offline` : null;
    if (dom === "binary_sensor" && /hitz|overheat/.test(id)) return s === "on" ? "Überhitzung gemeldet" : null;
    if (dom === "switch" && /_poe$/.test(id)) { const n = id.match(/_(\d+)_poe$/)?.[1]; return `PoE an Port ${n} ${s === "on" ? "eingeschaltet" : "ausgeschaltet"}`; }
    if (dom === "sensor" && /_(zustand|state)$/.test(id)) return { connected: "Verbunden", disconnected: "Getrennt", upgrading: "Firmware wird installiert", adopting: "Wird übernommen", provisioning: "Wird eingerichtet" }[s] || null;
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
  const whenTxt = ms => new Date(ms).toLocaleString(rdLoc(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(",", " um");

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
    const C = RD_CATALOG, key = r.passive || C.passive_templates.includes(r.template) ? "passive" : C.templates[r.template] ? r.template : "generic";
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
      return series.length ? { multi: true, style: b.style, label: b.label || "Verlauf", series } : null;
    }
    const id = entOf(b.items?.[0] || b.source, R);
    const s = st(id); if (!s) return null;
    HIST.want.add(id); if (b.style === "trace") HIST.fine.add(id);
    return { style: b.style, label: b.label || s.attributes.friendly_name || b.source, unit: s.attributes.unit_of_measurement || "", entity: id, base: num(id) || 0,
      color: b.color || "--blue", dec: b.dec ?? (Math.abs(num(id) || 0) < 10 ? 1 : 0), warn: b.warn };
  }

  // Kurzname: Entitätsname ohne Gerätenamen (vom Backend), sonst friendly_name
  let LABELS = {};
  const shortName = id => LABELS[id] || st(id)?.attributes.friendly_name || id.split(".")[1];
  const nameOf = (b, ref, id) => b?.names?.[ref] || b?.names?.[id] || shortName(id);
  const STATE_DE = { on: "An", off: "Aus", home: "Zuhause", not_home: "Abwesend", open: "Offen", closed: "Geschlossen", unavailable: "Nicht verfügbar", unknown: "Unbekannt", connected: "Verbunden", disconnected: "Getrennt", idle: "Bereit", recording: "Nimmt auf", streaming: "Streamt", playing: "Spielt", paused: "Pausiert", started: "Gestartet", stopped: "Gestoppt", too_many_missing_disks: "Platten fehlen", invalid_expansion: "Ungültige Erweiterung", parity_check: "Paritätsprüfung", rebuilding: "Wird neu aufgebaut", maintenance: "Wartung" };
  // Binärsensoren nach Geräteklasse in Klartext (Problem-Sensoren: OK/Problem statt Aus/An)
  const BIN_DE = { problem: ["OK", "Problem"], running: ["Gestoppt", "Läuft"], connectivity: ["Getrennt", "Verbunden"], power: ["Aus", "An"], safety: ["Sicher", "Unsicher"] };
  function valueOf(id) {
    const s = st(id); if (!s) return { v: "–", u: "" };
    const x = parseFloat(s.state), u = s.attributes.unit_of_measurement || "";
    if (!isNaN(x) && /^-?[\d.]+$/.test(s.state)) { if (u === "Mbit/s" && x >= 1000) return { v: fmt(x / 1000, x % 1000 ? 1 : 0), u: "Gbit/s", n: x };
      return { v: fmt(x, Math.abs(x) < 10 && x % 1 ? 1 : 0), u, n: x }; }
    const bin = id.startsWith("binary_sensor.") && (/_active$/.test(id) && s.attributes.device_class === "running" ? ["Inaktiv", "Aktiv"] : BIN_DE[s.attributes.device_class]); if (bin && (s.state === "on" || s.state === "off")) return { v: bin[s.state === "on" ? 1 : 0], u: "" };
    if (s.attributes.device_class === "timestamp") { const t = Date.parse(s.state); if (!isNaN(t)) {
      const sec = (Date.now() - t) / 1000;
      if (sec > 0) { const dd = Math.floor(sec / 86400); return dd >= 1 ? { v: fmt(dd), u: dd === 1 ? "Tag" : "Tage" } : { v: fmt(Math.floor(sec / 3600)), u: "Std." }; }
      return { v: new Date(t).toLocaleString(rdLoc(), { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }), u: "" }; } }
    return { v: STATE_DE[s.state] || (/^[a-z0-9]+(_[a-z0-9]+)+$/.test(s.state) ? s.state[0].toUpperCase() + s.state.slice(1).replace(/_/g, " ") : s.state), u: "" };
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
    if (!m) { d.state = "off"; d.msgs.push(["warn", "Keine Daten", "Noch kein Home-Assistant-Gerät verknüpft"]); d.noData = true; return d; }
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
        d.msgs.push(["ok", "Ausgeschaltet", since ? `seit ${new Date(since).toLocaleString(rdLoc(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : "wird bei Bedarf eingeschaltet"]);
        d.facts = [["Zustand", "Ausgeschaltet"], ...(since ? [["Aus seit", new Date(since).toLocaleString(rdLoc(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })]] : [])]; return d;
      }
    }
    // Zustand und Meldungen
    if (Object.values(R).length && Object.values(R).every(id => !ok(st(id)))) { d.state = "alert"; d.msgs.push(["alert", "Keine Werte", "Alle Sensoren sind nicht verfügbar"]); }
    const stt = /load_state$/.test(R.state || "") ? undefined : st(R.state);
    if (ok(stt) && !["connected", "online", "on", "home"].includes(stt.state)) { d.state = "alert"; d.msgs.push(["alert", "Nicht erreichbar", stt.state === "not_home" ? "Gerät ist nicht im Netzwerk" : `Zustand: ${stt.state}`]); }
    const tracker = R.state?.startsWith("device_tracker.") && ok(stt);
    for (const p of m.problems) if (st(p)?.state === "on") { d.state = "alert"; d.msgs.push(["alert", st(p).attributes.friendly_name || "Problem", "meldet ein Problem"]); }
    if (temp != null && temp >= TEMP_ALERT) { d.state = "alert"; d.msgs.push(["alert", `Temperatur über ${TEMP_ALERT} °C`, `aktuell ${fmt(temp)} °C`]); }
    else if (temp != null && temp >= TEMP_WARN) { if (d.state === "ok") d.state = "warn"; d.msgs.push(["warn", `Temperatur über ${TEMP_WARN} °C`, `aktuell ${fmt(temp)} °C`]); }
    if (st(R.firmware)?.state === "on") d.msgs.push(["ok", "Firmware-Update verfügbar", st(R.firmware).attributes.latest_version || ""]);
    // Kacheln (für Geräte ohne eigene Spezialansicht)
    const T = d.tiles;
    if (temp != null) T.push(["Temperatur", fmt(temp), "°C", null, temp >= TEMP_ALERT ? "alert" : temp >= TEMP_WARN ? "warn" : "", temp >= TEMP_WARN ? `Grenze ${TEMP_WARN} °C` : ""]);
    if (cpu != null) T.push(["Prozessor", fmt(cpu), "%", cpu]);
    if (ram != null) T.push(["Arbeitsspeicher", fmt(ram), "%", ram]);
    if (num(R.storage) != null) T.push(["Speicher", fmt(round(num(R.storage))), "%", round(num(R.storage))]);
    if (d.power != null) T.push(["Leistung", fmt(d.power), "W"]);
    if (num(R.clients) != null) T.push(["Clients", fmt(num(R.clients)), ""]);
    // Kopf-Fakten
    const facts = [];
    if (since(R.uptime)) facts.push(["Uptime", since(R.uptime)]);
    if (num(R.clients) != null) facts.push(["Clients", fmt(num(R.clients))]);
    if (num(R.latency) != null) facts.push(["Antwortzeit", `${fmt(num(R.latency))} ms`]);
    if (num(R.active_ports) != null) facts.push(["Aktive Ports", fmt(num(R.active_ports))]);
    if (tracker) {
      const on = stt.state === "home";
      T.push(["Netzwerk", on ? "Online" : "Offline", "", null, on ? "" : "alert"]);
      if (stt.attributes.ip) facts.push(["IP-Adresse", stt.attributes.ip]);
      if (stt.attributes.network) facts.push(["Netz", stt.attributes.network]);
      facts.push(["Anschluss", stt.attributes.is_wired === false ? "WLAN" : "Kabel"]);
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
      if (d.facts && d.facts.length < 4) { d.facts.push(["Durchsatz", `${rateK(d.traffic[0] + d.traffic[1]).replace(/ (.)$/, " $1bit/s")}`]); }
      if (R.poe_total && num(R.poe_total) != null) d.poe = { used: Math.round(num(R.poe_total)), budget: o.poe_budget || (/48.?poe/i.test(d.model) ? 600 : null) };
    }
    // USV
    if (R.battery) {
      // apc_rack_power ab 0.4 liefert Zustände als Text, ältere Versionen als RFC-1628-Zahl
      const srcText = ok(st(R.source)) ? st(R.source).state : "";
      const src = { battery: 5, bypass: 4, normal: 3 }[srcText] ?? num(R.source), lv = round(num(R.battery)), rt = round(num(R.runtime));
      const outV = round(num(R.output_voltage)), outA = num(R.output_current);
      d.flow = { inV: round(num(R.input_voltage)), hz: round(num(R.input_frequency), 1), outV, batt: lv, runtime: rt, loadPct: round(num(R.load)),
        load: outV && outA ? Math.round(outV * outA) : null, source: src === 5 ? "Batterie" : "Netz", bypass: src === 4, ids: { in: R.input_voltage, out: R.output_voltage } };
      HIST.want.add(R.input_voltage); HIST.want.add(R.output_voltage); HIST.want.add(R.load);
      const stc = { 1: "bestanden", 2: "Warnung", 3: "Fehler", 4: "abgebrochen", 5: "läuft", 6: "kein Test" }[num(R.selftest)]
        || { passed: "bestanden", warning: "Warnung", error: "Fehler", aborted: "abgebrochen", in_progress: "läuft", none: "kein Test" }[ok(st(R.selftest)) ? st(R.selftest).state : ""];
      const bdRaw = ok(st(R.battery_replace)) ? st(R.battery_replace).state : "", bdm = bdRaw.match(/^(\d{1,2})\/\d{1,2}\/(\d{4})$/) || bdRaw.match(/^(\d{4})-(\d{2})/);
      const bdate = !bdm ? bdRaw.slice(0, 10) : bdm[1].length === 4 ? `${bdm[2]}/${bdm[1]}` : `${bdm[1].padStart(2, "0")}/${bdm[2]}`;
      const nmc = ok(st(R.nmc_model)) ? st(R.nmc_model).state : null, bt = round(num(R.battery_temp)), bv = num(R.battery_voltage);
      d.ups = { bt, bv, bdate, nmc, selftest: stc, onBattSec: num(R.on_battery_seconds) };
      d.facts = [nmc ? ["Netzwerkkarte", nmc] : ["Reserve", `${fmt(rt)} min`], bt != null ? ["Akku-Temp.", `${fmt(bt)} °C`] : ["Batterie", `${fmt(lv)} %`], bdate ? ["Akku-Datum", bdate] : ["Last", `${fmt(round(num(R.load)))} %`], ["Selbsttest", stc === "bestanden" ? "✓ OK" : stc || "–"]];
      if (stc === "bestanden") d.msgs.push(["ok", "Selbsttest bestanden", [bv != null ? `Akku ${fmt(bv, 1)} V` : "", bt != null ? `${fmt(bt)} °C` : ""].filter(Boolean).join(" · ")]);
      if (src === 5) { d.state = "alert"; d.msgs.unshift(["alert", "Batteriebetrieb", "Netz ausgefallen, Last läuft aus dem Akku"]); }
      d.facts = null;   // Kennzahlen stehen in der USV-Karte
      if (num(R.alarms) > 0) { d.state = "alert"; d.msgs.unshift(["alert", `${fmt(num(R.alarms))} Alarm(e) an der USV`, ""]); }
      if (stc && ["Warnung", "Fehler"].includes(stc)) { if (d.state === "ok") d.state = "warn"; d.msgs.push(["warn", `Selbsttest: ${stc}`, ""]); }
    }
    // Stromleiste
    if (Object.keys(m.outlets).length) {
      const names = o.outlet_names || {};
      d.outlets = Object.entries(m.outlets).map(([n, id]) => ({ n: +n, kind: +n % 8 === 0 ? "C19" : "C13", on: st(id)?.state === "on", name: names[n] || "" }));
      // apc_rack_power meldet derzeit alle Ausgänge als „aus“, obwohl Last anliegt → Zustand unbekannt
      d.outletsUnknown = d.outlets.every(x => !x.on) && power > 20;
      d.totalPower = power;
      d.facts = [["Leistung", `${fmt(power)} W`], ["Strom", `${fmt(num(R.current), 1)} A`], ["Spannung", `${fmt(num(R.voltage))} V`], ["Energie", num(R.energy) >= 1000 ? `${fmt(num(R.energy) / 1000, 2)} MWh` : `${fmt(num(R.energy))} kWh`]];
      HIST.want.add(R.power); HIST.want.add(R.current); if (R.energy) HIST.want.add(R.energy);
      d.energyId = R.energy;
    }
    // Rekorder
    if (m.disks.length) {
      d.disks = m.disks.map((id, i) => { const x = id.match(/_(hdd|ssd|disk)_(\d+)$/) || []; return { n: +(x[2] || i + 1), label: (x[1] || "Disk").toUpperCase(), state: st(id)?.state === "on" ? "warn" : ok(st(id)) ? "ok" : "off" }; }).sort((p, q) => p.n - q.n);
      d.disks.filter(x => x.state === "warn").forEach(x => { d.state = "alert"; d.msgs.unshift(["alert", `Schacht ${x.n} (${x.label}) meldet ein Problem`, ""]); });
      d.raid = { used: num(R.storage), ...(o.storage || {}) };   // feste Angaben (RAID, Kapazität, Platten) aus dem Editor
      if (o.storage?.disk_label) d.disks.forEach(x => x.label = o.storage.disk_label);
      const TN = { continuous: ["Dauer", "--blue"], detections: ["Erkennungen", "--purple"], timelapse: ["Zeitraffer", "--orange"] };
      const types = Object.entries(m.rec_types).map(([k, id]) => [TN[k]?.[0] || k, num(id) || 0, TN[k]?.[1] || "--teal"]).filter(t => t[1] >= 0.05);
      // Kameras am Rekorder (aus der Zuordnung, sonst über die Protect-Namensgebung gesucht)
      const cams = m.cameras || Object.keys(HASS?.states || {}).filter(id => /^camera\..+_high_resolution_channel$/.test(id));
      const dets = m.detections || cams.map(id => `binary_sensor.${id.slice(7).replace(/_high_resolution_channel$/, "")}_object_detected`).filter(id => st(id));
      dets.forEach(id => EVT.want.add(id));
      const camOn = cams.filter(id => ok(st(id)));
      if (num(R.recording) != null || types.length) d.rec = { days: Math.round((num(R.recording) || 0) / 86400), types, cams: cams.length, camsOn: camOn.length, events: dets.length ? EVT.count(dets) : null };
      if (cams.length) {
        if (camOn.length < cams.length) cams.filter(id => !ok(st(id))).forEach(id => { if (d.state === "ok") d.state = "warn"; d.msgs.unshift(["warn", "Kamera offline", (st(id)?.attributes.friendly_name || id).replace(/ High Resolution Channel$/i, "")]); });
      }
      d.model = `${d.model} · ${m.disks.length} Schächte`;
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
    for (const r of rack.devices) (r.side === "rear0u" ? rear : front).push(buildDevice(r));
    // Gruppen (z. B. USV + Zusatzbatterie) teilen sich Zustand und Meldungen des Hauptgeräts
    for (const d of front) if (d.group) { const g = front.find(x => x.id === d.group); if (g) d.state = g.state; }
    for (const d of front) { const sub = front.filter(x => x.group === d.id); if (sub.length) d.model = [d.model, ...sub.map(x => x.model.replace(/^APC /, ""))].join(" + "); }
    DEVICES = front; ZERO_U = rear;
    const pdu = rack.devices.find(r => r.side === "rear0u");
    PDU_IMG = pdu?.options?.vertical_image || "";
    const w = st(rack.wled?.entity_id);
    WLED.on = w?.state === "on";
    if (WLED.on && !WLED.loop && WLED.effects) { WLED.loop = true; requestAnimationFrame(wledFrame); }
    if (w) { const i = WLED.effects.findIndex(e => e[0].toLowerCase() === String(w.attributes.effect || "").toLowerCase()); WLED.fx = i < 0 ? 0 : i; }
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
  $("badge").textContent = RACK.badge; $("cap").textContent = RACK.badge; $("plate").textContent = RACK.plate; $("plate").hidden = !RACK.plate; $("badge").hidden = !RACK.badge;
  $("doorL1").textContent = RACK.label1;
  $("doorL2").textContent = RACK.label2;

  $("unums").innerHTML = Array.from({length:RACK.units}, (_, i) => `<span>${RACK.units - i}</span>`).join("");
  $("bay").innerHTML = DEVICES.map(d =>
    `<div class="dev ${isSel(d) ? "sel" : ""}" style="grid-row:${rowOf(d)}">${S.side === "rear" ? rearFace(d) : face(d)}</div>`).join("");

  const used = new Set(); DEVICES.forEach(d => { for (let u = d.u; u < d.u + d.h; u++) used.add(u); });
  const empties = [];
  for (let u = 1; u <= RACK.units; u++) if (!used.has(u)) empties.push(u);
  $("hits").innerHTML =
    DEVICES.filter(d => !["bl", "cm", "blank"].includes(d.type)).map(d => `<button class="hit ${d.passive ? "" : d.state} ${isSel(d) ? "sel" : ""}" style="grid-row:${rowOf(d)}" data-id="${selOf(d)}" aria-label="${d.name}, HE ${d.u}${d.h > 1 ? "–" + (d.u + d.h - 1) : ""}"></button>`).join("") +
    "" ;
  $("pduHit").hidden = S.side !== "rear";
  const pdu0 = ZERO_U[0]; $("pduHit").hidden = S.side !== "rear" || !pdu0; if (pdu0){ $("pduHit").dataset.id = pdu0.id; $("pduHit").setAttribute("aria-label", pdu0.name + ", Rückseite"); }
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
  const hours = ["−24 h","−18 h","−12 h","−6 h","jetzt"];
  return `<svg class="chart" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="height:${H}px" role="img" aria-label="${c.label}, letzte 24 Stunden">
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

const STATE_TXT = { ok:"In Ordnung", warn:"Hinweis", alert:"Störung", off:"Passiv" };

const worst = () => { const s = DEVICES.concat(ZERO_U).filter(d => !d.passive).map(d => d.state); const m = DEVICES.concat(ZERO_U).filter(d => !d.passive && !d.group).flatMap(d => (d.msgs || []).map(x => x[0])); return s.includes("alert") || m.includes("alert") ? "alert" : s.includes("warn") || m.includes("warn") ? "warn" : "ok"; };

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
  const hours = ["−24 h","−18 h","−12 h","−6 h","jetzt"];
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
  const f = d.flow, onBatt = f.source !== "Netz", bypass = !!f.bypass;
  const rackIco = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 2v3h12V4Zm0 5v3h12V9Zm0 5v3h12v-3Z"/></svg>';
  const w = on => `<div class="fw ${on ? "on" : ""}"></div>`;
  return `<section class="card"><h2>Energiefluss <em>Online-USV · ${bypass ? "Bypass aktiv" : onBatt ? "Batteriebetrieb" : "Doppelwandlung"}</em></h2>
    <div class="flow2">
      <div class="byp ${bypass ? "on" : ""}"><span>Bypass ${bypass ? "aktiv" : "inaktiv"}</span></div>
      <div class="frow">
        <div class="fn ${onBatt ? "" : "on"}"><div class="ic">${ICONS.plug}</div><b>${fmt(f.inV)} V</b><span>Netz</span></div>
        ${w(!onBatt && !bypass)}
        <div class="fn conv"><div class="ic">AC<i>→</i>DC</div><b>&nbsp;</b><span>Gleichrichter</span></div>
        ${w(!onBatt && !bypass)}
        <div class="fn bat ${bypass ? "" : "on"}"><div class="ic"><span class="bglyph"><b style="width:${f.batt}%"></b></span></div><b>${fmt(f.batt)} %</b><span>${fmt(f.runtime)} min</span></div>
        ${w(!bypass)}
        <div class="fn conv"><div class="ic">DC<i>→</i>AC</div><b>&nbsp;</b><span>Wechselrichter</span></div>
        ${w(!bypass)}
        <div class="fn on"><div class="ic">${rackIco}</div><b>${fmt(f.load)} W</b><span>${fmt(f.outV)} V · ${fmt(f.loadPct)} %</span></div>
      </div>
      <p class="fnote">${onBatt ? "Netz ausgefallen: Die Last läuft aus dem Akku." : "Der Strom läuft immer über Akku und Wechselrichter. Fällt das Netz aus, gibt es keine Umschaltzeit."}</p>
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
  const m = d.group ? [] : members(d.id);
  if (m.length > 1){
    const total = m.reduce((a, x) => a + x.h, 0);
    return `<div class="thumb multi" style="aspect-ratio:${9.9 / total};--ar:${9.9 / total}">${m.map(x => `<div style="flex:${x.h}">${face(x)}</div>`).join("")}</div>`;
  }
  const ar = imgAr(d.image) || d.thumbAspect || (d.u ? 9.9 / d.h : 9.9);
  return `<div class="thumb" style="aspect-ratio:${ar};--ar:${ar}">${face(d)}</div>`;
}

function renderPanel(){
  let body;
  if (S.sel && byId(S.sel)) body = showDetail(byId(S.sel));
  else body = (S.mode === "edit" ? `<div class="edit-banner">Tippe auf eine freie Höheneinheit, um ein Gerät einzusetzen, oder auf ein Gerät, um es zu bearbeiten.</div>` : "") + overview();
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
      ${inDetail ? `<button class="back pill" data-back aria-label="Zurück zur Übersicht">${ICONS.chev}</button>` : ""}
      <div><h1>${RACK.name}</h1><div class="sub">${RACK.units} HE · ${DEVICES.reduce((a, d) => a + d.h, 0)} belegt · ${DEVICES.filter(d => !d.passive && !d.group).length + ZERO_U.length} aktive Geräte</div></div>
      <span class="chip ${st_}"><i></i>${st_ === "ok" ? "Alles in Ordnung" : `${nMsg} ${st_ === "warn" ? (nMsg === 1 ? "Hinweis" : "Hinweise") : (nMsg === 1 ? "Störung" : "Störungen")}`}</span>
      ${w ? `<span class="wled-chip ${w.state === "on" ? "" : "off"}"><button class="wsw" data-wled-power role="switch" aria-checked="${w.state === "on"}" aria-label="WLED ein- oder ausschalten"></button><span class="wfx">WLED · ${w.state === "on" ? (w.attributes.effect || "An") : "Aus"}</span></span>` : ""}
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
      .concat([{ name: powered.length ? "nicht zugeordnet" : "Gesamt", w: other, c: "var(--label-3)" }]);
    const eId = pdu?.energyId, eNow = num(eId), eStart = HIST.energyStart[eId];
    const today = eNow != null && eStart != null ? eNow - eStart : null;
    const warnMsgs = active.flatMap(d => (d.msgs || []).filter(m => m[0] !== "ok").map(m => ({ d, m }))).sort((a, b) => (b.m[0] === "alert") - (a.m[0] === "alert"));
    const temps = DEVICES.filter(d => !d.passive).map(d => ({ d, t: d.sys?.temp ?? d.temp })).filter(x => x.t != null).sort((a, b) => b.t - a.t);
    const hot = temps[0];
    const chipT = !hot ? "off" : hot.t >= TEMP_ALERT ? "alert" : hot.t >= TEMP_WARN ? "warn" : "ok";
    const lv = ups?.flow.batt, rt = ups?.flow.runtime, bc = lv == null ? "var(--fill-2)" : lv < 20 ? "var(--red)" : lv < 50 ? "var(--orange)" : "var(--green)";
    const powerVals = HS(pdu?.R?.power, total || 0);
    const gw = DEVICES.find(d => d.ports && d.facts?.some(f => f[0] === "Antwortzeit"));
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
      <h2>Strom</h2>
      <div class="en-head">
        <div class="en-big">${fmt(total)}<small>W</small></div>
        <div class="en-today"><b>${today != null ? fmt(today, 1) + " kWh" : "–"}</b><span>heute${(() => { const c = energyCost(today); return c ? ` · ≈ ${c.day}` : ""; })()}</span>${(() => { const c = energyCost(today); return c ? `<em class="en-cost">≈ ${c.month} / Monat</em>` : ""; })()}</div>
      </div>
      <div class="en-bar" role="img" aria-label="Auslastung der USV ${Math.round(pct * 100)} %">
        ${segs.map(x => `<i style="width:${x.w / cap * 100}%;background:${x.c}"></i>`).join("")}
        <span class="en-warn" style="left:70%"></span>
      </div>
      <div class="en-scale"><span>${Math.round(pct * 100)} % der USV-Kapazität${powered.length ? "" : " · laut Stromleiste"}</span><span>${fmt(cap / 1000, 1)} kW</span></div>
      ${ups ? `<button class="ups-bar" data-id="${selOf(ups)}" aria-label="USV-Akku ${lv} Prozent, ${rt} Minuten Reserve">
        <div class="en-bar bat"><i style="width:${lv || 0}%;background:${bc}"></i></div>
        <div class="en-scale"><span>Akku <b>${fmt(lv)} %</b> · ${fmt(rt)} min</span><span class="ups-ok" style="${ups.flow.source === "Netz" ? "" : "color:var(--red)"}"><i class="dot ${ups.flow.source === "Netz" ? "ok" : ""}" style="${ups.flow.source === "Netz" ? "" : "background:var(--red)"}"></i>${ups.flow.bypass ? "Bypass" : ups.flow.source === "Netz" ? "Netzbetrieb" : "Batteriebetrieb"}</span></div></button>` : ""}
      ${powered.length ? `<div class="en-list">${segs.slice(0, -1).slice(0, 5).map(x => `<button data-id="${x.id}"><i style="background:${x.c}"></i><span>${x.name}</span><b>${fmt(x.w)} W</b></button>`).join("")}
        <div class="rest"><i style="background:var(--label-3)"></i><span>Übrige</span><b>${fmt(segs.slice(5).reduce((a, x) => a + x.w, 0))} W</b></div></div>` : ""}
      <div class="ov-chart"><div class="ov-leg"><span><i style="background:var(--blue)"></i>Leistung 24 Std.</span><span>Ø ${fmt(Math.round(powerVals.reduce((a, b) => a + b, 0) / powerVals.length))} W · Spitze ${fmt(Math.round(Math.max(...powerVals)))} W</span></div>
        ${lazy((W, H) => { const lo = Math.min(...powerVals) * .9, hi = Math.max(...powerVals) * 1.08 || 1; return chartMulti([{ v: powerVals, color: css("--blue"), fill: true }], { lo, hi, W, H }); })}</div>
    </section>`; }
  function ovTemp(v) { const { active, bc, cap, chipT, eId, eNow, eStart, gw, hot, lv, other, pct, pdu, poeSw, powerVals, powered, rt, segs, temps, today, total, ups, warnMsgs } = v; return `<section class="card en th3">
      <h2>Temperatur <span class="chip ${chipT}" style="text-transform:none;letter-spacing:0"><i></i>${chipT === "alert" ? "Zu heiß" : chipT === "warn" ? "Warm" : chipT === "off" ? "Keine Werte" : "Normal"}</span></h2>
      ${hot ? `<div class="en-head">
        <div class="en-big">${fmt(hot.t)}<small>°C</small></div>
        <div class="en-today"><b>${hot.d.name}</b><span>wärmstes Gerät</span></div>
      </div>
      <div class="tscale" role="img" aria-label="Wärmstes Gerät ${hot.t} Grad">
        <i class="tz ok" style="width:${tpd(TEMP_WARN)}%"></i><i class="tz warn" style="width:${tpd(TEMP_ALERT) - tpd(TEMP_WARN)}%"></i><i class="tz alert" style="width:${100 - tpd(TEMP_ALERT)}%"></i>
        <em class="tmark out" style="left:${tpd(hot.t)}%"></em>
      </div>
      <div class="en-scale"><span>Gerätetemperaturen · keine Rack-Sensoren</span><span>Grenze ${TEMP_WARN} °C</span></div>
      <div class="ztab dev">
        <span class="zh">Gerät</span><span class="zh">Temperatur</span>
        ${temps.slice(0, 6).map(({ d, t }) => `<button class="zn ${d.name.length > 16 ? "long" : ""}" data-id="${selOf(d)}" title="${d.name}">${d.name}</button><b style="color:${t >= TEMP_ALERT ? "var(--red)" : t >= TEMP_WARN ? "var(--warn-ink)" : "var(--label)"}">${fmt(t)} °C</b>`).join("")}
      </div>` : `<p class="note">Keine Temperaturwerte vorhanden.</p>`}
    </section>`; }
  function ovHints(v) { const { active, bc, cap, chipT, eId, eNow, eStart, gw, hot, lv, other, pct, pdu, poeSw, powerVals, powered, rt, segs, temps, today, total, ups, warnMsgs } = v; return `${warnMsgs.length ? `<section class="card wide hints"><h2><span>Hinweise <i class="cnt ${warnMsgs.some(x => x.m[0] === "alert") ? "alert" : ""}">${warnMsgs.length}</i></span>${warnMsgs.length > 2 ? `<em>+${warnMsgs.length - 2} weitere</em>` : ""}</h2><div class="hint-grid">
      ${warnMsgs.slice(0, 2).map(({ d, m }) => `<button class="hint ${m[0]}" data-id="${selOf(d)}">
        <span class="hic">${ICONS.warn}</span>
        <span class="ht"><b>${m[1]}</b><span><i>${d.name}</i>${m[2]}</span></span><span class="chev">›</span></button>`).join("")}
    </div></section>` : ""}`; }
  function ovStats(v) { const { active, bc, cap, chipT, eId, eNow, eStart, gw, hot, lv, other, pct, pdu, poeSw, powerVals, powered, rt, segs, temps, today, total, ups, warnMsgs } = v; return `<div class="stats wide">
      ${gw ? `<button data-id="${gw.id}"><span>Internet</span><b>${gw.facts.find(f => f[0] === "Antwortzeit")[1].replace(" ms", "")}<small>ms</small></b><em>Antwortzeit</em></button>` : ""}
      ${poeSw ? `<button data-id="${poeSw.id}"><span>PoE</span><b>${fmt(poeSw.poe.used)}<small>W</small></b><em>${poeSw.poe.budget ? `von ${poeSw.poe.budget} W` : poeSw.name}</em></button>` : ""}
      ${pdu ? `<button data-id="${pdu.id}"><span>Stromleiste</span><b>${fmt(num(pdu.R?.current), 1)}<small>A</small></b><em>${pdu.facts[2][1]}</em></button>` : ""}
      ${ups ? `<button data-id="${selOf(ups)}"><span>USV</span><b>${fmt(ups.flow.loadPct)}<small>%</small></b><em>Last · ${fmt(ups.flow.runtime)} min</em></button>` : ""}
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
      if (!html) return EDIT_HOOK ? `<section data-bi="${bi}" style="${st}" class="gcell card empty-mod"><h2>${RD_CATALOG.blocks[b.type]?.name || b.type}</h2>${rdSkeleton(b.type)}</section>` : "";
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
  function trendCard(title, series, sub = "24 Std.") {
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
      s.cpu != null && { label: "Prozessor", id: s.ids.cpu, cur: s.cpu, unit: "%", color: "--blue" },
      s.ram != null && { label: "Arbeitsspeicher", id: s.ids.ram, cur: s.ram, unit: "%", color: "--indigo" },
      { label: "Temperatur", id: s.ids.temp, cur: s.temp, unit: "°C", color: "--orange", warn: TEMP_WARN },
    ].filter(Boolean));
  }
  function sysCardOld(d) {
    const s = d.sys, cpu = HS(s.ids.cpu, s.cpu), ram = HS(s.ids.ram, s.ram), tmp = HS(s.ids.temp, s.temp);
    return `<section class="card grow"><h2>System <em>24 Std.</em></h2>
      <div class="serleg">${s.cpu != null ? `<span><i style="background:var(--blue)"></i>CPU <b>${fmt(s.cpu)} %</b></span>` : ""}${s.ram != null ? `<span><i style="background:var(--indigo)"></i>RAM <b>${fmt(s.ram)} %</b></span>` : ""}<span><i style="background:var(--orange)"></i>Temp. <b>${fmt(s.temp)} °C</b></span></div>
      ${lazy((W, H) => chartMulti([s.cpu != null && { v: cpu, color: css("--blue"), fill: true }, s.ram != null && { v: ram, color: css("--indigo") }, { v: tmp, color: css("--orange") }].filter(Boolean), { lo: 0, hi: 100, W, H }))}
      <div class="mini" style="margin-top:10px"><span>Spitze ${s.cpu != null ? `<b>${Math.round(Math.max(...cpu))} %</b> · ` : ""}<b>${Math.round(Math.max(...tmp))} °C</b></span>${s.ram != null ? `<span>Ø RAM <b>${Math.round(ram.reduce((a, b) => a + b) / ram.length)} %</b></span>` : ""}</div>
    </section>`;
  }
  function voltCard(d) {
    const f = d.flow;
    return trendCard("Spannung", [
      { label: "Eingang", id: f.ids.in, cur: f.inV, unit: "V", color: "--orange" },
      { label: "Ausgang", id: f.ids.out, cur: f.outV, unit: "V", color: "--green" },
    ]);
  }
  function voltCardOld(d) {
    const f = d.flow, vin = HS(f.ids.in, f.inV), vout = HS(f.ids.out, f.outV);
    const lo = Math.min(...vin, ...vout) - 3, hi = Math.max(...vin, ...vout) + 3;
    return `<section class="card grow"><h2>Spannung <em>24 Std.</em></h2>
      <div class="serleg"><span><i style="background:var(--orange)"></i>Eingang <b>${fmt(f.inV)} V</b></span><span><i style="background:var(--green)"></i>Ausgang <b>${fmt(f.outV)} V</b></span></div>
      ${lazy((W, H) => chartMulti([{ v: vin, color: css("--orange") }, { v: vout, color: css("--green") }], { lo, hi, W, H }))}
      <div class="mini" style="margin-top:10px"><span>Eingang min <b>${Math.round(Math.min(...vin))} V</b> · max <b>${Math.round(Math.max(...vin))} V</b></span><span>${f.hz != null ? `${fmt(f.hz, 1)} Hz` : ""}</span></div>
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
    const rows = tot ? [["Belegt", tb(used), "--blue"], ["Frei", tb(cap - used), "--label-3"], prot && ["Schutz", tb(prot), "--purple"]].filter(Boolean) : pct != null ? [["Belegt", `${fmt(pct)} %`, "--blue"]] : [];
    const ring = segs.length ? `<div class="sring"><div class="ring"><svg viewBox="0 0 112 112">${arcs}</svg><div class="c"><b>${fmt(pct)}<small>%</small></b><span>belegt</span></div></div>
        <div class="srows"><div class="sstat ${allOk ? "ok" : "warn"}"><i></i>${allOk ? "Voll funktionsfähig" : `${d.disks.length - okN} Laufwerk${d.disks.length - okN === 1 ? "" : "e"} prüfen`}</div>
          ${rows.map(([k, v, c]) => `<div class="srow"><span><i style="background:var(${c})"></i>${k}</span><b>${v}</b></div>`).join("")}
          ${tot ? `<div class="srow tot"><span>Gesamt</span><b>${tb(tot)}</b></div>` : ""}</div></div>` : `<div class="sstat ${allOk ? "ok" : "warn"}"><i></i>${allOk ? "Voll funktionsfähig" : "Laufwerke prüfen"}</div>`;
    // Schächte als Kacheln nebeneinander (wie die Laufwerksansicht der UNVR)
    const bays = `<div class="dbays" style="grid-template-columns:repeat(${Math.min(4, d.disks.length)},minmax(0,1fr))">${d.disks.map(x => { const k = info(x.n); return `<div class="dbay ${x.state}" title="${k.model || ""}"><div class="bt"><i></i><b>${x.label} ${x.n}</b></div><span>${x.state === "ok" ? "Optimal" : x.state === "warn" ? "Prüfen" : "Keine Daten"}</span><em>${k.size || ""}${k.model ? ` · ${k.model}` : ""}</em></div>`; }).join("")}</div>`;
    return `<section class="card"><h2>Speicher <em>${[r.raid, `${d.disks.length} ${r.disk_label || "Laufwerke"}`, cap && `${fmt(cap, 2)} TB`].filter(Boolean).join(" · ")}</em></h2>
      ${ring}${bays}
    </section>`;
  }
  // USV-Karte: großer Akku-Ring mit Reserve, Betriebsart in Klartext, schmaler Stromweg Netz → USV → Last, Kennwerte als Kacheln
  function upsFlow(d) {
    const f = d.flow, u = d.ups || {}, onBatt = f.source !== "Netz", bypass = !!f.bypass, charging = !onBatt && !bypass && f.batt != null && f.batt < 99.5;
    const bp = Math.max(0, Math.min(100, f.batt ?? 0)), lp = Math.max(0, Math.min(100, f.loadPct ?? 0));
    const bcol = bp < 20 ? "--red" : bp < 50 ? "--orange" : "--green", mcol = bypass ? "--yellow" : onBatt ? "--orange" : "--green";
    const mode = bypass ? ["Bypass", "warn", "Last hängt direkt am Netz"] : onBatt ? ["Akkubetrieb", "alert", "Netz ausgefallen – Akku versorgt"] : ["Netzbetrieb", "ok", charging ? "Akku wird geladen" : "Alles versorgt"];
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
      <g class="ubl"><rect x="${BX - 52}" y="4" width="104" height="16" rx="8"/><text x="${BX}" y="15.5" text-anchor="middle">${online ? "Online-USV" : "Line-Interactive"}</text></g>
      ${wire(`M${NX + S},${Y} L${RX - BW / 2},${Y}`, mains || bypass, bypass ? "--yellow" : "--green")}
      ${wire(`M${J1},${Y} L${J1},${YB} L${BX - 12},${YB} M${BX + 12},${YB} L${J2},${YB} L${J2},${Y}`, bypass, "--yellow").replace('class="ul ', 'class="ul byp ')}
      ${sw}<circle cx="${BX - 12}" cy="${YB}" r="2.2" class="ujn"/><circle cx="${BX + 12}" cy="${YB}" r="2.2" class="ujn"/>
      <text x="${J1 + 8}" y="${YB - 5}" class="ulb">${bypass ? "Bypass aktiv" : "Bypass"}</text>
      ${wire(`M${RX + BW / 2},${Y} L${IX - BW / 2},${Y}`, !bypass, onBatt ? "--orange" : "--green")}
      ${wire(`M${BX},${Y} L${BX},${BYB - 11}`, onBatt || charging, onBatt ? "--orange" : "--green")}
      ${wire(`M${IX + BW / 2},${Y} L${LX - S},${Y}`, true, mcol)}
      
      ${box(RX, "AC → DC", "Gleichrichter", mains, "--green")}${box(IX, "DC → AC", "Wechselrichter", !bypass, onBatt ? "--orange" : "--green")}
      <rect x="${BX - 21}" y="${BYB - 11}" width="40" height="22" rx="5" class="ubat"/><rect x="${BX + 20}" y="${BYB - 4}" width="3" height="8" rx="1.5" class="ubatk"/>
      <rect x="${BX - 18}" y="${BYB - 8}" width="${bfill}" height="16" rx="3" style="fill:var(${bcol})"/>
      
      ${node(NX, !onBatt, "--green", P.plug, onBatt ? "Netz aus" : f.hz ? `${fmt(f.hz, 1)} Hz` : "Netz", onBatt ? "–" : `${fmt(f.inV)} V`)}
      ${node(LX, true, mcol, P.rack, "Last", f.load != null ? `${fmt(f.load)} W` : `${fmt(lp)} %`)}
      ${mp.join("")}${dts}</svg>`;
    const cell = (k, v, s, c) => `<div class="ukc"><span>${k}</span><b${c ? ` style="color:var(${c})"` : ""}>${v}</b>${s ? `<em>${s}</em>` : ""}</div>`;
    const age = (() => { const m = (u.bdate || "").match(/^(\d{2})\/(\d{4})$/); if (!m) return ""; const mo = (new Date().getFullYear() - +m[2]) * 12 + new Date().getMonth() + 1 - +m[1]; return mo >= 12 ? `seit ${Math.floor(mo / 12)} J. ${mo % 12} Mon.` : `seit ${mo} Mon.`; })();
    // Kacheln nur mit dem, was der Stromweg nicht schon zeigt: Akku-Zustand und Wartung
    const cells = [
      cell("Temperatur", u.bt != null ? `${fmt(u.bt)} °C` : "–", u.bt != null ? (u.bt >= 40 ? "Akku · zu warm" : "Akku · normal") : "Akku", u.bt >= 40 ? "--orange" : ""),
      cell("Spannung", u.bv != null ? `${fmt(u.bv, 1)} V` : "–", "Akku"),
      cell("Eingebaut", u.bdate || "–", age ? age.replace("seit", "vor") : "Akku"),
      cell("Selbsttest", u.selftest === "bestanden" ? "✓ OK" : u.selftest || "–", u.selftest === "bestanden" ? "bestanden" : "", u.selftest && u.selftest !== "bestanden" ? "--orange" : ""),
    ].join("");
    return `<section class="card wide ups2" style="--uc:var(${mcol})">
      <div class="uh">
        <div class="ug">${ring}<div class="ugc"><b>${fmt(bp)}<small>%</small></b><span>${charging ? "lädt" : onBatt ? "entlädt" : "Akku"}</span></div></div>
        <div class="ui">
          <span class="umode ${mode[1]}"><i></i>${mode[0]}</span>
          <b class="ut">${mode[2]}</b>
          <span class="us">${fmt(lp)} % Last${f.runtime != null ? ` · <b>${fmt(f.runtime)} min</b> Reserve` : ""}</span>
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
    return `<section class="card grow"><h2>Aufnahme <em>${r.cams ? `${r.camsOn} von ${r.cams} Kameras` : "Speicherdauer"}</em></h2>
      <div class="rec">
        <div class="ring"><svg viewBox="0 0 124 124"><circle cx="62" cy="62" r="${R}" fill="none" stroke="var(--fill-2)" stroke-width="14"/>${arcs}</svg><div class="c"><b>${r.days}</b><span>Tage</span></div></div>
        <div class="rows">${r.types.map(([n, v, c]) => `<div class="row"><span><i style="background:var(${c})"></i>${n}</span><b>${fmt(v, v < 1 ? 1 : 0)} %</b></div>`).join("")}
          ${r.events != null ? `<div class="row" style="padding-top:8px;border-top:1px solid var(--sep)"><span>Erkennungen heute</span><b>${fmt(r.events)}</b></div>` : ""}</div>
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
    return `<div class="phist-ax"><span>↓ ${rateK(mx / 1.1)}</span><span>${mins >= 60 ? "letzte Stunde" : mins ? `seit ${mins} Min.` : ""}</span></div>
      <svg class="plive" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      ${rx.map((v, i) => bar(v, i, 1, "--rx")).join("")}${tx.map((v, i) => bar(v, i, -1, "--tx")).join("")}
      <line x1="0" x2="${W}" y1="${mid}" y2="${mid}" stroke="var(--sep)" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>
      <div class="phist-ax"><span>↑ ${rateK(mx / 1.1)}</span><span>jetzt</span></div>`;
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
    const head = `<h2>Ports <em>${up} von ${d.ports.length} verbunden${tr && (tr[0] || tr[1]) ? ` · ↓ ${rateK(tr[0])} ↑ ${rateK(tr[1])}` : ""}</em></h2>`;
    const upl = R.up ? `<div class="conn">Verbunden mit <button data-id="${R.up.o.id}">${R.up.o.name}</button>${R.remote.length ? `<span>Port ${portRange(R.remote)}</span>` : ""}</div>`
      : d.wan && d.wan.isp ? `<div class="conn">Internet <span>${d.wan.isp}</span></div>` : "";
    const peerDev = devNamed(sel.peer), role = R.isUp(sel) ? "Uplink" : R.lag(sel.peer) ? "Bündel" : "";
    const info = `<div class="pinfo"><span class="pn">${sel.label}</span>
        <span class="pd">${sel.peer ? peerDev ? `<button class="peer" data-id="${peerDev.id}">${sel.peer} ›</button>` : `<b>${sel.peer}</b>` : `<b>Port ${sel.label}${sel.speed ? "" : " · frei"}</b>`}
          <span>${sel.peer ? `Port ${sel.label} · ` : ""}${KIND_TXT[sel.kind] || sel.kind}${sel.speed ? " · " + SPEED_TXT[sel.speed] : ""}${role ? " · " + role : ""}${sel.poe ? ` · ${sel.poePP ? "PoE++" : "PoE+"} ${fmt(sel.poe, 1)} W` : ""}</span></span>
        ${sel.speed ? `<span class="tr"><span><i class="dl"></i>↓ <b>${rate(sel.rx)}</b></span><span><i class="ul"></i>↑ <b>${rate(sel.tx)}</b></span></span>` : ""}</div>`;
    const live = sel.ids?.rx && sel.speed ? `<div class="plive-wrap">${liveSvg(sel)}</div>` : "";
    // Wenige Ports (z. B. Gateway): Kacheln wie bei den Schnittstellen eines Servers
    if (d.ports.length <= 8) {
      const tiles = d.ports.map(p => `<button class="if2 ${p.speed ? "up s" + p.speed.replace(".", "_") : "down"} ${S.port === p.n ? "sel" : ""}" data-port="${p.n}" aria-label="Port ${p.label}">
        <span class="ifg">${IF_GLYPH[p.kind === "rj45" ? "rj45" : "sfp"]}</span><b>Port ${p.label}</b>
        <span class="ifs-sp">${p.speed ? p.peer || SPEED_TXT[p.speed] : "frei"}</span>
        <span class="ifrates">${p.speed && (p.rx != null || p.tx != null) ? `<span><i></i>${rateK(p.rx)}</span><span><i class="ul"></i>${rateK(p.tx)}</span>` : `<span>${p.peer && p.speed ? SPEED_TXT[p.speed] : KIND_TXT[p.kind] || p.kind}</span>`}</span></button>`).join("");
      return `<section class="card${live ? " pgrow" : ""}">${head}${upl}<div class="ifs" style="grid-template-columns:repeat(${Math.min(4, d.ports.length)},minmax(0,1fr))">${tiles}</div>${info}${live}</section>`;
    }
    const has = f => d.ports.some(f), sw = c => `<i class="sw" style="background:var(${c})"></i>`;
    const legend = [...["100M", "1G", "2.5G", "10G", "25G"].filter(x => has(p => p.speed === x)).map(x => `<span>${sw(SPD_COL[x])}${SPD_SHORT[x]}</span>`),
      `<span>${sw("--fill-2")}Nicht verbunden</span>`,
      has(p => p.poeCap && !p.poePP) && `<span>${PORT_ICON.poe}PoE+</span>`, has(p => p.poeCap && p.poePP) && `<span>${PORT_ICON.poe2}PoE++</span>`,
      has(R.isUp) && `<span>${PORT_ICON.up}Uplink</span>`, has(p => !R.isUp(p) && R.lag(p.peer)) && `<span>${PORT_ICON.lag}Bündel</span>`].filter(Boolean).join("");
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
    const foot = [w.avail != null && `Verfügbar <b>${fmt(w.avail, 1)} %</b>`, w.loss != null && `Verlust <b>${fmt(w.loss, 1)} %</b>`, w.drops != null && `Abbrüche <b>${fmt(w.drops)}</b>`].filter(Boolean).join(" · ");
    return card.replace(/<\/section>$/, `${foot || w.isp ? `<div class="wanfoot"><span>${foot}</span></div>` : ""}</section>`);
  }
  function poeCard(d) {
    const top = d.ports.filter(p => p.poe).sort((a, b) => b.poe - a.poe), max = top[0]?.poe || 1;
    const pct = d.poe.budget ? Math.round(d.poe.used / d.poe.budget * 100) : null;
    return `<section class="card grow"><h2>PoE <em>${top.length} ${top.length === 1 ? "Gerät" : "Geräte"} versorgt</em></h2>
      <div class="mini" style="border-top:0;padding-top:0"><span><b style="font:700 26px var(--font-display)">${fmt(d.poe.used)} W</b>${d.poe.budget ? ` von ${d.poe.budget} W` : ""}</span>${pct != null ? `<b>${pct} %</b>` : ""}</div>
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
    if (!named) return `<section class="card"><h2>Ausgänge <em>${os.length} Ausgänge${unk ? "" : ` · ${on} an`}</em></h2>
      <div class="ostrip">${groups.map(g => `<div class="og"><span class="ogl">${g[0].n}–${g.at(-1).n}</span>${g.map(x => `<span class="sock ${x.kind} ${x.on && !unk ? "on" : ""}">${x.n}</span>`).join("")}</div>`).join("")}</div>
      <p class="note" style="margin:8px 0 0;font-size:12px">Welches Gerät an welchem Ausgang hängt, lässt sich im Rack-Editor beim Gerät „${d.name}“ eintragen.</p></section>`;
    return `<section class="card ocard"><h2>Ausgänge <em>${unk ? `${named} von ${os.length} belegt` : `${on} von ${os.length} an`}</em></h2>
      <div class="ovlist">${groups.map(g => `<div class="obank"><span class="obh">${g[0].n}–${g.at(-1).n}</span>${g.map(x => `
        <div class="orow"><span class="onum ${x.on && !unk ? "on" : ""}">${x.n}</span><span class="onm ${x.name ? "" : "empty"}">${x.name || "frei"}</span><i class="okind">${x.kind}</i>${unk ? "" : `<i class="ost ${x.on ? "on" : ""}">${x.on ? "an" : "aus"}</i>`}</div>`).join("")}</div>`).join("")}</div>
      ${unk ? `<span class="note onote">Schaltzustand wird von der Stromleiste derzeit nicht korrekt gemeldet.</span>` : ""}
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
  function frameInner(d) {
    const n = d.slots || 10;
    return `<i class="in"><span class="slots" style="--n:${n}">${Array.from({ length: n }, (_, i) => { const m = (d.modules || []).find(x => x.slot === i + 1);
      return `<span class="slot ${m ? (m.status === "planned" ? "planned" : "mod " + (m.kind || "")) : ""}">${m && m.status !== "planned" ? '<i class="oled"></i><i class="rj"></i>' : ""}</span>`; }).join("")}</span></i>`;
  }
  function slotsCard(d) {
    const n = d.slots || 10, mods = d.modules || [];
    return `<section class="card"><h2>Steckplätze <em>${mods.filter(m => m.status !== "planned").length} von ${n} belegt${mods.some(m => m.status === "planned") ? ` · ${mods.filter(m => m.status === "planned").length} geplant` : ""}</em></h2>
      <div class="slotlist">${Array.from({ length: n }, (_, i) => { const m = mods.find(x => x.slot === i + 1);
        const v = m?.entity && st(m.entity) ? valueOf(m.entity) : null, l = v ? lamp(m.entity) : "";
        return `<div class="sl ${m ? (m.status === "planned" ? "planned" : "on") : ""}"><span>${i + 1}</span><b>${m ? m.name : "frei"}</b><em>${m ? (m.status === "planned" ? "geplant" : "") + (m.desc ? `${m.status === "planned" ? " · " : ""}${m.desc}` : "") : ""}</em>${v ? `<strong class="slv ${l}">${v.v}${v.u ? `<small>${v.u}</small>` : ""}</strong>` : ""}</div>`; }).join("")}</div></section>`;
  }
  // Einschalten (z. B. IPMI): erst beim zweiten Tippen innerhalb von 4 s
  function powerOnBtn(d) {
    const id = d.options.power_on, arm = ARMED?.id === id && Date.now() - ARMED.t < 4000;
    return `<button class="pwrchip ${arm ? "armed" : ""}" data-press="${id}" data-confirm="Nochmal tippen">${arm ? "Nochmal tippen" : "⏻ Einschalten"}</button>`;
  }
  // Module, die bei ausgeschaltetem Gerät als graues Gerüst (ohne Werte) stehen bleiben; alle anderen werden zum Platzhalter
  const OFF_SKELETON = ["bays", "array"];
  // Entitäten eines Moduls (für „läuft auch bei ausgeschaltetem Gerät“)
  const blockEnts = (d, b) => [...(b.items || []), b.source].filter(Boolean).map(ref => entOf(ref, d.R)).filter(Boolean);
  function headCard(d) {
    const hb = d.blocks.find(b => b.type === "header");
    if (hb?.items?.length && !d.off) d.facts = hb.items.slice(0, 4).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1]).map(([ref, id]) => { const v = valueOf(id); return [nameOf(hb, ref, id), `${v.v}${v.u ? " " + v.u : ""}`]; });
    const mm = members(d.id), lo = Math.min(...mm.map(x => x.u)), hi = Math.max(...mm.map(x => x.u + x.h - 1));
    const where = d.u ? `${d.type === "shelf" ? "auf Fachboden " : ""}HE ${lo}${hi > lo ? "–" + hi : ""}` : "Rückseite, 0 HE";
    return `<section class="card"><div class="dhero">
      <div class="top"><div style="min-width:0"><h1 data-ed-name style="font:700 24px/1.1 var(--font-display);margin:0 0 4px">${d.name}</h1><div class="sub" style="color:var(--label-2);font-size:13px">${d.model} · ${where}</div></div>
        ${d.off && d.options?.power_on && st(d.options.power_on) ? powerOnBtn(d) : `<span class="chip ${d.passive ? "off" : d.state}"><i></i>${d.off ? "Aus" : STATE_TXT[d.passive ? "off" : d.state]}</span>`}</div>
      ${headThumb(d)}
      ${d.facts ? `<div class="facts4">${d.facts.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>` : ""}
      ${warnMsgsOf(d).slice(0, 2).map(m => `<div class="hmsg ${m[0]}"><i></i><b>${m[1]}</b><span>${m[2] || ""}</span></div>`).join("")}
    </div></section>`;
  }
  function tilesCard(d) {
    return `<section class="card"><h2>Aktuell</h2><div class="grid t3">${d.tiles.slice(0, 6).map(([k, v, unit, meter, stt, hint]) => `
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
    const spdTxt = s => ({ "25G": "25 Gbit/s", "10G": "10 Gbit/s", "2.5G": "2,5 Gbit/s", "1G": "1 Gbit/s", "100M": "100 Mbit/s" })[s] || "verbunden";
    const tile = p => {
      const a = src[p.key] || {}, up = a.state === "up", sp = up ? spd(a.speed) : null, rx = up ? mbit(p.rx) : null, tx = up ? mbit(p.tx) : null;
      return `<div class="if2 ${up ? "up" : "down"} ${sp ? "s" + sp.replace(".", "_") : ""}">
        <span class="ifg">${IF_GLYPH[p.kind] || IF_GLYPH.rj45}</span>
        <b>${p.name}</b><span class="ifs-sp">${up ? spdTxt(sp) : a.state === "missing" ? "fehlt" : "frei"}</span>
        <span class="ifrates">${up ? `<span><i></i>${rateK(rx)}</span><span><i class="ul"></i>${rateK(tx)}</span>` : "&nbsp;"}</span></div>`;
    };
    const bondKeys = new Set(b.bond?.members || ports.filter(p => p.kind === "sfp").map(p => p.key));
    const bd = b.bond && src[b.bond.key], inBond = ports.filter(p => bd && bondKeys.has(p.key)), rest = ports.filter(p => !inBond.includes(p));
    const bond = inBond.length ? `<div class="ifgrp ${bd.state === "up" ? "up" : ""}" style="grid-column:span ${inBond.length}">
        <div class="ifbr"><span>${b.bond.name || "Bündel"}${bd.state === "up" ? ` · ${fmt(bd.speed / 1000)}G` : " · getrennt"}</span>${bd.state === "up" ? `<em>↓ ${rateK(mbit(b.bond.rx))} · ↑ ${rateK(mbit(b.bond.tx))}</em>` : ""}</div>
        <div class="ifrow" style="grid-template-columns:repeat(${inBond.length},minmax(0,1fr))">${inBond.map(tile).join("")}</div></div>` : "";
    const upN = ports.filter(p => src[p.key]?.state === "up").length;
    return `<section class="card"><h2>${b.label || "Schnittstellen"} <em>${upN} von ${ports.length} verbunden</em></h2>
      <div class="ifs" style="grid-template-columns:repeat(${ports.length},minmax(0,1fr))">${bond}${rest.map(tile).join("")}</div></section>`;
  }
  // Ringe: Auslastung auf einen Blick (Prozent, sonst Bereich min–max)
  // Auslastung im selben Kachel-Stil wie System (Wert, Pegel, 24-Std.-Kurve)
  function ringsCard(d, b) {
    const COL = ["--blue", "--indigo", "--teal", "--green", "--orange"];
    const items = b.items.map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && st(x[1]));
    items.forEach(([, id]) => HIST.want.add(id));
    return trendCard(b.label || "Auslastung", items.map(([ref, id], i) => ({ label: nameOf(b, ref, id), id, cur: num(id), unit: st(id).attributes.unit_of_measurement || "%", color: b.colors?.[i] || COL[i % COL.length], dec: 0 })));
  }
  // Laufwerksschächte (z. B. Unraid): je Platte Gesundheits- und/oder Belegungssensor, Attribute liefern Typ, Größe, Temperatur, Ruhezustand
  const sizeTB = s => { const m = String(s ?? "").match(/([\d.,]+)\s*([KMGTP]?)i?B/i); if (!m) return null; const x = parseFloat(m[1].replace(",", ".")); return x * ({ "": 1e-12, K: 1e-9, M: 1e-6, G: 1e-3, T: 1, P: 1e3 }[m[2].toUpperCase()] ?? 0); };
  const tbTxt = x => x >= 1 ? `${fmt(x, x >= 10 || Math.abs(x - Math.round(x)) < .05 ? 0 : 1)} TB` : `${fmt(x * 1000)} GB`;
  const DISK_ST = { DISK_OK: "OK", DISK_NEW: "Neu, nicht zugewiesen", DISK_NP: "Fehlt", DISK_NP_DSBL: "Fehlt", DISK_DSBL: "Deaktiviert", DISK_DSBL_NEW: "Deaktiviert", DISK_INVALID: "Ungültig", DISK_WRONG: "Falsche Platte", DISK_EMULATED: "Emuliert" };
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
      const name = b.names?.[id] || b.names?.[h] || b.names?.[u] || (role === "parity" ? "Parität" + (nr ? " " + nr : "") : role === "cache" ? "Cache" + (nr ? " " + nr : "") : "Platte " + (nr || key));
      const spun = A.spin_state ? A.spin_state === "active" : A.standby != null ? !A.standby : A.spinning !== false;
      const used = num(u), tb = sizeTB(A.total);
      return { id: hs ? h : u, key, dev: A.device || null, serial: A.serial || A.serial_number || null, role, short, name, tb: tb > 0 ? tb : null, temp: A.temperature_celsius ?? A.temperature ?? null, used: used != null ? Math.round(used) : null, spun,
        bad: hs?.state === "on" || (A.num_errors > 0), status: A.status ? (DISK_ST[A.status] || A.status) : hs ? (hs.state === "on" ? "Problem" : "OK") : null, errors: A.num_errors || 0 };
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
    internal.forEach((x, i) => { x.n = null; x.slot = `Intern ${i + 1}`; });
    const all = [...bays, ...internal];
    const sel = (S.bay && all.find(x => x.key === S.bay)) || all.find(x => x.bad) || all.find(x => x.role !== "empty");
    // Temperatur: HDD ab 45/55 °C, SSD ab 55/65 °C gelb/rot (warn/alert im Modul überschreibbar)
    const tcol = x => { if (x.temp == null || !x.spun) return ""; const ssd = x.role === "cache", w = b.warn ?? (ssd ? 55 : 45), al = b.alert ?? (ssd ? 65 : 55);
      return x.temp >= al ? "t-alert" : x.temp >= w ? "t-warn" : ""; };
    // Stehend: Einschübe senkrecht wie in einem Storage-Gehäuse (Griff in Rollenfarbe, LEDs, Füllstand = Belegung)
    const vtile = x => `<button class="bv ${x.role} ${x.spun ? "" : "down"} ${x.bad ? "bad" : ""} ${sel === x && !d.off ? "sel" : ""}" data-bay="${x.key}" aria-label="${x.name}"><i class="bv-h"></i><i class="bv-led ${x.bad ? "alert" : x.spun ? "ok" : "off"}"></i>${x.used != null ? `<b style="height:${x.used}%"></b>` : ""}<em class="${tcol(x)}">${x.spun ? (x.temp != null ? fmt(x.temp) + "°" : "") : "zz"}</em><span>${x.short}</span></button>`;
    const tile = x => vert ? vtile(x) : `<button class="bay24 ${x.role} ${x.spun ? "" : "down"} ${x.bad ? "bad" : ""} ${sel === x && !d.off ? "sel" : ""}" data-bay="${x.key}" aria-label="${x.name}"><i></i><span>${x.short}</span><em class="${tcol(x)}">${x.spun ? (x.temp != null ? fmt(x.temp) + "°" : "") : "zz"}</em>${x.used != null ? `<b style="width:${x.used}%"></b>` : ""}</button>`;
    const roleTxt = { parity: "Parität", data: "Daten", cache: "Cache" };
    const bad = disks.filter(x => x.bad).length, hot = disks.filter(x => tcol(x)).length;
    const temps = disks.filter(x => x.spun && x.temp != null).map(x => x.temp), tmax = temps.length ? Math.max(...temps) : null;
    return `<section class="card bayc"><h2>${b.label || "Schächte"} <em>${bad ? `<b class="hv" style="color:var(--red)">${bad} mit Problem</b> · ` : ""}${hot ? `<b class="hv" style="color:var(--warn-ink)">${hot} warm</b> · ` : ""}${list.length} von ${slots} belegt${tmax != null ? ` · max. ${fmt(tmax)} °C` : ""}</em></h2>
      <div class="${vert ? `baysv ${slots > 14 ? "dense" : ""}` : "bays24"} ${b.order === "cols" && !vert ? "bycol" : ""}" style="--bc:${cols};--br:${Math.ceil(slots / cols)}">${bays.map(x => x.role === "empty" ? (vert ? `<div class="bv empty"><i class="bv-h"></i><span>${x.n}</span></div>` : `<div class="bay24"><span>${x.n}</span></div>`) : tile(x)).join("")}</div>
      ${internal.length ? `<div class="bayint"><span class="lbl">Intern</span><div class="${vert ? "baysv int" : "bays24"}" style="--bc:${vert ? Math.max(internal.length, Math.min(slots, 12)) : cols}">${internal.map(tile).join("")}</div></div>` : ""}
      <div class="plegend blg"><span><i style="background:var(--indigo)"></i>Parität</span><span><i style="background:var(--blue)"></i>Daten</span><span><i style="background:var(--teal)"></i>Cache</span><span><i style="background:var(--fill-2)"></i>leer</span><span class="hint-sleep">blass = schläft</span></div>
      ${d.off ? "" : `<div class="pinfo"><span class="pn" ${sel.bad ? `style="color:var(--red)"` : ""}>${sel.short}</span><span class="pd"><b>${sel.name}${sel.tb ? " · " + tbTxt(sel.tb) : ""}</b><span>${sel.n ? `Schacht ${sel.n}` : sel.slot} · ${roleTxt[sel.role]}${sel.used != null ? ` · ${sel.used} % belegt` : ""}${sel.status ? ` · <em style="font-style:normal;${sel.bad ? "color:var(--red)" : ""}">${sel.status}</em>` : ""}${sel.errors ? ` · ${sel.errors} Fehler` : ""}</span></span>
        <span class="tr ${tcol(sel)}">${sel.spun ? (sel.temp != null ? `<b>${fmt(sel.temp)} °C</b>` : "") : "schläft"}</span></div>`}
    </section>`;
  }
  // Array (z. B. Unraid): Belegung aus dem Belegungssensor (Attribute total/used/free), Zustand, Cache-Pools, Parität
  function arrayCard(d, b) {
    const ids = (b.items || []).map(ref => entOf(ref, d.R)).filter(id => id && st(id)); if (!ids.length) return "";
    if (d.off) return `<section class="card grow arrc"><h2>${b.label || "Array"}</h2><div class="arr2"><div class="arroff off"><b>Server aus</b><span>Belegung, Cache und Parität erscheinen nach dem Einschalten.</span></div>
      ${ids.filter(id => /_disk_cache\d*_usage$/.test(id)).map(id => { const nr = (id.match(/cache(\d*)_usage$/) || [])[1]; return `<div class="crow"><span>${b.names?.[id] || "Cache" + (nr ? " " + nr : "")}</span><div class="meter"><b style="width:0"></b></div><b>–</b></div>`; }).join("")}</div></section>`;
    const find = re => ids.find(id => re.test(id));
    const uid = find(/_array_usage$/) || ids.find(id => st(id).attributes.unit_of_measurement === "%" && st(id).attributes.total != null);
    const sid = find(/_array_state$/), pid = find(/_parity_status$/) || find(/_parity_valid$/), cids = ids.filter(id => /_disk_cache\d*_usage$/.test(id));
    const U = uid ? st(uid).attributes : {}, tot = sizeTB(U.total), usedTB = sizeTB(U.used), freeTB = sizeTB(U.free), pct = num(uid);
    const state = sid && st(sid).state, running = !state || state === "started" || state === "STARTED";
    const stTxt = sid ? valueOf(sid).v : "";
    const P = pid ? st(pid) : null, pst = P?.attributes?.status;
    const PST = { completed: "abgeschlossen", cancelled: "abgebrochen", running: "läuft", paused: "pausiert", failed: "fehlgeschlagen", never_run: "nie ausgeführt" };
    const parTxt = P ? [P.state === "on" ? "Problem" : "", pst ? PST[pst] || pst : P.state === "on" ? "" : "OK", P.attributes?.errors ? `${P.attributes.errors} Fehler` : ""].filter(Boolean).join(" · ") : "";
    return `<section class="card grow arrc"><h2>${b.label || "Array"} <em ${running ? "" : `style="color:var(--warn-ink)"`}>${stTxt || ""}</em></h2>
      <div class="arr2">
        ${running && tot ? `<div><div class="big2">${tbTxt(usedTB || 0)}<small>von ${tbTxt(tot)}</small></div>
          <div class="capb"><b style="width:${Math.round(pct ?? 0)}%"></b></div>
          <div class="mini" style="border-top:0;padding-top:0"><span>${fmt(pct ?? 0)} % belegt</span><span>frei <b>${tbTxt(freeTB || 0)}</b></span></div></div>`
        : `<div class="arroff"><b>${running ? "Keine Belegung" : "Array gestoppt"}</b><span>${running ? "Der Sensor liefert noch keine Größen." : `${stTxt}. Platten und Freigaben sind erst nach dem Start verfügbar.`}</span></div>`}
        ${cids.map(id => { const A = st(id).attributes, t = sizeTB(A.total), v = num(id); const nr = (id.match(/cache(\d*)_usage$/) || [])[1];
          return `<div class="crow"><span>${b.names?.[id] || "Cache" + (nr ? " " + nr : "")}${t > 0 ? ` <small>${tbTxt(t)}</small>` : ""}</span><div class="meter"><b style="width:${v ?? 0}%;background:var(--teal)"></b></div><b>${v != null ? fmt(v) + " %" : "–"}</b></div>`; }).join("")}
        ${P ? `<div class="mini"><span>Paritätsprüfung</span><b ${P.state === "on" ? `style="color:var(--red)"` : ""}>${parTxt}</b></div>` : ""}
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
    return `<section class="card mod hwc"><h2>${b.label || "Hardware"}${fans.length ? ` <em>Lüfter in U/min</em>` : ""}</h2>${tiles ? `<div class="hwts">${tiles}</div>` : ""}${fanEl ? `<div class="hwfs">${fanEl}</div>` : ""}</section>`;
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
        return pair(`${b.fan_label || "Lüfter"}${fans.length > 1 ? ` (${fans.length})` : ""}`, `${txt} <small>U/min</small>`, ""); })() : ""}</div></section>`;
  }
  // Thermometer: Temperaturen als Balken mit Ampelfarbe (Grenzen warn/alert, Standard 80/90 °C)
  function thermoCard(d, b) {
    const warn = b.warn ?? 80, alert = b.alert ?? 90, lo = b.min ?? 20, hi = b.max ?? 100;
    const rows = b.items.map(ref => entOf(ref, d.R)).filter(Boolean).map(id => ({ id, v: valueOf(id) })).filter(x => x.v.n != null).sort((x, y) => y.v.n - x.v.n);
    const hot = rows.reduce((m, x) => Math.max(m, x.v.n), -Infinity), wp = ((warn - lo) / (hi - lo) * 100).toFixed(1);
    return `<section class="card grow"><h2>${b.label || "Temperaturen"} <em>max. <b class="hv">${fmt(hot)} °C</b></em></h2><div class="thermo2">${rows.map(({ id, v }) => {
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
    return `<section class="card grow trace"><h2>${c.label} <em class="tread" data-k="${key}">24 Std.</em></h2>
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
    card.querySelector(".tread").textContent = i === T.n - 1 ? "jetzt" : t.toLocaleTimeString(rdLoc(), { hour: "2-digit", minute: "2-digit" }) + " Uhr";
    T.series.forEach(s => { const b = card.querySelector(`b[data-s="${s.id}"]`); if (b) b.textContent = `${fmt(s.v[i], s.dec ?? 0)} ${s.unit}`; });
  }
  function traceLeave(e) {
    const card = e.target.closest?.(".trace"); if (!card) return;
    const svg = card.querySelector(".trace-svg"), T = svg && TRACE[svg.dataset.k]; if (!T) return;
    svg.querySelector(".tguide").style.display = "none"; card.querySelector(".tread").textContent = "24 Std.";
    T.series.forEach(s => { const b = card.querySelector(`b[data-s="${s.id}"]`); if (b) b.textContent = `${valueOf(s.id).v} ${s.unit}`; });
  }
  function chartCard(c) {
    if (c.style === "trace") return traceCard(c.multi ? c : { label: c.label, warn: c.warn, series: [{ id: c.entity, label: c.label, unit: c.unit, color: c.color, dec: c.dec, warn: c.warn }] });
    if (c.multi) return trendCard(c.label, c.series.map(x => ({ ...x, cur: num(x.id) })));
    if (false) {
      const COL = ["--blue", "--orange", "--green"], vals = c.series.map(x => HS(x.id, num(x.id) || 0));
      const all = vals.flat(), lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo) * .1 || 1;
      return `<section class="card grow"><h2>${c.label} <em>24 Std.</em></h2>
        <div class="serleg">${c.series.map((x, i) => `<span><i style="background:var(${COL[i]})"></i>${x.label} <b>${valueOf(x.id).v} ${x.unit}</b></span>`).join("")}</div>
        ${lazy((W, H) => chartMulti(c.series.map((x, i) => ({ v: vals[i], color: css(COL[i]), fill: i === 0 })), { lo: lo - pad, hi: hi + pad, W, H }))}</section>`;
    }
    const now = HS(c.entity, c.base).at(-1);
    return `<section class="card grow"><h2>${c.label} <em><b class="hv">${fmt(now, c.dec)} ${c.unit}</b> · ${c.warn != null ? `Grenze ${fmt(c.warn)} ${c.unit}` : "24 Std."}</em></h2>${lazy((W, H) => chartSVG(c, 0, W, H))}</section>`;
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
      if (!isNaN(t) && !log.some(r => Math.abs(r[1] - t) < 30 * 60e3)) log.push([fw ? `Gestartet mit Firmware ${fw.split(".").slice(0, 3).join(".")}` : "Neu gestartet", t]); }
    log.sort((p, q) => q[1] - p[1]);
    if (!rest.length && !log.length) return "";
    const ms = rest.slice(0, 2);
    const hist = log.length ? `<div class="dlog"><h2>History</h2>${log.slice(0, rest.length ? 2 : 3).map(([t, w]) => `<div class="dl"><span>${t}</span><time>${whenTxt(w)}</time></div>`).join("")}</div>` : "";
    return `<section class="card wide msgs${hist ? " hasl" : ""}">${ms.length ? `<h2>Meldungen${d.msgs.length > 2 ? ` <em>+${d.msgs.length - 2} weitere</em>` : ""}</h2>${ms.map(m => `<div class="msg ${m[0]}"><i></i><div>${m[1]}<time>${m[2]}</time></div></div>`).join("")}` : ""}${hist}</section>`;
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
    values: (d, b) => b.style === "hw" ? hwCard(d, b) : b.style === "compact" ? compactCard(d, b) : b.style === "ifaces" ? ifacesCard(d, b) : b.items?.length && (b.style === "rings" ? ringsCard(d, b) : `<section class="card"><h2>${b.label || "Werte"}</h2><div class="grid t3">${b.items.map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1]).map(([ref, id]) => { const v = valueOf(id);
      const txt = v.n == null && String(v.v).length > 9;   // Text statt Zahl (z. B. Client-Name): kleiner, höchstens zwei Zeilen
      return `<div class="tile"><span class="k">${nameOf(b, ref, id)}</span><span class="v ${txt ? "txt" : ""}" ${txt ? `title="${String(v.v).replace(/"/g, "&quot;")}"` : ""}>${v.v}<small>${v.u}</small></span>${v.u === "%" && v.n != null ? `<div class="meter"><b style="width:${Math.max(0, Math.min(100, v.n))}%"></b></div>` : ""}</div>`; }).join("")}</div></section>`),
    bars: (d, b) => b.items?.length && (b.style === "thermo" ? thermoCard(d, b) : `<section class="card grow"><h2>${b.label || "Auslastung"}</h2><div class="bars2 ${b.items.length > 5 && b.size === "full" ? "two" : ""}">${b.items.map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1]).map(([ref, id]) => { const v = valueOf(id), lo = b.min ?? 0, hi = b.max ?? 100;
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
      const tr = dv == null || Math.abs(dv) < 1e-9 ? "" : `<span class="trd ${dv > 0 ? "up" : "dn"}">${dv > 0 ? "▲" : "▼"} ${fmt(Math.abs(dv), Math.abs(dv) < 10 ? 1 : 0)} ${o.v.u} <em>ggü. gestern</em></span>`;
      return `<section class="card mod statm"><span class="k">${o.label}</span><b class="sv" style="color:var(${b.warn != null || b.alert != null ? thrCol(b, o.v.n) : "--label"})">${o.v.v}<small>${o.v.u}</small></b>${tr}</section>`; },
    progress: (d, b) => { const o = oneEnt(d, b); if (!o) return ""; const lo = b.min ?? 0, hi = b.max ?? autoMax(o.v), p = frac(o.v.n, lo, hi);
      return `<section class="card mod prog"><div class="ph"><span class="k">${o.label}</span><b>${o.v.v}<small>${o.v.u}</small></b></div><div class="pbar"><i style="width:${(p * 100).toFixed(1)}%;background:var(${thrCol(b, o.v.n)})"></i></div><span class="gmm"><i>${fmt(lo)}</i><i>${fmt(hi)}</i></span></section>`; },
    histogram: (d, b) => { const o = oneEnt(d, b); if (!o) return ""; HIST.want.add(o.id); const h = HS(o.id, o.v.n ?? 0), bars = [];
      for (let i = 0; i < 24; i++) bars.push(((h[i * 2] ?? 0) + (h[i * 2 + 1] ?? h[i * 2] ?? 0)) / 2);
      const mx = Math.max(...bars, 1e-9), col = b.colors?.[0] || "--blue", now = new Date().getHours();
      return `<section class="card mod histo"><div class="ph"><span class="k">${o.label}</span><b>${o.v.v}<small>${o.v.u}</small></b></div>
        <div class="hb">${bars.map((v, i) => `<i style="height:${Math.max(3, v / mx * 100).toFixed(0)}%;background:var(${col});opacity:${i === 23 ? 1 : .55}" title="${fmt(v, 1)} ${o.v.u}"></i>`).join("")}</div>
        <span class="gmm"><i>${String((now + 1) % 24).padStart(2, "0")}:00</i><i>jetzt</i></span></section>`; },
    chips: (d, b) => { const ids = (b.items || []).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && st(x[1])); if (!ids.length) return "";
      if (b.style === "list") { const ICON = { ok: "✓", alert: "!", warn: "!", off: "–" };
        return `<section class="card mod stlist">${b.label ? `<h2>${b.label}</h2>` : ""}<div class="sts">${ids.map(x => [...x, lamp(x[1])]).sort((x, y) => ({ alert: 0, warn: 1 }[x[2]] ?? 2) - ({ alert: 0, warn: 1 }[y[2]] ?? 2)).map(([ref, id, l]) => { const v = valueOf(id);
          return `<div class="st ${l}"><i>${ICON[l] || "✓"}</i><span>${nameOf(b, ref, id)}</span><b>${v.v}${v.u ? " " + v.u : ""}</b></div>`; }).join("")}${(() => { const okn = ids.filter(x => !["alert", "warn"].includes(lamp(x[1]))); return okn.length ? `<div class="st ok sum"><i>✓</i><span>${okn.length === ids.length ? "Alles in Ordnung" : `${okn.length} weitere`}</span><b>ohne Problem</b></div>` : ""; })()}</div></section>`; }
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
    note: (d, b) => d.slots ? slotsCard(d) : (b.text || d.passive) && `<section class="card"><p class="note" style="margin:0">${b.text || "Passives Element ohne Sensoren. Im Editor der Integration lässt sich hier eine Belegung oder Notiz hinterlegen."}</p></section>`,
  };
  // Community-Module (modules/<typ>/render.js): bekommen nur ctx mit fertig aufbereiteten Werten und liefern HTML
  const escH = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  for (const [type, mod] of Object.entries(RD_MODULES)) {
    const render = mod.render, tr = s => rdIsDe() ? (mod.de?.[s] ?? s) : s;   // Module schreiben Englisch, „de“ übersetzt
    const meta = RD_CATALOG.blocks[type] || {};
    BLOCK_RENDER[type] = (d, b) => {
      const items = (b.items || (b.source ? [b.source] : [])).map(ref => [ref, entOf(ref, d.R)]).filter(x => x[1] && st(x[1])).map(([ref, id]) => { const s = st(id), v = valueOf(id);
        return { id, name: nameOf(b, ref, id), state: s.state, value: v.v, unit: v.u, number: v.n ?? null, status: lamp(id), available: ok(s), attributes: { ...s.attributes } }; });
      if (meta.items && !items.length) return "";
      const opt = k => b[k] ?? (meta.options || []).find(o => o.key === k)?.default;
      const ctx = { device: { id: d.id, name: d.name, model: d.model, state: d.state, off: !!d.off }, items, option: opt, fmt, esc: escH, t: tr, lang: () => RD_LANG };
      let html = "";
      try { html = render(ctx, b) || ""; } catch (err) { console.warn(`Rack Display: Modul ${type}:`, err); html = `<p class="note">${rdIsDe() ? "Fehler im Modul" : "Module error"} ${escH(type)}</p>`; }
      return html && `<section class="card mod mod-${type}">${b.label !== "" ? `<h2>${escH(b.label || meta.name || type)}</h2>` : ""}${html}</section>`;
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
        if (!html || (dim && !OFF_SKELETON.includes(b.type))) return dim ? `<section data-bi="${bi}" style="${stl}" class="gcell card offdim offph"><h2>${b.label || RD_CATALOG.blocks[b.type]?.name || b.type}</h2><p class="note">⏻ Aus</p></section>`
          : EDIT_HOOK ? `<section data-bi="${bi}" style="${stl}" class="gcell card empty-mod"><h2>${RD_CATALOG.blocks[b.type]?.name || b.type}</h2>${rdSkeleton(b.type)}</section>` : "";
        return html.replace(/<section class="/, `<section data-bi="${bi}" style="${stl}" class="gcell ${dim ? "offdim " : ""}`);
      }).join("");
      return `<div class="dgrid gm" style="--gc:12;--gr:${G.frows}">${cells}</div>`;
    }
    const items = [];
    for (const b of d.blocks) {
      if (b.type === "header" || !BLOCK_RENDER[b.type]) continue;
      const html = BLOCK_RENDER[b.type](d, b);
      if (html) items.push({ html, half: (b.size || RD_CATALOG.blocks[b.type]?.size) === "half" });
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
    if (d.off) return `<div class="dgrid nodata">${headCard(d)}<section class="card wide offc"><span class="offi">⏻</span><b>Ausgeschaltet</b><span>${d.offSince ? `seit ${new Date(d.offSince).toLocaleString(rdLoc(), { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}.` : "Das Gerät läuft nicht dauerhaft."} Sobald es eingeschaltet wird, erscheinen die Werte hier automatisch.</span>${d.options?.power_on && st(d.options.power_on) ? (() => { const arm = ARMED?.id === d.options.power_on && Date.now() - ARMED.t < 4000;
      return `<button class="actb pwron ${arm ? "armed" : ""}" data-press="${d.options.power_on}" data-confirm="Nochmal tippen zum Einschalten">${arm ? "Nochmal tippen zum Einschalten" : "⏻ Einschalten"}</button>`; })() : ""}</section></div>`;
    if (!d.noData) return renderBlocks(d);
    const mm = members(d.id), lo = Math.min(...mm.map(x => x.u)), hi = Math.max(...mm.map(x => x.u + x.h - 1));
    return `<div class="dgrid nodata"><section class="card wide"><div class="dhero">
      <div class="top"><div style="min-width:0"><h1 style="font:700 24px/1.1 var(--font-display);margin:0 0 4px">${d.name}</h1><div class="sub" style="color:var(--label-2);font-size:13px">${d.model} · HE ${lo}${hi > lo ? "–" + hi : ""}</div></div>
        <span class="chip warn"><i></i>Keine Daten</span></div>
      ${headThumb(d)}
      <p class="note" style="margin:6px 0 0">Mit diesem Gerät ist noch kein Home-Assistant-Gerät verknüpft. Sobald es eine Integration gibt (z. B. Unraid), lässt es sich im Editor verknüpfen; Temperaturen, Auslastung und Festplatten erscheinen dann hier.</p>
    </div></section></div>`;
  }

  // Wärmekarte (Rack → Aussehen → Wärmekarte): Geräte im Rack nach Temperatur einfärben, eigener Knopf „Wärme“
  function heatPaint() {
    const temps = DEVICES.filter(d => d.temp != null), can = !!RACK.heatmap && temps.length >= 2, seg = ROOT.querySelector(".rack-meta .seg");
    let btn = $("sideHeat");
    if (can && !btn && seg) { seg.insertAdjacentHTML("beforeend", `<button id="sideHeat" aria-pressed="false">Wärme</button>`); btn = $("sideHeat"); }
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
    else if (t.dataset.back !== undefined) { S.sel = null; }
    else if (t.id === "doorOpen" || t.id === "doorClosed" || t.id === "sideRear" || t.id === "sideHeat") {
      S.heat = t.id === "sideHeat";
      S.side = t.id === "sideRear" ? "rear" : "front"; S.door = t.id === "doorClosed";
      ["doorOpen", "doorClosed", "sideRear"].forEach(x => $(x).setAttribute("aria-pressed", x === t.id));
    }
    else return;
    if (S.sel !== prevSel) navAnim(S.sel ? "nav-in" : "nav-out");
    render();
  });
  let navT;
  function navAnim(cls) {
    WRAP.classList.remove("nav-in", "nav-out"); void WRAP.offsetWidth;
    WRAP.classList.add(cls); clearTimeout(navT); navT = setTimeout(() => WRAP.classList.remove(cls), 500);
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
  return {
    setRack(rack) { RAW = rack; rdForceLang(rack?.display?.lang); setTimeout(nightCheck, 0); HIST.want.clear(); DISC.clear(); buildModel(rack); computeWatch(); render(true); loadHistory(true); loadEvents(); },
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
      const d = id === "__ov" ? ovModel() : byId(id); if (!d) return false;
      const html = b.type === "header" ? headCard(d) : BLOCK_RENDER[b.type]?.(d, b); if (!html) { el.innerHTML = ""; return false; }
      const start = CHARTS.length; el.innerHTML = html;
      el.querySelectorAll(".cw").forEach(c => { const f = CHARTS[+c.dataset.ci]; if (+c.dataset.ci >= start && f) c.innerHTML = f(Math.max(120, c.clientWidth), Math.max(24, c.clientHeight || 40)); });
      CHARTS.length = start; return true;
    },
    hold(v) { HOLD = !!v; },
    destroy() { DEAD = true; clearInterval(timer); clearInterval(idleTimer); clearInterval(liveTimer); clearInterval(histTimer); clearTimeout(pending); ro.disconnect(); },
  };
}

/* ---------- Anzeigegröße: Rack in fester Display-Fläche, passend skaliert (oder ganze Fläche) ---------- */
// Anzeige-Geometrie: Auflösung + Diagonale → Skalierung (gleiche Schriftgröße in mm wie auf dem 7"-Pi) und Raster der Detailansicht
const RD_INCH = { "pi-portrait": 7, "pi-landscape": 7, hd: 10.1, "hd-portrait": 10.1, fhd: 23.8, tablet: 9.7, custom: 15.6 };
function rdGeometry(disp = {}) {
  const D = RD_CATALOG.displays, p = D.find(x => x.key === (disp.preset || "pi-portrait")) || D[0];
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
      <button class="pdu-hit" id="pduHit" data-id="pdu" aria-label="Stromleiste, Rückseite" hidden></button>
    </div>
    <div class="rack-meta">
      <div class="seg" role="group" aria-label="Tür">
        <button id="doorClosed" aria-pressed="true">Tür zu</button>
        <button id="doorOpen" aria-pressed="false">Tür offen</button>
        <button id="sideRear" aria-pressed="false">Rückseite</button>
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
  setConfig(config) { this._config = config || {}; }
  _applyDark() { if (!this._wrap) return; const dk = !!this._hass?.themes?.darkMode || this._wrap.classList.contains("night"); this._wrap.classList.toggle("dark", dk); this._stage?.classList.toggle("dark", dk); }
  getCardSize() { return 12; }
  set narrow(v) {} set route(v) {} set panel(v) {}
  set hass(h) {
    this._hass = h;
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
    this._app = createApp(this.shadowRoot, this._wrap);
    // Karte mit view: rack – nur Rack + Kopfzeile (mehrere Racks nebeneinander im Dashboard); Antippen öffnet das Gerät auf der Seite „Rack“
    if (isCard && this._config?.view === "rack") {
      this._wrap.classList.add("rack-only");
      this.shadowRoot.addEventListener("click", e => { const h = e.target.closest?.(".hits [data-id], #pduHit"); if (!h) return; e.stopPropagation(); e.preventDefault();
        history.pushState(null, "", `/rack?rack=${encodeURIComponent(this._rackId || "")}&sel=${encodeURIComponent(h.dataset.id)}`); window.dispatchEvent(new CustomEvent("location-changed")); }, true);
    }
    // Seite „Rack“ / Kiosk: nach einem Update der Integration selbst neu laden (Karten in Dashboards nicht)
    if (!isCard) this._vt = setInterval(() => rdNewVersion().then(v => v && location.reload()), 3 * 60e3);
    this._app.setHass(this._hass);
    await this._load();
    const unsub = await this._hass.connection.subscribeMessage(() => this._app && this._load(), { type: "rack_display/subscribe" });
    if (this._app) this._unsub = unsub; else unsub();  // während des Starts geschlossen
  }
  async _load() {
    const r = await this._hass.connection.sendMessagePromise({ type: "rack_display/racks" });
    if (!this._app) return;
    const want = this._config?.rack_id || new URLSearchParams(location.search).get("rack");   // /rack?rack=<id> zeigt ein anderes Rack
    const rack = r.racks.find(x => x.id === want) || r.racks[0];
    if (rack) { this._rackId = rack.id; rdFrame(this._stage, this._wrap, rack, (this._config?.layout === "fill" || this._config?.view === "rack")); this._app.setRack(rack);
      // /rack?sel=<Gerät> öffnet direkt das Popup (z. B. aus einer Rack-Karte im Dashboard)
      const sel = !this._selDone && new URLSearchParams(location.search).get("sel"); this._selDone = true; if (sel) setTimeout(() => this._app?.select(sel), 300); }
    else this._wrap.innerHTML = `<p style="padding:24px">Noch kein Rack angelegt.</p>`;
  }
  disconnectedCallback() {
    this._app?.destroy(); this._unsub?.(); this._stage?._ro?.disconnect(); clearInterval(this._vt);
    this._app = null; this._unsub = null; this._started = false;
  }
}
class RackDisplayPanel extends RackDisplayElement {}
class RackDisplayCard extends RackDisplayElement {}
if (!customElements.get("rack-display-panel")) customElements.define("rack-display-panel", RackDisplayPanel);
if (!customElements.get("rack-display-card")) customElements.define("rack-display-card", RackDisplayCard);
window.customCards = window.customCards || [];
if (!window.customCards.find(c => c.type === "rack-display-card")) {
  window.customCards.push({ type: "rack-display-card", name: "Rack Display", description: "Server-Rack mit Live-Werten" });
}

// Für den Editor: Anzeige-Kern als Vorschau wiederverwenden
window.__rackDisplay = { rdSkeleton, rdT, rdObserve, rdSetLang, rdForceLang, rdLoc, createApp, RD_HTML, RD_BASE, RD_VERSION, RD_CATALOG, rdNewVersion, rdFrame, rdGeometry };
