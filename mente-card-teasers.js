"use strict";

(() => {
  const grid = document.querySelector("#questions-grid");
  if (!grid) return;

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#39;"
  }[c]));

  const palette = {
    "Geometria": {
      icon: "📐",
      soft: "#FFF3E8",
      accent: "#FF7A00",
      text: "#8A4700",
      message: "Descubra a figura certa, destaque as medidas e resolva sem mistério."
    },
    "Funções": {
      icon: "ƒ",
      soft: "#F7EEFF",
      accent: "#9D4EDD",
      text: "#5A2791",
      message: "Encontre a relação entre as grandezas e entenda o comportamento da situação."
    },
    "Estatística e Probabilidade": {
      icon: "📊",
      soft: "#EEF8EE",
      accent: "#004A00",
      text: "#004000",
      message: "Leia os dados com atenção e descubra a informação mais importante."
    },
    "Matemática Financeira": {
      icon: "💰",
      soft: "#FFFBE8",
      accent: "#D9A400",
      text: "#7A5C00",
      message: "Porcentagens, descontos e juros em situações do dia a dia."
    },
    "Grandezas e Medidas": {
      icon: "⚖️",
      soft: "#FFF0F0",
      accent: "#D70101",
      text: "#8E0000",
      message: "Converta unidades, compare medidas e encontre o valor correto."
    },
    "Gráficos e Tabelas": {
      icon: "📈",
      soft: "#FFF0F8",
      accent: "#FF2E9A",
      text: "#9B145A",
      message: "Interprete o gráfico com atenção e não caia nas armadilhas."
    }
  };

  const fallback = {
    icon: "✦",
    soft: "#F8FAFC",
    accent: "#2563EB",
    text: "#1E3A8A",
    message: "Questão organizada para estudo."
  };

  function getQuestion(id) {
    try {
      if (typeof questions !== "undefined" && Array.isArray(questions)) {
        return questions.find((q) => Number(q.id) === Number(id)) || null;
      }
    } catch {}
    return null;
  }

  function teaserVisual(q) {
    const p = palette[q?.category] || fallback;
    const examNumber = q?.examNumber || q?.id || "—";
    const year = q?.year || "—";
    const level = q?.stars || 1;
    const topic = q?.topic || q?.category || "Questão de Matemática";

    return `
      <div class="question-teaser" style="--teaser-soft:${p.soft};--teaser-accent:${p.accent};--teaser-text:${p.text}">
        <div class="question-teaser__top">
          <span class="question-teaser__icon" aria-hidden="true">${p.icon}</span>
          <span class="question-teaser__year">ENEM ${esc(year)}</span>
        </div>
        <div class="question-teaser__body">
          <strong>${esc(topic)}</strong>
          <p>${esc(p.message)}</p>
        </div>
        <div class="question-teaser__bottom">
          <span class="question-teaser__badge">Questão ${esc(examNumber)}</span>
          <span class="question-teaser__badge">Nível ${esc(level)}</span>
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

    visual.innerHTML = teaserVisual(q);
    visual.setAttribute("aria-label", `Capa da questão ${q.examNumber || q.id}, ${q.category}`);
    visual.removeAttribute("aria-hidden");
    card.dataset.menteTeaser = "true";
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
