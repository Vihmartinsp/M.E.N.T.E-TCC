"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;
  if (window.__MENTE_PDF_EXPLANATIONS_RESTORED__) return;
  window.__MENTE_PDF_EXPLANATIONS_RESTORED__ = true;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  // O mente-final-core cria versões resumidas dessas matérias. Elas são removidas
  // antes de restaurarmos as explicações completas baseadas nos PDFs do TCC.
  ["#estatistica-probabilidade", "#matematica-financeira", "#grandezas-medidas"].forEach((selector) => {
    main.querySelector(selector)?.remove();
  });

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function normalizeIdsAndLinks() {
    const replacements = [
      ["estatistica", "estatistica-probabilidade"],
      ["financeira", "matematica-financeira"],
      ["grandezas", "grandezas-medidas"],
    ];

    replacements.forEach(([oldId, newId]) => {
      const section = document.getElementById(oldId);
      if (section) section.id = newId;

      document.querySelectorAll(`a[href="#${oldId}"]`).forEach((link) => {
        link.setAttribute("href", `#${newId}`);
      });
    });

    const nav = document.querySelector(".mente-subject-nav");
    if (nav) {
      const expected = {
        "Estatística e Probabilidade": "#estatistica-probabilidade",
        "Matemática Financeira": "#matematica-financeira",
        "Grandezas e Medidas": "#grandezas-medidas",
      };
      Object.entries(expected).forEach(([label, href]) => {
        const link = [...nav.querySelectorAll("a")].find((item) => item.textContent.includes(label));
        if (link) link.href = href;
      });
    }
  }

  (async () => {
    try {
      // A ordem importa: Financeira é inserida depois de Estatística e Grandezas
      // é inserida depois de Financeira.
      await loadScript("explicacoes-estatistica.js?v=3");
      await loadScript("explicacoes-financeira.js?v=2");
      await loadScript("explicacoes-grandezas.js?v=2");
      normalizeIdsAndLinks();

      const legacyHash = {
        "#estatistica": "#estatistica-probabilidade",
        "#financeira": "#matematica-financeira",
        "#grandezas": "#grandezas-medidas",
      };
      if (legacyHash[location.hash]) {
        history.replaceState(null, "", legacyHash[location.hash]);
      }

      if (location.hash && document.querySelector(location.hash)) {
        requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ block: "start" }));
      }
    } catch (error) {
      console.error("Não foi possível restaurar as explicações completas do M.E.N.T.E.", error);
    }
  })();
})();
