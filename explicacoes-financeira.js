"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  const statistics = main.querySelector("#estatistica");
  if (!statistics) return;

  const section = document.createElement("section");
  section.className = "finance-guide mente-finance-final";
  section.id = "financeira";
  section.innerHTML = `
    <header class="finance-guide__hero">
      <p class="finance-guide__eyebrow">Explicação completa</p>
      <h2>💰 MATEMÁTICA FINANCEIRA</h2>
      <p><strong>Matemática Financeira é a Matemática usada para tomar decisões envolvendo dinheiro.</strong> No ENEM, o mais importante é interpretar a situação financeira e decidir qual cálculo deve ser feito.</p>
      <nav class="finance-guide__toc" aria-label="Tópicos da explicação de Matemática Financeira">
        <a href="#o-que-e-financeira">O que é?</a>
        <a href="#enem-financeira">Como o ENEM cobra</a>
        <a href="#segredo-financeira">O segredo</a>
        <a href="#conceitos-financeira">Capital, juros e montante</a>
        <a href="#juros-financeira">Tipos de juros</a>
        <a href="#enunciado-financeira">O que destacar</a>
        <a href="#pensar-financeira">Como pensar</a>
      </nav>
    </header>

    <article class="finance-section finance-accent" id="o-que-e-financeira">
      <h3>O que é Matemática Financeira?</h3>
      <p>Quando ouvimos a expressão Matemática Financeira, muita gente pensa imediatamente em:</p>
      <ul>
        <li>juros;</li>
        <li>porcentagens;</li>
        <li>contas de banco.</li>
      </ul>
      <p>Mas, na verdade, <strong>Matemática Financeira é apenas a Matemática usada para tomar decisões envolvendo dinheiro.</strong></p>
      <p>Ela está presente em praticamente todas as compras que fazemos.</p>
      <div class="finance-grid">
        <div class="finance-mini-card"><h4>📱 Compra</h4><p>Um celular pode ser pago à vista ou parcelado.</p></div>
        <div class="finance-mini-card"><h4>💵 Poupança</h4><p>Um dinheiro guardado na poupança rende juros.</p></div>
        <div class="finance-mini-card"><h4>💳 Cartão</h4><p>O cartão de crédito cobra juros quando a fatura atrasa.</p></div>
        <div class="finance-mini-card"><h4>🏦 Financiamento</h4><p>Um financiamento aumenta de valor ao longo do tempo.</p></div>
      </div>
      <div class="finance-callout">Por isso, o ENEM não quer saber apenas se você sabe fazer contas com porcentagens. Ele quer saber: <strong>você consegue interpretar a situação financeira e decidir qual cálculo deve ser feito?</strong></div>
    </article>

    <article class="finance-section" id="enem-financeira">
      <h3>Como o ENEM cobra Matemática Financeira?</h3>
      <p>No ENEM, dificilmente aparece uma questão dizendo:</p>
      <div class="finance-callout"><strong>“Calcule os juros.”</strong></div>
      <p>Normalmente ela vem em situações como:</p>
      <ul>
        <li>compras parceladas;</li>
        <li>descontos;</li>
        <li>promoções;</li>
        <li>financiamentos;</li>
        <li>investimentos;</li>
        <li>inflação;</li>
        <li>economia doméstica.</li>
      </ul>
      <p><strong>Primeiro aparece uma situação do dia a dia.</strong></p>
      <p><strong>Depois surge a Matemática.</strong></p>
      <p>Por isso, muitos alunos erram: eles começam fazendo contas sem entender o que realmente aconteceu.</p>
    </article>

    <article class="finance-section" id="segredo-financeira">
      <h3>O segredo da Matemática Financeira</h3>
      <p>Toda questão pode ser pensada assim:</p>
      <div class="finance-flow"><span>Situação</span><b>→</b><span>Dinheiro</span><b>→</b><span>Operação</span><b>→</b><span>Resposta</span></div>
      <p>A maioria faz assim:</p>
      <div class="finance-flow"><span>Fórmula</span><b>→</b><span>Conta</span><b>→</b><span>Erro</span></div>
      <p>Antes de calcular, pergunte:</p>
      <ul>
        <li><strong>O dinheiro aumentou ou diminuiu?</strong></li>
        <li><strong>Existe desconto ou acréscimo?</strong></li>
        <li><strong>O valor é inicial ou final?</strong></li>
        <li><strong>A mudança acontece uma única vez ou várias vezes?</strong></li>
      </ul>
      <p><strong>Só depois escolha a operação.</strong></p>
    </article>

    <article class="finance-section" id="conceitos-financeira">
      <h3>Capital, Juros e Montante</h3>
      <p>Antes de aprender as fórmulas, precisamos entender três palavras.</p>
      <div class="finance-concepts">
        <div class="finance-concept-card">
          <h4>Capital (C)</h4>
          <p>É o <strong>dinheiro inicial</strong>.</p>
          <p>É o valor que você possui ou pega emprestado antes dos juros.</p>
          <div class="finance-example">Exemplo: você empresta <strong>R$ 500</strong>. Os R$ 500 são o capital.</div>
        </div>
        <div class="finance-concept-card">
          <h4>Juros (J)</h4>
          <p>São o valor que <strong>aumenta (ou diminui) por causa do tempo</strong>.</p>
          <p>É o “custo” de usar o dinheiro.</p>
        </div>
        <div class="finance-concept-card">
          <h4>Montante (M)</h4>
          <p>É o <strong>valor final</strong>.</p>
          <span class="finance-formula">Montante = Capital + Juros</span>
          <p>Sempre que a questão perguntar “quanto será pago ao final?”, normalmente está pedindo o montante.</p>
        </div>
      </div>
    </article>

    <article class="finance-section" id="juros-financeira">
      <h3>Juros Simples e Juros Compostos</h3>
      <div class="finance-concepts">
        <div class="finance-concept-card">
          <h4>Juros Simples</h4>
          <p>Nos juros simples, os juros são calculados sempre sobre o capital inicial.</p>
          <p>Isso significa que o aumento é constante.</p>
          <span class="finance-formula">J = C × i × t</span>
          <p>Onde: J = juros, C = capital, i = taxa e t = tempo.</p>
          <p>Depois de encontrar os juros:</p>
          <span class="finance-formula">M = C + J</span>
          <div class="finance-example">Imagine R$ 100 com juros de R$ 10 por mês:<br>1 mês → R$ 110<br>2 meses → R$ 120<br>3 meses → R$ 130<br><strong>Sempre aumenta o mesmo valor.</strong></div>
        </div>
        <div class="finance-concept-card">
          <h4>Juros Compostos</h4>
          <p>Agora os juros funcionam de outro jeito: <strong>os juros passam a render novos juros</strong>.</p>
          <p>É o famoso “juros sobre juros”.</p>
          <span class="finance-formula">M = C(1 + i)<sup>t</sup></span>
          <p>Depois:</p>
          <span class="finance-formula">J = M − C</span>
          <div class="finance-example">Imagine novamente R$ 100, agora aumentando 10% por mês:<br>1º mês → R$ 110<br>2º mês → R$ 121<br>3º mês → R$ 133,10<br><strong>Agora o crescimento acelera.</strong></div>
          <p>É por isso que a fórmula possui potência.</p>
        </div>
      </div>
    </article>

    <article class="finance-section" id="enunciado-financeira">
      <h3>O que destacar no enunciado?</h3>
      <div class="pedagogy-list">
        <div class="pedagogy-item pedagogy-item--objective"><strong>Objetivo</strong><span>“calcule o montante”; “determine os juros”; “valor final”; “quanto será pago”; “investimento”.</span></div>
        <div class="pedagogy-item pedagogy-item--data"><strong>Dados importantes</strong><span>capital; tempo; taxa; parcelas; valor inicial.</span></div>
        <div class="pedagogy-item pedagogy-item--tip"><strong>Dicas de interpretação</strong><span>“ao mês”; “ao ano”; “juros simples”; “juros compostos”; “rendimento”.</span></div>
        <div class="pedagogy-item pedagogy-item--trap"><strong>Erros comuns e armadilhas</strong><span>misturar meses com anos; esquecer de transformar porcentagem em decimal; usar juros simples quando a questão é composta; confundir capital com montante.</span></div>
      </div>
    </article>

    <article class="finance-section" id="pensar-financeira">
      <h3>Como pensar durante uma questão?</h3>
      <p>Sempre faça este caminho:</p>
      <ol class="finance-checklist">
        <li><strong>Qual é a situação?</strong></li>
        <li><strong>Qual é o capital?</strong></li>
        <li><strong>Qual é a taxa?</strong></li>
        <li><strong>Quanto tempo passou?</strong></li>
        <li><strong>O que preciso descobrir?</strong></li>
        <li><strong>Qual tipo de juros está sendo usado?</strong></li>
        <li><strong>Agora sim: escolho a fórmula.</strong></li>
      </ol>
    </article>

    <article class="finance-summary">
      <h3>Resumo</h3>
      <p><strong>Matemática Financeira não é decorar fórmulas.</strong></p>
      <p>Ela é entender como o dinheiro muda ao longo do tempo.</p>
      <p>Quando você identifica corretamente o capital, a taxa, o tempo e o tipo de juros, a escolha da fórmula se torna praticamente automática.</p>
      <a class="portal-button" href="questoes.html">Praticar questões de Matemática Financeira →</a>
    </article>`;

  statistics.insertAdjacentElement("afterend", section);

  const subjects = main.querySelector(".explanation-subjects");
  if (subjects) {
    const financeLink = [...subjects.querySelectorAll("a")].find((link) => link.textContent.includes("Matemática Financeira"));
    if (financeLink) {
      financeLink.classList.remove("is-coming");
      financeLink.removeAttribute("aria-disabled");
      financeLink.removeAttribute("onclick");
      financeLink.href = "#financeira";
      financeLink.textContent = "💰 Matemática Financeira";
    }
  }

  const geometryOther = main.querySelector(".geometry-other__grid");
  if (geometryOther) {
    const financeCard = [...geometryOther.children].find((item) => item.textContent.includes("Matemática Financeira"));
    if (financeCard) {
      financeCard.innerHTML = '<strong>Matemática Financeira</strong>Capital, juros, montante e decisões envolvendo dinheiro.<br><a class="finance-study-link" href="#financeira">Abrir explicação →</a>';
    }
  }

  if (location.hash === "#financeira" || location.hash.startsWith("#o-que-e-financeira") || location.hash.startsWith("#enem-financeira") || location.hash.startsWith("#segredo-financeira") || location.hash.startsWith("#conceitos-financeira") || location.hash.startsWith("#juros-financeira") || location.hash.startsWith("#enunciado-financeira") || location.hash.startsWith("#pensar-financeira")) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
})();
