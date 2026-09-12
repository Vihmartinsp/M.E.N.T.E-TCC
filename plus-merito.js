"use strict";

(() => {
  const MILESTONES = [
    { level: 1, streak: 7, points: 100, reward: 3, label: "Primeira conquista" },
    { level: 2, streak: 14, points: 250, reward: 7, label: "Consistência" },
    { level: 3, streak: 30, points: 500, reward: 15, label: "Mestre da rotina" },
  ];

  let lastStatus = null;
  let running = false;

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function formatDate(value) {
    const date = new Date(value || "");
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  }

  function ensureStyles() {
    if (document.querySelector("#mente-plus-merito-styles")) return;
    const style = document.createElement("style");
    style.id = "mente-plus-merito-styles";
    style.textContent = `
      .plus-merit-live{margin:14px 0 0;padding:12px 14px;border:1px solid #ecd978;border-radius:13px;background:#fff9dc;color:#6b5200;font-size:12px;font-weight:750;line-height:1.5}.plus-merit-live strong{color:#493700}
      .plus-merit-progress{display:grid;gap:15px}.plus-merit-now{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.plus-merit-stat{padding:15px;border:1px solid #e3e9f2;border-radius:14px;background:#fff}.plus-merit-stat small{display:block;color:#77859a;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.5px}.plus-merit-stat strong{display:block;margin-top:5px;color:#16243a;font-size:20px}.plus-merit-next{padding:17px;border:1px solid #ded4ff;border-radius:16px;background:linear-gradient(135deg,#fbf9ff,#fffdf2)}.plus-merit-next__head{display:flex;justify-content:space-between;gap:12px;align-items:center}.plus-merit-next__head strong{color:#4f36a8}.plus-merit-next__head span{font-size:11px;font-weight:800;color:#755c00}.plus-merit-bars{display:grid;gap:10px;margin-top:13px}.plus-merit-bar label{display:flex;justify-content:space-between;gap:12px;margin-bottom:5px;color:#5f6d82;font-size:11px;font-weight:750}.plus-merit-track{height:8px;border-radius:999px;background:#e9edf4;overflow:hidden}.plus-merit-track span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#7c3aed,#f2c94c)}.plus-merit-done{padding:15px;border:1px solid #bfe8ce;border-radius:14px;background:#f0fdf4;color:#166534;font-weight:800}
      .plus-merit-modal[hidden]{display:none!important}.plus-merit-modal{position:fixed;inset:0;z-index:12000;display:grid;place-items:center;padding:20px;background:rgba(11,30,59,.60);backdrop-filter:blur(5px)}.plus-merit-modal__card{width:min(500px,100%);padding:28px;border-radius:24px;background:#fff;box-shadow:0 30px 90px rgba(0,0,0,.28);text-align:center}.plus-merit-modal__icon{display:grid;place-items:center;width:68px;height:68px;margin:0 auto;border-radius:22px;background:linear-gradient(135deg,#7c3aed,#f2c94c);font-size:32px}.plus-merit-modal h2{margin:16px 0 8px;color:#17213a;font-size:24px}.plus-merit-modal p{margin:0;color:#64748b;line-height:1.6}.plus-merit-modal__stats{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:17px 0}.plus-merit-modal__stats span{padding:7px 10px;border-radius:999px;background:#f4f6fa;color:#40516b;font-size:11px;font-weight:800}.plus-merit-modal__actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:20px}.plus-merit-modal__actions button,.plus-merit-modal__actions a{min-height:42px;padding:0 16px;border:0;border-radius:12px;font:inherit;font-weight:850;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}.plus-merit-modal__actions button{background:#eef2f7;color:#334155}.plus-merit-modal__actions a{background:#4f46e5;color:#fff}
      @media(max-width:680px){.plus-merit-now{grid-template-columns:1fr}.plus-merit-next__head{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(style);
  }

  async function getClient() {
    if (window.menteSupabase) return window.menteSupabase;
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => { if (!settled) { settled = true; resolve(window.menteSupabase || null); } };
      window.addEventListener("mente:supabase-ready", finish, { once: true });
      setTimeout(finish, 1800);
    });
  }

  function renderLiveAccess(row) {
    if (document.body.dataset.page !== "plus") return;
    document.querySelector(".plus-merit-live")?.remove();
    if (!row?.plus_ativo || !row.plus_expira_em) return;
    const actions = document.querySelector(".plus-hero__actions");
    if (!actions) return;
    const banner = document.createElement("div");
    banner.className = "plus-merit-live";
    const date = formatDate(row.plus_expira_em);
    const origin = row.plus_origem;
    if (origin === "teste") {
      banner.innerHTML = `⏳ <strong>Seu teste Plus está em andamento.</strong> Você pode usar os recursos premium até ${esc(date)}. Continue estudando: conquistas por mérito podem acrescentar novos dias ao seu acesso.`;
    } else if (origin === "merito") {
      banner.innerHTML = `🏆 <strong>Seu M.E.N.T.E Plus foi conquistado por mérito.</strong> O acesso está liberado até ${esc(date)}.`;
    } else {
      banner.innerHTML = `★ <strong>M.E.N.T.E Plus ativo.</strong> Seu acesso premium está liberado até ${esc(date)}.`;
    }
    actions.insertAdjacentElement("afterend", banner);
  }

  function renderProgress(row) {
    const root = document.querySelector("#plus-merit-progress");
    if (!root || !row) return;
    const level = Number(row.plus_merito_nivel || 0);
    const points = Number(row.pontos || 0);
    const streak = Number(row.sequencia || 0);
    const next = MILESTONES.find((item) => item.level > level);

    const current = `<div class="plus-merit-now">
      <article class="plus-merit-stat"><small>Seus pontos</small><strong>${points}</strong></article>
      <article class="plus-merit-stat"><small>Sua sequência</small><strong>${streak} dia${streak === 1 ? "" : "s"}</strong></article>
      <article class="plus-merit-stat"><small>Nível de mérito</small><strong>${level}/3</strong></article>
    </div>`;

    if (!next) {
      root.innerHTML = `${current}<div class="plus-merit-done">🏆 Você já conquistou todos os marcos de mérito disponíveis. Continue estudando para manter sua evolução.</div>`;
      return;
    }

    const streakPct = Math.min(100, Math.round((streak / next.streak) * 100));
    const pointsPct = Math.min(100, Math.round((points / next.points) * 100));
    root.innerHTML = `${current}<div class="plus-merit-next">
      <div class="plus-merit-next__head"><strong>Próxima recompensa: +${next.reward} dias de Plus</strong><span>${esc(next.label)}</span></div>
      <div class="plus-merit-bars">
        <div class="plus-merit-bar"><label><span>🔥 Sequência de estudo</span><b>${streak}/${next.streak} dias</b></label><div class="plus-merit-track"><span style="width:${streakPct}%"></span></div></div>
        <div class="plus-merit-bar"><label><span>⭐ Pontos acumulados</span><b>${points}/${next.points}</b></label><div class="plus-merit-track"><span style="width:${pointsPct}%"></span></div></div>
      </div>
    </div>`;
  }

  async function confirmNotification(client) {
    try { await client.rpc("mente_plus_confirmar_notificacao_merito"); } catch {}
  }

  function showReward(row, client) {
    if (!row?.plus_merito_mensagem || document.querySelector("#plus-merit-modal")) return;
    const modal = document.createElement("div");
    modal.id = "plus-merit-modal";
    modal.className = "plus-merit-modal";
    modal.innerHTML = `<div class="plus-merit-modal__card" role="dialog" aria-modal="true" aria-labelledby="plus-merit-title">
      <div class="plus-merit-modal__icon">🏆</div>
      <h2 id="plus-merit-title">Você ganhou M.E.N.T.E Plus!</h2>
      <p>${esc(row.plus_merito_mensagem)}</p>
      <div class="plus-merit-modal__stats"><span>🔥 ${Number(row.sequencia || 0)} dias</span><span>⭐ ${Number(row.pontos || 0)} pontos</span><span>★ Mérito ${Number(row.plus_merito_nivel || 0)}/3</span></div>
      <div class="plus-merit-modal__actions"><button type="button" data-merit-close>Continuar estudando</button><a href="plus.html" data-merit-go>Ver meu Plus →</a></div>
    </div>`;
    document.body.appendChild(modal);

    const close = async (navigate = false) => {
      await confirmNotification(client);
      modal.remove();
      if (navigate) location.href = "plus.html";
    };
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-merit-close]")) close(false);
      if (event.target.closest("[data-merit-go]")) { event.preventDefault(); close(true); }
    });
  }

  async function refresh() {
    if (running) return;
    running = true;
    try {
      ensureStyles();
      const client = await getClient();
      if (!client) return;
      const { data, error } = await client.rpc("mente_plus_status");
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) return;
      lastStatus = row;
      renderProgress(row);
      renderLiveAccess(row);
      showReward(row, client);

      if (window.MENTE_PLUS?.isActive && Boolean(row.plus_ativo) !== Boolean(window.MENTE_PLUS.isActive())) {
        window.MENTE_PLUS.refresh?.();
      }
    } catch (error) {
      console.warn("[M.E.N.T.E Plus Mérito]", error);
    } finally {
      running = false;
    }
  }

  ensureStyles();
  window.addEventListener("mente:plan-updated", () => {
    if (lastStatus) {
      setTimeout(() => { renderProgress(lastStatus); renderLiveAccess(lastStatus); }, 0);
    }
  });
  window.addEventListener("mente:supabase-ready", () => setTimeout(refresh, 120), { once: true });
  window.addEventListener("load", () => setTimeout(refresh, 350), { once: true });
  setTimeout(refresh, 900);
})();
