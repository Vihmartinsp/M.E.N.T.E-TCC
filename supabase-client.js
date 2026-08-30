"use strict";

const SUPABASE_URL = "https://jburhxxubqfvayfnahku.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qJMnLXr00ksVZNc6p65wJA_LzTD0t6M";

if (!window.supabase?.createClient) {
  console.warn("[M.E.N.T.E] Biblioteca do Supabase não foi carregada. O site seguirá com os dados locais.");
  window.menteSupabase = null;
} else {
  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
  );

  // Várias páginas do M.E.N.T.E consultam a sessão ao mesmo tempo.
  // Compartilhar a mesma promessa evita concorrência desnecessária no Auth
  // e também impede que uma consulta de sessão deixe a interface presa para sempre.
  const originalGetSession = client.auth.getSession.bind(client.auth);
  let sharedSessionPromise = null;

  client.auth.getSession = () => {
    if (!sharedSessionPromise) {
      let timer;
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("A sessão do Supabase demorou para responder.")), 6500);
      });

      sharedSessionPromise = Promise.race([originalGetSession(), timeout])
        .finally(() => {
          clearTimeout(timer);
          sharedSessionPromise = null;
        });
    }
    return sharedSessionPromise;
  };

  window.menteSupabase = client;
  window.menteSupabaseConfig = {
    url: SUPABASE_URL,
    connected: true,
    initializedAt: new Date().toISOString(),
  };
}
