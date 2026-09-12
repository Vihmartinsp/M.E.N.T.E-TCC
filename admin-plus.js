"use strict";

(() => {
  const client = window.menteSupabase;
  if (!client) return;

  let currentRole = "aluno";
  let profiles = [];

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const fmt = (value) => {
    const date = new Date(value || "");
    return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("pt-BR", { day:"2-digit", month:"2-digit", year:"numeric" }).format(date);
  };

  function ensureStyles() {
    if (document.querySelector("#admin-plus-styles")) return;
    const style = document.createElement("style");
    style.id = "admin-plus-styles";
    style.textContent = `
      .admin-plus-summary{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin:18px 0}.admin-plus-card{padding:18px;border:1px solid #dfe6ef;border-radius:16px;background:#fff}.admin-plus-card small{display:block;color:#7a8798;font-size:10px;font-weight:900;text-transform:uppercase}.admin-plus-card strong{display:block;margin-top:6px;color:#17213a;font-size:24px}.admin-plus-card span{display:block;margin-top:4px;color:#68758a;font-size:11px}.admin-plan-select{min-width:150px;height:36px;padding:0 28px 0 10px;border:1px solid #d9e2ec;border-radius:9px;background:#fff;color:#334155;font:inherit;font-size:11px;font-weight:700}.admin-plan-chip{display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;font-size:10px;font-weight:900}.admin-plan-chip--plus{background:#fff4bf;color:#725300}.admin-plan-chip--free{background:#eef2f7;color:#536174}.admin-origin{font-size:11px;font-weight:750;color:#5f6d82}.admin-plus-note{margin:14px 0;padding:12px 14px;border:1px solid #e5dcff;border-radius:12px;background:#faf8ff;color:#5b3fb7;font-size:12px;line-height:1.5}.admin-role-select option[value="professor"]{display:none!important}@media(max-width:1000px){.admin-plus-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.admin-plus-summary{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function removeProfessorUi() {
    document.querySelectorAll('option[value="professor"]').forEach((option) => option.remove());
    const team = document.querySelector('[data-tab-panel="team"]');
    if (!team) return;
    const intro = team.querySelector(".admin-intro p");
    if (intro) intro.textContent = "Como Super Admin, você pode transformar contas em aluno ou administrador sem alterar o código.";
    const explainer = team.querySelector(".role-explainer");
    if (explainer) explainer.innerHTML = '<div><strong>👨‍🎓 Aluno</strong><span>Usa a plataforma e acompanha o próprio progresso.</span></div><div><strong>◆ Admin</strong><span>Gerencia questões e acompanha os dados da plataforma.</span></div><div><strong>👑 Super Admin</strong><span>Controle total, planos e gerenciamento da equipe.</span></div>';
  }

  function scheduleRoleCleanup() {
    [80,450,1200].forEach((delay) => setTimeout(removeProfessorUi, delay));
  }

  async function loadRole() {
    const { data: sessionData } = await client.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;
    const { data } = await client.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
    currentRole = data?.role || "aluno";
  }

  async function loadProfiles() {
    const { data, error } = await client.from("profiles").select("id,nome,email,pontos,sequencia,plano,plus_iniciado_em,plus_expira_em,plus_teste_usado,plus_origem,plus_merito_nivel,plus_merito_conquistado_em,ultimo_acesso").order("created_at", { ascending:true });
    if (error) throw error;
    profiles = data || [];
  }

  const activePlus = (profile) => profile.plano === "plus" && (!profile.plus_expira_em || Date.parse(profile.plus_expira_em) > Date.now());
  const originLabel = (profile) => ({ teste:"Teste de 7 dias", merito:"Mérito", admin:"Admin" }[profile.plus_origem] || "—");

  function renderPanel() {
    const panel = document.querySelector('[data-tab-panel="plus-admin"]');
    if (!panel) return;
    const plus = profiles.filter(activePlus).length;
    const conventional = profiles.length - plus;
    const trials = profiles.filter((p) => p.plus_teste_usado).length;
    const merit = profiles.filter((p) => Number(p.plus_merito_nivel || 0) > 0).length;
    const expiring = profiles.filter((p) => activePlus(p) && p.plus_expira_em && Date.parse(p.plus_expira_em) - Date.now() < 7 * 86400000).length;

    panel.innerHTML = `
      <div class="admin-intro"><div><span class="admin-kicker">M.E.N.T.E Plus</span><h2>Planos, mérito e acessos</h2><p>Acompanhe os planos, os testes gratuitos e as recompensas Plus conquistadas pelo desempenho dos alunos.</p></div></div>
      <div class="admin-plus-summary">
        <article class="admin-plus-card"><small>Contas Plus</small><strong>${plus}</strong><span>acessos premium ativos</span></article>
        <article class="admin-plus-card"><small>Convencional</small><strong>${conventional}</strong><span>contas no plano gratuito</span></article>
        <article class="admin-plus-card"><small>Testes usados</small><strong>${trials}</strong><span>testes de 7 dias ativados</span></article>
        <article class="admin-plus-card"><small>Plus por mérito</small><strong>${merit}</strong><span>alunos que já alcançaram um marco</span></article>
        <article class="admin-plus-card"><small>Expiram em até 7 dias</small><strong>${expiring}</strong><span>acessos próximos do fim</span></article>
      </div>
      <div class="admin-plus-note">🏆 Mérito automático: 7 dias + 100 pontos = 3 dias Plus; 14 dias + 250 pontos = +7 dias; 30 dias + 500 pontos = +15 dias. As recompensas são liberadas pelo banco e não precisam de aprovação manual.</div>
      <article class="admin-panel admin-table-panel"><div class="admin-panel__head"><div><span>Controle de planos</span><h3>Usuários</h3></div><strong>${profiles.length} conta(s)</strong></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Pessoa</th><th>Plano</th><th>Origem</th><th>Mérito</th><th>Progresso</th><th>Expira em</th><th>Alterar plano</th></tr></thead><tbody>${profiles.map((p) => {
        const plusOn = activePlus(p);
        return `<tr><td><div class="admin-person"><span class="admin-person__avatar">${esc((p.nome || p.email || "A").slice(0,1).toUpperCase())}</span><div><strong>${esc(p.nome || "Aluno")}</strong><span>${esc(p.email || "—")}</span></div></div></td><td><span class="admin-plan-chip ${plusOn ? "admin-plan-chip--plus" : "admin-plan-chip--free"}">${plusOn ? "★ Plus" : "Convencional"}</span></td><td><span class="admin-origin">${esc(originLabel(p))}</span></td><td>${Number(p.plus_merito_nivel || 0)}/3</td><td>🔥 ${Number(p.sequencia || 0)} dias · ⭐ ${Number(p.pontos || 0)} pts</td><td>${fmt(p.plus_expira_em)}</td><td>${currentRole === "super_admin" ? `<select class="admin-plan-select" data-plan-user="${p.id}"><option value="convencional" ${plusOn ? "" : "selected"}>Convencional</option><option value="plus30" ${plusOn ? "selected" : ""}>Plus · 30 dias</option><option value="plus90">Plus · 90 dias</option></select>` : "Somente Super Admin"}</td></tr>`;
      }).join("")}</tbody></table></div></article>`;
  }

  function ensureTab() {
    const nav = document.querySelector(".admin-nav");
    const content = document.querySelector("#admin-content");
    if (!nav || !content) return false;
    let button = nav.querySelector('[data-admin-tab="plus-admin"]');
    let panel = content.querySelector('[data-tab-panel="plus-admin"]');
    if (!button) {
      button = document.createElement("button");
      button.className = "admin-nav__item";
      button.type = "button";
      button.dataset.adminTab = "plus-admin";
      button.innerHTML = '<span>★</span> M.E.N.T.E Plus';
      nav.appendChild(button);
      button.addEventListener("click", async () => {
        document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
        document.querySelectorAll("[data-tab-panel]").forEach((item) => { item.hidden = item.dataset.tabPanel !== "plus-admin"; });
        const title = document.querySelector("#admin-page-title"); if (title) title.textContent = "M.E.N.T.E Plus";
        try { await loadProfiles(); renderPanel(); } catch (error) { console.warn(error); }
      });
    }
    if (!panel) {
      panel = document.createElement("section");
      panel.className = "admin-tab";
      panel.dataset.tabPanel = "plus-admin";
      panel.hidden = true;
      content.appendChild(panel);
    }
    return true;
  }

  async function changePlan(select) {
    const userId = select.dataset.planUser;
    const value = select.value;
    select.disabled = true;
    try {
      const isPlus = value.startsWith("plus");
      const days = value === "plus90" ? 90 : 30;
      const { error } = await client.rpc("admin_definir_plano_usuario", { p_user:userId, p_plano:isPlus ? "plus" : "convencional", p_dias:days });
      if (error) throw error;
      await loadProfiles();
      renderPanel();
    } catch (error) {
      console.error(error);
      select.disabled = false;
      alert("Não foi possível alterar o plano agora.");
    }
  }

  document.addEventListener("change", (event) => {
    const planSelect = event.target.closest?.("[data-plan-user]");
    if (planSelect) changePlan(planSelect);
    if (event.target.closest?.("[data-role-user]")) scheduleRoleCleanup();
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest?.("#admin-refresh,[data-admin-tab='team']")) scheduleRoleCleanup();
  });

  async function init() {
    ensureStyles();
    await loadRole();
    if (!["admin","super_admin"].includes(currentRole)) return;
    ensureTab();
    scheduleRoleCleanup();
  }

  init().catch((error) => console.warn("[M.E.N.T.E Admin Plus]", error));
})();
