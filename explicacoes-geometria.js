"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;

  const main = document.querySelector(".portal-main");
  if (!main) return;

  main.innerHTML = `
    <section class="geometry-guide" id="geometria">
      <header class="geometry-guide__hero">
        <p class="geometry-guide__eyebrow">Explicação completa</p>
        <h2>Geometria sem mistério</h2>
        <p>Quando ouvimos a palavra Geometria, muita gente pensa imediatamente em fórmulas, contas e desenhos complicados. Mas, na verdade, Geometria é muito mais simples do que parece: ela estuda as formas, os tamanhos, as medidas e as posições dos objetos no espaço — coisas que aparecem o tempo todo ao nosso redor.</p>
        <nav class="geometry-guide__toc" aria-label="Tópicos da explicação de Geometria">
          <a href="#enem-geometria">Como o ENEM cobra</a>
          <a href="#segredo-geometria">O segredo</a>
          <a href="#figuras-geometria">Figuras</a>
          <a href="#formulas-geometria">Fórmulas</a>
          <a href="#enunciado-geometria">O que destacar</a>
          <a href="#pensar-geometria">Como pensar</a>
        </nav>
      </header>

      <article class="geometry-section geometry-accent">
        <h3>📐 Geometria está em todo lugar</h3>
        <p>Ela está em praticamente tudo ao nosso redor:</p>
        <ul>
          <li>uma caixa de sapato é um <strong>sólido geométrico</strong>;</li>
          <li>uma pizza é um <strong>círculo</strong>;</li>
          <li>uma escada forma <strong>triângulos</strong>;</li>
          <li>uma piscina possui <strong>área e volume</strong>.</li>
        </ul>
        <div class="geometry-callout">No ENEM, não basta decorar fórmulas. O que realmente importa é conseguir <strong>olhar para uma situação do cotidiano e perceber a Matemática escondida nela</strong>.</div>
      </article>

      <article class="geometry-section" id="enem-geometria">
        <h3>🎯 Como o ENEM cobra Geometria?</h3>
        <p>O ENEM raramente apresenta apenas algo como “calcule a área deste retângulo”. Normalmente, a Geometria vem escondida em uma situação real.</p>
        <div class="geometry-grid">
          <div class="geometry-mini-card"><h4>🏠 Parede</h4><p>Uma empresa deseja revestir uma parede. O problema pode exigir área, quantidade de material ou desperdício.</p></div>
          <div class="geometry-mini-card"><h4>🛢️ Reservatório</h4><p>Um reservatório tem formato cilíndrico. A pergunta pode envolver volume, capacidade ou quantidade de líquido.</p></div>
          <div class="geometry-mini-card"><h4>🌱 Praça</h4><p>Uma praça circular receberá grama. O aluno precisa identificar qual região deve ser medida.</p></div>
          <div class="geometry-mini-card"><h4>📦 Objetos</h4><p>Caixas, embalagens e construções podem esconder retângulos, triângulos, círculos e sólidos.</p></div>
        </div>
        <div class="geometry-question"><strong>Perceba uma coisa:</strong><br>1. O problema vem primeiro.<br>2. A figura geométrica aparece depois.<br><br>Por isso, a maior dificuldade dos alunos não está na conta, mas em descobrir <strong>qual figura apareceu, o que a questão quer encontrar e quais medidas realmente importam</strong>.</div>
      </article>

      <article class="geometry-section" id="segredo-geometria">
        <h3>🔑 O segredo da Geometria</h3>
        <p>Toda questão de Geometria pode ser pensada assim:</p>
        <div class="geometry-flow"><span>Situação</span><b>→</b><span>Figura</span><b>→</b><span>Fórmula</span><b>→</b><span>Resposta</span></div>
        <p>A maioria dos alunos tenta começar direto pela fórmula. O caminho mais seguro é fazer quatro perguntas antes de qualquer cálculo:</p>
        <ol>
          <li><strong>Que figura estou vendo?</strong></li>
          <li><strong>Ela é plana ou espacial?</strong></li>
          <li><strong>Quais medidas foram dadas?</strong></li>
          <li><strong>O que a questão quer descobrir?</strong></li>
        </ol>
        <div class="geometry-callout">Só depois disso você pensa na fórmula.</div>
      </article>

      <article class="geometry-section" id="figuras-geometria">
        <h3>🔷 Figuras planas e figuras espaciais</h3>
        <div class="geometry-grid">
          <div class="geometry-mini-card">
            <h4>Figuras planas (2 dimensões)</h4>
            <p>Possuem <strong>comprimento</strong> e <strong>largura</strong>. Exemplos comuns no ENEM: quadrado, retângulo, triângulo e círculo. Nessas figuras, geralmente aparecem perguntas sobre <strong>área e perímetro</strong>.</p>
          </div>
          <div class="geometry-mini-card">
            <h4>Figuras espaciais (3 dimensões)</h4>
            <p>Possuem <strong>comprimento</strong>, <strong>largura</strong> e <strong>altura</strong>. Exemplos: cubo, cilindro, pirâmide e esfera. Nessas figuras, o ENEM costuma pedir <strong>volume, área total ou capacidade</strong>.</p>
          </div>
        </div>
      </article>

      <article class="geometry-section" id="formulas-geometria">
        <h3>🧠 As fórmulas mais importantes</h3>
        <p><strong>Não decore antes de entender.</strong> A fórmula fica muito mais fácil quando você entende o que ela está medindo.</p>
        <div class="formula-grid">
          <div class="formula-card">
            <h4>Área do retângulo</h4>
            <span class="formula-card__formula">Área = base × altura</span>
            <p>Pense em quantos quadradinhos cabem dentro dele. Se há 4 quadradinhos na largura e 3 na altura, temos 4 × 3 = 12 quadradinhos.</p>
          </div>
          <div class="formula-card">
            <h4>Área do triângulo</h4>
            <span class="formula-card__formula">Área = (base × altura) / 2</span>
            <p>Dois triângulos iguais podem formar um retângulo. Por isso, o triângulo ocupa metade da área correspondente.</p>
          </div>
          <div class="formula-card">
            <h4>Área do círculo</h4>
            <span class="formula-card__formula">Área = πr²</span>
            <p>O raio aparece ao quadrado porque, quando o raio aumenta, a área cresce em todas as direções.</p>
          </div>
          <div class="formula-card">
            <h4>Perímetro</h4>
            <span class="formula-card__formula">Perímetro = soma dos lados</span>
            <p>Pense assim: <strong>perímetro = contorno</strong> e <strong>área = espaço interno</strong>. Essa diferença aparece muito no ENEM.</p>
          </div>
          <div class="formula-card">
            <h4>Volume</h4>
            <span class="formula-card__formula">Volume = espaço ocupado</span>
            <p>Pense na água dentro de uma caixa, no ar dentro de um balão ou no suco dentro de uma garrafa. Tudo isso envolve volume.</p>
          </div>
        </div>
      </article>

      <article class="geometry-section" id="enunciado-geometria">
        <h3>🔎 O que destacar no enunciado?</h3>
        <p>Antes de calcular, separe os elementos da questão. Isso ajuda a transformar um texto grande em informações úteis.</p>
        <div class="pedagogy-list">
          <div class="pedagogy-item pedagogy-item--data"><strong>Medidas e dados</strong><span>Exemplos: 5 metros, 20 cm, raio de 3 m, altura de 8 m.</span></div>
          <div class="pedagogy-item pedagogy-item--objective"><strong>Objetivo</strong><span>Procure comandos como “calcule a área”, “determine o volume”, “qual a distância?” ou “encontre o perímetro”.</span></div>
          <div class="pedagogy-item pedagogy-item--tip"><strong>Dicas escondidas</strong><span>Palavras como “aproximadamente”, “considere π = 3”, “apenas a parte pintada” e “desconsidere a espessura” mudam a forma de resolver.</span></div>
          <div class="pedagogy-item pedagogy-item--trap"><strong>Armadilhas</strong><span>Área quando a pergunta pede perímetro; centímetros e metros na mesma questão; figuras que aparecem só para confundir; usar apenas uma parte da figura.</span></div>
        </div>
      </article>

      <article class="geometry-section" id="pensar-geometria">
        <h3>🧭 Como pensar durante uma questão?</h3>
        <p>Sempre siga este caminho:</p>
        <ol class="geometry-checklist">
          <li><strong>O que estou vendo?</strong> Identifique a situação apresentada.</li>
          <li><strong>Que figura apareceu?</strong> Retângulo, triângulo, círculo, cilindro ou outra forma?</li>
          <li><strong>Quais dados foram dados?</strong> Separe medidas, unidades e informações importantes.</li>
          <li><strong>O que preciso descobrir?</strong> Área, perímetro, volume, distância, quantidade ou outra grandeza?</li>
          <li><strong>Existe alguma dica escondida?</strong> Leia novamente palavras que alteram a interpretação.</li>
          <li><strong>Agora escolha a fórmula.</strong> A fórmula vem depois da interpretação.</li>
        </ol>
      </article>

      <article class="geometry-summary">
        <h3>✅ Resumo</h3>
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

      <section class="geometry-other" aria-labelledby="other-explanations">
        <h3 id="other-explanations">Outras explicações</h3>
        <div class="geometry-other__grid">
          <div class="geometry-other__card"><strong>Funções</strong>Leis, taxas de variação, zeros e vértices.</div>
          <div class="geometry-other__card"><strong>Estatística e Probabilidade</strong>Média, mediana, dispersão e probabilidade.</div>
          <div class="geometry-other__card"><strong>Matemática Financeira</strong>Porcentagem, juros e decisões financeiras.</div>
          <div class="geometry-other__card"><strong>Grandezas e Medidas</strong>Unidades, escalas, razões e proporcionalidade.</div>
          <div class="geometry-other__card"><strong>Gráficos e Tabelas</strong>Eixos, escalas, tendências e interpretação.</div>
        </div>
      </section>
    </section>`;

  if (location.hash === "#geometria") {
    requestAnimationFrame(() => document.querySelector("#geometria")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
})();
