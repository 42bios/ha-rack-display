# Writing a module

A module is a card for the device popups and the overview (for example "Batteries"). Each module lives in its own folder and is added to the display, the editor library and the catalog automatically when the integration is built. To contribute one, add a folder and open a pull request – a GitHub check builds and validates it.

```
modules/
  batteries/          ← folder name = module type
    module.json       ← description, size, options, optional German texts
    render.js         ← function render(ctx, block) → HTML
    style.css         ← optional, every rule starts with .mod-<type>
```

`modules/batteries/` is a complete example to copy.

## module.json

| Field | Required | Meaning |
|---|---|---|
| `type` | yes | Same as the folder name: lowercase letters, digits, `_` (3–32 characters) |
| `name`, `desc` | yes | Name and one-line description in the library (English) |
| `group` | yes | Library group: `werte`, `diagramme`, `zustand`, `steuerung`, `netzwerk`, `system`, `strom`, `speicher`, `sonstiges` |
| `items` | no | `true` if the user picks entities for the module (shown in the editor with "+ Entity") |
| `size` | no | `half` or `full` (layout without the grid) |
| `layout`, `min_layout` | no | Default and minimum size in the grid, e.g. `{ "w": 6, "h": 3 }` (12 columns, up to 15 rows) |
| `suggest` | no | Which entities of the device the editor suggests: `{ "domain": "sensor", "device_class": "battery", "unit": "%" }` |
| `options` | no | Settings shown in the editor: `[{ "key", "label", "type": "number"\|"text"\|"select"\|"bool", "default", "choices": [[value, label]] }]` |
| `de` | no | German translations of the module's texts – name, description, option labels and texts used with `ctx.t` (`{"Batteries": "Akkus"}`). Without it, German users see the English texts |
| `author` | no | Your GitHub handle |

## render.js

```js
function render(ctx, block) {
  // return HTML (a string) – or "" to hide the module when there is nothing to show
}
```

`ctx` contains everything a module needs; it gets no access to Home Assistant itself:

| | |
|---|---|
| `ctx.items` | The chosen entities: `{ id, name, value, unit, number, status, available, attributes }` – `value`/`unit` are formatted for display, `number` is the numeric value or `null`, `status` is `ok`, `warn`, `alert` or `off` |
| `ctx.option(key)` | Value of an option from `module.json` (or its default) |
| `ctx.device` | `{ id, name, model, state, off }` of the device the popup belongs to |
| `ctx.fmt(x, decimals)` | Number in the user's locale |
| `ctx.esc(text)` | Escape text for HTML – **always** use it for names and states |
| `ctx.t(text)`, `ctx.lang()` | Translate one of your English texts into the user's language (via `de`) / current language |

The card frame and its title (the module's name or the label the user sets) are added for you. Write all texts in English; wrap texts you show in `ctx.t("…")` and add German versions to `de` if you like.

Not allowed (the build stops with an error): network access (`fetch`, `WebSocket` …), `eval`, `document`/`window`, `localStorage`, `innerHTML`. Modules only turn the values in `ctx` into HTML.

## style.css

Every rule must start with `.mod-<type>`, so modules cannot change the rest of the display. Use the display's colour variables, which work in light and dark mode: `--label`, `--label-2`, `--label-3`, `--fill`, `--fill-2`, `--sep`, `--blue`, `--green`, `--yellow`, `--orange`, `--red`, `--teal`, `--indigo`. The cell is a size container (`@container cell (max-height: 150px) { … }`), so a module can adapt to small sizes.

## Trying it out

```bash
python3 frontend-src/build.py dev        # builds and validates all modules
```

Copy `custom_components/rack_display` to your Home Assistant, restart once (new module types need a restart), and add the module in the rack editor's library.
