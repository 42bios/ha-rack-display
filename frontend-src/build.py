"""Baut rack-display.js und rack-display.css für die Integration.

app.js        – Web-Komponenten, Datenmodell aus Home Assistant, Übersicht, Kopfzeile
proto-ref.js  – Darstellung aus dem Prototyp (Rack, Fronten, Detailkarten, WLED); wird hier
                übernommen und an Shadow DOM und echte Verläufe angepasst
base.css      – Stile aus dem Prototyp, auf den Wrapper .rd umgestellt
rack.html     – Grundgerüst Rack + Panel
"""

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE.parent / "custom_components" / "rack_display" / "frontend"
VERSION = sys.argv[1] if len(sys.argv) > 1 else "dev"

# Aus dem Prototyp übernommene Bausteine (Reihenfolge bleibt erhalten)
TAKE = [
    "leds48", "face", "rowOf", "renderRack", "chartSVG", "ICONS", "STATE_TXT", "worst", "SEG_COLORS",
    "CHARTS", "lazy", "fillCharts", "SPEED_TXT", "KIND_TXT", "chartMulti", "flowCard",
    "rearFace", "headThumb", "renderPanel",
    "hsl", "WLED", "wledLayout", "wledFrame", "cutDoor",
]

# Textersetzungen: (Baustein, alt, neu)
PATCH = [
    ("*", "document.querySelectorAll(", "ROOT.querySelectorAll("),
    ("*", "document.querySelector(", "ROOT.querySelector("),
    ("*", '"de-DE"', "rdLoc()"),
    ("chartSVG", "const v = series(seed, c.base, c.amp),", "const v = HS(c.entity, c.base),"),
    ("chartSVG", "const lo = Math.min(...v, c.warn ?? Infinity) * .95, hi = Math.max(...v, c.warn ?? -Infinity) * 1.04;",
     "const lo = Math.min(...v, c.warn ?? Infinity) * .95, hi = Math.max(Math.max(...v, c.warn ?? -Infinity) * 1.04, lo + 1);"),
    ("chartMulti", "const Y = y => pt + (1 - (y - lo) / (hi - lo))", "if (!(hi - lo > 1e-6)) hi = lo + 1;\n  const Y = y => pt + (1 - (y - lo) / (hi - lo))"),
    ("flowCard", "${nf.format(f.load)} W", "${fmt(f.load)} W"),
    ("flowCard", "${f.inV} V</b>", "${fmt(f.inV)} V</b>"),
    ("flowCard", "${f.batt} %</b><span>${f.runtime} min", "${fmt(f.batt)} %</b><span>${fmt(f.runtime)} min"),
    ("flowCard", "${f.outV} V · ${f.loadPct} %", "${fmt(f.outV)} V · ${fmt(f.loadPct)} %"),
    ("face", "blank:'', pdu:", "blank:'', frame:frameInner(d), pdu:"),
    ("face", "shelf:'<div class=\"plate\"></div><div class=\"box\"></div>',", "shelf:shelfInner(d),"),
    ("rearFace", '["blank", "cm", "bl"]', '["blank", "cm", "bl", "frame"]'),
    ("headThumb", "const ar = d.thumbAspect ||", "const ar = imgAr(d.image) || d.thumbAspect ||"),
    ("headThumb", "const m = d.group ? [] : members(d.id);", "if (d.parent) return slotThumb(d);\n  const m = d.group ? [] : members(d.id);"),
    # Modulrahmen: Module mit eigenem Gerät im Rack direkt antippbar
    ("renderRack", '$("pduHit").hidden = S.side !== "rear";', '$("hits").innerHTML += S.side === "rear" ? "" : DEVICES.filter(f => f.kids).flatMap(f => f.kids.map(k => { const n = f.slots || 10, L = 4.5 + 91 * (0.035 + 0.93 * (0.01 + 0.98 * (k.mod.slot - 1) / n)), W = 91 * 0.93 * 0.98 * (k.mod.w || 1) / n; return `<button class="hit sub ${k.state} ${isSel(k) ? "sel" : ""}" style="grid-row:${rowOf(f)};margin:0 0 0 ${L.toFixed(2)}%;width:${W.toFixed(2)}%;justify-self:start" data-id="${k.id}" aria-label="${k.name}"></button>`; })).join("");\n  $("pduHit").hidden = S.side !== "rear";'),
    ("leds48", "p = d.ports[n - 1]", "p = d.ports.find(x => x.n === n) || {}"),
    ("leds48", "animation-duration:${(0.12 + (h % 9) * 0.07).toFixed(2)}s", "animation-duration:${ledDur(p, h)}s"),
    ("leds48", '<i class="pl-led ${p.speed ? "link" : "off"}" style=', '<i class="pl-led ${p.speed ? "link" : "off"}" data-n="${n}" style='),
    ("leds48", 'return `<div class="leds">', 'return `<div class="leds" data-dev="${d.id}">'),
    # Blenden und Kabelführungen sind nicht antippbar
    ("renderRack", 'DEVICES.map(d => `<button class="hit', 'DEVICES.filter(d => !["bl", "cm", "blank"].includes(d.type)).map(d => `<button class="hit'),
    # Leeres Schild/Typenschild nicht als leere Fläche zeichnen
    ("renderRack", '$("plate").hidden = !RACK.plate;', '$("plate").hidden = !RACK.plate; $("badge").hidden = !RACK.badge;'),
    # Gesamtstatus: auch Meldungen zählen (z. B. „Keine Daten“ = Hinweis), damit Kopfzeile und Hinweise übereinstimmen
    ("worst", 'return s.includes("alert") ? "alert" : s.includes("warn") ? "warn" : "ok";',
     'const m = allDevices().filter(d => !d.passive && !d.group).flatMap(d => (d.msgs || []).map(x => x[0])); return s.includes("alert") || m.includes("alert") ? "alert" : s.includes("warn") || m.includes("warn") ? "warn" : "ok";'),
    # Verlaufszeilen: Kurve exakt so hoch wie ihre Zeile (keine Mindesthöhe)
    ("fillCharts", "Math.max(70, el.clientHeight)", "Math.max(el.closest(\".tr2,.mt\") ? 14 : 70, el.clientHeight)"),
    ("fillCharts", "Math.max(160, el.clientWidth)", "el.closest(\".mt\") ? el.clientWidth : Math.max(160, el.clientWidth)"),
    # Rack-Höhe folgt der HE-Zahl: Seitenverhältnis, Rahmenanteile und Höhe relativ zu einem 42-HE-Schrank
    ("renderRack", 'rack.style.setProperty("--units", RACK.units);', 'rack.style.setProperty("--units", RACK.units); rackLook(rack); { const k = 45.75 / (RACK.units + 3.75); rack.style.setProperty("--ar", (0.34 * k).toFixed(4)); rack.style.setProperty("--wt", (3.6 * k).toFixed(2) + "%"); rack.style.setProperty("--wb", (4.6 * k).toFixed(2) + "%"); rack.style.setProperty("--hf", Math.min(1, 1 / k).toFixed(4)); rack.closest(".app")?.classList.toggle("short-rack", RACK.units <= 32); }'),
    ("renderRack", 'rack.classList.toggle("open", !S.door || S.side === "rear");', 'rack.classList.toggle("open", !S.door || S.side === "rear" || RACK.door === "none");'),
    ("SPEED_TXT", '{"1G"', '{"100M":"100 Mbit/s","2.5G":"2,5 Gbit/s","1G"'),
    # Lüfterblende: Bilder je Gerät statt global
    ("face", '<div class="face f-panel">',
     '<div class="face f-panel" style="--panel-img:url(\'${d.image}\');--fan-img:url(\'${d.fanImage}\')">'),
    # Rack: kein Einsetzen freier HE in der Anzeige, Stromleiste aus der Konfiguration
    ("renderRack", '$("pduHit").classList.toggle("sel", S.sel === "pdu");',
     'const pdu0 = ZERO_U[0]; $("pduHit").hidden = S.side !== "rear" || !pdu0; if (pdu0){ $("pduHit").dataset.id = pdu0.id; $("pduHit").setAttribute("aria-label", pdu0.name + ", Rückseite"); }\n  $("pduHit").classList.toggle("sel", !!pdu0 && S.sel === pdu0.id);'),
    ("renderRack", 'empties.map(u => `<button class="hit empty" style="grid-row:${RACK.units - u + 1}" data-slot="${u}" aria-label="HE ${u} frei, Gerät einsetzen">+</button>`).join("");', '"";'),
    ("renderPanel", "if (S.slot) body = library(S.slot);\n  else if", "if"),
    ("renderPanel", "body = detail(byId(S.sel));", "body = showDetail(byId(S.sel));"),
    # Passt die Detailansicht nicht, fällt zuerst die History weg (kein Scrollen)
    ("renderPanel", "fillCharts(); CHARTS.length = 0;", "fitDetail(); fillCharts(); CHARTS.length = 0;"),
    # WLED-Schleife anhalten, solange das Licht aus ist (spart auf dem Pi Rechenzeit)
    ("wledFrame", "requestAnimationFrame(wledFrame);\n  const c", "if (DEAD) return;\n  if (!WLED.on && WLED.level < 0.02) { WLED.level = 0; $(\"wledCanvas\").hidden = true; WLED.loop = false; return; }\n  requestAnimationFrame(wledFrame);\n  const c"),
]

OVERRIDES_IN_APP = {"header", "overview", "sysCard", "voltCard", "diskCard", "recCard", "wanCard", "poeCard", "tick", "render"}


LOADER = """// Rack Display – Lader (ändert sich nie). Holt die aktuelle Fassung unter versionierter Adresse.
const base = "/rack_display/frontend";
let v = "";
try { v = (await (await fetch(`${base}/version.txt`, { cache: "no-store" })).text()).trim(); } catch (e) { v = String(Date.now()); }
await import(`${base}/@@FILE@@?v=${encodeURIComponent(v)}`);
"""


def blocks(src: str) -> dict[str, str]:
    lines = src.split("\n")
    out = {}
    starts = {}
    for i, ln in enumerate(lines):
        m = re.match(r"^(?:function\s+(\w+)\s*\(|const\s+(\w+)\s*=)", ln)
        if m:
            starts.setdefault(m.group(1) or m.group(2), i)
    for name in TAKE:
        i = starts[name]
        depth, seen, buf = 0, False, []
        for ln in lines[i:]:
            buf.append(ln)
            for ch in ln:
                if ch in "{[(":
                    depth += 1; seen = True
                elif ch in "}])":
                    depth -= 1
            if depth == 0 and (seen or ln.rstrip().endswith(";")):
                break
        out[name] = "\n".join(buf)
    return out


# ---------- Community-Module (modules/<typ>/): module.json + render.js (+ style.css) ----------
MOD_DIR = HERE.parent / "modules"
MOD_KEYS = {"type", "name", "desc", "group", "items", "size", "layout", "min_layout", "options", "suggest", "de", "author"}


def load_modules(catalog: dict) -> list[dict]:
    """Liest und prüft alle Module. Fehler brechen den Build ab (auch in der GitHub-Prüfung)."""
    mods, seen = [], set(catalog["blocks"])
    if not MOD_DIR.is_dir():
        return mods
    for d in sorted(p for p in MOD_DIR.iterdir() if p.is_dir() and not p.name.startswith((".", "_"))):
        where = f"modules/{d.name}"
        try:
            meta = json.loads((d / "module.json").read_text())
        except (OSError, ValueError) as err:
            raise SystemExit(f"{where}/module.json: {err}")
        t = meta.get("type", "")
        if t != d.name or not re.fullmatch(r"[a-z][a-z0-9_]{2,31}", t):
            raise SystemExit(f"{where}: type muss dem Ordnernamen entsprechen (klein, a–z, 0–9, _)")
        if t in seen:
            raise SystemExit(f"{where}: Typ „{t}“ gibt es schon")
        unknown = set(meta) - MOD_KEYS
        if unknown:
            raise SystemExit(f"{where}: unbekannte Felder {sorted(unknown)}")
        for k in ("name", "desc", "group"):
            if not isinstance(meta.get(k), str) or not meta[k].strip():
                raise SystemExit(f"{where}: „{k}“ fehlt")
        if meta["group"] not in catalog.get("groups", {}):
            raise SystemExit(f"{where}: group muss eine von {sorted(catalog['groups'])} sein")
        if meta.get("size", "full") not in ("half", "full"):
            raise SystemExit(f"{where}: size ist half oder full")
        for k in ("layout", "min_layout"):
            l = meta.get(k)
            if l is not None and not (isinstance(l, dict) and 1 <= int(l.get("w", 0)) <= 12 and 1 <= int(l.get("h", 0)) <= 15):
                raise SystemExit(f"{where}: {k} braucht w (1–12) und h (1–15)")
        for o in meta.get("options", []):
            if not re.fullmatch(r"[a-z][a-z0-9_]*", o.get("key", "")) or o.get("type") not in ("number", "text", "select", "bool") or not o.get("label"):
                raise SystemExit(f"{where}: Option braucht key, label und type (number/text/select/bool)")
        js = (d / "render.js").read_text()
        if not re.search(r"^function render\s*\(\s*ctx\s*,\s*block\s*\)", js, re.M):
            raise SystemExit(f"{where}/render.js: muss „function render(ctx, block)“ definieren")
        for bad in ("fetch(", "XMLHttpRequest", "WebSocket", "import(", "eval(", "new Function", "document.", "window.", "localStorage", "innerHTML"):
            if bad in js:
                raise SystemExit(f"{where}/render.js: „{bad}“ ist in Modulen nicht erlaubt (nur HTML aus den Werten in ctx zurückgeben)")
        css = (d / "style.css").read_text() if (d / "style.css").exists() else ""
        for sel in re.findall(r"(?:^|})\s*([^{}@]+?)\s*\{", re.sub(r"/\*.*?\*/", "", css, flags=re.S)):
            for part in sel.split(","):
                part = part.strip()
                if part and not part.startswith(f".mod-{t}") and not re.fullmatch(r"(from|to|\d+%)", part):
                    raise SystemExit(f"{where}/style.css: Regel „{part}“ muss mit .mod-{t} beginnen")
        # Module sind englisch geschrieben; „de“ übersetzt ins Deutsche. Intern ist Deutsch die Quellsprache der
        # Oberfläche, darum werden die Texte hier auf Deutsch umgestellt und die englischen Fassungen ins Wörterbuch übernommen.
        de, en_pairs = meta.get("de", {}), {}
        def de_of(text):
            g = de.get(text, text)
            if g != text:
                en_pairs[g] = text
            return g
        meta = {**meta, "name": de_of(meta["name"]), "desc": de_of(meta["desc"]),
                "options": [{**o, "label": de_of(o["label"]), **({"choices": [[v, de_of(l)] for v, l in o["choices"]]} if o.get("choices") else {})} for o in meta.get("options", [])]}
        seen.add(t)
        mods.append({"meta": meta, "js": js, "css": css, "de": de, "en": en_pairs})
    return mods


def main():
    proto = (HERE / "proto-ref.js").read_text()
    b = blocks(proto)
    for name, old, new in PATCH:
        targets = TAKE if name == "*" else [name]
        hit = False
        for t in targets:
            if old in b[t]:
                b[t] = b[t].replace(old, new); hit = True
        if not hit and name != "*":
            raise SystemExit(f"Patch nicht gefunden in {name}: {old[:60]}")
    funcs = "\n\n".join(b[n] for n in TAKE)
    for bad in ("document.", "window.", "series("):
        for n in TAKE:
            if bad in b[n] and not (bad == "window." and False):
                raise SystemExit(f"{bad} noch in {n}")

    app = (HERE / "app.js").read_text()
    html = (HERE / "rack.html").read_text().replace("`", "\\`").replace("${", "\\${")
    js = app.replace("/*@@PROTO_FUNCS@@*/", funcs).replace("/*@@HTML@@*/", html).replace("@@VERSION@@", VERSION)
    js = js.replace("/*@@PROTO@@*/", "")
    catalog = (HERE.parent / "custom_components" / "rack_display" / "blocks.json").read_text()
    cat = json.loads(catalog)
    mods = load_modules(cat)
    modmeta = {m["meta"]["type"]: {k: v for k, v in m["meta"].items() if k not in ("type", "de")} | {"community": True} for m in mods}
    cat["blocks"].update(modmeta)
    (HERE.parent / "custom_components" / "rack_display" / "modules.json").write_text(json.dumps({"blocks": modmeta}, ensure_ascii=False, indent=2) + "\n")
    js = js.replace("/*@@CATALOG@@*/null", json.dumps(cat, ensure_ascii=False))
    js = js.replace("/*@@MODULES@@*/", "\n".join(f"RD_MODULES[{json.dumps(m['meta']['type'])}] = {{ de: {json.dumps(m['de'], ensure_ascii=False)}, render: (() => {{\n{m['js']}\nreturn render;\n}})() }};" for m in mods))
    # Sprache: Wörterbuch (i18n/en.json: Texte + Muster) in den Übersetzer einsetzen
    import json as _json
    en = _json.loads((HERE / "i18n" / "en.json").read_text())
    for m in load_modules(json.loads(catalog)):
        en["text"].update(m["en"])
    i18n = (HERE / "i18n.js").read_text().replace("/*@@I18N_EN@@*/{}", _json.dumps(en["text"], ensure_ascii=False)).replace("/*@@I18N_EN_RE@@*/[]", _json.dumps(en["patterns"], ensure_ascii=False))
    js = js.replace("/*@@I18N@@*/", i18n)
    # Eigentlicher Code unter versionierter Adresse, davor ein unveränderlicher Lader:
    # der Lader fragt version.txt ab und lädt app.js?v=<Version> – damit gibt es nie eine veraltete Kopie im Cache.
    (OUT / "rack-display.app.js").write_text(js)
    ed = (HERE / "editor.js").read_text().replace("@@VERSION@@", VERSION)
    for marker, fname in (("EDITOR_CSS", "editor.css"), ("EDITOR_PREVIEW_CSS", "editor-preview.css")):
        css = (HERE / fname).read_text()
        if "`" in css or "${" in css: raise SystemExit(f"{fname}: ` oder ${{ im CSS")
        ed = ed.replace(f"/*@@{marker}@@*/", css)
    (OUT / "rack-editor.app.js").write_text(ed)
    (OUT / "version.txt").write_text(VERSION)
    for name in ("rack-display", "rack-editor"):
        (OUT / f"{name}.js").write_text(LOADER.replace("@@FILE@@", f"{name}.app.js"))

    css = (HERE / "base.css").read_text()
    css = css.replace(':root{', '.rd{', 1)
    css = re.sub(r'@media \(prefers-color-scheme: dark\)\{:root:not\(\[data-theme="light"\]\)\{(.*?)\}\}', r'.rd.dark{\1}', css, count=1, flags=re.S)
    css = re.sub(r':root\[data-theme="dark"\]\{.*?\}\n', '', css, count=1, flags=re.S)
    css = css.replace("html,body{height:100%}", ":host{display:block;height:100%}\n.rd{height:100%;overflow:hidden;position:relative}")
    css = css.replace("body{background:", ".rd{background:", 1)
    css = css.replace("html,body{overscroll-behavior:none}", ".rd{overscroll-behavior:none}")
    css = css.replace(".lite body,.lite .app", ".rd.lite,.rd.lite .app")
    css = css.replace(".lite body{", ".rd.lite{")
    css = re.sub(r"(?<![\w.-])\.lite ", ".rd.lite ", css)
    for bad in (":root", "html", "body"):
        if bad in css:
            raise SystemExit(f"CSS enthält noch {bad}")
    css += "".join(f"\n/* Modul {m['meta']['type']} */\n{m['css']}" for m in load_modules(json.loads((HERE.parent / "custom_components" / "rack_display" / "blocks.json").read_text())))
    css += "\n[hidden]{display:none!important}\n.rd.as-card{border-radius:var(--ha-card-border-radius,12px)}\n.ztab.dev .zn{text-align:left;font-weight:600;color:var(--label);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n"
    (OUT / "rack-display.css").write_text(css)
    print(f"ok: js {len(js) // 1024} KB, css {len(css) // 1024} KB, Version {VERSION}")


main()
