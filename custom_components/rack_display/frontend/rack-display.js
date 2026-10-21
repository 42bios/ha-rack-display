// Rack Display – Lader (ändert sich nie). Holt die aktuelle Fassung unter versionierter Adresse.
const base = "/rack_display/frontend";
let v = "";
try { v = (await (await fetch(`${base}/version.txt`, { cache: "no-store" })).text()).trim(); } catch (e) { v = String(Date.now()); }
await import(`${base}/rack-display.app.js?v=${encodeURIComponent(v)}`);
