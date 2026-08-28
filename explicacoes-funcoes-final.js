"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;
  const current = document.querySelector("#funcoes");
  if (!current) return;

  current.outerHTML = `
    <section class="functions-guide mente-functions-final" id="funcoes">
      <header class="functions-guide__hero">
        <p class="functions-guide__eyebrow">Explicação completa</p>
        <h2>🟣 FUNÇÕES</h2>
        <p>Uma função representa uma relação entre duas grandezas. Sempre que uma coisa muda e faz outra mudar também, existe uma função.</p>
        <nav class="functions-guide__toc" aria-label="Tópicos da explicação de Funções">
          <a href="#o-que-sao-funcoes">O que são Funções?</a>
          <a href="#enem-funcoes">Como o ENEM cobra</a>
          <a href="#segredo-funcoes">O segredo</a>
          <a href="#tipos-funcoes">Tipos de função</a>
          <a href="#formulas-funcoes">Fórmulas</a>
          <a href="#enunciado-funcoes">O que destacar</a>
          <a href="#pensar-funcoes">Como pensar</a>
        </nav>
      </header>

      <article class="functions-section functions-accent" id="o-que-sao-funcoes">
        <h3>O que são Funções?</h3>
        <p>Quando ouvimos a palavra Função, muitas pessoas imaginam:</p>
        <ul>
          <li>gráficos;</li>
          <li>letras como x e y;</li>
          <li>equações enormes.</li>
        </ul>
        <p>Mas a ideia de função é muito mais simples.</p>
        <p><strong>Uma função representa uma relação entre duas grandezas.</strong></p>
        <p><strong>Sempre que uma coisa muda e faz outra mudar também, existe uma função.</strong></p>
        <p>Por exemplo:</p>
        <ul>
          <li>quanto mais horas você trabalha, maior é o salário;</li>
          <li>quanto mais quilômetros um carro percorre, maior é o gasto de combustível;</li>
          <li>quanto maior a quantidade de produtos comprados, maior é o valor pago.</li>
        </ul>
        <p>Perceba uma coisa.</p>
        <p><strong>Em todas essas situações existe uma informação que depende da outra.</strong></p>
        <div class="functions-callout">É exatamente isso que o ENEM quer que você enxergue. Não basta fazer contas. <strong>Você precisa descobrir qual grandeza depende da outra.</strong></div>
      </article>

      <article class="functions-section" id="enem-funcoes">
        <h3>Como o ENEM cobra Funções?</h3>
        <p>No ENEM, quase nunca aparece uma questão dizendo:</p>
        <div class="functions-callout">“Resolva esta função.”</div>
        <p>Normalmente ela vem assim:</p>
        <ul>
          <li>Uma empresa cobra uma taxa fixa mais um valor por quilômetro...</li>
          <li>O consumo de água aumenta conforme o número de moradores...</li>
          <li>Uma população cresce ao longo dos anos...</li>
        </ul>
        <p>Perceba uma coisa.</p>
        <ol>
          <li><strong>Primeiro aparece uma situação do cotidiano.</strong></li>
          <li><strong>Depois aparecem os números.</strong></li>
          <li><strong>Só então aparece a função.</strong></li>
        </ol>
        <p>Por isso, a maior dificuldade dos alunos não é resolver a conta.</p>
        <p>É descobrir:</p>
        <ul>
          <li><strong>qual informação muda;</strong></li>
          <li><strong>qual informação depende da outra;</strong></li>
          <li><strong>qual relação existe entre elas.</strong></li>
        </ul>
      </article>

      <article class="functions-section" id="segredo-funcoes">
        <h3>O segredo das Funções</h3>
        <p>Toda questão de função pode ser pensada assim:</p>
        <div class="functions-flow"><span>Situação</span><b>→</b><span>Relação</span><b>→</b><span>Equação</span><b>→</b><span>Resposta</span></div>
        <p>A maioria dos alunos faz assim:</p>
        <div class="functions-flow"><span>Equação</span><b>→</b><span>Conta</span><b>→</b><span>Erro</span></div>
        <p>Antes de qualquer cálculo, pergunte:</p>
        <ul>
          <li><strong>O que está mudando?</strong></li>
          <li><strong>O que depende dessa mudança?</strong></li>
          <li><strong>Existe uma regra ligando essas informações?</strong></li>
          <li><strong>Só depois disso escreva a função.</strong></li>
        </ul>
      </article>

      <article class="functions-section" id="tipos-funcoes">
        <h3>Os principais tipos de função</h3>
        <div class="function-formula-grid">
          <div class="function-formula-card">
            <h4>Função afim</h4>
            <p>É a mais cobrada no ENEM.</p>
            <p>Sua fórmula é:</p>
            <span class="function-formula">f(x) = ax + b</span>
            <p><strong>Mas não decore. Entenda.</strong></p>
            <p>Imagine um aplicativo de corrida.</p>
            <p>Você paga: <strong>R$ 8 para entrar no carro.</strong></p>
            <p>Depois paga <strong>R$ 2 por quilômetro.</strong></p>
            <p>Perceba:</p>
            <ul>
              <li>Existe um valor que nunca muda.</li>
              <li>Existe outro que aumenta conforme a distância.</li>
            </ul>
            <p>Essa é exatamente uma função afim.</p>
            <p>O número <strong>b representa o valor fixo.</strong></p>
            <p>O número <strong>a representa quanto aumenta a cada unidade.</strong></p>
          </div>

          <div class="function-formula-card">
            <h4>Função linear</h4>
            <p>É um caso especial da função afim.</p>
            <p>Sua fórmula é:</p>
            <span class="function-formula">f(x) = ax</span>
            <p><strong>Não existe taxa inicial.</strong></p>
            <p><strong>Tudo começa no zero.</strong></p>
            <p>Exemplo:</p>
            <p>Cada ingresso custa <strong>R$ 25.</strong></p>
            <p>Se ninguém comprar ingresso, o valor arrecadado será zero.</p>
          </div>

          <div class="function-formula-card">
            <h4>Função quadrática</h4>
            <p>Sua fórmula é:</p>
            <span class="function-formula">f(x) = ax² + bx + c</span>
            <p>Ela aparece quando o crescimento não acontece sempre na mesma velocidade.</p>
            <p>Exemplos:</p>
            <ul>
              <li>trajetória de uma bola;</li>
              <li>altura de um foguete;</li>
              <li>lucro máximo de uma empresa.</li>
            </ul>
            <p><strong>O ENEM normalmente cobra a interpretação do gráfico ou do problema, e não apenas a fórmula.</strong></p>
          </div>
        </div>
      </article>

      <article class="functions-section" id="formulas-funcoes">
        <h3>As fórmulas mais importantes</h3>
        <p><strong>Não decore antes de entender.</strong></p>
        <div class="function-formula-grid">
          <div class="function-formula-card">
            <h4>Função afim</h4>
            <span class="function-formula">f(x) = ax + b</span>
            <p>Pergunte sempre:</p>
            <ul>
              <li>quanto aumenta?</li>
              <li>existe um valor inicial?</li>
            </ul>
          </div>
          <div class="function-formula-card">
            <h4>Função quadrática</h4>
            <span class="function-formula">f(x) = ax² + bx + c</span>
            <p>Pergunte:</p>
            <ul><li>o crescimento continua igual ou muda ao longo do tempo?</li></ul>
          </div>
        </div>
        <div class="functions-grid">
          <div class="functions-mini-card">
            <h4>Coeficiente angular (a)</h4>
            <p>Mostra se a função:</p>
            <ul><li>cresce;</li><li>diminui;</li><li>ou permanece constante.</li></ul>
          </div>
          <div class="functions-mini-card">
            <h4>Coeficiente linear (b)</h4>
            <p>Mostra onde a função começa.</p>
          </div>
        </div>
      </article>

      <article class="functions-section" id="enunciado-funcoes">
        <h3>O que destacar no enunciado?</h3>
        <div class="pedagogy-list">
          <div class="pedagogy-item pedagogy-item--data"><strong>Dados importantes</strong><span>valor inicial; taxa fixa; “a cada”; “por unidade”; tempo; quilômetros; litros; idade; preço.</span></div>
          <div class="pedagogy-item pedagogy-item--objective"><strong>Objetivo</strong><span>“determine o valor”; “qual será”; “calcule”; “em que momento”; “quanto custará”.</span></div>
          <div class="pedagogy-item pedagogy-item--tip"><strong>Dicas escondidas</strong><span>“a cada”; “para cada”; “cresce”; “diminui”; “proporcional”; “constante”.</span></div>
          <div class="pedagogy-item pedagogy-item--trap"><strong>Armadilhas</strong><span>confundir taxa fixa com taxa variável; trocar quem depende de quem; montar a função ao contrário; usar apenas uma informação do texto.</span></div>
        </div>
      </article>

      <article class="functions-section" id="pensar-funcoes">
        <h3>Como pensar durante uma questão?</h3>
        <p>Sempre faça este caminho.</p>
        <ol class="functions-checklist">
          <li><strong>Qual situação está sendo apresentada?</strong></li>
          <li><strong>Quais grandezas aparecem?</strong></li>
          <li><strong>Qual depende da outra?</strong></li>
          <li><strong>Existe uma taxa fixa?</strong></li>
          <li><strong>Existe uma regra?</strong></li>
          <li><strong>Agora sim: monto a função.</strong></li>
        </ol>
      </article>

      <article class="functions-summary">
        <h3>Resumo</h3>
        <p>As questões de Funções do ENEM não avaliam apenas se você sabe substituir valores em uma fórmula.</p>
        <p>Elas querem verificar se você consegue:</p>
        <ul>
          <li>identificar duas grandezas relacionadas;</li>
          <li>descobrir quem depende de quem;</li>
          <li>perceber a regra de formação;</li>
          <li>transformar uma situação real em linguagem matemática.</li>
        </ul>
        <p>Quem aprende esse raciocínio percebe que a função deixa de ser uma fórmula complicada e passa a ser apenas uma maneira de descrever como duas informações se relacionam.</p>
        <a class="portal-button" href="questoes.html">Praticar questões de Funções →</a>
      </article>
    </section>`;

  if (location.hash && document.querySelector(location.hash)) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ block: "start" }));
  }
})();
