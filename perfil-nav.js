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

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  }

  function currentProfile() {
    const user = readJson(USER_KEY, null);
    if (!user?.email) return null;
    return readJson(`${PROFILE_PREFIX}${String(user.email).trim().toLowerCase()}`, null);
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
    const profile = currentProfile();
    const avatarId = profile?.avatar;
    if (!avatarId || !avatarEmoji[avatarId]) return;
    const el = document.querySelector("#user-avatar");
    if (!el || el.dataset.menteAvatar === avatarId) return;
    const [a,b] = avatarGradient[avatarId] || avatarGradient.brain;
    el.dataset.menteAvatar = avatarId;
    el.textContent = avatarEmoji[avatarId];
    el.style.background = `linear-gradient(135deg,${a},${b})`;
    el.style.fontSize = "18px";
  }

  function refresh() {
    renameProfileLinks();
    applyAvatar();
  }

  refresh();

  // Algumas páginas criam a sidebar/topbar via JavaScript. Observamos apenas até
  // esses elementos existirem e, principalmente, não reescrevemos nós já tratados.
  const observer = new MutationObserver(() => {
    refresh();
    const navReady = document.querySelector('a[href*="desempenho.html"].sidebar__link');
    const avatarReady = document.querySelector("#user-avatar") || document.body.dataset.page === "desempenho";
    if (navReady && avatarReady) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener("mente:profile-updated", refresh);
  window.addEventListener("mente:account-updated", refresh);
  window.addEventListener("load", () => {
    refresh();
    setTimeout(() => observer.disconnect(), 1000);
  }, { once: true });

  setTimeout(() => observer.disconnect(), 3000);
})();
