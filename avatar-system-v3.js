"use strict";

(() => {
  const VERSION = 8;
  const ENGINE = "dicebear-avataaars-v10";
  const API_ROOT = "https://api.dicebear.com/10.x/avataaars/svg";
  const USER_KEY = "mente-demo-user";
  const LOCAL_PREFIX = "mente-avatar-config-v2:";
  const LEGACY_LOCAL_PREFIX = "mente-avatar-config-v1:";

  const DEFAULT_CONFIG = Object.freeze({
    engine: ENGINE,
    seed: "mente-avatar",
    topVariant: "shortWaved",
    hairColor: "4a312c",
    skinColor: "edb98a",
    eyesVariant: "happy",
    eyebrowsVariant: "defaultNatural",
    mouthVariant: "smile",
    facialHairVariant: "beardLight",
    facialHairColor: "4a312c",
    facialHairProbability: 0,
    accessoriesVariant: "round",
    accessoriesColor: "262e33",
    accessoriesProbability: 0,
    clothesVariant: "hoodie",
    clothesColor: "5199e4",
    clothesGraphicVariant: "diamond",
    backgroundColor: "dbeafe",
    frame: "circle"
  });

  const SCHEMA = [
    {
      key: "topVariant",
      label: "Cabelo / cabeça",
      wide: true,
      options: [
        ["shortWaved", "Curto ondulado"], ["shortCurly", "Curto cacheado"], ["shortFlat", "Curto clássico"],
        ["shortRound", "Curto arredondado"], ["theCaesar", "César"], ["theCaesarAndSidePart", "Lateral com volume"],
        ["shavedSides", "Laterais raspadas"], ["sides", "Laterais curtas"], ["bob", "Chanel"],
        ["longButNotTooLong", "Médio / longo"], ["straight01", "Longo liso"], ["straight02", "Liso com volume"],
        ["straightAndStrand", "Liso com mecha"], ["curly", "Cacheado"], ["curvy", "Ondulado"],
        ["frizzle", "Cacheado volumoso"], ["fro", "Crespo afro"], ["froBand", "Afro com faixa"],
        ["dreads01", "Dreads curtos"], ["dreads02", "Dreads longos"], ["bun", "Coque"],
        ["miaWallace", "Franja reta"], ["frida", "Preso com flores"], ["hat", "Chapéu"],
        ["winterHat1", "Gorro"], ["winterHat02", "Gorro 2"], ["hijab", "Hijab"], ["turban", "Turbante"]
      ]
    },
    {
      key: "hairColor",
      label: "Cor do cabelo",
      color: true,
      options: [
        ["2c1b18", "Preto"], ["4a312c", "Castanho escuro"], ["724133", "Castanho"], ["a55728", "Castanho claro"],
        ["b58143", "Caramelo"], ["d6b370", "Loiro"], ["c93305", "Ruivo"], ["e8e1e1", "Cinza claro"],
        ["ecdcbf", "Platinado"], ["f59797", "Rosa suave"]
      ]
    },
    {
      key: "skinColor",
      label: "Tom de pele",
      color: true,
      options: [
        ["ffdbb4", "Muito clara"], ["edb98a", "Clara"], ["d08b5b", "Média"],
        ["ae5d29", "Morena"], ["614335", "Escura"], ["f8d25c", "Dourada"]
      ]
    },
    {
      key: "eyesVariant",
      label: "Olhos",
      options: [
        ["default", "Naturais"], ["happy", "Felizes"], ["side", "De lado"], ["squint", "Sorridentes"],
        ["surprised", "Surpresos"], ["wink", "Piscando"], ["winkWacky", "Piscada divertida"], ["hearts", "Corações"],
        ["closed", "Fechados"], ["eyeRoll", "Olhando para cima"]
      ]
    },
    {
      key: "eyebrowsVariant",
      label: "Sobrancelhas",
      options: [
        ["defaultNatural", "Naturais"], ["default", "Clássicas"], ["flatNatural", "Retas"],
        ["raisedExcitedNatural", "Arqueadas naturais"], ["raisedExcited", "Arqueadas"],
        ["upDownNatural", "Expressivas"], ["frownNatural", "Marcadas"], ["sadConcernedNatural", "Suaves"]
      ]
    },
    {
      key: "mouthVariant",
      label: "Boca / expressão",
      options: [
        ["smile", "Sorriso"], ["twinkle", "Sorriso delicado"], ["default", "Neutra"], ["serious", "Séria"],
        ["disbelief", "Surpresa leve"], ["grimace", "Tímida"], ["concerned", "Preocupada"], ["tongue", "Língua de fora"]
      ]
    },
    {
      key: "facialHairVariant",
      probabilityKey: "facialHairProbability",
      label: "Barba / bigode",
      optional: true,
      options: [
        ["beardLight", "Barba leve"], ["beardMedium", "Barba média"], ["beardMajestic", "Barba cheia"],
        ["moustacheFancy", "Bigode fino"], ["moustacheMagnum", "Bigode marcado"]
      ]
    },
    {
      key: "facialHairColor",
      label: "Cor da barba",
      color: true,
      options: [
        ["2c1b18", "Preto"], ["4a312c", "Castanho escuro"], ["724133", "Castanho"],
        ["a55728", "Castanho claro"], ["d6b370", "Loiro"], ["c93305", "Ruivo"]
      ]
    },
    {
      key: "accessoriesVariant",
      probabilityKey: "accessoriesProbability",
      label: "Óculos / acessórios",
      optional: true,
      options: [
        ["round", "Redondos"], ["prescription01", "Armação clássica"], ["prescription02", "Armação moderna"],
        ["wayfarers", "Wayfarer"], ["sunglasses", "Óculos de sol"], ["kurt", "Armação retrô"], ["eyepatch", "Tapa-olho"]
      ]
    },
    {
      key: "accessoriesColor",
      label: "Cor dos óculos",
      color: true,
      options: [
        ["262e33", "Preto"], ["3c4f5c", "Grafite"], ["5199e4", "Azul"], ["ff488e", "Rosa"],
        ["929598", "Prata"], ["ffffff", "Branco"]
      ]
    },
    {
      key: "clothesVariant",
      label: "Roupa",
      options: [
        ["hoodie", "Moletom"], ["shirtCrewNeck", "Camiseta gola redonda"], ["shirtVNeck", "Camiseta gola V"],
        ["shirtScoopNeck", "Camiseta gola ampla"], ["collarAndSweater", "Suéter com gola"], ["blazerAndShirt", "Blazer e camisa"],
        ["blazerAndSweater", "Blazer e suéter"], ["overall", "Jardineira"], ["graphicShirt", "Camiseta estampada"]
      ]
    },
    {
      key: "clothesColor",
      label: "Cor da roupa",
      color: true,
      options: [
        ["262e33", "Preto"], ["3c4f5c", "Grafite"], ["5199e4", "Azul"], ["65c9ff", "Azul claro"],
        ["a7ffc4", "Verde"], ["ffafb9", "Rosa"], ["ff5c5c", "Vermelho"], ["ffffb1", "Amarelo"],
        ["e6e6e6", "Cinza claro"], ["ffffff", "Branco"]
      ]
    },
    {
      key: "clothesGraphicVariant",
      label: "Estampa",
      options: [
        ["diamond", "Diamante"], ["bear", "Urso"], ["pizza", "Pizza"], ["deer", "Cervo"],
        ["cumbia", "Cumbia"], ["hola", "Hola"], ["bat", "Morcego"], ["skullOutline", "Caveira contorno"]
      ]
    },
    {
      key: "backgroundColor",
      label: "Fundo",
      color: true,
      options: [
        ["dbeafe", "Azul suave"], ["e0f2fe", "Céu"], ["dcfce7", "Menta"], ["fef3c7", "Creme"],
        ["fce7f3", "Rosa suave"], ["ede9fe", "Lavanda"], ["fee2e2", "Coral suave"], ["f1f5f9", "Cinza claro"]
      ]
    },
    {
      key: "frame",
      label: "Moldura",
      options: [["circle", "Circular"], ["rounded", "Arredondada"], ["soft-square", "Quadrada suave"]]
    }
  ];

  const LEGACY_MAP = {
    skin: { porcelain:"ffdbb4", light:"ffdbb4", peach:"edb98a", warm:"edb98a", golden:"d08b5b", brown:"ae5d29", deep:"614335" },
    hair: { short:"shortFlat", quiff:"theCaesarAndSidePart", "side-swept":"shortWaved", crop:"shortRound", pixie:"shortWaved", "short-curls":"shortCurly", bob:"bob", lob:"longButNotTooLong", straight:"straight01", waves:"curvy", curls:"curly", ringlets:"frizzle", afro:"fro", bangs:"miaWallace", curtain:"straightAndStrand", pony:"longButNotTooLong", "low-pony":"longButNotTooLong", bun:"bun", "half-up":"frida", braid:"dreads01", "twin-braids":"dreads02", "space-buns":"bun", "side-pony":"longButNotTooLong" },
    hairColor: { black:"2c1b18", espresso:"4a312c", chestnut:"724133", caramel:"a55728", blonde:"d6b370", copper:"c93305", gray:"e8e1e1", white:"ecdcbf", pink:"f59797", blue:"2c1b18", purple:"4a312c" },
    brows: { soft:"defaultNatural", straight:"flatNatural", arched:"raisedExcitedNatural", thick:"frownNatural", feather:"defaultNatural", short:"default" },
    eyes: { round:"default", almond:"default", doe:"happy", cat:"side", soft:"happy", happy:"happy", focused:"squint", sparkle:"hearts" },
    mouth: { smile:"smile", grin:"twinkle", soft:"smile", lips:"default", calm:"default", cheeky:"twinkle", open:"smile" },
    outfit: { "tee-white":"shirtCrewNeck", "tee-black":"shirtCrewNeck", "tee-pink":"shirtScoopNeck", "tee-green":"shirtCrewNeck", "hoodie-cream":"hoodie", "hoodie-pink":"hoodie", "hoodie-blue":"hoodie", "sweater-knit":"collarAndSweater", "shirt-blue":"blazerAndShirt", plaid:"shirtCrewNeck", denim:"blazerAndShirt", varsity:"blazerAndSweater", sailor:"shirtScoopNeck", "dress-pink":"shirtScoopNeck", overalls:"overall", champion:"graphicShirt" },
    glasses: { "round-black":"round", "round-gold":"round", square:"prescription01", pink:"prescription02", "cat-eye":"wayfarers", hearts:"round", sun:"sunglasses" },
    background: { sky:"dbeafe", mint:"dcfce7", "peach-bg":"fee2e2", "lavender-bg":"ede9fe", cream:"fef3c7", scholar:"e0f2fe", sunset:"fce7f3", galaxy:"ede9fe" }
  };

  const state = {
    config: { ...DEFAULT_CONFIG },
    savedConfig: null,
    user: null,
    hasCustom: false,
    saving: false,
    localUpdatedAt: 0,
    remoteLoaded: false
  };

  function readJson(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch {}
  }

  function currentUser() {
    return readJson(USER_KEY, null);
  }

  function userIdentity() {
    const user = state.user || currentUser();
    return String(user?.id || user?.email || "mente-visitante").trim().toLowerCase();
  }

  function localKey(user = state.user) {
    const identity = String(user?.email || user?.id || "local").trim().toLowerCase();
    return `${LOCAL_PREFIX}${identity}`;
  }

  function legacyLocalKey(user = state.user) {
    const identity = String(user?.email || user?.id || "local").trim().toLowerCase();
    return `${LEGACY_LOCAL_PREFIX}${identity}`;
  }

  function schemaEntry(key) {
    return SCHEMA.find((entry) => entry.key === key) || null;
  }

  function allowed(entry, value) {
    return entry?.options?.some(([id]) => id === value) || false;
  }

  function makeSeed() {
    return `mente-${userIdentity().replace(/[^a-z0-9_-]+/g, "-").slice(0, 80) || "avatar"}`;
  }

  function migrateLegacy(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (raw.engine === ENGINE) return raw;

    const next = { ...DEFAULT_CONFIG, seed: makeSeed() };
    let touched = false;

    if (raw.skin && LEGACY_MAP.skin[raw.skin]) { next.skinColor = LEGACY_MAP.skin[raw.skin]; touched = true; }
    if (raw.hair && LEGACY_MAP.hair[raw.hair]) { next.topVariant = LEGACY_MAP.hair[raw.hair]; touched = true; }
    if (raw.hairColor && LEGACY_MAP.hairColor[raw.hairColor]) { next.hairColor = LEGACY_MAP.hairColor[raw.hairColor]; touched = true; }
    if (raw.brows && LEGACY_MAP.brows[raw.brows]) { next.eyebrowsVariant = LEGACY_MAP.brows[raw.brows]; touched = true; }
    if (raw.eyes && LEGACY_MAP.eyes[raw.eyes]) { next.eyesVariant = LEGACY_MAP.eyes[raw.eyes]; touched = true; }
    if (raw.mouth && LEGACY_MAP.mouth[raw.mouth]) { next.mouthVariant = LEGACY_MAP.mouth[raw.mouth]; touched = true; }
    if (raw.outfit && LEGACY_MAP.outfit[raw.outfit]) { next.clothesVariant = LEGACY_MAP.outfit[raw.outfit]; touched = true; }
    if (raw.glasses && raw.glasses !== "none" && LEGACY_MAP.glasses[raw.glasses]) {
      next.accessoriesVariant = LEGACY_MAP.glasses[raw.glasses];
      next.accessoriesProbability = 100;
      touched = true;
    }
    if (raw.background && LEGACY_MAP.background[raw.background]) { next.backgroundColor = LEGACY_MAP.background[raw.background]; touched = true; }
    if (raw.frame && ["clean", "silver", "gold", "neon"].includes(raw.frame)) { next.frame = "circle"; touched = true; }
    if (raw.headwear && raw.headwear !== "none") {
      const headwearMap = { "cap-beige":"hat", "cap-black":"hat", "beanie-red":"winterHat1", bucket:"hat", beret:"hat", headband:"froBand", "study-cap":"hat", crown:"frida", bunny:"frida" };
      if (headwearMap[raw.headwear]) { next.topVariant = headwearMap[raw.headwear]; touched = true; }
    }

    return touched ? next : null;
  }

  function normalizeConfig(raw) {
    const migrated = migrateLegacy(raw);
    const source = migrated || raw;
    if (!source || typeof source !== "object") return null;

    const clean = { ...DEFAULT_CONFIG, engine: ENGINE, seed: String(source.seed || makeSeed()).slice(0, 120) };
    for (const entry of SCHEMA) {
      if (entry.key === "frame") {
        if (allowed(entry, source.frame)) clean.frame = source.frame;
        continue;
      }
      if (allowed(entry, source[entry.key])) clean[entry.key] = source[entry.key];
      if (entry.probabilityKey) {
        const n = Number(source[entry.probabilityKey]);
        clean[entry.probabilityKey] = Number.isFinite(n) && n > 0 ? 100 : 0;
      }
    }
    return clean;
  }

  function configForStorage(config = state.config) {
    return { ...normalizeConfig(config), engine: ENGINE };
  }

  function saveLocal(config = state.config, updatedAt = Date.now()) {
    state.user = currentUser() || state.user;
    const payload = { config: configForStorage(config), updatedAt };
    writeJson(localKey(), payload);
    state.localUpdatedAt = updatedAt;
  }

  function loadLocal() {
    state.user = currentUser() || state.user;
    const modern = readJson(localKey(), null);
    const modernConfig = normalizeConfig(modern?.config || modern);
    if (modernConfig) {
      state.config = modernConfig;
      state.savedConfig = { ...modernConfig };
      state.hasCustom = true;
      state.localUpdatedAt = Number(modern?.updatedAt) || 0;
      return;
    }

    const legacy = readJson(legacyLocalKey(), null);
    const legacyConfig = normalizeConfig(legacy);
    if (legacyConfig) {
      state.config = legacyConfig;
      state.savedConfig = { ...legacyConfig };
      state.hasCustom = true;
      state.localUpdatedAt = Date.now();
      saveLocal(legacyConfig, state.localUpdatedAt);
    }
  }

  function paramValue(config, entry) {
    if (!entry.optional) return config[entry.key];
    return Number(config[entry.probabilityKey]) > 0 ? config[entry.key] : "none";
  }

  function buildAvatarUrl(input = state.config) {
    const config = normalizeConfig(input) || { ...DEFAULT_CONFIG, seed: makeSeed() };
    const params = new URLSearchParams();
    params.set("seed", config.seed || makeSeed());
    params.set("topVariant", config.topVariant);
    params.set("hairColor", config.hairColor);
    params.set("skinColor", config.skinColor);
    params.set("eyesVariant", config.eyesVariant);
    params.set("eyebrowsVariant", config.eyebrowsVariant);
    params.set("mouthVariant", config.mouthVariant);
    params.set("clothesVariant", config.clothesVariant);
    params.set("clothesColor", config.clothesColor);
    params.set("backgroundColor", config.backgroundColor);

    if (config.clothesVariant === "graphicShirt") params.set("clothesGraphicVariant", config.clothesGraphicVariant);

    if (Number(config.facialHairProbability) > 0) {
      params.set("facialHairVariant", config.facialHairVariant);
      params.set("facialHairColor", config.facialHairColor);
      params.set("facialHairProbability", "100");
    } else {
      params.set("facialHairProbability", "0");
    }

    if (Number(config.accessoriesProbability) > 0) {
      params.set("accessoriesVariant", config.accessoriesVariant);
      params.set("accessoriesColor", config.accessoriesColor);
      params.set("accessoriesProbability", "100");
    } else {
      params.set("accessoriesProbability", "0");
    }

    return `${API_ROOT}?${params.toString()}`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[char]));
  }

  function frameClass(frame) {
    return `mente-avatar-frame--${["circle", "rounded", "soft-square"].includes(frame) ? frame : "circle"}`;
  }

  function fallbackMarkup() {
    return '<span class="mente-avatar-fallback" aria-hidden="true">M</span>';
  }

  function imageMarkup(config = state.config, alt = "") {
    const normalized = normalizeConfig(config) || { ...DEFAULT_CONFIG, seed: makeSeed() };
    return `<img class="mente-avatar-img" src="${escapeHtml(buildAvatarUrl(normalized))}" alt="${escapeHtml(alt)}" decoding="async" referrerpolicy="no-referrer">`;
  }

  function applyToElement(element, config = state.config, alt = "") {
    if (!element) return;
    const normalized = normalizeConfig(config) || { ...DEFAULT_CONFIG, seed: makeSeed() };
    element.classList.add("mente-custom-avatar");
    element.classList.remove("mente-avatar-frame--circle", "mente-avatar-frame--rounded", "mente-avatar-frame--soft-square");
    element.classList.add(frameClass(normalized.frame));
    element.dataset.menteAvatarEngine = ENGINE;
    element.style.background = "transparent";
    element.style.overflow = "hidden";
    element.style.padding = "0";
    element.style.fontSize = "0";

    const img = document.createElement("img");
    img.className = "mente-avatar-img";
    img.src = buildAvatarUrl(normalized);
    img.alt = alt;
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => {
      if (!element.isConnected) return;
      element.innerHTML = fallbackMarkup();
      element.dataset.menteAvatarFallback = "1";
    }, { once: true });
    element.replaceChildren(img);
  }

  function applyGlobal(force = false) {
    if (!state.hasCustom && !force) return;
    document.querySelectorAll("#user-avatar, .user-menu__avatar, #profile-avatar, #admin-avatar").forEach((el) => applyToElement(el, state.config, ""));
  }

  function controlMarkup(entry) {
    const selected = paramValue(state.config, entry);
    const none = entry.optional ? '<option value="none">Nenhum</option>' : "";
    const options = entry.options.map(([id, label]) => `<option value="${escapeHtml(id)}"${selected === id ? " selected" : ""}>${escapeHtml(label)}</option>`).join("");
    const sample = entry.color ? `<span class="mente-avatar-control__swatch" style="background:#${escapeHtml(state.config[entry.key])}"></span>` : "";
    return `<label class="mente-avatar-control${entry.wide ? " is-wide" : ""}" data-avatar-control="${entry.key}">
      <span>${escapeHtml(entry.label)}</span>
      <div class="mente-avatar-control__field">${sample}<select data-avatar-select="${entry.key}" aria-label="${escapeHtml(entry.label)}">${none}${options}</select></div>
    </label>`;
  }

  function studioMarkup() {
    return `<div class="mente-avatar-studio" data-mente-avatar-studio>
      <aside class="mente-avatar-stage">
        <div class="mente-avatar-preview ${frameClass(state.config.frame)}" data-avatar-preview>${imageMarkup(state.config, "Prévia do avatar")}</div>
        <div class="mente-avatar-stage__copy">
          <strong>Seu personagem M.E.N.T.E</strong>
          <span>Personalize cabelo, rosto, roupa, acessórios e cores sem deixar a página pesada.</span>
        </div>
        <div class="mente-avatar-stage__actions">
          <button type="button" data-avatar-random>Aleatório</button>
          <button type="button" data-avatar-reset>Restaurar padrão</button>
          <button type="button" class="mente-avatar-save" data-avatar-save>Salvar avatar</button>
        </div>
        <p class="mente-avatar-save-status" data-avatar-status aria-live="polite"></p>
      </aside>

      <section class="mente-avatar-workbench">
        <div class="mente-avatar-workbench__head">
          <div><strong>Personalize cada detalhe</strong><span>As opções usam o estilo Avataaars do DiceBear. Suas mudanças ficam salvas neste dispositivo e o botão Salvar sincroniza com sua conta.</span></div>
          <span class="mente-avatar-engine-badge">Avataaars</span>
        </div>
        <div class="mente-avatar-controls">${SCHEMA.map(controlMarkup).join("")}</div>
        <div class="mente-avatar-editor-note"><strong>Dica:</strong> “Nenhum” desativa barba ou óculos sem gerar combinações quebradas. A moldura altera apenas o recorte do avatar.</div>
      </section>
    </div>`;
  }

  function renderWorkbench() {
    const host = document.querySelector(".profile-avatar-editor");
    if (!host) return false;
    host.classList.add("is-customized");
    const current = host.querySelector("[data-mente-avatar-studio]");
    const markup = studioMarkup();
    if (current) current.outerHTML = markup;
    else host.insertAdjacentHTML("beforeend", markup);
    bindStudio(host);
    applyGlobal();
    return true;
  }

  function updatePreview() {
    const preview = document.querySelector("[data-avatar-preview]");
    if (!preview) return;
    preview.classList.remove("mente-avatar-frame--circle", "mente-avatar-frame--rounded", "mente-avatar-frame--soft-square");
    preview.classList.add(frameClass(state.config.frame));
    applyToElement(preview, state.config, "Prévia do avatar");
  }

  function updateSwatch(key) {
    const swatch = document.querySelector(`[data-avatar-control="${key}"] .mente-avatar-control__swatch`);
    if (swatch) swatch.style.background = `#${state.config[key]}`;
  }

  function setControl(entry, value) {
    if (!entry) return;
    const next = { ...state.config };
    if (entry.optional && value === "none") {
      next[entry.probabilityKey] = 0;
    } else if (allowed(entry, value)) {
      next[entry.key] = value;
      if (entry.optional) next[entry.probabilityKey] = 100;
    } else {
      return;
    }
    state.config = normalizeConfig(next) || { ...DEFAULT_CONFIG, seed: makeSeed() };
    state.hasCustom = true;
    saveLocal(state.config, Date.now());
    updateSwatch(entry.key);
    updatePreview();
    applyGlobal(true);
    const status = document.querySelector("[data-avatar-status]");
    if (status) {
      status.textContent = "Alterações salvas neste dispositivo";
      status.dataset.state = "";
    }
  }

  const RANDOM_PROFILES = {
    masculino: {
      topVariant: ["shortWaved", "shortCurly", "shortFlat", "shortRound", "theCaesar", "theCaesarAndSidePart", "shavedSides", "sides", "fro", "dreads01"],
      facialHairChance: 0.38
    },
    feminino: {
      topVariant: ["bob", "longButNotTooLong", "straight01", "straight02", "straightAndStrand", "curly", "curvy", "frizzle", "fro", "froBand", "bun", "miaWallace"],
      facialHairChance: 0
    },
    neutro: {
      topVariant: ["shortWaved", "shortCurly", "bob", "longButNotTooLong", "straightAndStrand", "curly", "curvy", "fro", "bun", "dreads01"],
      facialHairChance: 0.12
    }
  };

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function randomConfig() {
    const roll = Math.random();
    const mode = roll < 0.45 ? "masculino" : roll < 0.90 ? "feminino" : "neutro";
    const profile = RANDOM_PROFILES[mode];
    const next = { ...DEFAULT_CONFIG, seed: `${makeSeed()}-${Math.random().toString(36).slice(2, 8)}` };

    for (const entry of SCHEMA) {
      if (entry.key === "frame") continue;
      if (entry.optional) continue;
      const ids = entry.options.map(([id]) => id);
      if (ids.length) next[entry.key] = randomItem(ids);
    }

    next.topVariant = randomItem(profile.topVariant);
    next.facialHairProbability = Math.random() < profile.facialHairChance ? 100 : 0;
    next.accessoriesProbability = Math.random() < 0.35 ? 100 : 0;
    next.frame = randomItem(["circle", "rounded", "soft-square"]);
    if (next.facialHairProbability) next.facialHairVariant = randomItem(schemaEntry("facialHairVariant").options.map(([id]) => id));
    if (next.accessoriesProbability) next.accessoriesVariant = randomItem(schemaEntry("accessoriesVariant").options.map(([id]) => id));

    state.config = normalizeConfig(next) || { ...DEFAULT_CONFIG, seed: makeSeed() };
    state.hasCustom = true;
    saveLocal(state.config, Date.now());
    renderWorkbench();
    const status = document.querySelector("[data-avatar-status]");
    if (status) status.textContent = `Sugestão ${mode === "masculino" ? "masculina" : mode === "feminino" ? "feminina" : "neutra"} gerada`;
  }

  function resetAvatar() {
    state.config = { ...DEFAULT_CONFIG, seed: makeSeed() };
    state.hasCustom = true;
    saveLocal(state.config, Date.now());
    renderWorkbench();
    const status = document.querySelector("[data-avatar-status]");
    if (status) status.textContent = "Avatar restaurado para o padrão";
  }

  async function saveAvatar() {
    if (state.saving) return;
    state.saving = true;
    const status = document.querySelector("[data-avatar-status]");
    const button = document.querySelector("[data-avatar-save]");
    if (button) button.disabled = true;
    if (status) {
      status.textContent = "Salvando seu avatar...";
      status.dataset.state = "";
    }

    const now = Date.now();
    state.hasCustom = true;
    saveLocal(state.config, now);
    applyGlobal(true);

    let online = false;
    try {
      const client = window.menteSupabase;
      if (client) {
        const { data: sessionData, error: sessionError } = await client.auth.getSession();
        if (sessionError) throw sessionError;
        const authUser = sessionData?.session?.user;
        if (authUser) {
          const config = configForStorage(state.config);
          const { error } = await client.from("profiles").update({
            avatar_config: config,
            avatar_url: "custom:dicebear-v10",
            avatar_updated_at: new Date(now).toISOString()
          }).eq("id", authUser.id);
          if (error) throw error;
          online = true;
        }
      }

      state.savedConfig = { ...state.config };
      if (status) {
        status.textContent = online ? "Avatar salvo e sincronizado" : "Avatar salvo neste dispositivo";
        status.dataset.state = "success";
      }
      try { window.dispatchEvent(new CustomEvent("mente:avatar-updated", { detail: { config: { ...state.config }, engine: ENGINE } })); }
      catch {}
    } catch (error) {
      console.warn("[M.E.N.T.E Avatar] Falha ao sincronizar avatar:", error);
      if (status) {
        status.textContent = "Avatar salvo localmente; sincronização pendente.";
        status.dataset.state = "error";
      }
    } finally {
      state.saving = false;
      if (button) button.disabled = false;
    }
  }

  function bindStudio(host) {
    host.querySelectorAll("[data-avatar-select]").forEach((select) => {
      select.addEventListener("change", () => setControl(schemaEntry(select.dataset.avatarSelect), select.value));
    });
    host.querySelector("[data-avatar-random]")?.addEventListener("click", randomConfig);
    host.querySelector("[data-avatar-reset]")?.addEventListener("click", resetAvatar);
    host.querySelector("[data-avatar-save]")?.addEventListener("click", saveAvatar);
  }

  function scheduleUi() {
    [60, 240, 700, 1500].forEach((ms) => setTimeout(() => {
      renderWorkbench();
      applyGlobal();
    }, ms));
  }

  async function loadRemote() {
    const client = window.menteSupabase;
    if (!client) return;
    try {
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      const authUser = sessionData?.session?.user;
      if (!authUser) return;

      state.user = currentUser() || { id: authUser.id, email: authUser.email };
      const { data, error } = await client.from("profiles")
        .select("avatar_config,avatar_url,avatar_updated_at")
        .eq("id", authUser.id)
        .maybeSingle();
      if (error) throw error;

      const remoteConfig = normalizeConfig(data?.avatar_config);
      const remoteUpdatedAt = data?.avatar_updated_at ? Date.parse(data.avatar_updated_at) : 0;
      if (remoteConfig && (!state.hasCustom || remoteUpdatedAt >= state.localUpdatedAt)) {
        state.config = remoteConfig;
        state.savedConfig = { ...remoteConfig };
        state.hasCustom = true;
        saveLocal(remoteConfig, remoteUpdatedAt || Date.now());
      }
      state.remoteLoaded = true;
      scheduleUi();
      applyGlobal();
    } catch (error) {
      console.warn("[M.E.N.T.E Avatar] Avatar online indisponível; usando configuração local.", error);
    }
  }

  function init() {
    loadLocal();
    if (!state.config.seed || state.config.seed === DEFAULT_CONFIG.seed) state.config.seed = makeSeed();
    applyGlobal();
    scheduleUi();
    loadRemote();
  }

  window.MENTE_AVATAR = {
    version: VERSION,
    engine: ENGINE,
    buildUrl: (config) => buildAvatarUrl(normalizeConfig(config) || state.config),
    render: (config) => imageMarkup(normalizeConfig(config) || state.config, ""),
    renderInto: (element, config) => applyToElement(element, normalizeConfig(config) || state.config, ""),
    get config() { return { ...state.config }; },
    get hasCustom() { return state.hasCustom; },
    refresh: () => { loadLocal(); scheduleUi(); applyGlobal(); loadRemote(); }
  };

  window.addEventListener("mente:supabase-ready", loadRemote);
  window.addEventListener("mente:profile-updated", () => setTimeout(() => { renderWorkbench(); applyGlobal(); }, 120));
  window.addEventListener("mente:account-updated", () => { loadLocal(); scheduleUi(); loadRemote(); });
  window.addEventListener("mente:avatar-updated", () => setTimeout(() => applyGlobal(true), 30));

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
  window.addEventListener("load", () => { scheduleUi(); applyGlobal(); }, { once: true });
})();
