"use strict";

(() => {
  if (document.body.dataset.page !== "explicacoes") return;
  const current = document.querySelector("#graficos-tabelas");
  if (!current) return;

  current.outerHTML = `
    <section class="charts-guide mente-charts-final" id="graficos-tabelas">
      <header class="charts-guide__hero">
        <p class="charts-guide__eyebrow">Explicação completa</p>
        <h2>📈 ANÁLISE DE GRÁFICOS E TABELAS</h2>
        <p>Gráficos e tabelas não servem apenas para mostrar números. <strong>Eles organizam informações para que possamos tirar conclusões.</strong> No ENEM, o mais importante é interpretar corretamente aquilo que está sendo apresentado.</p>
        <nav class="charts-guide__toc" aria-label="Tópicos da explicação de Gráficos e Tabelas">
          <a href="#o-que-sao-graficos">O que é?</a>
          <a href="#enem-graficos">Como o ENEM cobra</a>
          <a href="#segredo-graficos">O segredo</a>
          <a href="#tipos-graficos">Tipos de gráfico</a>
          <a href="#tabelas-graficos">Tabelas</a>
          <a href="#enunciado-graficos">O que destacar</a>
          <a href="#pensar-graficos">Como pensar</a>
        </nav>
      </header>

      <article class="charts-section charts-accent" id="o-que-sao-graficos">
        <h3>O que é Análise de Gráficos e Tabelas?</h3>
        <p>Quando ouvimos esse conteúdo, muita gente pensa imediatamente em:</p>
        <ul>
          <li>gráficos de barras;</li>
          <li>gráficos de linhas;</li>
          <li>tabelas cheias de números.</li>
        </ul>
        <p>Mas, na verdade, esse conteúdo é sobre <strong>interpretar informações</strong>.</p>
        <div class="charts-grid">
          <div class="charts-mini-card"><h4>📊 Um gráfico</h4><p>Não existe apenas para mostrar números. Ele conta uma história.</p></div>
          <div class="charts-mini-card"><h4>🧾 Uma tabela</h4><p>Organiza dados para que possamos comparar informações e tirar conclusões.</p></div>
        </div>
        <div class="charts-callout">O ENEM quer saber se você consegue <strong>interpretar as informações apresentadas e chegar à conclusão correta.</strong></div>
      </article>

      <article class="charts-section" id="enem-graficos">
        <h3>Como o ENEM cobra Gráficos e Tabelas?</h3>
        <p>No ENEM, dificilmente aparece uma questão dizendo apenas:</p>
        <div class="charts-callout"><strong>“Leia este gráfico.”</strong></div>
        <p>Normalmente ela aparece em situações como:</p>
        <ul>
          <li>pesquisas do IBGE;</li>
          <li>crescimento da população;</li>
          <li>consumo de água;</li>
          <li>vacinação;</li>
          <li>inflação;</li>
          <li>economia;</li>
          <li>meio ambiente;</li>
          <li>produção agrícola;</li>
          <li>energia elétrica.</li>
        </ul>
        <p><strong>Primeiro aparece um problema do cotidiano.</strong></p>
        <p><strong>Depois surgem gráficos, tabelas ou infográficos.</strong></p>
        <p>A Matemática entra apenas para ajudar a interpretar essas informações.</p>
      </article>

      <article class="charts-section" id="segredo-graficos">
        <h3>O segredo da interpretação</h3>
        <p>Toda questão pode ser pensada assim:</p>
        <div class="charts-flow"><span>Situação</span><b>→</b><span>Dados</span><b>→</b><span>Interpretação</span><b>→</b><span>Resposta</span></div>
        <p>Um erro comum é fazer:</p>
        <div class="charts-flow charts-flow--wrong"><span>Olha o gráfico</span><b>→</b><span>Procura um número</span><b>→</b><span>Marca uma alternativa</span><b>→</b><span>Erro</span></div>
        <p>Antes de responder, pergunte:</p>
        <ul>
          <li><strong>O que esse gráfico está mostrando?</strong></li>
          <li><strong>O que cada eixo representa?</strong></li>
          <li><strong>Quais unidades estão sendo utilizadas?</strong></li>
          <li><strong>O que a questão realmente quer descobrir?</strong></li>
        </ul>
        <p><strong>Só depois procure os valores.</strong></p>
      </article>

      <article class="charts-section" id="tipos-graficos">
        <h3>Os gráficos mais cobrados no ENEM</h3>
        <div class="charts-concepts">
          <div class="charts-concept-card">
            <h4>Gráfico de Barras</h4>
            <p>É utilizado para comparar quantidades entre diferentes categorias.</p>
            <p>Exemplos:</p>
            <ul><li>população de estados;</li><li>vendas;</li><li>produção;</li><li>número de pessoas.</li></ul>
            <p>Cada barra representa uma categoria. <strong>Quanto maior a barra, maior o valor.</strong></p>
            <div class="charts-demo charts-demo--bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          </div>

          <div class="charts-concept-card">
            <h4>Gráfico de Linhas</h4>
            <p>Mostra mudanças ao longo do tempo.</p>
            <p>Exemplos:</p>
            <ul><li>crescimento populacional;</li><li>temperatura;</li><li>inflação;</li><li>número de casos de doenças.</li></ul>
            <p>O mais importante é perceber a <strong>tendência</strong>:</p>
            <ul><li>está aumentando?</li><li>diminuindo?</li><li>oscilando?</li></ul>
            <div class="charts-demo charts-demo--line" aria-hidden="true"><svg viewBox="0 0 260 100"><polyline points="10,82 65,52 115,65 175,22 245,40"/></svg></div>
          </div>

          <div class="charts-concept-card">
            <h4>Gráfico de Setores (Pizza)</h4>
            <p>Mostra como um total é dividido.</p>
            <p>Cada fatia representa uma porcentagem do todo.</p>
            <p>Pergunte sempre:</p>
            <ul><li><strong>Quanto representa o todo?</strong></li><li><strong>Quanto representa cada parte?</strong></li></ul>
            <div class="charts-demo charts-demo--pie" aria-hidden="true"></div>
          </div>
        </div>
      </article>

      <article class="charts-section" id="tabelas-graficos">
        <h3>Tabelas</h3>
        <p>As tabelas organizam informações em linhas e colunas.</p>
        <div class="charts-callout"><strong>O erro mais comum é olhar apenas um número. O correto é comparar os dados.</strong></div>
        <p>Muitas respostas dependem da relação entre diferentes linhas ou colunas.</p>
        <div class="charts-table-demo" aria-hidden="true">
          <div class="charts-table-demo__row charts-table-demo__head"><span>Categoria</span><span>Valor A</span><span>Valor B</span></div>
          <div class="charts-table-demo__row"><span>A</span><span>20</span><span>35</span></div>
          <div class="charts-table-demo__row"><span>B</span><span>28</span><span>31</span></div>
          <div class="charts-table-demo__row"><span>C</span><span>24</span><span>42</span></div>
        </div>
      </article>

      <article class="charts-section" id="enunciado-graficos">
        <h3>O que destacar no enunciado?</h3>
        <div class="pedagogy-list">
          <div class="pedagogy-item pedagogy-item--objective"><strong>Objetivo</strong><span>“qual alternativa representa”; “qual afirmação está correta”; “qual apresenta maior valor”; “qual tendência pode ser observada”; “qual informação pode ser concluída”.</span></div>
          <div class="pedagogy-item pedagogy-item--data"><strong>Dados importantes</strong><span>títulos; legendas; eixos; unidades; anos; porcentagens; valores.</span></div>
          <div class="pedagogy-item pedagogy-item--tip"><strong>Dicas escondidas</strong><span>“aproximadamente”; “estimativa”; “valor médio”; “em relação ao ano anterior”; “percentual”; “variação”.</span></div>
          <div class="pedagogy-item pedagogy-item--trap"><strong>Armadilhas</strong><span>olhar apenas o desenho do gráfico; ignorar a legenda; não observar a unidade de medida; comparar barras com escalas diferentes; esquecer de analisar o eixo vertical ou horizontal; ler apenas um dado quando a questão pede comparação.</span></div>
        </div>
      </article>

      <article class="charts-section" id="pensar-graficos">
        <h3>Como pensar durante uma questão?</h3>
        <p>Sempre faça este caminho:</p>
        <ol class="charts-checklist">
          <li><strong>O que está sendo apresentado?</strong></li>
          <li><strong>Quais informações aparecem no gráfico ou na tabela?</strong></li>
          <li><strong>Como esses dados se relacionam?</strong></li>
          <li><strong>O que preciso descobrir?</strong></li>
          <li><strong>Existe alguma informação escondida?</strong></li>
          <li><strong>Agora sim: interpreto os dados e resolvo a questão.</strong></li>
        </ol>
      </article>

      <article class="charts-section">
        <h3>Como o ENEM tenta confundir você?</h3>
        <p>Muitas vezes, o ENEM coloca um gráfico enorme, cheio de informações. Isso faz parecer que será necessário analisar tudo.</p>
        <p>Mas, na maioria das vezes, a questão utiliza apenas uma pequena parte dele.</p>
        <div class="charts-callout"><strong>Não tente entender tudo de uma vez.</strong><br>Primeiro leia a pergunta. Depois volte ao gráfico procurando apenas o que ela pede.</div>
        <h4>Estratégia que funciona</h4>
        <ol class="charts-strategy">
          <li>Leia primeiro a pergunta.</li>
          <li>Descubra exatamente o que precisa encontrar.</li>
          <li>Vá para o gráfico procurando apenas essas informações.</li>
          <li>Observe título, legenda e unidades.</li>
          <li>Compare os dados.</li>
          <li>Só então escolha a alternativa.</li>
        </ol>
        <p>Essa estratégia evita gastar tempo analisando informações que nem serão utilizadas.</p>
      </article>

      <article class="charts-summary">
        <h3>Resumo</h3>
        <p><strong>Gráficos e tabelas não servem apenas para mostrar números.</strong></p>
        <p>Eles organizam informações para que possamos tirar conclusões.</p>
        <p>No ENEM, quem aprende a:</p>
        <ul>
          <li>identificar o objetivo da questão;</li>
          <li>interpretar corretamente os eixos e as legendas;</li>
          <li>comparar informações;</li>
          <li>perceber tendências;</li>
          <li>evitar armadilhas de interpretação;</li>
        </ul>
        <p>terá muito mais facilidade para resolver esse tipo de questão, mesmo quando houver muitos dados apresentados.</p>
        <a class="portal-button" href="questoes.html">Praticar questões de Gráficos e Tabelas →</a>
      </article>
    </section>`;

  if (location.hash && document.querySelector(location.hash)) {
    requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ block: "start" }));
  }
})();
