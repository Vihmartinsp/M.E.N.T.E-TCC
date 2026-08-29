"use strict";

(() => {
  const client = window.menteSupabase;
  if (!client) return;

  const POINTS_KEY = "mente-points";
  const ANSWERS_KEY = "mente-answers";
  const USER_KEY = "mente-demo-user";

  async function refreshAccountState() {
    try {
      const { data: sessionData } = await client.auth.getSession();
      const user = sessionData.session?.user || null;
      if (!user) {
        localStorage.removeItem(POINTS_KEY);
        document.querySelectorAll(".score strong, #points, #global-points").forEach((el) => { el.textContent = "0"; });
        return;
      }

      const [{ data: profile }, { data: responses }] = await Promise.all([
        client.from("profiles").select("nome,pontos,sequencia").eq("id", user.id).single(),
        client.from("respostas").select("questao_id,alternativa,acertou,respondida_em").eq("user_id", user.id),
      ]);

      if (profile) {
        const points = Math.max(0, Number(profile.pontos) || 0);
        localStorage.setItem(POINTS_KEY, String(points));
        document.querySelectorAll(".score strong, #points, #global-points").forEach((el) => { el.textContent = String(points); });
        const name = profile.nome || user.user_metadata?.name || user.email?.split("@")[0] || "Aluno";
        localStorage.setItem(USER_KEY, JSON.stringify({ id: user.id, email: user.email, name, source: "supabase" }));
        const nameEl = document.querySelector("#user-name");
        const avatarEl = document.querySelector("#user-avatar");
        if (nameEl) nameEl.textContent = name;
        if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
        const streak = document.querySelector(".mente-streak");
        if (streak) {
          const n = Math.max(0, Number(profile.sequencia) || 0);
          streak.textContent = `🔥 ${n} ${n === 1 ? "dia" : "dias"}`;
        }
      }

      const answers = {};
      (responses || []).forEach((row) => {
        answers[row.questao_id] = {
          selected: Number(row.alternativa),
          correct: Boolean(row.acertou),
          answeredAt: row.respondida_em,
          source: "supabase",
        };
      });
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
      if (typeof renderQuestions === "function") renderQuestions();
    } catch (error) {
      console.warn("[M.E.N.T.E] Não foi possível atualizar o estado final da conta:", error);
    }
  }

  [500, 1400, 2800].forEach((delay) => setTimeout(refreshAccountState, delay));
})();
