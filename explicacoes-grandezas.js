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
      <p class="measures-guide__eyebrow">M.E.N.T.E · Matemática ENEM Traduzida e Explicada</p>
      <h2>🔴 GRANDEZAS E MEDIDAS</h2>
      <p>Grandezas e Medidas aparecem em praticamente todas as áreas da Matemática. Uma grandeza é tudo aquilo que pode ser medido, como comprimento, massa, capacidade, área, volume e tempo.</p>
      <p>No ENEM, a dificuldade normalmente não está em uma conversão isolada. O desafio é perceber <strong>quando as unidades precisam ser compatibilizadas antes de fazer a conta.</strong></p>
      <nav class="measures-guide__toc" aria-label="Tópicos da explicação de Grandezas e Medidas">
        <a href="#caminho-grandezas">Caminho M.E.N.T.E</a>
        <a href="#conversoes-grandezas">Conversões</a>
        <a href="#cores-grandezas">Sistema de cores</a>
        <a href="#sequencia-grandezas">Questões do módulo</a>
      </nav>
    </header>

    <article class="measures-section measures-accent" id="caminho-grandezas">
      <h3>Como interpretar antes de calcular</h3>
      <p>Use este caminho:</p>
      <div class="measures-flow"><span>Situação</span><b>→</b><span>Unidade</span><b>→</b><span>Conversão</span><b>→</b><span>Cálculo</span><b>→</b><span>Resposta</span></div>
      <p>Antes de calcular, pergunte:</p>
      <ul>
        <li>Todas as medidas estão na mesma unidade?</li>
        <li>A resposta deve sair em qual unidade?</li>
        <li>A grandeza é de comprimento, área, volume, capacidade, tempo ou uma unidade derivada?</li>
        <li>A escala é linear ou a questão está falando de área?</li>
      </ul>
    </article>

    <article class="measures-section" id="conversoes-grandezas">
      <h3>Conversões que mais ajudam neste módulo</h3>
      <div class="measure-conversion-grid">
        <div class="measure-conversion-card">
          <h4>Comprimento</h4>
          <div class="measure-scale"><span>km</span><b>→</b><span>hm</span><b>→</b><span>dam</span><b>→</b><span>m</span><b>→</b><span>dm</span><b>→</b><span>cm</span><b>→</b><span>mm</span></div>
          <span class="measure-rule">Cada passo: ×10 → | ÷10 ←</span>
        </div>
        <div class="measure-conversion-card">
          <h4>Área</h4>
          <div class="measure-scale"><span>km²</span><b>→</b><span>hm²</span><b>→</b><span>dam²</span><b>→</b><span>m²</span><b>→</b><span>dm²</span><b>→</b><span>cm²</span><b>→</b><span>mm²</span></div>
          <span class="measure-rule">Cada passo: ×100 → | ÷100 ←</span>
          <p>O fator é 100 porque duas dimensões estão sendo convertidas.</p>
        </div>
        <div class="measure-conversion-card">
          <h4>Volume</h4>
          <div class="measure-scale"><span>km³</span><b>→</b><span>hm³</span><b>→</b><span>dam³</span><b>→</b><span>m³</span><b>→</b><span>dm³</span><b>→</b><span>cm³</span><b>→</b><span>mm³</span></div>
          <span class="measure-rule">Cada passo: ×1000 → | ÷1000 ←</span>
        </div>
        <div class="measure-conversion-card">
          <h4>Capacidade e volume</h4>
          <p><strong>1 mL = 1 cm³</strong> e <strong>1 L = 1 dm³</strong>.</p>
          <p>Essas equivalências evitam conversões desnecessárias em muitos problemas.</p>
        </div>
        <div class="measure-conversion-card">
          <h4>Tempo</h4>
          <p>Quando duas contagens usam durações diferentes, transforme ambas para uma unidade comum, como dias, antes de comparar.</p>
        </div>
        <div class="measure-conversion-card">
          <h4>Unidades derivadas</h4>
          <p>Se uma grandeza é definida por uma razão, a unidade segue a mesma razão.</p>
          <p><strong>Exemplo:</strong> intensidade luminosa dividida por distância ao quadrado gera <strong>cd/m²</strong>.</p>
        </div>
        <div class="measure-conversion-card measure-conversion-card--wide">
          <h4>Escala</h4>
          <p>Numa escala <strong>1:n</strong>, uma medida linear do desenho corresponde a <strong>n</strong> vezes essa medida na realidade.</p>
          <p>Para áreas, o fator passa a ser <strong>n²</strong>.</p>
        </div>
      </div>
    </article>

    <article class="measures-section" id="cores-grandezas">
      <h3>Sistema de cores do M.E.N.T.E</h3>
      <div class="pedagogy-list">
        <div class="pedagogy-item pedagogy-item--objective"><strong>Objetivo</strong><span>O que a questão quer descobrir.</span></div>
        <div class="pedagogy-item pedagogy-item--data"><strong>Dados importantes</strong><span>Medidas, unidades, proporções, escalas e valores necessários.</span></div>
        <div class="pedagogy-item pedagogy-item--tip"><strong>Pista de interpretação</strong><span>Palavras que indicam conversão, equivalência ou relação entre grandezas.</span></div>
        <div class="pedagogy-item pedagogy-item--trap"><strong>Armadilha</strong><span>Erros frequentes de unidade, escala ou fator de conversão.</span></div>
        <div class="pedagogy-item pedagogy-item--strategy"><strong>Estratégia</strong><span>O plano de resolução antes de fazer os cálculos.</span></div>
      </div>
    </article>

    <article class="measures-section" id="sequencia-grandezas">
      <h3>Sequência das questões</h3>
      <p>Os cinco níveis do módulo usam questões oficiais do ENEM e avançam da equivalência direta entre unidades até escala de área.</p>
      <div class="measures-table-wrap">
        <table class="measures-question-table">
          <thead><tr><th>Nível</th><th>Ano</th><th>Questão</th><th>Conteúdo</th><th>Gabarito</th></tr></thead>
          <tbody>
            <tr><td>⭐</td><td>2025</td><td>159</td><td>Capacidade e volume: cm³ e mL</td><td>D</td></tr>
            <tr><td>⭐⭐</td><td>2025</td><td>179</td><td>Unidade derivada: cd/m²</td><td>A</td></tr>
            <tr><td>⭐⭐⭐</td><td>2025</td><td>156</td><td>Escala e conversão de medidas</td><td>E</td></tr>
            <tr><td>⭐⭐⭐⭐</td><td>2023</td><td>171</td><td>Conversão entre calendários</td><td>C</td></tr>
            <tr><td>⭐⭐⭐⭐⭐</td><td>2024</td><td>151</td><td>Escala de área e conversão m²/cm²</td><td>E</td></tr>
          </tbody>
        </table>
      </div>
      <a class="measures-study-link" href="questoes.html">Praticar Grandezas e Medidas →</a>
    </article>

    <article class="measures-summary">
      <h3>Dica para levar para a prova</h3>
      <p>Antes da conta, confirme a unidade. Em Grandezas e Medidas, uma conversão correta costuma decidir toda a questão.</p>
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
      card.innerHTML = '<strong>Grandezas e Medidas</strong>Comprimento, capacidade, área, volume, tempo, unidades derivadas e escalas.<br><a class="measures-study-link" href="#grandezas">Abrir explicação →</a>';
    }
  }

  if (
    location.hash === "#grandezas" ||
    location.hash.startsWith("#caminho-grandezas") ||
    location.hash.startsWith("#conversoes-grandezas") ||
    location.hash.startsWith("#cores-grandezas") ||
    location.hash.startsWith("#sequencia-grandezas")
  ) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
})();
