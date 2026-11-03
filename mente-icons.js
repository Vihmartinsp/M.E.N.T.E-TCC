"use strict";

/*
 * M.E.N.T.E. — ícones institucionais vetoriais.
 * Substitui pictogramas/emoji decorativos por SVGs monocromáticos e acessíveis,
 * inclusive em conteúdo renderizado dinamicamente pelos módulos do site.
 * Não altera dados do aluno, textos em formulários ou o conteúdo dos scripts.
 */
(function () {
  if (window.menteIconSystemReady) return;
  window.menteIconSystemReady = true;

  const shapes = {
    "activity": '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
    "alert": '<path d="m10.3 3.4-8 14A2 2 0 0 0 4 20h16a2 2 0 0 0 1.7-2.6l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    "award": '<circle cx="12" cy="8" r="6"/><path d="m8.2 13.3-1.4 8 5.2-3 5.2 3-1.4-8"/>',
    "bank": '<path d="m3 10 9-6 9 6"/><path d="M4 10h16M5 10v9m5-9v9m4-9v9m5-9v9M3 20h18"/>',
    "bar-chart": '<path d="M4 20V10M10 20V4M16 20v-8M22 20v-6"/><path d="M2 20h20"/>',
    "book": '<path d="M12 7v14"/><path d="M3 18V5a2 2 0 0 1 2-2h4a3 3 0 0 1 3 3 3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v13h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z"/>',
    "box": '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 11h18M9 7v4m6-4v4M7 7V4h10v3"/>',
    "brain": '<path d="M12 18V7a4 4 0 0 0-7.5-1.9A4 4 0 0 0 3 12a4 4 0 0 0 3 6.9A4 4 0 0 0 12 18ZM12 18V7a4 4 0 0 1 7.5-1.9A4 4 0 0 1 21 12a4 4 0 0 1-3 6.9A4 4 0 0 1 12 18Z"/><path d="M8 9c-1.5 0-2.5 1-2.5 2.5M16 9c1.5 0 2.5 1 2.5 2.5"/>',
    "briefcase": '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18M10 13v2h4v-2"/>',
    "calculator": '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h1M12 11h1M16 11h1M8 15h1M12 15h1M16 15h1M8 19h1M12 19h1M16 19h1"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    "car": '<path d="m5 17-1 2v2h3l1-2h8l1 2h3v-2l-1-2-2-8H7Z"/><path d="M5 13h14M8 17h.01M16 17h.01"/>',
    "check": '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "cloud": '<path d="M6 18a5 5 0 0 1-.5-10 7 7 0 0 1 13 2A4 4 0 0 1 18 18Z"/>',
    "coins": '<circle cx="9" cy="9" r="6"/><path d="M15 7a6 6 0 1 1-8 8M9 6v6m-2-5h3a1.5 1.5 0 0 1 0 3H8a1.5 1.5 0 0 0 0 3h3"/>',
    "credit-card": '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    "crown": '<path d="m2 8 4 4 6-8 6 8 4-4-2 12H4Z"/><path d="M4 17h16"/>',
    "database": '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    "dice": '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
    "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    "flag": '<path d="M4 22V4M4 5c5-3 9 3 16 0v12c-7 3-11-3-16 0"/>',
    "flame": '<path d="M12 22c4.5 0 8-3.4 8-8 0-4-2.3-6.6-4-8-.2 3.2-2 4.6-3 5-1-3.6-3-6-5-9 .2 4-4 7-4 12 0 4.6 3.5 8 8 8Z"/><path d="M12 22a4 4 0 0 0 4-4c0-2-1.5-3.5-3-4-1 2-3 2.5-3 4a4 4 0 0 0 2 4Z"/>',
    "flask": '<path d="M9 3h6M10 3v7L4 20a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-10V3M7 16h10"/>',
    "folder": '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    "gamepad": '<path d="M7 8h10a5 5 0 0 1 4.7 4l1 5a3 3 0 0 1-5 2.7L15 17H9l-2.7 2.7a3 3 0 0 1-5-2.7l1-5A5 5 0 0 1 7 8Z"/><path d="M6 12v4M4 14h4M16 12h.01M19 14h.01"/>',
    "gem": '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M2 9h20M6 3l6 19 6-19"/>',
    "graduation": '<path d="m2 10 10-6 10 6-10 6Z"/><path d="M6 13v4c4 4 8 4 12 0v-4M22 10v7"/>',
    "home": '<path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/>',
    "hourglass": '<path d="M5 3h14M5 21h14M7 3c0 6 10 6 10 9s-10 3-10 9M17 3c0 6-10 6-10 9s10 3 10 9"/>',
    "key": '<circle cx="8" cy="15" r="5"/><path d="m11.5 11.5 8-8 2 2-2 2 2 2-3 3-2-2-2 2"/>',
    "lightbulb": '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.8c1.3 1 1.5 2 1.5 3.2h5c0-1.2.2-2.2 1.5-3.2A7 7 0 0 0 12 2Z"/>',
    "line-chart": '<path d="M3 3v18h18"/><path d="m6 16 5-5 4 3 5-8"/>',
    "lock": '<rect x="5" y="10" width="14" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v3"/>',
    "lock-open": '<rect x="5" y="10" width="14" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8-1M12 15v3"/>',
    "medal": '<circle cx="12" cy="14" r="6"/><path d="m8 9-3-7h4l3 5 3-5h4l-3 7M12 11v6M9 14h6"/>',
    "monitor": '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 22h8M12 18v4"/>',
    "palette": '<path d="M12 2a10 10 0 1 0 0 20h2a2 2 0 0 0 2-2c0-1-.5-1.6-.5-2.5A2.5 2.5 0 0 1 18 15h1a3 3 0 0 0 3-3A10 10 0 0 0 12 2Z"/><path d="M7 12h.01M10 7h.01M15 7h.01M18 11h.01"/>',
    "pencil": '<path d="m16 4 4 4-12 12-5 1 1-5Z"/><path d="m14 6 4 4"/>',
    "ruler": '<path d="M3 17 17 3l4 4L7 21Z"/><path d="m12 8 3 3m-7 1 3 3m-7 1 3 3"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    "shield": '<path d="m12 2 9 4v6c0 6-4 9-9 11-5-2-9-5-9-11V6Z"/><path d="m8 12 3 3 5-6"/>',
    "shopping-cart": '<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h2l3 13h12l3-9H5"/>',
    "smartphone": '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    "sprout": '<path d="M12 22v-10M12 15C5 15 3 11 3 7c6 0 9 2 9 8ZM12 12c0-6 3-8 9-8 0 4-2 8-9 8Z"/>',
    "star": '<path d="m12 2 3.1 6.3L22 9.3l-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1Z"/>',
    "sun-cloud": '<path d="M7 18a4 4 0 0 1-.2-8 6 6 0 0 1 11.5 2A3 3 0 0 1 18 18ZM15 3V2m6 5 1-1M4 5 3 4"/>',
    "syringe": '<path d="m18 2 4 4m-8-2 6 6m-3-5-8 8m-4 4 7-7 4 4-7 7H5ZM2 22l4-4"/>',
    "table": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12M15 9v12"/>',
    "target": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    "trophy": '<path d="M8 3h8v7a4 4 0 0 1-8 0Z"/><path d="M8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 14v5m-4 2h8m-8-2h8"/>',
    "truck": '<path d="M3 7h11v11H3ZM14 11h4l3 4v3h-7Z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    "users": '<circle cx="9" cy="8" r="4"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M17 4a4 4 0 0 1 0 8M19 15a6 6 0 0 1 3 6"/>',
    "wallet": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 8h18v10h-7a3 3 0 0 1 0-6h7M17 15h.01"/>',
    "zap": '<path d="m13 2-9 12h7l-1 8 10-12h-7Z"/>',
    "info": '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    "bird": '<path d="M21 7a4 4 0 0 1-4 4h-2c0 6-3 10-9 10-2 0-3-1-3-3 0-4 5-6 7-8l2-4a5 5 0 0 1 9 1Z"/><path d="m17 8 4-1-3 3M14 6h.01"/>'
  };

  const icons = {
    "🔥":"flame","⭐":"star","🌟":"star","🌠":"star","✨":"award","💫":"award",
    "🏆":"trophy","🥇":"medal","🥈":"medal","🥉":"medal","🏅":"medal","🎖":"medal",
    "🎯":"target","🎓":"graduation","👨‍🎓":"graduation","👩‍🎓":"graduation",
    "👑":"crown","💎":"gem","🔒":"lock","🔐":"lock","🔓":"lock-open",
    "📐":"ruler","📏":"ruler","⚖":"ruler","📊":"bar-chart","📈":"line-chart","📉":"line-chart",
    "🧮":"calculator","💰":"coins","💵":"wallet","💸":"wallet","💳":"credit-card",
    "🏦":"bank","📚":"book","📖":"book","📕":"book","📘":"book","📗":"book",
    "💡":"lightbulb","🧠":"brain","🚀":"zap","🦉":"bird","⚡":"zap",
    "⏱":"clock","⏰":"clock","⏳":"hourglass","⌛":"hourglass","🕒":"clock",
    "🗂":"folder","📁":"folder","📂":"folder","🎨":"palette","🧪":"flask",
    "🎲":"dice","🎮":"gamepad","🌱":"sprout","🌿":"sprout","🏁":"flag",
    "🎉":"award","🎊":"award","✅":"check","☑":"check","✔":"check",
    "❌":"alert","❎":"alert","⚠":"alert","🚨":"alert","❗":"alert",
    "🔎":"search","🔍":"search","🔑":"key","☁":"cloud","🌦":"sun-cloud","🌤":"sun-cloud",
    "✏":"pencil","📝":"pencil","📱":"smartphone","💻":"monitor",
    "🏠":"home","🏡":"home","🛢":"database","📦":"box","🔷":"gem",
    "🔹":"gem","🔴":"info","🟢":"check","🟡":"info","🔵":"info","⚫":"info",
    "💼":"briefcase","🚗":"car","🛒":"shopping-cart","🧾":"file-text",
    "⚽":"activity","💉":"syringe","🌍":"info","🌎":"info","🌐":"info",
    "👥":"users","👤":"users","👨":"users","👩":"users","🤝":"users",
    "📅":"calendar","🗓":"calendar","📌":"target","📍":"target","⚙":"activity",
    "🔧":"activity","📋":"file-text","📜":"file-text","📄":"file-text","📑":"file-text",
    "🥳":"award","😊":"check","🙂":"check","👏":"award","❓":"info",
    "♻":"activity","🛡":"shield","🛡️":"shield","🚀":"zap","🔔":"alert",
    "💻":"monitor","👨‍💻":"monitor","👩‍💻":"monitor","🏗":"briefcase"
  };

  const descriptions = {
    "activity":"Atividade","alert":"Atenção","award":"Conquista","bank":"Banco",
    "bar-chart":"Estatísticas","book":"Estudo","box":"Conteúdo",
    "brain":"Estratégia","briefcase":"Trabalho","calculator":"Cálculo",
    "calendar":"Calendário","car":"Transporte","check":"Concluído",
    "clock":"Tempo","cloud":"Sincronização","coins":"Pontos",
    "credit-card":"Cartão","crown":"Administração","database":"Dados",
    "dice":"Aleatório","file-text":"Documento","flag":"Meta","flame":"Sequência diária",
    "flask":"Simulado","folder":"Histórico","gamepad":"Jogos",
    "gem":"Destaque","graduation":"Aluno","home":"Início",
    "hourglass":"Tempo restante","key":"Acesso","lightbulb":"Dica",
    "line-chart":"Desempenho","lock":"Bloqueado","lock-open":"Desbloqueado",
    "medal":"Medalha","monitor":"Tecnologia","palette":"Personalização",
    "pencil":"Resolução","ruler":"Geometria","search":"Analisar",
    "shield":"Segurança","shopping-cart":"Compras","smartphone":"Celular",
    "sprout":"Progresso","star":"Pontos","sun-cloud":"Previsão",
    "syringe":"Saúde","table":"Tabela","target":"Objetivo",
    "trophy":"Conquista","truck":"Transporte","users":"Usuários",
    "wallet":"Finanças","zap":"Desafio","info":"Informação","bird":"Coruja"
  };

  const emojiPattern = /(?:[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3|\p{Extended_Pictographic}[\uFE0E\uFE0F]?\p{Emoji_Modifier}?(?:\u200D\p{Extended_Pictographic}[\uFE0E\uFE0F]?\p{Emoji_Modifier}?)*)/gu;
  const unchanged = new Set(["©", "®", "™"]);
  const skipSelector = "script,style,noscript,textarea,pre,code,svg,math,canvas,[contenteditable],[data-mente-no-icons],.mente-ui-icon";
  const watchedAttributes = ["title","aria-label","placeholder","alt"];
  const allowedSvg = 'http://www.w3.org/2000/svg';

  function normalize(token) {
    return token.replace(/[\uFE0E\uFE0F]/g, "").replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "");
  }

  function iconFor(token) {
    const n = normalize(token);
    if (/^[0-9#*]\u20E3$/.test(n)) return "info";
    if (/^[\u{1F1E6}-\u{1F1FF}]{2}$/u.test(n)) return "flag";
    return icons[n] || "info";
  }

  function makeIcon(token) {
    const name = iconFor(token);
    const wrapper = document.createElement("span");
    wrapper.className = "mente-ui-icon";
    wrapper.setAttribute("role", "img");
    wrapper.setAttribute("aria-label", descriptions[name] || "Ícone");
    wrapper.dataset.menteIcon = name;

    const svg = document.createElementNS(allowedSvg, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.9");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.innerHTML = shapes[name] || shapes.info;
    wrapper.appendChild(svg);
    return wrapper;
  }

  function hasEmoji(text) {
    emojiPattern.lastIndex = 0;
    return emojiPattern.test(text);
  }

  function replaceTextNode(node) {
    if (!node || !node.parentElement || node.parentElement.closest(skipSelector)) return;
    if (!hasEmoji(node.nodeValue || "")) return;
    const text = node.nodeValue || "";
    const parentTag = node.parentElement.tagName;
    const matches = Array.from(text.matchAll(emojiPattern));
    if (!matches.some(function (item) { return !unchanged.has(item[0]); })) return;

    if (parentTag === "OPTION" || parentTag === "TITLE") {
      node.nodeValue = text.replace(emojiPattern, function (token) {
        return unchanged.has(token) ? token : (descriptions[iconFor(token)] || "");
      });
      return;
    }

    const fragment = document.createDocumentFragment();
    let start = 0;
    matches.forEach(function (item) {
      const at = item.index;
      if (at > start) fragment.appendChild(document.createTextNode(text.slice(start, at)));
      if (unchanged.has(item[0])) fragment.appendChild(document.createTextNode(item[0]));
      else fragment.appendChild(makeIcon(item[0]));
      start = at + item[0].length;
    });
    if (start < text.length) fragment.appendChild(document.createTextNode(text.slice(start)));
    node.parentNode.replaceChild(fragment, node);
  }

  function replaceAttributes(element) {
    if (!element || element.nodeType !== 1 || element.closest(skipSelector)) return;
    watchedAttributes.forEach(function (name) {
      if (!element.hasAttribute(name)) return;
      const value = element.getAttribute(name);
      if (!value || !hasEmoji(value)) return;
      const updated = value.replace(emojiPattern, function (token) {
        return unchanged.has(token) ? token : "";
      }).replace(/\s{2,}/g, " ").trim();
      element.setAttribute(name, updated || descriptions[iconFor((value.match(emojiPattern) || [])[0] || "")] || "Ícone");
    });
  }

  function processNode(root) {
    if (!root) return;
    if (root.nodeType === 3) { replaceTextNode(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && root.matches(skipSelector)) return;

    if (root.nodeType === 1) replaceAttributes(root);
    const attributes = root.querySelectorAll ? root.querySelectorAll("[title],[aria-label],[placeholder],[alt]") : [];
    attributes.forEach(replaceAttributes);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return node.parentElement && !node.parentElement.closest(skipSelector)
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(replaceTextNode);
  }

  function start() {
    processNode(document.documentElement);
    const observer = new MutationObserver(function (changes) {
      changes.forEach(function (change) {
        if (change.type === "characterData") replaceTextNode(change.target);
        else if (change.type === "attributes") replaceAttributes(change.target);
        else change.addedNodes.forEach(processNode);
      });
    });
    observer.observe(document.documentElement, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: watchedAttributes
    });
    window.menteIconsRefresh = function () { processNode(document.documentElement); };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else start();
})();
