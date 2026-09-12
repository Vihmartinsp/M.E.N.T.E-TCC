"use strict";

(() => {
  const modules = window.MENTE_FINAL_MODULES || {};
  const geometry = modules["Geometria"];
  if (!geometry?.questions?.length) return;

  // Cor oficial da matéria no PDF final de Geometria.
  geometry.color = "#FF7A00";

  const explanations = {
    "2024-145": {
      objective: "Descobrir em quantos metros quadrados a área do campo do Maracanã foi reduzida.",
      data: "Campo antigo: 110 m × 75 m; campo novo: 105 m × 68 m.",
      clue: "A palavra 'reduzida' indica que devemos comparar a área antiga com a área nova.",
      trap: "Subtrair apenas os comprimentos dos lados, em vez de comparar as áreas.",
      strategy: "Calcular as duas áreas retangulares e fazer área antiga − área nova.",
      understand: "O campo continua sendo retangular, mas suas duas dimensões diminuíram. A pergunta não quer saber quantos metros cada lado perdeu: quer saber quantos metros quadrados de área deixaram de existir.",
      perceive: "Precisamos comparar duas áreas. Primeiro calculamos a área antes da mudança. Depois calculamos a área depois da mudança. A redução é a diferença entre elas.",
      trapDetail: "Fazer 110 − 105 e 75 − 68 produz 5 m e 7 m, mas esses valores representam reduções de comprimento, não redução de área. Como a resposta é pedida em m², precisamos usar área.",
      setup: "Para retângulos, A = base × altura. Calculamos a área antiga e a nova e depois subtraímos.",
      resolution: "A antiga = 110 × 75 = 8 250 m². A nova = 105 × 68 = 7 140 m². Redução = 8 250 − 7 140 = 1 110 m². Resultado: 1 110 m², alternativa D.",
      wrong: "Alternativa A: 24 não representa a diferença entre as áreas dos dois retângulos. Alternativa B: 35 também não representa a diferença entre as áreas. Alternativa C: 555 corresponde a apenas metade da redução correta. Alternativa E: 1 145 aparece por erro de multiplicação ou subtração das áreas.",
      correctExplanation: "Alternativa D. A área antiga era 8 250 m² e a nova é 7 140 m². A diferença entre essas duas áreas é exatamente 1 110 m².",
      tip: "Se a unidade da resposta for m², pense em área. Não compare apenas os lados: compare o espaço interno das figuras.",
    },
    "2025-139": {
      objective: "Encontrar a quantidade mínima necessária de policiais para proteger toda a ciclovia.",
      data: "Raio da lagoa igual a 1 km; cada ponto deve estar a no máximo 200 m de um policial; usar π ≈ 3.",
      clue: "Cada policial alcança 200 m para um lado e 200 m para o outro.",
      trap: "Dividir o percurso total por 200 m e esquecer o alcance nos dois lados.",
      strategy: "Calcular o comprimento da circunferência e dividir pelo trecho total protegido por cada policial.",
      understand: "A ciclovia acompanha o contorno da lagoa. Portanto, não queremos a área do círculo; queremos o comprimento da circunferência. Um policial protege pontos até 200 m antes e 200 m depois de sua posição.",
      perceive: "Cada policial cobre um trecho total de 400 m da ciclovia: 200 m para cada lado. Depois basta descobrir quantos trechos de 400 m são necessários para cobrir todo o contorno.",
      trapDetail: "Se dividirmos 6 000 por 200, encontramos 30, que é uma alternativa. Esse erro acontece quando ignoramos que o policial protege 200 m em cada direção.",
      setup: "Usamos C = 2πr para descobrir o comprimento da ciclovia. Depois convertemos quilômetros em metros e dividimos por 400 m.",
      resolution: "C = 2 × 3 × 1 = 6 km. Convertendo: 6 km = 6 000 m. Alcance por policial = 200 + 200 = 400 m. Então, 6 000 ÷ 400 = 15. Resultado: 15 policiais, alternativa C.",
      wrong: "Alternativa A: com 4 policiais, cada um teria de cobrir muito mais do que 400 m. Alternativa B: com 8 policiais, o alcance também seria insuficiente. Alternativa D: 30 resulta de dividir por 200 m e esquecer que o policial alcança os dois lados. Alternativa E: 60 dobra ainda mais a quantidade necessária.",
      correctExplanation: "Alternativa C. Quinze policiais cobrindo 400 m cada totalizam exatamente os 6 000 m da ciclovia.",
      tip: "Quando alguém alcança uma distância 'para os dois lados', some os dois alcances antes de dividir o percurso total.",
    },
    "2024-155": {
      objective: "Escolher um sensor que cubra no mínimo 70 m² com o menor preço possível.",
      data: "Cinco combinações de ângulo α e raio R; usar π ≈ 3; quanto maior a área de cobertura, maior o preço.",
      clue: "Como o preço aumenta com a área, precisamos encontrar a menor área que ainda alcance pelo menos 70 m².",
      trap: "Escolher apenas o maior raio ou o maior ângulo sem calcular a área do setor circular.",
      strategy: "Calcular a área de cada setor e escolher a menor área que ainda seja pelo menos 70 m².",
      understand: "Cada sensor cobre apenas uma parte de um círculo. Não basta olhar para o raio: o ângulo também controla o tamanho da região coberta. Além disso, o preço cresce com a área, então queremos a menor cobertura que ainda atenda aos 70 m².",
      perceive: "Como 360° corresponde ao círculo inteiro, um setor de ângulo α ocupa a fração α/360 da área total do círculo. Por isso usamos A = (α/360)·πr².",
      trapDetail: "O sensor II tem raio 22 m, o maior de todos, mas isso não significa automaticamente que ele seja a melhor escolha. A área depende do raio e do ângulo. E, como maior área significa maior preço, não queremos a maior cobertura: queremos a menor que ainda seja suficiente.",
      setup: "Calculamos a área de cobertura de cada sensor com π ≈ 3 e comparamos os resultados com 70 m².",
      resolution: "Tipo I: (15/360) × 3 × 20² = 50 m², não atende. Tipo II: (30/360) × 3 × 22² = 121 m², atende. Tipo III: (40/360) × 3 × 12² = 48 m², não atende. Tipo IV: (60/360) × 3 × 16² = 128 m², atende. Tipo V: (90/360) × 3 × 10² = 75 m², atende. Entre II, IV e V, o tipo V tem a menor área, 75 m², e portanto o menor preço. Resultado: alternativa E.",
      wrong: "Alternativa A: o sensor I cobre apenas 50 m² e não atinge o mínimo de 70 m². Alternativa B: o sensor II atende, mas cobre 121 m² e por isso é mais caro que o tipo V. Alternativa C: o sensor III cobre apenas 48 m² e não atende. Alternativa D: o sensor IV atende, mas cobre 128 m² e é mais caro que o tipo V.",
      correctExplanation: "Alternativa E. O tipo V cobre 75 m², ultrapassando o mínimo de 70 m² com a menor área entre os sensores que atendem à exigência. Logo, é o de menor preço possível.",
      tip: "Quando a questão disser 'no mínimo' e depois pedir 'menor custo', procure a opção que ultrapassa a exigência pela menor margem possível, desde que o custo realmente aumente com a grandeza indicada.",
    },
    "2024-150": {
      objective: "Identificar a loja cujo orçamento produz o menor valor total possível.",
      data: "A barreira atravessa 3 m = 300 cm; vãos de no máximo 15 cm; cada loja informa raio da coluna e preço por unidade.",
      clue: "A reta é paralela aos lados de menor medida, portanto atravessa 3 m; colunas vistas de cima ocupam um diâmetro, d = 2r.",
      trap: "Usar 6 m em vez de 3 m; usar o raio como largura da coluna; ou comparar apenas o preço unitário.",
      strategy: "Para cada loja, calcular a menor quantidade de colunas necessária e depois o custo total.",
      understand: "A barreira de colunas é paralela aos lados de menor medida. Portanto, ela atravessa 3 m da sala, isto é, 300 cm. Como as colunas são circulares vistas de cima, a largura ocupada por cada uma é seu diâmetro, d = 2r.",
      perceive: "Com n colunas, existem n + 1 vãos: um antes da primeira coluna, um entre cada par e um depois da última. Para usar o menor número de colunas, podemos considerar cada vão no limite máximo permitido, 15 cm.",
      trapDetail: "A questão combina Geometria com otimização. O menor preço por unidade não garante o menor custo total. Uma coluna mais barata pode exigir muito mais unidades.",
      setup: "Para cada loja, buscamos o menor inteiro n que satisfaça n·d + (n+1)·15 ≥ 300. Em seguida, multiplicamos n pelo preço unitário.",
      resolution: "Loja I: d = 10 cm, 12 colunas, total R$ 720. Loja II: d = 20 cm, 9 colunas, total R$ 630. Loja III: d = 24 cm, 8 colunas, total R$ 600. Loja IV: d = 30 cm, 7 colunas, total R$ 630. Loja V: d = 40 cm, 6 colunas, total R$ 720. Na loja III, 8×24 + 9×15 = 327 cm; com 7 colunas, 7×24 + 8×15 = 288 cm, insuficiente. O menor custo é R$ 600, alternativa C.",
      wrong: "Alternativa A: a Loja I exige 12 colunas e custa R$ 720. Alternativa B: a Loja II exige 9 colunas e custa R$ 630. Alternativa D: a Loja IV exige 7 colunas e custa R$ 630. Alternativa E: a Loja V exige 6 colunas e custa R$ 720.",
      correctExplanation: "Alternativa C. A Loja III é a única que combina quantidade necessária e preço unitário de modo a produzir o menor valor total: R$ 600.",
      tip: "Em problemas de orçamento, não escolha pela coluna 'preço por unidade'. Primeiro descubra quantas unidades são necessárias e só depois compare os totais.",
    },
    "2024-175": {
      objective: "Descobrir qual das duas embalagens cilíndricas tem maior capacidade e qual é o seu volume.",
      data: "Folha retangular de 10 cm por 20 cm; a folha forma a superfície lateral de um cilindro circular reto.",
      clue: "Um lado do retângulo vira a altura e o outro vira o comprimento da circunferência.",
      trap: "Usar 10 cm ou 20 cm diretamente como raio ou achar que as duas embalagens têm o mesmo volume por usarem a mesma folha.",
      strategy: "Identificar h e C em cada montagem, achar r por C = 2πr e comparar os volumes com V = πr²h.",
      understand: "A folha não forma a base do cilindro: ela forma apenas a superfície lateral. Quando enrolamos o retângulo, uma de suas medidas vira a altura do cilindro e a outra contorna a base, tornando-se o comprimento da circunferência.",
      perceive: "As duas embalagens usam a mesma área lateral, mas possuem raios e alturas diferentes. Como o volume usa r², mudar qual lado vira a circunferência altera bastante a capacidade.",
      trapDetail: "Os valores 10 e 20 cm não são raios. Eles representam altura ou comprimento da circunferência, dependendo da montagem. Primeiro precisamos encontrar o raio com C = 2πr.",
      setup: "Na embalagem 1, h = 20 cm e C = 10 cm. Na embalagem 2, h = 10 cm e C = 20 cm. Calculamos o raio de cada base e depois usamos V = πr²h.",
      resolution: "Embalagem 1: 10 = 2πr, então r = 5/π. V1 = π·(5/π)²·20 = 500/π cm³. Embalagem 2: 20 = 2πr, então r = 10/π. V2 = π·(10/π)²·10 = 1 000/π cm³. Como 1 000/π > 500/π, a embalagem 2 tem maior capacidade. Resultado: 1 000/π cm³, alternativa D.",
      wrong: "Alternativa A: 4 000π mantém π multiplicando como se uma das medidas da folha fosse diretamente o raio. Alternativa B: 2 000π comete o mesmo tipo de erro na interpretação do raio. Alternativa C: 4 000/π é quatro vezes o volume correto da embalagem 2. Alternativa E: 500/π é o volume da embalagem 1, que é a menor das duas.",
      correctExplanation: "Alternativa D. Ao usar 20 cm como circunferência, o segundo cilindro obtém um raio duas vezes maior que o primeiro. Mesmo tendo metade da altura, o raio aparece ao quadrado no volume e faz a capacidade aumentar para 1 000/π cm³.",
      tip: "Quando um retângulo é enrolado para formar um cilindro, pergunte: qual lado virou a altura e qual lado virou a circunferência? Só depois procure o raio.",
    },
  };

  geometry.questions.forEach((question) => {
    const key = `${question.year}-${question.examNumber}`;
    const update = explanations[key];
    if (!update) return;
    Object.assign(question, update, { color: geometry.color });
  });
})();
