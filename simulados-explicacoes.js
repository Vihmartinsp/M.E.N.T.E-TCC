"use strict";

(() => {
  if (document.body.dataset.page !== "simulados") return;

  const COLORS = {
    "Geometria": "#FF7A00",
    "Funções": "#9D4EDD",
    "Estatística e Probabilidade": "#004A00",
    "Matemática Financeira": "#F2C94C",
    "Grandezas e Medidas": "#D70101",
    "Gráficos e Tabelas": "#FF2E9A",
  };

  const guides = {
    "Geometria": {
      understand: "Em Geometria, primeiro transforme o desenho descrito no enunciado em medidas e relações matemáticas. Identifique a figura, o que está sendo medido e se a pergunta pede comprimento, área ou volume.",
      perceive: "• Verifique se todas as medidas estão na mesma unidade. • Identifique a fórmula ou relação geométrica adequada. • Só depois substitua os valores e faça a conta.",
      defaultTrap: "Misturar unidades, usar uma medida como raio quando ela é diâmetro ou aplicar uma escala linear diretamente em área/volume.",
      defaultStrategy: "Organizar as medidas, padronizar as unidades, escolher a relação geométrica correta e conferir se a unidade final combina com o que foi pedido.",
      defaultTip: "Antes de calcular, escreva ao lado de cada número o que ele representa. Isso evita usar lado, raio, diâmetro, área ou volume no lugar errado.",
    },
    "Funções": {
      understand: "Em Funções, procure qual grandeza depende da outra e como essa relação muda. O enunciado pode esconder uma função afim, quadrática, exponencial ou definida por trechos.",
      perceive: "• Separe valores fixos e variáveis. • Observe taxas de crescimento ou redução. • Se houver máximo ou mínimo em uma parábola, pense no vértice. • Se a regra mudar ao longo do tempo, resolva por intervalos.",
      defaultTrap: "Usar apenas os números do enunciado sem identificar a lei da função ou aplicar a mesma taxa em intervalos em que a regra mudou.",
      defaultStrategy: "Traduzir o texto para uma expressão, identificar a variável pedida e resolver a função ou desigualdade passo a passo.",
      defaultTip: "Pergunte sempre: o que é fixo, o que varia e com que taxa? Essa leitura costuma revelar a função antes mesmo das contas.",
    },
    "Estatística e Probabilidade": {
      understand: "Em Estatística e Probabilidade, organize os dados antes de calcular. A pergunta normalmente exige uma medida de tendência, uma média ponderada ou a razão entre casos favoráveis e possíveis.",
      perceive: "• Conte quantos dados existem. • Verifique se há frequências/pesos. • Para mediana, ordene os valores. • Em probabilidade sem reposição, o total muda depois da primeira retirada.",
      defaultTrap: "Confundir média com mediana, esquecer os pesos/frequências ou manter o mesmo denominador em uma retirada sem reposição.",
      defaultStrategy: "Identificar a medida pedida, montar a expressão correspondente e só então simplificar o resultado.",
      defaultTip: "Antes da conta, escreva o nome da medida que a questão pede. Isso evita aplicar a fórmula certa na pergunta errada.",
    },
    "Matemática Financeira": {
      understand: "Em Matemática Financeira, separe preço ou capital inicial, taxa percentual, tempo e tipo de operação. Depois descubra sobre qual valor a porcentagem deve ser aplicada.",
      perceive: "• Transforme a porcentagem em fator decimal. • Veja se a taxa incide uma vez ou em vários períodos. • Descontos sucessivos são aplicados um após o outro. • Juros simples e compostos usam modelos diferentes.",
      defaultTrap: "Somar percentuais sucessivos diretamente, aplicar a taxa sobre a base errada ou confundir juros simples com compostos.",
      defaultStrategy: "Identificar a base do percentual, escolher o modelo financeiro correto e calcular em etapas até chegar ao valor final.",
      defaultTip: "Toda vez que vir uma porcentagem, complete mentalmente a frase: “porcentagem de quê?”. A base é parte essencial da conta.",
    },
    "Grandezas e Medidas": {
      understand: "Em Grandezas e Medidas, o foco é reconhecer a unidade de origem, a unidade pedida e a equivalência que conecta as duas.",
      perceive: "• Escreva a equivalência entre as unidades. • Converta antes de combinar grandezas diferentes. • Em escala, relacione a medida do desenho com a medida real. • Confira se a unidade final é coerente.",
      defaultTrap: "Multiplicar ou dividir por 10, 100 ou 1000 sem verificar a equivalência correta, ou esquecer que área e volume mudam em potências da escala.",
      defaultStrategy: "Montar a equivalência, fazer a conversão necessária e só depois executar o cálculo principal.",
      defaultTip: "Não faça conversões de cabeça no automático: escreva primeiro a equivalência. Ela mostra qual fator realmente deve ser usado.",
    },
    "Gráficos e Tabelas": {
      understand: "Em Gráficos e Tabelas, a resposta nasce da leitura correta dos valores e da comparação pedida. O principal é distinguir valor absoluto, diferença e porcentagem.",
      perceive: "• Leia rótulos, unidades e valores antes de calcular. • Compare apenas os intervalos pedidos. • Em porcentagem, escolha corretamente o valor de referência. • Em duas porcentagens sucessivas, aplique uma sobre o resultado da outra.",
      defaultTrap: "Escolher o maior número sem calcular a variação correta, trocar a base de um percentual ou confundir aumento absoluto com aumento percentual.",
      defaultStrategy: "Extrair os valores relevantes, montar a comparação ou taxa solicitada e verificar qual alternativa representa o resultado.",
      defaultTip: "Antes de fazer qualquer conta, diga em palavras o que está comparando. Isso evita usar o denominador errado em taxas e percentuais.",
    },
  };

  const specifics = [
    {
      match: "A parede tem 6×2,8=16,8 m²",
      topic: "Área e revestimento",
      objective: "Descobrir quantas placas são necessárias para revestir a parede e acrescentar 10% para perdas.",
      data: "Parede de 6 m × 2,8 m; placas de 20 cm × 40 cm; compra de 10% a mais.",
      clue: "Parede e placa precisam estar na mesma unidade de área antes da divisão.",
      trap: "Calcular corretamente as 210 placas mínimas e esquecer o acréscimo de 10%.",
      strategy: "Calcular a área da parede, a área de uma placa, dividir as áreas e aplicar o fator 1,10.",
      tip: "Quando houver perda, sobra ou margem de segurança, ela deve ser aplicada depois de descobrir a quantidade mínima necessária.",
    },
    {
      match: "A=πr²=(22/7)×49=154 m²",
      topic: "Área do círculo",
      objective: "Calcular a área de uma praça circular de raio 7 m.",
      data: "Raio de 7 m e π = 22/7.",
      clue: "A questão fornece o raio diretamente; basta aplicar A = πr².",
      trap: "Usar 2πr, que calcula comprimento da circunferência, em vez de πr².",
      strategy: "Elevar o raio ao quadrado e multiplicar pelo valor de π indicado.",
      tip: "Circunferência mede contorno; círculo mede área. Se a unidade final deve ser m², você está procurando área.",
    },
    {
      match: "O raio é 1 m. V=πr²h",
      topic: "Volume do cilindro",
      objective: "Calcular 80% da capacidade de um reservatório cilíndrico e converter o resultado para litros.",
      data: "Diâmetro 2 m, altura 3 m, π = 3,14 e limite de abastecimento de 80%.",
      clue: "O diâmetro é 2 m, portanto o raio usado na fórmula é 1 m.",
      trap: "Usar 2 m como raio ou esquecer de aplicar os 80% e a conversão de m³ para litros.",
      strategy: "Calcular o volume total, aplicar 0,80 e usar 1 m³ = 1 000 L.",
      tip: "Em cilindros, destaque primeiro se o enunciado fornece raio ou diâmetro. Depois confira a unidade do volume pedido.",
    },
    {
      match: "A escala linear é 100, então a escala de área é 100²",
      topic: "Escala de área",
      objective: "Transformar a área de uma placa na maquete em sua área real.",
      data: "Escala 1:100 e área de 24 cm² na maquete.",
      clue: "A escala é linear, mas a grandeza pedida é área; por isso o fator deve ser elevado ao quadrado.",
      trap: "Multiplicar a área por 100 em vez de por 100².",
      strategy: "Aplicar o fator de área 10 000 e depois converter cm² para m².",
      tip: "Escala de comprimento usa k; escala de área usa k²; escala de volume usa k³.",
    },
    {
      match: "30+0,5x≤75",
      topic: "Função afim e desigualdade",
      objective: "Encontrar o maior tempo de uso que mantém o custo em no máximo R$ 75,00.",
      data: "Taxa fixa de R$ 30,00, R$ 0,50 por minuto e orçamento máximo de R$ 75,00.",
      clue: "A expressão “no máximo” transforma o problema em uma desigualdade.",
      trap: "Dividir R$ 75,00 por R$ 0,50 sem descontar primeiro a taxa fixa.",
      strategy: "Montar 30 + 0,5x ≤ 75 e isolar x.",
      tip: "Em tarifas, separe sempre a parte fixa da parte variável antes de resolver.",
    },
    {
      match: "O máximo ocorre no vértice",
      topic: "Função quadrática",
      objective: "Determinar para qual quantidade de lotes a receita é máxima.",
      data: "R(x) = -2x² + 80x.",
      clue: "Como o coeficiente de x² é negativo, a parábola tem concavidade para baixo e o vértice representa um máximo.",
      trap: "Tentar descobrir o máximo substituindo alternativas aleatoriamente em vez de usar o vértice.",
      strategy: "Aplicar xᵥ = -b/(2a) aos coeficientes da função.",
      tip: "Em uma parábola com a < 0, o vértice é máximo; com a > 0, é mínimo.",
    },
    {
      match: "Em 18 h passam 3 meias-vidas",
      topic: "Função exponencial",
      objective: "Calcular a quantidade de medicamento restante após três reduções pela metade.",
      data: "160 mg inicialmente e meia-vida de 6 h durante 18 h.",
      clue: "18 ÷ 6 = 3 períodos de meia-vida.",
      trap: "Subtrair metade apenas uma vez ou tratar a redução como linear.",
      strategy: "Aplicar sucessivamente o fator 1/2 três vezes, ou usar 160·(1/2)³.",
      tip: "Processos de meia-vida são multiplicativos: cada período atua sobre o valor que restou, não sobre o valor inicial.",
    },
    {
      match: "Nos primeiros 20 min saem 2 400 L",
      topic: "Função definida por trechos",
      objective: "Determinar o volume restante quando a taxa de retirada muda após 20 minutos.",
      data: "5 000 L iniciais; 120 L/min por 20 min; depois 60 L/min por mais 15 min.",
      clue: "Os 35 minutos precisam ser separados em dois intervalos com taxas diferentes.",
      trap: "Usar 120 L/min durante os 35 minutos inteiros ou 60 L/min desde o início.",
      strategy: "Calcular a retirada em cada trecho e subtrair as duas quantidades do volume inicial.",
      tip: "Quando a regra muda no tempo, desenhe uma pequena linha do tempo e resolva cada trecho separadamente.",
    },
    {
      match: "A soma é 40 e há 5 valores",
      topic: "Média aritmética",
      objective: "Calcular a média de cinco notas.",
      data: "Notas 6, 7, 8, 9 e 10.",
      clue: "A média aritmética é a soma dos valores dividida pela quantidade de valores.",
      trap: "Escolher o valor central apenas por estar no meio da lista, sem fazer a média pedida.",
      strategy: "Somar as cinco notas e dividir por 5.",
      tip: "Média usa todos os valores; mediana usa a posição central. Leia o nome da medida antes da conta.",
    },
    {
      match: "Há 6 valores, então a mediana é a média dos dois centrais",
      topic: "Mediana",
      objective: "Encontrar a mediana de um conjunto com seis valores.",
      data: "12, 14, 14, 15, 20 e 30 minutos, já em ordem.",
      clue: "Com quantidade par de dados, a mediana é a média dos dois valores centrais.",
      trap: "Escolher apenas 14 ou apenas 15 como mediana.",
      strategy: "Identificar o 3º e o 4º valores e calcular (14 + 15)/2.",
      tip: "Antes de procurar a mediana, conte os dados: quantidade ímpar tem um centro; quantidade par tem dois.",
    },
    {
      match: "A soma ponderada é 4+12+30+48+40=134",
      topic: "Média ponderada",
      objective: "Calcular a nota média considerando quantas pessoas escolheram cada nota.",
      data: "Frequências 4, 6, 10, 12 e 8 para as notas 1, 2, 3, 4 e 5.",
      clue: "Cada nota precisa ser multiplicada por sua frequência antes da soma.",
      trap: "Fazer a média simples de 1, 2, 3, 4 e 5 e ignorar as quantidades de pessoas.",
      strategy: "Somar nota × frequência e dividir pelo total de 40 respostas.",
      tip: "Quando alguns valores aparecem mais vezes, pense em frequência como peso.",
    },
    {
      match: "A probabilidade é (5/10)×(4/9)",
      topic: "Probabilidade sem reposição",
      objective: "Calcular a probabilidade de retirar duas bolas vermelhas sem reposição.",
      data: "5 vermelhas, 3 azuis e 2 verdes; 10 bolas no total; duas retiradas sem reposição.",
      clue: "Depois da primeira bola vermelha, restam 4 vermelhas entre 9 bolas.",
      trap: "Usar (5/10)² como se a primeira bola fosse devolvida à urna.",
      strategy: "Multiplicar a probabilidade da primeira vermelha pela probabilidade condicional da segunda.",
      tip: "Sem reposição, numerador e denominador podem mudar depois de cada retirada.",
    },
    {
      match: "15% de 240 é 36",
      topic: "Desconto percentual",
      objective: "Calcular o preço final de uma mochila após 15% de desconto.",
      data: "Preço de R$ 240,00 e desconto de 15%.",
      clue: "O desconto é 15% do preço original e deve ser subtraído desse valor.",
      trap: "Confundir o valor do desconto com o preço final.",
      strategy: "Calcular 0,15 × 240 e subtrair o resultado de 240.",
      tip: "Preço com 15% de desconto também pode ser obtido diretamente por 240 × 0,85.",
    },
    {
      match: "500×0,80=400 e 400×0,90=360",
      topic: "Descontos sucessivos",
      objective: "Calcular o preço final depois de dois descontos aplicados em sequência.",
      data: "Preço de R$ 500,00; primeiro desconto de 20%; depois desconto de 10% sobre o valor reduzido.",
      clue: "O segundo desconto usa R$ 400,00 como base, não os R$ 500,00 iniciais.",
      trap: "Somar 20% + 10% e aplicar um desconto único de 30%.",
      strategy: "Aplicar os fatores 0,80 e 0,90 sucessivamente.",
      tip: "Percentuais sucessivos multiplicam fatores. Em geral, 20% + 10% não equivale a 30% de desconto.",
    },
    {
      match: "J=2 500×0,015×8=300",
      topic: "Juros simples",
      objective: "Calcular o montante de uma aplicação a juros simples.",
      data: "Capital de R$ 2.500,00; taxa de 1,5% ao mês; prazo de 8 meses.",
      clue: "Em juros simples, os juros crescem linearmente: J = C·i·t.",
      trap: "Usar potência como em juros compostos ou esquecer de somar os juros ao capital para obter o montante.",
      strategy: "Calcular J = C·i·t e depois M = C + J.",
      tip: "Juros é o acréscimo; montante é capital + juros. Veja qual dos dois a questão pede.",
    },
    {
      match: "M=2 000×1,05³=2 315,25",
      topic: "Juros compostos",
      objective: "Calcular o montante após três capitalizações mensais de 5%.",
      data: "Capital de R$ 2.000,00; taxa de 5% ao mês; 3 meses.",
      clue: "Cada mês rende sobre o saldo já atualizado, portanto o fator 1,05 é elevado ao número de períodos.",
      trap: "Calcular 15% simples sobre R$ 2.000,00 ou usar 1 + 0,05×3.",
      strategy: "Aplicar M = C(1+i)ᵗ = 2 000·1,05³.",
      tip: "Em juros compostos, o fator de crescimento é repetido por multiplicação, por isso aparece a potência.",
    },
    {
      match: "1 L=1 000 mL, então 2,5 L=2 500 mL",
      topic: "Capacidade",
      objective: "Converter 2,5 litros para mililitros.",
      data: "2,5 L e a equivalência 1 L = 1 000 mL.",
      clue: "Para passar de litro para mililitro, multiplica-se por 1 000.",
      trap: "Mover a vírgula uma casa apenas ou dividir por 1 000.",
      strategy: "Usar a equivalência 1 L = 1 000 mL e calcular 2,5 × 1 000.",
      tip: "Escreva a equivalência completa antes da conversão; ela mostra se você deve multiplicar ou dividir.",
    },
    {
      match: "Para converter km/h em m/s, divide-se por 3,6",
      topic: "Velocidade",
      objective: "Converter 72 km/h para metros por segundo.",
      data: "Velocidade de 72 km/h.",
      clue: "1 km = 1 000 m e 1 h = 3 600 s, então o fator líquido é 1/3,6.",
      trap: "Multiplicar por 3,6 em vez de dividir ao converter km/h para m/s.",
      strategy: "Calcular 72 ÷ 3,6.",
      tip: "km/h → m/s: divide por 3,6. m/s → km/h: multiplica por 3,6.",
    },
    {
      match: "6,4×25 000=160 000 cm",
      topic: "Escala",
      objective: "Determinar a distância real correspondente a 6,4 cm em um mapa na escala 1:25 000.",
      data: "6,4 cm no mapa e escala 1:25 000.",
      clue: "Cada 1 cm no mapa representa 25 000 cm na realidade.",
      trap: "Parar em 160 000 cm e marcar uma alternativa sem converter para quilômetros.",
      strategy: "Multiplicar pela escala e converter cm → m → km.",
      tip: "Em escala, escreva sempre a unidade do desenho e a unidade que a questão pede na realidade.",
    },
    {
      match: "30 mm=0,03 m. Volume=0,03×200=6 m³",
      topic: "Volume de chuva",
      objective: "Transformar uma lâmina de chuva de 30 mm sobre 200 m² em volume de água.",
      data: "Chuva de 30 mm e área de 200 m².",
      clue: "30 mm é uma altura de água: 0,03 m. Volume = altura × área.",
      trap: "Multiplicar 30 por 200 sem converter milímetros para metros ou esquecer a conversão final para litros.",
      strategy: "Converter 30 mm em 0,03 m, calcular o volume em m³ e usar 1 m³ = 1 000 L.",
      tip: "Milímetros de chuva representam altura de uma lâmina de água; com a área, você consegue o volume.",
    },
    {
      match: "De março para abril o consumo sobe de 150 para 210",
      topic: "Leitura de dados",
      objective: "Identificar entre meses consecutivos o maior aumento de consumo.",
      data: "Consumos: 200, 180, 150, 210 e 260 kWh de janeiro a maio.",
      clue: "A pergunta pede aumento entre meses consecutivos, então compare as diferenças uma a uma.",
      trap: "Escolher o mês de maior consumo total em vez do intervalo com maior aumento.",
      strategy: "Calcular Fev−Jan, Mar−Fev, Abr−Mar e Mai−Abr e comparar apenas os aumentos positivos.",
      tip: "Maior valor e maior crescimento são coisas diferentes. Sempre calcule a diferença entre os pontos comparados.",
    },
    {
      match: "As taxas são A=5%, B=6%, C=8% e D=10%",
      topic: "Taxa em tabela",
      objective: "Comparar a taxa de devolução dos quatro produtos.",
      data: "Vendidos/devolvidos: A 200/10, B 250/15, C 150/12 e D 100/10.",
      clue: "A taxa deve ser calculada em relação ao total vendido de cada produto.",
      trap: "Comparar apenas a quantidade de devoluções e ignorar que os volumes vendidos são diferentes.",
      strategy: "Para cada produto, calcular devolvidos ÷ vendidos × 100 e comparar os percentuais.",
      tip: "Quando os totais são diferentes, use taxa ou porcentagem; comparar só quantidades absolutas pode enganar.",
    },
    {
      match: "O aumento foi de 60 mil sobre uma base de 120 mil",
      topic: "Variação percentual",
      objective: "Calcular o crescimento percentual total entre a população inicial e a final.",
      data: "População inicial de 120 mil e final de 180 mil habitantes.",
      clue: "O percentual deve usar o valor inicial, 120 mil, como base.",
      trap: "Dividir o aumento pelo valor final ou somar percentuais de etapas sem necessidade.",
      strategy: "Calcular a variação 180−120 e dividir por 120.",
      tip: "Variação percentual = mudança ÷ valor inicial. O denominador é o ponto de partida.",
    },
    {
      match: "45% de 800=360. Depois, 25% de 360=90 estudantes",
      topic: "Leitura combinada de percentuais",
      objective: "Encontrar quantos estudantes pertencem simultaneamente ao grupo de usuários de ônibus e ao subgrupo com trajeto acima de uma hora.",
      data: "800 estudantes; 45% usam ônibus; entre esses, 25% levam mais de uma hora.",
      clue: "O segundo percentual é aplicado somente sobre os 45% que usam ônibus.",
      trap: "Calcular 25% de 800 diretamente ou somar 45% e 25%.",
      strategy: "Calcular 45% de 800 e depois 25% do resultado.",
      tip: "Quando o enunciado diz “entre os que...”, o segundo percentual usa esse subgrupo como nova base.",
    },
  ];

  const normalize = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

  function coloredLine(label, value, colorClass) {
    return `<p class="mente-pdf-colored-line"><strong class="${colorClass}">${esc(label)}:</strong> <span>${esc(value)}</span></p>`;
  }

  function specificFor(explanation) {
    const normalized = normalize(explanation);
    return specifics.find((item) => normalized.includes(normalize(item.match))) || null;
  }

  function parseItem(item) {
    const heading = item.querySelector("h4")?.textContent || "Questão";
    const paragraphs = [...item.children].filter((child) => child.tagName === "P");
    const userAnswer = normalize(paragraphs[0]?.textContent).replace(/^Sua resposta:\s*/i, "") || "Não respondida";
    const correctAnswer = normalize(paragraphs[1]?.textContent).replace(/^Resposta correta:\s*/i, "") || "—";
    const shortExplanation = normalize(paragraphs[2]?.textContent).replace(/^Explicação:\s*/i, "");
    const categoryMatch = heading.match(/^\s*\d+\.\s*(.*?)\s*·/);
    const category = categoryMatch?.[1]?.trim() || "Matemática";
    const numberMatch = heading.match(/^\s*(\d+)\./);
    const number = numberMatch?.[1] || "";
    return { heading, category, number, userAnswer, correctAnswer, shortExplanation, correct: item.classList.contains("is-correct") };
  }

  function explanationHtml(info) {
    const guide = guides[info.category] || guides["Grandezas e Medidas"];
    const specific = specificFor(info.shortExplanation) || {};
    const topic = specific.topic || info.category;
    const objective = specific.objective || `Resolver a questão de ${topic} e identificar a alternativa que satisfaz corretamente o que foi pedido.`;
    const data = specific.data || `Os valores, unidades e relações numéricas apresentados no enunciado da questão de ${topic}.`;
    const clue = specific.clue || guide.defaultStrategy;
    const trap = specific.trap || guide.defaultTrap;
    const strategy = specific.strategy || guide.defaultStrategy;
    const tip = specific.tip || guide.defaultTip;
    const resultTitle = info.correct ? "✅ Você acertou!" : "Vamos transformar esse erro em aprendizado";
    const wrongText = info.correct
      ? `Você marcou ${info.userAnswer}, que é a alternativa correta. As demais opções não representam o resultado obtido quando os dados são organizados e o cálculo é feito até o final.`
      : info.userAnswer === "Não respondida"
        ? `A questão ficou sem resposta. Compare o cálculo completo com a alternativa correta: ${info.correctAnswer}.`
        : `Você marcou ${info.userAnswer}. Essa opção não coincide com o resultado do procedimento correto. Refaça a resolução observando a pista e a armadilha acima, e compare com ${info.correctAnswer}.`;

    return `
      <div class="mente-pdf-explanation ${info.correct ? "is-correct" : "is-wrong"}">
        <h3 class="mente-pdf-result-title">${resultTitle}</h3>
        <section class="mente-pdf-color-key" aria-label="Cores de interpretação M.E.N.T.E">
          ${coloredLine("Objetivo", objective, "mente-pdf-blue-label")}
          ${coloredLine("Dados importantes", data, "mente-pdf-green-label")}
          ${coloredLine("Pista de interpretação", clue, "mente-pdf-orange-label")}
          ${coloredLine("Armadilha", trap, "mente-pdf-red-label")}
          ${coloredLine("Estratégia", strategy, "mente-pdf-purple-label")}
        </section>
        <section class="mente-pdf-step">
          <h4>1. Primeiro: vamos entender o enunciado</h4>
          <p>${esc(guide.understand)}</p>
        </section>
        <section class="mente-pdf-step">
          <h4>2. O que precisamos perceber?</h4>
          <div class="mente-pdf-bullets mente-pdf-teal">${esc(guide.perceive).replace(/•/g, "<br>•")}</div>
        </section>
        <section class="mente-pdf-step">
          <h4>3. Onde está a armadilha?</h4>
          ${coloredLine("Armadilha", trap, "mente-pdf-red-label")}
        </section>
        <section class="mente-pdf-step">
          <h4>4. Agora vamos montar a resolução</h4>
          ${coloredLine("Estratégia", strategy, "mente-pdf-purple-label")}
          ${coloredLine("Montagem", info.shortExplanation, "mente-pdf-indigo-label")}
        </section>
        <section class="mente-pdf-step">
          <h4>5. Resolução matemática</h4>
          ${coloredLine("Cálculo", info.shortExplanation, "mente-pdf-cyan-label")}
        </section>
        <section class="mente-pdf-step">
          <h4>6. Se você marcou outra alternativa</h4>
          <div class="mente-pdf-wrongs"><p class="mente-pdf-wrong-line">${esc(wrongText)}</p></div>
        </section>
        <section class="mente-pdf-step">
          <h4>7. Por que a alternativa correta está correta?</h4>
          ${coloredLine("Resposta correta", `${info.correctAnswer}. ${info.shortExplanation}`, "mente-pdf-green-label")}
        </section>
        <section class="mente-pdf-step">
          <h4>8. Dica M.E.N.T.E</h4>
          ${coloredLine("Dica M.E.N.T.E", tip, "mente-pdf-purple-label")}
        </section>
      </div>`;
  }

  function upgradeItem(item) {
    if (item.dataset.menteRichExplanation === "1") return;
    const info = parseItem(item);
    if (!info.shortExplanation) return;
    item.dataset.menteRichExplanation = "1";
    item.classList.add("mente-sim-rich-review");
    item.style.setProperty("--subject-color", COLORS[info.category] || "#1769E0");
    item.innerHTML = `
      <details class="sim-review-details">
        <summary>
          <span class="sim-review-details__number">${esc(info.number || "•")}</span>
          <span class="sim-review-details__copy"><strong>${esc(info.category)}</strong><small>${esc(specificFor(info.shortExplanation)?.topic || "Explicação completa no padrão M.E.N.T.E")}</small></span>
          <span class="sim-review-details__status ${info.correct ? "is-correct" : "is-wrong"}">${info.correct ? "✓ Acertou" : "Revisar"}</span>
          <span class="sim-review-details__toggle">Ver explicação</span>
        </summary>
        <div class="sim-review-details__body">${explanationHtml(info)}</div>
      </details>`;
  }

  function upgradeReview() {
    document.querySelectorAll("#sim-result .sim-review-item").forEach(upgradeItem);
  }

  const result = document.querySelector("#sim-result");
  if (!result) return;
  const observer = new MutationObserver(upgradeReview);
  observer.observe(result, { childList: true, subtree: true });
  upgradeReview();
})();
