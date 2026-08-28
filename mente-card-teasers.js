"use strict";

(() => {
  const grid = document.querySelector("#questions-grid");
  if (!grid) return;

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));

  const palettes = {
    "Geometria": { soft:"#FFF3E8", accent:"#FF7A00", line:"#914600", light:"#FFD7B2" },
    "Funções": { soft:"#F7EEFF", accent:"#9D4EDD", line:"#5A2791", light:"#E3CCFF" },
    "Estatística e Probabilidade": { soft:"#EEF8EE", accent:"#16803C", line:"#075C2B", light:"#BDE7C9" },
    "Matemática Financeira": { soft:"#FFFBE8", accent:"#D9A400", line:"#7A5C00", light:"#F5E39A" },
    "Grandezas e Medidas": { soft:"#FFF0F0", accent:"#D70101", line:"#8E0000", light:"#F5C4C4" },
    "Gráficos e Tabelas": { soft:"#FFF0F8", accent:"#FF2E9A", line:"#9B145A", light:"#FFC4E3" }
  };
  const fallback = { soft:"#F8FAFC", accent:"#2563EB", line:"#1E3A8A", light:"#C9DAFF" };

  function getQuestion(id) {
    try {
      if (typeof questions !== "undefined" && Array.isArray(questions)) {
        return questions.find((q) => Number(q.id) === Number(id)) || null;
      }
    } catch {}
    return null;
  }

  function frame(p, inner) {
    return `<svg viewBox="0 0 280 112" aria-hidden="true" style="display:block;width:100%;height:100%">
      <rect x="1" y="1" width="278" height="110" rx="16" fill="${p.soft}"/>
      <circle cx="251" cy="24" r="15" fill="${p.light}" opacity=".72"/>
      <circle cx="29" cy="91" r="11" fill="${p.light}" opacity=".62"/>
      ${inner}
    </svg>`;
  }

  function geometryArt(q, p) {
    const n = Number(q.examNumber || 0);
    const a = p.accent, l = p.line, s = p.light;

    if (n === 145) return frame(p, `
      <rect x="48" y="29" width="91" height="55" rx="4" fill="#fff" stroke="${l}" stroke-width="3"/>
      <rect x="166" y="37" width="67" height="45" rx="4" fill="#fff" stroke="${a}" stroke-width="3"/>
      <path d="M143 56 H160" stroke="${a}" stroke-width="3" stroke-linecap="round"/>
      <path d="M154 50 L160 56 L154 62" fill="none" stroke="${a}" stroke-width="3"/>
      <text x="61" y="24" font-size="10" font-weight="800" fill="${l}">110 × 75 m</text>
      <text x="171" y="32" font-size="10" font-weight="800" fill="${l}">105 × 68 m</text>`);

    if (n === 139) return frame(p, `
      <circle cx="137" cy="57" r="36" fill="#fff" stroke="${l}" stroke-width="3"/>
      <circle cx="137" cy="57" r="45" fill="none" stroke="${s}" stroke-width="8"/>
      <path d="M172 29 A45 45 0 0 1 181 56" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="177" cy="42" r="4" fill="${a}"/>
      <line x1="137" y1="57" x2="137" y2="22" stroke="${l}" stroke-width="2"/>
      <text x="144" y="43" font-size="10" font-weight="800" fill="${l}">1 km</text>
      <text x="188" y="41" font-size="10" font-weight="800" fill="${l}">200 m</text>`);

    if (n === 155) return frame(p, `
      <path d="M81 91 L198 91 A117 117 0 0 0 112 18 Z" fill="#fff" stroke="${a}" stroke-width="3"/>
      <path d="M115 91 A34 34 0 0 0 105 67" fill="none" stroke="${l}" stroke-width="2.5"/>
      <text x="111" y="67" font-size="14" font-weight="900" fill="${l}">α</text>
      <text x="146" y="104" font-size="11" font-weight="900" fill="${l}">R</text>
      <circle cx="81" cy="91" r="4" fill="${l}"/>`);

    if (n === 150) return frame(p, `
      <rect x="50" y="23" width="177" height="71" rx="5" fill="#fff" stroke="${l}" stroke-width="3"/>
      <line x1="139" y1="28" x2="139" y2="89" stroke="${s}" stroke-width="3" stroke-dasharray="5 5"/>
      ${[35,44,53,62,71,80].map(y => `<circle cx="139" cy="${y}" r="5" fill="${a}"/>`).join("")}
      <text x="127" y="17" font-size="11" font-weight="900" fill="${l}">6 m</text>
      <text x="233" y="60" font-size="11" font-weight="900" fill="${l}">3 m</text>`);

    if (n === 175) return frame(p, `
      <rect x="39" y="34" width="70" height="47" rx="5" fill="#fff" stroke="${a}" stroke-width="3"/>
      <text x="48" y="28" font-size="10" font-weight="900" fill="${l}">10 × 20 cm</text>
      <path d="M119 57 H143" stroke="${l}" stroke-width="3" stroke-linecap="round"/>
      <path d="M136 50 L143 57 L136 64" fill="none" stroke="${l}" stroke-width="3"/>
      <ellipse cx="199" cy="36" rx="31" ry="9" fill="#fff" stroke="${a}" stroke-width="3"/>
      <path d="M168 36 V79 M230 36 V79" stroke="${a}" stroke-width="3"/>
      <ellipse cx="199" cy="79" rx="31" ry="9" fill="#fff" stroke="${a}" stroke-width="3"/>`);

    return frame(p, `<polygon points="75,88 139,22 207,88" fill="#fff" stroke="${a}" stroke-width="3"/><line x1="139" y1="22" x2="139" y2="88" stroke="${s}" stroke-width="3" stroke-dasharray="5 5"/>`);
  }

  function genericArt(q, p) {
    const text = `${q.topic || ""} ${q.statement || ""} ${q.detail || ""}`.toLowerCase();
    const a = p.accent, l = p.line, s = p.light;

    if (q.category === "Funções") {
      if (/quadrát|quadratic|parábol|parabol|vértice|vertice/.test(text)) return frame(p, `<line x1="51" y1="91" x2="226" y2="91" stroke="${l}" stroke-width="2.5"/><line x1="139" y1="98" x2="139" y2="18" stroke="${l}" stroke-width="2.5"/><path d="M74 29 Q139 101 205 29" fill="none" stroke="${a}" stroke-width="4"/><circle cx="139" cy="84" r="5" fill="${a}"/>`);
      return frame(p, `<line x1="51" y1="91" x2="226" y2="91" stroke="${l}" stroke-width="2.5"/><line x1="51" y1="91" x2="51" y2="21" stroke="${l}" stroke-width="2.5"/><path d="M68 81 L105 69 L142 56 L180 42 L216 29" fill="none" stroke="${a}" stroke-width="4" stroke-linecap="round"/><circle cx="105" cy="69" r="4" fill="${a}"/><circle cx="180" cy="42" r="4" fill="${a}"/>`);
    }

    if (q.category === "Estatística e Probabilidade") {
      if (/probabilidade|urna|bola|sorte/.test(text)) return frame(p, `<path d="M76 34 H199 L185 91 H91 Z" fill="#fff" stroke="${l}" stroke-width="3"/>${[[108,52,a],[137,64,s],[166,51,a],[119,78,s],[154,80,a],[178,69,s]].map(([x,y,c]) => `<circle cx="${x}" cy="${y}" r="8" fill="${c}" stroke="${l}" stroke-width="1.5"/>`).join("")}<text x="206" y="63" font-size="23" font-weight="900" fill="${a}">?</text>`);
      return frame(p, `<line x1="53" y1="91" x2="226" y2="91" stroke="${l}" stroke-width="2.5"/>${[41,61,76,52,68].map((h,i) => `<rect x="${73+i*29}" y="${91-h}" width="18" height="${h}" rx="4" fill="${i%2?s:a}"/>`).join("")}<line x1="53" y1="91" x2="53" y2="23" stroke="${l}" stroke-width="2.5"/>`);
    }

    if (q.category === "Matemática Financeira") {
      if (/desconto|porcent|promo/.test(text)) return frame(p, `<path d="M70 35 H180 L214 57 L180 82 H70 Z" fill="#fff" stroke="${a}" stroke-width="3"/><circle cx="91" cy="58" r="6" fill="${s}" stroke="${l}" stroke-width="2"/><text x="121" y="67" font-size="30" font-weight="900" fill="${l}">%</text>`);
      return frame(p, `${[[101,69,s],[141,51,a],[181,69,s]].map(([x,y,c]) => `<circle cx="${x}" cy="${y}" r="24" fill="${c}" stroke="${l}" stroke-width="3"/><text x="${x-8}" y="${y+7}" font-size="21" font-weight="900" fill="${c===a?'#fff':l}">$</text>`).join("")}`);
    }

    if (q.category === "Grandezas e Medidas") return frame(p, `<rect x="65" y="45" width="151" height="31" rx="6" fill="#fff" stroke="${a}" stroke-width="3"/>${[80,100,120,140,160,180,200].map((x,i) => `<line x1="${x}" y1="45" x2="${x}" y2="${i%2?62:68}" stroke="${l}" stroke-width="2"/>`).join("")}<path d="M76 91 H207" stroke="${l}" stroke-width="2.5" stroke-dasharray="6 5"/>`);

    if (q.category === "Gráficos e Tabelas") return frame(p, `<line x1="52" y1="91" x2="225" y2="91" stroke="${l}" stroke-width="2.5"/><line x1="52" y1="91" x2="52" y2="21" stroke="${l}" stroke-width="2.5"/><polyline points="66,78 100,62 133,71 168,40 205,50" fill="none" stroke="${a}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${[[66,78],[100,62],[133,71],[168,40],[205,50]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="${a}" stroke-width="2"/>`).join("")}`);

    return frame(p, `<text x="81" y="72" font-size="34" font-weight="900" fill="${a}">π</text><text x="127" y="60" font-size="24" font-weight="900" fill="${l}">+</text><text x="166" y="78" font-size="34" font-weight="900" fill="${a}">√</text>`);
  }

  function cover(q) {
    const p = palettes[q.category] || fallback;
    const level = Math.max(1, Math.min(5, Number(q.stars) || 1));
    const art = q.category === "Geometria" ? geometryArt(q, p) : genericArt(q, p);

    return `<div class="question-teaser" style="--teaser-soft:${p.soft};--teaser-accent:${p.accent};--teaser-text:${p.line}">
      <div class="question-teaser__top">
        <span class="question-teaser__year">ENEM ${esc(q.year || "—")}</span>
        <span class="question-teaser__year">${esc(q.category || "Matemática")}</span>
      </div>
      <div class="question-teaser__body" style="display:grid;place-items:center;flex:1;min-height:70px;margin:4px 0;overflow:hidden">${art}</div>
      <div class="question-teaser__bottom">
        <span class="question-teaser__badge">Questão ${esc(q.examNumber || q.id || "—")}</span>
        <span class="question-teaser__badge">${"★".repeat(level)}${"☆".repeat(5-level)}</span>
      </div>
    </div>`;
  }

  function enhanceCard(card) {
    const button = card.querySelector("button[data-question-id]");
    const id = button?.dataset.questionId;
    if (!id) return;
    const q = getQuestion(id);
    if (!q) return;

    let visual = card.querySelector(".question-card__visual");
    if (!visual) {
      visual = document.createElement("div");
      visual.className = "question-card__visual";
      const tags = card.querySelector(".question-card__tags");
      if (tags) tags.insertAdjacentElement("afterend", visual);
      else card.querySelector(".question-card__meta")?.insertAdjacentElement("afterend", visual);
    }

    visual.innerHTML = cover(q);
    visual.setAttribute("aria-label", `Capa ilustrada da questão ${q.examNumber || q.id}, ${q.category}`);
    visual.removeAttribute("aria-hidden");
  }

  function enhanceAll() {
    grid.querySelectorAll(".question-card").forEach(enhanceCard);
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      enhanceAll();
    });
  });

  observer.observe(grid, { childList:true, subtree:true });
  enhanceAll();
})();
