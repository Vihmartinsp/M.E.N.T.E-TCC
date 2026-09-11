"use strict";

(() => {
  const modules = window.MENTE_FINAL_MODULES || {};
  const charts = modules["Gráficos e Tabelas"];
  if (!charts?.questions?.length) return;

  // Cor oficial da matéria no PDF revisado.
  charts.color = "#0284C7";

  const explanations = {
    156: {
      objective: "Por quantos minutos o celular ficou sem receber sinal.",
      data: "Tempo total de 30 minutos; linha sobre o eixo horizontal entre 10 e 12 min; linha sobre o eixo horizontal entre 16 e 20 min.",
      clue: "'Sem receber sinal' significa intensidade igual a zero.",
      trap: "Contar pontos do gráfico ou incluir trechos em que o sinal apenas está diminuindo.",
      strategy: "Identificar os intervalos em que a intensidade vale zero e somar suas durações.",
      understand: "A pergunta não quer o menor sinal nem o momento em que o sinal começou a cair. Ela quer o tempo total em que a intensidade foi exatamente zero.",
      perceive: "No gráfico, sinal zero aparece quando a linha coincide com o eixo horizontal. Isso ocorre em dois intervalos separados.",
      trapDetail: "Entre 8 e 10 minutos o sinal está diminuindo, mas ainda não é zero. Entre 12 e 16 minutos ele sobe e volta a cair, portanto também existe sinal nesse período.",
      setup: "Calculamos a duração de cada intervalo sem sinal e depois somamos.",
      resolution: "Dados: intervalos sem sinal de 10 a 12 min e de 16 a 20 min. Precisamos descobrir o tempo total sem sinal. Estratégia: somar as durações dos intervalos em que a intensidade é zero. Cálculo / leitura: 12 - 10 = 2 min; 20 - 16 = 4 min; 2 + 4 = 6 min. Resultado: 6 minutos, alternativa A.",
      wrong: "Alternativa B: 8 pode aparecer se o trecho de 8 a 10 minutos for contado como sem sinal. Nesse trecho o sinal apenas está caindo; ele chega a zero somente em 10 minutos. Alternativa C: 10 pode surgir ao tratar todo o intervalo de 10 a 20 minutos como se fosse zero, ignorando que entre 12 e 16 há sinal. Alternativa D: 14 costuma indicar soma incorreta de intervalos ou leitura de marcas do eixo como quantidade de minutos. Alternativa E: 24 é 30 - 6 e representa o tempo em que houve algum sinal, mas a pergunta pede o contrário.",
      correctExplanation: "Alternativa A. O celular ficou 2 minutos sem sinal no primeiro intervalo e 4 minutos no segundo. Ao todo, 6 minutos.",
      tip: "Pergunta de duração exige intervalo: final menos início. Depois some os intervalos que atendem à condição.",
    },
    143: {
      objective: "Encontrar a menor quantidade total de sódio por pacote.",
      data: "Número de porções de cada pacote e quantidade de sódio, em mg, por porção.",
      clue: "O rótulo informa sódio por porção, mas a pergunta pede o pacote inteiro.",
      trap: "Escolher apenas o menor número de mg por porção.",
      strategy: "Multiplicar número de porções × sódio por porção em todos os produtos e comparar os totais.",
      understand: "Os valores de sódio apresentados não são do pacote inteiro. Cada valor corresponde a uma única porção. Como os pacotes têm quantidades diferentes de porções, precisamos calcular o total de cada um.",
      perceive: "A expressão 'quantidade total de sódio por pacote' muda completamente a leitura. O menor valor por porção não necessariamente produz o menor total.",
      trapDetail: "O biscoito de água e sal tem o menor sódio por porção, 166 mg, mas possui 5 porções. Comparar apenas 166, 170, 175, 264 e 501 não responde ao que foi perguntado.",
      setup: "Calculamos porções × sódio por porção para cada pacote.",
      resolution: "Batata chips: 3 × 170 = 510 mg. Palitos salgados: 4 × 501 = 2 004 mg. Biscoito multigrãos: 8 × 264 = 2 112 mg. Biscoito de polvilho: 6 × 175 = 1 050 mg. Biscoito de água e sal: 5 × 166 = 830 mg. Resultado: 510 mg, da batata chips, alternativa A.",
      wrong: "Alternativa B: o pacote de palitos salgados tem 2 004 mg de sódio, bem acima do menor total. Alternativa C: o biscoito multigrãos totaliza 2 112 mg, o maior valor entre os cinco. Alternativa D: o biscoito de polvilho totaliza 1 050 mg, ainda maior que 510 mg. Alternativa E: 166 mg é o menor valor por porção, mas o pacote inteiro tem 830 mg; essa escolha compara 'por porção' em vez de 'por pacote'.",
      correctExplanation: "Alternativa A. Depois de transformar todos os rótulos em totais por pacote, a batata chips apresenta 510 mg, o menor dos cinco valores.",
      tip: "Circule a unidade: 'por porção' e 'por pacote' são informações diferentes. Antes de comparar, coloque todos os produtos na mesma base.",
    },
    147: {
      objective: "Descobrir o número de matrículas em francês em 2025.",
      data: "Em 2024: 280 matrículas em inglês, 80 em espanhol, 20 em francês e 20 em alemão; em 2023, francês representa 10%; em 2025 o total será o mesmo de 2024.",
      clue: "Usar o total de 2024 com a porcentagem de francês de 2023.",
      trap: "Usar diretamente os 20 alunos de francês de 2024 ou calcular 10% apenas desses 20.",
      strategy: "Somar as matrículas de 2024 para obter o total e depois calcular 10% desse total.",
      understand: "A questão mistura duas formas de apresentar dados: porcentagens em 2023 e quantidades em 2024. Para 2025, ela combina o total de 2024 com a distribuição percentual de 2023.",
      perceive: "Precisamos descobrir quantos alunos existiam ao todo em 2024 e aplicar a porcentagem de francês de 2023, que é 10%.",
      trapDetail: "O valor 20 do gráfico de barras é a quantidade de francês em 2024, mas 2025 não manterá a mesma distribuição de 2024. Manterá apenas o mesmo total.",
      setup: "Somamos todas as matrículas de 2024 e calculamos 10% do resultado.",
      resolution: "Total em 2024 = 280 + 80 + 20 + 20 = 400. Francês em 2025 = 10% de 400. 0,10 × 400 = 40. Resultado: 40 matrículas, alternativa E.",
      wrong: "Alternativa A: 2 é 10% de 20. Esse cálculo usa apenas a quantidade de francês de 2024 como base, mas a porcentagem deve ser aplicada ao total de 400 matrículas. Alternativa B: 12 não corresponde ao total de 2024 nem a 10% desse total; indica combinação incorreta dos valores dos gráficos. Alternativa C: 20 apenas copia a quantidade de francês de 2024 e ignora que a distribuição percentual de 2025 será a de 2023. Alternativa D: 22 pode surgir ao aumentar 20 em 10%, mas o enunciado diz que francês representará 10% do total.",
      correctExplanation: "Alternativa E. O total de 2024 é 400. Se francês representar 10% desse mesmo total em 2025, teremos 40 matrículas.",
      tip: "Quando dois gráficos usam unidades diferentes, pergunte: qual informação de um gráfico serve de base para a informação do outro?",
    },
    178: {
      objective: "Identificar o gráfico do volume de água acumulado ao longo do ciclo.",
      data: "Água por 3 s; pausa por 5 s; água por mais 3 s; vazão constante.",
      clue: "Volume acumulado não diminui quando a torneira fecha; apenas para de crescer.",
      trap: "Confundir volume acumulado com vazão e fazer o gráfico voltar para zero durante a pausa.",
      strategy: "Traduzir cada etapa em comportamento do gráfico: cresce → fica constante → cresce.",
      understand: "O eixo vertical representa volume acumulado, isto é, toda a água que já saiu desde o início. Esse volume nunca diminui.",
      perceive: "De 0 a 3 s a água sai com vazão constante, então o volume cresce linearmente. De 3 a 8 s a torneira fica fechada, então o volume permanece constante. De 8 a 11 s a água volta a sair e o volume volta a crescer.",
      trapDetail: "Se o gráfico cai para zero durante a pausa, ele não está mostrando volume acumulado. O que já saiu da torneira continua contabilizado.",
      setup: "Procuramos a alternativa com três trechos: crescente de 0 a 3, horizontal de 3 a 8 e crescente de 8 a 11.",
      resolution: "0 a 3 s: reta crescente. 3 a 8 s: reta horizontal. 8 a 11 s: reta crescente com a mesma inclinação da primeira. Resultado: alternativa B.",
      wrong: "Alternativa A: faz o volume acumulado voltar para zero durante a pausa, apagando a água que já foi liberada. Alternativa C: mostra valores constantes quando a torneira está aberta e zero quando está fechada; esse comportamento se aproxima mais de uma vazão por intervalos do que de volume acumulado. Alternativa D: cresce continuamente, inclusive durante os 5 segundos em que a torneira está fechada. Alternativa E: também zera o volume durante a pausa e reinicia a contagem no enxágue, contrariando a palavra 'acumulado'.",
      correctExplanation: "Alternativa B. Ela mantém o valor alcançado durante a pausa e retoma o crescimento quando a água volta a fluir, exatamente como deve ocorrer com uma grandeza acumulada.",
      tip: "Palavra-chave: 'acumulado'. Se nada é acrescentado, o valor fica constante; ele não volta para zero.",
    },
    169: {
      objective: "Identificar o gráfico da produção de soja, em toneladas, nas cinco safras.",
      data: "Área cultivada em hectare; produtividade em sacas de 50 kg por hectare; 1 tonelada = 1 000 kg.",
      clue: "Produção não é igual à área nem à produtividade isoladamente; é preciso combinar as duas.",
      trap: "Copiar uma linha da tabela diretamente para o gráfico ou esquecer o fator de 50 kg por saca.",
      strategy: "Para cada safra: área × sacas/hectare × 50 kg e depois converter para toneladas.",
      understand: "A tabela não fornece diretamente a produção total. Ela fornece área e produtividade. Precisamos calcular quantas sacas são produzidas no total e transformar a massa dessas sacas em toneladas.",
      perceive: "A produtividade está em 'sacas de 50 kg por hectare'. Portanto, primeiro multiplicamos pela área para obter sacas e depois multiplicamos por 50 kg.",
      trapDetail: "É muito fácil escolher um gráfico que simplesmente repete 200, 220, 250, 250 e 200 ou 40, 30, 45, 45 e 50. Esses são dados de entrada, não a produção total pedida.",
      setup: "Calculamos a produção em toneladas em cada safra e comparamos a sequência encontrada com os cinco gráficos.",
      resolution: "11-12: 200 × 40 × 50 ÷ 1 000 = 400 t. 12-13: 220 × 30 × 50 ÷ 1 000 = 330 t. 13-14: 250 × 45 × 50 ÷ 1 000 = 562,5 t. 14-15: 250 × 45 × 50 ÷ 1 000 = 562,5 t. 15-16: 200 × 50 × 50 ÷ 1 000 = 500 t. Resultado: sequência 400, 330, 562,5, 562,5 e 500, alternativa A.",
      wrong: "Alternativa B: apresenta 40, 30, 45, 45 e 50, exatamente a linha da produtividade; o erro é usar sacas por hectare como se fosse produção total em toneladas. Alternativa C: apresenta 200, 220, 250, 250 e 200, exatamente a linha da área cultivada; o erro é confundir hectares com toneladas produzidas. Alternativa D: apresenta 240, 250, 295, 295 e 250, valores obtidos somando área e produtividade; grandezas com unidades diferentes não podem ser somadas dessa forma. Alternativa E: apresenta 8, 6,6, 11,25, 11,25 e 10; esses números mostram que o fator de 50 kg por saca foi esquecido.",
      correctExplanation: "Alternativa A. Ela reproduz exatamente os cinco valores calculados em toneladas: 400, 330, 562,5, 562,5 e 500.",
      tip: "Antes de procurar o gráfico, escreva a unidade desejada. Depois acompanhe as unidades em cada multiplicação e conversão. Isso elimina várias alternativas sem precisar adivinhar pelo formato da linha.",
    },
  };

  charts.questions.forEach((question) => {
    const update = explanations[Number(question.examNumber)];
    if (!update) return;
    Object.assign(question, update, { color: charts.color });
  });
})();
