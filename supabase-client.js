"use strict";

(() => {
  const SUPABASE_URL = "https://jburhxxubqfvayfnahku.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qJMnLXr00ksVZNc6p65wJA_LzTD0t6M";
  const MAX_ATTEMPTS = 40;
  const RETRY_MS = 250;
  let attempts = 0;
  let stopped = false;

  function announceReady() {
    try { window.dispatchEvent(new CustomEvent("mente:supabase-ready")); } catch {}
  }

  function initialize() {
    if (stopped || window.menteSupabase) return;

    if (window.supabase?.createClient) {
      window.menteSupabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        },
      );

      window.menteSupabaseConfig = {
        url: SUPABASE_URL,
        project: "M.E.N.T.E 2",
        projectRef: "jburhxxubqfvayfnahku",
        connected: true,
        initializedAt: new Date().toISOString(),
      };

      announceReady();
      return;
    }

    attempts += 1;
    if (attempts < MAX_ATTEMPTS) {
      setTimeout(initialize, RETRY_MS);
      return;
    }

    window.menteSupabase = null;
    window.menteSupabaseConfig = {
      url: SUPABASE_URL,
      project: "M.E.N.T.E 2",
      projectRef: "jburhxxubqfvayfnahku",
      connected: false,
      initializedAt: new Date().toISOString(),
    };
    try { window.dispatchEvent(new CustomEvent("mente:supabase-unavailable")); } catch {}
    console.warn("[M.E.N.T.E] Biblioteca do Supabase não foi carregada após as tentativas. O site seguirá com os dados locais.");
  }

  window.addEventListener("beforeunload", () => { stopped = true; });
  initialize();
})();
