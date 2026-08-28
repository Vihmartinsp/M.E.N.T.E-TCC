"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  const functions = main.querySelector("#funcoes");
  if (!functions) return;

  const section = document.createElement("section");
  section.className = "statistics-guide mente-statistics-final";
  section.id = "estatistica";
  section.innerHTML = `
    <header class="statistics-guide__hero">
      <p class="statistics-guide__eyebrow">Explicação completa</p>
      <h2>📊 ESTATÍSTICA E PROBABILIDADE</h2>
      <p><strong>Estatística serve para entender informações.</strong> <strong>Probabilidade serve para prever possibilidades.</strong> No ENEM, o mais importante é interpretar as informações antes de fazer contas.</p>
      <nav class="statistics-guide__toc" aria-label="Tópicos da explicação de Estatística e Probabilidade">
        <a href="#o-que-e-estatistica">O que é?</a>
        <a href="#enem-estatistica">Como o ENEM cobra</a>
        <a href="#segredo-estatistica">O segredo</a>
        <a href="#conceitos-estatistica">Conceitos principais</a>
        <a href="#enunciado-estatistica">O que destacar</a>
        <a href="#pensar-estatistica">Como pensar</a>
      </nav>
    </header>

    <article class="statistics-section statistics-accent" id="o-que-e-estatistica">
      <h3>O que é Estatística e Probabilidade?</h3>
      <p>Quando ouvimos essas palavras, muita gente pensa em:</p>
      <ul>
        <li>porcentagens;</li>
        <li>médias;</li>
        <li>gráficos difíceis.</li>
      </ul>
      <p>Mas, na verdade:</p>
      <ul>
        <li><strong>Estatística serve para entender informações.</strong></li>
        <li><strong>Probabilidade serve para prever possibilidades.</strong></li>
      </ul>
      <p>Todos os dias usamos isso.</p>
      <div class="statistics-grid">
        <div class="statistics-mini-card"><h4>🌦️ Previsão do tempo</h4><p>É uma situação do cotidiano em que usamos informações e possibilidades.</p></div>
        <div class="statistics-mini-card"><h4>💰 Inflação</h4><p>É um exemplo de informação analisada por meio de dados.</p></div>
        <div class="statistics-mini-card"><h4>⚽ Esportes</h4><p>A chance de um time vencer também envolve esse tipo de análise.</p></div>
        <div class="statistics-mini-card"><h4>💉 Vacinas</h4><p>Pesquisas sobre vacinas utilizam Estatística.</p></div>
      </div>
      <div class="statistics-callout">Por isso, o ENEM quer saber se você consegue <strong>interpretar informações antes de fazer contas.</strong></div>
    </article>

    <article class="statistics-section" id="enem-estatistica">
      <h3>Como o ENEM cobra Estatística?</h3>
      <p>O ENEM quase nunca pergunta apenas:</p>
      <div class="statistics-callout"><strong>“Calcule a média.”</strong></div>
      <p>Normalmente aparecem situações como:</p>
      <ul>
        <li>pesquisas de opinião;</li>
        <li>rendimento escolar;</li>
        <li>vacinação;</li>
        <li>esportes;</li>
        <li>economia;</li>
        <li>saúde.</li>
      </ul>
      <p><strong>Primeiro aparece uma situação.</strong></p>
      <p><strong>Depois aparecem os dados.</strong></p>
      <p>A Matemática serve para interpretar essas informações.</p>
    </article>

    <article class="statistics-section" id="segredo-estatistica">
      <h3>O segredo da Estatística</h3>
      <p>Toda questão pode ser pensada assim:</p>
      <div class="statistics-flow"><span>Situação</span><b>→</b><span>Dados</span><b>→</b><span>Informação</span><b>→</b><span>Resposta</span></div>
      <p>Muitos alunos fazem:</p>
      <div class="statistics-flow"><span>Conta</span><b>→</b><span>Conta</span><b>→</b><span>Conta</span><b>→</b><span>Erro</span></div>
      <p>Antes de calcular, pergunte:</p>
      <ol>
        <li><strong>O que esses números representam?</strong></li>
        <li><strong>Qual informação eles querem mostrar?</strong></li>
        <li><strong>O que preciso comparar?</strong></li>
      </ol>
    </article>

    <article class="statistics-section" id="conceitos-estatistica">
      <h3>Conceitos mais importantes</h3>
      <div class="statistics-concepts">
        <div class="statistics-concept-card">
          <h4>Média</h4>
          <p>É o valor que <strong>representa um conjunto</strong>.</p>
          <ol>
            <li><strong>Some todos os valores.</strong></li>
            <li><strong>Depois divida pela quantidade.</strong></li>
          </ol>
          <p>Não é apenas uma fórmula.</p>
          <p>É uma forma de representar um grupo inteiro com um único número.</p>
        </div>

        <div class="statistics-concept-card">
          <h4>Moda</h4>
          <p>É o valor que <strong>mais aparece</strong>.</p>
          <p>Imagine uma sala onde as notas são:</p>
          <div class="statistics-example">6 &nbsp; 7 &nbsp; <strong>7</strong> &nbsp; 8 &nbsp; 9<br><br><strong>A moda é 7.</strong></div>
        </div>

        <div class="statistics-concept-card">
          <h4>Mediana</h4>
          <p>É o valor que fica exatamente no meio quando os números estão organizados.</p>
          <p>Ela evita que valores muito altos ou muito baixos distorçam a análise.</p>
          <div class="statistics-example">
            <strong>Exemplo 1</strong><br>
            1, 2, 3, 4, 5<br>
            A mediana é <strong>3</strong>.<br><br>
            <strong>Exemplo 2</strong><br>
            1, 2, 3, 4, 5, 6<br>
            Nesse caso, somamos os valores do meio:<br>
            3 + 4 = 7<br>
            Depois dividimos por dois:<br>
            7 / 2 = <strong>3,5</strong><br>
            A mediana é <strong>3,5</strong>.
          </div>
        </div>

        <div class="statistics-concept-card">
          <h4>Probabilidade</h4>
          <p>Mostra a <strong>chance de um evento acontecer</strong>.</p>
          <p>Ela sempre compara:</p>
          <div class="statistics-flow"><span>casos favoráveis</span><b>com</b><span>casos possíveis</span></div>
          <p>Quanto maior essa relação, maior a chance.</p>
          <span class="statistics-formula">P = evento esperado / total de possibilidades</span>
        </div>
      </div>
    </article>

    <article class="statistics-section" id="enunciado-estatistica">
      <h3>O que destacar no enunciado?</h3>
      <div class="pedagogy-list">
        <div class="pedagogy-item pedagogy-item--objective"><strong>Objetivo</strong><span>“qual a média”; “qual a probabilidade”; “qual representa”; “qual porcentagem”.</span></div>
        <div class="pedagogy-item pedagogy-item--data"><strong>Dados importantes</strong><span>tabelas; gráficos; quantidades; frequências; percentuais; totais.</span></div>
        <div class="pedagogy-item pedagogy-item--tip"><strong>Dicas escondidas</strong><span>“amostra”; “população”; “aproximadamente”; “em média”.</span></div>
        <div class="pedagogy-item pedagogy-item--trap"><strong>Armadilhas</strong><span>esquecer de ler os eixos do gráfico; confundir porcentagem com quantidade; usar todos os dados quando a questão pede apenas parte deles; não observar unidades.</span></div>
      </div>
    </article>

    <article class="statistics-section" id="pensar-estatistica">
      <h3>Como pensar durante uma questão?</h3>
      <p>Sempre faça este caminho:</p>
      <ol class="statistics-checklist">
        <li><strong>O que está sendo analisado?</strong></li>
        <li><strong>Quais dados foram fornecidos?</strong></li>
        <li><strong>Como esses dados se relacionam?</strong></li>
        <li><strong>O que preciso descobrir?</strong></li>
        <li><strong>Existe alguma informação escondida?</strong></li>
        <li><strong>Agora sim: escolho o cálculo.</strong></li>
      </ol>
    </article>

    <article class="statistics-summary">
      <h3>Resumo</h3>
      <p><strong>Estatística não serve apenas para fazer contas.</strong></p>
      <p>Ela serve para <strong>transformar dados em informação</strong>.</p>
      <p>No ENEM, quem interpreta corretamente tabelas, gráficos e pesquisas normalmente resolve a maior parte da questão antes mesmo de pegar na calculadora.</p>
      <a class="portal-button" href="questoes.html">Praticar questões de Estatística e Probabilidade →</a>
    </article>`;

  functions.insertAdjacentElement("afterend", section);

  const subjects = main.querySelector(".explanation-subjects");
  if (subjects) {
    const statLink = [...subjects.querySelectorAll("a")].find((link) => link.textContent.includes("Estatística e Probabilidade"));
    if (statLink) {
      statLink.classList.remove("is-coming");
      statLink.removeAttribute("aria-disabled");
      statLink.removeAttribute("onclick");
      statLink.href = "#estatistica";
      statLink.textContent = "📊 Estatística e Probabilidade";
    }
  }

  const geometryOther = main.querySelector(".geometry-other__grid");
  if (geometryOther) {
    const statCard = [...geometryOther.children].find((item) => item.textContent.includes("Estatística e Probabilidade"));
    if (statCard) {
      statCard.innerHTML = '<strong>Estatística e Probabilidade</strong>Média, moda, mediana, probabilidade e interpretação de dados.<br><a class="statistics-study-link" href="#estatistica">Abrir explicação →</a>';
    }
  }

  if (location.hash === "#estatistica" || location.hash.startsWith("#o-que-e-estatistica") || location.hash.startsWith("#enem-estatistica") || location.hash.startsWith("#segredo-estatistica") || location.hash.startsWith("#conceitos-estatistica") || location.hash.startsWith("#enunciado-estatistica") || location.hash.startsWith("#pensar-estatistica")) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
})();
