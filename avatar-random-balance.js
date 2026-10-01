"use strict";

// Compatibilidade: o editor v8 já possui o próprio modo aleatório equilibrado.
// Este arquivo pode continuar em páginas antigas/cacheadas sem interceptar cliques
// nem disputar eventos com o sistema principal de avatar.
(() => {
  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-avatar-random]");
    if (!button) return;
    if (window.MENTE_AVATAR?.version >= 8) return;
  }, true);
})();
