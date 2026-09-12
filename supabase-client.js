"use strict";

(() => {
  const SUPABASE_URL = "https://jburhxxubqfvayfnahku.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qJMnLXr00ksVZNc6p65wJA_LzTD0t6M";
  const FALLBACK_SRC = "https://unpkg.com/@supabase/supabase-js@2";
  const MAX_ATTEMPTS = 60;
  const RETRY_MS = 250;
  let attempts = 0;
  let stopped = false;
  let fallbackRequested = false;
  let fallbackFailed = false;

  function announce(name) {
    try { window.dispatchEvent(new CustomEvent(name)); } catch {}
  }

  function createClientIfPossible() {
    if (window.menteSupabase) return true;
    if (!window.supabase?.createClient) return false;

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
      sdkSource: fallbackRequested ? "fallback-or-primary" : "primary",
      initializedAt: new Date().toISOString(),
    };

    announce("mente:supabase-ready");
    return true;
  }

  function requestFallbackSdk() {
    if (fallbackRequested || window.supabase?.createClient || stopped) return;
    fallbackRequested = true;

    const script = document.createElement("script");
    script.src = FALLBACK_SRC;
    script.async = true;
    script.dataset.menteSupabaseFallback = "1";
    script.onload = () => {
      fallbackFailed = false;
      createClientIfPossible();
    };
    script.onerror = () => {
      fallbackFailed = true;
      console.warn("[M.E.N.T.E] O CDN reserva do Supabase também não respondeu.");
    };
    document.head.appendChild(script);
  }

  function initialize() {
    if (stopped || window.menteSupabase) return;
    if (createClientIfPossible()) return;

    attempts += 1;

    // Se o jsDelivr principal estiver lento/bloqueado, tenta uma segunda origem.
    if (attempts === 4) requestFallbackSdk();

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
      fallbackFailed,
      initializedAt: new Date().toISOString(),
    };
    announce("mente:supabase-unavailable");
    console.warn("[M.E.N.T.E] SDK do Supabase não carregou. O site continua com os dados locais e o teste REST independente.");
  }

  window.addEventListener("load", createClientIfPossible, { once: true });
  window.addEventListener("online", () => {
    if (!window.menteSupabase) {
      attempts = 0;
      fallbackRequested = false;
      fallbackFailed = false;
      initialize();
    }
  });
  window.addEventListener("beforeunload", () => { stopped = true; });
  initialize();
})();
