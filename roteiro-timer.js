"use strict";

(() => {
  if (document.body.dataset.page !== "roteiro") return;
  const builder = document.querySelector("#roadmap-builder");
  const plan = document.querySelector("#roadmap-plan");
  const buildButton = document.querySelector("#build-roadmap");
  if (!builder || !plan || !buildButton) return;

  const STORAGE = "mente-roadmap-timer-v1";
  let intervalId = null;
  let state = readState();

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE) || "null") || { enabled:false, total:0, remaining:0, running:false, startedAt:null };
    } catch {
      return { enabled:false, total:0, remaining:0, running:false, startedAt:null };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE, JSON.stringify(state));
  }

  function clearTick() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }

  function format(seconds) {
    const safe = Math.max(0, Math.round(seconds));
    return `${String(Math.floor(safe / 60)).padStart(2,"0")}:${String(safe % 60).padStart(2,"0")}`;
  }

  function effectiveRemaining() {
    if (!state.running || !state.startedAt) return state.remaining;
    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    return Math.max(0, state.remaining - elapsed);
  }

  const firstBlock = builder.querySelector(".roadmap-builder__block");
  const timerBlock = document.createElement("div");
  timerBlock.className = "roadmap-builder__block";
  timerBlock.innerHTML = `
    <div class="roadmap-timer-choice">
      <div class="roadmap-timer-choice__copy">
        <strong>⏱️ Usar cronômetro no roteiro</strong>
        <small>Opcional. Se ativar, você controla o tempo com iniciar, pausar e reiniciar.</small>
      </div>
      <label class="roadmap-switch" aria-label="Ativar cronômetro do roteiro">
        <input type="checkbox" id="roadmap-timer-toggle" ${state.enabled ? "checked" : ""}>
        <span></span>
      </label>
    </div>`;
  firstBlock.insertAdjacentElement("afterend", timerBlock);

  const toggle = document.querySelector("#roadmap-timer-toggle");
  toggle.addEventListener("change", () => {
    state.enabled = toggle.checked;
    if (!state.enabled) {
      clearTick();
      state.running = false;
      state.startedAt = null;
      document.querySelector("#roadmap-timer-widget")?.remove();
    }
    saveState();
  });

  function ensureWidget() {
    if (!state.enabled || plan.hidden) return;
    let widget = document.querySelector("#roadmap-timer-widget");
    if (!widget) {
      widget = document.createElement("div");
      widget.className = "roadmap-timer-widget";
      widget.id = "roadmap-timer-widget";
      widget.innerHTML = `
        <div class="roadmap-timer-widget__clock">
          <span class="roadmap-timer-widget__icon">⏱️</span>
          <div><small>Tempo do roteiro</small><strong id="roadmap-timer-display">00:00</strong></div>
        </div>
        <div class="roadmap-timer-widget__actions">
          <button class="roadmap-timer-btn" id="roadmap-timer-start" type="button">Iniciar</button>
          <button class="roadmap-timer-btn roadmap-timer-btn--secondary" id="roadmap-timer-reset" type="button">Reiniciar</button>
        </div>`;
      const progress = plan.querySelector(".roadmap-progress");
      if (progress) progress.insertAdjacentElement("afterend", widget);
      else plan.prepend(widget);

      document.querySelector("#roadmap-timer-start")?.addEventListener("click", toggleRunning);
      document.querySelector("#roadmap-timer-reset")?.addEventListener("click", resetTimer);
    }
    refreshWidget();
  }

  function refreshWidget() {
    const widget = document.querySelector("#roadmap-timer-widget");
    if (!widget) return;
    const remaining = effectiveRemaining();
    document.querySelector("#roadmap-timer-display").textContent = format(remaining);
    const button = document.querySelector("#roadmap-timer-start");
    if (button) button.textContent = state.running ? "Pausar" : remaining <= 0 ? "Recomeçar" : "Iniciar";
    widget.classList.toggle("is-warning", remaining > 0 && remaining <= 300);
    widget.classList.toggle("is-finished", remaining <= 0);
  }

  function startTick() {
    clearTick();
    intervalId = setInterval(() => {
      const remaining = effectiveRemaining();
      refreshWidget();
      if (remaining <= 0) {
        state.remaining = 0;
        state.running = false;
        state.startedAt = null;
        saveState();
        clearTick();
      }
    }, 1000);
  }

  function toggleRunning() {
    if (effectiveRemaining() <= 0) {
      state.remaining = state.total;
      state.startedAt = null;
      state.running = false;
    }

    if (state.running) {
      state.remaining = effectiveRemaining();
      state.running = false;
      state.startedAt = null;
      clearTick();
    } else {
      state.running = true;
      state.startedAt = Date.now();
      startTick();
    }
    saveState();
    refreshWidget();
  }

  function resetTimer() {
    clearTick();
    state.remaining = state.total;
    state.running = false;
    state.startedAt = null;
    saveState();
    refreshWidget();
  }

  function prepareFromBuilder() {
    state.enabled = toggle.checked;
    if (!state.enabled) {
      document.querySelector("#roadmap-timer-widget")?.remove();
      saveState();
      return;
    }
    const minutes = Number(document.querySelector('input[name="study-time"]:checked')?.value || 40);
    clearTick();
    state.total = minutes * 60;
    state.remaining = state.total;
    state.running = false;
    state.startedAt = null;
    saveState();
    setTimeout(ensureWidget, 0);
  }

  buildButton.addEventListener("click", prepareFromBuilder);
  document.querySelector("#new-plan")?.addEventListener("click", () => {
    clearTick();
    state.running = false;
    state.startedAt = null;
    saveState();
    document.querySelector("#roadmap-timer-widget")?.remove();
  });

  if (state.running && state.startedAt) {
    const current = effectiveRemaining();
    if (current <= 0) {
      state.remaining = 0;
      state.running = false;
      state.startedAt = null;
      saveState();
    }
  }

  setTimeout(() => {
    if (state.enabled && !plan.hidden && state.total > 0) {
      ensureWidget();
      if (state.running) startTick();
    }
  }, 0);
})();
