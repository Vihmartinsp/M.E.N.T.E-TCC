"use strict";

(() => {
  const state = { client: null, data: null, loading: false, claiming: false };
  const POINTS_KEY = "mente-points";

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  function waitForClient() {
    if (window.menteSupabase) return Promise.resolve(window.menteSupabase);
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve(window.menteSupabase || null);
      };
      window.addEventListener("mente:supabase-ready", finish, { once: true });
      setTimeout(finish, 2200);
    });
  }

  function dateObj(value) {
    return new Date(`${value}T12:00:00`);
  }

  function weekday(value, short = false) {
    const text = new Intl.DateTimeFormat("pt-BR", { weekday: short ? "short" : "long" })
      .format(dateObj(value))
      .replace("-feira", "");
    return short ? text.replace(".", "").slice(0, 3) : text;
  }

  function fullDate(value) {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" })
      .format(dateObj(value));
  }

  function ensureSlot() {
    const existing = document.querySelector("#mente-streak-widget");
    if (existing) return existing;

    const main = document.querySelector(".portal-main");
    if (!main) return null;

    const host = document.createElement("section");
    host.id = "mente-streak-widget";
    host.className = "mente-streak-card";
    const hero = main.querySelector(".portal-hero");
    main.insertBefore(host, hero || main.firstChild);
    return host;
  }

  function syncPoints(points) {
    const value = Math.max(0, Number(points) || 0);
    try { localStorage.setItem(POINTS_KEY, String(value)); } catch {}
    document.querySelectorAll(".score strong,#points,#global-points").forEach((el) => {
      el.textContent = String(value);
    });
    window.menteDbProfile = { ...(window.menteDbProfile || {}), pontos: value };
  }

  function notifyUpdates() {
    try { window.dispatchEvent(new CustomEvent("mente:points-updated")); } catch {}
    try { window.dispatchEvent(new CustomEvent("mente:account-updated")); } catch {}
  }

  function renderLoading() {
    const host = ensureSlot();
    if (!host) return;
    host.innerHTML = '<div class="mente-streak-card__loading">Carregando sua sequência...</div>';
  }

  function renderGuest() {
    const host = ensureSlot();
    if (!host) return;
    host.innerHTML = '<div class="mente-streak-card__guest"><strong>Sequência de estudos</strong><span>Entre na sua conta para salvar seus dias e resgatar pontos.</span><a href="login.html">Entrar</a></div>';
  }

  function accessed(day) {
    return Boolean(day?.acessou ?? day?.na_sequencia);
  }

  function dayClass(day) {
    return `${accessed(day) ? " is-active" : ""}${day.hoje ? " is-today" : ""}`;
  }

  function claimButton(data, today) {
    const claimed = Boolean(data.resgatado_hoje ?? today?.resgatado);
    if (claimed) {
      return '<button class="mente-streak-card__claim is-claimed" type="button" disabled><span>✓</span> +10 resgatados</button>';
    }
    return `<button class="mente-streak-card__claim" type="button" id="mente-streak-claim"${state.claiming ? " disabled" : "}>${state.claiming ? "Resgatando..." : "Resgatar +10 pts"}</button>`;
  }

  function render() {
    const host = ensureSlot();
    if (!host) return;

    const data = state.data;
    if (!data?.autenticado) {
      renderGuest();
      return;
    }

    const days = Array.isArray(data.dias) ? data.dias : [];
    const today = days.find((day) => day.hoje) || days[days.length - 1] || null;
    const seq = Math.max(0, Number(data.sequencia) || 0);
    const maintainedDays = days.filter(accessed).length;
    const weekProgress = Math.max(0, Math.min(7, Number(data.semana_progresso) || 0));
    const weeklyToday = Math.max(0, Number(data.bonus_semana_hoje) || Number(today?.pontos_semana) || 0);
    const claimed = Boolean(data.resgatado_hoje ?? today?.resgatado);

    let statusCopy = "Sua entrada de hoje foi salva.";
    if (weeklyToday >= 50) statusCopy = "Semana perfeita concluída · +50 pts";
    else if (claimed) statusCopy = "Presença salva hoje · +10 pts resgatados";
    else statusCopy = "Presença salva hoje · +10 pts disponíveis";

    host.innerHTML = `
      <div class="mente-streak-card__summary">
        <span class="mente-streak-card__icon" aria-hidden="true">◆</span>
        <div class="mente-streak-card__copy">
          <small>Sequência de estudos</small>
          <strong>${seq} dia${seq === 1 ? "" : "s"} seguido${seq === 1 ? "" : "s"}</strong>
          <span>${esc(statusCopy)}</span>
        </div>
        <div class="mente-streak-card__rewards">
          <span class="mente-streak-card__week">Semana ${weekProgress}/7 · +50 pts</span>
          ${claimButton(data, today)}
        </div>
        <button class="mente-streak-card__history-toggle" type="button" id="mente-streak-toggle" aria-expanded="false" aria-controls="mente-streak-details">
          <span>Ver histórico</span><i aria-hidden="true">⌄</i>
        </button>
      </div>

      <div class="mente-streak-card__details" id="mente-streak-details" hidden>
        <div class="mente-streak-card__panel">
          <div class="mente-streak-card__panel-head">
            <div>
              <strong>Últimos 14 dias</strong>
              <span>Cada quadradinho marcado representa um dia em que você entrou.</span>
            </div>
            <small>${maintainedDays} de ${days.length || 14} dias registrados</small>
          </div>

          <div class="mente-streak-card__history" role="list">
            ${days.map((day) => {
              const points = Math.max(0, Number(day.pontos_dia) || 0);
              const wasAccessed = accessed(day);
              const label = `${fullDate(day.data)}${day.hoje ? ", hoje" : ""}: ${wasAccessed ? "entrada registrada" : "sem entrada"}, ${points} pontos`;
              return `<div class="mente-streak-card__day${dayClass(day)}" role="listitem" aria-label="${esc(label)}" title="${esc(label)}">
                <div class="mente-streak-card__date"><span>${esc(weekday(day.data, true))}</span><b>${dateObj(day.data).getDate()}</b></div>
                <span class="mente-streak-card__mark" aria-hidden="true">${wasAccessed ? "✓" : "·"}</span>
                <small>${points} pt${points === 1 ? "" : "s"}</small>
                ${day.hoje ? '<em>hoje</em>' : ""}
              </div>`;
            }).join("")}
          </div>

          <p class="mente-streak-card__rule">Você pode faltar 1 dia sem perder a sequência. Se ficar 2 dias completos sem entrar, a sequência recomeça. Sete dias seguidos rendem +50 pontos.</p>
        </div>
      </div>`;

    const toggle = host.querySelector("#mente-streak-toggle");
    const details = host.querySelector("#mente-streak-details");
    const label = toggle?.querySelector("span");

    toggle?.addEventListener("click", () => {
      const open = !host.classList.contains("is-open");
      host.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (details) details.hidden = !open;
      if (label) label.textContent = open ? "Ocultar histórico" : "Ver histórico";
    });

    host.querySelector("#mente-streak-claim")?.addEventListener("click", claimDailyBonus);
  }

  async function fetchSummary({ register = false } = {}) {
    const rpcName = register ? "registrar_acesso_diario" : "mente_sequencia_resumo";
    const { data, error } = await state.client.rpc(rpcName);
    if (error) throw error;
    return data;
  }

  async function claimDailyBonus() {
    if (state.claiming || !state.client) return;
    state.claiming = true;
    render();

    try {
      const { data, error } = await state.client.rpc("resgatar_bonus_diario_manual");
      if (error) throw error;
      const result = Array.isArray(data) ? data[0] : data;
      if (result?.pontos_totais !== undefined) syncPoints(result.pontos_totais);
      state.data = await fetchSummary();
      if (state.data?.pontos_totais !== undefined) syncPoints(state.data.pontos_totais);
      notifyUpdates();
    } catch (error) {
      console.warn("[M.E.N.T.E Sequência] Falha ao resgatar bônus:", error);
    } finally {
      state.claiming = false;
      render();
    }
  }

  async function load() {
    if (state.loading) return;
    state.loading = true;
    renderLoading();

    try {
      state.client = state.client || await waitForClient();
      if (!state.client) {
        state.data = { autenticado: false };
        render();
        return;
      }

      const { data: sessionData } = await state.client.auth.getSession();
      if (!sessionData?.session?.user) {
        state.data = { autenticado: false };
        render();
        return;
      }

      try {
        state.data = await fetchSummary({ register: true });
      } catch (registerError) {
        console.warn("[M.E.N.T.E Sequência] Registro diário indisponível, usando resumo:", registerError);
        state.data = await fetchSummary();
      }

      if (!state.data) state.data = { autenticado: true, sequencia: 0, dias: [] };
      if (state.data?.pontos_totais !== undefined) syncPoints(state.data.pontos_totais);
      render();
    } catch (error) {
      console.warn("[M.E.N.T.E Sequência]", error);
      const host = ensureSlot();
      if (host) host.innerHTML = '<div class="mente-streak-card__loading">Não foi possível carregar a sequência agora.</div>';
    } finally {
      state.loading = false;
    }
  }

  function boot() {
    if (!ensureSlot()) {
      setTimeout(boot, 80);
      return;
    }
    load();
  }

  boot();
  window.addEventListener("mente:points-updated", () => setTimeout(load, 220));
  window.addEventListener("mente:plan-updated", () => setTimeout(load, 220));
  window.addEventListener("mente:supabase-ready", () => {
    if (!state.client) setTimeout(load, 120);
  });
  window.addEventListener("focus", () => {
    if (state.data) setTimeout(load, 120);
  });
})();
