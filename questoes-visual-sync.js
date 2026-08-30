"use strict";

(() => {
  const filter = document.querySelector("#area-filter");
  const grid = document.querySelector("#questions-grid");
  if (!filter || !grid) return;

  let timer = null;
  let lastRun = 0;

  function redraw() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const now = Date.now();
      if (now - lastRun < 120) return;
      lastRun = now;

      // questoes-cards-static.js já escuta a mudança desse filtro.
      // Disparamos o mesmo evento sem alterar o valor selecionado para que
      // as ilustrações sejam recriadas depois que o Supabase refizer os cards.
      filter.dispatchEvent(new Event("change", { bubbles: true }));
    }, 40);
  }

  window.addEventListener("mente:catalog-updated", redraw);

  // Se o evento do banco ocorreu antes deste arquivo terminar de carregar,
  // esta chamada garante uma segunda decoração logo após a montagem da página.
  setTimeout(redraw, 350);
  setTimeout(redraw, 1400);
})();
