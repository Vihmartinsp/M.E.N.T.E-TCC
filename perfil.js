"use strict";

(() => {
  if (document.body.dataset.page !== "desempenho") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  const USER_KEY = "mente-demo-user";
  const ANSWERS_KEY = "mente-answers";
  const POINTS_KEY = "mente-points";
  const PROFILE_PREFIX = "mente-profile-v2:";
  const OLD_PROFILE_PREFIX = "mente-profile-v1:";

  const subjects = [
    { name: "Geometria", icon: "📐", color: "#FF7A00" },
    { name: "Funções", icon: "ƒ", color: "#AB47BC" },
    { name: "Estatística e Probabilidade", icon: "📊", color: "#16803C" },
    { name: "Matemática Financeira", icon: "💰", color: "#D9A400" },
    { name: "Grandezas e Medidas", icon: "📏", color: "#D70101" },
    { name: "Gráficos e Tabelas", icon: "📈", color: "#0284C7" }
  ];

  const AVATARS = [
    { id: "brain", emoji: "🧠", label: "Mente", a: "#2E78EF", b: "#173E78" },
    { id: "rocket", emoji: "🚀", label: "Foguete", a: "#7C3AED", b: "#4F46E5" },
    { id: "graduate", emoji: "🎓", label: "Formando", a: "#0F766E", b: "#16835B" },
    { id: "owl", emoji: "🦉", label: "Coruja", a: "#B45309", b: "#F59E0B" },
    { id: "star", emoji: "⭐", label: "Estrela", a: "#C2410C", b: "#F7B32B" },
    { id: "target", emoji: "🎯", label: "Na mira", a: "#BE185D", b: "#DB2777" },
    { id: "chart", emoji: "📈", label: "Evolução", a: "#0284C7", b: "#315B9D" },
    { id: "geometry", emoji: "📐", label: "Geometria", a: "#FF7A00", b: "#D95D00" },
    { id: "calculator", emoji: "🧮", label: "Calculadora", a: "#9D4EDD", b: "#6F2FCF" },
    { id: "lightning", emoji: "⚡", label: "Raio", a: "#F59E0B", b: "#D97706" },
    { id: "diamond", emoji: "💎", label: "Diamante", a: "#0891B2", b: "#2563EB" },
    { id: "crown", emoji: "👑", label: "Coroa", a: "#946C00", b: "#F2C94C" }
  ];

  const FALLBACK_MEDALS = [
    { id: 1, nome: "Primeiro Acerto", descricao: "Acertou sua primeira questão.", icone: "🎯", requisito_tipo: "primeiro_acerto", requisito_valor: 1 },
    { id: 2, nome: "Embalado", descricao: "Alcançou 10 respostas corretas.", icone: "🔥", requisito_tipo: "acertos", requisito_valor: 10 },
    { id: 3, nome: "Mestre do ENEM", descricao: "Alcançou 50 respostas corretas.", icone: "🏆", requisito_tipo: "acertos", requisito_valor: 50 },
    { id: 4, nome: "100 XP", descricao: "Conquistou 100 pontos de experiência.", icone: "⭐", requisito_tipo: "xp", requisito_valor: 100 },
    { id: 5, nome: "500 XP", descricao: "Conquistou 500 pontos de experiência.", icone: "💎", requisito_tipo: "xp", requisito_valor: 500 }
  ];

  const modules = window.MENTE_FINAL_MODULES || {};
  let remote = { connected: false, profile: null, responses: null, medals: FALLBACK_MEDALS, earnedIds: new Set(), error: null };

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

  function oldProfileKey(email) {
    return `${OLD_PROFILE_PREFIX}${String(email || "local").trim().toLowerCase()}`;
  }

  function defaultProfile(user) {
    return {
      version: 2,
      name: user.name || String(user.email || "Aluno").split("@")[0],
      grade: "",
      focus: "",
      weeklyGoal: 10,
      targetAccuracy: 80,
      avatar: "brain",
      bio: "",
      updatedAt: null
    };
  }

  function profileFor(user) {
    const previous = readJson(oldProfileKey(user.email), {});
    const current = readJson(profileKey(user.email), {});
    const merged = { ...defaultProfile(user), ...previous, ...current, version: 2 };
    const remoteAvatar = String(remote.profile?.avatar_url || "");
    if (!current.avatar && remoteAvatar.startsWith("preset:")) merged.avatar = remoteAvatar.slice(7);
    if (remote.profile?.nome && !current.name && !previous.name) merged.name = remote.profile.nome;
    return merged;
  }

  function avatarFor(id) {
    return AVATARS.find((avatar) => avatar.id === id) || AVATARS[0];
  }

  function avatarStyle(avatar) {
    return `--avatar-a:${avatar.a};--avatar-b:${avatar.b}`;
  }

  function allQuestions() {
    return subjects.flatMap((subject) => modules[subject.name]?.questions || []);
  }

  function localAnswersMap() {
    return readJson(ANSWERS_KEY, {});
  }

  function effectiveAnswersMap() {
    if (!Array.isArray(remote.responses)) return localAnswersMap();
    const map = {};
    remote.responses.forEach((row) => {
      map[Number(row.questao_id)] = {
        correct: Boolean(row.acertou),
        answeredAt: row.respondida_em,
        source: "supabase"
      };
    });
    return map;
  }

  function answerRecords() {
    const answers = effectiveAnswersMap();
    return allQuestions()
      .map((question) => ({ question, answer: answers[question.id] }))
      .filter((item) => item.answer);
  }

  function subjectStats() {
    const answers = effectiveAnswersMap();
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
    if (remote.profile?.sequencia !== undefined && remote.profile?.sequencia !== null) {
      return Math.max(0, Number(remote.profile.sequencia) || 0);
    }
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

  function buildSnapshot(profile) {
    const records = answerRecords();
    const total = records.length;
    const correct = records.filter(({ answer }) => answer.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const weekly = lastSevenDays(records);
    const streak = studyStreak(records);
    const points = Math.max(0, Number(remote.profile?.pontos ?? localStorage.getItem(POINTS_KEY) ?? 0) || 0);
    const xp = Math.max(0, Number(remote.profile?.xp ?? 0) || 0);
    const coins = Math.max(0, Number(remote.profile?.moedas ?? 0) || 0);
    const level = Math.max(1, Number(remote.profile?.nivel ?? Math.floor(xp / 100) + 1) || 1);
    const bySubject = subjectStats();
    const practiced = bySubject.filter((item) => item.answered > 0).length;
    return { records, total, correct, accuracy, weekly, streak, points, xp, coins, level, bySubject, practiced, profile };
  }

  function recentActivity(records) {
    return [...records]
      .sort((a, b) => Date.parse(b.answer?.answeredAt || 0) - Date.parse(a.answer?.answeredAt || 0))
      .slice(0, 6);
  }

  function gradeLabel(value) {
    return ({ "1em":"1º ano do Ensino Médio", "2em":"2º ano do Ensino Médio", "3em":"3º ano do Ensino Médio", "pre":"Pré-vestibular", "outro":"Outro" })[value] || "Etapa não informada";
  }

  function levelTitle(level) {
    if (level >= 10) return "Lenda M.E.N.T.E";
    if (level >= 7) return "Mestre do ENEM";
    if (level >= 5) return "Estrategista";
    if (level >= 3) return "Explorador";
    return "Aprendiz";
  }

  function medalProgress(medal, snapshot) {
    const target = Math.max(1, Number(medal.requisito_valor) || 1);
    let current = 0;
    if (medal.requisito_tipo === "primeiro_acerto") current = snapshot.correct;
    else if (medal.requisito_tipo === "acertos") current = snapshot.correct;
    else if (medal.requisito_tipo === "xp") current = snapshot.xp;
    const pct = Math.min(100, Math.round((current / target) * 100));
    const unlocked = remote.earnedIds.has(Number(medal.id)) || current >= target;
    return { current, target, pct: unlocked ? 100 : pct, unlocked };
  }

  function nextMedal(snapshot) {
    return (remote.medals || FALLBACK_MEDALS)
      .map((medal) => ({ medal, progress: medalProgress(medal, snapshot) }))
      .filter((item) => !item.progress.unlocked)
      .sort((a, b) => b.progress.pct - a.progress.pct)[0] || null;
  }

  function renderMedals(snapshot) {
    const medals = remote.medals?.length ? remote.medals : FALLBACK_MEDALS;
    return medals.map((medal) => {
      const progress = medalProgress(medal, snapshot);
      return `<article class="profile-medal ${progress.unlocked ? "is-unlocked" : "is-locked"}">
        <div class="profile-medal__seal"><span>${progress.unlocked ? esc(medal.icone || "🏅") : "🔒"}</span></div>
        <div class="profile-medal__body">
          <div class="profile-medal__top"><strong>${esc(medal.nome)}</strong><span>${progress.unlocked ? "Conquistado" : `${progress.pct}%`}</span></div>
          <p>${esc(medal.descricao)}</p>
          <div class="profile-medal__track"><span style="width:${progress.pct}%"></span></div>
          <small>${progress.unlocked ? "Emblema desbloqueado" : `${Math.min(progress.current, progress.target)} / ${progress.target}`}</small>
        </div>
      </article>`;
    }).join("");
  }

  function connectionCard() {
    if (remote.connected) {
      return `<div class="profile-sync__icon">☁</div><strong>Perfil sincronizado</strong><p>Seu nível, XP, pontos, sequência, respostas e emblemas são carregados do Supabase M.E.N.T.E 2.</p><small>Sincronização online ativa</small>`;
    }
    return `<div class="profile-sync__icon">◌</div><strong>Modo local</strong><p>O perfil continua funcionando neste dispositivo. Assim que o banco responder, os dados online são carregados automaticamente.</p><small>Dados locais disponíveis</small>`;
  }

  function render() {
    const user = currentUser();
    const profile = profileFor(user);
    const snapshot = buildSnapshot(profile);
    const recent = recentActivity(snapshot.records);
    const weeklyPct = Math.min(100, Math.round((snapshot.weekly / Math.max(1, profile.weeklyGoal)) * 100));
    const strongest = [...snapshot.bySubject].filter((item) => item.answered).sort((a,b) => b.accuracy - a.accuracy)[0];
    const avatar = avatarFor(profile.avatar);
    const xpIntoLevel = snapshot.xp % 100;
    const xpPct = Math.min(100, xpIntoLevel);
    const next = nextMedal(snapshot);
    const unlockedCount = (remote.medals || FALLBACK_MEDALS).filter((medal) => medalProgress(medal, snapshot).unlocked).length;

    const topTitle = document.querySelector(".topbar h1");
    if (topTitle) topTitle.textContent = "Perfil";
    const topEyebrow = document.querySelector(".topbar__eyebrow");
    if (topEyebrow) topEyebrow.textContent = "Sua conta M.E.N.T.E";
    const navLink = [...document.querySelectorAll('.sidebar__link')].find((link) => link.getAttribute("href")?.includes("desempenho.html"));
    if (navLink) navLink.innerHTML = '<span aria-hidden="true">◉</span> Perfil';

    const topAvatar = document.querySelector("#user-avatar");
    if (topAvatar) {
      topAvatar.textContent = avatar.emoji;
      topAvatar.style.background = `linear-gradient(135deg,${avatar.a},${avatar.b})`;
      topAvatar.style.fontSize = "18px";
    }

    main.innerHTML = `
      <div class="profile-page">
        <section class="profile-hero profile-hero--premium">
          <article class="profile-identity profile-identity--premium">
            <div class="profile-avatar-wrap">
              <div class="profile-avatar" id="profile-avatar" style="${avatarStyle(avatar)}"><span>${avatar.emoji}</span></div>
              <span class="profile-level-pin">Nv. ${snapshot.level}</span>
            </div>
            <div class="profile-identity__copy">
              <p class="profile-eyebrow">${esc(levelTitle(snapshot.level))}</p>
              <h2 id="profile-display-name">${esc(profile.name)}</h2>
              <p class="profile-email">${esc(user.email || "E-mail não informado")}</p>
              ${profile.bio ? `<p class="profile-bio">“${esc(profile.bio)}”</p>` : ""}
              <div class="profile-tags">
                <span class="profile-tag">🎓 ${esc(gradeLabel(profile.grade))}</span>
                ${profile.focus ? `<span class="profile-tag">🎯 Foco: ${esc(profile.focus)}</span>` : `<span class="profile-tag">🧭 Foco automático</span>`}
                <span class="profile-tag">🔥 ${snapshot.streak} ${snapshot.streak === 1 ? "dia" : "dias"}</span>
              </div>
            </div>
            <button class="profile-edit-button" type="button" id="profile-edit">✦ Personalizar perfil</button>
          </article>

          <aside class="profile-level-card">
            <div class="profile-level-card__top"><div><small>Jornada M.E.N.T.E</small><strong>Nível ${snapshot.level}</strong></div><span>${snapshot.xp} XP</span></div>
            <div class="profile-level-card__title">${esc(levelTitle(snapshot.level))}</div>
            <div class="profile-level-track"><span style="width:${xpPct}%"></span></div>
            <div class="profile-level-card__foot"><span>${xpIntoLevel}/100 XP</span><span>Próximo nível →</span></div>
            <div class="profile-level-perks"><span>🪙 ${snapshot.coins} moedas</span><span>🏅 ${unlockedCount} emblemas</span></div>
          </aside>
        </section>

        <section class="profile-quick-actions" aria-label="Ações rápidas">
          <a href="roteiro.html"><span>◇</span><div><strong>Continuar roteiro</strong><small>Retome sua missão de estudo</small></div><b>→</b></a>
          <a href="simulados.html"><span>✓</span><div><strong>Fazer simulado</strong><small>Teste seu desempenho</small></div><b>→</b></a>
          <a href="questoes.html"><span>⌕</span><div><strong>Praticar questões</strong><small>Escolha uma matéria</small></div><b>→</b></a>
          <a href="explicacoes.html"><span>✦</span><div><strong>Revisar conteúdo</strong><small>Volte às explicações</small></div><b>→</b></a>
        </section>

        <section class="profile-editor" id="profile-editor" hidden aria-label="Editar perfil">
          <div class="profile-editor__head">
            <div><h3>Personalizar perfil</h3><p>Escolha como você quer aparecer no M.E.N.T.E e ajuste suas metas.</p></div>
            <button class="profile-editor__close" type="button" id="profile-editor-close" aria-label="Fechar edição">×</button>
          </div>
          <form class="profile-form" id="profile-form">
            <div class="profile-avatar-editor profile-form__wide">
              <div class="profile-avatar-editor__head"><strong>Escolha seu avatar</strong><span>Ele também aparece no topo das páginas que usam seu perfil.</span></div>
              <div class="profile-avatar-options">
                ${AVATARS.map((item) => `<button class="profile-avatar-option ${profile.avatar===item.id?"is-selected":""}" type="button" data-avatar-id="${item.id}" aria-label="Avatar ${esc(item.label)}" title="${esc(item.label)}" style="${avatarStyle(item)}"><span>${item.emoji}</span><small>${esc(item.label)}</small></button>`).join("")}
              </div>
              <input type="hidden" name="avatar" value="${esc(profile.avatar)}">
            </div>
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
            <label class="profile-form__wide">Frase do perfil
              <input name="bio" maxlength="100" placeholder="Ex.: Rumo aos 800+ em Matemática!" value="${esc(profile.bio)}">
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
          <article class="profile-stat"><div class="profile-stat__icon">⚡</div><strong>${snapshot.xp}</strong><span>XP total</span></article>
          <article class="profile-stat"><div class="profile-stat__icon">✓</div><strong>${snapshot.total}</strong><span>questões respondidas</span></article>
          <article class="profile-stat"><div class="profile-stat__icon">🎯</div><strong>${snapshot.total ? `${snapshot.accuracy}%` : "—"}</strong><span>taxa geral de acertos</span></article>
          <article class="profile-stat"><div class="profile-stat__icon">🔥</div><strong>${snapshot.streak}</strong><span>${snapshot.streak === 1 ? "dia de sequência" : "dias de sequência"}</span></article>
        </section>

        <section class="profile-showcase">
          <article class="profile-panel profile-medals-panel">
            <div class="profile-panel__head"><div><h3>🏅 Mural de emblemas</h3><p>Conquistas oficiais do M.E.N.T.E, com progresso até o próximo desbloqueio.</p></div><span class="profile-panel__link">${unlockedCount}/${(remote.medals || FALLBACK_MEDALS).length} conquistados</span></div>
            <div class="profile-medal-grid">${renderMedals(snapshot)}</div>
          </article>
          <aside class="profile-next-achievement">
            <span class="profile-next-achievement__spark">✦</span>
            <small>Próxima conquista</small>
            ${next ? `<strong>${esc(next.medal.icone || "🏅")} ${esc(next.medal.nome)}</strong><p>${esc(next.medal.descricao)}</p><div class="profile-next-track"><span style="width:${next.progress.pct}%"></span></div><b>${next.progress.pct}% concluído</b>` : `<strong>🏆 Coleção completa!</strong><p>Você desbloqueou todos os emblemas disponíveis até agora.</p><b>Continue estudando — novos emblemas podem chegar.</b>`}
          </aside>
        </section>

        <section class="profile-grid">
          <div class="profile-column">
            <article class="profile-panel">
              <div class="profile-panel__head"><div><h3>Desempenho por matéria</h3><p>Veja rapidamente onde você está mais forte e o que ainda precisa de treino.</p></div><a class="profile-panel__link" href="questoes.html">Praticar →</a></div>
              <div class="subject-performance">
                ${snapshot.bySubject.map((item) => `<div class="subject-row" style="--subject-color:${item.color}"><div class="subject-row__name"><span class="subject-row__dot"></span><span>${item.icon} ${esc(item.name)}</span></div><div class="subject-row__bar"><span style="width:${item.accuracy}%"></span></div><div class="subject-row__score">${item.answered ? `${item.correct}/${item.answered} · ${item.accuracy}%` : "sem dados"}</div></div>`).join("")}
              </div>
            </article>

            <article class="profile-panel">
              <div class="profile-panel__head"><div><h3>Atividade recente</h3><p>Suas últimas questões registradas.</p></div></div>
              ${recent.length ? `<div class="activity-list">${recent.map(({ question, answer }) => `<div class="activity-item"><div class="activity-item__icon">${answer.correct ? "✅" : "↻"}</div><div><strong>${esc(question.category)} · Questão ${esc(question.examNumber || question.id)}</strong><span>${answer.correct ? "Resposta correta" : "Questão respondida · vale revisar"}</span></div><time>${formatDate(answer.answeredAt)}</time></div>`).join("")}</div>` : `<div class="profile-empty">Quando você responder questões, suas atividades mais recentes vão aparecer aqui.<br><a class="profile-panel__link" href="questoes.html">Resolver uma questão →</a></div>`}
            </article>
          </div>

          <div class="profile-column">
            <article class="profile-goal">
              <div class="profile-goal__top"><strong>Meta desta semana</strong><span>${snapshot.weekly}/${profile.weeklyGoal} questões</span></div>
              <div class="profile-progress"><span style="width:${weeklyPct}%"></span></div>
              <p>${snapshot.weekly >= profile.weeklyGoal ? "Meta cumprida 🎉 Você pode aumentar a meta no seu perfil quando quiser." : `Faltam ${Math.max(0, profile.weeklyGoal - snapshot.weekly)} questões para concluir sua meta semanal.`}</p>
            </article>

            <article class="profile-panel">
              <div class="profile-panel__head"><div><h3>Seu objetivo</h3><p>Preferências que orientam sua rotina no M.E.N.T.E.</p></div></div>
              <div class="activity-list">
                <div class="activity-item"><div class="activity-item__icon">🎯</div><div><strong>Meta de acertos</strong><span>${profile.targetAccuracy}% de aproveitamento</span></div></div>
                <div class="activity-item"><div class="activity-item__icon">📚</div><div><strong>Prioridade</strong><span>${esc(profile.focus || "Automática pelo desempenho")}</span></div></div>
                <div class="activity-item"><div class="activity-item__icon">🏆</div><div><strong>Melhor matéria atual</strong><span>${strongest ? `${esc(strongest.name)} · ${strongest.accuracy}%` : "Responda questões para descobrir"}</span></div></div>
              </div>
            </article>

            <article class="profile-sync">${connectionCard()}</article>
          </div>
        </section>
      </div>`;

    bindEditor(user);
  }

  function bindEditor(user) {
    const editor = document.querySelector("#profile-editor");
    const open = document.querySelector("#profile-edit");
    const close = document.querySelector("#profile-editor-close");
    const cancel = document.querySelector("#profile-cancel");
    const form = document.querySelector("#profile-form");

    const hide = () => { editor.hidden = true; };
    open?.addEventListener("click", () => { editor.hidden = false; editor.scrollIntoView({ behavior: "smooth", block: "center" }); });
    close?.addEventListener("click", hide);
    cancel?.addEventListener("click", hide);

    document.querySelectorAll(".profile-avatar-option").forEach((button) => {
      button.addEventListener("click", () => {
        const avatarId = button.dataset.avatarId || "brain";
        document.querySelector('input[name="avatar"]').value = avatarId;
        document.querySelectorAll(".profile-avatar-option").forEach((item) => item.classList.toggle("is-selected", item === button));
      });
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim().slice(0, 60);
      const weeklyGoal = Math.min(100, Math.max(1, Number(data.get("weeklyGoal")) || 10));
      const targetAccuracy = Math.min(100, Math.max(40, Number(data.get("targetAccuracy")) || 80));
      const avatar = AVATARS.some((item) => item.id === String(data.get("avatar"))) ? String(data.get("avatar")) : "brain";
      const nextProfile = {
        version: 2,
        name,
        grade: String(data.get("grade") || ""),
        focus: String(data.get("focus") || ""),
        weeklyGoal,
        targetAccuracy,
        avatar,
        bio: String(data.get("bio") || "").trim().slice(0, 100),
        updatedAt: new Date().toISOString()
      };

      saveJson(profileKey(user.email), nextProfile);
      saveJson(USER_KEY, { ...user, name });
      try { window.dispatchEvent(new CustomEvent("mente:profile-updated", { detail: { profile: nextProfile } })); } catch {}

      const status = document.querySelector("#profile-form-status");
      if (remote.connected && window.menteSupabase) {
        try {
          const { data: sessionData } = await window.menteSupabase.auth.getSession();
          const authUser = sessionData?.session?.user;
          if (authUser) {
            const { error } = await window.menteSupabase.from("profiles").update({ nome: name, avatar_url: `preset:${avatar}` }).eq("id", authUser.id);
            if (error) throw error;
            if (remote.profile) remote.profile = { ...remote.profile, nome: name, avatar_url: `preset:${avatar}` };
            if (status) status.textContent = "Perfil salvo e sincronizado ✓";
          }
        } catch (error) {
          console.warn("[M.E.N.T.E] Perfil salvo localmente, mas não sincronizou:", error);
          if (status) status.textContent = "Perfil salvo neste dispositivo ✓";
        }
      }

      setTimeout(render, 250);
    });
  }

  function waitForClient(timeoutMs = 7000) {
    if (window.menteSupabase) return Promise.resolve(window.menteSupabase);
    return new Promise((resolve) => {
      const started = Date.now();
      const timer = setInterval(() => {
        if (window.menteSupabase) {
          clearInterval(timer);
          resolve(window.menteSupabase);
        } else if (Date.now() - started >= timeoutMs) {
          clearInterval(timer);
          resolve(null);
        }
      }, 200);
    });
  }

  async function syncOnline() {
    try {
      const client = await waitForClient();
      if (!client) return;
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      const authUser = sessionData?.session?.user;
      if (!authUser) return;

      const [profileRes, responsesRes, medalsRes, earnedRes] = await Promise.all([
        client.from("profiles").select("nome,avatar_url,xp,moedas,nivel,sequencia,pontos,created_at").eq("id", authUser.id).maybeSingle(),
        client.from("respostas").select("questao_id,acertou,respondida_em").eq("user_id", authUser.id),
        client.from("medalhas").select("id,nome,descricao,icone,requisito_tipo,requisito_valor").eq("ativa", true).order("id"),
        client.from("usuario_medalhas").select("medalha_id,conquistada_em").eq("user_id", authUser.id)
      ]);

      if (profileRes.error) throw profileRes.error;
      if (responsesRes.error) throw responsesRes.error;
      if (medalsRes.error) throw medalsRes.error;
      if (earnedRes.error) throw earnedRes.error;

      remote = {
        connected: true,
        profile: profileRes.data || null,
        responses: responsesRes.data || [],
        medals: medalsRes.data?.length ? medalsRes.data : FALLBACK_MEDALS,
        earnedIds: new Set((earnedRes.data || []).map((row) => Number(row.medalha_id))),
        error: null
      };

      const localUser = currentUser();
      saveJson(USER_KEY, {
        ...localUser,
        id: authUser.id,
        email: authUser.email || localUser.email,
        name: remote.profile?.nome || localUser.name,
        source: "supabase"
      });
      if (remote.profile?.pontos !== undefined) localStorage.setItem(POINTS_KEY, String(Math.max(0, Number(remote.profile.pontos) || 0)));
      render();
    } catch (error) {
      remote = { ...remote, connected: false, error };
      console.warn("[M.E.N.T.E] Perfil online indisponível; usando dados locais:", error);
      render();
    }
  }

  render();
  syncOnline();
})();
