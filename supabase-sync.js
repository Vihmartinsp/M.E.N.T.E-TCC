"use strict";

(() => {
  const client = window.menteSupabase;
  const statusEl = document.querySelector("#database-status");
  const ANSWERS_KEY = "mente-answers";
  const POINTS_KEY = "mente-points";
  const USER_KEY = "mente-demo-user";

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

  function setStatus(message, state = "loading") {
    window.menteDatabaseStatus = { state, message, checkedAt: new Date().toISOString() };
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.state = state;
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
    try {
      localStorage.setItem(USER_KEY, JSON.stringify({
        id: user.id,
        email: user.email,
        name,
        source: "supabase",
      }));
      if (profile?.xp != null) localStorage.setItem(POINTS_KEY, String(profile.xp));
    } catch {}

    const nameEl = document.querySelector("#user-name");
    const avatarEl = document.querySelector("#user-avatar");
    const pointsEls = document.querySelectorAll("#points, .score strong");
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
    if (profile?.xp != null) pointsEls.forEach((el) => { el.textContent = String(profile.xp); });
    window.menteDbProfile = profile || null;
  }

  async function getSessionUser() {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session?.user || null;
  }

  async function syncUserProgress(user) {
    if (!user) {
      window.menteDbAnsweredIds = new Set();
      return;
    }

    const [{ data: profile, error: profileError }, { data: responses, error: responseError }] = await Promise.all([
      client.from("profiles").select("nome,xp,moedas,nivel,sequencia").eq("id", user.id).single(),
      client.from("respostas").select("questao_id,alternativa,acertou,xp_ganho,moedas_ganhas,respondida_em").eq("user_id", user.id),
    ]);

    if (profileError) throw profileError;
    if (responseError) throw responseError;

    saveProfileLocally(user, profile);
    const answers = readLocalAnswers();
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
        const footer = card.querySelector(".question-card__footer");
        if (footer) footer.before(link);
      }
    });
  }

  async function syncQuestionCatalog() {
    if (!document.querySelector("#questions-grid") || typeof questions === "undefined") return 0;

    const [{ data: subjects, error: subjectError }, { data: rows, error: questionError }] = await Promise.all([
      client.from("materias").select("id,slug,nome,cor").eq("ativa", true),
      client.from("questoes")
        .select("id,codigo,materia_id,topico,nivel,enunciado,alternativas,enem_ano,enem_numero,fonte")
        .eq("ativa", true)
        .order("id", { ascending: true }),
    ]);

    if (subjectError) throw subjectError;
    if (questionError) throw questionError;

    const subjectMap = new Map((subjects || []).map((subject) => [Number(subject.id), subject]));
    const dbQuestions = (rows || []).map((row) => {
      const subject = subjectMap.get(Number(row.materia_id));
      const category = categoryBySlug[subject?.slug] || subject?.nome || "Matemática";
      return {
        id: Number(row.id),
        category,
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
      const categories = [...new Set(dbQuestions.map((item) => item.category))];
      if (typeof fillSelect === "function") fillSelect(filters.category, categories);
      if (typeof updateTopicOptions === "function") updateTopicOptions();
      filters.year.replaceChildren(new Option("Todos os anos", ""));
      if (typeof fillSelect === "function") {
        fillSelect(filters.year, [...new Set(dbQuestions.map((item) => item.year))].sort((a, b) => b - a));
      }
    }

    if (typeof renderQuestions === "function") renderQuestions();
    decorateCatalog();
    return dbQuestions.length;
  }

  function getQuestionId() {
    const fromUrl = Number(new URLSearchParams(window.location.search).get("id"));
    if (fromUrl) return fromUrl;
    try { return Number(JSON.parse(localStorage.getItem("mente-selected-question") || "null")?.id) || 0; }
    catch { return 0; }
  }

  async function fetchExistingResponse(userId, questionId) {
    const { data, error } = await client
      .from("respostas")
      .select("questao_id,alternativa,acertou,xp_ganho,moedas_ganhas,respondida_em")
      .eq("user_id", userId)
      .eq("questao_id", questionId)
      .maybeSingle();
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

    if (!local || local.source !== "supabase" || local.selected !== normalized.selected || local.correct !== normalized.correct) {
      const guard = `mente-db-answer-synced-${questionId}`;
      if (!sessionStorage.getItem(guard)) {
        sessionStorage.setItem(guard, "1");
        window.location.reload();
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

    const alternative = Number(selected.value);
    button.disabled = true;
    button.textContent = "Salvando no banco...";

    let responseRow;
    const { data, error } = await client
      .from("respostas")
      .insert({ questao_id: questionId, alternativa: alternative })
      .select("questao_id,alternativa,acertou,xp_ganho,moedas_ganhas,respondida_em")
      .single();

    if (error) {
      if (error.code === "23505") {
        responseRow = await fetchExistingResponse(user.id, questionId);
      } else {
        button.disabled = false;
        button.textContent = "Responder e ver a explicação";
        if (feedback) feedback.innerHTML = '<p class="form-error">Não foi possível salvar sua resposta no banco. Tente novamente.</p>';
        console.error("Erro ao salvar resposta no Supabase:", error);
        return true;
      }
    } else {
      responseRow = data;
    }

    if (!responseRow) return true;

    const answers = readLocalAnswers();
    answers[questionId] = {
      selected: Number(responseRow.alternativa),
      correct: Boolean(responseRow.acertou),
      answeredAt: responseRow.respondida_em,
      source: "supabase",
    };
    writeLocalAnswers(answers);

    const { data: profile } = await client.from("profiles").select("nome,xp,moedas,nivel,sequencia").eq("id", user.id).single();
    if (profile) saveProfileLocally(user, profile);

    sessionStorage.setItem(`mente-db-answer-synced-${questionId}`, "1");
    window.location.reload();
    return true;
  }

  document.addEventListener("click", async (event) => {
    const answerButton = event.target.closest?.("#mente-final-answer");
    if (answerButton) {
      const { data } = await client.auth.getSession();
      if (!data.session?.user) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      try { await saveAnswerToDatabase(answerButton); }
      catch (error) {
        answerButton.disabled = false;
        answerButton.textContent = "Responder e ver a explicação";
        const feedback = document.querySelector("#mente-final-feedback");
        if (feedback) feedback.innerHTML = '<p class="form-error">Falha de conexão com o banco. Confira sua internet e tente novamente.</p>';
        console.error("Falha ao registrar resposta:", error);
      }
      return;
    }

    const logoutButton = event.target.closest?.("#logout-button");
    if (logoutButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      try { await client.auth.signOut(); } catch {}
      localStorage.removeItem(USER_KEY);
      window.location.replace("./login.html");
    }
  }, true);

  async function initialize() {
    if (!client) {
      setStatus("Banco desconectado", "error");
      return;
    }

    setStatus("Banco: conectando...", "loading");
    try {
      const user = await getSessionUser();
      await syncUserProgress(user);
      const total = await syncQuestionCatalog();
      await syncCurrentQuestionAnswer(user);
      setStatus(user ? `Banco conectado · ${total || 30} questões · progresso online` : `Banco conectado · ${total || 30} questões · modo visitante`, "ok");
      console.info("[M.E.N.T.E] Supabase conectado com sucesso.", { totalQuestions: total, authenticated: Boolean(user) });
    } catch (error) {
      setStatus("Banco indisponível · usando dados locais", "error");
      console.error("[M.E.N.T.E] Falha na conexão com o Supabase:", error);
    }
  }

  initialize();
})();
