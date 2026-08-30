"use strict";

(() => {
  const client = window.menteSupabase;
  const loading = document.querySelector("#admin-loading");
  const denied = document.querySelector("#admin-denied");
  const content = document.querySelector("#admin-content");
  const title = document.querySelector("#admin-page-title");
  const toastEl = document.querySelector("#admin-toast");

  const state = {
    user: null,
    role: null,
    profiles: [],
    roles: [],
    responses: [],
    questions: [],
    subjects: [],
    reviews: [],
  };

  const roleNames = {
    aluno: "Aluno",
    professor: "Professor(a)",
    admin: "Administrador(a)",
    super_admin: "Super Admin",
  };

  const subjectFallbackColors = {
    geometria: "#FF7A00",
    funcoes: "#9D4EDD",
    estatistica: "#16803C",
    financeira: "#D9A400",
    grandezas: "#D70101",
    graficos: "#0284C7",
  };

  const tabTitles = {
    overview: "Visão geral",
    students: "Alunos",
    questions: "Questões",
    team: "Equipe",
  };

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function toast(message, type = "success") {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.dataset.type = type;
    toastEl.hidden = false;
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => { toastEl.hidden = true; }, 3500);
  }

  function initials(name) {
    return (String(name || "A").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("") || "A").toUpperCase();
  }

  function formatDate(value) {
    const date = new Date(value || "");
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(date);
  }

  function dayKey(date) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function isToday(value) {
    return dayKey(value) === dayKey(new Date());
  }

  function roleMap() {
    return new Map(state.roles.map((row) => [row.user_id, row.role]));
  }

  function profileMap() {
    return new Map(state.profiles.map((row) => [row.id, row]));
  }

  function questionMap() {
    return new Map(state.questions.map((row) => [Number(row.id), row]));
  }

  function subjectMap() {
    return new Map(state.subjects.map((row) => [Number(row.id), row]));
  }

  function responsesForUser(userId) {
    return state.responses.filter((row) => row.user_id === userId);
  }

  function questionStats() {
    const stats = new Map();
    state.questions.forEach((q) => stats.set(Number(q.id), { attempts: 0, correct: 0, errors: 0 }));
    state.responses.forEach((response) => {
      const id = Number(response.questao_id);
      if (!stats.has(id)) stats.set(id, { attempts: 0, correct: 0, errors: 0 });
      const row = stats.get(id);
      row.attempts += 1;
      if (response.acertou) row.correct += 1; else row.errors += 1;
    });
    return stats;
  }

  function subjectStats() {
    const subjects = subjectMap();
    const questions = questionMap();
    const result = new Map();
    state.subjects.forEach((subject) => result.set(Number(subject.id), { subject, attempts: 0, correct: 0 }));
    state.responses.forEach((response) => {
      const question = questions.get(Number(response.questao_id));
      if (!question) return;
      if (!result.has(Number(question.materia_id))) {
        result.set(Number(question.materia_id), { subject: subjects.get(Number(question.materia_id)), attempts: 0, correct: 0 });
      }
      const bucket = result.get(Number(question.materia_id));
      bucket.attempts += 1;
      if (response.acertou) bucket.correct += 1;
    });
    return [...result.values()].filter((item) => item.subject);
  }

  function setAccountHeader() {
    const profile = state.profiles.find((item) => item.id === state.user?.id);
    const name = profile?.nome || state.user?.user_metadata?.name || state.user?.email?.split("@")[0] || "Admin";
    document.querySelector("#admin-name").textContent = name;
    document.querySelector("#admin-avatar").textContent = initials(name);
    document.querySelector("#admin-role-label").textContent = state.role === "super_admin" ? "👑 Super Admin M.E.N.T.E" : roleNames[state.role] || "Equipe M.E.N.T.E";
  }

  function renderSummary() {
    const roles = roleMap();
    const students = state.profiles.filter((profile) => (roles.get(profile.id) || "aluno") === "aluno");
    const totalResponses = state.responses.length;
    const correct = state.responses.filter((row) => row.acertou).length;
    const accuracy = totalResponses ? Math.round((correct / totalResponses) * 100) : 0;
    const activeToday = students.filter((profile) => isToday(profile.ultimo_acesso)).length;
    const points = students.reduce((sum, profile) => sum + Number(profile.pontos || 0), 0);
    const cards = [
      ["👨‍🎓", students.length, "alunos cadastrados"],
      ["✓", totalResponses, "respostas registradas"],
      ["🎯", `${accuracy}%`, "taxa geral de acertos"],
      ["●", activeToday, "alunos ativos hoje"],
      ["⭐", points, "pontos em circulação"],
    ];
    document.querySelector("#admin-summary").innerHTML = cards.map(([icon, value, label]) => `<article class="admin-stat"><div class="admin-stat__icon">${icon}</div><strong>${esc(value)}</strong><span>${esc(label)}</span></article>`).join("");
  }

  function renderAccuracy() {
    const total = state.responses.length;
    const correct = state.responses.filter((row) => row.acertou).length;
    const wrong = total - correct;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const donut = document.querySelector("#accuracy-donut");
    donut.style.setProperty("--accuracy", `${pct * 3.6}deg`);
    document.querySelector("#accuracy-donut-value").textContent = `${pct}%`;
    document.querySelector("#answers-total-label").textContent = `${total} ${total === 1 ? "resposta" : "respostas"}`;
    document.querySelector("#accuracy-legend").innerHTML = total ? `
      <div class="admin-legend__item"><i class="admin-legend__dot" style="background:#1769e0"></i><span>Acertos</span><strong>${correct}</strong></div>
      <div class="admin-legend__item"><i class="admin-legend__dot" style="background:#e8edf4"></i><span>Erros</span><strong>${wrong}</strong></div>` : '<div class="admin-empty">Ainda não há respostas suficientes para formar o gráfico.</div>';
  }

  function renderSubjectBars() {
    const rows = subjectStats();
    const root = document.querySelector("#subject-bars");
    if (!rows.some((row) => row.attempts)) {
      root.innerHTML = '<div class="admin-empty">Quando os alunos começarem a responder, a taxa de acerto de cada matéria aparecerá aqui.</div>';
      return;
    }
    root.innerHTML = rows.map(({ subject, attempts, correct }) => {
      const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
      const color = subject.cor || subjectFallbackColors[subject.slug] || "#1769e0";
      return `<div class="admin-bar-row"><div class="admin-bar-row__name" title="${esc(subject.nome)}">${esc(subject.nome)}</div><div class="admin-bar-row__track"><span style="width:${accuracy}%;--bar-color:${esc(color)}"></span></div><div class="admin-bar-row__value">${attempts ? `${accuracy}%` : "—"}</div></div>`;
    }).join("");
  }

  function lastSevenDays() {
    const days = [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      days.push({ date, key: dayKey(date), count: 0 });
    }
    const map = new Map(days.map((day) => [day.key, day]));
    state.responses.forEach((response) => {
      const key = dayKey(response.respondida_em);
      if (map.has(key)) map.get(key).count += 1;
    });
    return days;
  }

  function renderActivity() {
    const days = lastSevenDays();
    const max = Math.max(1, ...days.map((day) => day.count));
    const total = days.reduce((sum, day) => sum + day.count, 0);
    document.querySelector("#activity-total").textContent = `${total} no período`;
    document.querySelector("#activity-chart").innerHTML = days.map((day) => {
      const height = day.count ? Math.max(8, Math.round((day.count / max) * 145)) : 3;
      const label = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(day.date).replace(".", "");
      return `<div class="admin-day"><span class="admin-day__value">${day.count}</span><i class="admin-day__bar" style="height:${height}px"></i><span class="admin-day__label">${esc(label)}</span></div>`;
    }).join("");
  }

  function renderErrorRanking() {
    const qStats = questionStats();
    const subjects = subjectMap();
    const rows = state.questions.map((question) => {
      const stats = qStats.get(Number(question.id)) || { attempts: 0, errors: 0 };
      const subject = subjects.get(Number(question.materia_id));
      return { question, subject, ...stats, errorRate: stats.attempts ? Math.round((stats.errors / stats.attempts) * 100) : 0 };
    }).filter((row) => row.attempts > 0).sort((a, b) => b.errors - a.errors || b.errorRate - a.errorRate).slice(0, 5);
    const root = document.querySelector("#error-ranking");
    if (!rows.length) {
      root.innerHTML = '<div class="admin-empty">As questões com maior dificuldade aparecerão aqui depois das primeiras respostas.</div>';
      return;
    }
    root.innerHTML = rows.map((row, index) => `<div class="admin-error-item"><span class="admin-error-item__index">${index + 1}</span><div><strong>Questão ${esc(row.question.enem_numero || row.question.id)} · ${esc(row.subject?.nome || "Matemática")}</strong><span>${esc(row.question.topico || "Conteúdo")} · ${row.attempts} resposta(s)</span></div><em>${row.errorRate}% erros</em></div>`).join("");
  }

  function studentSnapshots() {
    const roles = roleMap();
    return state.profiles.map((profile) => {
      const responses = responsesForUser(profile.id);
      const correct = responses.filter((row) => row.acertou).length;
      const accuracy = responses.length ? Math.round((correct / responses.length) * 100) : 0;
      return { ...profile, role: roles.get(profile.id) || "aluno", responses: responses.length, correct, accuracy };
    });
  }

  function renderRankingAndStreaks() {
    const students = studentSnapshots().filter((item) => item.role === "aluno");
    const ranking = [...students].sort((a, b) => Number(b.xp || 0) - Number(a.xp || 0)).slice(0, 5);
    const streaks = [...students].sort((a, b) => Number(b.sequencia || 0) - Number(a.sequencia || 0)).slice(0, 5);
    document.querySelector("#admin-ranking").innerHTML = ranking.length ? `<div class="admin-rank-list">${ranking.map((row, index) => `<div class="admin-rank-row"><span class="admin-rank-row__pos">${index + 1}</span><div><strong>${esc(row.nome || row.email || "Aluno")}</strong><span>${row.responses} questões · ${row.accuracy}% acertos</span></div><em>${Number(row.xp || 0)} XP</em></div>`).join("")}</div>` : '<div class="admin-empty">Ainda não há alunos no ranking.</div>';
    document.querySelector("#admin-streaks").innerHTML = streaks.length ? `<div class="admin-streak-list">${streaks.map((row) => `<div class="admin-streak-row"><span class="admin-rank-row__pos">🔥</span><div><strong>${esc(row.nome || row.email || "Aluno")}</strong><span>${Number(row.pontos || 0)} pontos disponíveis</span></div><em>${Number(row.sequencia || 0)} dia(s)</em></div>`).join("")}</div>` : '<div class="admin-empty">As sequências dos alunos aparecerão aqui.</div>';
  }

  function roleBadge(role) {
    return `<span class="admin-role admin-role--${esc(role)}">${esc(roleNames[role] || role)}</span>`;
  }

  function renderStudents(filter = "") {
    const q = filter.trim().toLowerCase();
    const rows = studentSnapshots().filter((item) => (item.role === "aluno" || state.role === "super_admin") && (!q || `${item.nome || ""} ${item.email || ""}`.toLowerCase().includes(q)));
    const body = document.querySelector("#students-table");
    body.innerHTML = rows.length ? rows.map((row) => `<tr><td><div class="admin-person"><span class="admin-person__avatar">${esc(initials(row.nome || row.email))}</span><div><strong>${esc(row.nome || "Aluno")}</strong><span>${esc(row.email || "E-mail não informado")}</span></div></div></td><td>${roleBadge(row.role)}</td><td>${row.responses}</td><td>${row.correct}</td><td>${row.responses ? `${row.accuracy}%` : "—"}</td><td>${Number(row.xp || 0)}</td><td>${Number(row.pontos || 0)}</td><td>🔥 ${Number(row.sequencia || 0)}</td><td>${formatDate(row.ultimo_acesso)}</td></tr>`).join("") : '<tr><td colspan="9"><div class="admin-empty">Nenhuma conta encontrada.</div></td></tr>';
  }

  function renderQuestions(filter = "") {
    const q = filter.trim().toLowerCase();
    const stats = questionStats();
    const subjects = subjectMap();
    const canManage = ["admin", "super_admin"].includes(state.role);
    const rows = state.questions.filter((question) => {
      const subject = subjects.get(Number(question.materia_id));
      return !q || `${question.enem_numero || question.id} ${question.topico || ""} ${subject?.nome || ""}`.toLowerCase().includes(q);
    });
    document.querySelector("#questions-table").innerHTML = rows.length ? rows.map((question) => {
      const subject = subjects.get(Number(question.materia_id));
      const row = stats.get(Number(question.id)) || { attempts: 0, errors: 0 };
      const rate = row.attempts ? Math.round((row.errors / row.attempts) * 100) : 0;
      return `<tr><td><strong>Q${esc(question.enem_numero || question.id)}</strong><br><small>ENEM ${esc(question.enem_ano || "—")} · ${esc(question.topico || "")}</small></td><td>${esc(subject?.nome || "Matemática")}</td><td><select class="admin-level-select" data-question-level="${question.id}" ${canManage ? "" : "disabled"}>${[1,2,3,4,5].map((level) => `<option value="${level}" ${Number(question.nivel) === level ? "selected" : ""}>${"★".repeat(level)}</option>`).join("")}</select></td><td>${row.attempts}</td><td>${row.errors}</td><td>${row.attempts ? `${rate}%` : "—"}</td><td><label class="admin-toggle" title="${question.ativa ? "Questão ativa" : "Questão desativada"}"><input type="checkbox" data-question-active="${question.id}" ${question.ativa ? "checked" : ""} ${canManage ? "" : "disabled"}><span></span></label></td></tr>`;
    }).join("") : '<tr><td colspan="7"><div class="admin-empty">Nenhuma questão encontrada.</div></td></tr>';
  }

  function renderTeam() {
    const roles = roleMap();
    const canManage = state.role === "super_admin";
    document.querySelector("#team-table").innerHTML = state.profiles.map((profile) => {
      const role = roles.get(profile.id) || "aluno";
      const isSelf = profile.id === state.user.id;
      const locked = !canManage || isSelf || role === "super_admin";
      const options = ["aluno", "professor", "admin"];
      return `<tr><td><div class="admin-person"><span class="admin-person__avatar">${esc(initials(profile.nome || profile.email))}</span><div><strong>${esc(profile.nome || "Usuário")}</strong><span>${isSelf ? "Sua conta" : "Conta cadastrada"}</span></div></div></td><td>${esc(profile.email || "—")}</td><td>${roleBadge(role)}</td><td>${locked ? (isSelf ? '<span class="admin-role admin-role--super_admin">👑 Protegido</span>' : roleBadge(role)) : `<select class="admin-role-select" data-role-user="${profile.id}">${options.map((option) => `<option value="${option}" ${role === option ? "selected" : ""}>${esc(roleNames[option])}</option>`).join("")}</select>`}</td></tr>`;
    }).join("");
  }

  function renderAll() {
    setAccountHeader();
    renderSummary();
    renderAccuracy();
    renderSubjectBars();
    renderActivity();
    renderErrorRanking();
    renderRankingAndStreaks();
    renderStudents(document.querySelector("#student-search")?.value || "");
    renderQuestions(document.querySelector("#question-search")?.value || "");
    renderTeam();

    const teamNav = document.querySelector('[data-admin-tab="team"]');
    if (teamNav) teamNav.hidden = state.role !== "super_admin";
    const questionNav = document.querySelector('[data-admin-tab="questions"]');
    if (questionNav) questionNav.hidden = state.role === "professor";
  }

  async function loadData() {
    const queries = await Promise.all([
      client.from("profiles").select("id,nome,email,xp,pontos,nivel,sequencia,ultimo_acesso,created_at").order("created_at", { ascending: true }),
      client.from("user_roles").select("user_id,role,updated_at"),
      client.from("respostas").select("id,user_id,questao_id,acertou,pontos_ganhos,respondida_em"),
      client.from("questoes").select("id,materia_id,topico,nivel,enem_ano,enem_numero,ativa").order("id", { ascending: true }),
      client.from("materias").select("id,nome,slug,cor,ativa").order("ordem", { ascending: true }),
      client.from("revisoes_desbloqueadas").select("user_id,questao_id,custo_pontos,desbloqueada_em"),
    ]);
    const error = queries.find((result) => result.error)?.error;
    if (error) throw error;
    [state.profiles, state.roles, state.responses, state.questions, state.subjects, state.reviews] = queries.map((result) => result.data || []);
  }

  async function requireAccess() {
    if (!client) throw new Error("Supabase indisponível");
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;
    const user = sessionData.session?.user;
    if (!user) {
      location.replace("./login.html");
      return false;
    }
    state.user = user;
    const { data, error } = await client.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    state.role = data?.role || "aluno";
    return ["professor", "admin", "super_admin"].includes(state.role);
  }

  function switchTab(tab) {
    document.querySelectorAll("[data-admin-tab]").forEach((button) => button.classList.toggle("is-active", button.dataset.adminTab === tab));
    document.querySelectorAll("[data-tab-panel]").forEach((panel) => { panel.hidden = panel.dataset.tabPanel !== tab; });
    title.textContent = tabTitles[tab] || "Painel administrativo";
  }

  async function changeUserRole(userId, role, select) {
    const oldValue = state.roles.find((item) => item.user_id === userId)?.role || "aluno";
    select.disabled = true;
    const { error } = await client.from("user_roles").update({ role, updated_at: new Date().toISOString() }).eq("user_id", userId);
    select.disabled = false;
    if (error) {
      select.value = oldValue;
      toast("Não foi possível alterar a função desta conta.", "error");
      return;
    }
    const row = state.roles.find((item) => item.user_id === userId);
    if (row) row.role = role; else state.roles.push({ user_id: userId, role });
    renderAll();
    toast(`Função alterada para ${roleNames[role]}.`);
  }

  async function updateQuestion(id, patch, input) {
    input.disabled = true;
    const { error } = await client.from("questoes").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", Number(id));
    input.disabled = false;
    if (error) {
      toast("Não foi possível atualizar a questão.", "error");
      await refresh();
      return;
    }
    const question = state.questions.find((item) => Number(item.id) === Number(id));
    if (question) Object.assign(question, patch);
    toast("Questão atualizada com sucesso.");
  }

  async function refresh() {
    const button = document.querySelector("#admin-refresh");
    if (button) { button.disabled = true; button.textContent = "Atualizando..."; }
    try {
      await loadData();
      renderAll();
      toast("Estatísticas atualizadas.");
    } catch (error) {
      console.error(error);
      toast("Falha ao atualizar os dados.", "error");
    } finally {
      if (button) { button.disabled = false; button.textContent = "↻ Atualizar dados"; }
    }
  }

  document.querySelectorAll("[data-admin-tab]").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.adminTab)));
  document.querySelector("#student-search")?.addEventListener("input", (event) => renderStudents(event.target.value));
  document.querySelector("#question-search")?.addEventListener("input", (event) => renderQuestions(event.target.value));
  document.querySelector("#admin-refresh")?.addEventListener("click", refresh);

  document.addEventListener("change", (event) => {
    const roleSelect = event.target.closest?.("[data-role-user]");
    if (roleSelect) changeUserRole(roleSelect.dataset.roleUser, roleSelect.value, roleSelect);
    const levelSelect = event.target.closest?.("[data-question-level]");
    if (levelSelect) updateQuestion(levelSelect.dataset.questionLevel, { nivel: Number(levelSelect.value) }, levelSelect);
    const activeInput = event.target.closest?.("[data-question-active]");
    if (activeInput) updateQuestion(activeInput.dataset.questionActive, { ativa: activeInput.checked }, activeInput);
  });

  document.querySelector("#admin-logout")?.addEventListener("click", async () => {
    try { await client.auth.signOut(); } catch {}
    localStorage.removeItem("mente-demo-user");
    location.replace("./login.html");
  });

  async function init() {
    try {
      const allowed = await requireAccess();
      loading.hidden = true;
      if (!allowed) {
        denied.hidden = false;
        return;
      }
      await loadData();
      renderAll();
      content.hidden = false;
      switchTab("overview");
    } catch (error) {
      console.error("[M.E.N.T.E Admin]", error);
      loading.hidden = true;
      denied.hidden = false;
      denied.querySelector("p").textContent = "Não foi possível validar sua permissão ou carregar os dados do painel.";
    }
  }

  init();
})();
