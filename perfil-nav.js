"use strict";

(() => {
  function renameProfileLinks() {
    document.querySelectorAll('a[href*="desempenho.html"]').forEach((link) => {
      if (!link.classList.contains("sidebar__link")) return;
      link.innerHTML = '<span aria-hidden="true">◉</span> Perfil';
      link.setAttribute("aria-label", "Perfil");
    });
  }

  renameProfileLinks();
  const observer = new MutationObserver(renameProfileLinks);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("load", () => {
    renameProfileLinks();
    setTimeout(() => observer.disconnect(), 1500);
  }, { once: true });
})();