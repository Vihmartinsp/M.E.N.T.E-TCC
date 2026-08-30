"use strict";

(() => {
  const statusEl = document.querySelector("#database-status");
  const client = window.menteSupabase;
  if (!statusEl) return;

  let stopped = false;
  let retryTimer = null;
  let probing = false;

  function set(message, state) {
    statusEl.textContent = message;
    statusEl.dataset.state = state;
    window.menteDatabaseStatus = {
      state,
      message,
      checkedAt: new Date().toISOString(),
    };
  }

  function timeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
    ]);
  }

  function scheduleRetry(delay = 15000) {
    clearTimeout(retryTimer);
    retryTimer = setTimeout(probe, delay);
  }

  async function probe() {
    if (stopped || probing) return;
    probing = true;

    try {
      if (!client) throw new Error("cliente ausente");

      const { count, error } = await timeout(
        client.from("questoes").select("id", { count: "exact", head: true }).eq("ativa", true),
        4500,
      );
      if (error) throw error;

      const current = window.menteDatabaseStatus?.message || "";
      if (!/progresso online|modo visitante/i.test(current)) {
        set(`Banco online · ${Number(count) || 30} questões · sincronização ativa`, "ok");
      }
      scheduleRetry(30000);
    } catch {
      const currentState = window.menteDatabaseStatus?.state;
      if (currentState !== "ok") {
        set("Modo local · tentando reconectar em segundo plano", "local");
      }
      scheduleRetry(12000);
    } finally {
      probing = false;
    }
  }

  // Nunca deixe a interface parada em “conectando”. O conteúdo local já está pronto.
  if (["loading", "error"].includes(statusEl.dataset.state)) {
    set("Dados locais prontos · sincronizando banco...", "local");
  }

  const statusObserver = new MutationObserver(() => {
    const state = statusEl.dataset.state;
    if (state === "loading" || state === "error") scheduleRetry(350);
  });
  statusObserver.observe(statusEl, { attributes: true, attributeFilter: ["data-state"] });

  setTimeout(probe, 700);
  window.addEventListener("online", () => scheduleRetry(100));
  window.addEventListener("offline", () => set("Modo local · sem conexão com a internet", "local"));
  window.addEventListener("beforeunload", () => {
    stopped = true;
    clearTimeout(retryTimer);
    statusObserver.disconnect();
  });
})();
