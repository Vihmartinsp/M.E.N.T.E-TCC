"use strict";

(() => {
  const USER_KEY = "mente-demo-user";
  const PROFILE_PREFIX = "mente-profile-v2:";
  const avatarEmoji = {
    brain:"🧠",rocket:"🚀",graduate:"🎓",owl:"🦉",star:"⭐",target:"🎯",chart:"📈",geometry:"📐",calculator:"🧮",lightning:"⚡",diamond:"💎",crown:"👑"
  };
  const avatarGradient = {
    brain:["#2E78EF","#173E78"],rocket:["#7C3AED","#4F46E5"],graduate:["#0F766E","#16835B"],owl:["#B45309","#F59E0B"],star:["#C2410C","#F7B32B"],target:["#BE185D","#DB2777"],chart:["#0284C7","#315B9D"],geometry:["#FF7A00","#D95D00"],calculator:["#9D4EDD","#6F2FCF"],lightning:["#F59E0B","#D97706"],diamond:["#0891B2","#2563EB"],crown:["#946C00","#F2C94C"]
  };
  const STREAK_PAGES = new Set(["roteiro","explicacoes","simulados","jogos","ranking","desempenho","plus"]);

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  }

  function currentProfile() {
    const user = readJson(USER_KEY, null);
    if (!user?.email) return null;
    return readJson(`${PROFILE_PREFIX}${String(user.email).trim().toLowerCase()}`, null);
  }

  function avatarTargets() {
    return [...document.querySelectorAll("#user-avatar, .user-menu__avatar")];
  }

  function scheduleRefresh() {
    [0, 120, 350, 800, 1500, 2800].forEach((ms) => setTimeout(refresh, ms));
  }

  function ensureAvatarSystem() {
    if (!document.querySelector('link[data-mente-avatar-css]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "avatar-editor.css?v=3";
      link.dataset.menteAvatarCss = "1";
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[data-mente-avatar-v3-css]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "avatar-editor-v3.css?v=4";
      link.dataset.menteAvatarV3Css = "1";
      document.head.appendChild(link);
    }
    if (window.MENTE_AVATAR?.version >= 3) return;
    if (document.querySelector('script[data-mente-avatar-system]')) return;
    const script = document.createElement("script");
    script.src = "avatar-system-v3.js?v=7";
    script.async = true;
    script.dataset.menteAvatarSystem = "1";
    script.onload = scheduleRefresh;
    document.head.appendChild(script);
  }

  function ensureStreakSystem() {
    if (!STREAK_PAGES.has(document.body.dataset.page || "")) return;
    if (!document.querySelector('link[data-mente-streak-css]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "streak-widget.css?v=1";
      link.dataset.menteStreakCss = "1";
      document.head.appendChild(link);
    }
    if (document.querySelector('script[data-mente-streak-system]')) return;
    const script = document.createElement("script");
    script.src = "streak-widget.js?v=1";
    script.async = true;
    script.dataset.menteStreakSystem = "1";
    document.head.appendChild(script);
  }

  function renameProfileLinks() {
    document.querySelectorAll('a[href*="desempenho.html"].sidebar__link').forEach((link) => {
      if (link.dataset.menteProfileNormalized === "1") return;
      link.dataset.menteProfileNormalized = "1";
      link.innerHTML = '<span aria-hidden="true">◉</span> Perfil';
      link.setAttribute("aria-label", "Perfil");
    });
  }

  function applyAvatar() {
    const targets = avatarTargets();
    if (!targets.length) return;

    if (window.MENTE_AVATAR?.hasCustom) {
      targets.forEach((el) => {
        if (!el.querySelector(".mente-avatar-svg")) window.MENTE_AVATAR.renderInto(el);
      });
      return;
    }

    const profile = currentProfile();
    const avatarId = profile?.avatar;
    if (!avatarId || !avatarEmoji[avatarId]) return;
    const [a,b] = avatarGradient[avatarId] || avatarGradient.brain;
    targets.forEach((el) => {
      if (el.dataset.menteAvatar === avatarId && !el.querySelector(".mente-avatar-svg")) return;
      el.dataset.menteAvatar = avatarId;
      el.textContent = avatarEmoji[avatarId];
      el.style.background = `linear-gradient(135deg,${a},${b})`;
      el.style.fontSize = "18px";
    });
  }

  function refresh() {
    renameProfileLinks();
    applyAvatar();
    ensureAvatarSystem();
    ensureStreakSystem();
  }

  ensureAvatarSystem();
  ensureStreakSystem();
  refresh();
  scheduleRefresh();

  // Algumas páginas recriam a barra superior via JavaScript. Mantemos a observação
  // por poucos segundos para capturar esses elementos sem deixar um observer permanente.
  const observer = new MutationObserver(() => refresh());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener("mente:profile-updated", scheduleRefresh);
  window.addEventListener("mente:account-updated", scheduleRefresh);
  window.addEventListener("mente:avatar-updated", scheduleRefresh);
  window.addEventListener("mente:supabase-ready", scheduleRefresh);
  window.addEventListener("load", () => {
    scheduleRefresh();
    setTimeout(() => observer.disconnect(), 4500);
  }, { once: true });

  setTimeout(() => observer.disconnect(), 6000);
})();
