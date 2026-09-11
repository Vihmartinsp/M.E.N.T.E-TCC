"use strict";

(() => {
  const modules = window.MENTE_FINAL_MODULES || {};
  const functions = modules["Funções"];
  if (!functions?.questions?.length) return;

  // Cor oficial da matéria no PDF revisado de Funções.
  functions.color = "#AB47BC";

  const explanations = {
    "2025-145": {
      objective: "Descrever o comportamento da frequência respiratória em relação ao tempo.",
      data: "t1 marca o início da prática meditativa; t2 marca o instante a partir do qual a frequência se estabiliza; f1 e f2 são os níveis de frequência.",
      clue: "A expressão 'reduzidas até se estabilizarem em um nível mais baixo' indica dois comportamentos: queda e depois constância.",
      trap: "Confundir 'diminuir' com 'ser inversamente proporcional' ou ignorar o trecho horizontal após t2.",
      strategy: "Separar o gráfico em dois trechos: de t1 até t2 e depois de t2.",
      understand: "A questão não pede nenhuma conta. Ela quer que o estudante leia o gráfico e descreva o comportamento da frequência respiratória depois que a meditação começa.",
      perceive: "Entre t1 e t2, a curva desce: a frequência respiratória diminui. A partir de t2, a curva fica horizontal: a frequência deixa de diminuir e permanece constante em f2.",
      trapDetail: "Palavras como 'diretamente proporcional' e 'inversamente proporcional' podem parecer sofisticadas, mas o gráfico não mostra nenhuma dessas relações. Também não podemos dizer que a frequência continua diminuindo depois de t2, porque o gráfico fica horizontal.",
      setup: "Basta traduzir cada trecho do gráfico para palavras e comparar essa descrição com as alternativas.",
      resolution: "De t1 até t2, a curva é decrescente. Depois de t2, a curva é horizontal, então a frequência é constante. Resultado: diminui até t2 e, depois, permanece constante, alternativa D.",
      wrong: "Alternativa A: seria verdadeira apenas depois de t2; entre t1 e t2 a frequência ainda está diminuindo. Alternativa B: uma relação diretamente proporcional não corresponde ao gráfico e a frequência não aumenta com o tempo. Alternativa C: uma relação inversamente proporcional continuaria variando; o gráfico mostra estabilização após t2. Alternativa E: depois de t2 não existe mais diminuição; o trecho é horizontal.",
      correctExplanation: "Alternativa D. Ela descreve exatamente os dois trechos mostrados: queda entre t1 e t2 e estabilização a partir de t2.",
      tip: "Em gráficos, leia um intervalo de cada vez. Curva descendo significa diminuição; trecho horizontal significa valor constante.",
    },
    "2024-177": {
      objective: "Calcular o custo total para a produção de 80 mochilas.",
      data: "30 mochilas custam R$ 1 050,00; 50 mochilas custam R$ 1 650,00; 100 mochilas custam R$ 3 150,00.",
      clue: "O enunciado fala em custo fixo, custo variável proporcional e crescimento linear.",
      trap: "Tratar o custo como diretamente proporcional à quantidade e esquecer o custo fixo.",
      strategy: "Descobrir a taxa por mochila e depois encontrar o custo fixo.",
      understand: "O custo total tem duas partes. Uma existe mesmo antes de produzir qualquer mochila; a outra aumenta conforme a quantidade produzida. Isso é exatamente a estrutura de uma função afim.",
      perceive: "A diferença entre os custos de duas linhas da tabela revela quanto o custo aumenta por mochila. Depois, usamos um dos pontos da tabela para descobrir o valor fixo.",
      trapDetail: "Se o estudante fizer apenas uma regra de três entre quantidade e custo, estará supondo que o custo começa em zero. O enunciado avisa que existe um custo fixo, então essa proporcionalidade direta não vale.",
      setup: "Representamos o custo por C(x) = ax + b, em que a é o custo variável por mochila e b é o custo fixo.",
      resolution: "a = (1 650 - 1 050) ÷ (50 - 30) = 600 ÷ 20 = 30. Usando C(30) = 1 050: 1 050 = 30·30 + b, então b = 150. Logo, C(x) = 30x + 150. C(80) = 30·80 + 150 = 2 550. Resultado: R$ 2 550,00, alternativa C.",
      wrong: "Alternativa A: R$ 2 400 é 30 × 80; o custo variável foi encontrado, mas o custo fixo de R$ 150 foi esquecido. Alternativa B: R$ 2 520 pode surgir ao fazer 80% de R$ 3 150, tratando a relação como proporcional direta e ignorando o custo fixo. Alternativa D: R$ 2 700 indica taxa de variação ou custo fixo maior do que o mostrado pela tabela. Alternativa E: R$ 2 800 corresponde a usar R$ 35 por mochila, obtido de 1 050 ÷ 30, como se todo o custo fosse variável.",
      correctExplanation: "Alternativa C. A função que reproduz os valores da tabela é C(x) = 30x + 150; para 80 mochilas, ela fornece R$ 2 550,00.",
      tip: "Quando houver 'valor fixo + valor por unidade', não use regra de três direta. Procure a taxa de variação e o valor inicial.",
    },
    "2024-146": {
      objective: "Encontrar a maior área possível e, a partir dela, a medida do maior lado do galinheiro.",
      data: "Dois lados L usam tela de R$ 20,00 por metro; dois lados C usam tela de R$ 15,00 por metro; gasto máximo de R$ 6 000,00.",
      clue: "O custo limita os lados e a área do retângulo depende do produto L·C.",
      trap: "Supor que o retângulo de maior área precisa ser um quadrado, mesmo com custos diferentes nos lados.",
      strategy: "Usar a restrição de custo para escrever a área como função quadrática de uma variável e encontrar o vértice.",
      understand: "A questão mistura Geometria com Funções. A figura é um retângulo, mas o ponto principal é descobrir quais dimensões fazem a área ser máxima respeitando um limite de gasto.",
      perceive: "Como há dois lados de comprimento L e dois de comprimento C, o custo total é 40L + 30C. Para obter a maior área possível, usamos todo o orçamento disponível e transformamos uma das medidas em função da outra.",
      trapDetail: "Um quadrado maximiza a área quando todos os lados têm o mesmo custo por metro. Aqui os lados L e C usam telas de preços diferentes. Por isso, não podemos simplesmente impor L = C.",
      setup: "Da restrição 40L + 30C = 6 000, isolamos C. Depois substituímos em A = L·C e encontramos o vértice da parábola.",
      resolution: "30C = 6 000 - 40L, então C = 200 - (4/3)L. Assim, A(L) = L[200 - (4/3)L] = 200L - (4/3)L². O vértice ocorre em L = -200 ÷ [2·(-4/3)] = 75. Então C = 200 - (4/3)·75 = 100. Os lados medem 75 m e 100 m; o maior lado mede 100 m, alternativa B.",
      wrong: "Alternativa A: 85 aparece aproximadamente quando se supõe L = C e se divide o orçamento pelo custo dos quatro lados, ignorando os preços diferentes das telas. Alternativa C: 175 pode surgir ao dividir 6 000 por 20 + 15, esquecendo que existem dois lados de cada tipo e sem maximizar a área. Alternativa D: 200 é o valor de C quando L = 0; nesse caso a área é zero. Alternativa E: 350 é a soma de valores-limite obtidos quando um dos lados é zero, e não a solução de área máxima.",
      correctExplanation: "Alternativa B. A função da área é uma parábola voltada para baixo; seu vértice ocorre em L = 75 m, produzindo C = 100 m. Logo, o maior lado é 100 m.",
      tip: "Quando aparecer 'maior' ou 'menor' valor e você conseguir montar uma função quadrática, procure o vértice da parábola.",
    },
    "2024-170": {
      objective: "Calcular o valor aproximado da magnitude M2 do segundo terremoto.",
      data: "M1 = 6,9; a energia liberada pelo primeiro terremoto é um décimo da energia liberada pelo segundo.",
      clue: "Se E1 é um décimo de E2, então E2/E1 = 10.",
      trap: "Inverter a razão E2/E1 ou trocar o fator 2/3 por 3/2.",
      strategy: "Transformar a frase sobre as energias em uma razão e substituir na expressão dada.",
      understand: "A fórmula já foi fornecida. O desafio principal é traduzir corretamente a frase 'a energia do primeiro foi um décimo da observada no segundo'.",
      perceive: "Se E1 = E2/10, então a razão que aparece na fórmula é E2/E1 = 10. Como o logaritmo é decimal, log(10) = 1.",
      trapDetail: "Trocar E2/E1 por E1/E2 muda 10 para 0,1 e faz o logaritmo ficar negativo. Outra armadilha é inverter 2/3 para 3/2.",
      setup: "Substituímos a razão 10 e M1 = 6,9 na expressão. Depois arredondamos M2 para uma casa decimal.",
      resolution: "M2 - 6,9 = (2/3)·1. Portanto, M2 = 6,9 + 0,666... = 7,566... Com uma casa decimal, M2 ≈ 7,6. Resultado: 7,6, alternativa C.",
      wrong: "Alternativa A: 5,4 pode surgir ao inverter a razão das energias e ainda trocar 2/3 por 3/2, produzindo 6,9 - 1,5. Alternativa B: 6,2 surge ao inverter E2/E1 e usar log(0,1) = -1, levando a 6,9 - 2/3. Alternativa D: 8,2 indica uso de um acréscimo maior do que 2/3. Alternativa E: 8,4 é exatamente o resultado de usar 3/2 no lugar de 2/3: 6,9 + 1,5.",
      correctExplanation: "Alternativa C. A razão correta é E2/E1 = 10, então o logaritmo vale 1. A magnitude aumenta em 2/3, chegando a aproximadamente 7,6.",
      tip: "Em fórmulas com razões, transforme primeiro a frase do enunciado em uma igualdade. Isso evita inverter numerador e denominador.",
    },
    "2025-160": {
      objective: "Identificar a expressão algébrica que representa a relação entre D e T.",
      data: "D = 30 quando T = 2,5 no ponto central do ramo; assíntotas em (5 - 2π)/2 e (5 + 2π)/2.",
      clue: "O centro do ramo determina os deslocamentos e a distância até as assíntotas ajuda a encontrar p.",
      trap: "Usar os números 2,5, 4 ou 30 como parâmetros apenas porque aparecem no gráfico, sem verificar o papel de cada um.",
      strategy: "Identificar primeiro k, depois o deslocamento horizontal e, por último, p pelas assíntotas.",
      understand: "Aqui não basta reconhecer uma tangente. Precisamos descobrir como o gráfico básico de tg foi deslocado e esticado para coincidir com a curva mostrada.",
      perceive: "O ponto central do ramo está em T = 2,5 e D = 30. Nesse ponto, o argumento da tangente pode ser zero, então tg(0) = 0. Isso permite identificar k = 30 e o deslocamento horizontal para T = 2,5.",
      trapDetail: "Os números 4 e 2,5 aparecem no gráfico, mas não significam automaticamente k ou p. O parâmetro precisa ser deduzido pelo efeito que causa no gráfico.",
      setup: "Começamos pelo ponto central e depois usamos as assíntotas. Na tangente padrão, a distância do centro até uma assíntota é π/2. Com o fator p dentro da função, essa distância passa a ser π/(2p).",
      resolution: "No ponto central, D = k = 30. Para o argumento ser zero em T = 2,5: 2,5 + m = 0, então m = -2,5 = -5/2. A distância do centro a cada assíntota é π. Logo, π/(2p) = π, então p = 1/2. Portanto, D = 30 + tg[(1/2)(T - 5/2)]. Resultado: alternativa E.",
      wrong: "Alternativa A: usa 2,5 como deslocamento vertical e 30 como fator horizontal, mas o nível central é D = 30. Alternativa B: usa k = 4, embora 4 seja um valor do eixo do tempo, e não respeita o ponto central em T = 2,5. Alternativa C: novamente usa 4 como deslocamento vertical e mistura 2,5 com o fator de escala horizontal. Alternativa D: acerta k = 30 e p = 1/2, mas T - 5 colocaria o centro do ramo em T = 5, enquanto o gráfico mostra T = 2,5.",
      correctExplanation: "Alternativa E. Ela possui k = 30, deslocamento horizontal para T = 2,5 e p = 1/2, exatamente os três comportamentos mostrados no gráfico.",
      tip: "Em funções transformadas, não tente adivinhar todos os parâmetros ao mesmo tempo. Descubra um efeito por vez: deslocamento vertical, deslocamento horizontal e escala.",
    },
  };

  functions.questions.forEach((question) => {
    const key = `${question.year}-${question.examNumber}`;
    const update = explanations[key];
    if (!update) return;
    Object.assign(question, update, { color: functions.color });
  });
})();
