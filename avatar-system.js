"use strict";

(() => {
  const VERSION = 1;
  const USER_KEY = "mente-demo-user";
  const LOCAL_PREFIX = "mente-avatar-config-v1:";
  const PROFILE_PREFIX = "mente-profile-v2:";

  const DEFAULT_CONFIG = Object.freeze({
    skin: "warm",
    hair: "waves",
    hairColor: "espresso",
    eyes: "round",
    mouth: "smile",
    outfit: "hoodie-blue",
    accessory: "none",
    background: "sky",
    frame: "clean"
  });

  const CATEGORIES = [
    { key: "skin", label: "Pele", icon: "◉", hint: "Todos os tons são livres" },
    { key: "hair", label: "Cabelo", icon: "✦", hint: "Escolha o estilo" },
    { key: "hairColor", label: "Cor", icon: "●", hint: "Cor do cabelo" },
    { key: "eyes", label: "Olhos", icon: "◌", hint: "Mude a expressão" },
    { key: "mouth", label: "Sorriso", icon: "⌣", hint: "Seu jeito de aparecer" },
    { key: "outfit", label: "Roupa", icon: "◆", hint: "Monte seu visual" },
    { key: "accessory", label: "Acessórios", icon: "★", hint: "Itens especiais" },
    { key: "background", label: "Fundo", icon: "▣", hint: "Cor do seu cartão" },
    { key: "frame", label: "Moldura", icon: "◎", hint: "Finalize o avatar" }
  ];

  const OPTIONS = {
    skin: [
      { id:"porcelain", label:"Porcelana", sample:"#F7D9C4" },
      { id:"light", label:"Clara", sample:"#EFC5A4" },
      { id:"warm", label:"Quente", sample:"#D99B6C" },
      { id:"golden", label:"Dourada", sample:"#BF7D50" },
      { id:"brown", label:"Marrom", sample:"#895837" },
      { id:"deep", label:"Profunda", sample:"#56351F" }
    ],
    hair: [
      { id:"short", label:"Curto", sample:"✂" },
      { id:"bob", label:"Bob", sample:"◒" },
      { id:"waves", label:"Ondulado", sample:"≈" },
      { id:"curls", label:"Cacheado", sample:"〰" },
      { id:"afro", label:"Afro", sample:"✺" },
      { id:"pony", label:"Rabo alto", sample:"◕", access:"plus" },
      { id:"bun", label:"Coque", sample:"●", access:"plus" },
      { id:"undercut", label:"Undercut", sample:"◢", access:"plus" }
    ],
    hairColor: [
      { id:"black", label:"Preto", sample:"#17191F" },
      { id:"espresso", label:"Café", sample:"#3A241C" },
      { id:"chestnut", label:"Castanho", sample:"#70412A" },
      { id:"caramel", label:"Caramelo", sample:"#A9683B" },
      { id:"blonde", label:"Loiro", sample:"#DAB870" },
      { id:"copper", label:"Cobre", sample:"#B85234", access:"plus" },
      { id:"plum", label:"Ameixa", sample:"#654172", access:"plus" }
    ],
    eyes: [
      { id:"round", label:"Curiosos", sample:"● ●" },
      { id:"happy", label:"Felizes", sample:"⌒ ⌒" },
      { id:"focused", label:"Focados", sample:"◉ ◉" },
      { id:"soft", label:"Suaves", sample:"• •" },
      { id:"sparkle", label:"Brilhantes", sample:"✦ ✦", access:"plus" }
    ],
    mouth: [
      { id:"smile", label:"Sorriso", sample:"⌣" },
      { id:"grin", label:"Animado", sample:"◡" },
      { id:"calm", label:"Calmo", sample:"—" },
      { id:"cheeky", label:"Confiante", sample:"⌁" }
    ],
    outfit: [
      { id:"tee-blue", label:"Camiseta azul", sample:"#2E78EF" },
      { id:"hoodie-blue", label:"Moletom M.E.N.T.E", sample:"#173E78" },
      { id:"tee-green", label:"Camiseta verde", sample:"#16835B" },
      { id:"sweater-orange", label:"Suéter laranja", sample:"#FF7A00" },
      { id:"varsity", label:"Jaqueta universitária", sample:"#7C3AED", access:"plus" },
      { id:"lavender", label:"Moletom lavanda", sample:"#AB47BC", access:"plus" },
      { id:"champion", label:"Campeão M.E.N.T.E", sample:"#F2C94C", access:"level5" }
    ],
    accessory: [
      { id:"none", label:"Sem acessório", sample:"—" },
      { id:"glasses", label:"Óculos", sample:"○—○" },
      { id:"round-glasses", label:"Óculos redondos", sample:"◯◯" },
      { id:"star-clip", label:"Presilha estrela", sample:"★", access:"points100" },
      { id:"study-cap", label:"Boné de sequência", sample:"⌒", access:"streak7" },
      { id:"headphones", label:"Fones Plus", sample:"♫", access:"plus" },
      { id:"crown", label:"Coroa Plus", sample:"♛", access:"plus" }
    ],
    background: [
      { id:"sky", label:"Céu", sample:"#DDEBFF" },
      { id:"mint", label:"Menta", sample:"#DCF7EC" },
      { id:"peach", label:"Pêssego", sample:"#FFE6D8" },
      { id:"lavender-bg", label:"Lavanda", sample:"#EEE5FF" },
      { id:"scholar", label:"Conquista 100", sample:"#D9F3FF", access:"points100" },
      { id:"sunset", label:"Pôr do sol", sample:"#F4B1B8", access:"plus" },
      { id:"galaxy", label:"Galáxia", sample:"#463A8C", access:"plus" }
    ],
    frame: [
      { id:"clean", label:"Clássica", sample:"#FFFFFF" },
      { id:"silver", label:"Prata", sample:"#B7C3D3" },
      { id:"gold", label:"Ouro por nível", sample:"#E4B83F", access:"level5" },
      { id:"neon", label:"Plus Neon", sample:"#7C3AED", access:"plus" }
    ]
  };

  const COLORS = {
    skin:{porcelain:"#F7D9C4",light:"#EFC5A4",warm:"#D99B6C",golden:"#BF7D50",brown:"#895837",deep:"#56351F"},
    hair:{black:"#17191F",espresso:"#3A241C",chestnut:"#70412A",caramel:"#A9683B",blonde:"#DAB870",copper:"#B85234",plum:"#654172"}
  };

  const BACKGROUNDS = {
    sky:["#DDEBFF","#BFD5FF"], mint:["#DCF7EC","#BDECD8"], peach:["#FFE6D8","#FFD0BA"],
    "lavender-bg":["#EEE5FF","#DCCBFF"], scholar:["#E2F7FF","#A8DFFF"], sunset:["#FFD9C9","#F4A8C7"], galaxy:["#2F2C68","#7252B8"]
  };

  const state = {
    config: { ...DEFAULT_CONFIG },
    savedConfig: null,
    hasCustom: false,
    user: null,
    metrics: { points:0, streak:0, level:1 },
    activeTab: "skin",
    remoteLoaded: false,
    saving: false
  };

  function readJson(key, fallback=null) { try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; } }
  function saveJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  function currentUser() { return readJson(USER_KEY, null); }
  function localKey(email) { return `${LOCAL_PREFIX}${String(email || "local").trim().toLowerCase()}`; }
  function profileKey(email) { return `${PROFILE_PREFIX}${String(email || "local").trim().toLowerCase()}`; }
  function option(category,id) { return (OPTIONS[category] || []).find((item) => item.id === id); }
  function validConfig(raw) {
    if (!raw || typeof raw !== "object") return null;
    const clean = { ...DEFAULT_CONFIG };
    for (const category of CATEGORIES) if (option(category.key, raw[category.key])) clean[category.key] = raw[category.key];
    return clean;
  }
  function isPlus() { return Boolean(window.MENTE_PLUS?.isActive?.()) || document.documentElement.dataset.mentePlan === "plus"; }
  function accessStatus(item) {
    const access = item?.access || "free";
    if (access === "free") return { unlocked:true, badge:"Livre", kind:"free", reason:"" };
    if (access === "plus") return isPlus() ? { unlocked:true,badge:"PLUS",kind:"plus",reason:"" } : { unlocked:false,badge:"PLUS",kind:"plus",reason:"Exclusivo do M.E.N.T.E Plus" };
    if (access === "points100") return state.metrics.points >= 100 ? { unlocked:true,badge:"MÉRITO",kind:"merit",reason:"" } : { unlocked:false,badge:"MÉRITO",kind:"merit",reason:`Desbloqueie ao alcançar 100 pontos (${state.metrics.points}/100)` };
    if (access === "streak7") return state.metrics.streak >= 7 ? { unlocked:true,badge:"MÉRITO",kind:"merit",reason:"" } : { unlocked:false,badge:"MÉRITO",kind:"merit",reason:`Desbloqueie com 7 dias de sequência (${state.metrics.streak}/7)` };
    if (access === "level5") return state.metrics.level >= 5 ? { unlocked:true,badge:"MÉRITO",kind:"merit",reason:"" } : { unlocked:false,badge:"MÉRITO",kind:"merit",reason:`Desbloqueie no nível 5 (nível ${state.metrics.level})` };
    return { unlocked:true,badge:"Livre",kind:"free",reason:"" };
  }

  function uid() { return `av${Math.random().toString(36).slice(2,8)}`; }
  function escAttr(value) { return String(value).replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

  function hairBack(style, color) {
    if (style === "bob") return `<path d="M44 84c0-42 20-65 47-65 31 0 49 24 49 66v48H39z" fill="${color}"/>`;
    if (style === "pony") return `<ellipse cx="139" cy="80" rx="22" ry="34" fill="${color}"/><path d="M129 55c23 11 28 38 15 65 19-10 29-32 24-54-4-20-19-32-39-34z" fill="${color}" opacity=".94"/>`;
    if (style === "bun") return `<circle cx="91" cy="27" r="24" fill="${color}"/>`;
    return "";
  }

  function hairFront(style, color) {
    if (style === "short") return `<path d="M49 70c2-31 21-49 43-49 25 0 42 16 46 45-10-7-18-14-25-23-15 13-35 21-64 27z" fill="${color}"/>`;
    if (style === "bob") return `<path d="M46 70c5-32 23-49 47-49 24 0 40 15 45 44-15-7-25-15-31-25-15 14-34 23-61 30z" fill="${color}"/>`;
    if (style === "waves") return `<path d="M45 73c1-34 20-54 48-54 29 0 46 20 47 52-10-2-18-9-25-19-8 10-18 12-27 5-9 9-22 14-43 16z" fill="${color}"/><path d="M44 63c-8 17-7 37 1 50 5-15 7-28 7-43zm96 0c8 16 7 36-1 50-4-15-6-28-6-43z" fill="${color}"/>`;
    if (style === "curls") return `<g fill="${color}"><circle cx="54" cy="55" r="17"/><circle cx="69" cy="36" r="18"/><circle cx="91" cy="31" r="19"/><circle cx="113" cy="37" r="18"/><circle cx="129" cy="55" r="17"/><circle cx="49" cy="74" r="13"/><circle cx="133" cy="73" r="13"/></g>`;
    if (style === "afro") return `<g fill="${color}"><circle cx="48" cy="58" r="23"/><circle cx="61" cy="36" r="24"/><circle cx="83" cy="25" r="25"/><circle cx="107" cy="27" r="25"/><circle cx="127" cy="43" r="24"/><circle cx="137" cy="66" r="22"/><circle cx="43" cy="80" r="18"/></g>`;
    if (style === "pony") return `<path d="M47 69c4-31 22-49 47-49 24 0 40 16 45 43-12-2-23-10-31-22-16 14-34 23-61 28z" fill="${color}"/>`;
    if (style === "bun") return `<path d="M48 69c4-31 22-49 45-49 25 0 41 17 46 44-15-5-26-13-34-24-15 13-33 23-57 29z" fill="${color}"/>`;
    if (style === "undercut") return `<path d="M49 65c8-29 27-44 51-43 21 1 34 13 40 34-25 1-42-5-54-17-9 13-21 22-37 26z" fill="${color}"/><path d="M49 66c-2 10-2 20 1 28" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`;
    return "";
  }

  function eyesSvg(id, skin) {
    const ink = skin === "deep" ? "#241812" : "#26364A";
    if (id === "happy") return `<path d="M66 85q7-8 14 0M101 85q7-8 14 0" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
    if (id === "focused") return `<path d="M64 79l17 3M101 82l17-3" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><circle cx="74" cy="88" r="5" fill="${ink}"/><circle cx="108" cy="88" r="5" fill="${ink}"/><circle cx="72" cy="86" r="1.5" fill="#fff"/><circle cx="106" cy="86" r="1.5" fill="#fff"/>`;
    if (id === "soft") return `<ellipse cx="74" cy="87" rx="4" ry="6" fill="${ink}"/><ellipse cx="108" cy="87" rx="4" ry="6" fill="${ink}"/>`;
    if (id === "sparkle") return `<g fill="${ink}"><path d="M74 78l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z"/><path d="M108 78l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z"/></g>`;
    return `<circle cx="74" cy="87" r="6" fill="${ink}"/><circle cx="108" cy="87" r="6" fill="${ink}"/><circle cx="72" cy="85" r="2" fill="#fff"/><circle cx="106" cy="85" r="2" fill="#fff"/>`;
  }

  function mouthSvg(id) {
    if (id === "grin") return `<path d="M75 108q16 15 32 0" fill="#fff" stroke="#7D4138" stroke-width="3" stroke-linecap="round"/><path d="M80 113h22" stroke="#E6B5AA" stroke-width="2"/>`;
    if (id === "calm") return `<path d="M82 111h18" stroke="#7D4138" stroke-width="3" stroke-linecap="round"/>`;
    if (id === "cheeky") return `<path d="M78 109q14 9 27-2" fill="none" stroke="#7D4138" stroke-width="3" stroke-linecap="round"/>`;
    return `<path d="M78 107q13 13 27 0" fill="none" stroke="#7D4138" stroke-width="3.2" stroke-linecap="round"/>`;
  }

  function outfitSvg(id, gid) {
    const base = {
      "tee-blue":"#2E78EF","hoodie-blue":"#173E78","tee-green":"#16835B","sweater-orange":"#FF7A00",
      varsity:"#6546C9",lavender:"#AB47BC",champion:"#D8A919"
    }[id] || "#173E78";
    const body = `<path d="M38 180c2-31 18-48 52-48s51 17 53 48z" fill="${base}"/>`;
    if (id === "hoodie-blue" || id === "lavender") return `${body}<path d="M67 137q23 22 47 0" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="5"/><path d="M80 139v17M102 139v17" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="80" cy="158" r="2" fill="#fff"/><circle cx="102" cy="158" r="2" fill="#fff"/>`;
    if (id === "varsity") return `${body}<path d="M65 137v43M116 137v43" stroke="#fff" stroke-width="5" opacity=".9"/><path d="M77 147h28" stroke="#F2C94C" stroke-width="3"/><text x="91" y="169" text-anchor="middle" fill="#fff" font-size="20" font-weight="900">M</text>`;
    if (id === "champion") return `<defs><linearGradient id="${gid}shirt" x1="0" x2="1"><stop stop-color="#E7B928"/><stop offset="1" stop-color="#FFDA62"/></linearGradient></defs><path d="M38 180c2-31 18-48 52-48s51 17 53 48z" fill="url(#${gid}shirt)"/><path d="M75 143l16 12 16-12" fill="none" stroke="#fff" stroke-width="4"/><path d="M87 160l4 8 4-8" fill="#173E78"/>`;
    return `${body}<path d="M74 137q17 16 34 0" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4"/>`;
  }

  function accessorySvg(id, hairColor) {
    if (id === "glasses") return `<g fill="none" stroke="#26364A" stroke-width="3"><rect x="58" y="78" width="31" height="22" rx="8"/><rect x="94" y="78" width="31" height="22" rx="8"/><path d="M89 86h5"/></g>`;
    if (id === "round-glasses") return `<g fill="none" stroke="#26364A" stroke-width="3"><circle cx="74" cy="88" r="15"/><circle cx="108" cy="88" r="15"/><path d="M89 85h4"/></g>`;
    if (id === "star-clip") return `<path d="M125 50l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#F7B32B" stroke="#fff" stroke-width="2"/>`;
    if (id === "study-cap") return `<path d="M55 50q36-28 72 0l-5 12q-30-16-63 1z" fill="#315B9D"/><path d="M91 54q26-3 42 7-15 7-34 3z" fill="#173E78"/>`;
    if (id === "headphones") return `<path d="M50 86q2-50 41-50t42 50" fill="none" stroke="#4F46E5" stroke-width="8" stroke-linecap="round"/><rect x="43" y="83" width="15" height="28" rx="7" fill="#7C3AED"/><rect x="125" y="83" width="15" height="28" rx="7" fill="#7C3AED"/><circle cx="50" cy="96" r="4" fill="#F2C94C"/><circle cx="133" cy="96" r="4" fill="#F2C94C"/>`;
    if (id === "crown") return `<path d="M66 35l8-18 16 14 15-16 10 20z" fill="#F2C94C" stroke="#fff" stroke-width="2"/><circle cx="74" cy="18" r="3" fill="#FF7A00"/><circle cx="105" cy="16" r="3" fill="#7C3AED"/>`;
    return "";
  }

  function frameStyle(id) {
    if (id === "silver") return { stroke:"#B7C3D3", width:6, dash:"" };
    if (id === "gold") return { stroke:"#E4B83F", width:8, dash:"" };
    if (id === "neon") return { stroke:"#7C3AED", width:7, dash:"5 4" };
    return { stroke:"rgba(255,255,255,.86)", width:5, dash:"" };
  }

  function renderSvg(input=state.config, opts={}) {
    const config = validConfig(input) || { ...DEFAULT_CONFIG };
    const skin = COLORS.skin[config.skin] || COLORS.skin.warm;
    const hair = COLORS.hair[config.hairColor] || COLORS.hair.espresso;
    const bg = BACKGROUNDS[config.background] || BACKGROUNDS.sky;
    const gid = uid();
    const frame = frameStyle(config.frame);
    const label = escAttr(opts.label || "Avatar M.E.N.T.E personalizado");
    const galaxyStars = config.background === "galaxy" ? `<g fill="#fff" opacity=".75"><circle cx="28" cy="39" r="2"/><circle cx="151" cy="48" r="2"/><circle cx="142" cy="135" r="1.7"/><circle cx="31" cy="128" r="1.5"/><path d="M145 28l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></g>` : "";
    return `<svg class="mente-avatar-svg" viewBox="0 0 180 180" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="${gid}bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs>
      <circle cx="90" cy="90" r="86" fill="url(#${gid}bg)"/>
      ${galaxyStars}
      <circle cx="38" cy="42" r="18" fill="#fff" opacity=".13"/><circle cx="148" cy="124" r="24" fill="#fff" opacity=".1"/>
      ${hairBack(config.hair,hair)}
      ${outfitSvg(config.outfit,gid)}
      <rect x="80" y="121" width="22" height="24" rx="10" fill="${skin}"/>
      <ellipse cx="91" cy="83" rx="44" ry="50" fill="${skin}"/>
      <ellipse cx="49" cy="87" rx="7" ry="11" fill="${skin}"/><ellipse cx="133" cy="87" rx="7" ry="11" fill="${skin}"/>
      <ellipse cx="66" cy="101" rx="8" ry="4" fill="#E98A86" opacity=".22"/><ellipse cx="116" cy="101" rx="8" ry="4" fill="#E98A86" opacity=".22"/>
      ${hairFront(config.hair,hair)}
      <path d="M66 76q8-5 16 0M100 76q8-5 16 0" fill="none" stroke="${hair}" stroke-width="3" stroke-linecap="round" opacity=".8"/>
      ${eyesSvg(config.eyes,config.skin)}
      <path d="M91 91l-3 9 6 1" fill="none" stroke="#9C654D" stroke-width="2" stroke-linecap="round" opacity=".45"/>
      ${mouthSvg(config.mouth)}
      ${accessorySvg(config.accessory,hair)}
      <circle cx="90" cy="90" r="85" fill="none" stroke="${frame.stroke}" stroke-width="${frame.width}" ${frame.dash?`stroke-dasharray="${frame.dash}"`:""}/>
    </svg>`;
  }

  function loadLocal() {
    state.user = currentUser();
    const local = state.user?.email ? validConfig(readJson(localKey(state.user.email), null)) : null;
    if (local) { state.config = local; state.savedConfig = { ...local }; state.hasCustom = true; }
    else {
      const oldProfile = state.user?.email ? readJson(profileKey(state.user.email), null) : null;
      // Mantemos o antigo emoji até o aluno salvar um avatar humano pela primeira vez.
      state.hasCustom = false;
      state.savedConfig = null;
      if (oldProfile?.avatarConfig) {
        const migrated = validConfig(oldProfile.avatarConfig);
        if (migrated) { state.config = migrated; state.savedConfig = { ...migrated }; state.hasCustom = true; }
      }
    }
  }

  function applyToElement(el, config=state.config) {
    if (!el) return;
    el.classList.add("mente-custom-avatar");
    el.innerHTML = renderSvg(config,{label:"Meu avatar M.E.N.T.E"});
    el.style.background = "transparent";
    el.style.overflow = "hidden";
    el.style.padding = "0";
    el.style.fontSize = "0";
  }

  function applyGlobal(force=false) {
    if (!state.hasCustom && !force) return;
    applyToElement(document.querySelector("#user-avatar"));
    applyToElement(document.querySelector("#profile-avatar"));
  }

  function toast(title, copy, icon="✦") {
    document.querySelector(".mente-avatar-toast")?.remove();
    const el = document.createElement("div");
    el.className = "mente-avatar-toast";
    el.innerHTML = `<span>${icon}</span><div><strong>${title}</strong><small>${copy}</small></div>`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),3600);
  }

  function sampleMarkup(category,item) {
    const isColor = /^#/.test(String(item.sample || ""));
    if (isColor) return `<span class="mente-avatar-option__sample is-color" style="background:${item.sample}"></span>`;
    return `<span class="mente-avatar-option__sample is-line">${item.sample || "●"}</span>`;
  }

  function optionMarkup(category,item) {
    const access = accessStatus(item);
    const selected = state.config[category] === item.id;
    const badge = item.access ? `<span class="mente-avatar-option__badge ${access.kind==="merit"?"is-merit":""}">${access.badge}</span>` : "";
    return `<button type="button" class="mente-avatar-option ${selected?"is-selected":""} ${access.unlocked?"":"is-locked"}" data-avatar-category="${category}" data-avatar-value="${item.id}" title="${escAttr(access.reason || item.label)}" aria-pressed="${selected}">
      ${!access.unlocked?'<span class="mente-avatar-option__lock">🔒</span>':""}${badge}${sampleMarkup(category,item)}<strong>${item.label}</strong>
    </button>`;
  }

  function studioMarkup() {
    const category = CATEGORIES.find((item)=>item.key===state.activeTab) || CATEGORIES[0];
    return `<div class="mente-avatar-studio" data-mente-avatar-studio>
      <aside class="mente-avatar-stage">
        <div class="mente-avatar-preview" data-avatar-preview>${renderSvg(state.config,{label:"Prévia do avatar"})}</div>
        <div class="mente-avatar-stage__copy"><strong>Seu personagem M.E.N.T.E</strong><span>Monte um avatar que combine com você. As mudanças aparecem ao vivo.</span></div>
        <div class="mente-avatar-mini-status"><span class="mente-avatar-pill">⭐ ${state.metrics.points} pontos</span><span class="mente-avatar-pill is-merit">🔥 ${state.metrics.streak} dias</span>${isPlus()?'<span class="mente-avatar-pill is-plus">★ PLUS</span>':""}</div>
        <div class="mente-avatar-stage__actions"><button type="button" data-avatar-random>🎲 Aleatório</button><button type="button" data-avatar-reset>↺ Padrão</button><button type="button" class="mente-avatar-save" data-avatar-save>Salvar avatar</button></div>
        <p class="mente-avatar-save-status" data-avatar-status aria-live="polite"></p>
      </aside>
      <section class="mente-avatar-workbench">
        <div class="mente-avatar-workbench__head"><div><strong>Personalize cada detalhe</strong><span>Itens com ★ Plus usam sua prévia administrativa quando você alterna o plano.</span></div></div>
        <div class="mente-avatar-tabs" role="tablist">${CATEGORIES.map((item)=>`<button type="button" class="mente-avatar-tab ${item.key===state.activeTab?"is-active":""}" data-avatar-tab="${item.key}">${item.icon} ${item.label}</button>`).join("")}</div>
        <div class="mente-avatar-category"><div class="mente-avatar-category__title"><span>${category.label}</span><small>${category.hint}</small></div><div class="mente-avatar-options">${OPTIONS[category.key].map((item)=>optionMarkup(category.key,item)).join("")}</div>
        <div class="mente-avatar-lock-note"><span>🔓</span><span><b>Desbloqueios:</b> itens verdes são ganhos estudando (100 pontos, 7 dias de sequência ou nível 5). Itens roxos são exclusivos do Plus. Tons de pele nunca são bloqueados.</span></div></div>
      </section>
    </div>`;
  }

  function updatePreview() {
    const preview = document.querySelector("[data-avatar-preview]");
    if (preview) preview.innerHTML = renderSvg(state.config,{label:"Prévia do avatar"});
  }

  function renderWorkbench() {
    const host = document.querySelector(".profile-avatar-editor");
    if (!host) return false;
    host.classList.add("is-customized");
    let studio = host.querySelector("[data-mente-avatar-studio]");
    if (!studio) {
      host.insertAdjacentHTML("beforeend", studioMarkup());
      bindStudio(host);
    } else {
      studio.outerHTML = studioMarkup();
      bindStudio(host);
    }
    applyGlobal();
    return true;
  }

  function choose(category,id) {
    const item = option(category,id);
    if (!item) return;
    const access = accessStatus(item);
    if (!access.unlocked) {
      if (item.access === "plus") window.MENTE_PLUS?.openUpgrade?.(`${item.label} no editor de avatar`);
      else toast("Item por mérito", access.reason, "🏆");
      return;
    }
    state.config = { ...state.config, [category]:id };
    updatePreview();
    document.querySelectorAll(`[data-avatar-category="${category}"]`).forEach((button)=>{
      const selected = button.dataset.avatarValue === id;
      button.classList.toggle("is-selected",selected); button.setAttribute("aria-pressed",String(selected));
    });
  }

  function randomConfig() {
    const next = { ...state.config };
    for (const category of CATEGORIES) {
      const available = OPTIONS[category.key].filter((item)=>accessStatus(item).unlocked);
      if (available.length) next[category.key] = available[Math.floor(Math.random()*available.length)].id;
    }
    state.config = next;
    renderWorkbench();
  }

  async function saveAvatar() {
    if (state.saving) return;
    state.saving = true;
    const status = document.querySelector("[data-avatar-status]");
    const button = document.querySelector("[data-avatar-save]");
    if (button) button.disabled = true;
    if (status) { status.textContent = "Salvando seu avatar..."; status.dataset.state=""; }
    state.user = currentUser() || state.user;
    const config = validConfig(state.config) || { ...DEFAULT_CONFIG };
    if (state.user?.email) saveJson(localKey(state.user.email), config);
    state.savedConfig = { ...config }; state.hasCustom = true;
    applyGlobal(true);

    let online = false;
    try {
      const client = window.menteSupabase;
      if (client) {
        const { data:sessionData } = await client.auth.getSession();
        const authUser = sessionData?.session?.user;
        if (authUser) {
          const { error } = await client.from("profiles").update({ avatar_config:config, avatar_url:"custom:v1", avatar_updated_at:new Date().toISOString() }).eq("id",authUser.id);
          if (error) throw error;
          online = true;
        }
      }
      if (status) { status.textContent = online ? "Avatar salvo e sincronizado ✓" : "Avatar salvo neste dispositivo ✓"; status.dataset.state="success"; }
      toast("Avatar atualizado!", online ? "Seu novo visual já está salvo no seu perfil." : "Seu novo visual foi salvo neste dispositivo.", "✨");
      try { window.dispatchEvent(new CustomEvent("mente:avatar-updated",{detail:{config:{...config}}})); } catch {}
    } catch (error) {
      console.warn("[M.E.N.T.E Avatar] Falha ao sincronizar avatar:",error);
      if (status) { status.textContent="Avatar salvo localmente; sincronização pendente."; status.dataset.state="error"; }
    } finally {
      state.saving=false; if (button) button.disabled=false;
    }
  }

  function bindStudio(host) {
    host.querySelectorAll("[data-avatar-tab]").forEach((button)=>button.addEventListener("click",()=>{ state.activeTab=button.dataset.avatarTab || "skin"; renderWorkbench(); }));
    host.querySelectorAll("[data-avatar-category]").forEach((button)=>button.addEventListener("click",()=>choose(button.dataset.avatarCategory,button.dataset.avatarValue)));
    host.querySelector("[data-avatar-random]")?.addEventListener("click",randomConfig);
    host.querySelector("[data-avatar-reset]")?.addEventListener("click",()=>{ state.config={...DEFAULT_CONFIG}; renderWorkbench(); });
    host.querySelector("[data-avatar-save]")?.addEventListener("click",saveAvatar);
  }

  function scheduleUi() {
    [60,220,650,1300,2400].forEach((ms)=>setTimeout(()=>{ renderWorkbench(); applyGlobal(); },ms));
  }

  async function loadRemote() {
    const client = window.menteSupabase;
    if (!client) return;
    try {
      const { data:sessionData } = await client.auth.getSession();
      const authUser = sessionData?.session?.user;
      if (!authUser) return;
      const { data, error } = await client.from("profiles").select("avatar_config,avatar_url,pontos,sequencia,nivel").eq("id",authUser.id).maybeSingle();
      if (error) throw error;
      state.metrics.points = Math.max(0,Number(data?.pontos)||0);
      state.metrics.streak = Math.max(0,Number(data?.sequencia)||0);
      state.metrics.level = Math.max(1,Number(data?.nivel)||1);
      const remoteConfig = validConfig(data?.avatar_config);
      if (remoteConfig) {
        state.config = remoteConfig; state.savedConfig={...remoteConfig}; state.hasCustom=true;
        state.user = currentUser() || { id:authUser.id,email:authUser.email };
        if (authUser.email) saveJson(localKey(authUser.email),remoteConfig);
      }
      state.remoteLoaded=true;
      scheduleUi(); applyGlobal();
    } catch (error) { console.warn("[M.E.N.T.E Avatar] Avatar online indisponível; usando configuração local.",error); }
  }

  function handlePlanUpdate() { scheduleUi(); }
  function handleProfileUpdate() { setTimeout(()=>{ renderWorkbench(); applyGlobal(); },120); }
  function init() {
    loadLocal();
    applyGlobal();
    scheduleUi();
    loadRemote();
  }

  window.MENTE_AVATAR = {
    version:VERSION,
    render:renderSvg,
    renderInto:(element,config)=>applyToElement(element,validConfig(config)||state.config),
    get config(){ return { ...state.config }; },
    get hasCustom(){ return state.hasCustom; },
    refresh:()=>{ scheduleUi(); applyGlobal(); loadRemote(); }
  };

  window.addEventListener("mente:supabase-ready",loadRemote);
  window.addEventListener("mente:plan-updated",handlePlanUpdate);
  window.addEventListener("mente:profile-updated",handleProfileUpdate);
  window.addEventListener("mente:account-updated",()=>{ loadLocal(); scheduleUi(); loadRemote(); });
  window.addEventListener("mente:avatar-updated",()=>setTimeout(()=>applyGlobal(true),30));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true}); else init();
  window.addEventListener("load",()=>{ scheduleUi(); applyGlobal(); },{once:true});
})();
