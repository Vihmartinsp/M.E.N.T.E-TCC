"use strict";

(() => {
  if (document.body.dataset.page !== "roteiro") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  const modules = window.MENTE_FINAL_MODULES || {};
  const subjects = [
    { name: "Geometria", icon: "📐", color: "#FF7A00", slug: "geometria" },
    { name: "Funções", icon: "ƒ", color: "#AB47BC", slug: "funcoes" },
    { name: "Estatística e Probabilidade", icon: "📊", color: "#16803C", slug: "estatistica-probabilidade" },
    { name: "Matemática Financeira", icon: "💰", color: "#D9A400", slug: "matematica-financeira" },
    { name: "Grandezas e Medidas", icon: "📏", color: "#D70101", slug: "grandezas-medidas" },
    { name: "Gráficos e Tabelas", icon: "📈", color: "#0284C7", slug: "graficos-tabelas" }
  ];

  const STORAGE_PLAN = "mente-study-plan-v3";
  const STORAGE_PROGRESS = "mente-study-task-progress-v3";
  const STORAGE_ACTIVE = "mente-study-active-task-v3";
  const answers = readJson("mente-answers", {});

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function subjectStats(subject) {
    const qs = modules[subject.name]?.questions || [];
    const answered = qs.filter((q) => answers[q.id]);
    const correct = answered.filter((q) => answers[q.id]?.correct).length;
    const accuracy = answered.length ? Math.round((correct / answered.length) * 100) : null;
    return { total: qs.length, answered: answered.length, correct, accuracy };
  }

  const statsBySubject = Object.fromEntries(subjects.map((s) => [s.name, subjectStats(s)]));
  const totalAnswered = Object.values(statsBySubject).reduce((sum, s) => sum + s.answered, 0);
  const totalCorrect = Object.values(statsBySubject).reduce((sum, s) => sum + s.correct, 0);
  const globalAccuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : null;

  function priorityScore(subject) {
    const s = statsBySubject[subject.name];
    if (!s.answered) return 45;
    return Math.max(0, 100 - s.accuracy) + Math.max(0, 5 - s.answered) * 4;
  }

  const recommendation = [...subjects].sort((a, b) => priorityScore(b) - priorityScore(a))[0];
  const recommendationText = totalAnswered
    ? `Pelos seus resultados, vale começar por ${recommendation.name}.`
    : "Você ainda não tem diagnóstico. Comece por uma matéria e o roteiro se adapta conforme você responde questões.";

  main.innerHTML = `
    <div class="roadmap-smart">
      <section class="roadmap-hero">
        <div class="roadmap-hero__copy">
          <p class="roadmap-eyebrow">Roteiro Inteligente M.E.N.T.E</p>
          <h2>O que estudar hoje?</h2>
          <p>Escolha quanto tempo você tem e o tipo de estudo que quer fazer. O M.E.N.T.E monta um plano curto e acompanha a atividade real: o tempo só conta na página certa e pausa se você sair ou trocar de aba.</p>
        </div>
        <aside class="roadmap-hero__summary">
          <small>Recomendação de hoje</small>
          <strong>${recommendation.icon} ${recommendation.name}</strong>
          <span>${recommendationText}</span>
        </aside>
      </section>

      <section class="roadmap-diagnostics" aria-label="Resumo do seu estudo">
        <article class="roadmap-stat">
          <small>Questões respondidas</small>
          <strong>${totalAnswered}</strong>
          <span>${totalAnswered ? "Seu histórico já ajuda a personalizar o roteiro." : "Responda questões para liberar um diagnóstico melhor."}</span>
        </article>
        <article class="roadmap-stat">
          <small>Taxa de acertos</small>
          <strong>${globalAccuracy === null ? "—" : `${globalAccuracy}%`}</strong>
          <span>${globalAccuracy === null ? "Ainda não há respostas suficientes." : globalAccuracy >= 75 ? "Bom desempenho. Hora de manter a consistência." : "Use o modo Reforçar dificuldades para revisar pontos fracos."}</span>
        </article>
        <article class="roadmap-stat">
          <small>Foco sugerido</small>
          <strong>${recommendation.icon}</strong>
          <span>${recommendation.name}</span>
        </article>
      </section>

      <section class="roadmap-builder" id="roadmap-builder">
        <div class="roadmap-section-head">
          <div>
            <h3>Monte seu plano de hoje</h3>
            <p>Três escolhas rápidas. Depois, cada missão é validada automaticamente pelo que você realmente fizer.</p>
          </div>
          <span class="roadmap-step-number">1</span>
        </div>

        <div class="roadmap-builder__block">
          <p class="roadmap-builder__title">⏱️ Quanto tempo você tem?</p>
          <div class="roadmap-choice-row" id="time-options">
            ${[20,40,60,90].map((m) => `<span class="roadmap-choice"><input type="radio" name="study-time" id="study-time-${m}" value="${m}" ${m===40?"checked":""}><label for="study-time-${m}">${m} min</label></span>`).join("")}
          </div>
        </div>

        <div class="roadmap-builder__block">
          <p class="roadmap-builder__title">🧠 Qual é seu objetivo?</p>
          <div class="roadmap-choice-row">
            <span class="roadmap-choice"><input type="radio" name="study-mode" id="mode-smart" value="smart" checked><label for="mode-smart">Reforçar dificuldades</label></span>
            <span class="roadmap-choice"><input type="radio" name="study-mode" id="mode-balanced" value="balanced"><label for="mode-balanced">Estudo equilibrado</label></span>
            <span class="roadmap-choice"><input type="radio" name="study-mode" id="mode-review" value="review"><label for="mode-review">Revisão rápida</label></span>
          </div>
        </div>

        <div class="roadmap-builder__block">
          <p class="roadmap-builder__title">📚 Quais matérias podem entrar no roteiro?</p>
          <div class="roadmap-subjects">
            ${subjects.map((s) => `<span class="roadmap-subject" style="--subject-color:${s.color}"><input type="checkbox" id="subject-${s.slug}" value="${s.name}" checked><label for="subject-${s.slug}"><span>${s.icon} ${s.name}</span><b>✓</b></label></span>`).join("")}
          </div>
        </div>

        <div class="roadmap-builder__footer">
          <span class="roadmap-builder__hint">O tempo pausa automaticamente se a aba ficar oculta, perder o foco ou você sair da atividade da missão.</span>
          <button class="roadmap-primary" type="button" id="build-roadmap">Montar meu roteiro →</button>
          <p class="roadmap-error" id="roadmap-error" hidden></p>
        </div>
      </section>

      <section class="roadmap-plan" id="roadmap-plan" hidden aria-live="polite">
        <div class="roadmap-plan__top">
          <div>
            <p class="roadmap-eyebrow">Seu plano de hoje</p>
            <h3 id="plan-title">Roteiro pronto</h3>
            <p id="plan-subtitle"></p>
          </div>
          <button class="roadmap-secondary" type="button" id="new-plan">Montar outro</button>
        </div>
        <div class="roadmap-progress">
          <div class="roadmap-progress__meta"><span id="progress-label">0 de 0 etapas</span><span id="progress-percent">0%</span></div>
          <div class="roadmap-progress__track"><span id="progress-bar"></span></div>
        </div>
        <div class="roadmap-plan__notice">🔒 As etapas não podem mais ser marcadas manualmente. Elas são concluídas quando o requisito de tempo e, quando necessário, a atividade pedida forem cumpridos.</div>
        <div class="roadmap-timeline" id="roadmap-timeline"></div>
        <div class="roadmap-plan__complete" id="plan-complete"><strong>🎉 Roteiro concluído!</strong><br>Você terminou o plano de hoje com atividade verificada. Se quiser continuar, monte outro roteiro.</div>
      </section>

      <section class="roadmap-performance">
        <div class="roadmap-section-head">
          <div>
            <h3>Seu mapa de desempenho</h3>
            <p>Uma leitura simples do que você já praticou em cada matéria.</p>
          </div>
          <span class="roadmap-step-number">2</span>
        </div>
        ${totalAnswered ? `<div class="roadmap-performance__grid">${subjects.map((s) => {
          const st = statsBySubject[s.name];
          const pct = st.accuracy ?? 0;
          return `<article class="roadmap-performance-card" style="--subject-color:${s.color}"><div class="roadmap-performance-card__head"><span class="roadmap-performance-card__dot"></span><strong>${s.icon} ${s.name}</strong></div><div class="roadmap-performance-card__bar"><span style="width:${pct}%"></span></div><small>${st.answered ? `${st.correct}/${st.answered} acertos · ${pct}%` : "Ainda não praticada"}</small></article>`;
        }).join("")}</div>` : `<div class="roadmap-empty-note">Você ainda não respondeu questões suficientes para montar um mapa de desempenho. <a href="questoes.html">Começar pelas questões →</a></div>`}
      </section>
    </div>`;

  const builder = document.querySelector("#roadmap-builder");
  const planSection = document.querySelector("#roadmap-plan");
  const timeline = document.querySelector("#roadmap-timeline");
  const error = document.querySelector("#roadmap-error");

  function chosenSubjects() {
    return subjects.filter((s) => document.querySelector(`#subject-${s.slug}`)?.checked);
  }

  function orderSubjects(selected, mode) {
    const copy = [...selected];
    if (mode === "smart") return copy.sort((a, b) => priorityScore(b) - priorityScore(a));
    if (mode === "review") {
      return copy.sort((a, b) => (statsBySubject[b.name].answered || 0) - (statsBySubject[a.name].answered || 0));
    }
    return copy;
  }

  function rewardFor(type) {
    return { explanation: 8, practice: 15, review: 6, bonus: 10 }[type] || 5;
  }

  function makeTask(subject, type, duration, round = 1) {
    const common = {
      subject: subject.name,
      subjectSlug: subject.slug,
      icon: subject.icon,
      color: subject.color,
      duration,
      requiredSeconds: Math.max(30, duration * 60),
      requiredActions: type === "practice" ? 2 : type === "bonus" ? 1 : 0,
      points: rewardFor(type),
      round
    };

    if (type === "explanation") return {
      ...common,
      type,
      title: `Entenda ${subject.name}`,
      description: `Revise a explicação por ${duration} min. O cronômetro só avança com esta aba ativa e pausa automaticamente se você sair.`,
      action: "Abrir explicação",
      href: `explicacoes.html#${subject.slug}`
    };
    if (type === "practice") return {
      ...common,
      type,
      title: `Pratique ${subject.name}`,
      description: `Estude por ${duration} min e responda 2 questões de ${subject.name}. Só o tempo ativo e respostas reais validam a etapa.`,
      action: "Ir para questões",
      href: `questoes.html?materia=${encodeURIComponent(subject.name)}`
    };
    if (type === "review") return {
      ...common,
      type,
      title: `Revisão de ${subject.name}`,
      description: `Volte à explicação por ${duration} min e releia especialmente armadilhas, estratégia e resolução.`,
      action: "Revisar explicação",
      href: `explicacoes.html#${subject.slug}`
    };
    return {
      ...common,
      type: "bonus",
      title: `Fechamento de ${subject.name}`,
      description: `Use os ${duration} min finais para resolver 1 questão de ${subject.name}. O tempo e a resposta precisam ser registrados.`,
      action: "Questão bônus",
      href: `questoes.html?materia=${encodeURIComponent(subject.name)}`
    };
  }

  function generatePlan(minutes, mode, selected, planId) {
    const ordered = orderSubjects(selected, mode);
    const tasks = [];
    let remaining = minutes;
    let cursor = 0;
    const rounds = Object.create(null);

    while (remaining >= 8 && ordered.length) {
      const subject = ordered[cursor % ordered.length];
      rounds[subject.name] = (rounds[subject.name] || 0) + 1;
      const round = rounds[subject.name];

      if (mode === "review") {
        if (remaining >= 8) { tasks.push(makeTask(subject, "review", 8, round)); remaining -= 8; }
        if (remaining >= 10) { tasks.push(makeTask(subject, "practice", 10, round)); remaining -= 10; }
      } else {
        if (round === 1 && remaining >= 8) { tasks.push(makeTask(subject, "explanation", 8, round)); remaining -= 8; }
        if (remaining >= 10) { tasks.push(makeTask(subject, "practice", 10, round)); remaining -= 10; }
        if (remaining >= 4) { tasks.push(makeTask(subject, "review", 4, round)); remaining -= 4; }
      }

      cursor += 1;
      if (cursor > 18) break;
    }

    if (remaining >= 5 && ordered.length) {
      tasks.push(makeTask(ordered[0], "bonus", remaining, 1));
    }

    return tasks.map((task, index) => ({ ...task, id: `${planId}-t${index + 1}` }));
  }

  function formatSeconds(seconds) {
    const safe = Math.max(0, Math.floor(Number(seconds) || 0));
    const minutes = Math.floor(safe / 60);
    const rest = safe % 60;
    return `${minutes}:${String(rest).padStart(2, "0")}`;
  }

  function taskState(task, progressMap) {
    const progress = progressMap[task.id] || {};
    const elapsed = Math.min(task.requiredSeconds, Math.max(0, Number(progress.elapsedSeconds) || 0));
    const actions = Math.max(0, Number(progress.actionCount) || 0);
    const timePct = task.requiredSeconds ? Math.min(100, Math.round((elapsed / task.requiredSeconds) * 100)) : 100;
    const actionPct = task.requiredActions ? Math.min(100, Math.round((actions / task.requiredActions) * 100)) : 100;
    const pct = Math.min(timePct, actionPct);
    const completed = Boolean(progress.completed) || (elapsed >= task.requiredSeconds && actions >= task.requiredActions);
    return { elapsed, actions, pct: completed ? 100 : pct, completed };
  }

  function taskStatusText(task, state) {
    if (state.completed) return `Concluída · +${task.points} pts`;
    if (state.elapsed <= 0 && state.actions <= 0) return "Não iniciada";
    if (task.requiredActions) return `Em andamento · ${formatSeconds(state.elapsed)} / ${formatSeconds(task.requiredSeconds)} · ${Math.min(state.actions, task.requiredActions)}/${task.requiredActions} respostas`;
    return `Em andamento · ${formatSeconds(state.elapsed)} / ${formatSeconds(task.requiredSeconds)}`;
  }

  function renderPlan(plan, progressMap = readJson(STORAGE_PROGRESS, {})) {
    if (!plan?.tasks?.length) return;
    document.querySelector("#plan-title").textContent = `${plan.minutes} minutos · ${plan.modeLabel}`;
    document.querySelector("#plan-subtitle").textContent = `${plan.tasks.length} etapas verificadas automaticamente. Abra a atividade pelo botão de cada missão para iniciar o acompanhamento.`;
    timeline.innerHTML = plan.tasks.map((task, index) => {
      const state = taskState(task, progressMap);
      const statusClass = state.completed ? "is-complete" : state.elapsed > 0 || state.actions > 0 ? "is-progress" : "is-pending";
      return `<article class="roadmap-task ${state.completed ? "is-done" : ""}" data-task-id="${escapeHtml(task.id)}" style="--task-color:${escapeHtml(task.color)}">
        <span class="roadmap-task__check ${state.completed ? "is-complete" : ""}" aria-hidden="true">${state.completed ? "✓" : ""}</span>
        <div class="roadmap-task__body">
          <div class="roadmap-task__eyebrow"><span class="roadmap-task__dot"></span><span>${task.icon} ${escapeHtml(task.subject)}</span><span>·</span><span>${task.duration} min</span><span>·</span><span>+${task.points} pts</span></div>
          <h4>${index + 1}. ${escapeHtml(task.title)}</h4>
          <p>${escapeHtml(task.description)}</p>
          <div class="roadmap-task__mission-progress" aria-label="Progresso da missão">
            <div class="roadmap-task__mission-meta"><strong class="${statusClass}">${taskStatusText(task, state)}</strong><span>${state.pct}%</span></div>
            <div class="roadmap-task__mission-track"><span style="width:${state.pct}%"></span></div>
          </div>
        </div>
        <a class="roadmap-task__action ${state.completed ? "is-complete" : ""}" data-roadmap-task-id="${escapeHtml(task.id)}" href="${escapeHtml(task.href)}">${state.completed ? "Revisar novamente" : task.action} →</a>
      </article>`;
    }).join("");

    updateProgress(plan, progressMap);
    builder.hidden = true;
    planSection.hidden = false;
  }

  function updateProgress(plan, progressMap = readJson(STORAGE_PROGRESS, {})) {
    const completed = plan.tasks.filter((task) => taskState(task, progressMap).completed).length;
    const total = plan.tasks.length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    document.querySelector("#progress-label").textContent = `${completed} de ${total} etapas`;
    document.querySelector("#progress-percent").textContent = `${pct}%`;
    document.querySelector("#progress-bar").style.width = `${pct}%`;
    document.querySelector("#plan-complete").classList.toggle("is-visible", completed === total && total > 0);
  }

  document.querySelector("#build-roadmap").addEventListener("click", () => {
    const minutes = Number(document.querySelector('input[name="study-time"]:checked')?.value || 40);
    const mode = document.querySelector('input[name="study-mode"]:checked')?.value || "smart";
    const selected = chosenSubjects();
    if (!selected.length) {
      error.hidden = false;
      error.textContent = "Escolha pelo menos uma matéria para montar o roteiro.";
      return;
    }
    error.hidden = true;
    const labels = { smart: "Reforçar dificuldades", balanced: "Estudo equilibrado", review: "Revisão rápida" };
    const planId = `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const plan = { id: planId, version: 3, createdAt: Date.now(), minutes, mode, modeLabel: labels[mode], tasks: generatePlan(minutes, mode, selected, planId) };
    saveJson(STORAGE_PLAN, plan);
    saveJson(STORAGE_PROGRESS, {});
    localStorage.removeItem(STORAGE_ACTIVE);
    renderPlan(plan, {});
    planSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelector("#new-plan").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_PLAN);
    localStorage.removeItem(STORAGE_PROGRESS);
    localStorage.removeItem(STORAGE_ACTIVE);
    planSection.hidden = true;
    builder.hidden = false;
    builder.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener("mente:mission-progress", () => {
    const plan = readJson(STORAGE_PLAN, null);
    if (plan?.tasks?.length) renderPlan(plan, readJson(STORAGE_PROGRESS, {}));
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_PROGRESS) return;
    const plan = readJson(STORAGE_PLAN, null);
    if (plan?.tasks?.length) renderPlan(plan, readJson(STORAGE_PROGRESS, {}));
  });

  const savedPlan = readJson(STORAGE_PLAN, null);
  if (savedPlan?.version === 3 && savedPlan.tasks?.length) {
    renderPlan(savedPlan, readJson(STORAGE_PROGRESS, {}));
  } else {
    localStorage.removeItem("mente-study-plan-v2");
    localStorage.removeItem("mente-study-plan-done-v2");
  }
})();
