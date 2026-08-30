"use strict";

(() => {
  const client = window.menteSupabase;
  const loading = document.querySelector("#admin-loading");
  const denied = document.querySelector("#admin-denied");
  const content = document.querySelector("#admin-content");
  const sync = document.querySelector("#admin-sync-status");

  if (!loading || !content) return;

  // A tela de acesso restrito nunca é exibida. Usuários sem permissão são
  // redirecionados em vez de receber uma segunda interface dentro do painel.
  if (denied) {
    denied.hidden = true;
    denied.style.display = "none";
  }

  function setSync(text, state = "loading") {
    if (!sync) return;
    sync.dataset.state = state;
    const label = sync.querySelector(".admin-sync-status__text");
    if (label) label.textContent = text;
  }

  // IMPORTANTE: não observar/mutar #admin-denied aqui.
  // A versão anterior criava um ciclo de MutationObserver que podia travar
  // completamente a aba do navegador.
  const contentObserver = new MutationObserver(() => {
    if (!content.hidden) {
      loading.hidden = true;
      setSync("Dados sincronizados", "ok");
      contentObserver.disconnect();
    }
  });
  contentObserver.observe(content, { attributes: true, attributeFilter: ["hidden"] });

  const slowTimer = setTimeout(() => {
    if (!content.hidden) return;
    setSync("Sincronização mais lenta", "slow");
    loading.hidden = false;
    const strong = loading.querySelector("strong");
    const span = loading.querySelector("span");
    if (strong) strong.textContent = "Atualizando dados...";
    if (span) span.textContent = "O painel continua disponível enquanto o Supabase responde.";
  }, 6000);

  async function withTimeout(promise, ms = 8000) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Tempo limite da validação administrativa.")), ms);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timer);
    }
  }

  async function enforceSuperAdmin() {
    if (!client) {
      setSync("Banco indisponível", "slow");
      return;
    }

    try {
      const { data: sessionData, error: sessionError } = await withTimeout(client.auth.getSession());
      if (sessionError) throw sessionError;

      const user = sessionData.session?.user;
      if (!user) {
        location.replace("./login.html");
        return;
      }

      const { data, error } = await withTimeout(
        client.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
      );
      if (error) throw error;

      if (data?.role !== "super_admin") {
        location.replace("./questoes.html");
        return;
      }

      document.body.dataset.adminVerified = "true";
    } catch (error) {
      console.warn("[M.E.N.T.E Admin] Validação administrativa demorou:", error);
      setSync("Validando conta...", "slow");
    }
  }

  enforceSuperAdmin();

  // Atualização leve: no máximo uma vez por minuto e somente com a aba visível.
  const autoRefreshTimer = setInterval(() => {
    if (content.hidden || document.visibilityState !== "visible") return;
    const refreshButton = document.querySelector("#admin-refresh");
    if (!refreshButton || refreshButton.disabled) return;

    setSync("Atualizando dados...", "loading");
    refreshButton.click();

    setTimeout(() => {
      if (!content.hidden) setSync("Dados sincronizados", "ok");
    }, 2500);
  }, 60000);

  window.addEventListener("beforeunload", () => {
    clearTimeout(slowTimer);
    clearInterval(autoRefreshTimer);
    contentObserver.disconnect();
  }, { once: true });
})();
