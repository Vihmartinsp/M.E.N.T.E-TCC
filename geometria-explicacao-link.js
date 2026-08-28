"use strict";

(() => {
  const href = "explicacoes.html#geometria";

  function renameProfileLink() {
    document.querySelectorAll('a[href*="desempenho.html"]').forEach((link) => {
      if (!link.classList.contains("sidebar__link")) return;
      link.innerHTML = '<span aria-hidden="true">◉</span> Perfil';
      link.setAttribute("aria-label", "Perfil");
    });
  }

  function addCatalogLinks() {
    document.querySelectorAll(".question-card").forEach((card) => {
      const category = card.querySelector(".question-card__category")?.textContent?.trim();
      if (category !== "Geometria" || card.querySelector(".geometry-study-link")) return;

      const link = document.createElement("a");
      link.className = "geometry-study-link";
      link.href = href;
      link.textContent = "📘 Revisar Geometria";
      link.setAttribute("aria-label", "Revisar Geometria");

      const footer = card.querySelector(".question-card__footer");
      if (footer) footer.insertAdjacentElement("beforebegin", link);
      else card.appendChild(link);
    });
  }

  function addDetailLink() {
    const root = document.querySelector("#question-content");
    if (!root || root.querySelector(".geometry-study-link")) return;

    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    if (selected?.category !== "Geometria") return;

    const card = root.querySelector(".portal-card");
    if (!card) return;

    const link = document.createElement("a");
    link.className = "geometry-study-link";
    link.href = href;
    link.textContent = "📘 Revisar Geometria";
    link.setAttribute("aria-label", "Revisar Geometria");

    const meta = card.querySelector(".question-detail__meta");
    if (meta) meta.insertAdjacentElement("afterend", link);
    else card.prepend(link);
  }

  renameProfileLink();
  addCatalogLinks();
  addDetailLink();

  const observer = new MutationObserver(() => {
    renameProfileLink();
    addCatalogLinks();
    addDetailLink();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
