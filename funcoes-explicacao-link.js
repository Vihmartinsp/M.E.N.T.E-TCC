"use strict";

(() => {
  const href = "explicacoes.html#funcoes";

  function addCatalogLinks() {
    document.querySelectorAll(".question-card").forEach((card) => {
      const category = card.querySelector(".question-card__category")?.textContent?.trim();
      if (category !== "Funções" || card.querySelector(".function-study-link")) return;

      const link = document.createElement("a");
      link.className = "function-study-link";
      link.href = href;
      link.textContent = "📘 Revisar Funções";
      link.setAttribute("aria-label", "Revisar Funções");

      const footer = card.querySelector(".question-card__footer");
      if (footer) footer.insertAdjacentElement("beforebegin", link);
      else card.appendChild(link);
    });
  }

  function addDetailLink() {
    const root = document.querySelector("#question-content");
    if (!root || root.querySelector(".function-study-link")) return;

    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    if (selected?.category !== "Funções") return;

    const card = root.querySelector(".portal-card");
    if (!card) return;

    const link = document.createElement("a");
    link.className = "function-study-link";
    link.href = href;
    link.textContent = "📘 Revisar Funções";
    link.setAttribute("aria-label", "Revisar Funções");

    const meta = card.querySelector(".question-detail__meta");
    if (meta) meta.insertAdjacentElement("afterend", link);
    else card.prepend(link);
  }

  addCatalogLinks();
  addDetailLink();

  const observer = new MutationObserver(() => {
    addCatalogLinks();
    addDetailLink();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
