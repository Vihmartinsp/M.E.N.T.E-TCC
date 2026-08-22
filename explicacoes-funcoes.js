"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  const geometry = main.querySelector("#geometria");
  if (!geometry) return;

  if (!main.querySelector(".explanation-subjects")) {
    const subjects = document.createElement("nav");
    subjects.className = "explanation-subjects";
    subjects.setAttribute("aria-label", "Escolher matéria para estudar");
    subjects.innerHTML = `
      <a data-subject="geometry" href="#geometria">📐 Geometria</a>
      <a data-subject="functions" href="#funcoes">ƒ Funções</a>
      <a class="is-coming" href="#" aria-disabled="true" onclick="return false">📊 Estatística e Probabilidade · em breve</a>
      <a class="is-coming" href="#" aria-disabled="true" onclick="return false">💰 Matemática Financeira · em breve</a>
      <a class="is-coming" href="#" aria-disabled="true" onclick="return false">⚖️ Grandezas e Medidas · em breve</a>
      <a class="is-coming" href="#" aria-disabled="true" onclick="return false">📈 Gráficos e Tabelas · em breve</a>`;
    main.insertBefore(subjects, geometry);
  }

  const section = document.createElement("section");
  section.className = "functions-guide";
  section.id = "funcoes";
  section.innerHTML = `
    <header class="functions-guide__hero">
      <p class="functions-guide__eyebrow">Explicação completa</p>
      <h2>Funções sem mistério</h2>
      <p>Quando ouvimos a palavra Função, muita gente pensa em gráficos, letras como x e y ou equações enormes. Mas a ideia é bem mais simples: <strong>uma função representa uma relação entre duas grandezas</strong>. Sempre que uma coisa muda e faz outra mudar também, existe uma função.</p>
      <nav class="functions-guide__toc" aria-label="Tópicos da explicação de Funções">
        <a href="#enem-funcoes">Como o ENEM cobra</a>
        <a href="#segredo-funcoes">O segredo</a>
        <a href="#tipos-funcoes">Tipos de função</a>
        <a href="#formulas-funcoes">Fórmulas</a>
        <a href="#enunciado-funcoes">O que destacar</a>
        <a href="#pensar-funcoes">Como pensar</a>
      </nav>
    </header>

    <article class="functions-section functions-accent">
      <h3>💡 O que são Funções?</h3>
      <p>Uma função aparece quando duas informações estão relacionadas e uma delas depende da outra.</p>
      <div class="functions-grid">
        <div class="functions-mini-card"><h4>💼 Trabalho</h4><p>Quanto mais horas você trabalha, maior pode ser o salário.</p></div>
        <div class="functions-mini-card"><h4>🚗 Distância</h4><p>Quanto mais quilômetros um carro percorre, maior tende a ser o gasto de combustível.</p></div>
        <div class="functions-mini-card"><h4>🛒 Compras</h4><p>Quanto maior a quantidade de produtos comprados, maior é o valor pago.</p></div>
        <div class="functions-mini-card"><h4>🔗 Dependência</h4><p>Em todas essas situações existe uma informação que depende da outra.</p></div>
      </div>
      <div class="functions-callout">É exatamente isso que o ENEM quer que você enxergue. Não basta fazer contas: você precisa descobrir <strong>qual grandeza depende da outra</strong>.</div>
    </article>

    <article class="functions-section" id="enem-funcoes">
      <h3>🎯 Como o ENEM cobra Funções?</h3>
      <p>No ENEM, quase nunca aparece uma questão dizendo simplesmente “resolva esta função”. Normalmente a função aparece escondida em uma situação do cotidiano.</p>
      <ul>
        <li>uma empresa cobra uma taxa fixa mais um valor por quilômetro;</li>
        <li>o consumo de água aumenta conforme o número de moradores;</li>
        <li>uma população cresce ao longo dos anos.</li>
      </ul>
      <ol>
        <li><strong>Primeiro aparece uma situação do cotidiano.</strong></li>
        <li><strong>Depois aparecem os números.</strong></li>
        <li><strong>Só então aparece a função.</strong></li>
      </ol>
      <p>Por isso, a maior dificuldade normalmente não é a conta. É descobrir <strong>qual informação muda, qual depende da outra e qual relação existe entre elas</strong>.</p>
    </article>

    <article class="functions-section" id="segredo-funcoes">
      <h3>🔑 O segredo das Funções</h3>
      <p>Toda questão de função pode ser pensada assim:</p>
      <div class="functions-flow"><span>Situação</span><b>→</b><span>Relação</span><b>→</b><span>Equação</span><b>→</b><span>Resposta</span></div>
      <p>Um erro comum é começar direto pela equação. Antes de qualquer cálculo, pergunte:</p>
      <ul>
        <li><strong>O que está mudando?</strong></li>
        <li><strong>O que depende dessa mudança?</strong></li>
        <li><strong>Existe uma regra ligando essas informações?</strong></li>
        <li><strong>Só depois disso escreva a função.</strong></li>
      </ul>
    </article>

    <article class="functions-section" id="tipos-funcoes">
      <h3>📚 Os principais tipos de função</h3>
      <div class="function-formula-grid">
        <div class="function-formula-card">
          <h4>Função afim</h4>
          <span class="function-formula">f(x) = ax + b</span>
          <p>É muito cobrada no ENEM. Pense em um aplicativo de corrida: pode existir um valor fixo para começar e outro valor que aumenta conforme a distância.</p>
          <p><strong>b</strong> representa o valor fixo. <strong>a</strong> representa quanto aumenta a cada unidade.</p>
        </div>
        <div class="function-formula-card">
          <h4>Função linear</h4>
          <span class="function-formula">f(x) = ax</span>
          <p>É um caso especial da função afim. <strong>Não existe taxa inicial</strong>: tudo começa no zero.</p>
          <p>Exemplo: cada ingresso custa R$ 25. Se ninguém comprar ingresso, o valor arrecadado será zero.</p>
        </div>
        <div class="function-formula-card">
          <h4>Função quadrática</h4>
          <span class="function-formula">f(x) = ax² + bx + c</span>
          <p>Ela aparece quando o crescimento não acontece sempre na mesma velocidade.</p>
          <p>Exemplos: trajetória de uma bola, altura de um foguete e lucro máximo de uma empresa.</p>
        </div>
        <div class="function-formula-card">
          <h4>Interpretação antes da fórmula</h4>
          <p>O ENEM normalmente cobra a interpretação do gráfico ou do problema, e não apenas a fórmula.</p>
          <p>Procure primeiro entender a relação entre as grandezas e só depois escolha o modelo adequado.</p>
        </div>
      </div>
    </article>

    <article class="functions-section" id="formulas-funcoes">
      <h3>🧠 As fórmulas mais importantes</h3>
      <p><strong>Não decore antes de entender.</strong></p>
      <div class="function-formula-grid">
        <div class="function-formula-card">
          <h4>Função afim</h4>
          <span class="function-formula">f(x) = ax + b</span>
          <p>Pergunte sempre: <strong>quanto aumenta?</strong> e <strong>existe um valor inicial?</strong></p>
        </div>
        <div class="function-formula-card">
          <h4>Função quadrática</h4>
          <span class="function-formula">f(x) = ax² + bx + c</span>
          <p>Pergunte: <strong>o crescimento continua igual ou muda ao longo do tempo?</strong></p>
        </div>
      </div>
      <h4>Coeficiente angular (a)</h4>
      <p>Ajuda a mostrar se a função cresce, diminui ou permanece constante.</p>
      <h4>Coeficiente linear (b)</h4>
      <p>Mostra onde a função começa, isto é, o valor inicial.</p>
    </article>

    <article class="functions-section" id="enunciado-funcoes">
      <h3>🔎 O que destacar no enunciado?</h3>
      <div class="pedagogy-list">
        <div class="pedagogy-item pedagogy-item--data"><strong>Dados importantes</strong><span>Valor inicial, taxa fixa, “a cada”, “por unidade”, tempo, quilômetros, litros, idade e preço.</span></div>
        <div class="pedagogy-item pedagogy-item--objective"><strong>Objetivo</strong><span>Procure comandos como “determine o valor”, “qual será”, “calcule”, “em que momento” e “quanto custará”.</span></div>
        <div class="pedagogy-item pedagogy-item--tip"><strong>Dicas escondidas</strong><span>Palavras como “a cada”, “para cada”, “cresce”, “diminui”, “proporcional” e “constante” dão pistas sobre a relação.</span></div>
        <div class="pedagogy-item pedagogy-item--trap"><strong>Armadilhas</strong><span>Confundir taxa fixa com taxa variável; trocar quem depende de quem; montar a função ao contrário; usar apenas uma informação do texto.</span></div>
      </div>
    </article>

    <article class="functions-section" id="pensar-funcoes">
      <h3>🧭 Como pensar durante uma questão?</h3>
      <p>Sempre faça este caminho:</p>
      <ol class="functions-checklist">
        <li><strong>Qual situação está sendo apresentada?</strong> Entenda o contexto antes da conta.</li>
        <li><strong>Quais grandezas aparecem?</strong> Separe as duas informações relacionadas.</li>
        <li><strong>Qual depende da outra?</strong> Descubra qual variável muda em função da outra.</li>
        <li><strong>Existe uma taxa fixa?</strong> Procure valores que permanecem mesmo quando a outra grandeza é zero.</li>
        <li><strong>Existe uma regra?</strong> Observe expressões como “a cada”, “por unidade”, “cresce” e “diminui”.</li>
        <li><strong>Agora monte a função.</strong> Só depois da interpretação transforme a situação em linguagem matemática.</li>
      </ol>
    </article>

    <article class="functions-summary">
      <h3>✅ Resumo</h3>
      <p>As questões de Funções do ENEM <strong>não avaliam apenas se você sabe substituir valores em uma fórmula</strong>.</p>
      <p>Elas querem verificar se você consegue:</p>
      <ul>
        <li>identificar duas grandezas relacionadas;</li>
        <li>descobrir quem depende de quem;</li>
        <li>perceber a regra de formação;</li>
        <li>transformar uma situação real em linguagem matemática.</li>
      </ul>
      <p>Quando você entende esse raciocínio, a função deixa de parecer uma fórmula complicada e passa a ser uma maneira de descrever como duas informações se relacionam.</p>
      <a class="portal-button" href="questoes.html">Praticar questões de Funções →</a>
    </article>`;

  geometry.insertAdjacentElement("afterend", section);

  const geometryOther = geometry.querySelector(".geometry-other__grid");
  if (geometryOther) {
    const functionCard = [...geometryOther.children].find((item) => item.textContent.includes("Funções"));
    if (functionCard) {
      functionCard.innerHTML = '<strong>Funções</strong>Leis, taxas de variação, gráficos e relações entre grandezas.<br><a class="function-study-link" href="#funcoes">Abrir explicação →</a>';
    }
  }

  if (location.hash === "#funcoes" || location.hash.startsWith("#enem-funcoes") || location.hash.startsWith("#segredo-funcoes") || location.hash.startsWith("#tipos-funcoes") || location.hash.startsWith("#formulas-funcoes") || location.hash.startsWith("#enunciado-funcoes") || location.hash.startsWith("#pensar-funcoes")) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
})();
