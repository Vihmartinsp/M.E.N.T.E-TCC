"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  const functions = main.querySelector("#funcoes");
  if (!functions) return;

  const section = document.createElement("section");
  section.className = "statistics-guide";
  section.id = "estatistica";
  section.innerHTML = `
    <header class="statistics-guide__hero">
      <p class="statistics-guide__eyebrow">Explicação completa</p>
      <h2>Estatística e Probabilidade sem mistério</h2>
      <p>Quando muita gente ouve essas palavras, pensa em porcentagens, médias e gráficos difíceis. Mas a ideia é mais simples: <strong>Estatística serve para entender informações</strong> e <strong>Probabilidade serve para prever possibilidades</strong>. O ENEM quer saber se você consegue interpretar dados antes de sair fazendo contas.</p>
      <nav class="statistics-guide__toc" aria-label="Tópicos da explicação de Estatística e Probabilidade">
        <a href="#enem-estatistica">Como o ENEM cobra</a>
        <a href="#segredo-estatistica">O segredo</a>
        <a href="#conceitos-estatistica">Conceitos principais</a>
        <a href="#enunciado-estatistica">O que destacar</a>
        <a href="#pensar-estatistica">Como pensar</a>
      </nav>
    </header>

    <article class="statistics-section statistics-accent">
      <h3>📊 O que é Estatística e Probabilidade?</h3>
      <p>Todos os dias usamos essas ideias sem perceber.</p>
      <div class="statistics-grid">
        <div class="statistics-mini-card"><h4>🌦️ Previsão do tempo</h4><p>Probabilidade ajuda a estimar a chance de chuva ou de outras condições acontecerem.</p></div>
        <div class="statistics-mini-card"><h4>💰 Inflação</h4><p>Estatística organiza dados para acompanhar como preços e índices mudam ao longo do tempo.</p></div>
        <div class="statistics-mini-card"><h4>⚽ Esportes</h4><p>Desempenhos, frequências, médias e comparações aparecem o tempo todo.</p></div>
        <div class="statistics-mini-card"><h4>🧪 Pesquisas</h4><p>Pesquisas de opinião, vacinas e estudos científicos dependem da análise correta de dados.</p></div>
      </div>
      <div class="statistics-callout"><strong>Primeiro entenda o que os dados representam.</strong> Só depois escolha a conta que faz sentido.</div>
    </article>

    <article class="statistics-section" id="enem-estatistica">
      <h3>🎯 Como o ENEM cobra Estatística?</h3>
      <p>O ENEM quase nunca apresenta apenas “calcule a média”. Normalmente, primeiro aparece uma situação, depois aparecem os dados, e a Matemática entra para interpretar essas informações.</p>
      <p>É comum encontrar questões sobre:</p>
      <ul>
        <li>pesquisas de opinião;</li>
        <li>rendimento escolar;</li>
        <li>vacinação e saúde;</li>
        <li>esportes;</li>
        <li>economia;</li>
        <li>saúde e população.</li>
      </ul>
      <p>A pergunta principal costuma ser: <strong>o que esses dados mostram e o que precisa ser comparado?</strong></p>
    </article>

    <article class="statistics-section" id="segredo-estatistica">
      <h3>🔑 O segredo da Estatística</h3>
      <p>Toda questão pode ser pensada assim:</p>
      <div class="statistics-flow"><span>Situação</span><b>→</b><span>Dados</span><b>→</b><span>Informação</span><b>→</b><span>Resposta</span></div>
      <p>Muitos alunos tentam fazer conta atrás de conta e acabam errando. Antes de calcular, pergunte:</p>
      <ol>
        <li><strong>O que esses números representam?</strong></li>
        <li><strong>Qual informação eles querem mostrar?</strong></li>
        <li><strong>O que preciso comparar?</strong></li>
      </ol>
    </article>

    <article class="statistics-section" id="conceitos-estatistica">
      <h3>🧠 Conceitos mais importantes</h3>
      <div class="statistics-concepts">
        <div class="statistics-concept-card">
          <h4>Média</h4>
          <p>É um valor que representa um conjunto.</p>
          <p><strong>1.</strong> Some todos os valores.<br><strong>2.</strong> Depois divida pela quantidade.</p>
          <p>Não é apenas uma fórmula: é uma forma de representar um grupo inteiro com um único número.</p>
        </div>
        <div class="statistics-concept-card">
          <h4>Moda</h4>
          <p>É o valor que <strong>mais aparece</strong>.</p>
          <div class="statistics-example">Exemplo: 6, 7, 7, 8, 9.<br><strong>A moda é 7.</strong></div>
        </div>
        <div class="statistics-concept-card">
          <h4>Mediana</h4>
          <p>É o valor que fica exatamente no meio quando os números estão organizados.</p>
          <div class="statistics-example">1, 2, 3, 4, 5 → mediana = 3.<br><br>1, 2, 3, 4, 5, 6 → valores centrais 3 e 4.<br>(3 + 4) / 2 = <strong>3,5</strong>.</div>
        </div>
        <div class="statistics-concept-card">
          <h4>Probabilidade</h4>
          <p>Mostra a <strong>chance de um evento acontecer</strong>.</p>
          <span class="statistics-formula">P = casos favoráveis / casos possíveis</span>
          <p>Ela compara aquilo que interessa com todas as possibilidades. Quanto maior essa relação, maior a chance.</p>
        </div>
      </div>
    </article>

    <article class="statistics-section" id="enunciado-estatistica">
      <h3>🔎 O que destacar no enunciado?</h3>
      <div class="pedagogy-list">
        <div class="pedagogy-item pedagogy-item--objective"><strong>Objetivo</strong><span>Procure expressões como “qual a média?”, “qual a probabilidade?”, “qual representa?” e “qual porcentagem?”.</span></div>
        <div class="pedagogy-item pedagogy-item--data"><strong>Dados importantes</strong><span>Tabelas, gráficos, quantidades, frequências, porcentagens e totais.</span></div>
        <div class="pedagogy-item pedagogy-item--tip"><strong>Dicas escondidas</strong><span>Palavras como “amostra”, “população”, “aproximadamente” e “em média” indicam como os dados devem ser interpretados.</span></div>
        <div class="pedagogy-item pedagogy-item--trap"><strong>Armadilhas</strong><span>Esquecer de ler os eixos do gráfico; confundir porcentagem com quantidade; usar todos os dados quando a questão pede apenas parte deles; não observar unidades.</span></div>
      </div>
    </article>

    <article class="statistics-section" id="pensar-estatistica">
      <h3>🧭 Como pensar durante uma questão?</h3>
      <p>Sempre faça este caminho:</p>
      <ol class="statistics-checklist">
        <li><strong>O que está sendo analisado?</strong> Identifique o assunto e o contexto.</li>
        <li><strong>Quais dados foram fornecidos?</strong> Separe números, tabelas, gráficos, frequências e porcentagens.</li>
        <li><strong>Como esses dados se relacionam?</strong> Observe o que está sendo comparado.</li>
        <li><strong>O que preciso descobrir?</strong> Média, moda, mediana, probabilidade, porcentagem ou tendência?</li>
        <li><strong>Existe alguma informação escondida?</strong> Releia palavras que mudam a interpretação.</li>
        <li><strong>Agora escolha o cálculo.</strong> A conta vem depois de entender a informação.</li>
      </ol>
    </article>

    <article class="statistics-summary">
      <h3>✅ Resumo</h3>
      <p>Estatística não serve apenas para fazer contas. <strong>Ela serve para transformar dados em informação.</strong></p>
      <p>No ENEM, quem interpreta corretamente tabelas, gráficos e pesquisas normalmente resolve grande parte da questão antes mesmo de pegar na calculadora.</p>
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

  if (location.hash === "#estatistica" || location.hash.startsWith("#enem-estatistica") || location.hash.startsWith("#segredo-estatistica") || location.hash.startsWith("#conceitos-estatistica") || location.hash.startsWith("#enunciado-estatistica") || location.hash.startsWith("#pensar-estatistica")) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
})();
