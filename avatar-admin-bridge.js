"use strict";

(() => {
  function apply() {
    const target = document.querySelector("#admin-avatar");
    if (!target || !window.MENTE_AVATAR?.hasCustom) return;
    window.MENTE_AVATAR.renderInto(target);
    target.style.overflow = "hidden";
    target.style.padding = "0";
    target.style.background = "transparent";
  }

  function loadAvatarSystem() {
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
    if (window.MENTE_AVATAR?.version >= 3) { apply(); return; }
    if (document.querySelector('script[data-mente-avatar-system]')) return;
    const script = document.createElement("script");
    script.src = "avatar-system-v3.js?v=7";
    script.async = true;
    script.dataset.menteAvatarSystem = "1";
    script.onload = () => { apply(); setTimeout(apply, 450); };
    document.head.appendChild(script);
  }

  loadAvatarSystem();
  window.addEventListener("mente:avatar-updated", apply);
  window.addEventListener("mente:supabase-ready", () => setTimeout(apply, 500));
  window.addEventListener("load", () => { apply(); setTimeout(apply, 900); }, { once:true });
})();
