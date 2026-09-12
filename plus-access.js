"use strict";

(() => {
  const CACHE_KEY = "mente-plus-state-v3";
  const PREVIEW_KEY = "mente-admin-plan-preview-v1";
  const STAFF_ROLES = new Set(["admin", "super_admin"]);
  const PREMIUM_AVATARS = new Set(["chart", "geometry", "calculator", "lightning", "diamond", "crown"]);

  const state = {
    plan: "convencional",
    actualActive: false,
    active: false,
    startedAt: null,
    expiresAt: null,
    trialUsed: false,
    role: "aluno",
    preview: "real",
    loaded: false,
  };

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached) Object.assign(state, cached);
      const preview = localStorage.getItem(PREVIEW_KEY);
      if (["real", "convencional", "plus"].includes(preview)) state.preview = preview;
    } catch {}
    if (state.actualActive && state.expiresAt && Date.parse(state.expiresAt) <= Date.now()) {
      state.actualActive = false;
      state.plan = "convencional";
    }
  }

  function saveCache() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        plan: state.plan,
        actualActive: state.actualActive,
        startedAt: state.startedAt,
        expiresAt: state.expiresAt,
        trialUsed: state.trialUsed,
        role: state.role,
        loaded: state.loaded,
      }));
    } catch {}
  }

  function isStaff() {
    return STAFF_ROLES.has(String(state.role || "").toLowerCase());
  }

  function effectiveActive() {
    if (isStaff() && state.preview === "plus") return true;
    if (isStaff() && state.preview === "convencional") return false;
    return Boolean(state.actualActive);
  }

  function formatDate(value) {
    const date = new Date(value || "");
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  }

  function snapshotKey() {
    return JSON.stringify({
      plan: state.plan,
      actualActive: state.actualActive,
      active: state.active,
      startedAt: state.startedAt,
      expiresAt: state.expiresAt,
      trialUsed: state.trialUsed,
      role: state.role,
      preview: state.preview,
      loaded: state.loaded,
    });
  }

  function emit() {
    try { window.dispatchEvent(new CustomEvent("mente:plan-updated", { detail: { ...state } })); } catch {}
  }

  function ensureStyles() {
    if (document.querySelector("#mente-plus-access-styles")) return;
    const style = document.createElement("style");
    style.id = "mente-plus-access-styles";
    style.textContent = `
      .plus-nav-badge{margin-left:auto;padding:2px 6px;border-radius:999px;background:linear-gradient(135deg,#F7B32B,#F2C94C);color:#3f2c00;font-size:9px;font-weight:900;letter-spacing:.4px}
      .mente-plan-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border-radius:999px;border:1px solid #d9e2ef;background:#fff;color:#51617c;font-size:11px;font-weight:800;white-space:nowrap;text-decoration:none}
      .mente-plan-chip.is-plus{border-color:#ecd47c;background:#fff9dc;color:#725300}
      .mente-plan-chip.is-plus::before{content:"★";color:#d29a00}
      .mente-plan-chip.is-preview{border-style:dashed}
      .mente-admin-plan-switch{display:flex;align-items:center;gap:6px;padding:4px 6px 4px 9px;border:1px solid #e4d7ff;border-radius:12px;background:#faf8ff;color:#5b3fb7;font-size:10px;font-weight:900;white-space:nowrap}
      .mente-admin-plan-switch select{height:30px;padding:0 26px 0 8px;border:1px solid #d9cef8;border-radius:8px;background:#fff;color:#40326f;font:inherit;font-size:10px;font-weight:800;cursor:pointer;outline:none}
      .plus-lockable{position:relative}
      .plus-lockable.is-plus-locked{filter:saturate(.8)}
      .plus-lockable.is-plus-locked::after{content:"PLUS";position:absolute;top:8px;right:8px;z-index:4;padding:3px 7px;border-radius:999px;background:linear-gradient(135deg,#7C3AED,#4F46E5);color:#fff;font-size:9px;font-weight:900;letter-spacing:.5px;box-shadow:0 5px 16px rgba(79,70,229,.22)}
      .sim-custom.plus-lockable.is-plus-locked{padding:16px;border:1px dashed #d8ccff;border-radius:14px;background:linear-gradient(135deg,#faf8ff,#fff)}
      .sim-custom.plus-lockable.is-plus-locked::before{content:"Personalização de quantidade e tempo é um recurso M.E.N.T.E Plus";position:absolute;inset:0;z-index:3;display:grid;place-items:center;padding:18px;border-radius:14px;background:rgba(255,255,255,.9);color:#5b3fb7;text-align:center;font-size:12px;font-weight:800}
      .profile-avatar-option.is-plus-locked{opacity:.68}
      .profile-avatar-option.is-plus-locked::after{top:4px;right:4px;font-size:8px;padding:2px 5px}
      .mente-plus-profile-card{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;margin:18px 0;padding:20px 22px;border:1px solid #e6dcff;border-radius:20px;background:linear-gradient(135deg,#fbf9ff 0%,#fff8da 100%);box-shadow:0 12px 30px rgba(58,52,93,.08)}
      .mente-plus-profile-card small{display:block;margin-bottom:5px;color:#7C3AED;font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase}
      .mente-plus-profile-card strong{display:block;color:#17213a;font-size:19px}
      .mente-plus-profile-card p{margin:6px 0 0;color:#60708a;font-size:13px;line-height:1.5}
      .mente-plus-profile-card a{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 16px;border-radius:12px;background:linear-gradient(135deg,#7C3AED,#4F46E5);color:#fff;text-decoration:none;font-weight:800;white-space:nowrap}
      .mente-plus-profile-card.is-active{border-color:#f0d46c;background:linear-gradient(135deg,#fffcef,#fff8cf)}
      .mente-plus-profile-card.is-admin-preview{border-style:dashed}
      .mente-plus-modal[hidden]{display:none!important}
      .mente-plus-modal{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:rgba(11,30,59,.55)}
      .mente-plus-modal__card{width:min(470px,100%);padding:26px;border-radius:22px;background:#fff;box-shadow:0 26px 80px rgba(0,0,0,.24)}
      .mente-plus-modal__icon{display:grid;place-items:center;width:48px;height:48px;border-radius:15px;background:linear-gradient(135deg,#7C3AED,#F2C94C);color:#fff;font-size:23px}
      .mente-plus-modal h3{margin:14px 0 8px;color:#17213a;font-size:22px}.mente-plus-modal p{margin:0;color:#64748b;line-height:1.55}
      .mente-plus-modal__actions{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}.mente-plus-modal button,.mente-plus-modal a{min-height:40px;padding:0 14px;border-radius:11px;border:0;font:inherit;font-weight:800;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}.mente-plus-modal button{background:#eef2f7;color:#334155}.mente-plus-modal a{background:#4F46E5;color:#fff}
      @media(max-width:900px){.mente-admin-plan-switch{display:none}}
      @media(max-width:720px){.mente-plus-profile-card{grid-template-columns:1fr}.mente-plan-chip{display:none}.mente-plus-profile-card a{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    let modal = document.querySelector("#mente-plus-modal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "mente-plus-modal";
    modal.id = "mente-plus-modal";
    modal.hidden = true;
    modal.innerHTML = `<div class="mente-plus-modal__card" role="dialog" aria-modal="true"><div class="mente-plus-modal__icon">★</div><h3>Recurso M.E.N.T.E Plus</h3><p id="mente-plus-modal-copy">Este recurso faz parte da experiência Plus.</p><div class="mente-plus-modal__actions"><button type="button" data-plus-close>Agora não</button><a href="plus.html">Conhecer o Plus</a></div></div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-plus-close]")) modal.hidden = true;
    });
    return modal;
  }

  function openUpgrade(feature) {
    const modal = ensureModal();
    const copy = modal.querySelector("#mente-plus-modal-copy");
    if (copy) copy.textContent = `${feature || "Este recurso"} faz parte do M.E.N.T.E Plus.${isStaff() ? " Como administrador, selecione Plus no controle de visualização para testar sem mudar seu plano real." : ""}`;
    modal.hidden = false;
  }

  function ensureNav() {
    const nav = document.querySelector(".sidebar__nav");
    if (!nav) return;
    let link = nav.querySelector('a[href*="plus.html"]');
    if (!link) {
      link = document.createElement("a");
      link.className = "sidebar__link";
      link.href = "plus.html";
      link.innerHTML = '<span aria-hidden="true">★</span><span>M.E.N.T.E Plus</span>';
      const home = [...nav.querySelectorAll("a")].find((item) => item.getAttribute("href")?.includes("index.html"));
      if (home) home.before(link); else nav.appendChild(link);
    }
    let badge = link.querySelector(".plus-nav-badge");
    if (!badge) {
      badge = document.createElement("b");
      badge.className = "plus-nav-badge";
      link.appendChild(badge);
    }
    badge.textContent = state.active ? "ATIVO" : "PLUS";
  }

  function ensureTopChip() {
    const actions = document.querySelector(".topbar__actions");
    if (!actions) return;
    let chip = actions.querySelector(".mente-plan-chip");
    if (!chip) {
      chip = document.createElement("a");
      chip.href = "plus.html";
      chip.className = "mente-plan-chip";
      const score = actions.querySelector(".score");
      if (score) score.before(chip); else actions.prepend(chip);
    }
    chip.classList.toggle("is-plus", state.active);
    chip.classList.toggle("is-preview", isStaff() && state.preview !== "real");
    chip.textContent = isStaff() && state.preview !== "real"
      ? `Prévia: ${state.active ? "Plus" : "Convencional"}`
      : state.active ? "M.E.N.T.E Plus" : "Plano Convencional";
  }

  function ensureAdminSwitcher() {
    const actions = document.querySelector(".topbar__actions");
    if (!actions) return;
    let wrap = actions.querySelector(".mente-admin-plan-switch");
    if (!isStaff()) {
      wrap?.remove();
      return;
    }
    if (!wrap) {
      wrap = document.createElement("label");
      wrap.className = "mente-admin-plan-switch";
      wrap.innerHTML = `👑 Visualizar <select aria-label="Prévia de plano"><option value="real">Plano real</option><option value="convencional">Convencional</option><option value="plus">Plus</option></select>`;
      const score = actions.querySelector(".score");
      if (score) score.before(wrap); else actions.prepend(wrap);
      wrap.querySelector("select").addEventListener("change", (event) => {
        state.preview = ["real", "convencional", "plus"].includes(event.target.value) ? event.target.value : "real";
        try { localStorage.setItem(PREVIEW_KEY, state.preview); } catch {}
        applyState(true);
      });
    }
    const select = wrap.querySelector("select");
    if (select) select.value = state.preview;
  }

  function decoratePremiumSurfaces() {
    document.querySelectorAll(".profile-avatar-option[data-avatar-id]").forEach((button) => {
      if (!PREMIUM_AVATARS.has(button.dataset.avatarId)) return;
      button.dataset.plusOnly = "1";
      button.dataset.plusFeature = "Este avatar especial";
      button.classList.add("plus-lockable");
      button.classList.toggle("is-plus-locked", !state.active);
    });
    const custom = document.querySelector(".sim-custom");
    if (custom) {
      custom.dataset.plusOnly = "1";
      custom.dataset.plusFeature = "A personalização de quantidade e tempo do simulado";
      custom.classList.add("plus-lockable");
      custom.classList.toggle("is-plus-locked", !state.active);
    }
  }

  function ensureProfileCard() {
    if (document.body.dataset.page !== "desempenho") return;
    const page = document.querySelector(".profile-page");
    const hero = document.querySelector(".profile-hero");
    if (!page || !hero) return;
    let card = page.querySelector(".mente-plus-profile-card");
    if (!card) {
      card = document.createElement("section");
      card.className = "mente-plus-profile-card";
      hero.insertAdjacentElement("afterend", card);
    }
    const previewing = isStaff() && state.preview !== "real";
    card.classList.toggle("is-active", state.active);
    card.classList.toggle("is-admin-preview", previewing);
    const key = `${state.active}:${previewing}:${state.preview}:${state.expiresAt || ""}`;
    if (card.dataset.renderKey === key) return;
    card.dataset.renderKey = key;
    if (previewing) {
      card.innerHTML = `<div><small>Prévia administrativa</small><strong>${state.active ? "★ Visualizando M.E.N.T.E Plus" : "Visualizando Plano Convencional"}</strong><p>Essa prévia não altera seu plano real.</p></div><a href="plus.html">Comparar planos →</a>`;
    } else if (state.active) {
      card.innerHTML = `<div><small>Seu plano</small><strong>★ M.E.N.T.E Plus ativo</strong><p>Recursos premium liberados${state.expiresAt ? ` até ${formatDate(state.expiresAt)}` : ""}.</p></div><a href="plus.html">Ver benefícios →</a>`;
    } else {
      card.innerHTML = `<div><small>Seu plano</small><strong>Plano Convencional</strong><p>Você tem acesso às ferramentas essenciais; o Plus adiciona personalização e recursos avançados.</p></div><a href="plus.html">Conhecer o Plus →</a>`;
    }
  }

  function refreshUi() {
    ensureStyles();
    ensureNav();
    ensureAdminSwitcher();
    ensureTopChip();
    decoratePremiumSurfaces();
    ensureProfileCard();
  }

  function applyState(emitEvent = false) {
    const before = snapshotKey();
    state.active = effectiveActive();
    document.documentElement.dataset.mentePlan = state.active ? "plus" : "convencional";
    document.documentElement.dataset.mentePlanPreview = isStaff() ? state.preview : "real";
    saveCache();
    refreshUi();
    if (emitEvent && before !== snapshotKey()) emit();
  }

  async function refreshRemote() {
    const client = window.menteSupabase;
    if (!client) return state;
    const before = snapshotKey();
    try {
      const { data: sessionData } = await client.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        Object.assign(state, { plan: "convencional", actualActive: false, startedAt: null, expiresAt: null, trialUsed: false, role: "aluno", loaded: true });
        applyState(false);
        if (before !== snapshotKey()) emit();
        return state;
      }

      const [statusRes, roleRes] = await Promise.all([
        client.rpc("mente_plus_status"),
        client.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
      ]);

      const row = Array.isArray(statusRes.data) ? statusRes.data[0] : statusRes.data;
      Object.assign(state, {
        plan: row?.plano || "convencional",
        actualActive: Boolean(row?.plus_ativo),
        startedAt: row?.plus_iniciado_em || null,
        expiresAt: row?.plus_expira_em || null,
        trialUsed: Boolean(row?.plus_teste_usado),
        role: roleRes.data?.role || "aluno",
        loaded: true,
      });
      applyState(false);
      if (before !== snapshotKey()) emit();
    } catch (error) {
      console.warn("[M.E.N.T.E Plus] Falha ao carregar plano; mantendo a interface local.", error);
      state.loaded = true;
      applyState(false);
    }
    return state;
  }

  document.addEventListener("click", (event) => {
    if (state.active) return;
    const locked = event.target.closest?.("[data-plus-only]");
    if (!locked) return;
    event.preventDefault();
    event.stopPropagation();
    openUpgrade(locked.dataset.plusFeature || "Este recurso");
  }, true);

  readCache();
  applyState(false);

  window.MENTE_PLUS = {
    get state() { return { ...state }; },
    isActive: () => Boolean(state.active),
    openUpgrade,
    refresh: refreshRemote,
    formatDate,
  };

  window.addEventListener("mente:supabase-ready", () => refreshRemote(), { once: true });
  window.addEventListener("mente:plan-refresh", () => refreshRemote());
  window.addEventListener("mente:profile-updated", () => refreshUi());
  window.addEventListener("load", () => refreshUi(), { once: true });

  // Atualizações pontuais para páginas cujo conteúdo é montado por outros scripts.
  setTimeout(refreshUi, 120);
  setTimeout(refreshUi, 500);
  setTimeout(refreshUi, 1200);
  setTimeout(() => { if (window.menteSupabase) refreshRemote(); }, 450);
})();
