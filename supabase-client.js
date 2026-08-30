"use strict";

const SUPABASE_URL = "https://jburhxxubqfvayfnahku.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qJMnLXr00ksVZNc6p65wJA_LzTD0t6M";

if (!window.supabase?.createClient) {
  console.warn("[M.E.N.T.E] Biblioteca do Supabase não foi carregada. O site seguirá com os dados locais.");
  window.menteSupabase = null;
} else {
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
    connected: true,
    initializedAt: new Date().toISOString(),
  };
}
