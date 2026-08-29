"use strict";

(() => {
  const client = window.menteSupabase;
  if (!client) return;

  const ANSWERS_KEY = "mente-answers";
  const POINTS_KEY = "mente-points";
  const USER_KEY = "mente-demo-user";
  const REVIEW_COST = 15;
  let currentUser = null;
  let currentProfile = null;
  let answeredIds = new Set();
  let unlockedReviewIds = new Set();

  function injectStyles() {
    if (document.querySelector("#mente-gamification-styles")) return;
    const style = document.createElement("style");
    style.id = "mente-gamification-styles";
    style.textContent = `
      .topbar__actions{position:relative}
      .user-menu{cursor:pointer}
      .mente-account-menu{position:absolute;right:0;top:calc(100% + 10px);z-index:1200;width:205px;padding:8px;background:#fff;border:1px solid #e3e9f1;border-radius:14px;box-shadow:0 16px 42px rgba(20,37,63,.16)}
      .mente-account-menu[hidden]{display:none!important}
      .mente-account-menu a,.mente-account-menu button{display:flex;width:100%;align-items:center;gap:10px;padding:11px 12px;border:0;border-radius:9px;background:transparent;color:#25364f;font:inherit;font-size:13px;font-weight:700;text-decoration:none;text-align:left;cursor:pointer}
      .mente-account-menu a:hover,.mente-account-menu button:hover{background:#f3f6fa}
      .mente-account-menu button{color:#b42318}
      .mente-streak{display:inline-flex;align-items:center;gap:5px;margin-left:8px;padding:6px 9px;border:1px solid #e8edf4;border-radius:999px;background:#fff;color:#4b5f7c;font-size:11px;font-weight:800;white-space:nowrap}
      .question-card.is-guest-locked{position:relative;overflow:hidden}
      .question-card.is-guest-locked::after{content:"🔒 Crie sua conta para desbloquear";position:absolute;inset:auto 12px 12px 12px;padding:9px 11px;border-radius:9px;background:rgba(20,37,63,.94);color:#fff;font-size:11px;font-weight:800;text-align:center;pointer-events:none}
      .question-card.is-guest-locked .question-card__footer button{opacity:.35}
      .mente-review-state{display:inline-flex;align-items:center;gap:5px;margin:8px 0 0;padding:5px 8px;border-radius:999px;background:#fff7ed;color:#9a4b00;font-size:10px;font-weight:800}
      .mente-gate{max-width:650px;margin:42px auto;padding:34px;border:1px solid #dfe7f1;border-radius:22px;background:#fff;box-shadow:0 18px 44px rgba(31,50,80,.09);text-align:center}
      .mente-gate__icon{font-size:42px;margin-bottom:10px}.mente-gate h2{margin:0 0 10px;color:#1f3048}.mente-gate p{max-width:520px;margin:0 auto 18px;color:#66768e;line-height:1.65}
      .mente-gate__points{display:inline-flex;margin:0 0 18px;padding:8px 12px;border-radius:999px;background:#f5f8fc;color:#334862;font-weight:800;font-size:12px}
      .mente-gate__actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.mente-gate__actions a,.mente-gate__actions button{padding:11px 17px;border:0;border-radius:10px;background:#2f7df6;color:white;font-weight:800;text-decoration:none;cursor:pointer}.mente-gate__actions .secondary{background:#eef3f9;color:#334862}
      .mente-toast{position:fixed;right:22px;bottom:22px;z-index:2000;max-width:360px;padding:14px 16px;border-radius:14px;background:#183153;color:#fff;box-shadow:0 16px 38px rgba(10,25,48,.22);font-size:13px;line-height:1.45;font-weight:700;animation:menteToastIn .2s ease-out}
      @keyframes menteToastIn{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
      @media(max-width:720px){.mente-streak{display:none}.mente-account-menu{right:6px}.mente-gate{margin:24px 14px;padding:26px 18px}}
    `;
    document.head.appendChild(style);
  }

  function toast(message) {
    document.querySelector(".mente-toast")?.remove();
    const el = document.createElement("div");
    el.className = "mente-toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4800);
  }

  function updatePoints(points) {
    const value = Math.max(0, Number(points) || 0);
    localStorage.setItem(POINTS_KEY, String(value));
    document.querySelectorAll(".score strong, #points, #global-points").forEach((el) => { el.textContent = String(value); });
  }

  function updateStreak(sequence) {
    const actions = document.querySelector(".topbar__actions");
    if (!actions) return;
    let badge = actions.querySelector(".mente-streak");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "mente-streak";
      const score = actions.querySelector(".score");
      if (score) score.after(badge); else actions.prepend(badge);
    }
    const n = Math.max(0, Number(sequence) || 0);
    badge.textContent = `🔥 ${n} ${n === 1 ? "dia" : "dias"}`;
    badge.title = "Sequência diária de acesso";
  }

  async function logout() {
    try { await client.auth.signOut(); } catch {}
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(POINTS_KEY);
    localStorage.removeItem(ANSWERS_KEY);
    window.location.replace("./login.html");
  }

  function setupAccountMenu() {
    const button = document.querySelector(".user-menu");
    if (!button || button.dataset.menteMenuReady === "1") return;
    button.dataset.menteMenuReady = "1";
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");

    const menu = document.createElement("div");
    menu.className = "mente-account-menu";
    menu.hidden = true;
    menu.innerHTML = `
      <a href="./desempenho.html" role="menuitem"><span>◉</span> Acessar perfil</a>
      <button type="button" data-mente-logout role="menuitem"><span>↪</span> Sair da conta</button>`;
    button.parentElement?.appendChild(menu);

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      menu.hidden = !menu.hidden;
      button.setAttribute("aria-expanded", String(!menu.hidden));
    });
    menu.querySelector("[data-mente-logout]")?.addEventListener("click", logout);
    document.addEventListener("click", () => {
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
    });
  }

  function localQuestionById(id) {
    if (typeof questions !== "undefined") return questions.find((q) => Number(q.id) === Number(id));
    const modules = window.MENTE_FINAL_MODULES || {};
    return Object.values(modules).flatMap((m) => m?.questions || []).find((q) => Number(q.id) === Number(id));
  }

  function questionIdFromUrl() {
    const id = Number(new URLSearchParams(location.search).get("id"));
    if (id) return id;
    try { return Number(JSON.parse(localStorage.getItem("mente-selected-question") || "null")?.id) || 0; }
    catch { return 0; }
  }

  async function loadAccountState() {
    const { data } = await client.auth.getSession();
    currentUser = data.session?.user || null;
    window.menteCurrentUser = currentUser;

    if (!currentUser) {
      currentProfile = null;
      answeredIds = new Set();
      unlockedReviewIds = new Set();
      localStorage.removeItem(POINTS_KEY);
      updatePoints(0);
      updateStreak(0);
      return;
    }

    const [{ data: profile, error: profileError }, { data: responses, error: responsesError }, { data: unlocks, error: unlocksError }] = await Promise.all([
      client.from("profiles").select("nome,pontos,xp,nivel,sequencia,ultimo_bonus_diario,created_at").eq("id", currentUser.id).single(),
      client.from("respostas").select("questao_id,alternativa,acertou,respondida_em,pontos_ganhos").eq("user_id", currentUser.id),
      client.from("revisoes_desbloqueadas").select("questao_id").eq("user_id", currentUser.id),
    ]);
    if (profileError) throw profileError;
    if (responsesError) throw responsesError;
    if (unlocksError) throw unlocksError;

    currentProfile = profile;
    answeredIds = new Set((responses || []).map((row) => Number(row.questao_id)));
    unlockedReviewIds = new Set((unlocks || []).map((row) => Number(row.questao_id)));

    const dbAnswers = {};
    (responses || []).forEach((row) => {
      dbAnswers[row.questao_id] = {
        selected: Number(row.alternativa),
        correct: Boolean(row.acertou),
        answeredAt: row.respondida_em,
        source: "supabase",
      };
    });
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(dbAnswers));
    updatePoints(profile.pontos);
    updateStreak(profile.sequencia);
    window.menteDbProfile = { ...(window.menteDbProfile || {}), ...profile };
  }

  async function claimDailyBonus() {
    if (!currentUser) return;
    const { data, error } = await client.rpc("resgatar_bonus_diario");
    if (error) throw error;
    const result = Array.isArray(data) ? data[0] : data;
    if (!result) return;
    currentProfile = { ...(currentProfile || {}), pontos: result.pontos_totais, sequencia: result.sequencia_atual };
    updatePoints(result.pontos_totais);
    updateStreak(result.sequencia_atual);
    if (result.status === "resgatado") {
      toast(`🔥 Sequência de ${result.sequencia_atual} dia(s)! +${result.pontos_recebidos} pontos pelo acesso de hoje.`);
    } else if (result.status === "conta_nova") {
      toast("🌱 Conta criada! Você começa com 0 pontos. Volte amanhã para iniciar sua sequência diária.");
    }
  }

  function showGuestInterestModal() {
    let modal = document.querySelector("#mente-guest-interest");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "mente-guest-interest";
      modal.style.cssText = "position:fixed;inset:0;z-index:2200;background:rgba(15,28,48,.62);display:grid;place-items:center;padding:20px";
      modal.innerHTML = `<div class="mente-gate" style="margin:0;max-width:540px"><div class="mente-gate__icon">🔒</div><h2>Desbloqueie a experiência completa</h2><p>Como visitante, você pode experimentar as questões de nível 1. Criando uma conta gratuita, você libera todos os níveis, ganha pontos, constrói sequência diária e acompanha seu progresso.</p><div class="mente-gate__actions"><a href="./login.html">Criar conta / Entrar</a><button class="secondary" type="button" data-close>Continuar explorando</button></div></div>`;
      document.body.appendChild(modal);
      modal.querySelector("[data-close]").onclick = () => { modal.style.display = "none"; };
      modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
    }
    modal.style.display = "grid";
  }

  function decorateCatalog() {
    const cards = document.querySelectorAll(".question-card");
    if (!cards.length) return;
    cards.forEach((card) => {
      const button = card.querySelector("[data-question-id]");
      if (!button) return;
      const id = Number(button.dataset.questionId);
      const q = localQuestionById(id);
      if (!q) return;
      card.classList.remove("is-guest-locked");
      button.removeAttribute("data-guest-locked");
      card.querySelector(".mente-review-state")?.remove();

      if (!currentUser) {
        if (Number(q.stars || q.nivel || 1) > 1) {
          card.classList.add("is-guest-locked");
          button.dataset.guestLocked = "1";
          button.innerHTML = "🔒 Desbloquear <span aria-hidden=\"true\">→</span>";
        }
        return;
      }

      if (answeredIds.has(id)) {
        const state = document.createElement("span");
        state.className = "mente-review-state";
        if (unlockedReviewIds.has(id)) {
          state.textContent = "🔓 Revisão desbloqueada";
          button.innerHTML = "Revisar <span aria-hidden=\"true\">→</span>";
        } else {
          state.textContent = `🔒 Revisar por ${REVIEW_COST} pts`;
          button.innerHTML = `Revisar · ${REVIEW_COST} pts <span aria-hidden=\"true\">→</span>`;
        }
        card.querySelector(".question-card__footer")?.before(state);
      }
    });
  }

  async function gateCurrentQuestion() {
    const root = document.querySelector("#question-content");
    if (!root) return;
    const id = questionIdFromUrl();
    if (!id) return;
    const q = localQuestionById(id);
    if (!q) return;

    if (!currentUser && Number(q.stars || q.nivel || 1) > 1) {
      root.innerHTML = `<section class="mente-gate"><div class="mente-gate__icon">🔒</div><h2>Esta questão é exclusiva para alunos cadastrados</h2><p>Você pode testar gratuitamente as questões de nível 1. Entre ou crie sua conta para liberar os níveis seguintes, pontuação, sequência diária e progresso salvo.</p><div class="mente-gate__actions"><a href="./login.html">Criar conta / Entrar</a><a class="secondary" href="./questoes.html">Voltar às questões</a></div></section>`;
      return;
    }

    if (!currentUser || !answeredIds.has(id) || unlockedReviewIds.has(id)) return;

    const { data: response } = await client.from("respostas").select("respondida_em").eq("user_id", currentUser.id).eq("questao_id", id).maybeSingle();
    const answeredAt = response?.respondida_em ? Date.parse(response.respondida_em) : 0;
    const justAnswered = answeredAt && Date.now() - answeredAt < 2 * 60 * 1000;
    if (justAnswered) return;

    root.innerHTML = `<section class="mente-gate"><div class="mente-gate__icon">🔐</div><h2>Revisão bloqueada</h2><p>Você já resolveu esta questão. Use seus pontos para desbloquear a revisão e consultar novamente a resolução detalhada sempre que quiser.</p><span class="mente-gate__points">⭐ Você tem ${Number(currentProfile?.pontos || 0)} pontos · custo ${REVIEW_COST}</span><div class="mente-gate__actions"><button type="button" data-unlock-review="${id}">Desbloquear revisão por ${REVIEW_COST} pts</button><a class="secondary" href="./questoes.html">Voltar</a></div></section>`;
  }

  async function unlockReview(id, button) {
    button.disabled = true;
    button.textContent = "Desbloqueando...";
    const { data, error } = await client.rpc("desbloquear_revisao", { p_questao_id: Number(id) });
    if (error) {
      button.disabled = false;
      button.textContent = `Desbloquear revisão por ${REVIEW_COST} pts`;
      toast("Não foi possível desbloquear a revisão agora.");
      return;
    }
    const result = Array.isArray(data) ? data[0] : data;
    if (result?.desbloqueada) {
      unlockedReviewIds.add(Number(id));
      currentProfile.pontos = result.pontos_restantes;
      updatePoints(result.pontos_restantes);
      toast(`🔓 Revisão desbloqueada! Restam ${result.pontos_restantes} pontos.`);
      location.reload();
      return;
    }
    button.disabled = false;
    if (result?.status === "pontos_insuficientes") {
      button.textContent = `Faltam ${Math.max(0, REVIEW_COST - Number(result.pontos_restantes || 0))} pontos`;
      toast(`Você tem ${result.pontos_restantes} pontos. Resolva questões ou mantenha sua sequência diária para conquistar mais.`);
    } else {
      button.textContent = `Desbloquear revisão por ${REVIEW_COST} pts`;
    }
  }

  function updateProfilePage() {
    if (document.body.dataset.page !== "desempenho" || !currentUser || !currentProfile) return;
    const stats = document.querySelectorAll(".profile-summary .profile-stat");
    if (stats[0]) {
      stats[0].querySelector("strong") && (stats[0].querySelector("strong").textContent = String(currentProfile.pontos || 0));
      stats[0].querySelector("span") && (stats[0].querySelector("span").textContent = "pontos disponíveis");
    }
    if (stats[3]) {
      stats[3].querySelector("strong") && (stats[3].querySelector("strong").textContent = String(currentProfile.sequencia || 0));
      stats[3].querySelector("span") && (stats[3].querySelector("span").textContent = "dias na sequência diária");
    }
    const sync = document.querySelector(".profile-sync");
    if (sync) sync.innerHTML = `<div class="profile-sync__icon">☁</div><strong>Sincronizado com o Supabase</strong><p>Seus pontos, respostas, sequência diária e progresso ficam vinculados à sua conta.</p><small>Salvamento online ativo</small>`;
  }

  document.addEventListener("click", async (event) => {
    const locked = event.target.closest?.("[data-guest-locked]");
    if (locked) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showGuestInterestModal();
      return;
    }

    const unlockButton = event.target.closest?.("[data-unlock-review]");
    if (unlockButton) {
      event.preventDefault();
      await unlockReview(unlockButton.dataset.unlockReview, unlockButton);
      return;
    }

    const logoutButton = event.target.closest?.("#logout-button");
    if (logoutButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      await logout();
      return;
    }

    const answerButton = event.target.closest?.("#mente-final-answer");
    if (answerButton && !currentUser) {
      setTimeout(() => {
        localStorage.removeItem(POINTS_KEY);
        updatePoints(0);
        toast("Modo visitante: sua resposta foi corrigida, mas pontos e progresso só são salvos em uma conta.");
      }, 0);
    }
  }, true);

  const observer = new MutationObserver(() => {
    setupAccountMenu();
    decorateCatalog();
    updateProfilePage();
  });

  async function initialize() {
    injectStyles();
    observer.observe(document.documentElement, { childList: true, subtree: true });
    try {
      await loadAccountState();
      setupAccountMenu();
      if (currentUser) {
        await claimDailyBonus();
        await loadAccountState();
      }
      decorateCatalog();
      await gateCurrentQuestion();
      updateProfilePage();
      setTimeout(() => { decorateCatalog(); updateProfilePage(); }, 900);
      setTimeout(() => { decorateCatalog(); updateProfilePage(); }, 1800);
    } catch (error) {
      console.error("[M.E.N.T.E] Falha ao iniciar gamificação:", error);
    }
  }

  initialize();
})();
