"use strict";

(() => {
  const modules = window.MENTE_FINAL_MODULES || {};
  const statistics = modules["Estatística e Probabilidade"];
  if (!statistics?.questions?.length) return;

  // Cor oficial da matéria no PDF revisado de Estatística e Probabilidade.
  statistics.color = "#0F766E";

  const explanations = {
    "2024-178": {
      objective: "Descobrir a mediana dos dados de umidade relativa do ar.",
      data: "66, 64, 54, 46, 60 e 64; são seis valores, portanto a quantidade de dados é par.",
      clue: "Com seis valores, a mediana é a média dos dois valores centrais depois de ordenar os dados.",
      trap: "Pegar os dois valores centrais na ordem original da tabela, sem ordenar os dados.",
      strategy: "Ordenar os seis valores em ordem crescente e calcular a média dos dois centrais.",
      understand: "A questão fornece seis porcentagens de umidade e pede apenas a mediana. Não precisamos somar todos os valores nem calcular uma média geral.",
      perceive: "Como existem seis valores, a mediana será a média entre o 3º e o 4º valores depois que a lista for colocada em ordem crescente.",
      trapDetail: "Os valores aparecem organizados por mês, não por tamanho. Usar os elementos centrais da tabela original, 54 e 46, daria um resultado errado.",
      setup: "Ordenamos os valores e identificamos os dois que ficam no centro.",
      resolution: "Dados: 66, 64, 54, 46, 60 e 64. Ordem crescente: 46, 54, 60, 64, 64, 66. Valores centrais: 60 e 64. Mediana = (60 + 64) ÷ 2 = 62. Resultado: 62, alternativa E.",
      wrong: "Alternativa A: 56 pode aparecer ao combinar valores que não são os dois centrais após a ordenação. Alternativa B: 58 pode surgir de uma média parcial feita sem ordenar corretamente os dados. Alternativa C: 59 indica uso de valores centrais incorretos ou uma média aproximada do conjunto. Alternativa D: 60 é um dos valores centrais, mas como a quantidade de dados é par, também é preciso usar o 64.",
      correctExplanation: "Alternativa E. Depois de ordenar os seis valores, os dois centrais são 60 e 64. A média entre eles é 62.",
      tip: "Viu a palavra 'mediana'? Antes de qualquer conta, ordene os dados.",
    },
    "2023-180": {
      objective: "Escolher o primeiro mês do par de meses consecutivos cuja média de precipitação seja a maior possível.",
      data: "Outubro: 250 mm; novembro: 150 mm; dezembro: 200 mm; janeiro: 450 mm; fevereiro: 100 mm; março: 200 mm.",
      clue: "A planta precisa de bastante água nos dois primeiros meses após o plantio, então os meses precisam ser consecutivos.",
      trap: "Escolher janeiro apenas porque ele possui a maior precipitação individual.",
      strategy: "Formar todos os pares de meses consecutivos, calcular a média de cada par e comparar os resultados.",
      understand: "A planta precisa de muita água durante dois meses, e esses meses devem ser consecutivos. Portanto, não basta procurar o maior valor isolado.",
      perceive: "Cada possível mês de plantio cria um par: outubro-novembro, novembro-dezembro, dezembro-janeiro, janeiro-fevereiro e fevereiro-março.",
      trapDetail: "Janeiro tem 450 mm, o maior valor da lista. Porém, plantando em janeiro, os dois meses considerados seriam janeiro e fevereiro; a média desse par não é a maior.",
      setup: "Calculamos a média de cada par consecutivo e escolhemos o maior resultado.",
      resolution: "Out-Nov: (250 + 150) ÷ 2 = 200. Nov-Dez: (150 + 200) ÷ 2 = 175. Dez-Jan: (200 + 450) ÷ 2 = 325. Jan-Fev: (450 + 100) ÷ 2 = 275. Fev-Mar: (100 + 200) ÷ 2 = 150. A maior média é 325 mm, no par dezembro-janeiro. O plantio deve começar em dezembro, alternativa C.",
      wrong: "Alternativa A: o par outubro-novembro tem média 200 mm, menor que 325 mm. Alternativa B: o par novembro-dezembro tem média 175 mm. Alternativa D: janeiro é o mês com maior chuva isolada, mas o par janeiro-fevereiro tem média 275 mm. Alternativa E: o par fevereiro-março tem média 150 mm, a menor entre os pares.",
      correctExplanation: "Alternativa C. Dezembro e janeiro formam o par consecutivo com a maior média de precipitação: 325 mm.",
      tip: "Quando a questão disser 'consecutivos', monte os pares possíveis antes de comparar os valores.",
    },
    "2023-137": {
      objective: "Calcular a média dos salários dos 100 funcionários da empresa.",
      data: "75 funcionários recebem R$ 2 000 e 25 funcionários recebem R$ 7 000.",
      clue: "A quantidade de funcionários por setor funciona como peso de cada salário.",
      trap: "Fazer (2 000 + 7 000) ÷ 2 e ignorar que os grupos têm tamanhos diferentes.",
      strategy: "Calcular a folha salarial total e dividir o resultado pelos 100 funcionários.",
      understand: "Existem dois salários, mas eles não aparecem com a mesma frequência. O salário de R$ 2 000 é recebido por 75 pessoas, enquanto R$ 7 000 é recebido por 25 pessoas.",
      perceive: "A média precisa considerar quantas pessoas recebem cada salário. Isso transforma a questão em uma média ponderada.",
      trapDetail: "A média simples entre R$ 2 000 e R$ 7 000 é R$ 4 500, mas esse valor trataria os dois setores como se tivessem a mesma quantidade de funcionários.",
      setup: "Calculamos o total pago a cada setor, somamos a folha salarial e dividimos por 100.",
      resolution: "Produção: 75 × 2 000 = 150 000. Administração: 25 × 7 000 = 175 000. Folha total = 150 000 + 175 000 = 325 000. Média = 325 000 ÷ 100 = 3 250. Resultado: R$ 3 250,00, alternativa C.",
      wrong: "Alternativa A: considera apenas o salário do setor de Produção e ignora os funcionários da Administração. Alternativa B: pode surgir de uma ponderação incompleta ou de considerar apenas a diferença entre os grupos. Alternativa D: R$ 4 500 é a média simples entre 2 000 e 7 000; o erro é ignorar os pesos 75 e 25. Alternativa E: R$ 9 000 corresponde à soma dos dois salários, não à média dos 100 funcionários.",
      correctExplanation: "Alternativa C. A folha total é R$ 325 000 e existem 100 funcionários. Dividindo, obtemos salário médio de R$ 3 250,00.",
      tip: "Se os grupos têm quantidades diferentes, pergunte imediatamente: qual é o peso de cada valor?",
    },
    "2024-165": {
      objective: "Descobrir de quantos segundos deve ser a redução do tempo em que cada semáforo fica vermelho.",
      data: "Tempo atual de 15 s em um ciclo de 60 s; probabilidade de ambos vermelhos igual a 4/100; eventos independentes; mesma redução nos dois sinais.",
      clue: "Para os dois sinais estarem vermelhos na mesma viagem, multiplicamos as probabilidades iguais de cada semáforo.",
      trap: "Usar 4/100 como a probabilidade de um único semáforo ou somar as probabilidades dos dois sinais.",
      strategy: "Descobrir primeiro a nova probabilidade de cada sinal, transformar essa probabilidade em segundos e comparar com os 15 s atuais.",
      understand: "Os dois sinais terão o mesmo novo tempo vermelho. Como os eventos são independentes, a probabilidade de encontrar os dois vermelhos é o produto das probabilidades de cada um.",
      perceive: "Se p é a nova probabilidade de um semáforo estar vermelho, então p × p = 4/100. Depois relacionamos p ao novo tempo vermelho em um ciclo de 60 segundos.",
      trapDetail: "A probabilidade 4/100 é a chance de os dois sinais estarem vermelhos, e não de um único sinal estar vermelho. Por isso, não podemos fazer diretamente novo tempo = 0,04 × 60.",
      setup: "Primeiro tiramos a raiz da probabilidade conjunta. Depois calculamos o novo tempo vermelho e comparamos com os 15 segundos atuais.",
      resolution: "p² = 4/100 = 0,04. Logo, p = √0,04 = 0,20. Novo tempo vermelho = 0,20 × 60 = 12 s. Redução = 15 - 12 = 3 s. Resultado: 3,00 segundos, alternativa B.",
      wrong: "Alternativa A: 1,35 pode surgir de operações diretas com 4%, 15 e 60 sem usar a independência dos eventos. Alternativa C: 9,00 pode aparecer se o estudante encontra 12 segundos e confunde o novo tempo vermelho com a redução ou faz uma subtração incorreta. Alternativa D: 12,60 está próxima do novo tempo vermelho, mas a questão pede quanto o tempo foi reduzido, não o tempo final. Alternativa E: 13,80 pode surgir ao tratar a probabilidade conjunta como se fosse o tempo de cada sinal.",
      correctExplanation: "Alternativa B. Cada semáforo precisa ter probabilidade 20% de estar vermelho. Em 60 segundos, isso corresponde a 12 segundos. A redução é 15 - 12 = 3 segundos.",
      tip: "Quando aparecer 'eventos independentes' e a questão pedir A e B, pense em multiplicar: P(A e B) = P(A) × P(B).",
    },
    "2025-165": {
      objective: "Identificar o grupo em que certamente a maioria das mulheres tem idades entre 20 e 30 anos.",
      data: "11 pessoas por grupo; grupo 4 com média 25 e desvio padrão 1; grupo 2 com mediana 25; grupo 3 com moda 25; grupo 5 com menor idade 20 e maior 35.",
      clue: "A palavra 'certamente' exige uma informação que realmente garanta concentração das idades dentro do intervalo.",
      trap: "Achar que média 25, mediana 25 ou moda 25, isoladamente, garantem que a maioria esteja entre 20 e 30 anos.",
      strategy: "Procurar o grupo em que as medidas disponíveis garantem concentração das idades perto de 25.",
      understand: "A questão não pede para calcular uma estatística. Ela pede para interpretar o que cada medida permite afirmar, mesmo com a tabela incompleta.",
      perceive: "O grupo precisa ter pelo menos 6 das 11 mulheres entre 20 e 30 anos. O dado mais forte para garantir concentração é um desvio padrão muito pequeno em torno de uma média que está no centro do intervalo.",
      trapDetail: "Média, mediana e moda dizem coisas diferentes. Uma média igual a 25 pode esconder valores muito baixos e muito altos; uma mediana 25 só fixa a posição central; uma moda 25 apenas indica o valor mais frequente.",
      setup: "Analisamos o que é possível garantir em cada grupo. No grupo 4, média 25 e desvio padrão 1 indicam que as idades estão fortemente concentradas ao redor de 25.",
      resolution: "Grupo 1: média 25 e desvio padrão 10, grande dispersão. Grupo 2: mediana 25 e desvio 9, sem garantia de concentração. Grupo 3: moda 25, sem garantia de maioria. Grupo 4: média 25 e desvio padrão 1, forte concentração perto de 25. Grupo 5: mínimo 20 e máximo 35, sem informação suficiente sobre os demais valores. Resultado: grupo 4, alternativa D.",
      wrong: "Alternativa A: média 25 não basta; com desvio padrão 10, muitas idades podem ficar fora de 20 a 30. Alternativa B: mediana 25 significa que o valor central da lista ordenada é 25, mas não impede várias idades abaixo de 20 ou acima de 30. Alternativa C: moda 25 significa apenas que 25 é a idade que mais se repete; isso não garante maioria. Alternativa E: saber que a menor idade é 20 e a maior é 35 não informa quantas mulheres estão dentro do intervalo.",
      correctExplanation: "Alternativa D. O grupo 4 reúne média 25 e desvio padrão 1. A média está no centro do intervalo desejado e o desvio muito pequeno mostra forte concentração das idades ao redor de 25.",
      tip: "Quando a pergunta usar a palavra 'certamente', não procure apenas um valor que parece bom. Procure a medida que realmente garante a conclusão.",
    },
  };

  statistics.questions.forEach((question) => {
    const key = `${question.year}-${question.examNumber}`;
    const update = explanations[key];
    if (!update) return;
    Object.assign(question, update, { color: statistics.color });
  });
})();
