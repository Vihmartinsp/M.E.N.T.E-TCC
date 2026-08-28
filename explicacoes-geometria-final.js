"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;
  const current = document.querySelector("#geometria");
  if (!current) return;

  current.outerHTML = `
    <section class="geometry-guide mente-geometry-final" id="geometria">
      <header class="geometry-guide__hero">
        <p class="geometry-guide__eyebrow">Explicação completa</p>
        <h2>GEOMETRIA</h2>
        <p>Quando ouvimos a palavra <strong>Geometria</strong>, muita gente pensa imediatamente em fórmulas, contas e desenhos complicados. Mas, na verdade, Geometria é muito mais simples do que parece.</p>
        <nav class="geometry-guide__toc" aria-label="Tópicos da explicação de Geometria">
          <a href="#geometria-introducao">Introdução</a>
          <a href="#enem-geometria">Como o ENEM cobra</a>
          <a href="#segredo-geometria">O segredo</a>
          <a href="#figuras-geometria">Figuras</a>
          <a href="#formulas-geometria">Fórmulas</a>
          <a href="#enunciado-geometria">O que destacar</a>
          <a href="#pensar-geometria">Como pensar</a>
        </nav>
      </header>

      <article class="geometry-section geometry-accent" id="geometria-introducao">
        <h3>O que é Geometria?</h3>
        <p>A Geometria é a parte da Matemática que estuda:</p>
        <ul>
          <li><strong>as formas</strong>;</li>
          <li><strong>os tamanhos</strong>;</li>
          <li><strong>as medidas</strong>;</li>
          <li><strong>as posições dos objetos no espaço</strong>.</li>
        </ul>
        <p>Ela está em praticamente tudo ao nosso redor:</p>
        <ul>
          <li>Uma caixa de sapato é um <strong>sólido geométrico</strong>.</li>
          <li>Uma pizza é um <strong>círculo</strong>.</li>
          <li>Uma escada forma <strong>triângulos</strong>.</li>
          <li>Uma piscina possui <strong>área e volume</strong>.</li>
        </ul>
        <div class="geometry-callout">Por isso, o ENEM não quer saber apenas se você decorou fórmulas. O que ele realmente quer descobrir é: <strong>você consegue olhar para uma situação do cotidiano e perceber a Matemática escondida nela?</strong></div>
      </article>

      <article class="geometry-section" id="enem-geometria">
        <h3>Como o ENEM cobra Geometria?</h3>
        <p>No ENEM, raramente a questão diz: “Calcule a área deste retângulo”.</p>
        <p>Normalmente ela vem assim:</p>
        <ul>
          <li>Uma empresa deseja revestir uma parede...</li>
          <li>Um reservatório possui o formato de um cilindro...</li>
          <li>Uma praça circular receberá grama em toda sua superfície...</li>
        </ul>
        <p><strong>Perceba uma coisa:</strong></p>
        <ol>
          <li><strong>O problema vem primeiro.</strong></li>
          <li><strong>A figura geométrica aparece depois.</strong></li>
        </ol>
        <p>Por isso, a maior dificuldade dos alunos não está na conta. Ela está em descobrir:</p>
        <ul>
          <li><strong>Qual figura apareceu?</strong></li>
          <li><strong>O que a questão quer encontrar?</strong></li>
          <li><strong>Quais medidas realmente importam?</strong></li>
        </ul>
      </article>

      <article class="geometry-section" id="segredo-geometria">
        <h3>O segredo da Geometria</h3>
        <p>Toda questão de Geometria pode ser pensada assim:</p>
        <div class="geometry-flow"><span>Situação</span><b>→</b><span>Figura</span><b>→</b><span>Fórmula</span><b>→</b><span>Resposta</span></div>
        <p>A maioria dos alunos faz o contrário:</p>
        <div class="geometry-flow"><span>Fórmula</span><b>→</b><span>Fórmula</span><b>→</b><span>Fórmula</span><b>→</b><span>Erro</span></div>
        <p>Por isso, antes de qualquer cálculo, faça estas perguntas:</p>
        <ol>
          <li><strong>Que figura estou vendo?</strong></li>
          <li><strong>Ela é plana ou espacial?</strong></li>
          <li><strong>Quais medidas foram dadas?</strong></li>
          <li><strong>O que a questão quer descobrir?</strong></li>
        </ol>
        <div class="geometry-callout">Só depois disso você pensa na fórmula.</div>
      </article>

      <article class="geometry-section" id="figuras-geometria">
        <h3>Figuras planas e figuras espaciais</h3>
        <div class="geometry-grid">
          <div class="geometry-mini-card">
            <h4>Figuras planas (2 dimensões)</h4>
            <p>São figuras que possuem apenas:</p>
            <ul><li><strong>comprimento</strong>;</li><li><strong>largura</strong>.</li></ul>
            <p>Exemplos:</p>
            <p>□ <strong>quadrado</strong><br>▭ <strong>retângulo</strong><br>△ <strong>triângulo</strong><br>○ <strong>círculo</strong></p>
            <p>Nelas, normalmente o ENEM pede: <strong>área e perímetro</strong>.</p>
          </div>
          <div class="geometry-mini-card">
            <h4>Figuras espaciais (3 dimensões)</h4>
            <p>Possuem:</p>
            <ul><li><strong>comprimento</strong>;</li><li><strong>largura</strong>;</li><li><strong>altura</strong>.</li></ul>
            <p>Exemplos:</p>
            <ul><li><strong>cubo</strong></li><li><strong>cilindro</strong></li><li><strong>pirâmide</strong></li><li><strong>esfera</strong></li></ul>
            <p>Nelas, geralmente o ENEM pede: <strong>volume, área total e capacidade</strong>.</p>
          </div>
        </div>
      </article>

      <article class="geometry-section" id="formulas-geometria">
        <h3>As fórmulas mais importantes</h3>
        <p><strong>Não decore antes de entender.</strong></p>
        <div class="formula-grid">
          <div class="formula-card">
            <h4>Área do retângulo</h4>
            <span class="formula-card__formula">Área = base × altura</span>
            <p>Por quê? Porque estamos contando quantos quadradinhos cabem dentro dele.</p>
            <p>Se existem 4 quadradinhos na largura e 3 quadradinhos na altura, então temos:</p>
            <p><strong>4 × 3 = 12 quadradinhos.</strong></p>
            <p>A fórmula nasceu dessa ideia. Ela não apareceu do nada.</p>
          </div>
          <div class="formula-card">
            <h4>Área do triângulo</h4>
            <span class="formula-card__formula">Área = (base × altura) / 2</span>
            <p>Por quê? Porque dois triângulos iguais formam um retângulo. Então o triângulo ocupa apenas metade da área.</p>
          </div>
          <div class="formula-card">
            <h4>Área do círculo</h4>
            <span class="formula-card__formula">Área = πr²</span>
            <p>O raio aparece ao quadrado porque, quanto maior o raio, a área cresce em todas as direções.</p>
            <p>O círculo cresce para cima, para baixo e para os lados. Por isso o crescimento é ao quadrado.</p>
          </div>
          <div class="formula-card">
            <h4>Perímetro</h4>
            <span class="formula-card__formula">Perímetro = soma de todos os lados</span>
            <p>Pense assim:</p>
            <p><strong>Perímetro → contorno.</strong><br><strong>Área → espaço interno.</strong></p>
            <p>Essa é uma das confusões que o ENEM mais explora.</p>
          </div>
          <div class="formula-card">
            <h4>Volume</h4>
            <span class="formula-card__formula">Volume = espaço ocupado por um sólido</span>
            <p>Pense em:</p>
            <ul><li>água dentro de uma caixa;</li><li>ar dentro de um balão;</li><li>suco dentro de uma garrafa.</li></ul>
            <p><strong>Tudo isso é volume.</strong></p>
          </div>
        </div>
      </article>

      <article class="geometry-section" id="enunciado-geometria">
        <h3>O que destacar no enunciado?</h3>
        <div class="pedagogy-list">
          <div class="pedagogy-item pedagogy-item--data"><strong>Medidas</strong><span>5 metros; 20 cm; raio de 3 m; altura de 8 m.</span></div>
          <div class="pedagogy-item pedagogy-item--objective"><strong>O objetivo</strong><span>“calcule a área”; “determine o volume”; “qual a distância”; “encontre o perímetro”.</span></div>
          <div class="pedagogy-item pedagogy-item--tip"><strong>Dicas escondidas</strong><span>aproximadamente; considere π = 3; apenas a parte pintada; desconsidere a espessura.</span></div>
          <div class="pedagogy-item pedagogy-item--trap"><strong>Armadilhas</strong><span>área quando parece perímetro; centímetros e metros na mesma questão; figuras que aparecem apenas para confundir; pedir apenas uma parte da figura.</span></div>
        </div>
      </article>

      <article class="geometry-section" id="pensar-geometria">
        <h3>Como pensar durante uma questão?</h3>
        <p>Sempre faça este caminho:</p>
        <ol class="geometry-checklist">
          <li><strong>O que estou vendo?</strong></li>
          <li><strong>Que figura apareceu?</strong></li>
          <li><strong>Quais dados foram dados?</strong></li>
          <li><strong>O que preciso descobrir?</strong></li>
          <li><strong>Existe alguma dica escondida?</strong></li>
          <li><strong>Agora sim: escolha a fórmula.</strong></li>
        </ol>
      </article>

      <article class="geometry-summary">
        <h3>Resumo</h3>
        <p>A Geometria do ENEM não é uma prova de decorar fórmulas. <strong>Ela é uma prova de interpretação.</strong></p>
        <p>Quem aprende a:</p>
        <ol>
          <li><strong>identificar os dados</strong>;</li>
          <li><strong>descobrir o objetivo</strong>;</li>
          <li><strong>perceber as pistas do enunciado</strong>;</li>
          <li><strong>evitar armadilhas</strong>;</li>
        </ol>
        <p>assim terá muito mais facilidade para escolher a fórmula correta e resolver a questão.</p>
        <a class="portal-button" href="questoes.html">Praticar questões de Geometria →</a>
      </article>
    </section>`;

  if (location.hash && document.querySelector(location.hash)) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ block: "start" }));
  }
})();
