"use strict";

(() => {
  const MODE_KEY = "mente-avatar-random-last-mode-v1";

  const PROFILES = {
    masculino: {
      face: ["soft-square", "long", "oval", "diamond", "round"],
      hair: ["short", "quiff", "side-swept", "crop", "short-curls", "afro"],
      brows: ["straight", "thick", "feather", "short"],
      eyes: ["focused", "almond", "happy", "round", "soft"],
      nose: ["straight", "broad", "rounded", "button"],
      mouth: ["calm", "cheeky", "smile", "grin", "open"],
      faceDetail: ["none", "freckles", "freckles-light", "beauty-mark"],
      outfit: ["tee-white", "tee-black", "tee-green", "hoodie-cream", "hoodie-blue", "sweater-knit", "shirt-blue", "plaid", "denim", "varsity", "champion"],
      headwear: ["none", "cap-beige", "cap-black", "beanie-red", "bucket", "beret", "study-cap"],
      glasses: ["none", "round-black", "round-gold", "square", "sun"],
      jewelry: ["none", "gold-pendant", "moon", "headphones"]
    },
    feminino: {
      face: ["oval", "round", "heart", "diamond", "long", "soft-square"],
      hair: ["pixie", "short-curls", "bob", "lob", "straight", "waves", "curls", "ringlets", "afro", "bangs", "curtain", "pony", "low-pony", "bun", "half-up", "braid", "twin-braids", "space-buns", "side-pony"],
      brows: ["soft", "arched", "feather", "straight", "short"],
      eyes: ["almond", "doe", "cat", "soft", "happy", "round", "sparkle"],
      nose: ["button", "tiny", "rounded", "narrow", "straight"],
      mouth: ["smile", "grin", "soft", "lips", "open", "calm"],
      faceDetail: ["none", "blush", "freckles", "freckles-light", "hearts", "stars", "beauty-mark"],
      outfit: ["tee-white", "tee-black", "tee-pink", "tee-green", "hoodie-cream", "hoodie-pink", "hoodie-blue", "sweater-knit", "shirt-blue", "plaid", "denim", "varsity", "sailor", "dress-pink", "overalls", "champion"],
      headwear: ["none", "cap-beige", "cap-black", "beanie-red", "bucket", "beret", "headband", "bow-red", "bow-pink", "study-cap", "crown", "bunny"],
      glasses: ["none", "round-black", "round-gold", "square", "pink", "cat-eye", "hearts", "sun"],
      jewelry: ["none", "pearl", "gold-pendant", "moon", "hoops-gold", "hoops-silver", "cherries", "heart-earrings", "headphones"]
    }
  };

  const ORDER = [
    "skin", "face", "hair", "hairColor", "brows", "eyes", "eyeColor", "nose",
    "mouth", "faceDetail", "outfit", "headwear", "glasses", "jewelry", "background", "frame"
  ];

  const randomItem = (items) => items.length ? items[Math.floor(Math.random() * items.length)] : null;

  function nextMode() {
    let last = "";
    try { last = sessionStorage.getItem(MODE_KEY) || ""; } catch {}
    const mode = last === "masculino" ? "feminino" : "masculino";
    try { sessionStorage.setItem(MODE_KEY, mode); } catch {}
    return mode;
  }

  function selectCategory(category, preferred) {
    const tab = document.querySelector(`[data-avatar-tab="${category}"]`);
    if (!tab) return;
    tab.click();

    const unlocked = [...document.querySelectorAll(`[data-avatar-category="${category}"]:not(.is-locked)`)]
      .filter((button) => !button.disabled);
    if (!unlocked.length) return;

    const preferredUnlocked = Array.isArray(preferred) && preferred.length
      ? unlocked.filter((button) => preferred.includes(button.dataset.avatarValue))
      : [];
    const pool = preferredUnlocked.length ? preferredUnlocked : unlocked;
    randomItem(pool)?.click();
  }

  function generateBalancedAvatar(mode) {
    if (!document.querySelector("[data-mente-avatar-studio]")) return;

    const activeCategory = document.querySelector("[data-avatar-tab].is-active")?.dataset.avatarTab || "skin";
    const profile = PROFILES[mode] || PROFILES.masculino;

    ORDER.forEach((category) => selectCategory(category, profile[category]));

    document.querySelector(`[data-avatar-tab="${activeCategory}"]`)?.click();
    const status = document.querySelector("[data-avatar-status]");
    if (status) status.textContent = mode === "masculino" ? "Sugestão masculina gerada" : "Sugestão feminina gerada";
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-avatar-random]");
    if (!button || !event.isTrusted) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    generateBalancedAvatar(nextMode());
  }, true);
})();
