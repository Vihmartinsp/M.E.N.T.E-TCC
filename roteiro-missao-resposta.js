"use strict";

(() => {
  const PLAN_KEY = "mente-study-plan-v3";
  const PROGRESS_KEY = "mente-study-task-progress-v3";
  const ACTIVE_KEY = "mente-study-active-task-v3";

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function currentTask() {
    const id = localStorage.getItem(ACTIVE_KEY);
    const plan = readJson(PLAN_KEY, null);
    return plan?.version === 3 ? plan.tasks?.find((task) => task.id === id) || null : null;
  }

  function selectedQuestion() {
    return readJson("mente-selected-question", null);
  }

  function registerCurrentAnswer() {
    const task = currentTask();
    if (!task || !["practice", "bonus"].includes(task.type)) return;
    const question = selectedQuestion();
    if (!question || question.category !== task.subject) return;

    const answers = readJson("mente-answers", {});
    const answer = answers[question.id];
    if (!answer) return;

    const map = readJson(PROGRESS_KEY, {});
    const progress = map[task.id] || {};
    const startedAt = Number(progress.startedAt) || 0;
    const answeredAt = answer.answeredAt ? Date.parse(answer.answeredAt) : Date.now();
    if (startedAt && Number.isFinite(answeredAt) && answeredAt + 2000 < startedAt) return;

    const ids = new Set(Array.isArray(progress.answeredIds) ? progress.answeredIds.map(Number) : []);
    ids.add(Number(question.id));
    map[task.id] = {
      ...progress,
      answeredIds: [...ids],
      actionCount: ids.size,
      lastActivityAt: Date.now()
    };
    saveJson(PROGRESS_KEY, map);
    window.dispatchEvent(new CustomEvent("mente:mission-progress", { detail: { taskId: task.id, progress: map[task.id] } }));
  }

  window.addEventListener("mente:account-updated", () => setTimeout(registerCurrentAnswer, 0));

  document.addEventListener("click", (event) => {
    if (!event.target.closest?.("#mente-final-answer,#complete")) return;
    setTimeout(registerCurrentAnswer, 120);
  }, true);
})();
