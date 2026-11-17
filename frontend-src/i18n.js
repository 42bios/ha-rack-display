/* ---------- Sprache ----------
   Alle Texte der Oberfläche stehen unter Schlüsseln in i18n/<sprache>.json (Englisch ist die Quellsprache).
   TR("schluessel", wert0, wert1 …) liefert den Text der aktuellen Sprache und setzt die Werte für {0}, {1} … ein;
   fehlt ein Schlüssel in einer Sprache, gilt der englische Text. Eine weitere Sprache ist eine weitere Datei. */
const RD_TEXT = /*@@I18N_TEXT@@*/{ en: {} };
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
const RD_DEFAULT_KEYS = /*@@DEFAULT_LABELS@@*/[];
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
