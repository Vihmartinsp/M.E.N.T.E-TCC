"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  const finance = main.querySelector("#financeira");
  if (!finance) return;

  const section = document.createElement("section");
  section.className = "measures-guide mente-measures-final";
  section.id = "grandezas";
  section.innerHTML = `
    <header class="measures-guide__hero">
      <p class="measures-guide__eyebrow">Explicação completa</p>
      <h2>🔴 GRANDEZAS E MEDIDAS</h2>
      <p>Grandezas e Medidas aparecem em praticamente todas as áreas da Matemática. <strong>Uma grandeza é qualquer coisa que pode ser medida.</strong> No ENEM, o mais importante é perceber quando uma conversão é necessária antes de resolver o problema.</p>
      <nav class="measures-guide__toc" aria-label="Tópicos da explicação de Grandezas e Medidas">
        <a href="#o-que-sao-grandezas">O que são?</a>
        <a href="#enem-grandezas">Como o ENEM cobra</a>
        <a href="#segredo-grandezas">O segredo</a>
        <a href="#unidades-grandezas">Unidades</a>
        <a href="#enunciado-grandezas">O que destacar</a>
        <a href="#pensar-grandezas">Como pensar</a>
      </nav>
    </header>

    <article class="measures-section measures-accent" id="o-que-sao-grandezas">
      <h3>O que são Grandezas e Medidas?</h3>
      <p>Quando ouvimos esse nome, muita gente pensa apenas em:</p>
      <ul>
        <li>quilômetros;</li>
        <li>litros;</li>
        <li>quilos.</li>
      </ul>
      <p>Mas esse conteúdo vai muito além disso.</p>
      <p><strong>Uma grandeza é qualquer coisa que pode ser medida.</strong></p>
      <div class="measures-grid">
        <div class="measures-mini-card"><h4>📏 Comprimento</h4><p>Distâncias e medidas lineares.</p></div>
        <div class="measures-mini-card"><h4>⚖️ Massa</h4><p>Medidas como quilogramas e gramas.</p></div>
        <div class="measures-mini-card"><h4>🥤 Capacidade</h4><p>Litros, mililitros e outras medidas de capacidade.</p></div>
        <div class="measures-mini-card"><h4>⬜ Área, volume e tempo</h4><p>Também são grandezas que aparecem frequentemente nos problemas.</p></div>
      </div>
      <div class="measures-callout">Por isso, o ENEM não quer saber apenas se você sabe converter unidades. Ele quer descobrir se você consegue <strong>perceber quando uma conversão é necessária antes de resolver o problema.</strong></div>
    </article>

    <article class="measures-section" id="enem-grandezas">
      <h3>Como o ENEM cobra Grandezas e Medidas?</h3>
      <p>O ENEM quase nunca pergunta apenas:</p>
      <div class="measures-callout"><strong>“Converta metros para centímetros.”</strong></div>
      <p>Normalmente ele apresenta situações como:</p>
      <ul>
        <li>consumo de água;</li>
        <li>construção civil;</li>
        <li>receitas;</li>
        <li>embalagens;</li>
        <li>mapas;</li>
        <li>velocidade;</li>
        <li>combustível.</li>
      </ul>
      <p><strong>Primeiro aparece o problema.</strong></p>
      <p><strong>Depois surge a necessidade da conversão.</strong></p>
    </article>

    <article class="measures-section" id="segredo-grandezas">
      <h3>O segredo das Grandezas</h3>
      <p>Toda questão pode ser pensada assim:</p>
      <div class="measures-flow"><span>Situação</span><b>→</b><span>Unidade</span><b>→</b><span>Conversão</span><b>→</b><span>Cálculo</span><b>→</b><span>Resposta</span></div>
      <p>Muitos alunos fazem:</p>
      <div class="measures-flow"><span>Conta</span><b>→</b><span>Conta</span><b>→</b><span>Erro</span></div>
      <p>Antes de calcular, pergunte:</p>
      <ul>
        <li><strong>Todas as unidades são iguais?</strong></li>
        <li><strong>Preciso converter alguma medida?</strong></li>
        <li><strong>A resposta deve sair em qual unidade?</strong></li>
      </ul>
      <p><strong>Só depois faça os cálculos.</strong></p>
    </article>

    <article class="measures-section" id="unidades-grandezas">
      <h3>As unidades mais importantes</h3>
      <p>Você não precisa decorar tudo. Precisa entender como cada unidade <strong>“anda” na tabela</strong>.</p>
      <div class="measure-conversion-grid">
        <div class="measure-conversion-card">
          <h4>Comprimento</h4>
          <div class="measure-scale"><span>km</span><b>→</b><span>hm</span><b>→</b><span>dam</span><b>→</b><span>m</span><b>→</b><span>dm</span><b>→</b><span>cm</span><b>→</b><span>mm</span></div>
          <span class="measure-rule">Cada casa: ×10 → | ÷10 ←</span>
        </div>
        <div class="measure-conversion-card">
          <h4>Área</h4>
          <div class="measure-scale"><span>km²</span><b>→</b><span>hm²</span><b>→</b><span>dam²</span><b>→</b><span>m²</span><b>→</b><span>dm²</span><b>→</b><span>cm²</span><b>→</b><span>mm²</span></div>
          <span class="measure-rule">Cada casa: ×100 → | ÷100 ←</span>
        </div>
        <div class="measure-conversion-card">
          <h4>Volume</h4>
          <div class="measure-scale"><span>km³</span><b>→</b><span>hm³</span><b>→</b><span>dam³</span><b>→</b><span>m³</span><b>→</b><span>dm³</span><b>→</b><span>cm³</span><b>→</b><span>mm³</span></div>
          <span class="measure-rule">Cada casa: ×1000 → | ÷1000 ←</span>
        </div>
        <div class="measure-conversion-card">
          <h4>Massa</h4>
          <div class="measure-scale"><span>kg</span><b>→</b><span>hg</span><b>→</b><span>dag</span><b>→</b><span>g</span><b>→</b><span>dg</span><b>→</b><span>cg</span><b>→</b><span>mg</span></div>
          <span class="measure-rule">Cada casa vale ×10</span>
        </div>
        <div class="measure-conversion-card">
          <h4>Capacidade</h4>
          <div class="measure-scale"><span>kL</span><b>→</b><span>hL</span><b>→</b><span>daL</span><b>→</b><span>L</span><b>→</b><span>dL</span><b>→</b><span>cL</span><b>→</b><span>mL</span></div>
          <span class="measure-rule">Cada casa vale ×10</span>
        </div>
      </div>
    </article>

    <article class="measures-section" id="enunciado-grandezas">
      <h3>O que destacar no enunciado?</h3>
      <div class="pedagogy-list">
        <div class="pedagogy-item pedagogy-item--objective"><strong>Objetivo</strong><span>“converta”; “determine”; “calcule”; “expresse em”; “qual unidade”.</span></div>
        <div class="pedagogy-item pedagogy-item--data"><strong>Dados importantes</strong><span>metros; centímetros; litros; quilogramas; horas; quilômetros.</span></div>
        <div class="pedagogy-item pedagogy-item--tip"><strong>Dicas de interpretação e raciocínio</strong><span>“na mesma unidade”; “equivale”; “aproximadamente”; “transforme”.</span></div>
        <div class="pedagogy-item pedagogy-item--trap"><strong>Erros comuns e armadilhas</strong><span>esquecer de converter unidades; usar ×10 em área ou volume; misturar litros com mililitros; misturar metros com centímetros.</span></div>
      </div>
    </article>

    <article class="measures-section" id="pensar-grandezas">
      <h3>Como pensar durante uma questão?</h3>
      <p>Sempre faça este caminho:</p>
      <ol class="measures-checklist">
        <li><strong>Qual é a situação?</strong></li>
        <li><strong>Quais unidades aparecem?</strong></li>
        <li><strong>Todas estão na mesma unidade?</strong></li>
        <li><strong>O que preciso descobrir?</strong></li>
        <li><strong>Preciso converter alguma medida?</strong></li>
        <li><strong>Agora sim: faço os cálculos.</strong></li>
      </ol>
    </article>

    <article class="measures-summary">
      <h3>Resumo</h3>
      <p><strong>Grandezas e Medidas não exigem decorar dezenas de conversões.</strong></p>
      <p>O mais importante é identificar <strong>quando converter</strong> e <strong>qual regra usar</strong>. Depois disso, a maior parte das questões do ENEM se torna muito mais simples de resolver.</p>
      <a class="portal-button" href="questoes.html">Praticar questões de Grandezas e Medidas →</a>
    </article>`;

  finance.insertAdjacentElement("afterend", section);

  const subjects = main.querySelector(".explanation-subjects");
  if (subjects) {
    const link = [...subjects.querySelectorAll("a")].find((item) => item.textContent.includes("Grandezas e Medidas"));
    if (link) {
      link.classList.remove("is-coming");
      link.removeAttribute("aria-disabled");
      link.removeAttribute("onclick");
      link.href = "#grandezas";
      link.textContent = "⚖️ Grandezas e Medidas";
    }
  }

  const geometryOther = main.querySelector(".geometry-other__grid");
  if (geometryOther) {
    const card = [...geometryOther.children].find((item) => item.textContent.includes("Grandezas e Medidas"));
    if (card) {
      card.innerHTML = '<strong>Grandezas e Medidas</strong>Comprimento, massa, capacidade, área, volume e conversões.<br><a class="measures-study-link" href="#grandezas">Abrir explicação →</a>';
    }
  }

  if (location.hash === "#grandezas" || location.hash.startsWith("#o-que-sao-grandezas") || location.hash.startsWith("#enem-grandezas") || location.hash.startsWith("#segredo-grandezas") || location.hash.startsWith("#unidades-grandezas") || location.hash.startsWith("#enunciado-grandezas") || location.hash.startsWith("#pensar-grandezas")) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
})();
