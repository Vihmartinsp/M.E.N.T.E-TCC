"use strict";

(() => {
  const statusEl = document.querySelector("#database-status");
  const client = window.menteSupabase;
  if (!statusEl) return;

  let stopped = false;
  let retryTimer = null;

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

  async function probe() {
    if (stopped) return;
    if (!client) {
      set("Modo local · banco não carregado", "local");
      scheduleRetry();
      return;
    }

    try {
      const { count, error } = await timeout(
        client.from("questoes").select("id", { count: "exact", head: true }).eq("ativa", true),
        4500,
      );
      if (error) throw error;

      const current = window.menteDatabaseStatus?.message || "";
      if (!/progresso online|modo visitante/i.test(current)) {
        set(`Banco online · ${Number(count) || 30} questões · sincronização ativa`, "ok");
      }
      clearTimeout(retryTimer);
    } catch {
      const currentState = window.menteDatabaseStatus?.state;
      if (currentState !== "ok") {
        set("Modo local · tentando reconectar em segundo plano", "local");
      }
      scheduleRetry();
    }
  }

  function scheduleRetry() {
    clearTimeout(retryTimer);
    retryTimer = setTimeout(probe, 15000);
  }

  // Nunca deixe a interface parada em “conectando”. O conteúdo local já está pronto.
  if (statusEl.dataset.state === "loading") {
    set("Dados locais prontos · sincronizando banco...", "local");
  }

  setTimeout(probe, 900);
  window.addEventListener("online", probe);
  window.addEventListener("offline", () => set("Modo local · sem conexão com a internet", "local"));
  window.addEventListener("beforeunload", () => {
    stopped = true;
    clearTimeout(retryTimer);
  });
})();
