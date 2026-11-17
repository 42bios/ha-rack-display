/* Rack Display – Editor (Seite „Rack-Editor“, nur Administratoren).
   Rack anlegen, Geräte per Drag & Drop in Höheneinheiten setzen, Eigenschaften, HA-Gerät und Fotos pflegen.
   Rechts läuft die echte Anzeige als Live-Vorschau mit dem ungespeicherten Stand. */
const RDE_BASE = "/rack_display/frontend";
const RDE_VERSION = "@@VERSION@@";
// Texte der aktuellen Sprache (i18n/<sprache>.json), aus dem Anzeige-Kern
const TR = (...a) => window.__rackDisplay.TR(...a);

// Vorlagen der Palette (Gerätetyp, Standardhöhe, passiv, Seite)
const RDE_PALETTE = () => [
  { group: TR("network"), items: [
    { key: "gw", name: "Gateway", template: "gw", h: 1 },
    { key: "switch", name: "Switch", template: "switch", h: 1 },
    { key: "sfp", name: TR("sfp_switch"), template: "sfp", h: 1 },
    { key: "ks", name: TR("patch_panel"), template: "ks", h: 1, passive: true },
    { key: "lwl", name: TR("fibre_patch_panel"), template: "lwl", h: 1, passive: true },
  ] },
  { group: TR("servers_storage"), items: [
    { key: "server1", name: TR("server_1_u"), template: "server", h: 1 },
    { key: "server2", name: TR("server_2_u"), template: "server", h: 2 },
    { key: "server4", name: TR("server_4_u"), template: "server", h: 4 },
    { key: "nvr", name: TR("recorder"), template: "nvr", h: 1 },
    { key: "generic", name: TR("generic_device"), template: "generic", h: 1 },
  ] },
  { group: TR("power"), items: [
    { key: "ups", name: TR("ups"), template: "ups", h: 2 },
    { key: "batt", name: TR("battery_pack"), template: "ups", h: 1 },
    { key: "pdu", name: TR("pdu_rear"), template: "pdu", h: 1, side: "rear0u" },
  ] },
  { group: TR("accessories"), items: [
    { key: "shelf", name: TR("shelf"), template: "shelf", h: 2, passive: true },
    { key: "frame", name: TR("module_frame"), template: "frame", h: 2, passive: true },
    { key: "cm", name: TR("cable_management"), template: "cm", h: 1, passive: true },
    { key: "bl", name: TR("blanking_panel"), template: "bl", h: 1, passive: true },
  ] },
];
const RDE_TEMPLATES = () => [
  ["gw", "Gateway"], ["switch", "Switch"], ["sfp", TR("sfp_switch")], ["server", "Server"], ["fanpanel", TR("server_with_fan_panel")],
  ["nvr", TR("recorder")], ["ups", TR("ups_battery")], ["pdu", TR("pdu")], ["shelf", TR("shelf")], ["generic", TR("general")],
  ["ks", TR("patch_panel")], ["lwl", TR("fibre_patch_panel")], ["frame", TR("module_frame")], ["cm", TR("cable_management")], ["bl", TR("blanking_panel")],
];
const RDE_PASSIVE = ["ks", "lwl", "cm", "bl", "frame", "patch", "blank"];
const SLOT_W = { cloudkey: 3 };

// Rückfragen in der Sprache der Oberfläche
const rdAsk = s => confirm(window.__rackDisplay?.rdT ? window.__rackDisplay.rdT(s) : s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const RDE_CSS = `/*@@EDITOR_CSS@@*/`;

// Bearbeitungsgriffe in der Vorschau (liegen im Schatten-DOM der Vorschau, nutzen deren Farben)
const RDE_EDIT_CSS = `/*@@EDITOR_PREVIEW_CSS@@*/`;
class RackDisplayEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); this.sel = null; this.dirty = false; this.msg = ""; this.err = false; }
  // HA setzt hass/panel/… oft schon, bevor dieses Element definiert ist (der Lader holt den Code asynchron).
  // Solche Werte liegen dann als eigene Felder am Element und verdecken die Setter – hier nachreichen.
  connectedCallback() { for (const k of ["narrow", "route", "panel", "hass"]) if (Object.prototype.hasOwnProperty.call(this, k)) { const v = this[k]; delete this[k]; this[k] = v; } }
  set narrow(v) {} set route(v) {} set panel(v) {}
  set hass(h) {
    this._hass = h;
    if (!this._init) { this._init = true; this._start(); }
    else this._app?.setHass(h);
  }

  async _start() {
    const mk = n => { try { performance.mark("rde:" + n); } catch (x) { /* egal */ } };   // Messpunkte (DevTools → Leistung)
    this._mk = mk; mk("start");
    this.shadowRoot.innerHTML = `<style>${RDE_CSS}</style><div class="ed"><div class="top" id="top"></div>
      <div class="work" id="work"><aside class="drawer" id="left"></aside><aside class="drawer lib" id="lib"></aside><div class="pvbox" id="pvbox"><div class="preview" id="pv"></div></div>
      <div class="toast" id="toast" hidden></div><input type="file" id="pfile" accept="image/jpeg,image/png,image/webp" hidden data-upload="front_image"></div></div>`;
    const $ = id => this.shadowRoot.getElementById(id);
    this.$ = $;
    // Anzeige-Kern laden (ist meist schon da, weil die Karte global geladen wird)
    if (!window.__rackDisplay) await import(`${RDE_BASE}/rack-display.app.js?v=${RDE_VERSION}`);
    const core = window.__rackDisplay; mk("core");
    core.rdSetLang(this._hass); core.rdObserve(this.shadowRoot);
    // Sprachwechsel (HA-Benutzer oder Rack → Anzeige → Sprache): Editor neu zeichnen
    core.rdOnLang(() => { if (this.rack) this.render(); });
    $("top").innerHTML = `<div><h1>${TR("rack_editor")}</h1><div class="sub">${TR("loading")}</div></div>`;
    const pv = $("pv").attachShadow({ mode: "open" });
    pv.innerHTML = `<link rel="stylesheet" href="${core.RD_BASE}/rack-display.css?v=${core.RD_VERSION}"><div class="stage ${this._hass.themes?.darkMode ? "dark" : ""}"><div class="rd ${this._hass.themes?.darkMode ? "dark" : ""}">${core.RD_HTML}</div></div>`;
    const stage = pv.querySelector(".stage"), wrap = pv.querySelector(".rd");
    this._frame = rack => core.rdFrame(stage, wrap, rack, false);
    this._app = core.createApp(pv, wrap);
    this._pvRoot = pv;
    new ResizeObserver(() => { clearTimeout(this._rz); this._rz = setTimeout(() => this.fitPreview(), 80); }).observe($("pvbox"));
    pv.appendChild(Object.assign(document.createElement("style"), { textContent: RDE_EDIT_CSS }));
    this._app.onPanel(() => this.decorate());
    this._bindPreview(pv);
    this._app.setHass(this._hass);

    // Geräte und Entitäten hat das HA-Frontend schon im Speicher (hass.devices / hass.entities) – das volle
    // Entitätsregister (mehrere MB) wird nur geladen, wenn es diese Daten nicht gibt (sehr alte HA-Versionen).
    const H = this._hass, ask = type => H.connection.sendMessagePromise({ type });
    const [racks, devs, ents] = await Promise.all([
      ask("rack_display/racks"),
      H.devices ? Object.values(H.devices) : ask("config/device_registry/list"),
      H.entities ? Object.values(H.entities) : ask("config/entity_registry/list"),
    ]);
    mk("data");
    this.entDevice = Object.fromEntries(ents.filter(x => !x.disabled_by).map(x => [x.entity_id, x.device_id]));
    this.entName = Object.fromEntries(ents.filter(x => x.name || x.original_name).map(x => [x.entity_id, x.name || x.original_name]));
    const junk = n => /^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i.test(n) || /^[0-9a-f]{12,}/i.test(n) || /^0x[0-9a-f]{8,}$/i.test(n);
    this.haDevices = devs.filter(d => !d.disabled_by && (d.name_by_user || d.name) && !junk(d.name_by_user || d.name)).map(d => ({ id: d.id, name: d.name_by_user || d.name, model: d.model || "", maker: d.manufacturer || "" }))
      .sort((a, b) => a.name.localeCompare(b.name, "de"));
    // Welches Rack bearbeitet wird: ?rack=<id> in der Adresse, sonst das erste
    this.rackIds = racks.racks.map(r => [r.id, r.name]);
    let saved = null; try { saved = localStorage.getItem("rack-display-editor-rack"); } catch (e) { /* ohne Speicher */ }
    const want = new URLSearchParams(location.search).get("rack") || saved, first = racks.racks.find(r => r.id === want) || racks.racks[0];
    this.rack = first ? structuredClone(first) : { id: "rack", name: TR("my_rack"), units: 42, style: {}, power: {}, zones: [], wled: {}, devices: [] }; this.resetHistory();
    if (!first) this.dirty = true;
    this._bind();
    this.render(); mk("render");
    // Neue Version auf dem Server? Hinweis statt automatischem Neuladen (ungespeicherte Änderungen!)
    this._vt = setInterval(async () => { if (!this.newVersion && await window.__rackDisplay.rdNewVersion?.()) { this.newVersion = true; this.renderTop(); } }, 3 * 60e3);
  }

  /* ---------- Hilfen ---------- */
  front() { return this.rack.devices.filter(d => d.side !== "rear0u"); }
  devAt(u) { return this.front().find(d => u >= d.u && u < d.u + d.h); }
  // Blenden geben Platz frei: ein Gerät darf über eine Blende gezogen werden, die Blende fällt dann weg
  static filler(d) { return ["bl", "blank"].includes(d?.template); }
  fits(u, h, ignore, strict) {
    if (u < 1 || u + h - 1 > this.rack.units) return false;
    return !this.front().some(d => d.id !== ignore && !(!strict && RackDisplayEditor.filler(d)) && u < d.u + d.h && d.u < u + h);
  }
  clearFillers(u, h, keep) {
    const gone = this.rack.devices.filter(d => d.id !== keep && d.side !== "rear0u" && RackDisplayEditor.filler(d) && u < d.u + d.h && d.u < u + h);
    if (gone.length) this.rack.devices = this.rack.devices.filter(d => !gone.includes(d));
    return gone.length;
  }
  newId(name) {
    const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20) || "geraet";
    let id = base, i = 2; while (this.rack.devices.some(d => d.id === id)) id = `${base}-${i++}`;
    return id;
  }
  // Kurzer Hinweis mit „Rückgängig“ (ersetzt Rückfragen beim Löschen und bestätigt Verschieben/Größe)
  toast(text) {
    let T = this.$("toast"); if (!T) return;
    T.innerHTML = `<span>${esc(text)}</span><button data-act="undo">${TR("undo")}</button>`; T.hidden = false;
    clearTimeout(this._tt); this._tt = setTimeout(() => { T.hidden = true; }, 5000);
  }
  changed() { this.dirty = true; this.msg = ""; this.err = false; this.snap(); this.renderTop(); this.preview(); }
  // Rückgängig/Wiederholen: Zustände des Racks; Tippen in einem Feld wird zu einem Schritt zusammengefasst
  resetHistory() { this._undo = [JSON.stringify(this.rack)]; this._redo = []; clearTimeout(this._ht); }
  snap(now) {
    clearTimeout(this._ht);
    const push = () => { const j = JSON.stringify(this.rack); if (j !== this._undo.at(-1)) { this._undo.push(j); if (this._undo.length > 60) this._undo.shift(); this._redo = []; this.renderTop(); } };
    if (now) push(); else this._ht = setTimeout(push, 450);
  }
  undo(redo) {
    this.snap(true);
    const from = redo ? this._redo : this._undo;
    if (redo ? !from.length : from.length < 2) return;
    if (redo) this._undo.push(from.pop()); else this._redo.push(from.pop());
    this.rack = JSON.parse(this._undo.at(-1));
    if (this.sel && !this.rack.devices.some(d => d.id === this.sel)) this.sel = null;
    this.dirty = true; this.msg = ""; this.render(); this._app?.select(this.sel || null);
  }
  fitPreview() {
    const D = this.catalog?.displays || [], disp = this.rack?.display || {}, p = D.find(x => x.key === (disp.preset || "pi-portrait")) || {};
    const w = p.key === "custom" ? +disp.w || 480 : p.w, h = p.key === "custom" ? +disp.h || 800 : p.h;
    const pv = this.$("pv"), wk = this.$("pvbox"); if (!pv || !wk) return;
    const g = window.__rackDisplay?.rdGeometry?.(disp), rw = g && !g.fill ? g.lw : w || 480, rh = g && !g.fill ? g.lh : h || 800;
    const k = Math.min(Math.max(200, wk.clientWidth - 8) / rw, Math.max(200, wk.clientHeight - 8) / rh);
    pv.style.width = `${Math.round(rw * k)}px`; pv.style.height = `${Math.round(rh * k)}px`;
  }
  preview() {
    clearTimeout(this._pt);
    this._pt = setTimeout(() => {
      // Vorschau-Kasten im Seitenverhältnis der gewählten Anzeige
      const D = this.catalog.displays || [], disp = this.rack.display || {}, p = D.find(x => x.key === (disp.preset || "pi-portrait")) || {};
      const w = p.key === "custom" ? +disp.w || 480 : p.w, h = p.key === "custom" ? +disp.h || 800 : p.h;
      const pv = this.$("pv"), wk = this.$("pvbox"), aw = Math.max(200, wk.clientWidth - 8), ah = Math.max(200, wk.clientHeight - 8);
      const g = window.__rackDisplay?.rdGeometry?.(disp), rw = g && !g.fill ? g.lw : w || 480, rh = g && !g.fill ? g.lh : h || 800;
      const k = Math.min(aw / rw, ah / rh);
      pv.style.width = `${Math.round(rw * k)}px`; pv.style.height = `${Math.round(rh * k)}px`;
      this._frame(this.rack); this._app.setRack(structuredClone(this.rack));
    }, 120);
  }

  /* ---------- Darstellung ---------- */
  // Katalog (Module, Vorlagen, Displays) in der aktuellen Sprache, aus dem Anzeige-Kern
  get catalog() { return window.__rackDisplay.RD_CATALOG; }
  render() { this.renderTop(); this.renderLeft(); this.renderLib(); this.renderMid(); this.preview(); }
  renderTop() {
    const used = this.front().reduce((a, d) => a + d.h, 0);
    this.$("top").innerHTML = `<div><h1>${TR("rack_editor")}</h1><div class="sub">${TR("n_n_u_n_used_n_items", esc(this.rack.name), this.rack.units, used, this.rack.devices.length)}</div></div>
      ${(this.rackIds?.length || 0) > 1 ? `<select class="rsel" data-act-rack title="${TR("choose_rack")}">${this.rackIds.map(([id, n]) => `<option value="${esc(id)}" ${id === this.rack.id ? "selected" : ""}>${esc(n)}</option>`).join("")}</select>` : ""}
      <span class="sp"></span>
      ${this.newVersion ? `<button class="btn" data-act="reload" title="${TR("the_editor_was_updated")}">${TR("new_version_reload")}</button>` : ""}
      <button class="btn icon" data-act="undo" title="${TR("undo_z")}" ${(this._undo?.length || 0) > 1 ? "" : "disabled"}>↶</button>
      <button class="btn icon" data-act="redo" title="${TR("redo_z")}" ${this._redo?.length ? "" : "disabled"}>↷</button>
      <span class="status ${this.err ? "err" : this.dirty ? "dirty" : ""}">${esc(this.msg || (this.dirty ? TR("unsaved_changes") : TR("saved")))}</span>
      <button class="btn" data-act="discard" ${this.dirty ? "" : "disabled"}>${TR("discard")}</button>
      <button class="btn primary" data-act="save" ${this.dirty ? "" : "disabled"}>${TR("save")}</button>`;
  }
  // Ebenen der linken Spalte: Rack → Gerät → Modul; die tiefere ersetzt die höhere, die Pfadzeile führt zurück
  level() { const d = this.dev(); return d && this._drawer === "module" && this.blocks(d)[this._selBlk] ? "module" : d ? "device" : "rack"; }
  drawerHead(title) {
    const lv = this.level(), d = this.dev(), b = lv === "module" ? this.blocks(d)[this._selBlk] : null;
    const crumb = (k, t, on) => on ? `<button class="cr" data-go="${k}">${esc(t)}</button>` : `<b class="cr cur">${esc(t)}</b>`;
    const parts = [crumb("rack", this.rack.name || "Rack", lv !== "rack")];
    if (d) parts.push(crumb("device", d.id === "__ov" ? TR("overview") : d.name, lv === "module"));
    if (b) parts.push(crumb("module", b.label || this.catalog.blocks[b.type]?.name || b.type, false));
    return `<div class="dh crumbs">${lv !== "rack" ? `<button class="btn icon up" data-go="up" title="${TR("up_one_level_esc")}" aria-label="${TR("back")}">‹</button>` : ""}<nav>${parts.join('<span class="sep">›</span>')}</nav></div>`;
  }
  libHead(title, sub) { return `<div class="dh"><b>${esc(title)}</b>${sub ? `<em class="dsub">${esc(sub)}</em>` : ""}</div>`; }
  openDrawer(kind) { if (kind === "add") { this._lib = "add"; this.renderLib(); return; } this._drawer = kind; this.renderLeft(); this.renderLib(); }
  // Ebene wechseln (Pfadzeile, Esc, Zurück in der Vorschau)
  go(k) {
    if (k === "up") k = this.level() === "module" ? "device" : "rack";
    if (k === "rack") { this.sel = null; this._selBlk = null; this._drawer = "rack"; this._lib = null; this._q = ""; this._app?.select(null); }
    else if (k === "device") { this._selBlk = null; this._drawer = "device"; this._pickBlk = null; }
    this.renderTop(); this.renderLeft(); this.renderLib(); this.decorate();
  }
  renderLib() {
    const L = this.$("lib"); if (!L) return;
    const d = this.dev(), mods = d && !(d.passive || RDE_PASSIVE.includes(d.template));
    if (this._lib !== "add" || d) this._lib = mods ? "modules" : "add";
    L.hidden = false;
    if (this._lib === "add") return this.renderAdd();
    this.renderModLib();
  }
  // Modul-Bibliothek: echte Vorschau jedes Moduls mit den Daten des Geräts; antippen oder ziehen = hinzufügen
  libSamples(d) {
    // Entitäten des Geräts: aus dem HA-Gerät, der automatischen Zuordnung und den vorhandenen Modulen
    const isOv = d.id === "__ov", src = isOv ? this.rack.devices : [d];
    const known = new Set(src.flatMap(x => [...Object.values(x.map?.roles || {}), ...(JSON.stringify(x.blocks || []).match(/\b(sensor|binary_sensor)\.[a-z0-9_]+/g) || [])]));
    const own = Object.keys(this._hass.states).filter(id => (known.has(id) || (this.entDevice[id] && (d.ha_devices || []).includes(this.entDevice[id]))) && !isNaN(parseFloat(this._hass.states[id].state)));
    const unit = id => this._hass.states[id].attributes.unit_of_measurement || "";
    const pct = own.filter(id => unit(id) === "%"), temp = own.filter(id => unit(id) === "°C"), any = own.filter(id => unit(id));
    const S = [], strip = id => { let n = this._hass.states[id].attributes.friendly_name || id; for (const pre of [d.name, ...(d.ha_devices || []).map(x => this.haDevices.find(h => h.id === x)?.name)].filter(Boolean)) if (n.toLowerCase().startsWith(pre.toLowerCase() + " ")) n = n.slice(pre.length + 1); return n; };
    const names = ids => Object.fromEntries(ids.map(id => [id, strip(id)]));
    for (const [k, v] of Object.entries(this.catalog.blocks)) {
      if (["header", "note", "tiles", "gauge", "ring", "stat", "progress", "histogram", "chips", "switch", "button", "camera", "heading", "clock"].includes(k)) continue;
      if (k.startsWith("ov_") !== isOv && !["values", "entity", "bars", "chart", "status"].includes(k)) continue;   // Übersichtskarten nur in der Übersicht, Gerätemodule nur bei Geräten
      if (k === "entity") { if (any[0]) { S.push({ type: "entity", items: [any[0]], names: names([any[0]]), _n: TR("single_value") }); S.push({ type: "entity", style: "chart", items: [any[0]], names: names([any[0]]), _n: TR("single_value_with_curve") }); } continue; }
      if (k === "values") { if (pct.length) { S.push({ type: "values", style: "rings", items: pct.slice(0, 4), names: names(pct.slice(0, 4)), _n: TR("values_with_curves") }); S.push({ type: "values", items: pct.slice(0, 3), names: names(pct.slice(0, 3)), _n: TR("values_as_tiles") }); } continue; }
      if (k === "bars") { if (temp.length) S.push({ type: "bars", style: "thermo", items: temp.slice(0, 6), names: names(temp.slice(0, 6)), label: TR("temperatures"), _n: TR("temperatures") }); if (pct.length) S.push({ type: "bars", items: pct.slice(0, 4), names: names(pct.slice(0, 4)), _n: TR("bars") }); continue; }
      if (k === "chart") { const src = temp.length ? temp.slice(0, 2) : any.slice(0, 2); if (src.length) { S.push({ type: "chart", style: "trace", items: src, names: names(src), label: TR("history_2"), _n: TR("trackable_history") }); S.push({ type: "chart", items: src, names: names(src), label: TR("history_2"), _n: TR("curves") }); } continue; }
      if (k === "status") { continue; }
      S.push({ type: k, _n: v.name });
    }
    const all = Object.keys(this._hass.states), mine = all.filter(id => known.has(id) || (this.entDevice[id] && (d.ha_devices || []).includes(this.entDevice[id])));
    const pick = (doms, n = 3) => { const own = mine.filter(id => doms.includes(id.split(".")[0])); return (own.length ? own : all.filter(id => doms.includes(id.split(".")[0]))).slice(0, n); };
    const one = pct[0] || temp[0] || any[0];
    if (one) {
      S.push({ type: "gauge", items: [one], names: names([one]), _n: TR("gauge") }, { type: "ring", items: [one], names: names([one]), _n: "Ring" },
        { type: "stat", items: [one], names: names([one]), _n: TR("key_figure_2") }, { type: "progress", items: [one], names: names([one]), _n: TR("progress") },
        { type: "histogram", items: [one], names: names([one]), _n: TR("bar_chart") });
    }
    const bin = pick(["binary_sensor", "device_tracker"], 4); if (bin.length) S.push({ type: "chips", items: bin, names: names(bin), _n: TR("status_chips") });
    const sw = pick(["switch", "light", "fan", "input_boolean"], 3); if (sw.length) S.push({ type: "switch", items: sw, names: names(sw), _n: TR("switches_2") });
    const bt = pick(["button", "script", "scene", "input_button"], 3); if (bt.length) S.push({ type: "button", items: bt, names: names(bt), _n: TR("actions") });
    const cam = pick(["camera"], 1); if (cam.length) S.push({ type: "camera", items: cam, names: names(cam), _n: TR("camera") });
    S.push({ type: "heading", label: d.name, text: d.model || TR("section"), _n: TR("heading") }, { type: "clock", _n: TR("clock") });
    S.push({ type: "note", text: TR("note_enter_text_in_the_module_panel"), _n: TR("note") });
    // Jedes Modul mindestens einmal anbieten – auch ohne passende Daten (dann ausgegraut, Entitäten später im Modul wählen)
    const seen = new Set(S.map(x => x.type));
    for (const [k, v] of Object.entries(this.catalog.blocks)) if (!seen.has(k) && !["header", "tiles"].includes(k) && (isOv ? !["ports", "poe", "system", "internet", "flow", "voltage", "outlets", "disks", "recording", "messages"].includes(k) : !k.startsWith("ov_"))) S.push({ type: k, _n: v.name, _empty: true });
    return S;
  }
  renderModLib() {
    const d = this.dev(), L = this.$("lib");
    const GR = { ...(this.catalog.groups || {}) }, FREE = ["values", "entity", "bars", "chart", "status", "note", "gauge", "ring", "stat", "progress", "histogram", "chips", "switch", "button", "camera", "heading", "clock"];
    this._libSamples = this.libSamples(d);
    const have0 = new Set(this.blocks(d).map(b => b.type)), rec = this.recent();
    // Schon im Popup vorhandene Module ans Ende ihrer Gruppe
    this._libSamples = this._libSamples.map((b, i) => [b, i]).sort((x, y) => ((!FREE.includes(x[0].type) && have0.has(x[0].type)) - (!FREE.includes(y[0].type) && have0.has(y[0].type))) || x[1] - y[1]).map(x => x[0]);
    const recIdx = rec.map(t => this._libSamples.findIndex(b => b.type === t && !b._empty)).filter(i => i >= 0);
    const groups = [...(recIdx.length ? ["_recent"] : []), ...[...new Set(this._libSamples.map(b => this.catalog.blocks[b.type]?.group || "sonstiges"))].sort((x, y) => Object.keys(GR).indexOf(x) - Object.keys(GR).indexOf(y))];
    GR._recent ||= TR("recently_used");
    L.innerHTML = this.libHead(TR("modules"), TR("tap_or_drag_into_the_popup")) + `<input class="libq" id="libq" placeholder="${TR("search_modules")}" value="${esc(this._libQ || "")}">
      <div class="libchips"><button data-libg="" class="${this._libG ? "" : "on"}">${TR("all")}</button>${groups.map(g => `<button data-libg="${g}" class="${this._libG === g ? "on" : ""}">${esc(GR[g] || g)}</button>`).join("")}</div>
      ${groups.map(g => `<div class="libsec" data-g="${g}"><div class="libgrp">${esc(GR[g] || g)}</div><div class="libgrid" data-grid="${g}"></div></div>`).join("")}
      <p class="hint">${TR("sizes_as_in_the_popup_preview_with_data_from_n", esc(d.name))}</p>`;
    const dark = !!this._hass.themes?.darkMode, core = window.__rackDisplay, have = new Set(this.blocks(d).map(b => b.type));
    // Maßstab: Breite der Bibliothek = 12 Spalten des Popups; Höhe in Zeilen wie im Raster
    const geo = core.rdGeometry?.(this.rack.display || {}) || {}, cellW = ((geo.lw || 480) - 16) / 12, rowH = ((geo.lh || 800) - 66) / (geo.frows || 15);
    [...recIdx.map(i => [i, "_recent"]), ...this._libSamples.map((_, i) => [i, null])].forEach(([i, gg]) => { const b = this._libSamples[i];
      const def = this.catalog.blocks[b.type] || {}, g = gg || def.group || "sonstiges", grid = L.querySelector(`[data-grid="${g}"]`), dup = !FREE.includes(b.type) && have.has(b.type);
      const lay = this.layDefault(b), pw = Math.round(lay.w * cellW), ph = Math.round(lay.h * rowH);
      const it = document.createElement("button"); it.className = `libit ${dup ? "has" : ""}`; it.draggable = true; it.dataset.libI = i; it.title = `${def.desc || ""}${dup ? " · " + TR("already_in_the_popup") : ""}`;
      it.dataset.q = `${b._n} ${def.name || ""} ${def.desc || ""} ${b.type}`.toLowerCase(); it.style.gridColumn = `span ${lay.w}`;
      const view = document.createElement("div"); view.className = "lview"; const host = document.createElement("div"); host.className = "lhost"; view.appendChild(host); it.appendChild(view);
      it.insertAdjacentHTML("beforeend", `<span class="lname">${esc(b._n)}<em>${lay.w} × ${lay.h}${dup ? " · " + TR("in_the_popup") : ""}</em></span>`);
      grid.appendChild(it); it._pw = pw; it._ph = ph;
      const sh = host.attachShadow({ mode: "open" });
      sh.innerHTML = `<link rel="stylesheet" href="${core.RD_BASE}/rack-display.css?v=${core.RD_VERSION}"><style>.ph{gap:6px;justify-content:center;border-style:dashed !important}.ph h2{margin:0 !important}.ph p{margin:0;font-size:14px;color:var(--label-2)}.ph span{font-size:12px;color:var(--label-3)}.rd{container-type:normal !important;width:${pw}px !important;height:${ph}px !important;overflow:hidden !important;padding:0;background:transparent !important;transform-origin:0 0}.slot{width:${pw}px;height:${ph}px;container:card/size}.slot>.card{display:flex;flex-direction:column;height:100% !important;min-height:0 !important;overflow:hidden;margin:0}.dgrid{display:block}</style><div class="rd ${dark ? "dark" : ""}"><div class="dgrid"><div class="slot"></div></div></div>`;
      const slot = sh.querySelector(".slot"), rd = sh.querySelector(".rd"); core.rdObserve?.(sh);
      const fit = () => { const k = (view.clientWidth || 1) / pw; rd.style.transform = `scale(${k})`; view.style.height = `${Math.round(ph * k)}px`; };
      new ResizeObserver(fit).observe(view);
      const draw = () => { fit(); if (!b._empty && this._app.renderBlockInto(slot, d.id, b)) return;
        it.classList.add("nodata"); it.title = TR("n_no_data_for_n_yet_choose_entities_in_the", def.desc || "", d.name);
        slot.innerHTML = `<section class="card ph"><h2>${esc(def.name || b._n)}</h2>${core.rdSkeleton?.(b.type) || `<p>${esc(def.desc || "")}</p>`}<span>${def.items ? TR("choose_entities_after_adding") : TR("no_data_for_this_device")}</span></section>`; };
      const css = sh.querySelector("link"); if (css.sheet) draw(); else { css.addEventListener("load", draw, { once: true }); setTimeout(() => { if (!slot.innerHTML) draw(); }, 800); }
    });
  }
  remember(type) { try { const k = "rack-display-editor-recent", a = JSON.parse(localStorage.getItem(k) || "[]").filter(x => x !== type); a.unshift(type); localStorage.setItem(k, JSON.stringify(a.slice(0, 6))); } catch (e) { /* ohne Speicher */ } }
  recent() { try { return JSON.parse(localStorage.getItem("rack-display-editor-recent") || "[]"); } catch (e) { return []; } }
  ensureGrid(d) {
    if (!d || d.options?.grid || d.group || d.passive || RDE_PASSIVE.includes(d.template)) return;
    d.options ||= {}; d.options.grid = true; const L = this.blocks(d); L.forEach(b => b.layout ||= this.layDefault(b));
    // Standardgrößen passen nicht immer ins Raster des Displays: größte Module Zeile um Zeile verkleinern (nicht unter ihre Mindesthöhe)
    const R = this.layRows();
    for (let n = 0; n < 60 && this.layPack(L) > R; n++) {
      // erst Nebensächliches (Meldungen, Kurven, Werte), dann der Kopf, zuletzt die Hauptmodule (Ports, Fluss, Schächte …)
      const P = { messages: 0, note: 0, chips: 0, chart: 1, values: 1, bars: 1, system: 1, histogram: 1, header: 2 };
      const c = L.filter(b => !Number.isInteger(b.layout.y) && b.layout.h > this.layMin(b).h).sort((x, y) => (P[x.type] ?? 3) - (P[y.type] ?? 3) || L.indexOf(y) - L.indexOf(x))[0];
      if (!c) break; c.layout = { ...c.layout, h: c.layout.h - 1 };
    }
  }
  // Gerät öffnen (aus dem Rack oder der Auswahl oben)
  openDev(id) {
    const d = id === "__ov" ? this.ovDev() : this.rack.devices.find(x => x.id === id); if (!d) return;
    this.sel = id; this.ensureGrid(d); this._addU = null; this._pickBlk = null; this._q = "";
    this._drawer = "device"; this._lib = null; this._selBlk = null;
    this.renderTop(); this.renderLeft(); this.renderLib(); this.preview(); setTimeout(() => this._app.select(id === "__ov" ? null : id), 150);
  }
  libFilter() {
    const L = this.$("lib"); if (!L) return; const q = (this._libQ || "").toLowerCase().trim(), g = this._libG || "";
    L.querySelectorAll(".libsec").forEach(sec => { let n = 0;
      sec.querySelectorAll(".libit").forEach(it => { const show = (!g || sec.dataset.g === g) && (!q || it.dataset.q.includes(q)); it.hidden = !show; if (show) n++; });
      sec.hidden = !n; });
  }
  addFromLib(i, at) {
    const d = this.dev(), s = this._libSamples?.[i]; if (!d || !s) return;
    const L = this.blocks(d), b = JSON.parse(JSON.stringify(s)); delete b._n; delete b._empty;
    if (d.options?.grid) { b.layout = this.layDefault(b); if (at) { const p = { ...b.layout, x: Math.max(0, Math.min(12 - b.layout.w, at[0])), y: Math.max(0, at[1]) }; this.layFix(L); if (!this.layHit(L.concat(b), L.length, p)) Object.assign(b.layout, p); } }
    L.push(b); this._selBlk = L.length - 1; this._drawer = "module"; this.remember(b.type);
    this.changed(); this.snap(true); this.renderLeft(); this.toast(TR("n_added", s._n));
  }
  renderLeft() {
    const L = this.$("left"); if (!L) return;
    L.hidden = false;
    if (this.dev()) { if (this._drawer !== "module") this._drawer = "device"; return this.renderSheet(); }
    this._drawer = "rack";
    const s = this.rack.style || {}, outside = this.front().filter(d => d.u + d.h - 1 > this.rack.units);
    const sec = (k, t, body, extra) => this.sec(k, t, body, extra), units = this.front().reduce((a, d) => a + d.h, 0);
    const devs = this.rack.devices.filter(d => !RackDisplayEditor.filler(d)).sort((a, b) => (a.side === "rear0u") - (b.side === "rear0u") || (b.u || 0) - (a.u || 0));
    L.innerHTML = this.drawerHead() + `${outside.length ? `<div class="found over">${TR("n_devices_do_not_fit", outside.length, this.rack.units)} ${outside.map(d => `<button class="btn" data-place="${esc(d.id)}">${TR("insert_n", esc(d.name))}</button>`).join(" ")}</div>` : ""}<div class="card sheet">
      ${sec("devs", TR("devices"), `<div class="dlist"><button class="dl ov" data-open-dev="__ov"><span class="du">▦</span><b>${TR("overview")}</b><small>${TR("home_page_next_to_the_rack")}</small></button>
        ${(() => { const isP = d => d.passive || RDE_PASSIVE.includes(d.template), row = d => { const passive = isP(d); return `<button class="dl ${passive ? "passive" : ""}" data-open-dev="${esc(d.id)}"><span class="du">${d.parent ? "▤" : d.side === "rear0u" ? "0" : d.h > 1 ? `${d.u}–${d.u + d.h - 1}` : d.u}</span><b>${esc(d.name)}</b><small>${esc(d.model || RDE_TEMPLATES().find(t => t[0] === d.template)?.[1] || "")}</small>${passive ? "" : `<i class="ha ${d.ha_devices?.length ? "on" : ""}" title="${d.ha_devices?.length ? TR("linked_to_home_assistant") : TR("not_linked_2")}"></i>`}</button>`; };
          const act = devs.filter(d => !isP(d)), pas = devs.filter(isP);
          return act.map(row).join("") + (pas.length ? `</div>${this.sec("passive", TR("passive_elements"), `<div class="dlist">${pas.map(row).join("")}</div>`, `${pas.length}`)}<div class="dlist">` : ""); })()}</div>
        <p class="hint">${TR("tap_to_edit_in_the_rack_on_the_right_drag_to")}</p>`, TR("n_of_n_u", units, this.rack.units))}
      ${sec("rack", "Rack", `<label class="f">Name<input data-rack="name" value="${esc(this.rack.name)}"></label>
      <div class="row2"><label class="f">${TR("rack_units")}<input type="number" min="4" max="60" data-rack="units" value="${this.rack.units}"></label>
      <label class="f">${TR("ups_capacity_w")}<input type="number" min="0" data-power="capacity_w" value="${esc(this.rack.power?.capacity_w ?? "")}" placeholder="2700"></label></div>
      <div class="row2"><label class="f">${TR("electricity_price_kwh")}<input type="number" min="0" step="0.001" data-power="price" value="${esc(this.rack.power?.price ?? "")}" placeholder="${TR("e_g_0_30")}"></label>
      <label class="f">${TR("or_price_entity")}<input list="priceents" data-power-ent="price_entity" value="${esc(this.rack.power?.price_entity || "")}" placeholder="sensor.…"></label></div>
      <datalist id="priceents">${Object.keys(this._hass.states).filter(id => id.startsWith("sensor.") && /€|eur|ct|price|preis|tarif/i.test(id + " " + (this._hass.states[id].attributes.unit_of_measurement || ""))).slice(0, 200).map(id => `<option value="${esc(id)}">${esc(this._hass.states[id].attributes.friendly_name || "")}</option>`).join("")}</datalist>
      <div class="ft" style="margin:4px 0 10px;padding:0;border:0;gap:8px"><button class="btn" data-act="export" title="${TR("save_the_rack_with_devices_popups_and_settings")}">${TR("export")}</button><span class="btn upl">${TR("import")}<input type="file" accept="application/json,.json" data-import></span></div>
      <label class="chk"><input type="checkbox" data-rack-flag="entities" ${this.rack.entities !== false ? "checked" : ""}><span>${TR("create_ha_entities")}<small class="hint" style="display:block;margin:0">${TR("state_faults_warnings_hottest_device_for")}</small></span></label>`, TR("n_u", this.rack.units))}
      ${sec("door", TR("door_labels"), `<div class="row2"><label class="f">${TR("badge")}<input data-style="badge" value="${esc(s.badge)}" placeholder="${TR("e_g_company_name")}"></label>
      <label class="f">${TR("type_plate")}<input data-style="plate" value="${esc(s.plate)}"></label></div>
      <label class="f">${TR("top_label")}<input data-style="label1" value="${esc(s.label1)}"></label>
      <label class="f">${TR("bottom_label")}<input data-style="label2" value="${esc(s.label2)}"></label>`, s.badge || "")}
      ${sec("look", TR("appearance"), `<div class="row2"><label class="f">${TR("cabinet_colour")}<select data-style="color">${[["light", TR("light_grey_default")], ["white", TR("white")], ["graphite", TR("graphite")], ["black", TR("black")], ["custom", TR("custom_colour")]].map(([v, t]) => `<option value="${v}" ${(/^#/.test(s.color || "") ? "custom" : s.color || "light") === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label class="f">${TR("door")}<select data-style="door">${[["mesh", TR("perforated")], ["glass", TR("glass")], ["solid", TR("solid")], ["none", TR("no_door")]].map(([v, t]) => `<option value="${v}" ${(s.door || "mesh") === v ? "selected" : ""}>${t}</option>`).join("")}</select></label></div>
      <div class="row2">${/^#/.test(s.color || "") ? `<label class="f">${TR("custom_colour_2")}<input type="color" data-style="color" value="${esc(s.color)}"></label>` : "<span></span>"}
      <label class="f">${TR("label_colour")}<input type="color" data-style="label_color" value="${esc(s.label_color || "#e2372b")}"></label></div>
      <label class="chk"><input type="checkbox" data-style-flag="heatmap" ${s.heatmap ? "checked" : ""}><span>${TR("heat_map")}<small class="hint" style="display:block;margin:0">${TR("a_heat_button_below_the_rack_colours_devices_by")}</small></span></label>`)}
      ${sec("disp", TR("display"), `<label class="f">${TR("show_on")}<select data-disp="preset">${(this.catalog.displays || []).map(p => `<option value="${p.key}" ${(this.rack.display?.preset || "pi-portrait") === p.key ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></label>
      ${(() => { const S = this._hass.states, lights = Object.keys(S).filter(id => /^light\..*touchkio.*_display$/.test(id)), scr = this.rack.display?.screen || {};
        if (!lights.length && !scr.light) return "";
        return `<div class="row2"><label class="f">${TR("screen_touchkio")}<select data-screen="light"><option value="">${TR("none_2")}</option>${lights.map(id => `<option value="${esc(id)}" ${scr.light === id ? "selected" : ""}>${esc(S[id].attributes.friendly_name || id)}</option>`).join("")}</select></label>
          <label class="f">${TR("switch_off_after")}<select data-screen="off_after" ${scr.light ? "" : "disabled"}>${[[0, TR("never_always_on")], [1, TR("1_minute")], [2, TR("2_minutes")], [5, TR("5_minutes")], [10, TR("10_minutes")], [30, TR("30_minutes")]].map(([v, t]) => `<option value="${v}" ${(+scr.off_after || 0) === v ? "selected" : ""}>${t}</option>`).join("")}</select></label></div>
          <p class="hint" style="margin:-4px 0 10px">${TR("without_touch_ha_switches_the_screen_off_a")}</p>`; })()}
      <div class="row2"><label class="f">${TR("night_mode_from")}<input type="time" data-night="from" value="${esc(this.rack.display?.night?.from || "")}"></label><label class="f">${TR("until")}<input type="time" data-night="to" value="${esc(this.rack.display?.night?.to || "")}"></label></div>
      ${this.rack.display?.night?.from ? `<label class="f">${TR("brightness_at_night")}<select data-night="dim">${[[0.35, "35 %"], [0.55, "55 %"], [0.75, "75 %"], [1, TR("100_dark_only")]].map(([v, t]) => `<option value="${v}" ${(this.rack.display?.night?.dim ?? 0.55) === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>` : ""}
      <label class="f">${TR("language")}<select data-disp="lang">${[["", TR("automatic_ha_user_language")], ["de", "Deutsch"], ["en", "English"]].map(([v, t]) => `<option value="${v}" ${(this.rack.display?.lang || "") === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label class="f">${TR("back_to_overview")}<select data-disp="idle">${[[0, TR("never")], [30, TR("after_30_seconds")], [60, TR("after_1_minute")], [120, TR("after_2_minutes")], [300, TR("after_5_minutes")]].map(([v, t]) => `<option value="${v}" ${(this.rack.display?.idle ?? 60) === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      ${this.rack.display?.preset === "custom" ? `<div class="row2"><label class="f">${TR("width_px")}<input type="number" min="320" max="3840" data-disp="w" value="${esc(this.rack.display?.w ?? 480)}"></label><label class="f">${TR("height_px")}<input type="number" min="320" max="3840" data-disp="h" value="${esc(this.rack.display?.h ?? 800)}"></label></div>` : ""}
      ${(() => { const g = window.__rackDisplay?.rdGeometry?.(this.rack.display || {}); if (!g || g.fill) return "";
        return `<div class="row2"><label class="f">${TR("diagonal_inch")}<input type="number" min="3" max="100" step="0.1" data-disp="inch" value="${esc(this.rack.display?.inch ?? "")}" placeholder="${g.inch}"></label>
        <label class="f">${TR("scaling")}<select data-disp="scale"><option value="">${TR("automatic_n", `${Math.round(g.zoom * 100)} %`)}</option>${[75, 100, 125, 150, 175, 200, 250].map(v => `<option value="${v}" ${+this.rack.display?.scale === v ? "selected" : ""}>${v} %</option>`).join("")}</select></label></div>
        <div class="found">${TR("n_n_px_n_ppi_detail_view_grid", g.w, g.h, g.dpi)} <b>${g.cols} × ${g.rows}</b> ${TR("cells")}</div>`; })()}
      <p class="hint" style="margin-top:0">${TR("the_view_is_built_for_this_area_and_scaled")}</p>`, (this.catalog.displays || []).find(p => p.key === (this.rack.display?.preset || "pi-portrait"))?.name || "")}
    </div>`;
  }
  // Aufklappbarer Abschnitt; offen/zu bleibt gemerkt
  sec(key, title, body, extra = "") {
    const op = this._open ||= { general: true, ha: true, outlets: false, blocks: true, photos: false, devs: true, rack: true, door: false, look: false, disp: false, mods: true, passive: false };
    return body ? `<details class="sec" data-sec="${key}" ${op[key] ? "open" : ""}><summary>${title}${extra ? `<em>${esc(extra)}</em>` : ""}</summary><div class="secb">${body}</div></details>` : "";
  }
  // Geräteliste links nach Änderungen im Rack auffrischen (nur auf Rack-Ebene sichtbar)
  renderMid() { if (this.level() === "rack") this.renderLeft(); }
  renderSheet() {
    const d = this.dev();
    if (!d || (this._drawer !== "device" && this._drawer !== "module")) { this.renderLeft(); return; }
    if (this._drawer === "module") return this.renderModule(d);
    if (d.id === "__ov") {
      this.$("left").innerHTML = this.drawerHead() + `<div class="card sheet"><p class="hint" style="margin:0 0 10px">${TR("the_home_page_next_to_the_rack_is_a_grid_like")}</p>
        ${this.sec("mods", TR("modules"), this.modList(d), `${d.blocks.length}`)}
        <div class="ft" style="flex-wrap:wrap;gap:8px"><button class="btn" data-act="ov-reset">${TR("restore_default")}</button><button class="btn danger" data-act="ov-off" title="${TR("back_to_the_fixed_default_overview")}">${TR("remove_custom_overview")}</button></div></div>`;
      return;
    }
    const passive = d.passive || RDE_PASSIVE.includes(d.template);
    const sel = (d.ha_devices || []).map(id => this.haDevices.find(x => x.id === id) || { id, name: this.devName(id) });
    const groups = this.front().filter(x => x.id !== d.id && !x.group && !x.passive);
    const m = d.map, found = m ? [
      Object.keys(m.roles || {}).length && `<b>${Object.keys(m.roles).length}</b> ${TR("values")}`,
      m.ports?.length && `<b>${m.ports.length}</b> Ports`, Object.keys(m.outlets || {}).length && `<b>${Object.keys(m.outlets).length}</b> ${TR("outlets")}`,
      m.disks?.length && `<b>${m.disks.length}</b> ${TR("disks")}`, m.cameras?.length && `<b>${m.cameras.length}</b> ${TR("cameras")}`].filter(Boolean) : [];
    const img = (key, label) => `<div class="img"><label>${label}</label><div class="thumb ${d[key] ? "has" : ""}" style="${d[key] ? `background-image:url('${esc(d[key])}')` : ""}">${d[key] ? "" : TR("no_photo")}</div>
      <span style="display:flex;gap:6px"><span class="btn upl">${TR("upload_2")}<input type="file" accept="image/jpeg,image/png,image/webp" data-upload="${key}"></span>${d[key] ? `<button class="btn" data-clear="${key}">${TR("remove")}</button>` : ""}</span></div>`;
    const sec = (k, t, body, extra) => this.sec(k, t, body, extra);
    this.$("left").innerHTML = this.drawerHead() + `<div class="card sheet">
      ${sec("general", TR("general"), `<label class="f">Name<input data-dev-f="name" value="${esc(d.name)}"></label>
      <label class="f">${TR("model")}<input data-dev-f="model" value="${esc(d.model)}"></label>
      <div class="row2"><label class="f">${TR("template")}<select data-dev-f="template">${RDE_TEMPLATES().map(([k, n]) => `<option value="${k}" ${k === d.template ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      ${d.parent ? `<label class="f">Position<input disabled value="${esc((this.rack.devices.find(x => x.id === d.parent)?.name || TR("module_frame")) + (" " + TR("bullet_n", TR("slot")) + " ") + ((this.rack.devices.find(x => x.id === d.parent)?.options?.modules || []).find(m => m.device === d.id)?.slot ?? "–"))}"></label>`
        : d.side === "rear0u" ? `<label class="f">Position<select data-dev-f="side"><option value="rear0u" selected>${TR("rear_0_u")}</option><option value="front">${TR("front_in_u")}</option></select></label>`
        : `<label class="f">${TR("height_u")}<input type="number" min="1" max="12" data-dev-f="h" value="${d.h}"></label>`}</div>
      <label class="chk"><input type="checkbox" data-dev-f="passive" ${d.passive ? "checked" : ""}> ${TR("passive_no_sensors")}</label>
      ${passive ? "" : `<label class="chk"><input type="checkbox" data-dev-opt="sometimes_off" ${d.options?.sometimes_off ? "checked" : ""}> <span>${TR("not_always_on")}<small class="hint" style="display:block;margin:0">${TR("off_grey_no_warnings")}</small></span></label>
      ${d.options?.sometimes_off ? (() => { const E = this.devEnts(d), S = this._hass.states, fn = id => esc(S[id]?.attributes.friendly_name || id);
        const src = E.filter(id => /^(device_tracker|switch)\./.test(id) || (id.startsWith("binary_sensor.") && ["power", "running", "connectivity", "plug"].includes(S[id]?.attributes.device_class)));
        const btn = E.filter(id => /^(button|script)\./.test(id) && /ein|on|start|wake|power/i.test(id + " " + (S[id]?.attributes.friendly_name || "")));
        const cur = d.roles?.state || d.map?.roles?.state || "";
        return `<div class="row2"><label class="f">${TR("detect_off_via")}<select data-dev-role="state"><option value="">${TR("automatic_all_values_gone")}</option>${src.map(id => `<option value="${esc(id)}" ${cur === id ? "selected" : ""}>${fn(id)}</option>`).join("")}</select></label>
          <label class="f">${TR("power_on_button")}<select data-dev-opt-val="power_on"><option value="">${TR("none")}</option>${btn.map(id => `<option value="${esc(id)}" ${d.options?.power_on === id ? "selected" : ""}>${fn(id)}</option>`).join("")}</select></label></div>`; })() : ""}`}
      ${d.side !== "rear0u" && !passive ? `<label class="f">${TR("belongs_to_e_g_battery_pack_ups")}<select data-dev-f="group"><option value="">${TR("standalone")}</option>${groups.map(g => `<option value="${esc(g.id)}" ${d.group === g.id ? "selected" : ""}>${esc(g.name)}</option>`).join("")}</select></label>` : ""}`, `${TR("u_n", d.u ?? "–")} · ${TR("n_u", d.h || 0)}`)}
      ${passive || d.group ? "" : sec("ha", "Home Assistant", `
        <div class="sel-chips">${sel.map(x => `<span class="chip">${esc(x.name)}<button data-unlink="${esc(x.id)}" aria-label="${TR("remove")}">✕</button></span>`).join("") || `<span class="hint" style="margin:0">${TR("not_linked_yet")}</span>`}</div>
        ${found.length ? `<div class="found">${TR("detected_automatically")} ${found.join(" · ")}</div>` : ""}
        <label class="f">${sel.length ? TR("link_another_device") : TR("search_device")}<input id="hasearch" placeholder="${TR("name_model_or_manufacturer")}" value="${esc(this._q || "")}"></label>
        <div class="pick" id="pick" ${sel.length && !this._q ? "hidden" : ""}>${this.pickList(d)}</div>`, sel.length ? TR("linked") : TR("not_linked"))}
      ${d.template === "pdu" ? sec("outlets", TR("name_outlets"), this.outletSection(d)) : ""}
      ${d.template === "shelf" ? sec("shelf", TR("on_the_shelf"), this.shelfSection(d), TR("n_devices", (d.options?.items || []).length || (passive ? 0 : 1))) : ""}
      ${d.template === "frame" ? sec("slots", TR("slots"), this.slotSection(d), TR("n_of_n_used", (d.options?.modules || []).filter(m => m.status !== "planned").length, d.options?.slots || 10)) : ""}
      ${passive || d.group ? "" : sec("mods", TR("modules"), this.modList(d), `${this.blocks(d).length}`)}
      ${sec("photos", TR("photos"), `${img("front_image", TR("front"))}${d.side !== "rear0u" ? img("rear_image", TR("rear")) : ""}
      ${d.side === "rear0u" ? `<div class="img"><label>${TR("vertical_image_rear_view")}</label><div class="thumb" style="${d.options?.vertical_image ? `background-image:url('${esc(d.options.vertical_image)}')` : ""}"></div>
        <span class="btn upl">${TR("upload_2")}<input type="file" accept="image/jpeg,image/png,image/webp" data-upload="options.vertical_image"></span></div>` : ""}`, d.front_image ? TR("photo_available") : "")}
    <div class="ft">${(this.rackIds?.length || 0) > 1 ? `<select class="rsel" data-copy-to style="margin:0" title="${TR("copy_device_with_its_popup_to_another_rack")}"><option value="">${TR("copy_to_another_rack")}</option>${this.rackIds.filter(([id]) => id !== this.rack.id).map(([id, n]) => `<option value="${esc(id)}">${esc(n)}</option>`).join("")}</select>` : ""}<span style="flex:1"></span><button class="btn danger" data-act="remove">${TR("remove_2")}</button></div></div>`;
  }
  // Module des Geräts als Liste (antippen = Modul-Einstellungen); Größe/Position in der Vorschau
  modList(d) {
    const L = this.blocks(d), R = this.layRows(), used = d.options?.grid ? this.layPack(L) : 0;
    return `${d.options?.grid ? `<div class="found ${used > R ? "over" : ""}">${TR("grid_used")} <b>${used}</b> ${TR("of_n", `${R} ${TR("rows")}${used > R ? " – " + TR("too_high") : ""}`)}</div>` : ""}<div class="dlist">${L.map((b, i) => { const def = this.catalog.blocks[b.type] || { name: b.type }, l = b.layout || this.layDefault(b);
      return `<button class="dl" data-open-blk="${i}"><span class="du">${l.w}×${l.h}</span><b>${esc(b.label || def.name)}</b><small>${esc(b.label && b.label !== def.name ? def.name : def.desc || "")}</small></button>`; }).join("")}</div>
      <p class="hint">${TR("tap_new_modules_in_the_library_in_the_middle_or")}</p>`;
  }
  /* ---------- Fachboden: Kleingeräte darauf ---------- */
  shelfSection(d) {
    const passive = d.passive || RDE_PASSIVE.includes(d.template);
    const items = d.options?.items?.length ? d.options.items : passive ? [] : [{ name: d.name, kind: /cloud ?key/i.test(`${d.model} ${d.name}`) ? "ck" : "box", self: true }];
    const K = [["ck", TR("cloud_key_small_controller")], ["mini", TR("mini_pc")], ["nas", TR("small_nas")], ["box", TR("generic_box")], ["ap", TR("access_point")]];
    return `<div class="slots-ed">${items.map((it, i) => `<div class="se"><span class="sn">${i + 1}</span><input data-shelf="${i}:name" value="${esc(it.name || "")}" placeholder="Name">
        <select data-shelf="${i}:kind">${K.map(([k, t]) => `<option value="${k}" ${(it.kind || "box") === k ? "selected" : ""}>${t}</option>`).join("")}</select>
        <label class="chk sd" style="margin:0"><input type="checkbox" data-shelf="${i}:self" ${it.self ? "checked" : ""}> ${TR("is_this_device_state_led")}</label>
        <button class="mini" data-shelf-del="${i}" aria-label="${TR("remove")}" style="grid-column:3;justify-self:end">✕</button></div>`).join("")}</div>
      <button class="btn" data-shelf-add="1">${TR("device_on_the_shelf")}</button>
      <p class="hint">${TR("small_devices_lying_on_the_shelf_the_linked_ha")}</p>`;
  }
  shelfItems(d) { const o = (d.options ||= {}); if (!o.items?.length) o.items = (d.passive || RDE_PASSIVE.includes(d.template)) ? [] : [{ name: d.name, kind: /cloud ?key/i.test(`${d.model} ${d.name}`) ? "ck" : "box", self: true }]; return o.items; }
  /* ---------- Modulrahmen: Steckplätze ---------- */
  slotSection(d) {
    const n = d.options?.slots || 10, mods = d.options?.modules || [];
    const ents = Object.keys(this._hass.states).filter(id => /^(sensor|binary_sensor|device_tracker)\./.test(id)).sort();
    const KINDS = [["", TR("default_oled_lan")], ["temp", TR("rack_temperature")], ["ntp", TR("ntp_time_server")], ["cloudkey", TR("cloud_key_module")]];
    let cover = 0, by = null;
    return `<label class="f">${TR("number_of_slots")}<input type="number" min="1" max="24" data-slot-n value="${n}"></label>
      <datalist id="slotents">${ents.slice(0, 1500).map(id => `<option value="${esc(id)}">${esc(this._hass.states[id].attributes.friendly_name || "")}</option>`).join("")}</datalist>
      <div class="slots-ed">${Array.from({ length: n }, (_, i) => {
        if (cover > 0) { cover--; return `<div class="se covered"><span class="sn">${i + 1}</span><span class="hint" style="margin:0">${TR("part_of_n", esc(by))}</span></div>`; }
        const m = mods.find(x => x.slot === i + 1) || {}, st = m.name ? m.status || "installed" : "", w = Math.max(1, Math.min(+m.w || 1, n - i));
        if (m.name && w > 1) { cover = w - 1; by = m.name; }
        return `<div class="se ${st}"><span class="sn">${i + 1}</span><input data-slot="${i + 1}:name" value="${esc(m.name || "")}" placeholder="${TR("free")}">
          <select data-slot="${i + 1}:status" ${m.name ? "" : "disabled"}><option value="installed" ${st === "installed" ? "selected" : ""}>${TR("installed_2")}</option><option value="planned" ${st === "planned" ? "selected" : ""}>${TR("planned")}</option></select>
          ${m.name ? `<select class="sk" data-slot="${i + 1}:kind">${KINDS.map(([k, t]) => `<option value="${k}" ${(m.kind || "") === k ? "selected" : ""}>${t}</option>`).join("")}</select>
          <select data-slot="${i + 1}:w" title="${TR("width_in_slots")}">${Array.from({ length: Math.min(6, n - i) }, (_, k) => `<option value="${k + 1}" ${w === k + 1 ? "selected" : ""}>${k + 1} ${k ? TR("slots_2") : TR("slot")}</option>`).join("")}</select>
          <input class="sd" data-slot="${i + 1}:desc" value="${esc(m.desc || "")}" placeholder="${TR("description_e_g_lan_oled")}"><input class="sd" list="slotents" data-slot="${i + 1}:entity" value="${esc(m.entity || "")}" placeholder="${TR("entity_for_live_value_optional")}">
          ${m.status !== "planned" ? (m.device && this.rack.devices.some(x => x.id === m.device) ? `<span class="sd" style="display:flex;gap:6px"><button class="btn" data-open-dev="${esc(m.device)}">${TR("edit_own_popup")}</button><button class="btn" data-slot-unlink="${i + 1}" title="${TR("remove_device_2")}">${TR("remove")}</button></span>` : `<button class="btn sd" data-slot-dev="${i + 1}">${TR("own_popup_link_ha_device")}</button>`) : ""}` : ""}</div>`; }).join("")}</div>
      <p class="hint">${TR("entering_a_name_occupies_the_slot_clearing_it")}</p>`;
  }
  /* ---------- Stromleiste: Ausgänge benennen ---------- */
  outletSection(d) {
    const nums = Object.keys(d.map?.outlets || {}).map(Number).sort((a, b) => a - b);
    const list = nums.length ? nums : Array.from({ length: 24 }, (_, i) => i + 1), names = d.options?.outlet_names || {};
    return `<div class="onames">${list.map(n => `<label><span>${n}</span><input data-outlet-name="${n}" value="${esc(names[n] || "")}" placeholder="${TR("free")}"></label>`).join("")}</div>`;
  }

  /* ---------- Module (Blöcke) ---------- */
  blocks(d) {
    if (!Array.isArray(d.blocks)) {
      const C = this.catalog, key = d.group ? null : d.passive || C.passive_templates.includes(d.template) ? "passive" : C.templates[d.template] ? d.template : "generic";
      d.blocks = key ? C.templates[key].map(b => typeof b === "string" ? { type: b } : { ...b }) : [];
    }
    return d.blocks;
  }
  // Eigenes Layout: Standardgrößen je Modultyp (Breite in 12teln, Höhe in Zeilen) und Belegung wie im Raster (dicht gepackt)
  layDefault(b) {
    const H = { gauge: 3, ring: 3, stat: 2, progress: 2, histogram: 3, chips: 1, switch: 2, button: 2, camera: 4, heading: 1, clock: 2, entity: b.style === "chart" ? 3 : 2, header: 5, ports: 5, flow: 8, disks: 5, recording: 4, outlets: 4, poe: 4, system: 3, internet: 3, voltage: 3, chart: 4, values: 3, bars: 4, status: 3, tiles: 3, messages: 2, note: 2 };
    const half = (b.size || this.catalog.blocks[b.type]?.size) === "half" && b.type !== "header";
    const W = { stat: 4, ring: 4, gauge: 4, clock: 4 };
    if (b.type?.startsWith("ov_")) return { w: 12, h: { ov_power: 6, ov_temp: 5, ov_hints: 2, ov_stats: 1 }[b.type] };
    const ml = this.catalog.blocks[b.type]?.layout; if (ml) return { w: ml.w, h: ml.h };
    return { w: W[b.type] || (half ? 6 : 12), h: H[b.type] || 3 };
  }
  layMin(b) {
    const H = { ports: 3, internet: 3, disks: 3, flow: 3, recording: 3, outlets: 2, poe: 2, system: 2, voltage: 2, chart: b.style === "trace" ? 3 : 2, values: b.style === "ifaces" ? 3 : b.style === "rings" ? 3 : 2,
      bars: 2, status: 2, gauge: 2, ring: 2, histogram: 2, camera: 2, switch: 1, button: 1, chips: 1, stat: 1, progress: 1, entity: b.style === "chart" ? 2 : 1, heading: 1, clock: 1, messages: 1, note: 1, header: 2 };
    const W = { ports: 6, flow: 6, disks: 6, header: 4, internet: 4, system: 4, values: 4, chart: 4, bars: 4, outlets: 6, recording: 4 };
    if (b.type?.startsWith("ov_")) return { w: 4, h: { ov_power: 4, ov_temp: 3, ov_hints: 2, ov_stats: 1 }[b.type] };
    const mm = this.catalog.blocks[b.type]?.min_layout; if (mm) return { w: mm.w, h: mm.h };
    return { w: W[b.type] || 2, h: H[b.type] || 1 };
  }
  layRows() { return window.__rackDisplay?.rdGeometry?.(this.rack.display || {})?.frows || 15; }
  // Positionen aller Module: feste (x/y) zuerst, die übrigen der Reihe nach in die erste freie Lücke
  layPlace(list) {
    const grid = [], out = [];
    const free = (r, c, w, h) => { for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) if (grid[y]?.[x]) return false; return true; };
    const mark = (r, c, w, h) => { for (let y = r; y < r + h; y++) { grid[y] ||= []; for (let x = c; x < c + w; x++) grid[y][x] = 1; } };
    list.forEach((b, i) => { const l = b.layout || this.layDefault(b); if (Number.isInteger(l.x) && Number.isInteger(l.y)) { out[i] = { x: l.x, y: l.y, w: Math.min(12, l.w), h: l.h }; mark(l.y, l.x, Math.min(12, l.w), l.h); } });
    list.forEach((b, i) => { if (out[i]) return; const l = b.layout || this.layDefault(b), w = Math.min(12, l.w), h = l.h;
      for (let r = 0; ; r++) { let c = 0; for (; c + w <= 12; c++) if (free(r, c, w, h)) break; if (c + w <= 12) { out[i] = { x: c, y: r, w, h }; mark(r, c, w, h); break; } } });
    return out;
  }
  // Alle Module auf feste Positionen umstellen (vor dem ersten Verschieben in der Vorschau)
  layFix(list) { this.layPlace(list).forEach((p, i) => { list[i].layout = { ...(list[i].layout || {}), ...p }; }); }
  layHit(list, skip, p) { return this.layPlace(list).some((q, i) => i !== skip && q && p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h); }
  layPack(list) {
    return Math.max(0, ...this.layPlace(list).map(p => p ? p.y + p.h : 0));
  }
  renderModule(d) {
    const L = this.blocks(d), b = L[this._selBlk];
    if (!b) { this._drawer = "device"; return this.renderSheet(); }
    const def = this.catalog.blocks[b.type] || { name: b.type };
    this.$("left").innerHTML = this.drawerHead() + `<div class="card sheet">${this.blocksSection(d, this._selBlk)}
      <div class="ft"><button class="btn danger" data-blk-del="${this._selBlk}">${TR("remove_module")}</button><span style="flex:1"></span><button class="btn primary" data-go="device">${TR("done")}</button></div></div>`;
  }
  // Gerät hinzufügen an der angetippten HE
  renderAdd() {
    const at = this._addU || 0;
    this.$("lib").innerHTML = this.libHead(TR("insert_device"), at ? TR("from_u_n", at) : TR("first_free_slot_from_the_top")) + `${at ? "" : `<p class="hint" style="margin:0 0 4px">${TR("tip_tap_in_the_rack_to_choose_the_position_or")}</p>`}${RDE_PALETTE().map(g => `<h3 style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--secondary-text-color);margin:12px 0 6px">${g.group}</h3>
      <div class="tpl-grid">${g.items.map(t => { const rear = t.side === "rear0u", u = rear ? 0 : at ? this.placeAt(at, t.h, t.template) : this.firstFree(t.h, t.template); return `<button data-add-tpl="${t.key}" draggable="${rear ? "false" : "true"}" ${rear || u ? "" : "disabled"}><b>${t.name}</b><small>${rear ? `${TR("rear")} · ${TR("n_u", 0)}` : u ? TR("n_u_from_u_n", t.h, u) : TR("n_u_does_not_fit_here", t.h)}</small></button>`; }).join("")}</div>`).join("")}`;
  }
  // Höchste freie Stelle für h HE (neue Geräte ohne angetippte HE)
  firstFree(h, tpl) { const strict = ["bl", "blank"].includes(tpl); for (let u = this.rack.units - h + 1; u >= 1; u--) if (this.fits(u, h, null, strict)) return u; return 0; }
  // Untere HE für ein Gerät der Höhe h, so dass die angetippte HE darin liegt (Blenden zählen als frei)
  placeAt(at, h, tpl, ignore) {
    const strict = ["bl", "blank"].includes(tpl);
    for (let k = 0; k < h; k++) { const u = at - h + 1 + k; if (this.fits(u, h, ignore, strict)) return u; }
    return 0;
  }
  blocksSection(d, only) {
    if (d.group) return "";
    const B = this.catalog.blocks, list = this.blocks(d), gridOn = !!d.options?.grid || only != null, R = this.layRows(), used = gridOn ? this.layPack(list) : 0;
    const lay = (b, i) => { if (!gridOn) return ""; const l = b.layout || this.layDefault(b), mn = this.layMin(b);
      const W = [[3, "¼"], [4, "⅓"], [6, "½"], [8, "⅔"], [9, "¾"], [12, TR("full")]].filter(([w]) => w >= mn.w);
      return `<div class="sz"><span class="szl">${TR("width")}</span><div class="seg">${W.map(([w, t]) => `<button class="${l.w === w ? "on" : ""}" data-lay-set="${i}:w:${w}" title="${TR("n_of_12_columns", w)}">${t}</button>`).join("")}</div>
        <span class="szl">${TR("height")}</span><div class="step"><button data-lay-set="${i}:h:${l.h - 1}" ${l.h <= mn.h ? "disabled" : ""} aria-label="${TR("lower")}">−</button><b>${l.h} ${l.h === 1 ? TR("row") : TR("rows")}</b><button data-lay-set="${i}:h:${l.h + 1}" ${l.h >= R ? "disabled" : ""} aria-label="${TR("taller")}">＋</button></div>
        <span class="hint" style="grid-column:1/-1;margin:0">${TR("n_n_drag_the_corner_in_the_preview_or_use_arrow", l.w, l.h)}</span></div>`; };
    const row = (b, i) => {
      const def = B[b.type] || { name: b.type }, size = b.size || def.size, fixed = b.type === "header";
      const isHead = b.type === "header", items = def.items || isHead ? (b.items || (b.source ? [b.source] : [])) : null, maxItems = isHead ? 4 : b.type === "chart" ? 3 : ["entity", "gauge", "ring", "stat", "progress", "histogram", "camera"].includes(b.type) ? 1 : 99;
      return `<div class="blk" data-blk-row="${i}"><div class="bh">
          <b>${esc(def.name)}${b.label && b.label !== def.name ? ` · <span>${esc(b.label)}</span>` : ""}</b>
          ${fixed ? `<small>${TR("always_on_top")}</small>` : `
          ${size && !d.options?.grid && only == null ? `<button class="mini ${size === "half" ? "on" : ""}" data-blk-size="${i}" title="${TR("half_or_full_width")}">${size === "half" ? "½" : "▭"}</button>` : ""}
          ${d.options?.grid ? "" : `<button class="mini" data-blk-up="${i}" ${i <= 1 ? "disabled" : ""} aria-label="${TR("up")}">↑</button>
          <button class="mini" data-blk-down="${i}" ${i === list.length - 1 ? "disabled" : ""} aria-label="${TR("down")}">↓</button>`}
          <button class="mini" data-blk-del="${i}" aria-label="${TR("remove")}">✕</button>`}</div>
        ${fixed ? "" : `<div class="bd2">${esc(def.desc || "")}</div>`}
        ${lay(b, i)}
        ${(() => { const ST = { values: [["", TR("tiles")], ["rings", TR("tiles_with_24_h_curve")], ["compact", TR("compact_rows")], ["hw", TR("hardware_temperatures_fans")], ...(b.style === "ifaces" ? [["ifaces", TR("interfaces")]] : [])], bars: [["", TR("bars")], ["thermo", TR("thermometer_temperatures")]], chart: [["", TR("curve_tiles")], ["trace", TR("trackable_history")]], entity: [["", TR("value")], ["chart", TR("value_with_24_h_curve")]], chips: [["", "Chips"], ["list", TR("list_problems_first")]], bays: [["", TR("horizontal_tiles")], ["vertical", TR("vertical_like_the_enclosure")]] }[b.type];
          return ST ? `<label class="f" style="margin:6px 0 2px">${TR("display_style")}<select data-blk-style="${i}">${ST.map(([v, t]) => `<option value="${v}" ${(b.style || "") === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>` : ""; })()}
        ${items ? `${isHead ? `<div class="bd2">${TR("key_figures_at_the_top_up_to_4_empty_automatic")}</div>` : `<label class="f" style="margin:6px 0 4px">${TR("title")}<input data-blk-label="${i}" value="${esc(b.label || "")}" placeholder="${esc(def.name)}"></label>`}
          <div class="irows">${items.map((ref, j) => { const id = ref.includes(".") ? ref : d.map?.roles?.[ref], s = id && this._hass.states[id], val = s ? `${s.state}${s.attributes.unit_of_measurement ? " " + s.attributes.unit_of_measurement : ""}` : "–";
            return `<div class="irow" title="${esc(ref)}"><input data-blk-name="${i}:${esc(ref)}" value="${esc(b.names?.[ref] || "")}" placeholder="${esc(this.entLabel(ref, d))}" aria-label="${TR("display_name")}"><span class="iv ${!s || s.state === "unavailable" ? "na" : ""}">${esc(val)}</span>
              <span class="iord"><button class="mini" data-blk-item-mv="${i}:${j}:-1" ${j ? "" : "disabled"} aria-label="${TR("up")}">↑</button><button class="mini" data-blk-item-mv="${i}:${j}:1" ${j < items.length - 1 ? "" : "disabled"} aria-label="${TR("down")}">↓</button></span><button class="mini" data-blk-item-del="${i}:${j}" aria-label="${TR("remove")}">✕</button></div>`; }).join("") || `<span class="hint" style="margin:0">${isHead ? TR("automatic") : TR("no_entity_yet")}</span>`}</div>
          ${["bars", "gauge", "ring", "progress"].includes(b.type) ? `<div class="row2"><label class="f">Minimum<input type="number" data-blk-num="${i}:min" value="${esc(b.min ?? "")}" placeholder="0"></label><label class="f">Maximum<input type="number" data-blk-num="${i}:max" value="${esc(b.max ?? "")}" placeholder="100"></label></div>` : ""}
          ${this.suggest(d, b, i, items, maxItems)}
          ${this._pickBlk === i ? `<label class="f">${TR("search_entity")}<input id="entsearch" value="${esc(this._eq || "")}" placeholder="${TR("name_or_entity_id")}"></label><div class="pick" id="entpick">${this.entPick(d)}</div>`
            : items.length < maxItems ? `<button class="btn" data-blk-add-item="${i}">+ ${isHead ? TR("key_figure_2") : TR("entity_word")}</button>` : ""}` : ""}
        ${(this.catalog.blocks[b.type]?.options || []).map(o => { const v = b[o.key] ?? o.default ?? "";
          if (o.type === "bool") return `<label class="chk"><input type="checkbox" data-blk-mopt="${i}:${o.key}:bool" ${v ? "checked" : ""}> ${esc(o.label)}</label>`;
          if (o.type === "select") return `<label class="f">${esc(o.label)}<select data-blk-mopt="${i}:${o.key}:select">${(o.choices || []).map(([cv, ct]) => `<option value="${esc(cv)}" ${String(v) === String(cv) ? "selected" : ""}>${esc(ct)}</option>`).join("")}</select></label>`;
          return `<label class="f">${esc(o.label)}<input ${o.type === "number" ? `type="number" step="any"` : ""} data-blk-mopt="${i}:${o.key}:${o.type}" value="${esc(v)}" placeholder="${esc(o.placeholder ?? o.default ?? "")}"></label>`; }).join("")}
        ${b.type === "bays" ? `<div class="row2"><label class="f">${TR("front_bays")}<input type="number" min="1" max="90" data-blk-num="${i}:slots" value="${esc(b.slots ?? "")}" placeholder="${b.style === "vertical" ? 12 : 24}"></label>${b.style === "vertical" ? `<span class="hint" style="align-self:end;margin:0 0 12px">${TR("vertical_all_in_one_row")}</span>` : `<label class="f">${TR("columns")}<input type="number" min="1" max="12" data-blk-num="${i}:cols" value="${esc(b.cols ?? "")}" placeholder="4"></label>`}</div>
          <label class="f">${TR("numbering")}<select data-blk-opt="${i}:order"><option value="">${TR("by_row_1_2_3_to_the_right")}</option><option value="cols" ${b.order === "cols" ? "selected" : ""}>${TR("by_column_1_2_3_downwards")}</option></select></label>
          <label class="chk"><input type="checkbox" data-blk-flag="${i}:cache_in_bays" ${b.cache_in_bays ? "checked" : ""}> ${TR("cache_drives_sit_in_bays_otherwise_internal")}</label>
          <div class="libgrp" style="margin:8px 0 4px">${TR("disk_bay")}</div><div class="bmap">${(b.items || []).map(ref => { const id = ref.includes(".") ? ref : d.map?.roles?.[ref], key = ((id || "").match(/_disk_([a-z0-9]+)_(?:health|usage)$/) || [])[1]; if (!key || /flash/.test(key)) return "";
            const nr = (key.match(/\d+$/) || [""])[0], nm = /parity/.test(key) ? TR("parity") + (nr ? " " + nr : "") : /cache/.test(key) ? "Cache" + (nr ? " " + nr : "") : TR("disk") + " " + (nr || key);
            return `<label><span>${esc(nm)}</span><input type="number" min="1" max="${b.slots || 24}" data-blk-bay="${i}:${esc(key)}" value="${esc(b.bay_map?.[key] ?? "")}" placeholder="auto"></label>`; }).join("")}</div>
          <p class="hint" style="margin:4px 0 0">${TR("empty_next_free_bay_duplicate_numbers_the_first")}</p>` : ""}
        ${["gauge", "ring", "stat", "progress", "bays"].includes(b.type) || (b.type === "values" && b.style === "hw") ? `<div class="row2"><label class="f">${TR("warning_from")}<input type="number" data-blk-num="${i}:warn" value="${esc(b.warn ?? "")}" placeholder="–"></label><label class="f">${TR("critical_from")}<input type="number" data-blk-num="${i}:alert" value="${esc(b.alert ?? "")}" placeholder="–"></label></div>` : ""}
        ${b.type === "heading" ? `<label class="f" style="margin:6px 0 4px">${TR("title")}<input data-blk-label="${i}" value="${esc(b.label || "")}" placeholder="${TR("e_g_network")}"></label><label class="f">${TR("subtitle")}<input data-blk-text="${i}" value="${esc(b.text || "")}" placeholder="optional"></label>` : ""}
        ${b.type === "note" ? `<label class="f" style="margin-top:6px">Text<textarea data-blk-text="${i}" rows="3" style="font:inherit;font-size:14px;color:var(--primary-text-color);background:var(--secondary-background-color);border:1px solid var(--divider-color);border-radius:8px;padding:7px 9px;width:100%">${esc(b.text || "")}</textarea></label>` : ""}
      </div>`;
    };
    return `<div class="blks">${row(list[only], only)}</div>`;
  }
  // Entitäten des Geräts (verknüpfte HA-Geräte + automatisch erkannte Rollen)
  devEnts(d) {
    const own = new Set(d.ha_devices || []), roles = Object.values(d.map?.roles || {});
    return Object.keys(this._hass.states).filter(id => own.has(this.entDevice[id]) || roles.includes(id));
  }
  // Vorschläge: passende Entitäten des Geräts als Chips, ein Tipp übernimmt sie
  suggest(d, b, i, items, maxItems) {
    if (items.length >= maxItems) return "";
    const S = this._hass.states, u = id => S[id]?.attributes.unit_of_measurement || "", num = id => !isNaN(parseFloat(S[id]?.state)), dom = id => id.split(".")[0];
    const have = new Set(items.map(r => r.includes(".") ? r : d.map?.roles?.[r]));
    const fit = {
      hw: id => ["°C", "rpm"].includes(u(id)), chips: id => ["binary_sensor", "device_tracker"].includes(dom(id)), switch: id => ["switch", "light", "fan", "input_boolean"].includes(dom(id)),
      button: id => ["button", "script", "scene", "input_button"].includes(dom(id)), camera: id => dom(id) === "camera", thermo: id => u(id) === "°C", bays: id => /_disk_.*_(health|usage)$/.test(id),
      header: id => dom(id) === "sensor" && (num(id) || S[id]?.attributes.device_class === "timestamp"), num: id => dom(id) === "sensor" && num(id) && !!u(id),
    };
    const sg = this.catalog.blocks[b.type]?.suggest;
    if (sg) fit[b.type] = id => (!sg.domain || [].concat(sg.domain).includes(dom(id))) && (!sg.unit || [].concat(sg.unit).includes(u(id))) && (!sg.device_class || [].concat(sg.device_class).includes(S[id]?.attributes.device_class));
    const key = b.type === "values" && b.style === "hw" ? "hw" : b.type === "bars" && b.style === "thermo" ? "thermo" : fit[b.type] ? b.type : "num";
    const list = this.devEnts(d).filter(id => !have.has(id) && fit[key](id) && S[id].state !== "unavailable").slice(0, 14);
    if (!list.length) return "";
    const nm = id => { let n = S[id].attributes.friendly_name || id; for (const pre of [d.name, ...(d.ha_devices || []).map(x => this.devName(x))]) if (pre && n.toLowerCase().startsWith(pre.toLowerCase() + " ")) n = n.slice(pre.length + 1); return n; };
    return `<div class="sugs"><span class="hint" style="margin:0 0 4px;display:block">${TR("suggestions_from_this_device")}</span>${list.map(id => `<button class="sug" data-blk-sug="${i}:${esc(id)}" title="${esc(id)}">＋ ${esc(nm(id))}<small>${esc(S[id].state)}${u(id) ? " " + esc(u(id)) : ""}</small></button>`).join("")}</div>`;
  }
  devName(id) {
    const h = this.haDevices?.find(x => x.id === id); if (h) return h.name;
    // Ohne Gerätenamen: gemeinsamer Wortanfang der Entitätsnamen dieses Geräts
    const names = Object.keys(this.entDevice || {}).filter(k => this.entDevice[k] === id).map(k => this._hass.states[k]?.attributes.friendly_name).filter(Boolean).map(n => n.split(" "));
    if (!names.length) return id;
    const pre = []; for (let i = 0; i < names[0].length; i++) { const w = names[0][i]; if (names.every(n => n[i] === w)) pre.push(w); else break; }
    return pre.join(" ") || names[0][0];
  }
  entLabel(ref, d) {
    if (!ref.includes(".")) { const id = d.map?.roles?.[ref]; return id ? `${ref} → ${this._hass.states[id]?.attributes.friendly_name || id}` : ref; }
    return this._hass.states[ref]?.attributes.friendly_name || ref;
  }
  entPick(d) {
    const q = (this._eq || "").toLowerCase().trim(), own = new Set(d.ha_devices || []);
    const all = Object.keys(this._hass.states).map(id => ({ id, name: this._hass.states[id].attributes.friendly_name || id, own: own.has(this.entDevice[id]) }));
    const list = all.filter(x => q ? `${x.name} ${x.id}`.toLowerCase().includes(q) : x.own).sort((a, b) => (b.own - a.own) || a.name.localeCompare(b.name, "de")).slice(0, 60);
    return list.map(x => { const s = this._hass.states[x.id]; return `<button data-blk-pick="${esc(x.id)}">${esc(x.name)}<small>${esc(x.id)} · ${esc(s.state)}${s.attributes.unit_of_measurement ? " " + esc(s.attributes.unit_of_measurement) : ""}${x.own ? (" " + TR("bullet_n", TR("this_device"))) : ""}</small></button>`; }).join("")
      || `<p class="hint" style="padding:8px">${q ? TR("no_match") : TR("type_to_search_all_entities")}</p>`;
  }
  blkAction(t) {
    const d = this.dev(); if (!d) return false;
    const L = this.blocks(d), ds = t.dataset;
    if (ds.blkSize) { const b = L[+ds.blkSize], def = this.catalog.blocks[b.type]; b.size = (b.size || def.size) === "half" ? "full" : "half"; }
    else if (ds.blkUp) { const i = +ds.blkUp; [L[i - 1], L[i]] = [L[i], L[i - 1]]; }
    else if (ds.blkDown) { const i = +ds.blkDown; [L[i + 1], L[i]] = [L[i], L[i + 1]]; }
    else if (ds.blkDel) { const [g] = L.splice(+ds.blkDel, 1); this._drawer = "device"; this._selBlk = null; this.changed(); this.snap(true); this.renderLeft(); this.toast(TR("module_n_removed", g.label || this.catalog.blocks[g.type]?.name || g.type)); return true; }
    else if (ds.blkAddItem) { this._pickBlk = +ds.blkAddItem; this._eq = ""; this.renderSheet(); this.shadowRoot.getElementById("entsearch")?.focus(); return true; }
    else if (ds.blkItemDel) { const [i, j] = ds.blkItemDel.split(":").map(Number), b = L[i]; b.items = (b.items || (b.source ? [b.source] : [])).filter((_, k) => k !== j); delete b.source; }
    else if (ds.blkItemMv) { const [i, j, dir] = ds.blkItemMv.split(":").map(Number), b = L[i], it = [...(b.items || (b.source ? [b.source] : []))], k = j + dir; if (k < 0 || k >= it.length) return true; [it[j], it[k]] = [it[k], it[j]]; b.items = it; delete b.source; }
    else if (ds.laySet) { const [i, k, v] = ds.laySet.split(":"), b = L[+i], mn = this.layMin(b), lo = b.layout || this.layDefault(b), R = this.layRows();
      const nv = k === "w" ? Math.max(mn.w, Math.min(12, +v)) : Math.max(mn.h, Math.min(R, +v)), nl = { ...lo, [k]: nv };
      if (Number.isInteger(nl.x) && nl.x + nl.w > 12) nl.x = 12 - nl.w;
      if (Number.isInteger(nl.x) && this.layHit(L, +i, { x: nl.x, y: nl.y, w: nl.w, h: nl.h })) { this.toast(TR("no_room_for_that_in_the_grid")); return true; }
      b.layout = nl; }
    else if (ds.blkSug) { const k = ds.blkSug.indexOf(":"), b = L[+ds.blkSug.slice(0, k)], id = ds.blkSug.slice(k + 1); b.items = [...(b.items || (b.source ? [b.source] : [])), id]; delete b.source;
      if (this.entName[id]) (d.labels ||= {})[id] = this.entName[id]; }
    else if (ds.blkPick) {
      const b = L[this._pickBlk]; if (b) { b.items = [...(b.items || (b.source ? [b.source] : [])), ds.blkPick]; delete b.source; }
      if (this.entName[ds.blkPick]) (d.labels ||= {})[ds.blkPick] = this.entName[ds.blkPick];   // Kurzname für die Vorschau
      this._pickBlk = null; this._eq = "";
    }
    else return false;
    this.changed(); this.renderSheet(); return true;
  }

  pickList(d) {
    const q = (this._q || "").toLowerCase().trim();
    const list = this.haDevices.filter(x => !(d.ha_devices || []).includes(x.id) && (!q || `${x.name} ${x.model} ${x.maker}`.toLowerCase().includes(q))).slice(0, 40);
    const usedBy = id => this.rack.devices.find(o => o.id !== d.id && (o.ha_devices || []).includes(id));
    return list.map(x => { const u = usedBy(x.id); return `<button data-link="${x.id}" class="${u ? "used" : ""}">${esc(x.name)}<small>${esc([x.maker, x.model].filter(Boolean).join(" · "))}${u ? " · " + TR("already_used_by_n", esc(u.name)) : ""}</small></button>`; }).join("") || `<p class="hint" style="padding:8px">${TR("no_match")}</p>`;
  }

  /* ---------- Bedienung ---------- */
  _bind() {
    const root = this.shadowRoot;
    root.addEventListener("input", e => {
      const t = e.target;
      if (t.id === "libq") { this._libQ = t.value; this.libFilter(); return; }
      if (t.id === "entsearch") { this._eq = t.value; this.$("entpick").innerHTML = this.entPick(this.dev()); return; }
      if (t.dataset.shelf) { const [i, k] = t.dataset.shelf.split(":"), L = this.shelfItems(this.dev()), it = L[+i]; if (!it) return; if (k === "self") { L.forEach(x => delete x.self); if (t.checked) it.self = true; } else it[k] = t.value; this.changed(); return; }
      if (t.dataset.slotN !== undefined) { const d = this.dev(), o = (d.options ||= {}); o.slots = Math.max(1, Math.min(24, +t.value || 10)); o.modules = (o.modules || []).filter(m => m.slot <= o.slots); this.changed(); clearTimeout(this._st); this._st = setTimeout(() => this.renderSheet(), 500); return; }
      if (t.dataset.slot) { const [n, k] = t.dataset.slot.split(":"), d = this.dev(), o = (d.options ||= {}), L = (o.modules ||= []); let m = L.find(x => x.slot === +n);
        if (k === "name") { if (!t.value.trim()) { o.modules = L.filter(x => x !== m); this.changed(); clearTimeout(this._st); this._st = setTimeout(() => this.renderSheet(), 700); return; } if (!m) { m = { slot: +n, name: "", status: "installed" }; L.push(m); L.sort((x, y) => x.slot - y.slot); clearTimeout(this._st); this._st = setTimeout(() => this.renderSheet(), 900); } m.name = t.value; }
        else if (m) { if (t.value) m[k] = k === "w" ? +t.value : t.value; else delete m[k];
          if (k === "w" || k === "kind") { if (k === "w") { if (m.w <= 1) delete m.w; o.modules = L.filter(x => x === m || x.slot <= m.slot || x.slot >= m.slot + (m.w || 1)); } if (k === "kind" && SLOT_W[t.value] && !m.w) m.w = SLOT_W[t.value]; this.changed(); this.renderSheet(); return; } }
        this.changed(); return; }
      if (t.dataset.outletName) { const d = this.dev(), on = ((d.options ||= {}).outlet_names ||= {}); if (t.value.trim()) on[t.dataset.outletName] = t.value.trim(); else delete on[t.dataset.outletName]; this.changed(); return; }
      if (t.dataset.blkLabel) { const b = this.blocks(this.dev())[+t.dataset.blkLabel]; b.label = t.value || undefined; this.changed(); return; }
      if (t.dataset.blkName) { const k = t.dataset.blkName.indexOf(":"), b = this.blocks(this.dev())[+t.dataset.blkName.slice(0, k)], ref = t.dataset.blkName.slice(k + 1), nm = (b.names ||= {}); if (t.value.trim()) nm[ref] = t.value.trim(); else delete nm[ref]; this.changed(); return; }
      if (t.dataset.layW || t.dataset.layH) { const k = t.dataset.layW ? "w" : "h", i = +(t.dataset.layW || t.dataset.layH), d = this.dev(), b = this.blocks(d)[i];
        b.layout = { ...(b.layout || this.layDefault(b)), [k]: +t.value }; t.nextElementSibling.textContent = t.value;
        const g = t.closest(".lay").querySelector(".lay-g"); g.style.setProperty("--l" + k, Math.min(+b.layout[k], k === "h" ? 8 : 12));
        const R = this.layRows(), used = this.layPack(this.blocks(d)), f = this.shadowRoot.querySelector(".blks")?.previousElementSibling;
        if (f?.classList.contains("found")) { f.classList.toggle("over", used > R); f.innerHTML = `${TR("used_2")} <b>${used}</b> ${TR("of_n", `${R} ${TR("rows")}${used > R ? " – " + TR("too_high_lower_modules_cut_off") : ""}`)}`; }
        this.changed(); return; }
      if (t.dataset.blkText) { const b = this.blocks(this.dev())[+t.dataset.blkText]; b.text = t.value; this.changed(); return; }
      if (t.dataset.blkMopt) { const [i, k, ty] = t.dataset.blkMopt.split(":"), b = this.blocks(this.dev())[+i]; const v = ty === "bool" ? t.checked : ty === "number" ? (t.value === "" ? undefined : +t.value) : t.value; if (v === undefined || v === "") delete b[k]; else b[k] = v; this.changed(); return; }
      if (t.dataset.blkBay) { const k = t.dataset.blkBay.indexOf(":"), b = this.blocks(this.dev())[+t.dataset.blkBay.slice(0, k)], key = t.dataset.blkBay.slice(k + 1), m = (b.bay_map ||= {}); if (t.value === "") delete m[key]; else m[key] = +t.value; if (!Object.keys(m).length) delete b.bay_map; this.changed(); return; }
      if (t.dataset.blkNum) { const [i, k] = t.dataset.blkNum.split(":"), b = this.blocks(this.dev())[+i]; b[k] = t.value === "" ? undefined : +t.value; this.changed(); return; }
      if (t.dataset.disp === "w" || t.dataset.disp === "h" || t.dataset.disp === "inch") { (this.rack.display ||= {})[t.dataset.disp] = +t.value || undefined; this.changed(); clearTimeout(this._dt); this._dt = setTimeout(() => this.renderLeft(), 600); return; }
      if (t.id === "hasearch") { this._q = t.value; const d = this.rack.devices.find(x => x.id === this.sel), p = this.$("pick"); p.hidden = false; p.innerHTML = this.pickList(d); return; }
      if (t.dataset.rack) { this.rack[t.dataset.rack] = t.dataset.rack === "units" ? Math.max(4, Math.min(60, +t.value || 42)) : t.value; this.changed(); return; }
      if (t.dataset.style) {
        const st = (this.rack.style ||= {}), k = t.dataset.style, before = st[k];
        st[k] = k === "color" && t.value === "custom" ? (/^#/.test(before || "") ? before : "#2f5d8a") : t.value;
        this.changed();
        if (k === "color" && t.tagName === "SELECT" && /^#/.test(st[k]) !== /^#/.test(before || "")) this.renderLeft();   // Farbwähler ein-/ausblenden
        return;
      }
      if (t.dataset.powerEnt) { const P = (this.rack.power ||= {}); if (t.value.trim()) P[t.dataset.powerEnt] = t.value.trim(); else delete P[t.dataset.powerEnt]; this.changed(); return; }
      if (t.dataset.power) { (this.rack.power ||= {})[t.dataset.power] = t.value === "" ? undefined : +t.value; this.changed(); return; }
      if (t.dataset.devF && t.type !== "checkbox" && t.tagName === "INPUT") this.setField(t.dataset.devF, t.value, false);
    });
    root.addEventListener("change", e => {
      const t = e.target;
      if (t.dataset.rack === "units") { this.renderMid(); return; }
      if (t.dataset.blkOpt) { const [i, k] = t.dataset.blkOpt.split(":"), b = this.blocks(this.dev())[+i]; if (t.value) b[k] = t.value; else delete b[k]; this.changed(); return; }
      if (t.dataset.blkFlag) { const [i, k] = t.dataset.blkFlag.split(":"), b = this.blocks(this.dev())[+i]; if (t.checked) b[k] = true; else delete b[k]; this.changed(); return; }
      if (t.dataset.devOpt) { const d = this.dev(); d.options ||= {}; if (t.checked) d.options[t.dataset.devOpt] = true; else delete d.options[t.dataset.devOpt]; this.changed(); this.renderSheet(); return; }
      if (t.dataset.styleFlag) { const st = (this.rack.style ||= {}); if (t.checked) st[t.dataset.styleFlag] = true; else delete st[t.dataset.styleFlag]; this.changed(); return; }
      if (t.dataset.rackFlag) { if (t.checked) delete this.rack[t.dataset.rackFlag]; else this.rack[t.dataset.rackFlag] = false; this.changed(); return; }
      if (t.dataset.devOptVal) { const d = this.dev(); d.options ||= {}; if (t.value) d.options[t.dataset.devOptVal] = t.value; else delete d.options[t.dataset.devOptVal]; this.changed(); return; }
      if (t.dataset.devRole) { const d = this.dev(); d.roles ||= {}; if (t.value) d.roles[t.dataset.devRole] = t.value; else delete d.roles[t.dataset.devRole]; if (d.map?.roles) { if (t.value) d.map.roles[t.dataset.devRole] = t.value; } this.changed(); return; }
      if (t.dataset.devGrid !== undefined) { const d = this.dev(); d.options ||= {}; if (t.checked) { d.options.grid = true; this.blocks(d).forEach(b => b.layout ||= this.layDefault(b)); } else delete d.options.grid; this.changed(); this.renderSheet(); return; }
      if (t.dataset.blkStyle) { const b = this.blocks(this.dev())[+t.dataset.blkStyle]; b.style = t.value || undefined; this.changed(); this.renderSheet(); return; }
      if (t.dataset.disp === "scale") { (this.rack.display ||= {}).scale = +t.value || undefined; this.changed(); this.renderLeft(); return; }
      if (t.dataset.actRack !== undefined) { this.switchRack(t.value, t); return; }
      if (t.dataset.copyTo !== undefined) { const to = t.value; t.value = ""; if (to) this.copyTo(to); return; }
      if (t.dataset.actDev !== undefined) { if (t.value) this.openDev(t.value); else this.go("rack"); return; }
      if (t.dataset.screen) { const D = (this.rack.display ||= {}), Sc = (D.screen ||= {}); if (t.value === "" || (t.dataset.screen === "off_after" && +t.value === 0 && false)) delete Sc[t.dataset.screen]; else Sc[t.dataset.screen] = t.dataset.screen === "off_after" ? +t.value : t.value; if (!Sc.light) delete D.screen; this.changed(); this.renderLeft(); return; }
      if (t.dataset.night) { const D = (this.rack.display ||= {}), N = (D.night ||= {}), k = t.dataset.night; if (t.value === "") delete N[k]; else N[k] = k === "dim" ? +t.value : t.value; if (!N.from && !N.to) delete D.night; this.changed(); if (k !== "dim") this.renderLeft(); return; }
      if (t.dataset.disp === "lang") { const D = (this.rack.display ||= {}); if (t.value) D.lang = t.value; else delete D.lang; window.__rackDisplay?.rdForceLang?.(t.value); this.changed(); this.render(); return; }
      if (t.dataset.disp === "idle") { (this.rack.display ||= {}).idle = +t.value; this.changed(); return; }
      if (t.dataset.disp === "preset") { (this.rack.display ||= {}).preset = t.value; this.changed(); this.renderLeft(); return; }
      if (t.dataset.devF) this.setField(t.dataset.devF, t.type === "checkbox" ? t.checked : t.value, true);
      if (t.dataset.upload && t.files?.[0]) this.upload(t.dataset.upload, t.files[0]);
      if (t.dataset.import !== undefined && t.files?.[0]) { const f = t.files[0]; t.value = ""; this.importRack(f); }
    });
    root.addEventListener("toggle", e => { const s = e.target.dataset?.sec; if (s) (this._open ||= {})[s] = e.target.open; }, true);
    // Tastatur: ⌘/Strg+S speichert, Esc schließt das Gerät
    this._keys = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); if (this.dirty) this.save(); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && !e.composedPath().some(n => n.tagName === "INPUT" || n.tagName === "TEXTAREA")) { e.preventDefault(); this.undo(e.shiftKey); }
      else if ((e.key === "Delete" || e.key === "Backspace") && this.sel && !e.composedPath().some(n => n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.tagName === "SELECT" || n.isContentEditable)) {
        e.preventDefault(); if (this.level() === "module") this.blkAction({ dataset: { blkDel: String(this._selBlk) } }); else this.removeDev(); }
      else if (e.key.startsWith("Arrow") && this.level() === "module" && !e.composedPath().some(n => ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(n.tagName) || n.isContentEditable)) {
        e.preventDefault(); const d = this.dev(), L = this.blocks(d), i = this._selBlk, b = L[i]; if (!b || !d.options?.grid) return;
        this.layFix(L); const l = { ...b.layout }, R = this.layRows(), mn = this.layMin(b), dx = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0, dy = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
        const p = e.shiftKey ? { ...l, w: Math.max(mn.w, Math.min(12 - l.x, l.w + dx)), h: Math.max(mn.h, Math.min(R - l.y, l.h + dy)) } : { ...l, x: Math.max(0, Math.min(12 - l.w, l.x + dx)), y: Math.max(0, Math.min(R - l.h, l.y + dy)) };
        if (this.layHit(L, i, p)) return; b.layout = p; this.changed(); this.snap(); this.renderLeft(); }
      else if ((e.key === "ArrowDown" || e.key === "ArrowUp") && e.composedPath()[0]?.classList?.contains("dl")) {
        e.preventDefault(); const all = [...this.$("left").querySelectorAll(".dl")], i = all.indexOf(e.composedPath()[0]); all[Math.max(0, Math.min(all.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)))]?.focus(); }
      else if (e.key === "Escape" && !e.composedPath().some(n => n.tagName === "INPUT" || n.tagName === "TEXTAREA")) {
        if (this._addU) { this._addU = null; this.renderLib(); }
        else if (this.level() !== "rack") this.go("up");
      }
    };
    window.addEventListener("keydown", this._keys);
    this._unload = e => { if (this.dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", this._unload);
    root.addEventListener("click", e => {
      const t = e.target.closest("button,[data-act]");
      if (!t) return;
      if (this.blkAction(t)) return;
      if (t.dataset.go) { this.go(t.dataset.go); return; }
      if (t.dataset.shelfAdd) { this.shelfItems(this.dev()).push({ name: "", kind: "mini" }); this.changed(); this.renderSheet(); return; }
      if (t.dataset.shelfDel !== undefined) { const L = this.shelfItems(this.dev()); L.splice(+t.dataset.shelfDel, 1); this.changed(); this.renderSheet(); return; }
      if (t.dataset.openDev) { this.openDev(t.dataset.openDev); return; }
      if (t.dataset.slotDev) { const f = this.dev(), m = (f.options?.modules || []).find(x => x.slot === +t.dataset.slotDev); if (!m) return;
        const k = { id: this.newId(m.name || TR("module")), name: m.name || TR("module"), model: m.desc || "", template: "generic", u: 0, h: 1, side: "front", parent: f.id, passive: false, ha_devices: [], roles: {}, options: {} };
        this.rack.devices.push(k); m.device = k.id; this.changed(); this.openDev(k.id); this.toast(TR("popup_for_n_created_now_pick_the_ha_device", k.name)); return; }
      if (t.dataset.slotUnlink) { const f = this.dev(), m = (f.options?.modules || []).find(x => x.slot === +t.dataset.slotUnlink); if (!m?.device) return;
        const id = m.device; this.rack.devices = this.rack.devices.filter(x => x.id !== id); delete m.device; this.changed(); this.renderSheet();
        this.toast(TR("popup_removed")); return; }
      if (t.dataset.openBlk !== undefined) { this._selBlk = +t.dataset.openBlk; this._drawer = "module"; this._pickBlk = null; this.renderLeft(); this.decorate(); return; }
      if (t.dataset.act === "save") this.save();
      else if (t.dataset.act === "export") this.exportRack();
      else if (t.dataset.act === "undo") this.undo();
      else if (t.dataset.act === "redo") this.undo(true);
      else if (t.dataset.act === "reload") { if (!this.dirty || rdAsk(TR("unsaved_changes_will_be_lost_when_reloading"))) location.reload(); }
      else if (t.dataset.act === "discard") this.discard();
      else if (t.dataset.act === "close" || t.dataset.act === "drawer-close") this.go("up");
      else if (t.dataset.libI !== undefined) this.addFromLib(+t.dataset.libI);
      else if (t.dataset.libg !== undefined) { this._libG = t.dataset.libg; this.$("lib").querySelectorAll("[data-libg]").forEach(b => b.classList.toggle("on", b.dataset.libg === this._libG)); this.libFilter(); }
      else if (t.dataset.act === "drawer-rack") this.openDrawer("rack");
      else if (t.dataset.act === "ov-reset") { delete this.rack.overview; this.ovDev(); this.changed(); this.renderLeft(); this.renderLib(); }
      else if (t.dataset.act === "ov-off") { if (!rdAsk(TR("remove_the_custom_overview_and_return_to_the"))) return; delete this.rack.overview; this.sel = null; this._drawer = null; this._lib = null; this.changed(); this.renderTop(); this.renderLeft(); this.renderLib(); }
      else if (t.dataset.act === "drawer-device") this.openDrawer("device");
      else if (t.dataset.place) { const d = this.rack.devices.find(x => x.id === t.dataset.place), u = d && [...Array(this.rack.units).keys()].map(i => i + 1).find(u => this.fits(u, d.h, d.id)); if (d && u) { d.u = u; this.clearFillers(u, d.h, d.id); this.changed(); this.renderLeft(); } else { this.msg = TR("no_free_space"); this.err = true; this.renderTop(); } }
      else if (t.dataset.addTpl) this.addAt(t.dataset.addTpl);
      else if (t.dataset.act === "remove") this.removeDev();
      else if (t.dataset.link) this.link(t.dataset.link, true);
      else if (t.dataset.unlink) this.link(t.dataset.unlink, false);
      else if (t.dataset.clear) { this.dev()[t.dataset.clear] = null; this.changed(); this.renderSheet(); }
    });
    // Drag & Drop: Vorlagen aus der Palette, Geräte innerhalb der Belegung
    root.addEventListener("dragstart", e => { const it = e.target.closest?.("[data-lib-i]"); if (!it) return; this._libDrag = +it.dataset.libI; e.dataTransfer.effectAllowed = "copy"; e.dataTransfer.setData("text/plain", "lib"); }, true);
    root.addEventListener("dragend", () => { this._libDrag = null; }, true);
    root.addEventListener("dragstart", e => { const it = e.target.closest?.("[data-add-tpl]"); if (!it) return; this._tplDrag = RDE_PALETTE().flatMap(g => g.items).find(x => x.key === it.dataset.addTpl); e.dataTransfer.effectAllowed = "copy"; e.dataTransfer.setData("text/plain", "tpl"); }, true);
    root.addEventListener("dragend", () => { this._tplDrag = null; this._pvRoot?.querySelector(".ed-ghost")?.setAttribute("hidden", ""); }, true);
  }
  dev() { return this.sel === "__ov" ? this.ovDev() : this.rack.devices.find(x => x.id === this.sel); }
  // Eigene Übersicht: wird beim ersten Öffnen mit den vier Standardkarten angelegt (gleiches Aussehen wie bisher)
  ovDev() {
    this.rack.overview ||= { id: "__ov", name: TR("overview"), template: "overview", ha_devices: [], options: { grid: true }, blocks: [
      { type: "ov_power", layout: { w: 12, h: 6, x: 0, y: 0 } }, { type: "ov_temp", layout: { w: 12, h: 5, x: 0, y: 6 } },
      { type: "ov_hints", layout: { w: 12, h: 2, x: 0, y: 11 } }, { type: "ov_stats", layout: { w: 12, h: 1, x: 0, y: 13 } }] };
    return this.rack.overview;
  }
  addAt(key) {
    const t = RDE_PALETTE().flatMap(g => g.items).find(x => x.key === key); if (!t) return;
    const rear = t.side === "rear0u", u = rear ? 0 : this._addU ? this.placeAt(this._addU, t.h, t.template) : this.firstFree(t.h, t.template); if (!rear && !u) return;
    const d = { id: this.newId(t.name), name: t.name, model: "", template: t.template, u, h: t.h, side: t.side || "front", passive: !!t.passive, ha_devices: [], roles: {}, options: {} };
    this.rack.devices.push(d); if (!rear && !RackDisplayEditor.filler(d)) this.clearFillers(u, d.h, d.id);
    this._addU = null; this.sel = d.passive ? null : d.id; this._drawer = d.passive ? "rack" : "device"; this._lib = null; if (!d.passive) this.ensureGrid(d);
    this.changed(); this.snap(true); this.renderLeft(); this.renderLib(); this.renderTop(); setTimeout(() => this._app.select(this.sel || null), 200); this.toast(rear ? TR("n_inserted_rear", d.name) : TR("n_inserted_in_u_n", d.name, `${u}${d.h > 1 ? "–" + (u + d.h - 1) : ""}`));
  }
  setField(f, v, rerender) {
    const d = this.dev(); if (!d) return;
    if (f === "h") { const h = Math.max(1, Math.min(12, +v || 1)); if (!this.fits(d.u, h, d.id)) { this.msg = TR("no_room_for_n_u_here", h); this.err = true; this.renderTop(); return; } d.h = h; if (!RackDisplayEditor.filler(d)) this.clearFillers(d.u, h, d.id); }
    else if (f === "group") d.group = v || null;
    else if (f === "side") { d.side = v; if (v === "front") { const u = [...Array(this.rack.units).keys()].map(i => i + 1).find(u => this.fits(u, d.h)); if (!u) { d.side = "rear0u"; this.msg = TR("no_free_space_at_the_front"); this.err = true; this.renderTop(); return; } d.u = u; this.clearFillers(u, d.h, d.id); } else d.u = 0; }
    else if (f === "template") { d.template = v; d.passive = RDE_PASSIVE.includes(v); delete d.blocks; }   // Blöcke der neuen Vorlage
    else d[f] = v;
    this.changed();
    if (f === "name") { const h = this.shadowRoot.querySelector(".sheet .hd h2"); if (h) h.textContent = v; }
    if (rerender) { this.renderSheet(); }
    this.renderMid();
  }
  async link(id, on) {
    const d = this.dev(); if (!d) return;
    d.ha_devices = on ? [...new Set([...(d.ha_devices || []), id])] : (d.ha_devices || []).filter(x => x !== id);
    if (on && !d.model) { const h = this.haDevices.find(x => x.id === id); if (h?.model) d.model = [h.maker, h.model].filter(Boolean).join(" "); }
    this._q = "";
    try { d.map = d.ha_devices.length ? await this._hass.connection.sendMessagePromise({ type: "rack_display/resolve", ha_devices: d.ha_devices, roles: d.roles || {} }) : null; }
    catch (e) { d.map = null; }
    this.changed(); this.renderSheet(); this.renderMid();
  }
  async upload(key, file) {
    const d = this.dev(); if (!d) return;
    const fd = new FormData(); fd.append("file", file);
    this.msg = TR("uploading_image"); this.err = false; this.renderTop();
    try {
      const r = await this._hass.fetchWithAuth("/api/rack_display/image", { method: "POST", body: fd });
      const j = await r.json(); if (!r.ok) throw new Error(j.message || r.status);
      if (key.startsWith("options.")) (d.options ||= {})[key.slice(8)] = j.url; else d[key] = j.url;
      this.changed(); this.renderSheet();
    } catch (e) { this.msg = TR("upload_failed_n", e.message); this.err = true; this.renderTop(); }
  }
  removeDev() {
    const d = this.dev(); if (!d || d.id === "__ov") return;
    this.rack.devices = this.rack.devices.filter(x => x.id !== d.id).map(x => x.group === d.id ? { ...x, group: null } : x);
    this.sel = null; this.changed(); this.snap(true); this.go("rack"); this.toast(TR("n_removed", d.name));
  }
  // Anderes Rack bearbeiten: frisch vom Server holen, ohne die Seite neu zu laden; Auswahl wird gemerkt
  /* ---------- Bearbeiten direkt in der Vorschau (wie HA-Dashboards) ---------- */
  // Rack im Bild bearbeitbar: Tür aus, „＋“ auf freien HE (und Blenden), Geräte lassen sich ziehen
  decorateRack(R) {
    const rack = R.querySelector(".rack"); if (!rack) return;
    rack.querySelector(":scope>.ed-rk")?.remove();
    rack.classList.add("ed-rk-on");
    const U = this.rack.units, occ = new Map();
    for (const d of this.front()) for (let u = d.u; u < d.u + d.h; u++) occ.set(u, d);
    let cells = "";
    for (let u = U; u >= 1; u--) { const d = occ.get(u); if (!d || RackDisplayEditor.filler(d)) cells += `<button class="ed-plus" style="grid-row:${U - u + 1}" data-ed-u="${u}" title="${TR("u_n_insert_device", u)}" aria-label="${TR("u_n_insert_device", u)}">＋</button>`; }
    rack.insertAdjacentHTML("beforeend", `<div class="ed-rk" style="--units:${U}">${cells}<i class="ed-ghost" hidden></i></div>`);
  }
  decorate() {
    const R = this._pvRoot; if (!R) return;
    R.querySelectorAll(".ed-bar").forEach(x => x.remove());
    this.decorateRack(R);
    const d = this.dev(), panel = R.querySelector(this.sel === "__ov" ? ".panel" : ".panel.detail"); if (!d || !panel) return;
    const g = panel.querySelector(".dgrid.gm");
    if (!g) { if (!d.options?.grid) { this.ensureGrid(d); this.preview(); } return; }
    g.classList.add("ed-on");
    // Raster sichtbar: 12 Spalten × Zeilen als feine Felder hinter den Modulen
    const rows = +g.style.getPropertyValue("--gr") || this.layRows(), cs = getComputedStyle(g);
    let bg = g.querySelector(":scope>.ed-gridbg");
    if (!bg || +bg.dataset.rows !== rows) { bg?.remove(); g.insertAdjacentHTML("afterbegin", `<div class="ed-gridbg" data-rows="${rows}" style="--gr:${rows};--gx:${cs.columnGap};--gy:${cs.rowGap};top:${cs.paddingTop};left:${cs.paddingLeft};right:${cs.paddingRight};bottom:${cs.paddingBottom};gap:${cs.rowGap} ${cs.columnGap}">${"<i></i>".repeat(12 * rows)}</div>`); }
    // Module ohne sichtbaren Inhalt: Skizze, damit man sieht, wie sie aussehen werden
    const core = window.__rackDisplay;
    g.querySelectorAll(":scope>[data-bi]").forEach(c => { if (c.querySelector(".sk")) return; const b = this.blocks(d)[+c.dataset.bi]; if (!b) return;
      const txt = [...c.childNodes].filter(n => !(n.nodeType === 1 && (n.matches("h2,.ed-mv,.ed-rs,.ed-sz")))).map(n => n.textContent).join("").trim();
      if (txt.length < 2 && !c.querySelector("svg,img,canvas,.cw")) c.insertAdjacentHTML("beforeend", core?.rdSkeleton?.(b.type) || ""); });
    // Kopf: Name bearbeitbar, Foto mit Hochladen-Knopf
    const nm = g.querySelector("[data-ed-name]"); if (nm && document.activeElement !== nm) { nm.contentEditable = "plaintext-only"; nm.spellcheck = false; nm.title = TR("type_a_name"); }
    g.querySelectorAll(".dhero .thumb").forEach(t => { if (!t.querySelector(".ed-photo")) t.insertAdjacentHTML("beforeend", `<button class="ed-photo" data-ed="photo" title="${TR("upload_front_photo")}">${TR("photo")}</button>`); });
    g.querySelectorAll(":scope>[data-bi]").forEach(c => {
      if (c.querySelector(":scope>.ed-mv")) return;
      const bi = +c.dataset.bi, b = this.blocks(d)[bi], l = b?.layout || this.layDefault(b || {});
      c.classList.toggle("ed-sel", bi === this._selBlk);
      c.insertAdjacentHTML("beforeend", `<i class="ed-mv" title="${TR("move")}">⋮⋮</i><i class="ed-rs" title="${TR("resize")}"></i><b class="ed-sz">${l.w} × ${l.h}</b>`);
    });
  }
  _bindPreview(R) {
    const geo = g => { const r = g.getBoundingClientRect(), k = r.width / (g.offsetWidth || r.width), gap = (parseFloat(getComputedStyle(g).columnGap) || 8) * k, rows = +g.style.getPropertyValue("--gr") || 15;
      return { gap, cw: (r.width - 11 * gap) / 12, rh: (r.height - (rows - 1) * gap) / rows, rows }; };
    let op = null;
    R.addEventListener("pointerdown", e => {
      const t = e.target; if (t.closest?.("[data-ed]") || t.closest?.("[data-ed-u]")) return;
      const hit = t.closest?.(".hits [data-id], #pduHit");
      if (hit) {
        const dv = this.rack.devices.find(x => x.id === hit.dataset.id); if (!dv) return;
        op = { kind: "dev", dev: dv, x0: e.clientX, y0: e.clientY, moved: false };
        if (dv.side !== "rear0u") { this._app.hold(true); try { hit.setPointerCapture(e.pointerId); } catch (x) { /* egal */ } }
        e.preventDefault(); return;
      }
      const cell = t.closest?.("[data-bi]"), g = cell?.closest(".dgrid.gm.ed-on"); if (!cell || !g) return;
      const d = this.dev(); if (!d) return;
      const bi = +cell.dataset.bi, b = this.blocks(d)[bi];
      op = { kind: t.classList.contains("ed-rs") ? "size" : t.classList.contains("ed-mv") ? "move" : "tap", cell, bi, b, G: geo(g), moved: false, x0: e.clientX, y0: e.clientY };
      if (op.kind !== "tap") { e.preventDefault(); e.stopPropagation(); this._app.hold(true); try { t.setPointerCapture(e.pointerId); } catch (x) { /* egal */ } if (op.kind === "move") cell.classList.add("ed-drag"); }
    }, true);
    R.addEventListener("pointermove", e => {
      if (!op || op.kind === "tap") return;
      if (op.kind === "dev") {
        if (op.dev.side === "rear0u" || Math.hypot(e.clientX - op.x0, e.clientY - op.y0) < 6) return;
        op.moved = true;
        const lay = R.querySelector(".ed-rk"), gh = lay?.querySelector(".ed-ghost"); if (!lay) return;
        const r = lay.getBoundingClientRect(), U = this.rack.units, row = Math.max(0, Math.min(U - 1, Math.floor((e.clientY - r.top) / r.height * U))), at = U - row;
        const d = op.dev, u = this.placeAt(at, d.h, d.template, d.id);
        op.u = u; gh.hidden = false; gh.classList.toggle("bad", !u);
        const top = u ? u + d.h - 1 : Math.min(U, at + d.h - 1); gh.style.gridRow = `${U - top + 1} / span ${d.h}`;
        return;
      }
      op.moved = true;
      const L = this.blocks(this.dev()), G = op.G, gr = op.cell.parentElement.getBoundingClientRect();
      const cellAt = (x, y) => [Math.floor((x - gr.left + G.gap / 2) / (G.cw + G.gap)), Math.floor((y - gr.top + G.gap / 2) / (G.rh + G.gap))];
      if (!op.fixed) { this.layFix(L); op.fixed = true; op.p0 = { ...L[op.bi].layout }; const [cx, cy] = cellAt(op.x0, op.y0); op.off = [cx - op.p0.x, cy - op.p0.y]; }
      const p0 = op.p0;
      let p;
      if (op.kind === "size") {
        const [cx, cy] = cellAt(e.clientX, e.clientY);
        const mn = this.layMin(L[op.bi]);
        p = { x: p0.x, y: p0.y, w: Math.max(mn.w, Math.min(12 - p0.x, cx - p0.x + 1)), h: Math.max(mn.h, Math.min(G.rows - p0.y, cy - p0.y + 1)) };
      } else {
        const [cx, cy] = cellAt(e.clientX, e.clientY);
        p = { x: Math.max(0, Math.min(12 - p0.w, cx - op.off[0])), y: Math.max(0, Math.min(G.rows - p0.h, cy - op.off[1])), w: p0.w, h: p0.h };
      }
      op.ok = !this.layHit(L, op.bi, p); op.p = p;
      op.cell.style.setProperty("grid-column", `${p.x + 1} / span ${p.w}`, "important"); op.cell.style.setProperty("grid-row", `${p.y + 1} / span ${p.h}`, "important");
      op.cell.classList.toggle("ed-bad", !op.ok);
      const sz = op.cell.querySelector(".ed-sz"); if (sz) sz.textContent = `${p.w} × ${p.h}`;
    }, true);
    const end = () => {
      if (!op) return;
      if (op.kind === "dev") {
        const o = op; op = null; this._app.hold(false);
        if (o.moved) {
          if (o.u && o.u !== o.dev.u) { o.dev.u = o.u; if (!RackDisplayEditor.filler(o.dev)) this.clearFillers(o.u, o.dev.h, o.dev.id); this.changed(); this.snap(true); this.renderMid(); this.toast(TR("n_moved_to_u_n", o.dev.name, o.u)); }
          else this.decorate();
          return;
        }
        // Antippen: Gerät öffnen (Popup in der Vorschau), Einstellungen bleiben zu bis „⚙“
        this.openDev(o.dev.id);
        return;
      }
      const d = this.dev(), L = d && this.blocks(d), o = op; op = null;
      R.querySelectorAll(".ed-drag,.ed-bad").forEach(x => x.classList.remove("ed-drag", "ed-bad"));
      this._app.hold(false);
      if (!L) return;
      if (o.kind === "tap" || !o.moved) {
        this._selBlk = o.bi; this._pickBlk = null; this.openDrawer("module");
        R.querySelectorAll("[data-bi]").forEach(c => c.classList.toggle("ed-sel", +c.dataset.bi === o.bi));
        return;
      }
      if (o.p && o.ok) L[o.bi].layout = { ...L[o.bi].layout, ...o.p };   // belegt: zurück an die alte Stelle
      this.changed(); this.snap(true); this.renderSheet(); if (o.p && o.ok) this.toast(o.kind === "size" ? TR("size_n_n", o.p.w, o.p.h) : TR("module_moved")); else if (o.p) this.toast(TR("no_room_there_reverted"));
    };
    R.addEventListener("pointerup", end, true); R.addEventListener("pointercancel", end, true);
    // HE unter dem Mauszeiger im Rack (für Vorlagen aus der Bibliothek)
    const heAt = e => { const lay = R.querySelector(".ed-rk"); if (!lay) return 0; const r = lay.getBoundingClientRect(), U = this.rack.units; if (e.clientX < r.left - 20 || e.clientX > r.right + 20) return 0; return U - Math.max(0, Math.min(U - 1, Math.floor((e.clientY - r.top) / r.height * U))); };
    R.addEventListener("dragover", e => {
      if (this._libDrag != null && R.querySelector(".dgrid.gm.ed-on")) e.preventDefault();
      if (this._tplDrag) { const at = heAt(e), gh = R.querySelector(".ed-ghost"); if (!at || !gh) { gh?.setAttribute("hidden", ""); return; }
        const t = this._tplDrag, u = this.placeAt(at, t.h, t.template), U = this.rack.units, top = u ? u + t.h - 1 : Math.min(U, at + t.h - 1);
        gh.hidden = false; gh.classList.toggle("bad", !u); gh.style.gridRow = `${U - top + 1} / span ${t.h}`; if (u) e.preventDefault(); }
      if ([...(e.dataTransfer?.items || [])].some(x => x.kind === "file") && e.target.closest?.(".dhero .thumb")) e.preventDefault();
    });
    R.addEventListener("drop", e => {
      // 7) Foto auf das Bild im Kopf ziehen
      const f = e.dataTransfer?.files?.[0]; if (f && /^image\//.test(f.type) && e.target.closest?.(".dhero .thumb")) { e.preventDefault(); this.upload("front_image", f); return; }
      if (this._tplDrag) { const at = heAt(e), t = this._tplDrag; this._tplDrag = null; R.querySelector(".ed-ghost")?.setAttribute("hidden", ""); if (at) { e.preventDefault(); this._addU = at; this.addAt(t.key); } return; }
      if (this._libDrag == null) return; e.preventDefault();
      const g = R.querySelector(".dgrid.gm"); let at = null;
      if (g) { const G = geo(g), r = g.getBoundingClientRect(); at = [Math.floor((e.clientX - r.left) / (G.cw + G.gap)), Math.floor((e.clientY - r.top) / (G.rh + G.gap))]; }
      const i = this._libDrag; this._libDrag = null; this.addFromLib(i, at);
    });
    // Kopf des Geräts: Name direkt eintippen, Foto antippen zum Hochladen
    R.addEventListener("focusin", e => { if (e.target.matches?.("[data-ed-name]")) this._app.hold(true); });
    R.addEventListener("input", e => { if (!e.target.matches?.("[data-ed-name]")) return; const d = this.dev(); if (!d) return; d.name = e.target.textContent.trim() || d.name; this.dirty = true; this.snap(); this.renderTop(); });
    R.addEventListener("keydown", e => { if (e.target.matches?.("[data-ed-name]") && e.key === "Enter") { e.preventDefault(); e.target.blur(); } });
    R.addEventListener("focusout", e => { if (!e.target.matches?.("[data-ed-name]")) return; this._app.hold(false); this.changed(); this.renderLeft(); });
    R.addEventListener("click", e => {
      const plus = e.target.closest?.("[data-ed-u]");
      if (plus) { e.stopPropagation(); e.preventDefault(); this._addU = +plus.dataset.edU; if (this.dev()) this.go("rack"); this._lib = "add"; this.renderLib(); return; }
      if (e.target.closest?.(".hits [data-id], #pduHit")) { e.stopPropagation(); e.preventDefault(); return; }   // Auswahl übernimmt der Editor
      if (e.target.closest?.("[data-back]")) { this.go("rack"); }
      const add = e.target.closest?.("[data-ed-add]")?.dataset.edAdd;
      if (add) {   // Modul aus der Vorschau hinzufügen: ans Ende, auswählen, bei freien Modulen gleich die Entitätensuche öffnen
        e.stopPropagation(); const d = this.dev(); if (!d) return;
        const L = this.blocks(d), b = { type: add }; if (d.options?.grid) b.layout = this.layDefault(b); L.push(b);
        this._addOpen = false; this._selBlk = L.length - 1; this._drawer = "module";
        if (this.catalog.blocks[add]?.items) { this._pickBlk = L.length - 1; this._eq = ""; }
        this.changed(); this.renderLeft(); this.shadowRoot.getElementById("entsearch")?.focus();
        return;
      }
      const k = e.target.closest?.("[data-ed]")?.dataset.ed;
      if (!k) { if (e.target.closest?.(".dgrid.gm.ed-on [data-bi]")) { e.stopPropagation(); e.preventDefault(); } return; }   // in der Bearbeitung keine Klicks an die Anzeige
      e.stopPropagation(); const d = this.dev(); if (!d) return;
      if (k === "add") { this._lib = "modules"; this.renderLib(); return; }
      if (k === "photo") { this.$("pfile").click(); return; }
      if (k === "grid-on") { d.options ||= {}; d.options.grid = true; this.blocks(d).forEach(b => b.layout ||= this.layDefault(b)); }
      else if (k === "grid-off") delete d.options.grid;
      this.changed(); this.renderSheet();
    }, true);
  }
  // Gerät mit Popup, Fotos und Verknüpfung in ein anderes Rack übernehmen (dort direkt gespeichert)
  async copyTo(rackId) {
    const d = this.dev(); if (!d || d.id === "__ov") return;
    const name = this.rackIds.find(x => x[0] === rackId)?.[1] || rackId;
    const r = await this._hass.connection.sendMessagePromise({ type: "rack_display/racks" }), target = structuredClone(r.racks.find(x => x.id === rackId)); if (!target) return;
    const ex = target.devices.find(x => x.id === d.id);
    if (!rdAsk(ex ? TR("replace_n_in_n_popup_photos_and_link_are_copied", d.name, name) : TR("copy_n_with_its_popup_to_n", d.name, name))) return;
    const copy = structuredClone(d); delete copy.map; delete copy.labels;
    if (ex) { copy.u = ex.u; copy.side = ex.side; Object.keys(ex).forEach(k => delete ex[k]); Object.assign(ex, copy); }
    else {
      const occ = (u, h) => target.devices.some(x => x.side !== "rear0u" && !["bl", "blank"].includes(x.template) && u < x.u + x.h && x.u < u + h);
      if (copy.side !== "rear0u" && occ(copy.u, copy.h)) { let u = target.units - copy.h + 1; while (u >= 1 && occ(u, copy.h)) u--; if (u < 1) { this.msg = TR("no_room_for_n_u_in_n", name, copy.h); this.err = true; this.renderTop(); return; } copy.u = u; }
      target.devices = target.devices.filter(x => !(x.side !== "rear0u" && ["bl", "blank"].includes(x.template) && copy.u < x.u + x.h && x.u < copy.u + copy.h));
      target.devices.push(copy);
    }
    target.devices.forEach(x => { delete x.map; delete x.labels; });
    try { await this._hass.connection.sendMessagePromise({ type: "rack_display/rack/save", rack: target }); this.msg = TR("n_copied_to_n", d.name, name); this.err = false; }
    catch (err) { this.msg = TR("copy_failed_n", err.message || err.code || err); this.err = true; }
    this.renderTop();
  }
  // Rack als Datei sichern (Fotos bleiben Verweise auf /rack_display/images) bzw. als neues Rack einlesen
  exportRack() {
    const rack = JSON.parse(JSON.stringify(this.rack).replace(/(\/rack_display\/images\/[^"?]+)\?[^"]*/g, "$1")); rack.devices.forEach(d => { delete d.map; delete d.labels; });   // Foto-Adressen ohne Signatur
    const blob = new Blob([JSON.stringify({ format: "rack-display", version: 1, exported: new Date().toISOString(), rack }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `rack-${this.rack.id}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    this.toast(TR("rack_exported"));
  }
  async importRack(file) {
    let rack;
    try { const j = JSON.parse(await file.text()); rack = j.rack || j; if (!Array.isArray(rack.devices)) throw new Error(TR("no_devices")); }
    catch (err) { this.msg = TR("import_failed_n", err.message); this.err = true; this.renderTop(); return; }
    const base = (rack.name || "Rack").replace(/ \(Import( \d+)?\)$/, "");
    let id = (rack.id || "rack").replace(/[^a-z0-9_-]/gi, "-").toLowerCase(), n = 2; const ids = new Set(this.rackIds.map(x => x[0]));
    if (ids.has(id)) { while (ids.has(`${id}-${n}`)) n++; id = `${id}-${n}`; }
    if (!rdAsk(TR("create_n_as_a_new_rack", base))) return;
    rack = { ...rack, id, name: ids.has(rack.id) ? `${base} (Import)` : base, entities: false };
    rack.devices.forEach(d => { delete d.map; delete d.labels; });
    try { await this._hass.connection.sendMessagePromise({ type: "rack_display/rack/save", rack }); }
    catch (err) { this.msg = TR("import_failed_n", err.message || err.code || err); this.err = true; this.renderTop(); return; }
    this.dirty = false; await this.switchRack(id); this.toast(TR("n_imported", rack.name));
  }
  async switchRack(id, sel) {
    if (id === this.rack.id) return;
    if (this.dirty && !rdAsk(TR("unsaved_changes_will_be_lost_switch_anyway"))) { if (sel) sel.value = this.rack.id; return; }
    const r = await this._hass.connection.sendMessagePromise({ type: "rack_display/racks" });
    const next = r.racks.find(x => x.id === id); if (!next) return;
    this.rackIds = r.racks.map(x => [x.id, x.name]);
    this.rack = structuredClone(next); this.sel = null; this.dirty = false; this.msg = ""; this.err = false; this.resetHistory();
    try { localStorage.setItem("rack-display-editor-rack", id); } catch (e) { /* ohne Speicher */ }
    this.render(); this._app?.select(null);
  }
  async save() {
    const rack = structuredClone(this.rack);
    rack.devices.forEach(d => { delete d.map; delete d.labels; });
    try {
      const r = await this._hass.connection.sendMessagePromise({ type: "rack_display/rack/save", rack });
      this.rack = structuredClone(r.rack); this.dirty = false; this.msg = TR("saved"); this.err = false; this.resetHistory();
    } catch (e) { this.msg = TR("not_saved_n", e.message || e.code || e); this.err = true; }
    this.render();
  }
  async discard() {
    if (!rdAsk(TR("discard_all_unsaved_changes"))) return;
    const r = await this._hass.connection.sendMessagePromise({ type: "rack_display/racks" });
    const cur = r.racks.find(x => x.id === this.rack.id); this.rack = cur ? structuredClone(cur) : this.rack;
    this.dirty = false; this.sel = null; this.msg = ""; this.resetHistory(); this.render();
  }
  disconnectedCallback() { window.removeEventListener("keydown", this._keys); window.removeEventListener("beforeunload", this._unload); this._app?.destroy(); this._app = null; this._init = false; clearInterval(this._vt); }
}
if (!customElements.get("rack-display-editor")) customElements.define("rack-display-editor", RackDisplayEditor);
