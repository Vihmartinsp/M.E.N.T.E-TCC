"use strict";

(() => {
  const state = { client: null, data: null, loading: false };
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

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

  function dateLabel(value) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" })
      .format(dateObj(value))
      .replace(".", "");
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
    host.className = "mente-streak";
    const hero = main.querySelector(".portal-hero");
    main.insertBefore(host, hero || main.firstChild);
    return host;
  }

  function renderLoading() {
    const host = ensureSlot();
    if (!host) return;
    host.innerHTML = '<div class="mente-streak__loading">Carregando sua sequência de estudos...</div>';
  }

  function renderGuest() {
    const host = ensureSlot();
    if (!host) return;
    host.innerHTML = '<div class="mente-streak__guest"><strong>Sequência de estudos</strong><span>Entre na sua conta para acompanhar seus dias e pontos.</span><a href="login.html">Entrar</a></div>';
  }

  function dayClass(day) {
    return `${day.na_sequencia ? " is-active" : ""}${day.hoje ? " is-today" : ""}`;
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
    const todayBonus = Math.max(0, Number(today?.bonus_pontos) || 0);
    const nextBonus = Math.max(0, Number(data.bonus_proximo) || 10);
    const maintainedDays = days.filter((day) => day.na_sequencia).length;

    let statusCopy;
    if (today?.na_sequencia) {
      statusCopy = `Sequência mantida hoje${todayBonus ? ` · +${todayBonus} pts` : ""}`;
    } else if (seq > 0) {
      statusCopy = `Estude hoje para manter sua sequência${nextBonus ? ` · bônus +${nextBonus} pts` : ""}`;
    } else {
      statusCopy = `Comece sua sequência hoje${nextBonus ? ` · bônus +${nextBonus} pts` : ""}`;
    }

    host.innerHTML = `
      <div class="mente-streak__summary">
        <span class="mente-streak__flame" aria-hidden="true">◆</span>
        <div class="mente-streak__copy">
          <small>Sequência de estudos</small>
          <strong>${seq} dia${seq === 1 ? "" : "s"} seguido${seq === 1 ? "" : "s"}</strong>
          <span>${esc(statusCopy)}</span>
        </div>
        <button class="mente-streak__history-toggle" type="button" id="mente-streak-toggle" aria-expanded="false" aria-controls="mente-streak-details">
          <span>Ver últimos dias</span>
          <i aria-hidden="true">⌄</i>
        </button>
      </div>

      <div class="mente-streak__details" id="mente-streak-details" hidden>
        <div class="mente-streak__panel">
          <div class="mente-streak__panel-head">
            <div>
              <strong>Últimos 14 dias</strong>
              <span>Um resumo simples dos pontos registrados em cada dia.</span>
            </div>
            <small>${maintainedDays} de ${days.length || 14} dias mantidos</small>
          </div>

          <div class="mente-streak__history" role="list">
            ${days.map((day) => {
              const points = Math.max(0, Number(day.pontos_dia) || 0);
              const label = `${fullDate(day.data)}${day.hoje ? ", hoje" : ""}: ${day.na_sequencia ? "sequência mantida" : "sem sequência"}, ${points} pontos`;
              return `<div class="mente-streak__history-day${dayClass(day)}" role="listitem" aria-label="${esc(label)}" title="${esc(label)}">
                <div class="mente-streak__history-date">
                  <span>${esc(weekday(day.data, true))}</span>
                  <b>${dateObj(day.data).getDate()}</b>
                </div>
                <span class="mente-streak__history-mark" aria-hidden="true">${day.na_sequencia ? "✓" : "·"}</span>
                <small>${points} pt${points === 1 ? "" : "s"}</small>
                ${day.hoje ? '<em>hoje</em>' : ""}
              </div>`;
            }).join("")}
          </div>
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
      if (label) label.textContent = open ? "Ocultar histórico" : "Ver últimos dias";
    });
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

      const { data, error } = await state.client.rpc("mente_sequencia_resumo");
      if (error) throw error;
      state.data = data || { autenticado: true, sequencia: 0, dias: [] };
      render();
    } catch (error) {
      console.warn("[M.E.N.T.E Sequência]", error);
      const host = ensureSlot();
      if (host) host.innerHTML = '<div class="mente-streak__loading">Não foi possível carregar a sequência agora.</div>';
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