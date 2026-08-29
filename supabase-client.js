"use strict";

const SUPABASE_URL = "https://jburhxxubqfvayfnahku.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qJMnLXr00ksVZNc6p65wJA_LzTD0t6M";

if (!window.supabase?.createClient) {
  throw new Error("Biblioteca do Supabase não foi carregada.");
}

window.menteSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

if (!document.querySelector('script[data-mente-account-authority]')) {
  const authorityScript = document.createElement("script");
  authorityScript.src = "./account-state-authority.js?v=1";
  authorityScript.defer = true;
  authorityScript.dataset.menteAccountAuthority = "1";
  document.head.appendChild(authorityScript);
}
