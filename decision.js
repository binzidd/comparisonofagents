const likeStore = {
  storageKey: "comparison_lab_like_state",
  read() {
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return { count: 0, liked: false };
      const parsed = JSON.parse(raw);
      return {
        count: Number.isFinite(Number(parsed.count)) ? Number(parsed.count) : 0,
        liked: parsed.liked === true
      };
    } catch (_error) {
      return { count: 0, liked: false };
    }
  },
  write(next) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(next));
  }
};

const runtimeOptions = [
  { id: "python", label: "Python" },
  { id: "typescript", label: "TypeScript" },
  { id: "any", label: "Any" }
];

const complexityOptions = [
  { id: "simple", label: "Simple" },
  { id: "moderate", label: "Moderate" },
  { id: "advanced", label: "Advanced" }
];

const priorityOptions = [
  { id: "speed", label: "Shipping Speed" },
  { id: "reliability", label: "Reliability" },
  { id: "enterprise", label: "Enterprise" },
  { id: "product", label: "Product Fit" }
];

let selectedRuntime = "python";
let selectedComplexity = "moderate";
let selectedPriority = "reliability";
let selectedFrameworkId = "langgraph";
let metadata = null;

let decisionSupport;
let runtimeRow;
let complexityRow;
let priorityRow;
let decisionResults;
let matrixSupport;
let criteriaMatrix;
let frameworkMetadataRow;
let metadataBoard;
let footerLikeBtn;
let footerLikeCount;

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.getElementById("theme-toggle-icon");
  if (icon) icon.textContent = theme === "light" ? "☀" : "☾";
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }
}

async function loadMetadata() {
  const res = await fetch("./data/framework_metadata.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Metadata load failed: ${res.status}`);
  }
  metadata = await res.json();
}

function frameworks() {
  return metadata?.frameworks || [];
}

function getFramework(id = selectedFrameworkId) {
  return frameworks().find((item) => item.id === id) || frameworks()[0];
}

function scoreFramework(framework) {
  let score = 0;
  if (selectedRuntime === "any" || framework.runtime === selectedRuntime) score += 2;
  if (framework.best_for.includes(selectedComplexity)) score += 2;
  if (framework.best_for.includes(selectedPriority)) score += 2;
  score += framework.criteria_scores["Developer Experience"] >= 4 && selectedPriority === "speed" ? 1 : 0;
  score += framework.criteria_scores["Context & Memory"] >= 4 && selectedPriority === "reliability" ? 1 : 0;
  score += framework.criteria_scores["Security & Compliance"] >= 4 && selectedPriority === "enterprise" ? 1 : 0;
  score += framework.criteria_scores["Deployment & Hosting"] >= 4 && selectedPriority === "product" ? 1 : 0;
  return score;
}

function orderedFrameworks() {
  return [...frameworks()].sort((a, b) => scoreFramework(b) - scoreFramework(a));
}

function metricDots(score) {
  return new Array(5)
    .fill(0)
    .map((_, index) => `<span class="noise-dot ${index < score ? "active" : ""}"></span>`)
    .join("");
}

function renderChipRow(root, options, selectedId, onSelect) {
  root.innerHTML = options
    .map((option) => `
      <button class="chip decision-chip ${option.id === selectedId ? "active" : ""}" type="button" data-id="${option.id}">
        ${option.label}
      </button>
    `)
    .join("");
  root.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => onSelect(button.dataset.id));
  });
}

function renderControls() {
  decisionSupport.textContent = "This layer is driven by structured metadata rather than the execution traces. Use it to narrow the field before dropping into the execution lab.";
  renderChipRow(runtimeRow, runtimeOptions, selectedRuntime, (id) => {
    selectedRuntime = id;
    render();
  });
  renderChipRow(complexityRow, complexityOptions, selectedComplexity, (id) => {
    selectedComplexity = id;
    render();
  });
  renderChipRow(priorityRow, priorityOptions, selectedPriority, (id) => {
    selectedPriority = id;
    render();
  });
}

function renderRecommendations() {
  const ranked = orderedFrameworks();
  const top = ranked.slice(0, 3);
  if (!top.find((item) => item.id === selectedFrameworkId)) {
    selectedFrameworkId = top[0].id;
  }

  decisionResults.innerHTML = top
    .map((framework, index) => `
      <article class="decision-result-card ${index === 0 ? "top-pick" : ""}" style="--framework-color:${framework.color}">
        <div class="decision-result-head">
          <div>
            <span class="eyebrow">${index === 0 ? "Top Pick" : `Option ${index + 1}`}</span>
            <h3>${framework.name}</h3>
          </div>
          <span class="capability-pattern">${framework.runtime}</span>
        </div>
        <p>${framework.criteria_notes["Developer Experience"]}</p>
        <div class="decision-result-pills">
          <span class="summary-pill">Match score: ${scoreFramework(framework)}</span>
          <span class="summary-pill">Best for: ${framework.best_for.join(", ")}</span>
        </div>
        <button class="secondary-btn compact" type="button" data-framework-pick="${framework.id}">Inspect metadata</button>
      </article>
    `)
    .join("");

  decisionResults.querySelectorAll("[data-framework-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedFrameworkId = button.dataset.frameworkPick;
      renderMetadataControls();
      renderMetadataBoard();
    });
  });
}

function renderCriteriaMatrix() {
  matrixSupport.textContent = "This matrix uses the same criteria for every framework, so you can compare them without each framework reordering the score story.";
  const criteria = metadata.criteria;
  criteriaMatrix.innerHTML = `
    <thead>
      <tr>
        <th>Framework</th>
        ${criteria.map((criterion) => `<th>${criterion}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${frameworks().map((framework) => `
        <tr>
          <td><button class="matrix-framework-btn" type="button" data-matrix-framework="${framework.id}">${framework.name}</button></td>
          ${criteria.map((criterion) => `
            <td>
              <div class="matrix-score-cell">
                <div class="noise-dot-row">${metricDots(framework.criteria_scores[criterion])}</div>
              </div>
            </td>
          `).join("")}
        </tr>
      `).join("")}
    </tbody>
  `;

  criteriaMatrix.querySelectorAll("[data-matrix-framework]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedFrameworkId = button.dataset.matrixFramework;
      renderMetadataControls();
      renderMetadataBoard();
    });
  });
}

function renderMetadataControls() {
  frameworkMetadataRow.innerHTML = frameworks()
    .map((framework) => `
      <button
        class="chip decision-chip ${framework.id === selectedFrameworkId ? "active" : ""}"
        type="button"
        data-framework-id="${framework.id}">
        ${framework.name}
      </button>
    `)
    .join("");

  frameworkMetadataRow.querySelectorAll("[data-framework-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedFrameworkId = button.dataset.frameworkId;
      renderMetadataControls();
      renderMetadataBoard();
    });
  });
}

function listMarkup(items) {
  return items.map((item) => `<span class="starter-file-chip">${item}</span>`).join("");
}

function renderMetadataBoard() {
  const framework = getFramework();
  metadataBoard.innerHTML = `
    <article class="metadata-card" style="--framework-color:${framework.color}">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Context & Memory</p>
          <h3>${framework.memory.model}</h3>
        </div>
      </div>
      <p>${framework.criteria_notes["Context & Memory"]}</p>
      <div class="metadata-chip-group">${listMarkup(framework.memory.strengths)}</div>
      <p class="metadata-risk">Watchouts: ${framework.memory.risks.join(", ")}</p>
    </article>
    <article class="metadata-card" style="--framework-color:${framework.color}">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Deployment & Hosting</p>
          <h3>${framework.deployment.fit}</h3>
        </div>
      </div>
      <p>${framework.deployment.hosting}</p>
      <p class="metadata-risk">Tradeoff: ${framework.deployment.tradeoff}</p>
    </article>
    <article class="metadata-card" style="--framework-color:${framework.color}">
      <div class="capability-card-head">
        <div>
          <p class="eyebrow">Security & Compliance</p>
          <h3>${framework.security.fit}</h3>
        </div>
      </div>
      <div class="metadata-chip-group">${listMarkup(framework.security.controls)}</div>
      <p class="metadata-risk">Tradeoff: ${framework.security.tradeoff}</p>
    </article>
  `;
}

function renderFooterLike(serverTotal) {
  if (!footerLikeBtn || !footerLikeCount) return;
  const state = likeStore.read();
  const displayTotal = serverTotal !== undefined ? serverTotal : state.count;
  footerLikeCount.textContent = String(displayTotal);
  footerLikeBtn.classList.toggle("liked", state.liked);
  footerLikeBtn.setAttribute("aria-pressed", state.liked ? "true" : "false");
  const icon = footerLikeBtn.querySelector(".like-icon");
  if (icon) icon.textContent = state.liked ? "♥" : "♡";
}

async function toggleFooterLike() {
  const state = likeStore.read();
  const nowLiked = !state.liked;
  if (nowLiked) {
    const optimisticCount = state.count + 1;
    likeStore.write({ count: optimisticCount, liked: true });
    renderFooterLike(optimisticCount);
    try {
      const res = await fetch("/api/like", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        likeStore.write({ count: data.total, liked: true });
        renderFooterLike(data.total);
      }
    } catch (_error) {
      // Keep optimistic state.
    }
  } else {
    const newCount = Math.max(0, state.count - 1);
    likeStore.write({ count: newCount, liked: false });
    renderFooterLike(newCount);
  }
}

function render() {
  renderControls();
  renderRecommendations();
  renderCriteriaMatrix();
  renderMetadataControls();
  renderMetadataBoard();
}

async function initApp() {
  decisionSupport = document.getElementById("decision-support");
  runtimeRow = document.getElementById("runtime-row");
  complexityRow = document.getElementById("complexity-row");
  priorityRow = document.getElementById("priority-row");
  decisionResults = document.getElementById("decision-results");
  matrixSupport = document.getElementById("matrix-support");
  criteriaMatrix = document.getElementById("criteria-matrix");
  frameworkMetadataRow = document.getElementById("framework-metadata-row");
  metadataBoard = document.getElementById("metadata-board");
  footerLikeBtn = document.getElementById("footer-like-btn");
  footerLikeCount = document.getElementById("footer-like-count");

  const required = [
    decisionSupport,
    runtimeRow,
    complexityRow,
    priorityRow,
    decisionResults,
    matrixSupport,
    criteriaMatrix,
    frameworkMetadataRow,
    metadataBoard,
    footerLikeBtn,
    footerLikeCount
  ];

  if (required.some((item) => !item)) {
    throw new Error("Missing DOM nodes for decision page.");
  }

  await loadMetadata();
  footerLikeBtn.addEventListener("click", toggleFooterLike);
  initTheme();
  renderFooterLike();
  fetch("/api/like")
    .then((r) => r.json())
    .then((data) => {
      const state = likeStore.read();
      likeStore.write({ liked: state.liked, count: data.total });
      renderFooterLike(data.total);
    })
    .catch(() => {});
  render();
}

initApp();
