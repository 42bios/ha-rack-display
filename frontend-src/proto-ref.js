
const RACK = { name:"Serverrack", units:42, badge:"ORACLE", plate:"EXADATA X9M-2", label1:"EXADATA", label2:"AUTONOMOUS DATABASE" };

// Beispielbelegung (Werte sind Demo-Daten, nicht live)
let DEVICES = [
  { id:"ups", name:"USV", model:"SRT3000UXI-NCLI + XBP48RM1U-LI", rearImage:"DATAURI", type:"ups", u:2, h:2, image:"DATAURI", state:"ok", power:null,
    tiles:[["Last","34","%",34],["Batterie","100","%",100],["Restlaufzeit","54","min"],["Quelle","Netz",""],["Ausgang","712","W"],["Batterie-Temp.","27","°C"]],
    chart:{label:"Last", unit:"%", base:33, amp:6, color:"--green"},
    msgs:[["ok","Selbsttest bestanden","06.10. 15:50 · 20 Sek. auf Batterie"],["ok","Netz wiederhergestellt","06.10. 15:50"]] },
  { id:"batt", group:"ups", name:"Batteriemodul", model:"APC XBP48RM1U-LI · Lithium-Ionen, 613 Wh", rearImage:"DATAURI", type:"ups", u:1, h:1, image:"DATAURI", state:"ok", power:null,
    tiles:[["Ladung","100","%",100],["Temperatur","26","°C"],["Spannung","51","V"],["Module","2","intern + extern"],["Austausch","2029","empfohlen"],["Restlaufzeit","54","min"]],
    chart:{label:"Batterietemperatur", unit:"°C", base:26, amp:2, color:"--orange"},
    msgs:[["ok","Batterie geladen","seit 06.10. 15:52"]] },
  { id:"blank1", name:"Blende", model:"1 HE, belüftet", type:"blank", u:4, h:1, state:"off", passive:true },
  { id:"msa2", name:"Docker-Host", model:"Minisforum MS-A2 · 2-HE-Gehäuse", type:"server", u:5, h:2, fans:[66.33, 86.47], state:"warn", power:48,
    tiles:[["CPU-Temperatur","86","°C",null,"warn","Grenze 80 °C"],["Prozessor","12","%",12],["Arbeitsspeicher","58","%",58],["Leistung","48","W"],["Lüfter","3100","U/min"],["Container","34","laufen"]],
    chart:{label:"CPU-Temperatur", unit:"°C", base:84, amp:7, color:"--orange", warn:80},
    msgs:[["warn","Prozessortemperatur über 80 °C","seit So · tagsüber 80–95 °C"],["ok","Backup abgeschlossen","heute 03:12"]] },
  { id:"nvr", name:"Videorekorder", model:"UniFi UNVR · 4 Schächte", type:"nvr", u:8, h:1, rearImage:"DATAURI", image:"DATAURI", state:"ok", power:38,
    tiles:[["Aufnahme","21","Tage"],["Platten","4/4","in Ordnung"],["Speicher","99","%",99,"","normal, überschreibt"],["Kameras","6","online"],["Temperatur","41","°C"],["Leistung","38","W"]],
    chart:{label:"Leistung", unit:"W", base:38, amp:3, color:"--indigo"},
    msgs:[["ok","Alle Platten in Ordnung","Prüfung heute 04:00"]] },
  { id:"unraid", name:"Storage-Server", model:"Supermicro SC846 · Unraid", type:"server", u:12, h:4, rearImage:"DATAURI", image:"DATAURI", state:"ok", power:142,
    tiles:[["Array","71","%",71],["Prozessor","8","%",8],["Temperatur","44","°C"],["Leistung","142","W"]],
    chart:{label:"Leistung", unit:"W", base:140, amp:15, color:"--blue"},
    msgs:[["ok","Paritätsprüfung abgeschlossen","02.10. · 0 Fehler · 21 Std."],["ok","Mover fertig","heute 03:40 · 212 GB verschoben"]] },
  { id:"blank2", name:"Blende", model:"1 HE", type:"blank", u:9, h:1, state:"off", passive:true },
  { id:"patch1", name:"Patchfeld A", model:"24 × Cat 6a", type:"patch", u:20, h:1, state:"off", passive:true },
  { id:"agg", name:"Aggregation", model:"UniFi USW-Pro-Aggregation", type:"sfp", u:21, h:1, rearImage:"DATAURI", image:"DATAURI", state:"ok", power:31,
    tiles:[["Ports belegt","6/32",""],["Durchsatz","1,4","Gbit/s"],["Temperatur","49","°C"],["Leistung","31","W"],["Lüfter","normal",""],["Laufzeit","38","Tage"]],
    chart:{label:"Durchsatz", unit:"Gbit/s", base:1.2, amp:.6, color:"--blue", dec:1},
    msgs:[] },
  { id:"poe", name:"Core-Switch", model:"UniFi USW-Pro-48-PoE", type:"switch", u:22, h:1, ledMap:"usw48", rearImage:"DATAURI", image:"DATAURI", state:"ok", power:96,
    tiles:[["Ports belegt","18/24",""],["PoE","68","W von 400",17],["Clients","41",""],["Temperatur","52","°C"],["Leistung","96","W"],["Lüfter","normal",""]],
    chart:{label:"PoE-Leistung", unit:"W", base:66, amp:8, color:"--teal"},
    msgs:[["warn","Port 2 neu verbunden","heute 11:42 · Kamera Carport"]] },
  { id:"patch2", name:"Patchfeld B", model:"24 × Cat 6a", type:"patch", u:23, h:1, state:"off", passive:true },
  { id:"gw", name:"Gateway", model:"UniFi UXG-Pro", type:"gw", u:24, h:1, rearImage:"DATAURI", image:"DATAURI", state:"ok", power:27,
    tiles:[["Download","312","Mbit/s"],["Upload","41","Mbit/s"],["Antwortzeit","12","ms"],["Prozessor","22","%",22],["Temperatur","58","°C"],["Leistung","27","W"]],
    chart:{label:"Antwortzeit", unit:"ms", base:12, amp:4, color:"--indigo"},
    msgs:[] },
];
// Geräte ohne Höheneinheit (Rückseite / 0 HE)
const ZERO_U = [
  { id:"pdu", name:"Stromleiste", model:"APC AP8959EU3 · schaltbar", type:"pdu", state:"ok", image:"DATAURI", thumbAspect:25.5,
    tiles:[["Gesamt","712","W"],["Strom","3,1","A"],["Spannung","230","V"],["Ausgänge an","9/24",""]],
    facts:[["Leistung","712 W"],["Strom","3,1 A"],["Spannung","230 V"],["Heute","16,9 kWh"]],
    chart:{label:"Gesamtleistung", unit:"W", base:700, amp:60, color:"--blue"},
    chart2:{label:"Strom", unit:"A", base:3.1, amp:.5, color:"--teal", dec:1, warn:13},
    outlets:Array.from({length:24}, (_, i) => ({n:i + 1, kind:(i + 1) % 8 === 0 ? "C19" : "C13", on:false, name:""})),
    msgs:[["ok","Alle Ausgänge wie geplant","Einschaltverzögerung aktiv"]] }
];


// Zusatzdaten für Netzwerkgeräte (Ports, Systemwerte, Internet)
const P = (n, kind, o = {}) => ({n, kind, speed:null, ...o});
Object.assign(DEVICES.find(d => d.id === "gw"), {
  facts:[["Laufzeit","38 Tage"],["Firmware","4.1.13"],["Clients","41"],["VPN","2 Tunnel"]],
  wan:{down:312, up:41, plan:"Tarif 1000 / 100 Mbit/s", ping:12, loss:"0 %", month:"1,24 TB"},
  sys:{cpu:22, ram:61, temp:58},
  portLayout:[["rj45",[1,2]],["sfp",[3,4]]],
  ports:[P(1,"rj45",{role:"WAN 1", speed:"1G", peer:"Glasfaser-Modem", rx:312, tx:41}), P(2,"rj45",{role:"LAN"}),
         P(3,"sfp",{role:"LAN", speed:"10G", peer:"USW-Pro-Aggregation · Port 1", rx:296, tx:38}), P(4,"sfp",{role:"WAN 2"})],
});
Object.assign(DEVICES.find(d => d.id === "agg"), {
  facts:[["Laufzeit","38 Tage"],["Firmware","7.1.26"],["Durchsatz","1,4 Gbit/s"],["Lüfter","normal"]],
  sys:{cpu:9, ram:44, temp:49},
  portLayout:[["sfp",Array.from({length:28},(_, i) => i + 1)],["sfp28",[29,30,31,32]]],
  ports:Array.from({length:32},(_, i) => P(i + 1, i < 28 ? "sfp" : "sfp28")),
});
(() => { const a = DEVICES.find(d => d.id === "agg").ports;
  Object.assign(a[0], {speed:"10G", peer:"UXG-Pro · Port 3", rx:38, tx:296});
  Object.assign(a[1], {speed:"10G", peer:"Core-Switch", rx:410, tx:120});
  Object.assign(a[2], {speed:"10G", peer:"Docker-Host", rx:85, tx:240});
  Object.assign(a[3], {speed:"10G", peer:"Videorekorder", rx:180, tx:12});
  Object.assign(a[4], {speed:"1G", peer:"Switch OG", rx:22, tx:9});
  Object.assign(a[5], {speed:"1G", peer:"Switch Garage", rx:4, tx:2});
  Object.assign(a[28], {speed:"25G", peer:"Reserve-Uplink", rx:0, tx:0});
})();

Object.assign(DEVICES.find(d => d.id === "ups"), {
  facts:[["Netzwerkkarte","AP9641"],["Batterie","100 %"],["Austausch","2029"],["Selbsttest ✓","06.10."]],
  flow:{inV:231, hz:50, outV:230, load:712, loadPct:34, batt:100, runtime:54, source:"Netz"},
});

Object.assign(DEVICES.find(d => d.id === "nvr"), {
  facts:[["Laufzeit","38 Tage"],["Firmware","4.2.11"],["Kameras","6 online"],["Leistung","38 W"]],
  sys:{cpu:31, ram:57, temp:41},
  disks:[{n:1, size:"8 TB", temp:38, state:"ok"},{n:2, size:"8 TB", temp:39, state:"ok"},{n:3, size:"8 TB", temp:40, state:"ok"},{n:4, size:"8 TB", temp:38, state:"ok"}],
  raid:{level:"RAID 5", usable:"21,8 TB", used:99},
  rec:{days:21, types:[["Dauer",62,"--blue"],["Bewegung",30,"--orange"],["Erkennungen",8,"--purple"]], cams:6, camsOnline:6, events:148},
});
(() => {
  const d = DEVICES.find(x => x.id === "unraid");
  const spec = [["P1","Parität",18,36],["P2","Parität 2",18,35],["1","Disk 1",18,37,88],["2","Disk 2",18,38,91],["3","Disk 3",16,36,84],["4","Disk 4",16,0,79],
    ["5","Disk 5",12,0,73],["6","Disk 6",12,0,69],["7","Disk 7",12,39,62],["8","Disk 8",8,0,55],["C1","Cache",2,41,38],["C2","Cache 2",2,40,38]];
  const role = n => n.startsWith("P") ? "parity" : n.startsWith("C") ? "cache" : "data";
  d.bays = Array.from({length:24}, (_, i) => {
    const sp = spec[i];
    return sp ? {n:i + 1, id:sp[0], name:sp[1], tb:sp[2], temp:sp[3], used:sp[4] ?? null, role:role(sp[0]), spun:sp[3] > 0} : {n:i + 1, role:"empty"};
  });
  Object.assign(d, {
    facts:[["Unraid","7.1.4"],["Laufzeit","38 Tage"],["Docker","14 laufen"],["VMs","2 laufen"]],
    sys:{cpu:8, ram:46, temp:44},
    array:{total:"112 TB", used:"79,6 TB", pct:71, free:"32,4 TB", parity:"02.10. · 0 Fehler", shares:9, cache:{pct:38, size:"2 TB"}},
  });
})();
(() => {
  const d = DEVICES.find(x => x.id === "poe");
  const ports = Array.from({length:52}, (_, i) => ({n:i + 1, kind:i < 48 ? "rj45" : "sfp", speed:null, poe:0}));
  const set = (n, o) => Object.assign(ports[n - 1], o);
  const cams = ["Kamera Einfahrt","Kamera Carport","Kamera Garten","Kamera Haustür","Kamera Terrasse","Kamera Garage"];
  cams.forEach((c, i) => set(i + 1, {speed:"1G", peer:c, poe:[4.8,5.1,4.6,3.9,5.3,4.4][i], rx:6, tx:1}));
  ["AP Wohnen","AP Büro","AP OG","AP Keller","AP Garten"].forEach((a, i) => set(i + 9, {speed:"1G", peer:a, poe:[9.6,8.8,10.2,7.9,11.4][i], rx:40 - i * 5, tx:12}));
  ["Türsprechstelle","Wandpanel","Smart Hub","Drucker","TV Wohnen","Sonos Wohnen","Apple TV","Wärmepumpe"].forEach((x, i) => set(i + 17, {speed:"1G", peer:x, poe:i < 2 ? [6.2,7.1][i] : 0, rx:3, tx:1}));
  [29,30,31,33,35].forEach((n, i) => set(n, {speed:"1G", peer:["Büro Dose 1","Büro Dose 2","Kinderzimmer","Gästezimmer","Werkstatt"][i], rx:2, tx:1}));
  set(49, {speed:"10G", peer:"USW-Pro-Aggregation · Port 2", rx:120, tx:410});
  d.ports = ports;
  d.portLayout = [["rj45",[...Array(12).keys()].map(i => i + 1)],["rj45",[...Array(12).keys()].map(i => i + 13)],["rj45",[...Array(12).keys()].map(i => i + 25)],["rj45",[...Array(12).keys()].map(i => i + 37)],["sfp",[49,50,51,52]]];
  const poeUsed = ports.reduce((a, x) => a + x.poe, 0);
  Object.assign(d, {
    facts:[["Laufzeit","38 Tage"],["Firmware","7.1.26"],["Clients","41"],["Lüfter","normal"]],
    sys:{cpu:14, ram:52, temp:52},
    poe:{used:Math.round(poeUsed), budget:600},
  });
})();
// Belegung nach Foto vom 11.10. (von oben nach unten)
DEVICES = DEVICES.filter(d => !["blank1", "blank2", "patch1", "patch2"].includes(d.id));
Object.entries({gw:37, agg:35, poe:33, nvr:22, msa2:20, unraid:11, ups:7, batt:9}).forEach(([id, u]) => { DEVICES.find(d => d.id === id).u = u; });
[["ks1","Patchfeld","Keystone","ks",42],["cm1","Kabelführung","1 HE","cm",41],["ks2","Patchfeld","Keystone","ks",40],["cm2","Kabelführung","1 HE","cm",39],
 ["lwl","LWL-Patchfeld","LC-Duplex","lwl",38],["cm3","Kabelführung","1 HE","cm",36],["cm4","Kabelführung","1 HE","cm",34],["cm5","Kabelführung","1 HE","cm",32],
 ["bl31","Blende","1 HE","bl",31],["cm6","Kabelführung","1 HE","cm",30],["bl26","Blende","1 HE","bl",26],["bl25","Blende","1 HE","bl",25],
 ["shelf23","Fachboden","2 HE · kleine Geräte","shelf",23,2],
 ...[19,18,17,16,15,10,6,5,4,3,2,1].map(u => ["bl" + u,"Blende","1 HE","bl",u])
].forEach(([id, name, model, type, u, h = 1]) => DEVICES.push({id, name, model, type, u, h, state:"off", passive:true}));
const PDU_IMG = "DATAURI";
[["UXG-Pro"],["USW-Pro-Aggregation"],["Core-Switch"],["Videorekorder"],["Docker-Host"],["Glasfaser-Modem"],["Patch-Switch"],[""],["Rack-Lüfter"]]
  .forEach(([name], i) => { const o = ZERO_U[0].outlets[i]; o.name = name; o.on = !!name; });
ZERO_U[0].outlets[9].name = "Reserve"; ZERO_U[0].outlets[9].on = true;
const TEMPLATES = [
  {type:"server",name:"Server",h:2},{type:"switch",name:"Switch (RJ45)",h:1},{type:"sfp",name:"Switch (SFP+)",h:1},
  {type:"gw",name:"Router / Gateway",h:1},{type:"nvr",name:"NAS / Rekorder",h:1},{type:"ups",name:"USV",h:2},
  {type:"patch",name:"Patchfeld",h:1},{type:"shelf",name:"Fachboden",h:2},{type:"blank",name:"Blende",h:1},
];

// Kiosk/Pi: ohne Unschärfe-Effekte (GPU-schonend), Touch-Feinheiten
if (/touchkio|electron/i.test(navigator.userAgent) || /[?&]lite/.test(location.search)) document.documentElement.classList.add("lite");
const S = { sel:null, mode:"view", door:true, slot:null, side:"front", outlet:null };
const $ = id => document.getElementById(id);
const nf = new Intl.NumberFormat("de-DE");
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const allDevices = () => [...DEVICES, ...ZERO_U];
const members = id => DEVICES.filter(d => d.id === id || d.group === id).sort((a, b) => b.u - a.u);
const selOf = d => d.group || d.id;
const isSel = d => S.sel && selOf(d) === S.sel;
const byId = id => allDevices().find(d => d.id === id);

const FAN_IMG = "DATAURI";
const MSA2_PANEL = "DATAURI";
// LED-Positionen auf dem Frontfoto des USW-Pro-48-PoE (in % des Bildes)
function leds48(d){
  if (!d.ports) return "";
  // aus dem Frontfoto ausgelesen: x-Position je Port-Spalte (Prozent), y für obere/untere Reihe
  const G = [11.35,14.5,17.65,20.85,24,27.15,31.1,34.25,37.45,40.6,43.75,46.95,50.9,54.05,57.2,60.4,63.55,66.7,70.7,73.85,77,80.15,83.3,86.5];
  const A = [9,12.2,15.3,18.5,21.75,24.85,28.75,31.95,35.15,38.3,41.45,44.65,48.6,51.75,54.9,58.1,61.3,64.45,68.4,71.55,74.7,77.85,81.05,84.2];
  const out = [];
  for (let c = 0; c < 24; c++) for (let r = 0; r < 2; r++){
    const n = c * 2 + r + 1, p = d.ports[n - 1], y = r ? 76.5 : 22.4, h = (n * 7919) % 100;
    out.push(`<i class="pl-led ${p.speed ? "link" : "off"}" style="left:${G[c]}%;top:${y}%;${p.speed ? `animation-duration:${(0.12 + (h % 9) * 0.07).toFixed(2)}s;animation-delay:-${(h / 50).toFixed(2)}s` : ""}"></i>`);
    out.push(`<i class="pl-led poe ${p.poe ? "on" : "off"}" style="left:${A[c]}%;top:${y}%"></i>`);
  }
  return `<div class="leds">${out.join("")}</div>`;
}
function face(d){
  if (d.fans){
    const spd = d.state === "off" ? 0 : 0.9;
    return `<div class="face f-panel">${d.fans.map(x => `<i class="fan" style="left:${x}%;${spd ? `animation-duration:${spd}s` : "animation:none"}"></i>`).join("")}<i class="pl"></i>${d.passive ? "" : `<i class="led ${d.state}" style="left:6%;right:auto"></i>`}</div>`;
  }
  const inner = {
    server:'<div class="bays"></div><div class="ctl"></div>',
    switch:'<div class="logo"></div><div class="ports"></div>',
    sfp:'<div class="logo"></div><div class="ports"></div>',
    gw:'<div class="lcd"></div><div class="ports"></div>',
    nvr:'<div class="lcd"></div><div class="bays"></div>',
    ups:'<div class="lcd"></div><div class="btns"></div><div class="vent"></div>',
    patch:'<div class="strip"></div><div class="ports"></div>',
    shelf:'<div class="plate"></div><div class="box"></div>',
    blank:'', pdu:'<div class="ports"></div>', cm:'<i class="lip"></i>', bl:'<i class="slot"></i>', ks:'<div class="ksr"></div>', lwl:'<div class="lwr"></div>'
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
  rack.style.setProperty("--units", RACK.units);
  rack.classList.toggle("open", !S.door || S.side === "rear");
  rack.classList.toggle("edit", S.mode === "edit");
  rack.classList.toggle("has-sel", !!S.sel && !!DEVICES.find(d => selOf(d) === S.sel));
  rack.classList.toggle("rear", S.side === "rear");
  $("badge").textContent = RACK.badge; $("cap").textContent = RACK.badge; $("plate").textContent = RACK.plate; $("plate").hidden = !RACK.plate;
  $("doorL1").textContent = RACK.label1;
  $("doorL2").textContent = RACK.label2;

  $("unums").innerHTML = Array.from({length:RACK.units}, (_, i) => `<span>${RACK.units - i}</span>`).join("");
  $("bay").innerHTML = DEVICES.map(d =>
    `<div class="dev ${isSel(d) ? "sel" : ""}" style="grid-row:${rowOf(d)}">${S.side === "rear" ? rearFace(d) : face(d)}</div>`).join("");

  const used = new Set(); DEVICES.forEach(d => { for (let u = d.u; u < d.u + d.h; u++) used.add(u); });
  const empties = [];
  for (let u = 1; u <= RACK.units; u++) if (!used.has(u)) empties.push(u);
  $("hits").innerHTML =
    DEVICES.map(d => `<button class="hit ${d.passive ? "" : d.state} ${isSel(d) ? "sel" : ""}" style="grid-row:${rowOf(d)}" data-id="${selOf(d)}" aria-label="${d.name}, HE ${d.u}${d.h > 1 ? "–" + (d.u + d.h - 1) : ""}"></button>`).join("") +
    "" ;
  $("pduHit").hidden = S.side !== "rear";
  $("pduHit").classList.toggle("sel", S.sel === "pdu");
  $("pduHit").style.backgroundImage = `url('${PDU_IMG}')`;
  $("hits").innerHTML +=
    empties.map(u => `<button class="hit empty" style="grid-row:${RACK.units - u + 1}" data-slot="${u}" aria-label="HE ${u} frei, Gerät einsetzen">+</button>`).join("");
}

/* ---------- Diagramm ---------- */
function series(seed, base, amp, n = 49){
  let x = seed * 9301 + 49297, out = [];
  for (let i = 0; i < n; i++){
    x = (x * 9301 + 49297) % 233280;
    const day = Math.sin((i / (n - 1)) * Math.PI * 2 - 1.6);
    out.push(Math.max(0, base + amp * .7 * day + amp * .5 * (x / 233280 - .5)));
  }
  return out;
}
function chartSVG(c, seed, W = 600, H = 150){
  const v = series(seed, c.base, c.amp), pl = 34, pr = 8, pt = 10, pb = 22;
  const lo = Math.min(...v, c.warn ?? Infinity) * .95, hi = Math.max(...v, c.warn ?? -Infinity) * 1.04;
  const X = i => pl + (i / (v.length - 1)) * (W - pl - pr), Y = y => pt + (1 - (y - lo) / (hi - lo)) * (H - pt - pb);
  const line = v.map((y, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(y).toFixed(1)}`).join("");
  const col = css(c.color) || "#0a84ff", gid = "g" + seed;
  const dec = c.dec ?? 0, f = y => y.toLocaleString("de-DE", {maximumFractionDigits: dec, minimumFractionDigits: dec});
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

/* ---------- Panel ---------- */
const ICONS = {
  bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  temp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1.8 20.5h20.4zm-1 6h2v6h-2zm0 8h2v2h-2z"/></svg>',
  plug:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 2h2v5h4V2h2v5h1a1 1 0 0 1 1 1v4a6 6 0 0 1-5 5.9V22h-2v-4.1A6 6 0 0 1 6 12V8a1 1 0 0 1 1-1h1z"/></svg>',
  chev:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
};
const STATE_TXT = { ok:"In Ordnung", warn:"Hinweis", alert:"Störung", off:"Passiv" };
const worst = () => { const s = DEVICES.concat(ZERO_U).filter(d => !d.passive).map(d => d.state); return s.includes("alert") ? "alert" : s.includes("warn") ? "warn" : "ok"; };

function header(){
  const st = worst();
  const inDetail = !!(S.slot || (S.sel && byId(S.sel)));
  return `<div class="bar">
    ${inDetail && !S.slot ? `<button class="back pill" data-back aria-label="Zurück zur Übersicht">${ICONS.chev}</button>` : ""}
    <div><h1>${RACK.name}</h1><div class="sub">${RACK.units} HE · ${DEVICES.reduce((a, d) => a + d.h, 0)} belegt · ${DEVICES.filter(d => !d.passive && !d.group).length + ZERO_U.length} aktive Geräte</div></div>
    <span class="chip ${st}"><i></i>${st === "ok" ? "Alles in Ordnung" : (n => n + (st === "warn" ? (n === 1 ? " Hinweis" : " Hinweise") : (n === 1 ? " Störung" : " Störungen")))(allDevices().flatMap(d => d.msgs || []).filter(m => m[0] === st).length)}</span>
    <span class="wled-chip ${WLED.on ? "" : "off"}"><button class="wsw" data-wled-power role="switch" aria-checked="${WLED.on}" aria-label="WLED ein- oder ausschalten"></button><button class="wfx" data-wled ${WLED.on ? "" : "disabled"} aria-label="WLED-Effekt wechseln (Demo)">WLED · ${WLED.on ? WLED.effects[WLED.fx][0] : "Aus"}</button></span>
    <span class="spacer"></span>

    <span class="clock" id="clock"></span>
  </div>`;
}

function spark(seed, base, amp, color, n = 32){
  const v = series(seed, base, amp, n), lo = Math.min(...v), hi = Math.max(...v);
  const X = i => i / (n - 1) * 100, Y = y => 27 - (y - lo) / (hi - lo || 1) * 24;
  const d = v.map((y, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(y).toFixed(1)}`).join("");
  return `<svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="${d}L100,30L0,30Z" fill="${color}" opacity=".18"/><path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" vector-effect="non-scaling-stroke"/></svg>`;
}
const SEG_COLORS = ["--blue","--indigo","--teal","--orange","--purple","--green"];
const tileNum = (d, re) => { const t = (d.tiles || []).find(t => re.test(t[0])); return t ? parseFloat(String(t[1]).replace(",", ".")) : null; };

function hcol(t){ const h = Math.max(0, Math.min(190, 190 - (t - 20) * 12)); return `hsl(${h} 72% ${h > 120 ? 44 : 50}%)`; }
const TMIN = 18, TMAX = 40;
const TS0 = 15, TS1 = 45, TWARN = 35, TALERT = 40;
const tp = t => Math.max(0, Math.min(100, (t - TS0) / (TS1 - TS0) * 100));
const tpos2 = t => Math.max(8, Math.min(100, (t - 15) / (40 - 15) * 100));
const tpos = t => Math.max(0, Math.min(100, (t - TMIN) / (TMAX - TMIN) * 100));
// Wetter-App-Skala: türkis → grün → gelb → orange → rot
function tc2(t){
  const st = [[18,[48,213,200]],[23,[52,199,89]],[28,[255,214,10]],[32,[255,159,10]],[38,[255,69,58]]];
  if (t <= st[0][0]) return `rgb(${st[0][1]})`;
  for (let i = 1; i < st.length; i++) if (t <= st[i][0]){ const [a, ca] = st[i - 1], [b, cb] = st[i], k = (t - a) / (b - a); return `rgb(${ca.map((c, j) => Math.round(c + (cb[j] - c) * k))})`; }
  return `rgb(${st.at(-1)[1]})`;
}
function tcol(t){ return t >= 35 ? "var(--red)" : t >= 30 ? "var(--orange)" : t >= 26 ? "var(--green)" : "var(--teal)"; }
function heat(t){
  const c = t >= 35 ? "--red" : t >= 30 ? "--orange" : t >= 25 ? "--green" : "--teal";
  return `background:color-mix(in srgb,var(${c}) 24%,transparent);color:var(${c})`;
}
function overview(){
  const active = allDevices().filter(d => !d.passive && !d.group);
  const total = 712, cap = 2700, pct = total / cap, R = 56, C = 2 * Math.PI * R;
  const warnMsgs = active.flatMap(d => (d.msgs || []).filter(m => m[0] !== "ok").map(m => ({d, m})));
  const powered = DEVICES.filter(d => d.power).sort((a, b) => b.power - a.power);
  const other = total - powered.reduce((a, d) => a + d.power, 0);
  const segs = powered.map((d, i) => ({name:d.name, id:d.id, w:d.power, c:`var(${SEG_COLORS[i % SEG_COLORS.length]})`}))
    .concat([{name:"nicht zugeordnet", w:other, c:"var(--label-3)"}]);
  const zones = [["Oben", 26, 33], ["Mitte", 24, 31], ["Unten", 23, 29]];
  const avgIn = Math.round(zones.reduce((a, z) => a + z[1], 0) / 3), avgOut = Math.round(zones.reduce((a, z) => a + z[2], 0) / 3);
  const hot = DEVICES.filter(d => !d.passive).map(d => ({d, t:tileNum(d, /temp/i)})).filter(x => x.t != null).sort((a, b) => b.t - a.t)[0];
  const usedU = DEVICES.reduce((a, d) => a + d.h, 0);
  const unr = byId("unraid"), poeSw = byId("poe"), pdu = byId("pdu");
  return `<div class="ov">
  <section class="card en">
    <h2>Strom</h2>
    <div class="en-head">
      <div class="en-big">${nf.format(total)}<small>W</small></div>
      <div class="en-today"><b>16,9 kWh</b><span>heute</span></div>
    </div>
    <div class="en-bar" role="img" aria-label="Auslastung der USV ${Math.round(pct * 100)} %">
      ${segs.map(x => `<i style="width:${x.w / cap * 100}%;background:${x.c}"></i>`).join("")}
      <span class="en-warn" style="left:70%"></span>
    </div>
    <div class="en-scale"><span>${Math.round(pct * 100)} % der USV-Kapazität</span><span>${nf.format(cap / 1000)} kW</span></div>
    ${(() => { const lv = 100, rt = 54, c = lv < 20 ? "var(--red)" : lv < 50 ? "var(--orange)" : "var(--green)"; return `<button class="ups-bar" data-id="ups" aria-label="USV-Akku ${lv} Prozent, ${rt} Minuten Reserve, Netzbetrieb">
      <div class="en-bar bat"><i style="width:${lv}%;background:${c}"></i></div>
      <div class="en-scale"><span>Akku <b>${lv} %</b> · ${rt} min</span><span class="ups-ok"><i class="dot ok"></i>Netzbetrieb</span></div></button>`; })()}
    <div class="en-list">${segs.slice(0, -1).slice(0, 5).map(x => `<button data-id="${x.id}"><i style="background:${x.c}"></i><span>${x.name}</span><b>${nf.format(x.w)} W</b></button>`).join("")}
      <div class="rest"><i style="background:var(--label-3)"></i><span>Übrige</span><b>${nf.format(segs.slice(5).reduce((a, x) => a + x.w, 0))} W</b></div></div>
    <div class="ov-chart"><div class="ov-leg"><span><i style="background:var(--blue)"></i>Leistung 24 Std.</span><span>Ø ${nf.format(698)} W · Spitze ${nf.format(781)} W</span></div>
      ${lazy((W, H) => { const v = series(41, 700, 70); v[v.length - 1] = total; return chartMulti([{v, color:css("--blue"), fill:true}], {lo:560, hi:820, W, H}); })}</div>
  </section>

  <section class="card en th3">
    <h2>Temperatur <span class="chip ok" style="text-transform:none;letter-spacing:0"><i></i>Normal</span></h2>
    <div class="en-head">
      <div class="en-big">${avgOut}<small>°C</small></div>
      <div class="en-today"><b>${avgIn} °C</b><span>Zuluft</span></div>
    </div>
    <div class="tscale" role="img" aria-label="Abluft ${avgOut} Grad, Zuluft ${avgIn} Grad, Grenze ${TWARN} Grad">
      <i class="tz ok" style="width:${tp(TWARN)}%"></i><i class="tz warn" style="width:${tp(TALERT) - tp(TWARN)}%"></i><i class="tz alert" style="width:${100 - tp(TALERT)}%"></i>
      <b class="trange" style="left:${tp(avgIn)}%;width:${tp(avgOut) - tp(avgIn)}%"></b>
      <em class="tmark" style="left:${tp(avgIn)}%"></em><em class="tmark out" style="left:${tp(avgOut)}%"></em>
    </div>
    <div class="en-scale"><span>+${avgOut - avgIn} K wärmer als Zuluft</span><span>Grenze ${TWARN} °C</span></div>
    <div class="ztab">
      <span class="zh">Höhe</span><span class="zh">Vorne<i class="zx"> (rein)</i></span><span class="zh">Hinten<i class="zx"> (raus)</i></span><span class="zh">Diff.</span>
      ${zones.map(([n, f, b]) => `<span class="zn"><i class="zlvl" data-l="${n}"></i>${n}</span><b style="color:${tc2(f)}">${f} °C</b><b style="color:${tc2(b)}">${b} °C</b><em>+${b - f} K</em>`).join("")}
    </div>
    <div class="ov-chart"><div class="ov-leg"><span><i style="background:var(--teal)"></i>Zuluft</span><span><i style="background:var(--orange)"></i>Abluft</span><span>24 Std.</span></div>
      ${lazy((W, H) => { const a = series(51, avgIn, 2), b = series(53, avgOut, 3.5); a[a.length - 1] = avgIn; b[b.length - 1] = avgOut; return chartMulti([{v:a, color:css("--teal")}, {v:b, color:css("--orange"), fill:true}], {lo:18, hi:38, W, H}); })}</div>

  </section>

  ${warnMsgs.length ? `<section class="card wide hints"><h2><span>Hinweise <i class="cnt">${warnMsgs.length}</i></span>${warnMsgs.length > 2 ? `<em>+${warnMsgs.length - 2} weitere</em>` : ""}</h2><div class="hint-grid">
    ${warnMsgs.slice(0, 2).map(({d, m}) => `<button class="hint ${m[0]}" data-id="${d.id}">
      <span class="hic">${ICONS.warn}</span>
      <span class="ht"><b>${m[1]}</b><span><i>${d.name}</i>${m[2]}</span></span><span class="chev">›</span></button>`).join("")}
  </div></section>` : ""}



  <div class="stats wide">
    <button data-id="gw"><span>Internet</span><b>312<small>↓</small> 41<small>↑</small></b><em>Mbit/s · 12 ms</em></button>
    <button data-id="unraid"><span>Speicher</span><b>${unr.array.pct}<small>%</small></b><em>${unr.array.used.replace(" TB", "")} / ${unr.array.total}</em></button>
    <button data-id="poe"><span>PoE</span><b>${poeSw.poe.used}<small>W</small></b><em>von ${poeSw.poe.budget} W</em></button>
    <button data-id="pdu"><span>Stromleiste</span><b>${pdu.outlets.filter(o => o.on).length}<small>/ 24 an</small></b><em>3,1 / 16 A</em></button>
  </div>
  </div>`;
}

const CHARTS = [];
const lazy = fn => `<div class="cw" data-ci="${CHARTS.push(fn) - 1}"></div>`;
function fillCharts(){
  document.querySelectorAll(".cw").forEach(el => {
    const box = el.closest(".ov-chart");
    if (box && el.clientHeight < 56){ box.classList.add("nochart"); return; }
    el.innerHTML = CHARTS[+el.dataset.ci](Math.max(160, el.clientWidth), Math.max(70, el.clientHeight));
  });
}
const SPEED_TXT = {"1G":"1 Gbit/s","10G":"10 Gbit/s","25G":"25 Gbit/s"};
const KIND_TXT = {rj45:"RJ45", sfp:"SFP+", sfp28:"SFP28"};
function poeCard(d){
  const top = d.ports.filter(p => p.poe).sort((a, b) => b.poe - a.poe), max = top[0].poe, pct = Math.round(d.poe.used / d.poe.budget * 100);
  return `<section class="card grow"><h2>PoE <em>${top.length} Geräte versorgt</em></h2>
    <div class="mini" style="border-top:0;padding-top:0"><span><b style="font:700 26px var(--font-display)">${d.poe.used} W</b> von ${d.poe.budget} W</span><b>${pct} %</b></div>
    <div class="meter"><b style="width:${pct}%;background:var(--orange)"></b></div>
    <div class="poelist">${top.map(p => `<div><span>${p.n} · ${p.peer}</span><i><b style="width:${p.poe / max * 100}%"></b></i><em>${nf.format(p.poe)} W</em></div>`).join("")}</div>
  </section>`;
}

// Mehrere Linien auf einer Skala; mirror: zweite Serie nach unten gespiegelt
function chartMulti(sers, {lo, hi, fmt = v => nf.format(Math.round(v)), mirror = false, W = 600, H = 150} = {}){
  const pl = 36, pr = 8, pt = 10, pb = 22;
  const X = (i, n) => pl + (i / (n - 1)) * (W - pl - pr);
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

function portCard(d){
  if (!S.port || !d.ports.find(p => p.n === S.port)) S.port = (d.ports.find(p => p.speed) || d.ports[0]).n;
  const sel = d.ports.find(p => p.n === S.port), up = d.ports.filter(p => p.speed).length;
  const grp = ([kind, nums]) => `<div class="pgrp">${nums.map(n => {
    const p = d.ports.find(x => x.n === n);
    return `<button class="port ${kind} ${p.speed ? "up s" + p.speed : ""} ${S.port === n ? "sel" : ""}" data-port="${n}" aria-label="Port ${n}">${n}${p.poe ? '<i class="pw"></i>' : ""}</button>`;
  }).join("")}</div>`;
  return `<section class="card"><h2>Ports <em>${up} von ${d.ports.length} verbunden</em></h2>
    <div class="ports ${d.ports.length <= 8 ? "big" : d.ports.length > 40 ? "dense" : ""}">${d.portLayout.map(grp).join("")}</div>
    <div class="plegend"><span><i style="background:var(--indigo)"></i>25 Gbit/s</span><span><i style="background:var(--blue)"></i>10 Gbit/s</span><span><i style="background:var(--green)"></i>1 Gbit/s</span><span><i style="background:var(--fill-2)"></i>nicht verbunden</span>${d.ports.some(p => p.poe) ? '<span><i style="background:var(--orange);border-radius:50%'+'"></i>PoE aktiv</span>' : ""}</div>
    <div class="pinfo"><span class="pn">${sel.n}</span>
      <span class="pd"><b>${sel.role ? sel.role + " · " : ""}${sel.peer || "Nicht verbunden"}</b><span>${KIND_TXT[sel.kind]}${sel.speed ? " · " + SPEED_TXT[sel.speed] : ""}${sel.poe ? " · PoE " + nf.format(sel.poe) + " W" : ""}</span></span>
      <span class="tr">${sel.speed ? `↓ <b>${nf.format(sel.rx)}</b> ↑ <b>${nf.format(sel.tx)}</b> Mbit/s` : ""}</span></div>
  </section>`;
}

function wanCard(d){
  const w = d.wan, dn = series(11, w.down * .8, w.down * .7), upv = series(17, w.up * .8, w.up * .7);
  dn[dn.length - 1] = w.down; upv[upv.length - 1] = w.up;
  const hi = Math.max(...dn) * 1.1, lo = -Math.max(...upv) * 2.2;
  return `<section class="card grow"><h2>Internet <em>${w.plan}</em></h2>
    <div class="wanhead">
      <div><span><i style="background:var(--purple)"></i>Download</span><b>${nf.format(w.down)}<small>Mbit/s</small></b></div>
      <div><span><i style="background:var(--teal)"></i>Upload</span><b>${nf.format(w.up)}<small>Mbit/s</small></b></div>
    </div>
    ${lazy((W, H) => chartMulti([{v:dn, color:"#bf5af2", fill:true}, {v:upv, color:"#30d5c8", fill:true, neg:true}], {lo, hi, mirror:true, W, H}))}
    <div class="mini" style="margin-top:10px"><span>Antwortzeit <b>${w.ping} ms</b> · Verlust <b>${w.loss}</b></span><span>Oktober <b>${w.month}</b></span></div>
  </section>`;
}

function sysCard(d){
  const s = d.sys, k = d.id.length;
  const cpu = series(k + 2, s.cpu, s.cpu * .8), ram = series(k + 5, s.ram, 6), tmp = series(k + 9, s.temp, 8);
  cpu[cpu.length - 1] = s.cpu; ram[ram.length - 1] = s.ram; tmp[tmp.length - 1] = s.temp;
  return `<section class="card grow"><h2>System <em>24 Std.</em></h2>
    <div class="serleg"><span><i style="background:var(--blue)"></i>CPU <b>${s.cpu} %</b></span><span><i style="background:var(--indigo)"></i>RAM <b>${s.ram} %</b></span><span><i style="background:var(--orange)"></i>Temp. <b>${s.temp} °C</b></span></div>
    ${lazy((W, H) => chartMulti([{v:cpu, color:css("--blue"), fill:true}, {v:ram, color:css("--indigo")}, {v:tmp, color:css("--orange")}], {lo:0, hi:100, W, H}))}
    <div class="mini" style="margin-top:10px"><span>Spitze <b>${Math.round(Math.max(...cpu))} %</b> · <b>${Math.round(Math.max(...tmp))} °C</b></span><span>Ø RAM <b>${Math.round(ram.reduce((a, b) => a + b) / ram.length)} %</b></span></div>
  </section>`;
}

function flowCard(d){
  const f = d.flow, onBatt = f.source !== "Netz", bypass = !!f.bypass;
  const rackIco = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 2v3h12V4Zm0 5v3h12V9Zm0 5v3h12v-3Z"/></svg>';
  const w = on => `<div class="fw ${on ? "on" : ""}"></div>`;
  return `<section class="card"><h2>Energiefluss <em>Online-USV · ${bypass ? "Bypass aktiv" : onBatt ? "Batteriebetrieb" : "Doppelwandlung"}</em></h2>
    <div class="flow2">
      <div class="byp ${bypass ? "on" : ""}"><span>Bypass ${bypass ? "aktiv" : "inaktiv"}</span></div>
      <div class="frow">
        <div class="fn ${onBatt ? "" : "on"}"><div class="ic">${ICONS.plug}</div><b>${f.inV} V</b><span>Netz</span></div>
        ${w(!onBatt && !bypass)}
        <div class="fn conv"><div class="ic">AC<i>→</i>DC</div><b>&nbsp;</b><span>Gleichrichter</span></div>
        ${w(!onBatt && !bypass)}
        <div class="fn bat ${bypass ? "" : "on"}"><div class="ic"><span class="bglyph"><b style="width:${f.batt}%"></b></span></div><b>${f.batt} %</b><span>${f.runtime} min</span></div>
        ${w(!bypass)}
        <div class="fn conv"><div class="ic">DC<i>→</i>AC</div><b>&nbsp;</b><span>Wechselrichter</span></div>
        ${w(!bypass)}
        <div class="fn on"><div class="ic">${rackIco}</div><b>${nf.format(f.load)} W</b><span>${f.outV} V · ${f.loadPct} %</span></div>
      </div>
      <p class="fnote">${onBatt ? "Netz ausgefallen: Die Last läuft aus dem Akku." : "Der Strom läuft immer über Akku und Wechselrichter. Fällt das Netz aus, gibt es keine Umschaltzeit."}</p>
    </div>
  </section>`;
}

function voltCard(d){
  const f = d.flow;
  const vin = series(31, f.inV, 4), vout = series(33, f.outV, .6);
  vin[vin.length - 1] = f.inV; vout[vout.length - 1] = f.outV;
  return `<section class="card grow"><h2>Spannung <em>24 Std.</em></h2>
    <div class="serleg"><span><i style="background:var(--orange)"></i>Eingang <b>${f.inV} V</b></span><span><i style="background:var(--green)"></i>Ausgang <b>${f.outV} V</b></span></div>
    ${lazy((W, H) => chartMulti([{v:vin, color:css("--orange")}, {v:vout, color:css("--green")}], {lo:220, hi:242, W, H}))}
    <div class="mini" style="margin-top:10px"><span>Eingang min <b>${Math.round(Math.min(...vin))} V</b> · max <b>${Math.round(Math.max(...vin))} V</b></span><span>Ausgang stabil</span></div>
  </section>`;
}

function rearFace(d){
  if (d.rearImage) return `<div class="face f-image" style="background-image:url('${d.rearImage}')">${d.passive ? "" : `<i class="led ${d.state}"></i>`}</div>`;
  if (["blank", "cm", "bl"].includes(d.type)) return "";
  if (["ks", "lwl"].includes(d.type)) return `<div class="face f-patch"><div class="ports"></div></div>`;
  if (d.type === "patch") return `<div class="face f-patch"><div class="ports"></div></div>`;
  if (d.type === "shelf") return `<div class="face f-shelf"><div class="plate"></div><div class="box"></div></div>`;
  return `<div class="face f-rear"><div class="grill" style="left:4%;width:${d.h > 1 ? 34 : 24}%"></div><div class="nic"></div><div class="psu"></div>${d.passive ? "" : `<i class="led ${d.state}" style="right:auto;left:40%"></i>`}</div>`;
}

function outletCard(d){
  const os = d.outlets;
  if (!S.outlet) S.outlet = 1;
  const o = os.find(x => x.n === S.outlet), on = os.filter(x => x.on).length;
  const groups = [os.slice(0, 8), os.slice(8, 16), os.slice(16, 24)];
  return `<section class="card"><h2>Ausgänge <em>${on} von ${os.length} an</em></h2>
    <div class="outlets">${groups.map(g => `<div class="ogrp">${g.map(x => `<button class="outlet ${x.kind} ${x.on ? "on" : ""} ${S.outlet === x.n ? "sel" : ""}" data-outlet="${x.n}" aria-label="Ausgang ${x.n}${x.name ? ", " + x.name : ""}, ${x.on ? "an" : "aus"}">${x.n}</button>`).join("")}</div>`).join("")}</div>
    <div class="oinfo"><span class="pn">${o.n}</span><span><b>${o.name || "Nicht belegt"}</b><span>${o.kind} · ${o.on ? "eingeschaltet" : "ausgeschaltet"}</span></span>
      <button class="switch" role="switch" aria-checked="${o.on}" data-toggle-outlet="${o.n}" aria-label="Ausgang ${o.n} schalten"></button></div>
  </section>`;
}

function headThumb(d){
  const m = d.group ? [] : members(d.id);
  if (m.length > 1){
    const total = m.reduce((a, x) => a + x.h, 0);
    return `<div class="thumb multi" style="aspect-ratio:${9.9 / total};--ar:${9.9 / total}">${m.map(x => `<div style="flex:${x.h}">${face(x)}</div>`).join("")}</div>`;
  }
  const ar = d.thumbAspect || (d.u ? 9.9 / d.h : 9.9);
  return `<div class="thumb" style="aspect-ratio:${ar};--ar:${ar}">${face(d)}</div>`;
}

function diskCard(d){
  const r = d.raid, ok = d.disks.filter(x => x.state === "ok").length;
  return `<section class="card"><h2>Festplatten <em>${ok} von ${d.disks.length} in Ordnung</em></h2>
    <div class="disks">${d.disks.map(x => `<div class="disk ${x.state}"><div class="bay"></div><span>Schacht ${x.n}</span><b>${x.size}</b><span>${x.temp} °C · ${x.state === "ok" ? "gesund" : "prüfen"}</span></div>`).join("")}</div>
    <div class="raid"><div class="mini" style="border-top:0;padding-top:0"><span>${r.level} · ${r.usable} nutzbar</span><b>${r.used} % belegt</b></div>
      <div class="meter"><b style="width:${r.used}%;background:var(--blue)"></b></div>
      <span class="note" style="font-size:12px">Voll ist normal: älteste Aufnahmen werden überschrieben.</span></div>
  </section>`;
}
function recCard(d){
  const r = d.rec, R = 52, C = 2 * Math.PI * R; let off = 0;
  const arcs = r.types.map(([n, v, c]) => { const a = `<circle cx="62" cy="62" r="${R}" fill="none" stroke="var(${c})" stroke-width="14" stroke-dasharray="${C * v / 100 - 3} ${C}" stroke-dashoffset="${-off}"/>`; off += C * v / 100; return a; }).join("");
  return `<section class="card grow"><h2>Aufnahme <em>${r.camsOnline} von ${r.cams} Kameras</em></h2>
    <div class="rec">
      <div class="ring"><svg viewBox="0 0 124 124">${arcs}</svg><div class="c"><b>${r.days}</b><span>Tage</span></div></div>
      <div class="rows">
        ${r.types.map(([n, v, c]) => `<div class="row"><span><i style="background:var(${c})"></i>${n}</span><b>${v} %</b></div>`).join("")}
        <div class="row" style="padding-top:8px;border-top:1px solid var(--sep)"><span>Ereignisse heute</span><b>${r.events}</b></div>
      </div>
    </div>
  </section>`;
}

function baysCard(d){
  const used = d.bays.filter(b => b.role !== "empty");
  if (!S.bay || !d.bays.find(b => b.n === S.bay && b.role !== "empty")) S.bay = used[0].n;
  const b = d.bays.find(x => x.n === S.bay);
  const roleTxt = {parity:"Parität", data:"Daten", cache:"Cache"};
  return `<section class="card"><h2>Schächte <em>${used.length} von 24 belegt</em></h2>
    <div class="bays24">${d.bays.map(x => x.role === "empty"
      ? `<div class="bay24" aria-label="Schacht ${x.n} leer"><span>${x.n}</span></div>`
      : `<button class="bay24 ${x.role} ${x.spun ? "" : "down"} ${S.bay === x.n ? "sel" : ""}" data-bay="${x.n}"><i></i><span>${x.id} · ${x.tb} TB</span>${x.used != null ? `<b style="width:${x.used}%"></b>` : ""}</button>`).join("")}</div>
    <div class="plegend"><span><i style="background:var(--indigo)"></i>Parität</span><span><i style="background:var(--blue)"></i>Daten</span><span><i style="background:var(--teal)"></i>Cache</span><span><i style="background:var(--fill-2)"></i>leer</span><span class="hint-sleep">blass = schläft</span></div>
    <div class="pinfo"><span class="pn">${b.id}</span><span class="pd"><b>${b.name} · ${b.tb} TB</b><span>Schacht ${b.n} · ${roleTxt[b.role]}${b.used != null ? ` · ${b.used} % belegt` : ""}</span></span>
      <span class="tr">${b.spun ? `<b>${b.temp} °C</b>` : "schläft"}</span></div>
  </section>`;
}
function arrayCard(d){
  const a = d.array;
  return `<section class="card grow"><h2>Array <em>${a.shares} Freigaben</em></h2>
    <div class="arr">
      <div><div class="big2">${a.used}<small>von ${a.total}</small></div>
        <div class="cap"><b style="width:${a.pct}%"></b></div>
        <div class="mini" style="border-top:0;padding-top:0"><span>${a.pct} % belegt</span><span>frei <b>${a.free}</b></span></div></div>
      <div><div class="mini" style="border-top:0;padding-top:0"><span>Cache (${a.cache.size})</span><b>${a.cache.pct} %</b></div>
        <div class="meter"><b style="width:${a.cache.pct}%;background:var(--teal)"></b></div></div>
      <div class="mini"><span>Letzte Paritätsprüfung</span><b>${a.parity}</b></div>
    </div>
  </section>`;
}

function detail(d){
  const mm = members(d.id), lo = Math.min(...mm.map(x => x.u)), hi = Math.max(...mm.map(x => x.u + x.h - 1));
  const where = d.u ? `HE ${lo}${hi > lo ? "–" + hi : ""}` : "Rückseite, 0 HE";
  const rich = !!(d.ports || d.sys || d.flow || d.outlets || d.disks || d.bays);
  const tiles = (d.tiles || []).map(([k, v, unit, meter, st, hint]) => `
    <div class="tile ${st || ""}"><span class="k">${k}</span><span class="v">${v}<small>${unit}</small></span>
    ${meter != null ? `<div class="meter"><b style="width:${meter}%;${meter > 85 && !hint ? "background:var(--orange)" : ""}"></b></div>` : ""}
    ${hint ? `<span class="h">${hint}</span>` : ""}</div>`).join("");
  const seed = d.id.length * 7;
  const now = d.chart ? series(seed, d.chart.base, d.chart.amp).at(-1) : 0;
  const ms = (d.msgs || []).slice(0, 2);
  const msgs = ms.length ? `<section class="card wide msgs"><h2>Meldungen${d.msgs.length > 2 ? ` <em>+${d.msgs.length - 2} weitere</em>` : ""}</h2>${ms.map(m => `<div class="msg ${m[0]}"><i></i><div>${m[1]}<time>${m[2]}</time></div></div>`).join("")}</section>` : "";
  const head = `<section class="card"><div class="dhero">
      <div class="top"><div style="min-width:0"><h1 style="font:700 24px/1.1 var(--font-display);margin:0 0 4px">${d.name}</h1><div class="sub" style="color:var(--label-2);font-size:13px">${d.model} · ${where}</div></div>
        <span class="chip ${d.passive ? "off" : d.state}"><i></i>${STATE_TXT[d.passive ? "off" : d.state]}</span></div>
      ${headThumb(d)}
      ${d.facts ? `<div class="facts4">${d.facts.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("")}</div>` : ""}
      ${!ms.length && !d.passive ? `<span class="note">Keine Meldungen in den letzten 7 Tagen.</span>` : ""}
    </div></section>`;
  const single = d.chart ? `<section class="card grow wide"><h2>${d.chart.label} <em><b class="hv">${now.toLocaleString("de-DE", {maximumFractionDigits: d.chart.dec ?? 0})} ${d.chart.unit}</b> · 24 Std.</em></h2>${lazy((W, H) => chartSVG(d.chart, seed, W, H))}</section>` : "";
  let body;
  if (d.passive) body = `<div class="dgrid">${head}<section class="card"><p class="note" style="margin:0">Passives Element ohne Sensoren. In der Integration kannst du hier eine Belegung oder Notiz hinterlegen, z. B. welche Ports wohin gehen.</p></section></div>`;
  else if (rich) body = `<div class="dgrid">${head}${d.ports ? portCard(d) : ""}${d.flow ? flowCard(d) : ""}${d.outlets ? outletCard(d) : ""}${d.disks ? diskCard(d) : ""}${d.bays ? baysCard(d) : ""}${d.array ? arrayCard(d) : ""}${d.rec ? recCard(d) : ""}
      ${d.wan ? wanCard(d) : ""}${d.poe ? poeCard(d) : ""}${d.sys ? sysCard(d) : ""}${!d.wan && !d.rec && !d.array && !d.poe && d.chart ? (d.sys || d.flow || d.chart2 ? single.replace("grow wide", "grow") : single) : ""}${d.chart2 ? `<section class="card grow"><h2>${d.chart2.label} <em><b class="hv">${series(seed + 3, d.chart2.base, d.chart2.amp).at(-1).toLocaleString("de-DE", {maximumFractionDigits: 1})} ${d.chart2.unit}</b> · Grenze ${d.chart2.warn} A</em></h2>${lazy((W, H) => chartSVG(d.chart2, seed + 3, W, H))}</section>` : ""}${d.flow ? voltCard(d) : ""}${msgs}</div>`;
  else body = `<div class="dgrid">${head}<section class="card"><div class="grid t3">${tiles}</div></section>${single}${msgs}</div>`;
  return body + (S.mode === "edit" && d.u ? `<section class="card"><h2>Bearbeiten</h2><div class="row-btns">
    <label class="btn" for="img">Frontbild wählen</label><input id="img" type="file" accept="image/*" hidden>
    ${d.image ? `<button class="btn" data-noimg>Standardbild</button>` : ""}
    <button class="btn" data-move="1">Eine HE höher</button><button class="btn" data-move="-1">Eine HE tiefer</button>
    <button class="btn danger" data-remove>Entfernen</button></div>
    <p class="note">In der Integration wählst du hier auch das Home-Assistant-Gerät. Die passenden Sensoren werden dann automatisch zugeordnet.</p></section>` : "");
}

function library(u){
  return `<button class="back" data-back>${ICONS.chev}Abbrechen</button>
  <section class="card"><h2>Gerät in HE ${u} einsetzen</h2><div class="lib">
    ${TEMPLATES.map(t => `<button data-tpl="${t.type}"><div class="thumb" style="aspect-ratio:${9.9 / t.h}">${face({type:t.type, state:"ok", passive:["patch","blank"].includes(t.type)})}</div><b>${t.name}</b><span>${t.h} HE</span></button>`).join("")}
  </div><p class="note">Eigene Vorlagen mit Foto der Gerätefront kommen in der Integration dazu.</p></section>`;
}

function renderPanel(){
  let body;
  if (S.slot) body = library(S.slot);
  else if (S.sel && byId(S.sel)) body = detail(byId(S.sel));
  else body = (S.mode === "edit" ? `<div class="edit-banner">Tippe auf eine freie Höheneinheit, um ein Gerät einzusetzen, oder auf ein Gerät, um es zu bearbeiten.</div>` : "") + overview();
  $("panel").innerHTML = header() + body;
  $("panel").classList.toggle("fit", !S.slot && S.mode === "view");
  $("panel").classList.toggle("detail", !!(S.sel && byId(S.sel)));
  fillCharts(); CHARTS.length = 0;
  tick();
}

function fits(u, h, ignore){
  if (u < 1 || u + h - 1 > RACK.units) return false;
  return !DEVICES.some(d => d.id !== ignore && u < d.u + d.h && d.u < u + h);
}
/* ---------- WLED-Streifen ums Türfenster ----------
   Der Streifen sitzt hinter dem Lochblech: man sieht keine LEDs, nur Licht, das vom Fensterrand
   nach innen fällt. Später kommen die Farben live aus der WLED-Vorschau (über die Integration),
   jetzt laufen Demo-Effekte. Gerechnet wird auf einem kleinen Raster, das der Browser weich hochskaliert. */
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
  const c = $("wledCanvas"), win = document.querySelector(".door .win");
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
  const sh = $("sheet"), win = document.querySelector(".door .win");
  if (!sh || !win) return;
  const w = sh.offsetWidth, h = sh.offsetHeight, x = win.offsetLeft, y = win.offsetTop, ww = win.offsetWidth, hh = win.offsetHeight;
  const r = Math.min(parseFloat(getComputedStyle(win).borderTopLeftRadius) || 0, ww / 2, hh / 2);
  sh.style.clipPath = `path(evenodd, "M0 0H${w}V${h}H0Z M${x + r} ${y}H${x + ww - r}A${r} ${r} 0 0 1 ${x + ww} ${y + r}V${y + hh - r}A${r} ${r} 0 0 1 ${x + ww - r} ${y + hh}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + hh - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z")`;
}
new ResizeObserver(() => { cutDoor(); wledLayout(); }).observe($("rack"));
requestAnimationFrame(wledFrame);
function render(){ renderRack(); renderPanel(); }

document.addEventListener("click", e => {
  const t = e.target.closest("button,[data-back]");
  if (!t) return;
  if (t.dataset.wledPower !== undefined){ WLED.on = !WLED.on; }
  else if (t.dataset.wled !== undefined){ WLED.fx = (WLED.fx + 1) % WLED.effects.length; }
  else if (t.dataset.port){ S.port = +t.dataset.port; }
  else if (t.dataset.bay){ S.bay = +t.dataset.bay; }
  else if (t.dataset.outlet){ S.outlet = +t.dataset.outlet; }
  else if (t.dataset.toggleOutlet){ const o = ZERO_U[0].outlets.find(x => x.n === +t.dataset.toggleOutlet); o.on = !o.on; }
  else if (t.dataset.id){ S.port = null; S.sel = S.sel === t.dataset.id && t.classList.contains("hit") ? null : t.dataset.id; S.slot = null; }
  else if (t.dataset.slot){ S.slot = +t.dataset.slot; S.sel = null; }
  else if (t.dataset.back !== undefined){ S.sel = null; S.slot = null; }
  else if (t.dataset.mode){ S.mode = t.dataset.mode; S.slot = null; if (S.mode === "edit") S.door = false; }
  else if (t.id === "doorOpen" || t.id === "doorClosed" || t.id === "sideRear"){ S.side = t.id === "sideRear" ? "rear" : "front"; S.door = t.id === "doorClosed"; $("doorOpen").setAttribute("aria-pressed", t.id === "doorOpen"); $("doorClosed").setAttribute("aria-pressed", t.id === "doorClosed"); $("sideRear").setAttribute("aria-pressed", t.id === "sideRear"); }
  else if (t.dataset.tpl){
    const tpl = TEMPLATES.find(x => x.type === t.dataset.tpl); let u = S.slot;
    while (u > 0 && !fits(u, tpl.h)) u--;
    if (u < 1){ u = S.slot; if (!fits(u, tpl.h)) return; }
    const id = "n" + Date.now();
    const passive = ["patch","blank"].includes(tpl.type);
    DEVICES.push({ id, name:tpl.name, model:"Neues Gerät · noch nicht verknüpft", type:tpl.type, u, h:tpl.h, state:"ok", passive,
      tiles: passive ? [] : [["Status","–",""],["Leistung","–","W"],["Temperatur","–","°C"]], msgs:[] });
    S.slot = null; S.sel = id;
  }
  else if (t.dataset.move){ const d = byId(S.sel), u = d.u + +t.dataset.move; if (fits(u, d.h, d.id)) d.u = u; }
  else if (t.dataset.remove !== undefined){ DEVICES = DEVICES.filter(d => d.id !== S.sel); S.sel = null; }
  else if (t.dataset.noimg !== undefined){ delete byId(S.sel).image; }
  else return;
  render();
});
document.addEventListener("change", e => {
  if (e.target.id !== "img" || !e.target.files[0]) return;
  const r = new FileReader();
  r.onload = () => { byId(S.sel).image = r.result; render(); };
  r.readAsDataURL(e.target.files[0]);
});

function tick(){ const c = $("clock"); if (c) c.textContent = new Date().toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit"}); }
setInterval(tick, 10000);
let _rz, _rw = innerWidth, _rh = innerHeight;
window.addEventListener("resize", () => { clearTimeout(_rz); _rz = setTimeout(() => { if (Math.abs(innerWidth - _rw) < 24 && Math.abs(innerHeight - _rh) < 24) return; _rw = innerWidth; _rh = innerHeight; renderPanel(); }, 250); });
document.documentElement.style.setProperty("--fan-img", `url(${FAN_IMG})`);
document.documentElement.style.setProperty("--panel-img", `url(${MSA2_PANEL})`);
render();
