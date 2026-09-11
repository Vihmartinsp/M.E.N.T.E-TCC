"use strict";

(() => {
  const statusEl = document.querySelector("#database-status");
  if (!statusEl) return;

  let stopped = false;
  let retryTimer = null;
  let probing = false;

  const getClient = () => window.menteSupabase || null;

  function set(message, state, { preserveOk = false } = {}) {
    const currentState = window.menteDatabaseStatus?.state || statusEl.dataset.state;
    if (preserveOk && currentState === "ok" && state !== "ok") return;

    statusEl.textContent = message;
    statusEl.dataset.state = state;
    window.menteDatabaseStatus = {
      state,
      message,
      project: "M.E.N.T.E 2",
      projectRef: "jburhxxubqfvayfnahku",
      checkedAt: new Date().toISOString(),
    };
  }

  function timeout(promise, ms) {
    let timer;
    const timerPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), ms);
    });
    return Promise.race([promise, timerPromise]).finally(() => clearTimeout(timer));
  }

  function scheduleRetry(delay = 15000) {
    if (stopped) return;
    clearTimeout(retryTimer);
    retryTimer = setTimeout(probe, delay);
  }

  async function probe() {
    if (stopped || probing) return;
    probing = true;

    try {
      const client = getClient();
      if (!client) throw new Error("cliente Supabase ausente");

      const { count, error } = await timeout(
        client.from("questoes").select("id", { count: "exact", head: true }).eq("ativa", true),
        5000,
      );
      if (error) throw error;

      const current = window.menteDatabaseStatus?.message || statusEl.textContent || "";
      if (!/progresso online|modo visitante|login não sincronizado/i.test(current)) {
        set(`Banco conectado · ${Number(count) || 30} questões · M.E.N.T.E 2`, "ok");
      }
      scheduleRetry(30000);
    } catch (error) {
      const hasClient = Boolean(getClient());
      set(
        hasClient
          ? "Dados locais prontos · M.E.N.T.E 2 temporariamente indisponível"
          : "Dados locais prontos · cliente do Supabase não carregou",
        "local",
        { preserveOk: true },
      );
      scheduleRetry(hasClient ? 12000 : 2500);
      console.warn("[M.E.N.T.E] Verificação do banco:", error?.message || error);
    } finally {
      probing = false;
    }
  }

  // Não sobrescreve a tentativa principal de conexão. O antigo watchdog fazia
  // isso imediatamente e podia deixar a interface presa na mensagem local.
  if (!window.menteDatabaseStatus) {
    window.menteDatabaseStatus = {
      state: statusEl.dataset.state || "loading",
      message: statusEl.textContent || "Banco: conectando...",
      project: "M.E.N.T.E 2",
      projectRef: "jburhxxubqfvayfnahku",
      checkedAt: new Date().toISOString(),
    };
  }

  const statusObserver = new MutationObserver(() => {
    const state = statusEl.dataset.state;
    if (state === "error" || state === "local") scheduleRetry(500);
  });
  statusObserver.observe(statusEl, { attributes: true, attributeFilter: ["data-state"] });

  // Dá tempo para supabase-sync-safe concluir a primeira leitura antes do probe.
  setTimeout(probe, 1200);

  // Failsafe: nenhuma tela deve permanecer indefinidamente em “conectando”.
  setTimeout(() => {
    const state = window.menteDatabaseStatus?.state || statusEl.dataset.state;
    if (state === "loading") {
      set("Dados locais prontos · verificando M.E.N.T.E 2 em segundo plano", "local");
      probe();
    }
  }, 8000);

  window.addEventListener("mente:catalog-updated", () => scheduleRetry(1000));
  window.addEventListener("online", () => scheduleRetry(100));
  window.addEventListener("offline", () => {
    set("Modo local · sem conexão com a internet", "local", { preserveOk: false });
  });
  window.addEventListener("beforeunload", () => {
    stopped = true;
    clearTimeout(retryTimer);
    statusObserver.disconnect();
  });
})();
