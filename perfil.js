"use strict";

(() => {
  if (document.body.dataset.page !== "desempenho") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  const USER_KEY = "mente-demo-user";
  const ANSWERS_KEY = "mente-answers";
  const POINTS_KEY = "mente-points";
  const PROFILE_PREFIX = "mente-profile-v1:";

  const subjects = [
    { name: "Geometria", icon: "📐", color: "#FF7A00" },
    { name: "Funções", icon: "ƒ", color: "#AB47BC" },
    { name: "Estatística e Probabilidade", icon: "📊", color: "#16803C" },
    { name: "Matemática Financeira", icon: "💰", color: "#D9A400" },
    { name: "Grandezas e Medidas", icon: "📏", color: "#D70101" },
    { name: "Gráficos e Tabelas", icon: "📈", color: "#0284C7" }
  ];

  const modules = window.MENTE_FINAL_MODULES || {};

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function currentUser() {
    return readJson(USER_KEY, { name: "Aluno", email: "aluno@mente.local" });
  }

  function profileKey(email) {
    return `${PROFILE_PREFIX}${String(email || "local").trim().toLowerCase()}`;
  }

  function defaultProfile(user) {
    return {
      version: 1,
      name: user.name || String(user.email || "Aluno").split("@")[0],
      grade: "",
      focus: "",
      weeklyGoal: 10,
      targetAccuracy: 80,
      updatedAt: null
    };
  }

  function profileFor(user) {
    return { ...defaultProfile(user), ...readJson(profileKey(user.email), {}) };
  }

  function allQuestions() {
    return subjects.flatMap((subject) => modules[subject.name]?.questions || []);
  }

  function answersMap() {
    return readJson(ANSWERS_KEY, {});
  }

  function answerRecords() {
    const answers = answersMap();
    return allQuestions()
      .map((question) => ({ question, answer: answers[question.id] }))
      .filter((item) => item.answer);
  }

  function subjectStats() {
    const answers = answersMap();
    return subjects.map((subject) => {
      const qs = modules[subject.name]?.questions || [];
      const answered = qs.filter((q) => answers[q.id]);
      const correct = answered.filter((q) => answers[q.id]?.correct).length;
      const accuracy = answered.length ? Math.round((correct / answered.length) * 100) : 0;
      return { ...subject, total: qs.length, answered: answered.length, correct, accuracy };
    });
  }

  function lastSevenDays(records) {
    const limit = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return records.filter(({ answer }) => {
      const time = Date.parse(answer?.answeredAt || "");
      return Number.isFinite(time) && time >= limit;
    }).length;
  }

  function studyStreak(records) {
    const dayKey = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
    const days = new Set(records.map(({ answer }) => {
      const date = new Date(answer?.answeredAt || "");
      return Number.isNaN(date.getTime()) ? null : dayKey(date);
    }).filter(Boolean));
    if (!days.size) return 0;

    const today = new Date();
    today.setHours(12,0,0,0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let cursor = days.has(dayKey(today)) ? today : days.has(dayKey(yesterday)) ? yesterday : null;
    if (!cursor) return 0;

    let streak = 0;
    while (days.has(dayKey(cursor))) {
      streak += 1;
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function formatDate(value) {
    const date = new Date(value || "");
    if (Number.isNaN(date.getTime())) return "recentemente";
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date).replace(".", "");
  }

  function initials(name) {
    const parts = String(name || "Aluno").trim().split(/\s+/).filter(Boolean);
    return (parts.slice(0, 2).map((part) => part[0]).join("") || "A").toUpperCase();
  }

  function buildSnapshot(profile) {
    const records = answerRecords();
    const total = records.length;
    const correct = records.filter(({ answer }) => answer.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const weekly = lastSevenDays(records);
    const streak = studyStreak(records);
    const points = Number(localStorage.getItem(POINTS_KEY) || 0);
    const bySubject = subjectStats();
    const practiced = bySubject.filter((item) => item.answered > 0).length;
    return { records, total, correct, accuracy, weekly, streak, points, bySubject, practiced, profile };
  }

  function achievements(snapshot) {
    return [
      { icon: "🌱", title: "Primeiros passos", text: "Respondeu a primeira questão", unlocked: snapshot.total >= 1 },
      { icon: "🔥", title: "Pegando ritmo", text: "Respondeu 5 questões", unlocked: snapshot.total >= 5 },
      { icon: "🧭", title: "Explorador", text: "Praticou 3 matérias diferentes", unlocked: snapshot.practiced >= 3 },
      { icon: "🎯", title: "Na mira", text: "80% de acertos em 5+ questões", unlocked: snapshot.total >= 5 && snapshot.accuracy >= 80 },
      { icon: "⭐", title: "Colecionador", text: "Chegou a 100 pontos", unlocked: snapshot.points >= 100 },
      { icon: "📚", title: "Meta semanal", text: "Cumpriu a meta de questões da semana", unlocked: snapshot.weekly >= snapshot.profile.weeklyGoal }
    ];
  }

  function recentActivity(records) {
    return [...records]
      .sort((a, b) => Date.parse(b.answer?.answeredAt || 0) - Date.parse(a.answer?.answeredAt || 0))
      .slice(0, 6);
  }

  function gradeLabel(value) {
    return ({ "1em":"1º ano do Ensino Médio", "2em":"2º ano do Ensino Médio", "3em":"3º ano do Ensino Médio", "pre":"Pré-vestibular", "outro":"Outro" })[value] || "Etapa não informada";
  }

  function render() {
    const user = currentUser();
    const profile = profileFor(user);
    const snapshot = buildSnapshot(profile);
    const badges = achievements(snapshot);
    const recent = recentActivity(snapshot.records);
    const weeklyPct = Math.min(100, Math.round((snapshot.weekly / Math.max(1, profile.weeklyGoal)) * 100));
    const strongest = [...snapshot.bySubject].filter((item) => item.answered).sort((a,b) => b.accuracy - a.accuracy)[0];

    const topTitle = document.querySelector(".topbar h1");
    if (topTitle) topTitle.textContent = "Perfil";
    const topEyebrow = document.querySelector(".topbar__eyebrow");
    if (topEyebrow) topEyebrow.textContent = "Sua conta M.E.N.T.E";
    const navLink = [...document.querySelectorAll('.sidebar__link')].find((link) => link.getAttribute("href")?.includes("desempenho.html"));
    if (navLink) navLink.innerHTML = '<span aria-hidden="true">◉</span> Perfil';

    main.innerHTML = `
      <div class="profile-page">
        <section class="profile-hero">
          <article class="profile-identity">
            <div class="profile-avatar" id="profile-avatar">${esc(initials(profile.name))}</div>
            <div class="profile-identity__copy">
              <p class="profile-eyebrow">Perfil do estudante</p>
              <h2 id="profile-display-name">${esc(profile.name)}</h2>
              <p class="profile-email">${esc(user.email || "E-mail não informado")}</p>
              <div class="profile-tags">
                <span class="profile-tag" id="profile-grade-tag">${esc(gradeLabel(profile.grade))}</span>
                ${profile.focus ? `<span class="profile-tag" id="profile-focus-tag">Foco: ${esc(profile.focus)}</span>` : ""}
              </div>
            </div>
            <button class="profile-edit-button" type="button" id="profile-edit">✎ Editar perfil</button>
          </article>

          <aside class="profile-sync">
            <div class="profile-sync__icon">☁</div>
            <strong>Seus dados, organizados</strong>
            <p>Por enquanto, as informações desta página ficam salvas neste dispositivo. A estrutura já está separada para futuramente sincronizar perfil, metas e progresso com o banco de dados.</p>
            <small>Salvamento local ativo</small>
          </aside>
        </section>

        <section class="profile-editor" id="profile-editor" hidden aria-label="Editar perfil">
          <div class="profile-editor__head">
            <div><h3>Editar perfil</h3><p>Esses campos poderão virar dados da tabela de usuários quando o banco for conectado.</p></div>
            <button class="profile-editor__close" type="button" id="profile-editor-close" aria-label="Fechar edição">×</button>
          </div>
          <form class="profile-form" id="profile-form">
            <label>Nome
              <input name="name" maxlength="60" required value="${esc(profile.name)}">
            </label>
            <label>Série / etapa
              <select name="grade">
                <option value="" ${!profile.grade?"selected":""}>Não informar agora</option>
                <option value="1em" ${profile.grade==="1em"?"selected":""}>1º ano do Ensino Médio</option>
                <option value="2em" ${profile.grade==="2em"?"selected":""}>2º ano do Ensino Médio</option>
                <option value="3em" ${profile.grade==="3em"?"selected":""}>3º ano do Ensino Médio</option>
                <option value="pre" ${profile.grade==="pre"?"selected":""}>Pré-vestibular</option>
                <option value="outro" ${profile.grade==="outro"?"selected":""}>Outro</option>
              </select>
            </label>
            <label class="profile-form__wide">Matéria que quero priorizar
              <select name="focus">
                <option value="" ${!profile.focus?"selected":""}>Deixar o roteiro decidir pelo desempenho</option>
                ${subjects.map((subject) => `<option value="${esc(subject.name)}" ${profile.focus===subject.name?"selected":""}>${subject.icon} ${esc(subject.name)}</option>`).join("")}
              </select>
            </label>
            <label>Meta de questões por semana
              <input type="number" name="weeklyGoal" min="1" max="100" value="${Number(profile.weeklyGoal) || 10}" required>
            </label>
            <label>Meta de acertos (%)
              <input type="number" name="targetAccuracy" min="40" max="100" value="${Number(profile.targetAccuracy) || 80}" required>
            </label>
            <div class="profile-form__actions"><button class="profile-secondary" type="button" id="profile-cancel">Cancelar</button><button class="profile-primary" type="submit">Salvar alterações</button></div>
            <p class="profile-form__status" id="profile-form-status" aria-live="polite"></p>
          </form>
        </section>

        <section class="profile-summary" aria-label="Resumo do perfil">
          <article class="profile-stat"><div class="profile-stat__icon">⭐</div><strong>${snapshot.points}</strong><span>pontos acumulados</span></article>
          <article class="profile-stat"><div class="profile-stat__icon">✓</div><strong>${snapshot.total}</strong><span>questões respondidas</span></article>
          <article class="profile-stat"><div class="profile-stat__icon">🎯</div><strong>${snapshot.total ? `${snapshot.accuracy}%` : "—"}</strong><span>taxa geral de acertos</span></article>
          <article class="profile-stat"><div class="profile-stat__icon">🔥</div><strong>${snapshot.streak}</strong><span>${snapshot.streak === 1 ? "dia seguido estudando" : "dias seguidos estudando"}</span></article>
        </section>

        <section class="profile-grid">
          <div class="profile-column">
            <article class="profile-panel">
              <div class="profile-panel__head"><div><h3>Desempenho por matéria</h3><p>Um resumo simples do que já foi respondido no banco de questões.</p></div><a class="profile-panel__link" href="questoes.html">Praticar →</a></div>
              <div class="subject-performance">
                ${snapshot.bySubject.map((item) => `<div class="subject-row" style="--subject-color:${item.color}"><div class="subject-row__name"><span class="subject-row__dot"></span><span>${item.icon} ${esc(item.name)}</span></div><div class="subject-row__bar"><span style="width:${item.accuracy}%"></span></div><div class="subject-row__score">${item.answered ? `${item.correct}/${item.answered} · ${item.accuracy}%` : "sem dados"}</div></div>`).join("")}
              </div>
            </article>

            <article class="profile-panel">
              <div class="profile-panel__head"><div><h3>Conquistas</h3><p>Pequenos marcos para acompanhar sua evolução.</p></div><span class="profile-panel__link">${badges.filter((item) => item.unlocked).length}/${badges.length} desbloqueadas</span></div>
              <div class="achievement-grid">
                ${badges.map((badge) => `<div class="achievement ${badge.unlocked ? "" : "is-locked"}"><div class="achievement__icon">${badge.unlocked ? badge.icon : "🔒"}</div><div><strong>${esc(badge.title)}</strong><span>${esc(badge.text)}</span></div></div>`).join("")}
              </div>
            </article>
          </div>

          <div class="profile-column">
            <article class="profile-goal">
              <div class="profile-goal__top"><strong>Meta desta semana</strong><span>${snapshot.weekly}/${profile.weeklyGoal} questões</span></div>
              <div class="profile-progress"><span style="width:${weeklyPct}%"></span></div>
              <p>${snapshot.weekly >= profile.weeklyGoal ? "Meta cumprida 🎉 Você pode aumentar a meta no seu perfil quando quiser." : `Faltam ${Math.max(0, profile.weeklyGoal - snapshot.weekly)} questões para concluir sua meta semanal.`}</p>
            </article>

            <article class="profile-panel">
              <div class="profile-panel__head"><div><h3>Seu objetivo</h3><p>Preferências que poderão orientar o roteiro e recomendações.</p></div></div>
              <div class="activity-list">
                <div class="activity-item"><div class="activity-item__icon">🎯</div><div><strong>Meta de acertos</strong><span>${profile.targetAccuracy}% de aproveitamento</span></div></div>
                <div class="activity-item"><div class="activity-item__icon">📚</div><div><strong>Prioridade</strong><span>${esc(profile.focus || "Automática pelo desempenho")}</span></div></div>
                <div class="activity-item"><div class="activity-item__icon">🏆</div><div><strong>Melhor matéria atual</strong><span>${strongest ? `${esc(strongest.name)} · ${strongest.accuracy}%` : "Responda questões para descobrir"}</span></div></div>
              </div>
            </article>

            <article class="profile-panel">
              <div class="profile-panel__head"><div><h3>Atividade recente</h3><p>As últimas questões registradas neste dispositivo.</p></div></div>
              ${recent.length ? `<div class="activity-list">${recent.map(({ question, answer }) => `<div class="activity-item"><div class="activity-item__icon">${answer.correct ? "✅" : "↻"}</div><div><strong>${esc(question.category)} · Questão ${esc(question.examNumber || question.id)}</strong><span>${answer.correct ? "Resposta correta" : "Questão respondida · vale revisar"}</span></div><time>${formatDate(answer.answeredAt)}</time></div>`).join("")}</div>` : `<div class="profile-empty">Quando você responder questões, suas atividades mais recentes vão aparecer aqui.<br><a class="profile-panel__link" href="questoes.html">Resolver uma questão →</a></div>`}
            </article>
          </div>
        </section>
      </div>`;

    bindEditor(user, profile);
  }

  function bindEditor(user, profile) {
    const editor = document.querySelector("#profile-editor");
    const open = document.querySelector("#profile-edit");
    const close = document.querySelector("#profile-editor-close");
    const cancel = document.querySelector("#profile-cancel");
    const form = document.querySelector("#profile-form");

    const hide = () => { editor.hidden = true; };
    open?.addEventListener("click", () => { editor.hidden = false; editor.scrollIntoView({ behavior: "smooth", block: "center" }); });
    close?.addEventListener("click", hide);
    cancel?.addEventListener("click", hide);

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim().slice(0, 60);
      const weeklyGoal = Math.min(100, Math.max(1, Number(data.get("weeklyGoal")) || 10));
      const targetAccuracy = Math.min(100, Math.max(40, Number(data.get("targetAccuracy")) || 80));
      const nextProfile = {
        version: 1,
        name,
        grade: String(data.get("grade") || ""),
        focus: String(data.get("focus") || ""),
        weeklyGoal,
        targetAccuracy,
        updatedAt: new Date().toISOString()
      };

      // Hoje: localStorage. Futuro: este objeto pode mapear diretamente para uma tabela `profiles`.
      saveJson(profileKey(user.email), nextProfile);
      saveJson(USER_KEY, { ...user, name });
      render();
    });
  }

  render();
})();