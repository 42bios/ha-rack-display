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
const RD_EN = /*@@I18N_EN@@*/{};
const RD_EN_RE = /*@@I18N_EN_RE@@*/[];
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
