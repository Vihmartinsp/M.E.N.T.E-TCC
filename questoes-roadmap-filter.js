"use strict";

(() => {
  const params = new URLSearchParams(location.search);
  const subject = params.get("materia");
  const select = document.querySelector("#area-filter");
  if (!select) return;

  if (subject) {
    const hasOption = [...select.options].some((option) => option.value === subject);
    if (hasOption) {
      select.value = subject;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  // Quando uma missão do roteiro está ativa, mantém a URL alinhada ao filtro
  // atual. Assim, trocar de matéria pausa imediatamente o cronômetro da missão
  // anterior em vez de continuar contando por causa do parâmetro antigo.
  select.addEventListener("change", () => {
    if (!localStorage.getItem("mente-study-active-task-v3")) return;
    const next = new URLSearchParams(location.search);
    if (select.value) next.set("materia", select.value);
    else next.delete("materia");
    const query = next.toString();
    history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
  });
})();