"use strict";

(() => {
  const grid = document.querySelector("#questions-grid");
  if (!grid) return;

  const subjectInfo = {
    "Geometria": { color: "#FF7A00", soft: "#FFF5EB", slug: "geometria" },
    "Funções": { color: "#9D4EDD", soft: "#F8F0FF", slug: "funcoes" },
    "Estatística e Probabilidade": { color: "#004A00", soft: "#F0F8F0", slug: "estatistica-probabilidade" },
    "Matemática Financeira": { color: "#D6A900", soft: "#FFFBE8", slug: "matematica-financeira" },
    "Grandezas e Medidas": { color: "#D70101", soft: "#FFF1F1", slug: "grandezas-medidas" },
    "Gráficos e Tabelas": { color: "#FF2E9A", soft: "#FFF1F8", slug: "graficos-tabelas" },
  };

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  function allQuestions() {
    try { return Array.isArray(questions) ? questions : []; }
    catch { return []; }
  }

  function questionForCard(card) {
    const id = Number(card.querySelector("[data-question-id]")?.dataset.questionId);
    return allQuestions().find((item) => Number(item.id) === id) || null;
  }

  function frame(q, body) {
    const info = subjectInfo[q.category] || { color: "#2563EB", soft: "#EFF6FF" };
    return `<svg viewBox="0 0 280 110" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="278" height="108" rx="15" fill="${info.soft}"/>
      <circle cx="251" cy="22" r="14" fill="${info.color}" opacity=".10"/>
      <circle cx="28" cy="89" r="10" fill="${info.color}" opacity=".10"/>
      ${body}
    </svg>`;
  }

  function geometryCover(q) {
    const n = Number(q.examNumber || 0);
    if (n === 145) return frame(q, `<rect x="48" y="30" width="78" height="52" rx="5" fill="#fff" stroke="#914600" stroke-width="3"/><rect x="153" y="24" width="78" height="64" rx="5" fill="#fff" stroke="#FF7A00" stroke-width="3"/><path d="M126 56 H153" stroke="#64748B" stroke-width="3" stroke-dasharray="4 4"/><text x="66" y="61" font-size="13" font-weight="800" fill="#914600">A₁</text><text x="181" y="60" font-size="13" font-weight="800" fill="#914600">A₂</text>`);
    if (n === 139) return frame(q, `<circle cx="139" cy="56" r="34" fill="#fff" stroke="#914600" stroke-width="3"/><circle cx="139" cy="56" r="44" fill="none" stroke="#FFD2AA" stroke-width="8"/><path d="M173 28 A44 44 0 0 1 183 56" fill="none" stroke="#FF7A00" stroke-width="8" stroke-linecap="round"/><circle cx="178" cy="42" r="4" fill="#FF7A00"/><text x="188" y="44" font-size="10" font-weight="800" fill="#914600">P</text><line x1="139" y1="56" x2="139" y2="22" stroke="#64748B" stroke-width="2"/><text x="147" y="43" font-size="9" font-weight="800" fill="#475569">1 km</text>`);
    if (n === 155) return frame(q, `<path d="M75 91 L201 91 A126 126 0 0 0 111 17 Z" fill="#fff" stroke="#FF7A00" stroke-width="3"/><path d="M109 91 A34 34 0 0 0 100 67" fill="none" stroke="#914600" stroke-width="2.5"/><text x="107" y="67" font-size="14" font-weight="900" fill="#914600">α</text><text x="148" y="104" font-size="10" font-weight="900" fill="#914600">R</text>`);
    if (n === 150) return frame(q, `<rect x="48" y="25" width="184" height="62" rx="5" fill="#fff" stroke="#914600" stroke-width="3"/><line x1="140" y1="29" x2="140" y2="83" stroke="#FFD2AA" stroke-width="3" stroke-dasharray="5 5"/>${[38,47,56,65,74].map((y) => `<circle cx="140" cy="${y}" r="4.5" fill="#FF7A00"/>`).join("")}<text x="130" y="18" font-size="10" font-weight="800" fill="#914600">6 m</text><text x="236" y="58" font-size="10" font-weight="800" fill="#914600">3 m</text>`);
    if (n === 175) return frame(q, `<rect x="39" y="33" width="70" height="47" rx="5" fill="#fff" stroke="#FF7A00" stroke-width="3"/><path d="M119 56 H145" stroke="#64748B" stroke-width="3"/><path d="M137 49 L145 56 L137 63" fill="none" stroke="#64748B" stroke-width="3"/><ellipse cx="202" cy="35" rx="31" ry="9" fill="#fff" stroke="#FF7A00" stroke-width="3"/><path d="M171 35 V78 M233 35 V78" stroke="#FF7A00" stroke-width="3"/><ellipse cx="202" cy="78" rx="31" ry="9" fill="#fff" stroke="#FF7A00" stroke-width="3"/>`);
    return frame(q, `<polygon points="75,86 139,22 207,86" fill="#fff" stroke="#FF7A00" stroke-width="3"/><line x1="139" y1="22" x2="139" y2="86" stroke="#FFD2AA" stroke-width="3" stroke-dasharray="5 5"/>`);
  }

  function functionsCover(q) {
    const n = Number(q.examNumber || 0);
    if (n === 145) return frame(q, `<line x1="48" y1="88" x2="231" y2="88" stroke="#5A2791" stroke-width="2.5"/><line x1="48" y1="88" x2="48" y2="20" stroke="#5A2791" stroke-width="2.5"/><path d="M63 31 L103 31 C124 34 139 54 159 70 L219 70" fill="none" stroke="#9D4EDD" stroke-width="4" stroke-linecap="round"/><line x1="104" y1="31" x2="104" y2="88" stroke="#D9B9F5" stroke-width="2" stroke-dasharray="4 4"/><line x1="159" y1="70" x2="159" y2="88" stroke="#D9B9F5" stroke-width="2" stroke-dasharray="4 4"/>`);
    if (n === 177) return frame(q, `<rect x="57" y="24" width="166" height="64" rx="8" fill="#fff" stroke="#9D4EDD" stroke-width="2.5"/><line x1="57" y1="46" x2="223" y2="46" stroke="#D9B9F5" stroke-width="2"/><line x1="140" y1="24" x2="140" y2="88" stroke="#D9B9F5" stroke-width="2"/><text x="82" y="40" font-size="9" font-weight="800" fill="#5A2791">mochilas</text><text x="165" y="40" font-size="9" font-weight="800" fill="#5A2791">custo</text><text x="91" y="65" font-size="11" font-weight="900" fill="#9D4EDD">x</text><text x="166" y="65" font-size="11" font-weight="900" fill="#9D4EDD">C(x)</text>`);
    if (n === 146) return frame(q, `<line x1="48" y1="89" x2="232" y2="89" stroke="#5A2791" stroke-width="2.5"/><line x1="139" y1="96" x2="139" y2="19" stroke="#5A2791" stroke-width="2.5"/><path d="M70 29 Q139 101 208 29" fill="none" stroke="#9D4EDD" stroke-width="4"/><circle cx="139" cy="85" r="4.5" fill="#9D4EDD"/>`);
    if (n === 170) return frame(q, `<rect x="62" y="35" width="58" height="50" rx="7" fill="#E7D2F8"/><rect x="160" y="22" width="58" height="63" rx="7" fill="#9D4EDD"/><text x="79" y="64" font-size="12" font-weight="900" fill="#5A2791">E₁</text><text x="177" y="58" font-size="12" font-weight="900" fill="#fff">E₂</text><path d="M126 55 H153" stroke="#5A2791" stroke-width="3"/><path d="M146 48 L153 55 L146 62" fill="none" stroke="#5A2791" stroke-width="3"/>`);
    if (n === 160) return frame(q, `<line x1="48" y1="88" x2="231" y2="88" stroke="#5A2791" stroke-width="2.5"/><line x1="86" y1="18" x2="86" y2="88" stroke="#D9B9F5" stroke-width="2.5" stroke-dasharray="5 4"/><line x1="202" y1="18" x2="202" y2="88" stroke="#D9B9F5" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M99 82 C124 78 137 65 148 53 C160 39 174 27 190 24" fill="none" stroke="#9D4EDD" stroke-width="4" stroke-linecap="round"/>`);
    return frame(q, `<line x1="50" y1="88" x2="230" y2="88" stroke="#5A2791" stroke-width="2.5"/><line x1="50" y1="88" x2="50" y2="20" stroke="#5A2791" stroke-width="2.5"/><path d="M67 80 L105 68 L143 55 L181 41 L216 28" fill="none" stroke="#9D4EDD" stroke-width="4" stroke-linecap="round"/>`);
  }

  function genericCover(q) {
    if (q.category === "Estatística e Probabilidade") return frame(q, `<line x1="51" y1="88" x2="230" y2="88" stroke="#075C2B" stroke-width="2.5"/>${[35,58,44,68,52].map((h, i) => `<rect x="${70 + i * 31}" y="${88 - h}" width="19" height="${h}" rx="4" fill="${i % 2 ? "#7BC58F" : "#16803C"}"/>`).join("")}<line x1="51" y1="88" x2="51" y2="21" stroke="#075C2B" stroke-width="2.5"/>`);
    if (q.category === "Matemática Financeira") return frame(q, `<circle cx="103" cy="63" r="26" fill="#F3D96B" stroke="#7A5C00" stroke-width="3"/><circle cx="157" cy="48" r="26" fill="#D6A900" stroke="#7A5C00" stroke-width="3"/><text x="143" y="58" font-size="26" font-weight="900" fill="#fff">%</text><circle cx="207" cy="68" r="20" fill="#F3D96B" stroke="#7A5C00" stroke-width="3"/>`);
    if (q.category === "Grandezas e Medidas") return frame(q, `<rect x="60" y="43" width="160" height="34" rx="6" fill="#fff" stroke="#D70101" stroke-width="3"/>${[76,98,120,142,164,186,208].map((x, i) => `<line x1="${x}" y1="43" x2="${x}" y2="${i % 2 ? 60 : 68}" stroke="#8E0000" stroke-width="2"/>`).join("")}<text x="111" y="97" font-size="10" font-weight="900" fill="#8E0000">mm · cm · m · km</text>`);
    if (q.category === "Gráficos e Tabelas") return frame(q, `<line x1="50" y1="88" x2="232" y2="88" stroke="#9B145A" stroke-width="2.5"/><line x1="50" y1="88" x2="50" y2="21" stroke="#9B145A" stroke-width="2.5"/><polyline points="65,78 99,61 133,70 168,38 210,49" fill="none" stroke="#FF2E9A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="99" cy="61" r="4" fill="#FF2E9A"/><circle cx="168" cy="38" r="4" fill="#FF2E9A"/>`);
    return frame(q, `<text x="103" y="72" font-size="36" font-weight="900" fill="#2563EB">π</text><text x="158" y="72" font-size="36" font-weight="900" fill="#1E3A8A">√</text>`);
  }

  function coverFor(q) {
    if (q.category === "Geometria") return geometryCover(q);
    if (q.category === "Funções") return functionsCover(q);
    return genericCover(q);
  }

  function decorateCard(card) {
    const q = questionForCard(card);
    if (!q) return;
    const info = subjectInfo[q.category] || { color: "#2563EB", slug: "" };
    card.style.setProperty("--category-color", info.color);

    let visual = card.querySelector(".question-card__visual");
    if (!visual) {
      visual = document.createElement("div");
      visual.className = "question-card__visual";
      const tags = card.querySelector(".question-card__tags");
      if (tags) tags.insertAdjacentElement("afterend", visual);
      else card.querySelector(".question-card__meta")?.insertAdjacentElement("afterend", visual);
    }
    visual.classList.add("question-card__visual--static");
    visual.innerHTML = coverFor(q);
    visual.removeAttribute("aria-hidden");
    visual.setAttribute("role", "img");
    visual.setAttribute("aria-label", `Ilustração da questão ${q.examNumber || q.id} de ${q.category}`);

    card.querySelectorAll(".mente-review-link,.geometry-study-link,.function-study-link,.statistics-study-link,.card-study-link").forEach((link) => link.remove());
    const study = document.createElement("a");
    study.className = "card-study-link";
    study.href = `explicacoes.html#${info.slug}`;
    study.textContent = `📖 Revisar ${q.category}`;
    const footer = card.querySelector(".question-card__footer");
    if (footer) footer.insertAdjacentElement("beforebegin", study);
    else card.appendChild(study);

    const tags = card.querySelectorAll(".question-card__tags span");
    if (tags[1] && q.examNumber) tags[1].textContent = `ENEM ${esc(q.year)} · Q. ${esc(q.examNumber)}`;
  }

  function decorateAll() {
    grid.querySelectorAll(":scope > .question-card").forEach(decorateCard);
  }

  let pending = false;
  function scheduleDecorate() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      decorateAll();
    });
  }

  ["#area-filter", "#topic-filter", "#year-filter"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("change", scheduleDecorate);
  });
  document.querySelector("#clear-filters")?.addEventListener("click", scheduleDecorate);
  document.querySelectorAll(".status-button").forEach((button) => button.addEventListener("click", scheduleDecorate));

  decorateAll();
})();
