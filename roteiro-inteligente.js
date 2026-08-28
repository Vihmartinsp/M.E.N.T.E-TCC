"use strict";

(() => {
  if (document.body.dataset.page !== "roteiro") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  const modules = window.MENTE_FINAL_MODULES || {};
  const subjects = [
    { name: "Geometria", icon: "📐", color: "#FF7A00", slug: "geometria" },
    { name: "Funções", icon: "ƒ", color: "#AB47BC", slug: "funcoes" },
    { name: "Estatística e Probabilidade", icon: "📊", color: "#16803C", slug: "estatistica" },
    { name: "Matemática Financeira", icon: "💰", color: "#D9A400", slug: "financeira" },
    { name: "Grandezas e Medidas", icon: "📏", color: "#D70101", slug: "grandezas" },
    { name: "Gráficos e Tabelas", icon: "📈", color: "#0284C7", slug: "graficos-tabelas" }
  ];

  const STORAGE_PLAN = "mente-study-plan-v2";
  const STORAGE_DONE = "mente-study-plan-done-v2";
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
          <p>Escolha quanto tempo você tem e o tipo de estudo que quer fazer. O M.E.N.T.E monta um plano curto, em ordem, para você não perder tempo decidindo por onde começar.</p>
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
            <p>Três escolhas rápidas. Depois é só seguir a ordem.</p>
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
          <span class="roadmap-builder__hint">Dica: se estiver em dúvida, deixe todas as matérias marcadas e use “Reforçar dificuldades”.</span>
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
        <div class="roadmap-timeline" id="roadmap-timeline"></div>
        <div class="roadmap-plan__complete" id="plan-complete"><strong>🎉 Roteiro concluído!</strong><br>Você terminou o plano de hoje. Se quiser continuar, monte outro roteiro com mais tempo ou escolha uma nova matéria.</div>
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

  function makeTask(subject, type, duration, round = 1) {
    const common = { subject: subject.name, icon: subject.icon, color: subject.color, duration, round };
    if (type === "explanation") return { ...common, type, title: `Entenda ${subject.name}`, description: "Leia a explicação focando nos exemplos e nas armadilhas mais comuns.", action: "Abrir explicação", href: `explicacoes.html#${subject.slug}` };
    if (type === "practice") return { ...common, type, title: `Pratique ${subject.name}`, description: round > 1 ? "Faça mais 2 questões e tente justificar sua escolha antes de responder." : "Faça 2 questões e use a explicação depois para conferir o raciocínio.", action: "Ir para questões", href: "questoes.html" };
    if (type === "review") return { ...common, type, title: `Revisão de ${subject.name}`, description: "Releia o erro ou a solução que mais chamou atenção e anote mentalmente a estratégia.", action: "Ver desempenho", href: "desempenho.html" };
    return { ...common, type: "bonus", title: "Fechamento rápido", description: "Escolha uma questão que ainda não respondeu e tente resolvê-la sem consultar a explicação.", action: "Questão bônus", href: "questoes.html" };
  }

  function generatePlan(minutes, mode, selected) {
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

    if (remaining >= 5) {
      const subject = ordered[0];
      tasks.push(makeTask(subject, "bonus", remaining, 1));
      remaining = 0;
    }

    return tasks.map((task, index) => ({ ...task, id: `task-${Date.now()}-${index}` }));
  }

  function renderPlan(plan, doneMap = {}) {
    if (!plan?.tasks?.length) return;
    document.querySelector("#plan-title").textContent = `${plan.minutes} minutos · ${plan.modeLabel}`;
    document.querySelector("#plan-subtitle").textContent = `${plan.tasks.length} etapas em ordem. Marque cada uma quando terminar.`;
    timeline.innerHTML = plan.tasks.map((task, index) => {
      const done = Boolean(doneMap[task.id]);
      return `<article class="roadmap-task ${done ? "is-done" : ""}" data-task-id="${task.id}" style="--task-color:${task.color}"><button class="roadmap-task__check" type="button" aria-label="${done ? "Desmarcar" : "Concluir"} etapa ${index + 1}">${done ? "✓" : ""}</button><div class="roadmap-task__body"><div class="roadmap-task__eyebrow"><span class="roadmap-task__dot"></span><span>${task.icon} ${task.subject}</span><span>·</span><span>${task.duration} min</span></div><h4>${index + 1}. ${task.title}</h4><p>${task.description}</p></div><a class="roadmap-task__action" href="${task.href}">${task.action} →</a></article>`;
    }).join("");

    timeline.querySelectorAll(".roadmap-task__check").forEach((button) => {
      button.addEventListener("click", () => {
        const taskEl = button.closest(".roadmap-task");
        const id = taskEl.dataset.taskId;
        const current = readJson(STORAGE_DONE, {});
        current[id] = !current[id];
        if (!current[id]) delete current[id];
        saveJson(STORAGE_DONE, current);
        taskEl.classList.toggle("is-done", Boolean(current[id]));
        button.textContent = current[id] ? "✓" : "";
        button.setAttribute("aria-label", `${current[id] ? "Desmarcar" : "Concluir"} etapa`);
        updateProgress(plan, current);
      });
    });

    updateProgress(plan, doneMap);
    builder.hidden = true;
    planSection.hidden = false;
    planSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateProgress(plan, doneMap) {
    const completed = plan.tasks.filter((task) => doneMap[task.id]).length;
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
    const plan = { createdAt: Date.now(), minutes, mode, modeLabel: labels[mode], tasks: generatePlan(minutes, mode, selected) };
    saveJson(STORAGE_PLAN, plan);
    saveJson(STORAGE_DONE, {});
    renderPlan(plan, {});
  });

  document.querySelector("#new-plan").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_PLAN);
    localStorage.removeItem(STORAGE_DONE);
    planSection.hidden = true;
    builder.hidden = false;
    builder.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const savedPlan = readJson(STORAGE_PLAN, null);
  if (savedPlan?.tasks?.length) {
    renderPlan(savedPlan, readJson(STORAGE_DONE, {}));
  }
})();