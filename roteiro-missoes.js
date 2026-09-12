"use strict";

(() => {
  const PLAN_KEY = "mente-study-plan-v3";
  const PROGRESS_KEY = "mente-study-task-progress-v3";
  const ACTIVE_KEY = "mente-study-active-task-v3";
  const LEASE_KEY = "mente-study-timer-lease-v1";
  const POINTS_KEY = "mente-points";
  const tabId = (crypto?.randomUUID?.() || `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const client = window.menteSupabase || null;

  let timerId = null;
  let syncTimer = null;
  let lastTick = Date.now();
  let lastSyncedElapsed = -1;
  let currentUser = null;
  let banner = null;

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

  function plan() {
    const value = readJson(PLAN_KEY, null);
    return value?.version === 3 && Array.isArray(value.tasks) ? value : null;
  }

  function taskById(id) {
    return plan()?.tasks?.find((task) => task.id === id) || null;
  }

  function activeTask() {
    const id = localStorage.getItem(ACTIVE_KEY);
    return id ? taskById(id) : null;
  }

  function progressMap() {
    return readJson(PROGRESS_KEY, {});
  }

  function progressFor(task) {
    const map = progressMap();
    const existing = map[task.id] || {};
    return {
      elapsedSeconds: Math.max(0, Number(existing.elapsedSeconds) || 0),
      actionCount: Math.max(0, Number(existing.actionCount) || 0),
      answeredIds: Array.isArray(existing.answeredIds) ? existing.answeredIds.map(Number).filter(Boolean) : [],
      completed: Boolean(existing.completed),
      rewarded: Boolean(existing.rewarded),
      startedAt: Number(existing.startedAt) || null,
      lastActivityAt: Number(existing.lastActivityAt) || null,
      source: existing.source || "local"
    };
  }

  function writeProgress(task, patch) {
    const map = progressMap();
    const prev = progressFor(task);
    map[task.id] = { ...prev, ...patch, lastActivityAt: Date.now() };
    saveJson(PROGRESS_KEY, map);
    window.dispatchEvent(new CustomEvent("mente:mission-progress", { detail: { taskId: task.id, progress: map[task.id] } }));
    return map[task.id];
  }

  function formatSeconds(seconds) {
    const safe = Math.max(0, Math.floor(Number(seconds) || 0));
    const min = Math.floor(safe / 60);
    return `${min}:${String(safe % 60).padStart(2, "0")}`;
  }

  function pageName() {
    return location.pathname.split("/").pop() || "index.html";
  }

  function selectedQuestion() {
    return readJson("mente-selected-question", null);
  }

  function normalizedHash() {
    return decodeURIComponent(location.hash.replace(/^#/, "")).trim().toLowerCase();
  }

  function matchesTaskPage(task) {
    const page = pageName();
    if (task.type === "explanation" || task.type === "review") {
      if (page !== "explicacoes.html") return false;
      const hash = normalizedHash();
      return !hash || hash === String(task.subjectSlug || "").toLowerCase();
    }
    if (task.type === "practice" || task.type === "bonus") {
      if (page === "questao.html") {
        return selectedQuestion()?.category === task.subject;
      }
      if (page === "questoes.html") {
        const params = new URLSearchParams(location.search);
        const fromUrl = params.get("materia");
        const filter = document.querySelector("#area-filter")?.value;
        return (fromUrl || filter) === task.subject;
      }
      return false;
    }
    if (task.type === "simulado") return page === "simulados.html";
    return false;
  }

  function canCount(task) {
    return Boolean(task && !progressFor(task).completed && document.visibilityState === "visible" && document.hasFocus() && matchesTaskPage(task));
  }

  function readLease() {
    return readJson(LEASE_KEY, null);
  }

  function ownsLease(task) {
    const lease = readLease();
    return lease?.taskId === task.id && lease?.tabId === tabId && Number(lease.expiresAt) > Date.now();
  }

  function acquireLease(task) {
    const now = Date.now();
    const lease = readLease();
    if (lease && lease.taskId === task.id && lease.tabId !== tabId && Number(lease.expiresAt) > now) return false;
    saveJson(LEASE_KEY, { taskId: task.id, tabId, expiresAt: now + 3500 });
    return true;
  }

  function releaseLease(task) {
    const lease = readLease();
    if (lease?.taskId === task?.id && lease?.tabId === tabId) localStorage.removeItem(LEASE_KEY);
  }

  function updatePoints(value) {
    const points = Math.max(0, Number(value) || 0);
    localStorage.setItem(POINTS_KEY, String(points));
    document.querySelectorAll(".score strong, #points, #global-points").forEach((el) => { el.textContent = String(points); });
  }

  function completeLocally(task) {
    let progress = progressFor(task);
    if (progress.completed) return progress;
    if (progress.elapsedSeconds < task.requiredSeconds) return progress;
    if (progress.actionCount < task.requiredActions) return progress;

    if (currentUser) {
      syncProgress(task, true);
      return progress;
    }

    const patch = { completed: true, source: "local" };
    if (!progress.rewarded) {
      const total = Number(localStorage.getItem(POINTS_KEY) || 0) + Number(task.points || 0);
      updatePoints(total);
      patch.rewarded = true;
    }
    progress = writeProgress(task, patch);
    showToast(`✅ Missão concluída: ${task.title}${task.points ? ` · +${task.points} pontos` : ""}`);
    return progress;
  }

  function showToast(message) {
    document.querySelector(".roadmap-mission-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "roadmap-mission-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
  }

  function ensureBanner() {
    const task = activeTask();
    if (!task || pageName() === "roteiro.html") {
      banner?.remove();
      banner = null;
      return;
    }
    if (!banner) {
      banner = document.createElement("aside");
      banner.className = "roadmap-mission-banner";
      banner.innerHTML = `
        <div class="roadmap-mission-banner__main">
          <span class="roadmap-mission-banner__dot"></span>
          <div><small>Missão do roteiro</small><strong data-mission-title></strong><span data-mission-status></span></div>
        </div>
        <div class="roadmap-mission-banner__progress"><div><span data-mission-time></span><span data-mission-actions></span></div><div class="roadmap-mission-banner__track"><span></span></div></div>
        <a href="roteiro.html">Voltar ao roteiro</a>`;
      document.body.appendChild(banner);
    }
  }

  function refreshBanner(task = activeTask()) {
    if (!task) {
      ensureBanner();
      return;
    }
    ensureBanner();
    if (!banner) return;
    const progress = progressFor(task);
    const timePct = task.requiredSeconds ? Math.min(100, (progress.elapsedSeconds / task.requiredSeconds) * 100) : 100;
    const actionPct = task.requiredActions ? Math.min(100, (progress.actionCount / task.requiredActions) * 100) : 100;
    const pct = progress.completed ? 100 : Math.min(timePct, actionPct);
    const counting = canCount(task) && ownsLease(task);
    const lease = readLease();
    const otherTab = canCount(task) && !ownsLease(task) && lease?.taskId === task.id && lease?.tabId !== tabId && Number(lease?.expiresAt) > Date.now();
    banner.style.setProperty("--mission-color", task.color || "#315b9d");
    banner.querySelector("[data-mission-title]").textContent = task.title;
    banner.querySelector("[data-mission-status]").textContent = progress.completed ? "Concluída" : counting ? "Tempo contando" : otherTab ? "Contando em outra aba" : matchesTaskPage(task) ? "Pausado — volte para esta aba" : "Pausado — atividade diferente";
    banner.querySelector("[data-mission-time]").textContent = `${formatSeconds(progress.elapsedSeconds)} / ${formatSeconds(task.requiredSeconds)}`;
    banner.querySelector("[data-mission-actions]").textContent = task.requiredActions ? `${Math.min(progress.actionCount, task.requiredActions)}/${task.requiredActions} respostas` : "Tempo ativo";
    banner.querySelector(".roadmap-mission-banner__track span").style.width = `${Math.max(0, Math.min(100, pct))}%`;
    banner.classList.toggle("is-counting", counting);
    banner.classList.toggle("is-complete", progress.completed);
  }

  async function loadUser() {
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      currentUser = data.session?.user || null;
      return currentUser;
    } catch {
      return null;
    }
  }

  async function hydrateRemoteProgress() {
    const currentPlan = plan();
    if (!client || !currentUser || !currentPlan?.tasks?.length) return;
    try {
      const ids = currentPlan.tasks.map((task) => task.id);
      const { data, error } = await client.from("roteiro_missoes")
        .select("task_id,elapsed_seconds,action_count,points_awarded,completed_at,started_at")
        .in("task_id", ids);
      if (error) throw error;
      const map = progressMap();
      (data || []).forEach((row) => {
        const task = taskById(row.task_id);
        if (!task) return;
        const local = progressFor(task);
        map[task.id] = {
          ...local,
          elapsedSeconds: Math.max(local.elapsedSeconds, Number(row.elapsed_seconds) || 0),
          actionCount: Math.max(local.actionCount, Number(row.action_count) || 0),
          completed: Boolean(local.completed || row.completed_at),
          rewarded: Boolean(local.rewarded || Number(row.points_awarded) > 0),
          startedAt: local.startedAt || (row.started_at ? Date.parse(row.started_at) : null),
          source: "supabase"
        };
      });
      saveJson(PROGRESS_KEY, map);
      window.dispatchEvent(new CustomEvent("mente:mission-progress"));
    } catch (error) {
      console.warn("[M.E.N.T.E] Não foi possível carregar o progresso do roteiro:", error);
    }
  }

  async function syncProgress(task, force = false) {
    if (!client || !currentUser || !task) return;
    const progress = progressFor(task);
    if (!force && progress.elapsedSeconds === lastSyncedElapsed) return;
    lastSyncedElapsed = progress.elapsedSeconds;
    try {
      const currentPlan = plan();
      const { data, error } = await client.rpc("atualizar_missao_roteiro", {
        p_task_id: task.id,
        p_plan_id: currentPlan?.id || "roteiro-local",
        p_materia: task.subject,
        p_tipo: task.type,
        p_required_seconds: task.requiredSeconds,
        p_elapsed_seconds: Math.floor(progress.elapsedSeconds)
      });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) return;
      const completedNow = Boolean(row.completed);
      const wasCompleted = progress.completed;
      writeProgress(task, {
        elapsedSeconds: Math.max(progress.elapsedSeconds, Number(row.elapsed_seconds) || 0),
        actionCount: Math.max(progress.actionCount, Number(row.action_count) || 0),
        completed: completedNow,
        rewarded: Boolean(progress.rewarded || Number(row.points_awarded) > 0),
        source: "supabase"
      });
      if (Number.isFinite(Number(row.points_total))) updatePoints(row.points_total);
      if (completedNow && !wasCompleted) showToast(`✅ Missão concluída: ${task.title} · +${Number(row.points_awarded) || task.points || 0} pontos`);
    } catch (error) {
      console.warn("[M.E.N.T.E] Falha ao sincronizar missão:", error);
    }
  }

  function registerQuestionAnswer(detail = {}) {
    const task = activeTask();
    if (!task || !["practice", "bonus"].includes(task.type)) return;
    const subject = detail.subject || selectedQuestion()?.category;
    if (subject !== task.subject) return;
    const questionId = Number(detail.questionId || selectedQuestion()?.id || 0);
    if (!questionId) return;
    const progress = progressFor(task);
    const ids = new Set(progress.answeredIds);
    ids.add(questionId);
    writeProgress(task, { answeredIds: [...ids], actionCount: ids.size });
    completeLocally(task);
    refreshBanner(task);
    setTimeout(() => syncProgress(task, true), 1200);
  }

  function startTask(task) {
    if (!task) return;
    localStorage.setItem(ACTIVE_KEY, task.id);
    const progress = progressFor(task);
    if (!progress.startedAt) writeProgress(task, { startedAt: Date.now() });
    lastTick = Date.now();
    lastSyncedElapsed = -1;
    setTimeout(() => syncProgress(task, true), 0);
  }

  function tick() {
    const task = activeTask();
    const now = Date.now();
    if (!task) {
      lastTick = now;
      ensureBanner();
      return;
    }

    if (!canCount(task)) {
      releaseLease(task);
      lastTick = now;
      refreshBanner(task);
      return;
    }

    if (!acquireLease(task)) {
      lastTick = now;
      refreshBanner(task);
      return;
    }

    const delta = Math.max(0, Math.min(2, Math.floor((now - lastTick) / 1000)));
    lastTick = now;
    if (delta > 0) {
      const progress = progressFor(task);
      const elapsed = Math.min(task.requiredSeconds, progress.elapsedSeconds + delta);
      writeProgress(task, { elapsedSeconds: elapsed, startedAt: progress.startedAt || now });
      completeLocally(task);
    }
    refreshBanner(task);
  }

  function scheduleSync() {
    clearInterval(syncTimer);
    syncTimer = setInterval(() => {
      const task = activeTask();
      if (task) syncProgress(task, false);
    }, 5000);
  }

  function pauseAndSync() {
    const task = activeTask();
    if (!task) return;
    releaseLease(task);
    lastTick = Date.now();
    syncProgress(task, true);
    refreshBanner(task);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("[data-roadmap-task-id]");
    if (link) {
      const task = taskById(link.dataset.roadmapTaskId);
      if (task) startTask(task);
      return;
    }

    const answerButton = event.target.closest?.("#complete");
    if (!answerButton) return;
    const task = activeTask();
    if (!task || !["practice", "bonus"].includes(task.type)) return;
    const before = progressFor(task).answeredIds.length;
    setTimeout(() => {
      const q = selectedQuestion();
      if (!q || q.category !== task.subject) return;
      const answers = readJson("mente-answers", {});
      if (!answers[q.id]) return;
      const after = progressFor(task).answeredIds.length;
      if (after === before || !progressFor(task).answeredIds.includes(Number(q.id))) {
        registerQuestionAnswer({ questionId: q.id, subject: q.category });
      }
    }, 80);
  }, true);

  window.addEventListener("mente:question-answered", (event) => registerQuestionAnswer(event.detail || {}));
  window.addEventListener("storage", (event) => {
    if ([PROGRESS_KEY, ACTIVE_KEY, LEASE_KEY].includes(event.key)) {
      refreshBanner();
      window.dispatchEvent(new CustomEvent("mente:mission-progress"));
    }
  });
  window.addEventListener("focus", () => { lastTick = Date.now(); refreshBanner(); });
  window.addEventListener("blur", pauseAndSync);
  window.addEventListener("pagehide", pauseAndSync);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") pauseAndSync();
    else { lastTick = Date.now(); refreshBanner(); }
  });
  window.addEventListener("hashchange", () => { lastTick = Date.now(); refreshBanner(); });

  async function init() {
    await loadUser();
    await hydrateRemoteProgress();
    ensureBanner();
    timerId = setInterval(tick, 1000);
    scheduleSync();
    tick();
  }

  init();
})();
