"use strict";

(() => {
  const statusEl = document.querySelector("#database-status");
  if (!statusEl) return;

  let stopped = false;
  let retryTimer = null;
  let probing = false;
  const PROJECT = "M.E.N.T.E 2";
  const PROJECT_REF = "jburhxxubqfvayfnahku";
  const SUPABASE_URL = "https://jburhxxubqfvayfnahku.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qJMnLXr00ksVZNc6p65wJA_LzTD0t6M";

  const getClient = () => window.menteSupabase || null;

  function set(message, state, { preserveOk = false } = {}) {
    const currentState = window.menteDatabaseStatus?.state || statusEl.dataset.state;
    if (preserveOk && currentState === "ok" && state !== "ok") return;
    statusEl.textContent = message;
    statusEl.dataset.state = state;
    window.menteDatabaseStatus = { state, message, project: PROJECT, projectRef: PROJECT_REF, checkedAt: new Date().toISOString() };
  }

  function timeout(promise, ms) {
    let timer;
    const timerPromise = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), ms); });
    return Promise.race([promise, timerPromise]).finally(() => clearTimeout(timer));
  }

  function scheduleRetry(delay = 15000) {
    if (stopped) return;
    clearTimeout(retryTimer);
    retryTimer = setTimeout(probe, delay);
  }

  async function probeWithClient(client) {
    const { count, error } = await timeout(client.from("questoes").select("id", { count: "exact", head: true }).eq("ativa", true), 4500);
    if (error) throw error;
    return Number(count) || 30;
  }

  async function probeWithRest() {
    const response = await timeout(fetch(`${SUPABASE_URL}/rest/v1/questoes?select=id&ativa=eq.true&limit=1`, {
      method: "GET",
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Prefer: "count=exact", Range: "0-0" },
      cache: "no-store",
    }), 4500);
    if (!response.ok) throw new Error(`REST ${response.status}`);
    const range = response.headers.get("content-range") || "";
    const match = range.match(/\/(\d+)$/);
    return match ? Number(match[1]) : 30;
  }

  async function probe() {
    if (stopped || probing) return;
    probing = true;
    try {
      const client = getClient();
      const count = client ? await probeWithClient(client) : await probeWithRest();
      const current = window.menteDatabaseStatus?.message || statusEl.textContent || "";
      if (/progresso online|modo visitante|login não sincronizado/i.test(current)) statusEl.dataset.state = "ok";
      else set(`Banco conectado · ${count || 30} questões · ${PROJECT}`, "ok");
      scheduleRetry(30000);
    } catch (error) {
      const hasClient = Boolean(getClient());
      set(hasClient ? `30 questões locais · ${PROJECT} temporariamente indisponível` : `30 questões locais · verificando ${PROJECT} em segundo plano`, "local", { preserveOk: true });
      scheduleRetry(hasClient ? 10000 : 2500);
      console.warn("[M.E.N.T.E] Verificação do banco:", error?.message || error);
    } finally {
      probing = false;
    }
  }

  if (!window.menteDatabaseStatus) {
    window.menteDatabaseStatus = { state: statusEl.dataset.state || "ready", message: statusEl.textContent || `30 questões prontas · ${PROJECT}`, project: PROJECT, projectRef: PROJECT_REF, checkedAt: new Date().toISOString() };
  }

  const statusObserver = new MutationObserver(() => {
    const state = statusEl.dataset.state;
    if (state === "error" || state === "local") scheduleRetry(500);
  });
  statusObserver.observe(statusEl, { attributes: true, attributeFilter: ["data-state"] });

  setTimeout(probe, 120);
  window.addEventListener("mente:supabase-ready", () => scheduleRetry(10));
  window.addEventListener("mente:catalog-updated", () => scheduleRetry(300));
  window.addEventListener("online", () => scheduleRetry(50));
  window.addEventListener("offline", () => set("30 questões locais · sem conexão com a internet", "local", { preserveOk: false }));
  window.addEventListener("beforeunload", () => { stopped = true; clearTimeout(retryTimer); statusObserver.disconnect(); });
})();
