const state = { sites: [], query: "", model: "all" };

const modelFilters = ["全部模型", "GPT", "Claude", "DeepSeek", "Gemini", "GLM"];

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url.replace(/^https?:\/\//, ""); }
}

function statusClass(category) {
  if (category === "official") return "official";
  if (category === "opensource") return "open";
  return "";
}

function matches(site) {
  const needle = state.query.trim().toLowerCase();
  const haystack = [site.name, site.url, site.quota, site.note, site.category, ...site.models].join(" ").toLowerCase();
  const queryMatches = !needle || haystack.includes(needle);
  const modelMatches = state.model === "all" || site.models.some((model) => model.toLowerCase().includes(state.model.toLowerCase()));
  return queryMatches && modelMatches;
}

function renderModelFilters() {
  $("#model-filters").innerHTML = modelFilters.map((model) => {
    const value = model === "全部模型" ? "all" : model;
    const active = state.model === value ? " active" : "";
    return `<button class="filter-chip${active}" type="button" data-model="${escapeHtml(value)}">${escapeHtml(model)}</button>`;
  }).join("");
  document.querySelectorAll("[data-model]").forEach((button) => {
    button.addEventListener("click", () => { state.model = button.dataset.model; render(); });
  });
}

function renderCard(site) {
  const tags = site.models.map((model) => `<span class="model-tag">${escapeHtml(model)}</span>`).join("");
  return `
    <article class="site-card">
      <div class="site-card-top">
        <span class="site-category">公益中转站</span>
        <span class="status ${statusClass(site.category)}"><span class="status-dot"></span>${escapeHtml(site.status)}</span>
      </div>
      <h3>${escapeHtml(site.name)}</h3>
      <div class="site-domain">${escapeHtml(domainOf(site.url))}</div>
      <p class="site-detail">${escapeHtml(site.quota)}<br />${escapeHtml(site.note)}</p>
      <div class="tag-row">${tags}</div>
      <div class="card-footer">
        <span class="source-date">来源：${escapeHtml(site.source)}<br />资料日期：${escapeHtml(site.sourceDate)}</span>
        <a class="visit-link" href="${escapeHtml(site.url)}" target="_blank" rel="noopener noreferrer">打开入口</a>
      </div>
    </article>`;
}

function render() {
  renderModelFilters();
  const visible = state.sites.filter(matches);
  $("#result-count").textContent = `显示 ${visible.length} / ${state.sites.length} 条记录`;
  $("#site-grid").innerHTML = visible.map(renderCard).join("");
  $("#empty-state").hidden = visible.length !== 0;
}

function clearFilters() {
  state.query = "";
  state.model = "all";
  $("#search-input").value = "";
  render();
}

async function loadSites() {
  try {
    const response = await fetch("./data/sites.json");
    if (!response.ok) throw new Error("data request failed");
    state.sites = await response.json();
  } catch (error) {
    $("#result-count").textContent = "目录读取失败，请刷新页面重试";
    return;
  }
  const models = new Set(state.sites.flatMap((site) => site.models));
  $("#total-count").textContent = state.sites.length;
  $("#model-count").textContent = models.size;
  $("#source-count").textContent = "Free NewAPI";
  render();
}

$("#search-input").addEventListener("input", (event) => { state.query = event.target.value; render(); });
$("#clear-filters").addEventListener("click", clearFilters);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== $("#search-input")) { event.preventDefault(); $("#search-input").focus(); }
});

loadSites();
