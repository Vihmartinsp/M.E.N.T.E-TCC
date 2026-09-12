"use strict";

(() => {
  const ORDER = [
    "Geometria",
    "Funções",
    "Estatística e Probabilidade",
    "Matemática Financeira",
    "Grandezas e Medidas",
    "Gráficos e Tabelas",
  ];

  let attempts = 0;
  const MAX_ATTEMPTS = 20;

  function applyFinalCatalog() {
    attempts += 1;

    const modules = window.MENTE_FINAL_MODULES || {};
    const finalQuestions = ORDER.flatMap((category) => modules[category]?.questions || []);

    if (!finalQuestions.length || typeof questions === "undefined" || typeof renderQuestions !== "function") {
      if (attempts < MAX_ATTEMPTS) setTimeout(applyFinalCatalog, 100);
      return;
    }

    const payload = finalQuestions.map((q) => ({
      ...q,
      text: q.statement || q.text || "",
      detail: q.statement || q.detail || q.text || "",
      visual: null,
      status: "Não respondida",
    }));

    questions.splice(0, questions.length, ...payload);

    if (typeof categoryColors !== "undefined") {
      ORDER.forEach((category) => {
        if (modules[category]?.color) categoryColors[category] = modules[category].color;
      });
    }

    if (typeof filters !== "undefined") {
      const currentCategory = filters.category?.value || "";
      const currentYear = filters.year?.value || "";

      if (filters.category) {
        filters.category.replaceChildren(new Option("Todas as matérias", ""));
        if (typeof fillSelect === "function") fillSelect(filters.category, ORDER.filter((category) => modules[category]?.questions?.length));
        filters.category.value = ORDER.includes(currentCategory) ? currentCategory : "";
      }

      if (typeof updateTopicOptions === "function") updateTopicOptions();

      if (filters.year) {
        const years = [...new Set(payload.map((q) => Number(q.year)).filter(Boolean))].sort((a, b) => b - a);
        filters.year.replaceChildren(new Option("Todos os anos", ""));
        if (typeof fillSelect === "function") fillSelect(filters.year, years);
        filters.year.value = years.map(String).includes(String(currentYear)) ? currentYear : "";
      }
    }

    renderQuestions();

    try {
      window.dispatchEvent(new CustomEvent("mente:catalog-final-ready", { detail: { total: payload.length } }));
      window.dispatchEvent(new CustomEvent("mente:catalog-updated"));
    } catch {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(applyFinalCatalog, 0), { once: true });
  } else {
    setTimeout(applyFinalCatalog, 0);
  }
})();
