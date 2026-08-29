"use strict";

(() => {
  const client = window.menteSupabase;
  const statusEl = document.querySelector("#database-status");
  const ANSWERS_KEY = "mente-answers";
  const POINTS_KEY = "mente-points";
  const USER_KEY = "mente-demo-user";
  const TIMEOUT_MS = 7000;

  const categoryBySlug = {
    geometria: "Geometria",
    funcoes: "Funções",
    estatistica: "Estatística e Probabilidade",
    financeira: "Matemática Financeira",
    grandezas: "Grandezas e Medidas",
    graficos: "Gráficos e Tabelas",
  };

  const reviewSlug = {
    "Geometria": "geometria",
    "Funções": "funcoes",
    "Estatística e Probabilidade": "estatistica-probabilidade",
    "Matemática Financeira": "matematica-financeira",
    "Grandezas e Medidas": "grandezas-medidas",
    "Gráficos e Tabelas": "graficos-tabelas",
  };

  function withTimeout(promise, ms = TIMEOUT_MS, label = "Banco demorou para responder") {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(label)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  function setStatus(message, state = "loading") {
    window.menteDatabaseStatus = { state, message, checkedAt: new Date().toISOString() };
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.state = state;
  }

  function notify(name) {
    try { window.dispatchEvent(new CustomEvent(name)); } catch {}
  }

  function readLocalAnswers() {
    try { return JSON.parse(localStorage.getItem(ANSWERS_KEY) || "{}"); }
    catch { return {}; }
  }

  function writeLocalAnswers(answers) {
    try { localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers)); } catch {}
  }

  function saveProfileLocally(user, profile) {
    if (!user) return;
    const name = profile?.nome || user.user_metadata?.name || user.email?.split("@")[0] || "Aluno";
    const points = Math.max(0, Number(profile?.pontos ?? profile?.xp ?? 0) || 0);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify({ id: user.id, email: user.email, name, source: "supabase" }));
      localStorage.setItem(POINTS_KEY, String(points));
    } catch {}
    const nameEl = document.querySelector("#user-name");
    const avatarEl = document.querySelector("#user-avatar");
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
    document.querySelectorAll("#points,.score strong,#global-points").forEach((el) => { el.textContent = String(points); });
    window.menteDbProfile = { ...(profile || {}), pontos: points };
    notify("mente:account-updated");
  }

  async function getSessionUser() {
    const { data, error } = await withTimeout(client.auth.getSession(), 5000, "Sessão demorou para responder");
    if (error) throw error;
    return data.session?.user || null;
  }

  async function syncUserProgress(user) {
    if (!user) {
      window.menteDbAnsweredIds = new Set();
      notify("mente:account-updated");
      return;
    }

    const profilePromise = client.from("profiles").select("nome,pontos,xp,moedas,nivel,sequencia").eq("id", user.id).maybeSingle();
    const responsesPromise = client.from("respostas").select("questao_id,alternativa,acertou,respondida_em").eq("user_id", user.id);
    const [{ data: profile, error: profileError }, { data: responses, error: responseError }] = await withTimeout(
      Promise.all([profilePromise, responsesPromise]),
      TIMEOUT_MS,
      "Progresso demorou para sincronizar",
    );
    if (profileError) throw profileError;
    if (responseError) throw responseError;

    saveProfileLocally(user, profile || { nome: user.user_metadata?.name, pontos: 0, xp: 0, sequencia: 0 });
    const answers = {};
    const answeredIds = new Set();
    (responses || []).forEach((row) => {
      answeredIds.add(Number(row.questao_id));
      answers[row.questao_id] = {
        selected: Number(row.alternativa),
        correct: Boolean(row.acertou),
        answeredAt: row.respondida_em,
        source: "supabase",
      };
    });
    writeLocalAnswers(answers);
    window.menteDbAnsweredIds = answeredIds;
    notify("mente:account-updated");
  }

  function decorateCatalog() {
    document.querySelectorAll(".question-card").forEach((card) => {
      const button = card.querySelector("[data-question-id]");
      if (!button || typeof questions === "undefined") return;
      const question = questions.find((item) => item.id === Number(button.dataset.questionId));
      if (!question) return;
      const tags = card.querySelectorAll(".question-card__tags span");
      if (tags[1] && question.examNumber) tags[1].textContent = `ENEM ${question.year} · questão ${question.examNumber}`;
      if (!card.querySelector(".mente-review-link") && reviewSlug[question.category]) {
        const link = document.createElement("a");
        link.className = "mente-review-link";
        link.href = `explicacoes.html#${reviewSlug[question.category]}`;
        link.textContent = `Revisar ${question.category} →`;
        card.querySelector(".question-card__footer")?.before(link);
      }
    });
  }

  async function syncQuestionCatalog() {
    if (!document.querySelector("#questions-grid") || typeof questions === "undefined") return 0;
    const subjectsPromise = client.from("materias").select("id,slug,nome,cor").eq("ativa", true);
    const questionsPromise = client.from("questoes")
      .select("id,codigo,materia_id,topico,nivel,enunciado,alternativas,enem_ano,enem_numero,fonte")
      .eq("ativa", true)
      .order("id", { ascending: true });
    const [{ data: subjects, error: subjectError }, { data: rows, error: questionError }] = await withTimeout(
      Promise.all([subjectsPromise, questionsPromise]),
      TIMEOUT_MS,
      "Questões demoraram para carregar do banco",
    );
    if (subjectError) throw subjectError;
    if (questionError) throw questionError;
    if (!rows?.length) {
      notify("mente:catalog-updated");
      return 0;
    }

    const subjectMap = new Map((subjects || []).map((subject) => [Number(subject.id), subject]));
    const dbQuestions = rows.map((row) => {
      const subject = subjectMap.get(Number(row.materia_id));
      return {
        id: Number(row.id),
        category: categoryBySlug[subject?.slug] || subject?.nome || "Matemática",
        topic: row.topico,
        year: Number(row.enem_ano),
        stars: Number(row.nivel),
        text: row.enunciado,
        detail: row.enunciado,
        options: Array.isArray(row.alternativas) ? row.alternativas : [],
        examNumber: row.enem_numero ? Number(row.enem_numero) : null,
        source: row.fonte,
        status: "Não respondida",
        visual: null,
      };
    });

    questions.splice(0, questions.length, ...dbQuestions);
    if (typeof filters !== "undefined") {
      filters.category.replaceChildren(new Option("Todas as matérias", ""));
      if (typeof fillSelect === "function") fillSelect(filters.category, [...new Set(dbQuestions.map((item) => item.category))]);
      if (typeof updateTopicOptions === "function") updateTopicOptions();
      filters.year.replaceChildren(new Option("Todos os anos", ""));
      if (typeof fillSelect === "function") fillSelect(filters.year, [...new Set(dbQuestions.map((item) => item.year))].sort((a, b) => b - a));
    }
    if (typeof renderQuestions === "function") renderQuestions();
    decorateCatalog();
    notify("mente:catalog-updated");
    return dbQuestions.length;
  }

  function getQuestionId() {
    const fromUrl = Number(new URLSearchParams(location.search).get("id"));
    if (fromUrl) return fromUrl;
    try { return Number(JSON.parse(localStorage.getItem("mente-selected-question") || "null")?.id) || 0; }
    catch { return 0; }
  }

  async function fetchExistingResponse(userId, questionId) {
    const { data, error } = await withTimeout(
      client.from("respostas").select("questao_id,alternativa,acertou,respondida_em").eq("user_id", userId).eq("questao_id", questionId).maybeSingle(),
      TIMEOUT_MS,
      "Resposta demorou para carregar",
    );
    if (error) throw error;
    return data;
  }

  async function syncCurrentQuestionAnswer(user) {
    const questionId = getQuestionId();
    if (!user || !questionId || !document.querySelector("#question-content")) return;
    const existing = await fetchExistingResponse(user.id, questionId);
    if (!existing) return;
    const answers = readLocalAnswers();
    const local = answers[questionId];
    const normalized = {
      selected: Number(existing.alternativa),
      correct: Boolean(existing.acertou),
      answeredAt: existing.respondida_em,
      source: "supabase",
    };
    answers[questionId] = normalized;
    writeLocalAnswers(answers);
    notify("mente:account-updated");
    if (!local || local.source !== "supabase" || local.selected !== normalized.selected || local.correct !== normalized.correct) {
      const guard = `mente-db-answer-synced-${questionId}`;
      if (!sessionStorage.getItem(guard)) {
        sessionStorage.setItem(guard, "1");
        location.reload();
      }
    }
  }

  async function saveAnswerToDatabase(button) {
    const user = await getSessionUser();
    if (!user) return false;
    const questionId = getQuestionId();
    const selected = document.querySelector('input[name^="mente-answer-"]:checked');
    const feedback = document.querySelector("#mente-final-feedback");
    if (!questionId || !selected) {
      if (feedback) feedback.innerHTML = '<p class="form-error">Escolha uma alternativa antes de responder.</p>';
      return true;
    }

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Salvando...";
    try {
      const alternative = Number(selected.value);
      let responseRow;
      const { data, error } = await withTimeout(
        client.from("respostas").insert({ questao_id: questionId, alternativa: alternative }).select("questao_id,alternativa,acertou,respondida_em").single(),
        TIMEOUT_MS,
        "O banco demorou para salvar a resposta",
      );
      if (error) {
        if (error.code === "23505") responseRow = await fetchExistingResponse(user.id, questionId);
        else throw error;
      } else responseRow = data;
      if (!responseRow) throw new Error("Resposta não retornada pelo banco");

      const answers = readLocalAnswers();
      answers[questionId] = { selected: Number(responseRow.alternativa), correct: Boolean(responseRow.acertou), answeredAt: responseRow.respondida_em, source: "supabase" };
      writeLocalAnswers(answers);
      sessionStorage.setItem(`mente-db-answer-synced-${questionId}`, "1");
      notify("mente:account-updated");
      location.reload();
      return true;
    } catch (error) {
      button.disabled = false;
      button.textContent = originalText || "Responder e ver a explicação";
      if (feedback) feedback.innerHTML = '<p class="form-error">O banco demorou para responder. A página continua disponível; tente salvar novamente em alguns segundos.</p>';
      console.error("[M.E.N.T.E] Falha ao registrar resposta:", error);
      return true;
    }
  }

  document.addEventListener("click", async (event) => {
    const answerButton = event.target.closest?.("#mente-final-answer");
    if (answerButton) {
      let user = null;
      try { user = await getSessionUser(); } catch {}
      if (!user) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      await saveAnswerToDatabase(answerButton);
      return;
    }
    const logoutButton = event.target.closest?.("#logout-button");
    if (logoutButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      try { await withTimeout(client.auth.signOut(), 4000); } catch {}
      localStorage.removeItem(USER_KEY);
      location.replace("./login.html");
    }
  }, true);

  async function initialize() {
    if (!client) {
      setStatus("Banco desconectado · usando dados locais", "error");
      return;
    }
    setStatus("Banco: conectando...", "loading");
    const safetyTimer = setTimeout(() => {
      if (window.menteDatabaseStatus?.state === "loading") setStatus("Banco demorando · site disponível em modo local", "error");
    }, TIMEOUT_MS + 500);
    try {
      const user = await getSessionUser();
      await syncUserProgress(user);
      const total = await syncQuestionCatalog();
      await syncCurrentQuestionAnswer(user);
      setStatus(user ? `Banco conectado · ${total || "questões locais"} · progresso online` : `Banco conectado · ${total || "questões locais"} · modo visitante`, "ok");
    } catch (error) {
      setStatus("Banco indisponível · usando dados locais", "error");
      notify("mente:catalog-updated");
      notify("mente:account-updated");
      console.error("[M.E.N.T.E] Supabase indisponível; interface liberada:", error);
    } finally {
      clearTimeout(safetyTimer);
    }
  }

  initialize();
})();
