"use strict";

(() => {
  const root = document.querySelector("#plus-review-root");
  if (!root) return;

  const subjectInfo = {
    "Geometria": { icon:"△", color:"#315B9D" },
    "Funções": { icon:"ƒ", color:"#7C3AED" },
    "Estatística e Probabilidade": { icon:"Σ", color:"#16803C" },
    "Matemática Financeira": { icon:"%", color:"#B7791F" },
    "Grandezas e Medidas": { icon:"↔", color:"#C2410C" },
    "Gráficos e Tabelas": { icon:"▥", color:"#0284C7" }
  };

  const state = {
    client: null,
    user: null,
    profile: null,
    remoteAnswers: null,
    loading: true,
    error: null
  };

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[char]));
  }

  function waitForClient() {
    if (window.menteSupabase) return Promise.resolve(window.menteSupabase);
    return new Promise((resolve) => {
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        resolve(window.menteSupabase || null);
      };
      window.addEventListener("mente:supabase-ready", done, { once:true });
      setTimeout(done, 2200);
    });
  }

  function allQuestions() {
    const modules = window.MENTE_FINAL_MODULES || {};
    return Object.values(modules).flatMap((module) => module?.questions || []);
  }

  function normalizeAnswer(answer) {
    if (!answer) return null;
    if (typeof answer.correct === "boolean") return answer.correct;
    if (typeof answer.acertou === "boolean") return answer.acertou;
    return null;
  }

  function answerMap() {
    return state.remoteAnswers || readJson("mente-answers", {});
  }

  function buildData() {
    const answers = answerMap();
    const questions = allQuestions();
    const rows = questions.map((question) => {
      const answer = answers[question.id] || answers[String(question.id)];
      const correct = normalizeAnswer(answer);
      return { question, answer, correct };
    }).filter((item) => item.answer && item.correct !== null);

    const stats = new Map();
    Object.keys(subjectInfo).forEach((name) => stats.set(name, { name, total:0, correct:0, wrong:0 }));

    rows.forEach((item) => {
      const name = item.question.category || item.question.subject || "Matemática";
      if (!stats.has(name)) stats.set(name, { name, total:0, correct:0, wrong:0 });
      const row = stats.get(name);
      row.total += 1;
      if (item.correct) row.correct += 1;
      else row.wrong += 1;
    });

    const practiced = [...stats.values()]
      .filter((item) => item.total > 0)
      .map((item) => ({
        ...item,
        accuracy: Math.round(item.correct / item.total * 100),
        needScore: item.wrong * 3 + (100 - Math.round(item.correct / item.total * 100)) / 25
      }))
      .sort((a,b) => b.needScore - a.needScore || a.accuracy - b.accuracy || b.wrong - a.wrong);

    const priority = practiced.find((item) => item.wrong > 0) || practiced[0] || null;
    const total = rows.length;
    const correct = rows.filter((item) => item.correct).length;
    const accuracy = total ? Math.round(correct / total * 100) : 0;
    const wrong = rows.filter((item) => item.correct === false);

    const orderedWrong = [...wrong].sort((a,b) => {
      const aPriority = Number((a.question.category || a.question.subject) === priority?.name);
      const bPriority = Number((b.question.category || b.question.subject) === priority?.name);
      if (bPriority !== aPriority) return bPriority - aPriority;
      const aTime = Date.parse(a.answer?.answeredAt || a.answer?.respondida_em || 0) || 0;
      const bTime = Date.parse(b.answer?.answeredAt || b.answer?.respondida_em || 0) || 0;
      return bTime - aTime;
    });

    return { rows, practiced, priority, total, correct, accuracy, wrong: orderedWrong };
  }

  function questionLabel(question) {
    const number = question.examNumber || question.enem_numero || question.id;
    const year = question.examYear || question.enem_ano || "";
    return `Questão ${number}${year ? ` · ENEM ${year}` : ""}`;
  }

  function topicLabel(question) {
    return question.topic || question.topico || question.content || question.skill || "Conteúdo da matéria";
  }

  function subjectVisual(name) {
    return subjectInfo[name] || { icon:"•", color:"#64748B" };
  }

  function performanceLabel(accuracy, wrong) {
    if (!wrong && accuracy >= 80) return "Bom desempenho";
    if (accuracy >= 70) return "Acompanhar";
    if (accuracy >= 50) return "Reforçar";
    return "Prioridade";
  }

  function updateTopbar() {
    const name = state.profile?.nome || state.user?.user_metadata?.name || state.user?.email?.split("@")[0] || "Aluno";
    const points = Number(state.profile?.pontos || 0);
    const nameEl = document.querySelector("#user-name");
    const avatarEl = document.querySelector("#user-avatar");
    const pointsEl = document.querySelector("#review-points");
    if (nameEl) nameEl.textContent = name;
    if (avatarEl && !avatarEl.querySelector(".mente-avatar-svg")) avatarEl.textContent = String(name).trim().charAt(0).toUpperCase() || "A";
    if (pointsEl) pointsEl.textContent = String(points);
  }

  function renderLoading() {
    root.innerHTML = `<div class="plus-review-page"><section class="review-loading"><span></span><h2>Montando sua revisão...</h2><p>Estamos organizando seus erros mais importantes.</p></section></div>`;
  }

  function renderLocked() {
    root.innerHTML = `<section class="plus-review-locked"><div class="review-lock-icon">★</div><small>M.E.N.T.E Plus</small><h2>Revisão Inteligente</h2><p>O Plus transforma seus erros em um plano curto de estudo: mostra a matéria prioritária, separa as questões mais importantes e indica por onde começar.</p><a href="plus.html">Conhecer o M.E.N.T.E Plus</a></section>`;
  }

  function renderNoHistory() {
    root.innerHTML = `<div class="plus-review-page"><section class="review-welcome"><div><small>Seu plano de revisão</small><h2>Ainda faltam respostas para montar um diagnóstico</h2><p>Resolva algumas questões primeiro. Assim que houver histórico, esta página vai organizar automaticamente o que vale revisar.</p><div class="review-welcome-actions"><a class="review-primary" href="questoes.html">Responder questões</a><a class="review-secondary" href="roteiro.html">Abrir roteiro de estudos</a></div></div><aside><strong>3</strong><span>passos simples</span><p>Responder, identificar erros e revisar.</p></aside></section></div>`;
  }

  function renderAllClear(data) {
    root.innerHTML = `<div class="plus-review-page"><section class="review-welcome is-clear"><div><small>Revisão em dia</small><h2>Você não tem erros pendentes agora</h2><p>Seu histórico atual está sem questões incorretas. Continue praticando para o sistema manter seu diagnóstico atualizado.</p><div class="review-welcome-actions"><a class="review-primary" href="questoes.html">Praticar novas questões</a><a class="review-secondary" href="simulados.html">Fazer um simulado</a></div></div><aside><strong>${data.accuracy}%</strong><span>de acertos</span><p>${data.correct} de ${data.total} respostas corretas.</p></aside></section>${renderPerformance(data)}</div>`;
  }

  function renderPerformance(data) {
    if (!data.practiced.length) return "";
    return `<section class="review-section"><div class="review-section-head"><div><small>Visão geral</small><h3>Desempenho por matéria</h3><p>Use esta parte só para entender onde você está bem e onde precisa reforçar.</p></div></div><div class="review-subject-list">${data.practiced.map((item) => {
      const visual = subjectVisual(item.name);
      return `<article class="review-subject"><div class="review-subject-icon" style="--subject:${visual.color}">${esc(visual.icon)}</div><div class="review-subject-main"><div><strong>${esc(item.name)}</strong><span>${item.correct}/${item.total} corretas · ${item.wrong} erro${item.wrong === 1 ? "" : "s"}</span></div><div class="review-bar"><span style="width:${item.accuracy}%;--subject:${visual.color}"></span></div></div><div class="review-subject-score"><strong>${item.accuracy}%</strong><span>${esc(performanceLabel(item.accuracy,item.wrong))}</span></div></article>`;
    }).join("")}</div></section>`;
  }

  function reviewItem(item, index, compact=false) {
    const q = item.question;
    const subject = q.category || q.subject || "Matemática";
    const visual = subjectVisual(subject);
    return `<article class="review-task ${compact ? "is-later" : ""}"><div class="review-task-number">${index + 1}</div><div class="review-task-copy"><div class="review-task-tags"><span style="--subject:${visual.color}">${esc(visual.icon)} ${esc(subject)}</span>${!compact && index === 0 ? '<b>Comece aqui</b>' : ""}</div><strong>${esc(questionLabel(q))}</strong><p>${esc(topicLabel(q))}</p></div><button type="button" class="review-task-button" data-review-question="${Number(q.id)}">${compact ? "Abrir" : "Revisar agora"}</button></article>`;
  }

  function renderPlus() {
    const data = buildData();
    if (!data.total) { renderNoHistory(); return; }
    if (!data.wrong.length) { renderAllClear(data); return; }

    const today = data.wrong.slice(0,3);
    const later = data.wrong.slice(3,8);
    const priority = data.priority;
    const visual = subjectVisual(priority?.name || "Matemática");
    const minutes = Math.max(4, today.length * 3);
    const reason = priority
      ? `Você errou ${priority.wrong} de ${priority.total} questão${priority.total === 1 ? "" : "ões"} nessa matéria, por isso ela aparece primeiro.`
      : "A prioridade será definida conforme você responder mais questões.";

    root.innerHTML = `<div class="plus-review-page">
      <section class="review-hero">
        <div class="review-hero-copy"><small>★ M.E.N.T.E Plus</small><h2>Seu plano de revisão de hoje</h2><p>Em vez de mostrar um monte de dados, o sistema separou somente o que você precisa fazer agora.</p><div class="review-hero-actions"><button type="button" class="review-primary" data-review-question="${Number(today[0].question.id)}">Começar revisão</button><a class="review-secondary is-on-dark" href="#review-performance">Ver diagnóstico</a></div></div>
        <aside class="review-session-card"><small>Sessão sugerida</small><strong>${today.length} questão${today.length === 1 ? "" : "ões"}</strong><span>aprox. ${minutes} min</span><div class="review-session-line"></div><p>${data.wrong.length} erro${data.wrong.length === 1 ? "" : "s"} no histórico atual</p></aside>
      </section>

      <section class="review-how"><article><span>1</span><div><strong>Veja o foco</strong><p>Entenda qual matéria está puxando seu desempenho para baixo.</p></div></article><article><span>2</span><div><strong>Revise 3 erros</strong><p>Uma sessão curta evita que a lista vire algo cansativo.</p></div></article><article><span>3</span><div><strong>Pratique de novo</strong><p>Depois, volte às questões ou ao simulado para confirmar o aprendizado.</p></div></article></section>

      <section class="review-priority-card">
        <div class="review-priority-icon" style="--subject:${visual.color}">${esc(visual.icon)}</div><div><small>Prioridade agora</small><h3>${esc(priority?.name || "Matéria prioritária")}</h3><p>${esc(reason)}</p></div><div class="review-priority-metric"><strong>${priority ? `${priority.accuracy}%` : "—"}</strong><span>de acertos nessa matéria</span></div>
      </section>

      <section class="review-section review-today"><div class="review-section-head"><div><small>Faça agora</small><h3>Sua sessão de hoje</h3><p>Comece pelo primeiro item. Os erros da matéria prioritária ficam no topo.</p></div><span class="review-count">${today.length}/${data.wrong.length}</span></div><div class="review-task-list">${today.map((item,index) => reviewItem(item,index)).join("")}</div></section>

      ${later.length ? `<section class="review-section is-secondary"><div class="review-section-head"><div><small>Depois</small><h3>Próximas revisões</h3><p>Não precisa fazer tudo agora. Estes itens ficam guardados para a próxima sessão.</p></div></div><div class="review-task-list is-compact">${later.map((item,index) => reviewItem(item,index,true)).join("")}</div></section>` : ""}

      <div id="review-performance">${renderPerformance(data)}</div>

      <section class="review-next-step"><div><small>Depois da revisão</small><strong>Confirme se o conteúdo ficou claro</strong><p>Faça novas questões da matéria prioritária ou abra o roteiro para continuar estudando com sequência.</p></div><div><a class="review-primary" href="questoes.html">Praticar questões</a><a class="review-secondary" href="roteiro.html">Ir para o roteiro</a></div></section>
    </div>`;

    bindReviewButtons();
  }

  function renderError() {
    root.innerHTML = `<div class="plus-review-page"><section class="review-error"><strong>Não foi possível atualizar sua revisão agora.</strong><p>Você pode tentar carregar novamente sem perder seu progresso.</p><button type="button" class="review-primary" id="review-retry">Tentar novamente</button></section></div>`;
    document.querySelector("#review-retry")?.addEventListener("click", loadData);
  }

  function render() {
    updateTopbar();
    if (state.loading) { renderLoading(); return; }
    if (state.error && !state.remoteAnswers) { renderError(); return; }
    if (!window.MENTE_PLUS?.isActive?.()) { renderLocked(); return; }
    renderPlus();
  }

  async function openReview(questionId, button) {
    if (!questionId) return;
    const original = button?.textContent || "Revisar agora";
    if (button) { button.disabled = true; button.textContent = "Abrindo..."; }
    try {
      const client = state.client || await waitForClient();
      if (!client || !state.user) throw new Error("Faça login novamente para abrir sua revisão.");
      const { error } = await client.rpc("desbloquear_revisao_plus", { p_questao_id:Number(questionId) });
      if (error) throw error;
      location.href = `questao.html?id=${encodeURIComponent(questionId)}&from=plus-review`;
    } catch (error) {
      console.warn("[M.E.N.T.E Revisão Plus]", error);
      if (button) {
        button.disabled = false;
        button.textContent = "Tentar novamente";
        button.title = error?.message || "Não foi possível abrir a revisão.";
        setTimeout(() => { if (button.isConnected) button.textContent = original; }, 2600);
      }
    }
  }

  function bindReviewButtons() {
    document.querySelectorAll("[data-review-question]").forEach((button) => {
      if (button.dataset.ready === "1") return;
      button.dataset.ready = "1";
      button.addEventListener("click", () => openReview(Number(button.dataset.reviewQuestion), button));
    });
  }

  async function loadData() {
    state.loading = true;
    state.error = null;
    render();
    try {
      state.client = state.client || await waitForClient();
      if (!state.client) throw new Error("Conexão indisponível");
      const { data:sessionData, error:sessionError } = await state.client.auth.getSession();
      if (sessionError) throw sessionError;
      state.user = sessionData?.session?.user || null;
      if (!state.user) {
        state.remoteAnswers = null;
        state.profile = null;
        return;
      }

      const [profileRes, answersRes] = await Promise.all([
        state.client.from("profiles").select("nome,pontos,xp,nivel").eq("id",state.user.id).maybeSingle(),
        state.client.from("respostas").select("questao_id,alternativa,acertou,respondida_em").eq("user_id",state.user.id)
      ]);
      if (profileRes.error) throw profileRes.error;
      if (answersRes.error) throw answersRes.error;

      state.profile = profileRes.data || null;
      const map = {};
      (answersRes.data || []).forEach((row) => {
        map[row.questao_id] = {
          selected: Number(row.alternativa),
          correct: Boolean(row.acertou),
          answeredAt: row.respondida_em,
          source: "supabase"
        };
      });
      state.remoteAnswers = map;
      try { localStorage.setItem("mente-answers", JSON.stringify(map)); } catch {}
      if (state.profile?.pontos !== undefined) {
        try { localStorage.setItem("mente-points", String(Number(state.profile.pontos) || 0)); } catch {}
      }
    } catch (error) {
      state.error = error;
      console.warn("[M.E.N.T.E Revisão Plus] usando histórico local:", error);
      state.remoteAnswers = null;
    } finally {
      state.loading = false;
      render();
    }
  }

  renderLoading();
  loadData();
  window.addEventListener("mente:plan-updated", render);
  window.addEventListener("mente:points-updated", () => setTimeout(loadData, 150));
})();
