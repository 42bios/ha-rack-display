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
