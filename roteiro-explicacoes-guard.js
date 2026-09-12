"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;
  const ACTIVE_KEY = "mente-study-active-task-v3";
  const PLAN_KEY = "mente-study-plan-v3";

  function activeTask() {
    const id = localStorage.getItem(ACTIVE_KEY);
    if (!id) return null;
    try {
      const plan = JSON.parse(localStorage.getItem(PLAN_KEY) || "null");
      return plan?.tasks?.find((task) => task.id === id) || null;
    } catch {
      return null;
    }
  }

  function guardEmptyHash() {
    const task = activeTask();
    if (!task || !["explanation", "review"].includes(task.type)) return;
    if (location.hash) return;
    // Um hash neutro faz o rastreador entender que nenhuma matéria específica
    // está aberta. O tempo volta a contar assim que o aluno abre a matéria da missão.
    history.replaceState(null, "", `${location.pathname}${location.search}#inicio`);
  }

  guardEmptyHash();
  window.addEventListener("hashchange", guardEmptyHash);
})();