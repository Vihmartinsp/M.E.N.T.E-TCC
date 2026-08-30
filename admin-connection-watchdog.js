"use strict";

(() => {
  const client = window.menteSupabase;
  const loading = document.querySelector("#admin-loading");
  const denied = document.querySelector("#admin-denied");
  const content = document.querySelector("#admin-content");
  const topbar = document.querySelector(".admin-topbar");
  const brand = document.querySelector(".admin-brand");
  const eyebrow = document.querySelector(".admin-topbar p");

  if (!loading || !denied || !content) return;

  if (brand) {
    brand.innerHTML = '<strong class="admin-brand__solo">Painel administrativo</strong>';
    brand.setAttribute("aria-label", "Painel administrativo");
  }
  if (eyebrow) eyebrow.textContent = "M.E.N.T.E";

  denied.hidden = true;
  denied.style.display = "none";

  let sync = document.querySelector("#admin-sync-status");
  if (!sync && topbar) {
    sync = document.createElement("div");
    sync.id = "admin-sync-status";
    sync.className = "admin-sync-status";
    sync.innerHTML = '<span class="admin-sync-status__dot"></span><span class="admin-sync-status__text">Sincronizando...</span>';
    const account = topbar.querySelector(".admin-account");
    if (account) account.before(sync);
    else topbar.appendChild(sync);
  }

  function setSync(text, state = "loading") {
    if (!sync) return;
    sync.dataset.state = state;
    const label = sync.querySelector(".admin-sync-status__text");
    if (label) label.textContent = text;
  }

  function compactLoading() {
    loading.classList.add("admin-loading--compact");
    loading.innerHTML = '<div class="admin-spinner admin-spinner--small"></div><div><strong>Atualizando dados...</strong><span>Sincronização automática com o Supabase</span></div>';
  }

  compactLoading();

  if (!document.querySelector("#admin-polish-styles")) {
    const style = document.createElement("style");
    style.id = "admin-polish-styles";
    style.textContent = `
      .admin-brand{min-height:62px;align-items:center!important;padding:10px 9px 20px!important}
      .admin-brand__solo{font-size:16px!important;letter-spacing:0!important;line-height:1.25}
      .admin-topbar{gap:14px}
      .admin-sync-status{display:inline-flex;align-items:center;gap:7px;margin-left:auto;margin-right:2px;padding:7px 10px;border:1px solid #dce6f3;border-radius:999px;background:#f7faff;color:#5f7188;font-size:10px;font-weight:800;white-space:nowrap}
      .admin-sync-status__dot{width:7px;height:7px;border-radius:50%;background:#2d7aeb;box-shadow:0 0 0 3px rgba(45,122,235,.10);animation:adminSyncPulse 1.35s ease-in-out infinite}
      .admin-sync-status[data-state="ok"]{color:#18724f;border-color:#cdebdc;background:#f4fbf7}
      .admin-sync-status[data-state="ok"] .admin-sync-status__dot{background:#22a06b;box-shadow:0 0 0 3px rgba(34,160,107,.10);animation:none}
      .admin-sync-status[data-state="slow"]{color:#8b6500;border-color:#f0dfaa;background:#fffaf0}
      .admin-loading--compact{display:flex!important;min-height:0!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;margin:0 0 18px!important;padding:10px 13px!important;border:1px solid #e1e8f1!important;border-radius:11px!important;background:#fff!important;text-align:left!important}
      .admin-loading--compact[hidden]{display:none!important}
      .admin-loading--compact .admin-spinner--small{width:20px!important;height:20px!important;border-width:3px!important;flex:none}
      .admin-loading--compact strong,.admin-loading--compact span{display:block}
      .admin-loading--compact strong{font-size:11px}
      .admin-loading--compact span{margin-top:2px;color:#8290a3;font-size:9px}
      #admin-denied{display:none!important}
      @keyframes adminSyncPulse{0%,100%{opacity:.38;transform:scale(.88)}50%{opacity:1;transform:scale(1.08)}}
      @media(max-width:780px){.admin-sync-status{display:none}}
    `;
    document.head.appendChild(style);
  }

  const contentObserver = new MutationObserver(() => {
    if (!content.hidden) {
      loading.hidden = true;
      setSync("Dados sincronizados", "ok");
    }
  });
  contentObserver.observe(content, { attributes: true, attributeFilter: ["hidden"] });

  const deniedObserver = new MutationObserver(() => {
    denied.hidden = true;
    denied.style.display = "none";
  });
  deniedObserver.observe(denied, { attributes: true, attributeFilter: ["hidden", "style"] });

  const slowTimer = setTimeout(() => {
    if (content.hidden) {
      setSync("Sincronização mais lenta", "slow");
      loading.hidden = false;
      compactLoading();
      const strong = loading.querySelector("strong");
      const span = loading.querySelector("span");
      if (strong) strong.textContent = "Sincronização em andamento...";
      if (span) span.textContent = "Você pode aguardar alguns segundos; os dados serão atualizados automaticamente.";
    }
  }, 7000);

  async function enforceSuperAdmin() {
    if (!client) {
      location.replace("./questoes.html");
      return;
    }

    try {
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user) {
        location.replace("./login.html");
        return;
      }

      const { data, error } = await client
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (data?.role !== "super_admin") {
        location.replace("./questoes.html");
        return;
      }

      document.body.dataset.adminVerified = "true";
      denied.hidden = true;
      denied.style.display = "none";
    } catch (error) {
      console.warn("[M.E.N.T.E Admin] Não foi possível validar o Super Admin.", error);
      setSync("Validando conta...", "slow");
    }
  }

  enforceSuperAdmin();

  // Atualiza as estatísticas em segundo plano a cada minuto enquanto o painel estiver aberto.
  const autoRefreshTimer = setInterval(() => {
    if (content.hidden || document.visibilityState !== "visible") return;
    const refreshButton = document.querySelector("#admin-refresh");
    if (!refreshButton || refreshButton.disabled) return;

    setSync("Atualizando dados...", "loading");
    refreshButton.click();

    setTimeout(() => {
      if (!content.hidden) setSync("Dados sincronizados", "ok");
    }, 3000);
  }, 60000);

  window.addEventListener("beforeunload", () => {
    clearTimeout(slowTimer);
    clearInterval(autoRefreshTimer);
    contentObserver.disconnect();
    deniedObserver.disconnect();
  }, { once: true });
})();
