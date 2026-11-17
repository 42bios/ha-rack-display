"""Baut rack-display.js und rack-display.css für die Integration.

app.js        – Web-Komponenten, Datenmodell aus Home Assistant, Übersicht, Kopfzeile
render.js     – Darstellung (Rack, Fronten, Diagramme, WLED); wird in app.js eingesetzt
base.css      – Stile, beim Build auf den Wrapper .rd umgestellt
rack.html     – Grundgerüst Rack + Panel
"""

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE.parent / "custom_components" / "rack_display" / "frontend"
VERSION = sys.argv[1] if len(sys.argv) > 1 else "dev"

# Katalogtexte (blocks.json), deren englischer Text zu mehreren Schlüsseln gehört: welcher gemeint ist
CATALOG_KEYS = {"Load": "load_2", "Recording": "recording_2"}

LOADER = """// Rack Display – Lader (ändert sich nie). Holt die aktuelle Fassung unter versionierter Adresse.
const base = "/rack_display/frontend";
let v = "";
try { v = (await (await fetch(`${base}/version.txt`, { cache: "no-store" })).text()).trim(); } catch (e) { v = String(Date.now()); }
await import(`${base}/@@FILE@@?v=${encodeURIComponent(v)}`);
"""


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
        # Module sind englisch geschrieben (Quellsprache); „de“ in module.json übersetzt ihre Texte ins Deutsche
        de = meta.get("de", {})
        seen.add(t)
        mods.append({"meta": meta, "js": js, "css": css, "de": de})
    return mods


def main():
    # Darstellung (render.js) ohne den Kopfkommentar einsetzen
    funcs = (HERE / "render.js").read_text().split("*/", 1)[1].strip("\n")

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
    js = js.replace("/*@@MODULES@@*/", "\n".join(f"RD_MODULES[{json.dumps(m['meta']['type'])}] = {{ de: {json.dumps(m['de'], ensure_ascii=False)}, render: (() => {{\n{m['js']}\nreturn render;\n}})() }};" for m in mods))
    # Sprache: i18n/<sprache>.json (Schlüssel → Text). Englisch ist die Quellsprache und muss jeden Schlüssel enthalten.
    texts = {p.stem: json.loads(p.read_text()) for p in sorted((HERE / "i18n").glob("*.json"))}
    for lang, t in texts.items():
        extra = sorted(set(t) - set(texts["en"]))
        if extra:
            raise SystemExit(f"i18n/{lang}.json: Schlüssel fehlen in en.json: {', '.join(extra[:8])}")
    used = set(re.findall(r'\bTR\("([^"]+)"', js + (HERE / "editor.js").read_text())) | set(re.findall(r'data-i18n(?:-label)?="([^"]+)"', html))
    unknown = sorted(used - set(texts["en"]))
    if unknown:
        raise SystemExit(f"Texte ohne Eintrag in i18n/en.json: {', '.join(unknown[:12])}")
    # Katalog: Texte durch Schlüssel ersetzen ("\x01schluessel"), damit das Frontend sie je Sprache auflöst.
    # Texte der Community-Module bekommen eigene Schlüssel (mod.<typ>.<n>), Deutsch aus ihrem „de“.
    by_text = {}
    for k, v in texts["en"].items():
        by_text.setdefault(v, k)
    by_text.update(CATALOG_KEYS)
    mod_de = {m["meta"]["type"]: m["de"] for m in mods}

    def mark(text, owner=None):
        if owner in mod_de:
            key = f"mod.{owner}.{len([k for k in texts['en'] if k.startswith(f'mod.{owner}.')])}"
            hit = next((k for k, v in texts["en"].items() if k.startswith(f"mod.{owner}.") and v == text), None)
            if hit is None:
                texts["en"][key] = text
                if text in mod_de[owner]:
                    texts.setdefault("de", {})[key] = mod_de[owner][text]
                hit = key
            return "\x01" + hit
        return "\x01" + by_text[text] if text in by_text else text

    def mark_all(o, owner=None, key=None):
        if isinstance(o, str):
            return mark(o, owner) if key in ("name", "desc", "label", "choice", "group_name") else o
        if isinstance(o, list):
            if key == "choices":
                return [[v, mark(l, owner)] for v, l in o]
            return [mark_all(v, owner, key) for v in o]
        if isinstance(o, dict):
            return {k: mark_all(v, owner, k) for k, v in o.items()}
        return o

    marked = dict(cat)
    marked["blocks"] = {t: mark_all(v, t) for t, v in cat["blocks"].items()}
    marked["templates"] = mark_all(cat["templates"])
    marked["displays"] = mark_all(cat["displays"])
    marked["groups"] = {k: mark(v) for k, v in cat["groups"].items()}
    js = js.replace("/*@@CATALOG@@*/null", json.dumps(marked, ensure_ascii=False))
    # Beschriftungen aus den Gerätevorlagen landen in gespeicherten Racks; das Frontend erkennt sie in jeder Sprache
    defaults = sorted({by_text[b["label"]] for tpl in cat["templates"].values() for b in tpl if isinstance(b, dict) and b.get("label") in by_text})
    i18n = (HERE / "i18n.js").read_text().replace("/*@@I18N_TEXT@@*/{ en: {} }", json.dumps(texts, ensure_ascii=False)).replace("/*@@DEFAULT_LABELS@@*/[]", json.dumps(defaults))
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
