/* Darstellung: Rack, Gerätefronten, Diagramme, Detailkarten-Bausteine, WLED.
   Wird beim Build an der Stelle PROTO_FUNCS in app.js eingesetzt (läuft innerhalb von createApp). */
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
