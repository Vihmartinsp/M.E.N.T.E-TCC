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
    document.querySelectorAll('a[href*="desempenho.html"]').forEach((link) => {
      if (!link.classList.contains("sidebar__link")) return;
      link.innerHTML = '<span aria-hidden="true">◉</span> Perfil';
      link.setAttribute("aria-label", "Perfil");
    });
  }

  function applyAvatar() {
    const profile = currentProfile();
    const avatarId = profile?.avatar;
    if (!avatarId || !avatarEmoji[avatarId]) return;
    const el = document.querySelector("#user-avatar");
    if (!el) return;
    const [a,b] = avatarGradient[avatarId] || avatarGradient.brain;
    el.textContent = avatarEmoji[avatarId];
    el.style.background = `linear-gradient(135deg,${a},${b})`;
    el.style.fontSize = "18px";
  }

  function refresh() {
    renameProfileLinks();
    applyAvatar();
  }

  refresh();
  const observer = new MutationObserver(refresh);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("mente:profile-updated", refresh);
  window.addEventListener("mente:account-updated", refresh);
  window.addEventListener("load", () => setTimeout(refresh, 0), { once: true });
  setTimeout(() => observer.disconnect(), 7000);
})();
