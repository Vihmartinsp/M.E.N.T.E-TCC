"use strict";

(() => {
  const CACHE_KEY = "mente-plus-state-v4";
  const PREVIEW_KEY = "mente-admin-plan-preview-v1";
  const PREMIUM_AVATARS = new Set(["chart", "geometry", "calculator", "lightning", "diamond", "crown"]);
  const STAFF_ROLES = new Set(["admin", "super_admin"]);

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
      if (cached) {
        state.plan = cached.plan || "convencional";
        state.actualActive = Boolean(cached.actualActive);
        state.startedAt = cached.startedAt || null;
        state.expiresAt = cached.expiresAt || null;
        state.trialUsed = Boolean(cached.trialUsed);
      }
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
      }));
    } catch {}
  }

  function isStaff() { return STAFF_ROLES.has(String(state.role || "").toLowerCase()); }
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

  function emit() {
    try { window.dispatchEvent(new CustomEvent("mente:plan-updated", { detail: { ...state } })); } catch {}
  }

  function applyState(emitEvent = true) {
    state.active = effectiveActive();
    document.documentElement.dataset.mentePlan = state.active ? "plus" : "convencional";
    document.documentElement.dataset.mentePlanPreview = isStaff() ? state.preview : "real";
    saveCache();
    refreshUi();
    if (emitEvent) emit();
  }

  function ensureStyles() {
    if (document.querySelector("#mente-plus-access-styles")) return;
    const style = document.createElement("style");
    style.id = "mente-plus-access-styles";
    style.textContent = `
      .plus-nav-badge{margin-left:auto;padding:2px 6px;border-radius:999px;background:linear-gradient(135deg,#F7B32B,#F2C94C);color:#3f2c00;font-size:9px;font-weight:900}
      .mente-plan-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid #d9e2ef;border-radius:999px;background:#fff;color:#51617c;font-size:11px;font-weight:800;text-decoration:none;white-space:nowrap}
      .mente-plan-chip.is-plus{border-color:#ecd47c;background:#fff9dc;color:#725300}.mente-plan-chip.is-preview{border-style:dashed}
      .mente-admin-plan-switch{display:flex;align-items:center;gap:6px;padding:4px 6px 4px 9px;border:1px solid #e4d7ff;border-radius:12px;background:#faf8ff;color:#5b3fb7;font-size:10px;font-weight:900;white-space:nowrap}
      .mente-admin-plan-switch select{height:30px;padding:0 26px 0 8px;border:1px solid #d9cef8;border-radius:8px;background:#fff;color:#40326f;font:inherit;font-size:10px;font-weight:800}
      .plus-lockable{position:relative}.plus-lockable.is-plus-locked{filter:saturate(.8)}
      .plus-lockable.is-plus-locked::after{content:"PLUS";position:absolute;top:8px;right:8px;z-index:4;padding:3px 7px;border-radius:999px;background:linear-gradient(135deg,#7C3AED,#4F46E5);color:#fff;font-size:9px;font-weight:900}
      .sim-custom.plus-lockable.is-plus-locked{padding:16px;border:1px dashed #d8ccff;border-radius:14px;background:#fff}
      .sim-custom.plus-lockable.is-plus-locked::before{content:"Personalização de quantidade e tempo é um recurso M.E.N.T.E Plus";position:absolute;inset:0;z-index:3;display:grid;place-items:center;padding:18px;border-radius:14px;background:rgba(255,255,255,.94);color:#5b3fb7;text-align:center;font-size:12px;font-weight:800}
      .profile-avatar-option.is-plus-locked{opacity:.68}.profile-avatar-option.is-plus-locked::after{top:4px;right:4px;font-size:8px;padding:2px 5px}
      .mente-plus-profile-card{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;margin:18px 0;padding:20px 22px;border:1px solid #e6dcff;border-radius:20px;background:linear-gradient(135deg,#fbf9ff,#fff8da);box-shadow:0 12px 30px rgba(58,52,93,.08)}
      .mente-plus-profile-card small{display:block;margin-bottom:5px;color:#7C3AED;font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase}.mente-plus-profile-card strong{display:block;color:#17213a;font-size:19px}.mente-plus-profile-card p{margin:6px 0 0;color:#60708a;font-size:13px;line-height:1.5}.mente-plus-profile-card a{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 16px;border-radius:12px;background:#4F46E5;color:#fff;text-decoration:none;font-weight:800}.mente-plus-profile-card.is-active{border-color:#f0d46c;background:linear-gradient(135deg,#fffcef,#fff8cf)}.mente-plus-profile-card.is-admin-preview{border-style:dashed}
      .mente-plus-modal[hidden]{display:none!important}.mente-plus-modal{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:rgba(11,30,59,.55)}.mente-plus-modal__card{width:min(470px,100%);padding:26px;border-radius:22px;background:#fff;box-shadow:0 26px 80px rgba(0,0,0,.24)}.mente-plus-modal__icon{display:grid;place-items:center;width:48px;height:48px;border-radius:15px;background:linear-gradient(135deg,#7C3AED,#F2C94C);color:#fff;font-size:23px}.mente-plus-modal h3{margin:14px 0 8px;color:#17213a;font-size:22px}.mente-plus-modal p{margin:0;color:#64748b;line-height:1.55}.mente-plus-modal__actions{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}.mente-plus-modal button,.mente-plus-modal a{min-height:40px;padding:0 14px;border-radius:11px;border:0;font:inherit;font-weight:800;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}.mente-plus-modal button{background:#eef2f7;color:#334155}.mente-plus-modal a{background:#4F46E5;color:#fff}
      @media(max-width:900px){.mente-admin-plan-switch{display:none}}@media(max-width:720px){.mente-plus-profile-card{grid-template-columns:1fr}.mente-plan-chip{display:none}}
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    let modal = document.querySelector("#mente-plus-modal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "mente-plus-modal";
    modal.className = "mente-plus-modal";
    modal.hidden = true;
    modal.innerHTML = `<div class="mente-plus-modal__card" role="dialog" aria-modal="true"><div class="mente-plus-modal__icon">★</div><h3>Recurso M.E.N.T.E Plus</h3><p id="mente-plus-modal-copy"></p><div class="mente-plus-modal__actions"><button type="button" data-plus-close>Agora não</button><a href="plus.html">Conhecer o Plus</a></div></div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", (event) => { if (event.target === modal || event.target.closest("[data-plus-close]")) modal.hidden = true; });
    return modal;
  }

  function openUpgrade(feature) {
    const modal = ensureModal();
    const extra = isStaff() ? " Como administrador, você pode usar o seletor Visualizar no topo para testar o Plus sem alterar seu plano real." : "";
    modal.querySelector("#mente-plus-modal-copy").textContent = `${feature || "Este recurso"} faz parte do M.E.N.T.E Plus.${extra}`;
    modal.hidden = false;
  }

  function ensureNav() {
    const nav = document.querySelector(".sidebar__nav");
    if (!nav) return;
    let plus = nav.querySelector('a[href*="plus.html"]');
    if (!plus) {
      plus = document.createElement("a"); plus.className = "sidebar__link"; plus.href = "plus.html"; plus.innerHTML = '<span>★</span><span>M.E.N.T.E Plus</span>';
      const home = [...nav.querySelectorAll("a")].find((a) => a.getAttribute("href")?.includes("index.html"));
      if (home) home.before(plus); else nav.appendChild(plus);
    }
    let badge = plus.querySelector(".plus-nav-badge");
    if (!badge) { badge = document.createElement("b"); badge.className = "plus-nav-badge"; plus.appendChild(badge); }
    badge.textContent = state.active ? "ATIVO" : "PLUS";

    let review = nav.querySelector('a[href*="revisao-plus.html"]');
    if (state.active && !review) {
      review = document.createElement("a"); review.className = "sidebar__link"; review.href = "revisao-plus.html"; review.innerHTML = '<span>✦</span><span>Revisão Inteligente</span><b class="plus-nav-badge">PLUS</b>';
      plus.insertAdjacentElement("afterend", review);
    } else if (!state.active && review) review.remove();
  }

  function ensureAdminSwitcher() {
    const actions = document.querySelector(".topbar__actions");
    if (!actions) return;
    let wrap = actions.querySelector(".mente-admin-plan-switch");
    if (!isStaff()) { wrap?.remove(); return; }
    if (!wrap) {
      wrap = document.createElement("label"); wrap.className = "mente-admin-plan-switch";
      wrap.innerHTML = '👑 Visualizar <select aria-label="Visualizar plano"><option value="real">Plano real</option><option value="convencional">Convencional</option><option value="plus">Plus</option></select>';
      actions.prepend(wrap);
      wrap.querySelector("select").addEventListener("change", (event) => {
        state.preview = event.target.value;
        try { localStorage.setItem(PREVIEW_KEY, state.preview); } catch {}
        applyState();
      });
    }
    wrap.querySelector("select").value = state.preview;
  }

  function ensureTopChip() {
    const actions = document.querySelector(".topbar__actions"); if (!actions) return;
    let chip = actions.querySelector(".mente-plan-chip");
    if (!chip) { chip = document.createElement("a"); chip.href = "plus.html"; chip.className = "mente-plan-chip"; const score = actions.querySelector(".score"); if (score) score.before(chip); else actions.prepend(chip); }
    chip.classList.toggle("is-plus", state.active); chip.classList.toggle("is-preview", isStaff() && state.preview !== "real");
    chip.textContent = isStaff() && state.preview !== "real" ? `Prévia: ${state.active ? "Plus" : "Convencional"}` : state.active ? "M.E.N.T.E Plus" : "Plano Convencional";
  }

  function ensureProfileCard() {
    if (document.body.dataset.page !== "desempenho") return;
    const page = document.querySelector(".profile-page"), hero = document.querySelector(".profile-hero"); if (!page || !hero) return;
    let card = page.querySelector(".mente-plus-profile-card"); if (!card) { card = document.createElement("section"); card.className = "mente-plus-profile-card"; hero.insertAdjacentElement("afterend", card); }
    const preview = isStaff() && state.preview !== "real";
    card.classList.toggle("is-active", state.active); card.classList.toggle("is-admin-preview", preview);
    const key = `${state.active}:${preview}:${state.preview}`; if (card.dataset.key === key) return; card.dataset.key = key;
    card.innerHTML = preview
      ? `<div><small>Prévia administrativa</small><strong>${state.active ? "★ Visualizando Plus" : "Visualizando Convencional"}</strong><p>Essa prévia não altera o plano real da sua conta.</p></div><a href="plus.html">Comparar planos →</a>`
      : state.active
        ? `<div><small>Seu plano</small><strong>★ M.E.N.T.E Plus ativo</strong><p>Recursos premium, personalização e revisão inteligente estão liberados.</p></div><a href="revisao-plus.html">Abrir revisão inteligente →</a>`
        : `<div><small>Seu plano</small><strong>Plano Convencional</strong><p>As funções essenciais continuam liberadas. O Plus adiciona ferramentas avançadas.</p></div><a href="plus.html">Conhecer o Plus →</a>`;
  }

  function decoratePremium() {
    document.querySelectorAll(".profile-avatar-option[data-avatar-id]").forEach((button) => {
      if (!PREMIUM_AVATARS.has(button.dataset.avatarId)) return;
      button.dataset.plusOnly = "1"; button.dataset.plusFeature = "Este avatar especial"; button.classList.add("plus-lockable"); button.classList.toggle("is-plus-locked", !state.active);
    });
    const custom = document.querySelector(".sim-custom");
    if (custom) { custom.dataset.plusOnly = "1"; custom.dataset.plusFeature = "A personalização de quantidade e tempo do simulado"; custom.classList.add("plus-lockable"); custom.classList.toggle("is-plus-locked", !state.active); }
  }

  function refreshUi() { ensureStyles(); ensureNav(); ensureAdminSwitcher(); ensureTopChip(); ensureProfileCard(); decoratePremium(); }

  async function refreshRemote() {
    const client = window.menteSupabase;
    if (!client) { refreshUi(); return; }
    try {
      const { data: sessionData } = await client.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) { state.role = "aluno"; state.preview = "real"; state.actualActive = false; state.plan = "convencional"; state.loaded = true; applyState(); return; }
      const [roleRes, planRes] = await Promise.all([
        client.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
        client.rpc("mente_plus_status")
      ]);
      state.role = roleRes.data?.role || "aluno";
      if (isStaff()) {
        try { const saved = localStorage.getItem(PREVIEW_KEY); state.preview = ["real","convencional","plus"].includes(saved) ? saved : "real"; } catch { state.preview = "real"; }
      } else {
        state.preview = "real";
        try { localStorage.removeItem(PREVIEW_KEY); } catch {}
      }
      const row = Array.isArray(planRes.data) ? planRes.data[0] : planRes.data;
      state.plan = row?.plano || "convencional";
      state.actualActive = Boolean(row?.plus_ativo);
      state.startedAt = row?.plus_iniciado_em || null;
      state.expiresAt = row?.plus_expira_em || null;
      state.trialUsed = Boolean(row?.plus_teste_usado);
      state.loaded = true;
      applyState();
    } catch (error) {
      console.warn("[M.E.N.T.E Plus] Falha ao sincronizar plano.", error);
      refreshUi();
    }
  }

  document.addEventListener("click", (event) => {
    if (state.active) return;
    const locked = event.target.closest?.("[data-plus-only]");
    if (!locked) return;
    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.(); openUpgrade(locked.dataset.plusFeature);
  }, true);

  readCache();
  state.active = state.actualActive;
  document.documentElement.dataset.mentePlan = state.active ? "plus" : "convencional";
  window.MENTE_PLUS = { get state() { return { ...state }; }, isActive: () => Boolean(state.active), openUpgrade, refresh: refreshRemote, formatDate };
  window.addEventListener("mente:supabase-ready", refreshRemote);
  window.addEventListener("mente:role-ready", refreshRemote);
  window.addEventListener("mente:profile-updated", refreshUi);
  window.addEventListener("load", () => { refreshUi(); refreshRemote(); }, { once: true });
  setTimeout(refreshUi, 200);
  setTimeout(refreshRemote, 700);
})();
