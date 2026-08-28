"use strict";

(() => {
  const SUBJECT_COLOR = "#FF7A00";
  const INEP_SOURCE_URL = "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos";

  const geometryQuestions = {
    1: {
      id: 1,
      examNumber: 145,
      category: "Geometria",
      topic: "Área de retângulos e diferença de áreas",
      year: 2024,
      stars: 1,
      text: "O campo retangular do Maracanã foi reduzido de 110 m × 75 m para 105 m × 68 m. Em quantos metros quadrados sua área foi reduzida?",
      detail: "O estádio do Maracanã passou por algumas modificações estruturais para a realização da Copa do Mundo de 2014, como, por exemplo, as dimensões do campo retangular. Para se adaptar aos padrões da Fifa, as dimensões do campo foram reduzidas de 110 m × 75 m para 105 m × 68 m. Em quantos metros quadrados a área do campo do Maracanã foi reduzida?",
      options: ["24", "35", "555", "1 110", "1 145"],
      correct: 3,
      objective: "Em quantos metros quadrados a área do campo foi reduzida?",
      data: "110 m × 75 m; 105 m × 68 m.",
      clue: "A palavra “reduzida” indica comparar a área antiga com a nova.",
      trap: "Subtrair apenas os comprimentos dos lados, em vez de comparar as áreas.",
      strategy: "Calcular as duas áreas retangulares e fazer área antiga − área nova.",
      understand: "O campo continua sendo retangular, mas suas duas dimensões diminuíram. A pergunta não quer saber quantos metros cada lado perdeu: quer saber quantos metros quadrados de área deixaram de existir.",
      notice: "Precisamos comparar duas áreas. Primeiro calculamos a área antes da mudança. Depois calculamos a área depois da mudança. A redução é a diferença entre elas.",
      trapExplanation: "Fazer 110 − 105 e 75 − 68 produz 5 m e 7 m, mas esses valores representam reduções de comprimento, não redução de área. Como a resposta é pedida em m², precisamos usar área.",
      setup: "Para retângulos, A = base × altura. Calculamos a área antiga e a nova e depois subtraímos.",
      calculation: [
        "A antiga = 110 × 75 = 8 250 m²",
        "A nova = 105 × 68 = 7 140 m²",
        "Redução = 8 250 − 7 140 = 1 110 m²"
      ],
      result: "1 110 m² — alternativa D.",
      wrong: ["A (24) e B (35) não representam a diferença entre as áreas dos dois retângulos.", "C (555) corresponde a apenas metade da redução correta.", "E (1 145) aparece por erro de multiplicação ou subtração das áreas."],
      correctWhy: "A área antiga era 8 250 m² e a nova é 7 140 m². A diferença entre essas duas áreas é exatamente 1 110 m².",
      menteTip: "Se a unidade da resposta for m², pense em área. Não compare apenas os lados: compare o espaço interno das figuras."
    },
    2: {
      id: 2,
      examNumber: 139,
      category: "Geometria",
      topic: "Comprimento da circunferência e cobertura de percurso",
      year: 2025,
      stars: 2,
      text: "Uma ciclovia circular de raio 1 km deve ser protegida por policiais, cada um alcançando pontos até 200 m de sua posição. Qual é a quantidade mínima necessária?",
      detail: "No entorno de uma lagoa circular, cujo raio mede 1 km, há uma ciclovia. A prefeitura planeja alocar policiais em posições estratégicas para patrulhar essa ciclovia. Um ponto é considerado protegido se houver pelo menos um policial a, no máximo, 200 m de distância daquele ponto, posicionado sobre a ciclovia. Desconsidere a largura da pista da ciclovia e utilize 3 como aproximação para π. Nessas condições, a quantidade mínima necessária de policiais a serem alocados ao longo dessa ciclovia para torná-la protegida é",
      options: ["4", "8", "15", "30", "60"],
      correct: 2,
      objective: "Quantidade mínima necessária de policiais.",
      data: "Raio = 1 km; alcance = no máximo 200 m; use π ≈ 3.",
      clue: "Cada policial alcança 200 m para um lado e 200 m para o outro.",
      trap: "Dividir o percurso total por 200 m e esquecer o alcance dos dois lados.",
      strategy: "Calcular a circunferência e dividir pelo trecho total protegido por cada policial.",
      understand: "A ciclovia acompanha o contorno da lagoa. Portanto, não queremos a área do círculo; queremos o comprimento da circunferência.",
      notice: "Cada policial cobre um trecho total de 400 m da ciclovia: 200 m para cada lado. Depois basta descobrir quantos trechos de 400 m são necessários para cobrir todo o contorno.",
      trapExplanation: "Se dividirmos 6 000 por 200, encontramos 30, que é uma alternativa. Esse erro acontece quando ignoramos que o policial protege 200 m em cada direção.",
      setup: "Usamos C = 2πr para descobrir o comprimento da ciclovia. Depois convertemos quilômetros em metros e dividimos por 400 m.",
      calculation: ["C = 2 × 3 × 1 = 6 km", "6 km = 6 000 m", "Alcance por policial = 200 + 200 = 400 m", "6 000 ÷ 400 = 15"],
      result: "15 policiais — alternativa C.",
      wrong: ["A (4) e B (8): cada policial teria de cobrir muito mais do que 400 m.", "D (30): resulta de dividir por 200 m e esquecer o alcance para os dois lados.", "E (60): dobra ainda mais a quantidade necessária."],
      correctWhy: "Quinze policiais cobrindo 400 m cada totalizam exatamente os 6 000 m da ciclovia.",
      menteTip: "Quando alguém alcança uma distância “para os dois lados”, some os dois alcances antes de dividir o percurso total.",
      visual: "circle"
    },
    3: {
      id: 3,
      examNumber: 155,
      category: "Geometria",
      topic: "Área de setor circular e comparação",
      year: 2024,
      stars: 3,
      text: "Cinco sensores têm diferentes ângulos e raios de cobertura. Qual deles cobre no mínimo 70 m² com o menor preço possível?",
      detail: "Um proprietário pretende instalar um sensor de presença para a proteção de seu imóvel. A área de cobertura tem forma de setor circular e depende do ângulo α e do raio R. Quanto maior essa área, maior o preço do sensor. Os tipos disponíveis são: I: α = 15° e R = 20 m; II: α = 30° e R = 22 m; III: α = 40° e R = 12 m; IV: α = 60° e R = 16 m; V: α = 90° e R = 10 m. O proprietário quer um sensor que cubra, no mínimo, 70 m², com o menor preço possível. Use 3 como valor aproximado para π. O proprietário deverá adquirir o sensor do tipo",
      options: ["I", "II", "III", "IV", "V"],
      correct: 4,
      objective: "Cobrir, no mínimo, uma área de 70 m², com o menor preço possível.",
      data: "Os cinco valores de α e R; use π ≈ 3.",
      clue: "Quanto maior a área, maior o preço.",
      trap: "Escolher apenas o maior raio ou o maior ângulo sem calcular a área do setor.",
      strategy: "Calcular a área de cada setor e escolher a menor área que ainda seja pelo menos 70 m².",
      understand: "Cada sensor cobre apenas uma parte de um círculo. Não basta olhar para o raio: o ângulo também controla o tamanho da região coberta. Como o preço cresce com a área, queremos a menor cobertura que ainda atenda aos 70 m².",
      notice: "Como 360° corresponde ao círculo inteiro, um setor de ângulo α ocupa a fração α/360 da área total do círculo. Por isso usamos A = (α/360)·πr².",
      trapExplanation: "O sensor II tem raio 22 m, o maior de todos, mas isso não significa automaticamente que ele seja a melhor escolha. A área depende do raio e do ângulo, e não queremos a maior cobertura: queremos a menor que ainda seja suficiente.",
      setup: "Calculamos a área de cobertura de cada sensor com π ≈ 3 e comparamos os resultados com 70 m².",
      calculation: ["I: (15/360) × 3 × 20² = 50 m² — não atende", "II: (30/360) × 3 × 22² = 121 m² — atende", "III: (40/360) × 3 × 12² = 48 m² — não atende", "IV: (60/360) × 3 × 16² = 128 m² — atende", "V: (90/360) × 3 × 10² = 75 m² — atende"],
      result: "Entre II, IV e V, o tipo V tem a menor área que atende ao mínimo: 75 m². Alternativa E.",
      wrong: ["I e III têm área menor que 70 m² e não cumprem a exigência mínima.", "II e IV atendem, mas cobrem áreas maiores que o tipo V e, pelo enunciado, custam mais."],
      correctWhy: "O tipo V cobre 75 m², ultrapassando o mínimo de 70 m² com a menor área entre os sensores que atendem à exigência. Logo, é o de menor preço possível.",
      menteTip: "Quando a questão disser “no mínimo” e depois pedir “menor custo”, procure a opção que ultrapassa a exigência pela menor margem possível — desde que o custo aumente com a grandeza indicada.",
      visual: "sector"
    },
    4: {
      id: 4,
      examNumber: 150,
      category: "Geometria",
      topic: "Diâmetro, espaçamento e otimização de custo",
      year: 2024,
      stars: 4,
      text: "Uma sala de 3 m por 6 m será dividida por colunas cilíndricas, com vãos de no máximo 15 cm. Qual loja oferece o menor custo total?",
      detail: "Uma sala com piso no formato retangular, com lados de medidas 3 m e 6 m, será dividida em dois ambientes. Para isso, serão utilizadas colunas em formato cilíndrico, dispostas perpendicularmente ao piso. Os centros dessas colunas estarão sobre uma reta paralela aos lados de menor medida do piso da sala. Os vãos entre duas colunas e entre uma coluna e a parede não poderão ser superiores a 15 cm. Foram feitos orçamentos em cinco lojas, com diferentes raios e preços por unidade. A compra será realizada na loja cujo orçamento resulte no menor valor total possível. A compra será realizada na loja",
      options: ["I", "II", "III", "IV", "V"],
      correct: 2,
      objective: "Menor valor total possível; escolher a loja.",
      data: "Sala de 3 m × 6 m; vãos ≤ 15 cm; raio e preço por unidade de cada loja.",
      clue: "A reta é paralela aos lados de menor medida; colunas vistas de cima ocupam um diâmetro.",
      trap: "Usar 6 m em vez de 3 m; usar o raio como largura da coluna; comparar apenas o preço unitário.",
      strategy: "Para cada loja, calcular a menor quantidade de colunas e depois o custo total.",
      understand: "A barreira de colunas é paralela aos lados de menor medida. Portanto, ela atravessa 3 m da sala, isto é, 300 cm. Como as colunas são circulares vistas de cima, a largura ocupada por cada uma é seu diâmetro, d = 2r.",
      notice: "Com n colunas, existem n + 1 vãos: um antes da primeira coluna, um entre cada par e um depois da última. Para usar o menor número de colunas, podemos considerar cada vão no limite máximo permitido, 15 cm.",
      trapExplanation: "A questão combina Geometria com otimização. O menor preço por unidade não garante o menor custo total. Uma coluna mais barata pode exigir muito mais unidades.",
      setup: "Para cada loja, buscamos o menor inteiro n que satisfaça n·d + (n+1)·15 ≥ 300. Em seguida, multiplicamos n pelo preço unitário.",
      calculation: ["Loja I: d = 10 cm; 12 colunas; 12 × R$ 60 = R$ 720", "Loja II: d = 20 cm; 9 colunas; 9 × R$ 70 = R$ 630", "Loja III: d = 24 cm; 8 colunas; 8 × R$ 75 = R$ 600", "Loja IV: d = 30 cm; 7 colunas; 7 × R$ 90 = R$ 630", "Loja V: d = 40 cm; 6 colunas; 6 × R$ 120 = R$ 720"],
      result: "O menor custo total é R$ 600, na Loja III — alternativa C.",
      wrong: ["Loja I: R$ 720.", "Loja II: R$ 630.", "Loja IV: R$ 630.", "Loja V: R$ 720."],
      correctWhy: "A Loja III é a única que combina quantidade necessária e preço unitário de modo a produzir o menor valor total: R$ 600.",
      menteTip: "Em problemas de orçamento, não escolha pela coluna “preço por unidade”. Primeiro descubra quantas unidades são necessárias e só depois compare os totais.",
      visual: "room",
      stores: [["I", "5", "60"], ["II", "10", "70"], ["III", "12", "75"], ["IV", "15", "90"], ["V", "20", "120"]]
    },
    5: {
      id: 5,
      examNumber: 175,
      category: "Geometria",
      topic: "Cilindro: superfície lateral, raio e volume",
      year: 2024,
      stars: 5,
      text: "Uma folha de alumínio de 10 cm por 20 cm forma a superfície lateral de um cilindro. Entre as duas montagens possíveis, qual tem maior volume?",
      detail: "Uma indústria dispõe de folhas de alumínio retangulares, de dimensões 10 cm por 20 cm. Cada folha é utilizada para formar a superfície lateral de uma embalagem em formato de cilindro circular reto, que depois recebe fundo e tampa circulares. Dependendo de qual extensão da folha é utilizada como altura, há duas opções de embalagem. Dentre essas duas embalagens, a de maior capacidade apresentará volume, em centímetro cúbico, igual a",
      options: ["4 000π", "2 000π", "4 000/π", "1 000/π", "500/π"],
      correct: 3,
      objective: "A embalagem de maior capacidade.",
      data: "Folha de 10 cm × 20 cm; superfície lateral; cilindro circular reto.",
      clue: "Um lado do retângulo vira a altura e o outro vira o comprimento da circunferência.",
      trap: "Usar 10 cm ou 20 cm diretamente como raio; achar que as duas embalagens têm o mesmo volume por usarem a mesma folha.",
      strategy: "Identificar h e C em cada montagem, achar r por C = 2πr e comparar os volumes.",
      understand: "A folha não forma a base do cilindro: ela forma apenas a superfície lateral. Quando enrolamos o retângulo, uma de suas medidas vira a altura do cilindro e a outra contorna a base, tornando-se o comprimento da circunferência.",
      notice: "As duas embalagens usam a mesma área lateral, mas possuem raios e alturas diferentes. Como o volume usa r², mudar qual lado vira a circunferência altera bastante a capacidade.",
      trapExplanation: "Os valores 10 e 20 cm não são raios. Eles representam altura ou comprimento da circunferência, dependendo da montagem. Primeiro precisamos encontrar o raio com C = 2πr.",
      setup: "Na embalagem 1, h = 20 cm e C = 10 cm. Na embalagem 2, h = 10 cm e C = 20 cm. Calculamos o raio de cada base e depois usamos V = πr²h.",
      calculation: ["Embalagem 1: 10 = 2πr ⇒ r = 5/π; V₁ = π·(5/π)²·20 = 500/π cm³", "Embalagem 2: 20 = 2πr ⇒ r = 10/π; V₂ = π·(10/π)²·10 = 1 000/π cm³"],
      result: "1 000/π cm³ — alternativa D.",
      wrong: ["A e B deixam π multiplicando como se 10 ou 20 fossem diretamente o raio.", "C apresenta um valor quatro vezes maior que o volume correto da embalagem 2.", "E corresponde ao volume da embalagem 1, que é a menor das duas."],
      correctWhy: "Ao usar 20 cm como circunferência, o segundo cilindro obtém um raio duas vezes maior que o primeiro. Mesmo tendo metade da altura, o raio aparece ao quadrado no volume e faz a capacidade aumentar para 1 000/π cm³.",
      menteTip: "Quando um retângulo é enrolado para formar um cilindro, pergunte: qual lado virou a altura e qual lado virou a circunferência? Só depois procure o raio.",
      visual: "cylinder"
    }
  };

  function migrateOldGeometryAnswers() {
    const migrationKey = "mente-geometria-final-pdf-v1";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      [1, 2, 3, 4, 5].forEach((id) => delete answers[id]);
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch {
      localStorage.removeItem("mente-answers");
    }
    localStorage.setItem(migrationKey, "true");
  }

  function applyCatalog() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;
    Object.values(geometryQuestions).forEach((official) => {
      const index = questions.findIndex((item) => item.id === official.id);
      if (index >= 0) Object.assign(questions[index], official, { visual: null });
    });
    if (typeof categoryColors !== "undefined") categoryColors.Geometria = SUBJECT_COLOR;
    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#geometry-final-pdf-styles")) return;
    const style = document.createElement("style");
    style.id = "geometry-final-pdf-styles";
    style.textContent = `
      .geometry-final{--geometry:${SUBJECT_COLOR}}
      .geometry-final .portal-hero{background:linear-gradient(135deg,#b64d00,var(--geometry) 70%,#ff9a3d)}
      .geometry-final .portal-card{border-top:4px solid var(--geometry)}
      .geometry-final__source{margin:18px 0 0;text-align:center;font-size:11px;color:var(--muted)}
      .geometry-final__source a{color:#526b9d;font-weight:700}
      .geometry-final__marks{display:grid;gap:8px;margin:20px 0}
      .geometry-final__mark{padding:11px 13px;border-radius:10px;border:1px solid #e5e7eb;font-size:13px;line-height:1.5}
      .geometry-final__mark strong{display:inline-block;margin-right:5px}
      .geometry-final__mark--objective{background:#eff6ff;border-color:#dbeafe}.geometry-final__mark--objective strong{color:#1D4EDB}
      .geometry-final__mark--data{background:#f0fdf4;border-color:#dcfce7}.geometry-final__mark--data strong{color:#15803D}
      .geometry-final__mark--clue{background:#fff7ed;border-color:#ffedd5}.geometry-final__mark--clue strong{color:#C26A00}
      .geometry-final__mark--trap{background:#fef2f2;border-color:#fee2e2}.geometry-final__mark--trap strong{color:#DC2626}
      .geometry-final__mark--strategy{background:#f5f3ff;border-color:#ede9fe}.geometry-final__mark--strategy strong{color:#7C3AED}
      .geometry-final__steps{display:grid;gap:14px;margin:22px 0}
      .geometry-final__step{padding:16px 17px;border:1px solid #e4e9f1;border-radius:13px;background:#fff}
      .geometry-final__step h3{margin:0 0 8px;color:#b45400;font-size:16px}.geometry-final__step p{margin:0;color:#526174;line-height:1.65}
      .geometry-final__calculation{display:grid;gap:7px;margin:10px 0 0;padding:12px;border-radius:10px;background:#fff8f1;color:#35445d;font-size:13px;line-height:1.55}
      .geometry-final__result{margin-top:10px;padding:11px 13px;border-radius:9px;background:#f5f3ff;color:#5b21b6;font-weight:800}
      .geometry-final__wrong{margin:8px 0 0;padding-left:20px;color:#526174;line-height:1.6}
      .geometry-final__tip{margin-top:16px;padding:14px 16px;border-left:4px solid var(--geometry);border-radius:10px;background:#fff7ed;color:#77410c;line-height:1.6}
      .geometry-final__visual{margin:20px auto;padding:14px;border:1px solid #e2e8f0;border-radius:14px;background:#fbfcfe;max-width:560px;text-align:center}
      .geometry-final__visual svg{display:block;width:min(430px,100%);height:auto;margin:auto}.geometry-final__visual figcaption{margin-top:8px;color:var(--muted);font-size:11px}
      .geometry-final__table{width:min(560px,100%);margin:18px auto;border-collapse:collapse;font-size:12px}.geometry-final__table th,.geometry-final__table td{padding:8px 10px;border:1px solid #cfd8e5;text-align:center}.geometry-final__table th{background:#fff3e8;color:#934600}
      .geometry-final .portal-button{background:var(--geometry)}.geometry-final .portal-button:hover{background:#dc6900}
    `;
    document.head.appendChild(style);
  }

  function visualFor(question) {
    if (question.visual === "circle") return `<figure class="geometry-final__visual"><svg viewBox="0 0 420 250" role="img" aria-label="Lagoa circular e trecho de alcance de um policial"><circle cx="210" cy="125" r="92" fill="#39afe1" stroke="#27384f" stroke-width="3"/><circle cx="210" cy="125" r="105" fill="none" stroke="#8390a3" stroke-width="12"/><circle cx="287" cy="59" r="7" fill="#f2c94c" stroke="#334155" stroke-width="2"/><path d="M278 49 A105 105 0 0 1 310 82" fill="none" stroke="#555" stroke-width="14" opacity=".55"/><text x="296" y="49" font-size="14" fill="#334155">200 m</text><text x="318" y="77" font-size="14" fill="#334155">200 m</text><text x="296" y="61" font-size="13" font-weight="700" fill="#334155">P</text></svg><figcaption>Cada policial protege 200 m em cada direção ao longo da ciclovia.</figcaption></figure>`;
    if (question.visual === "sector") return `<figure class="geometry-final__visual"><svg viewBox="0 0 430 260" role="img" aria-label="Setor circular com ângulo alfa e raio R"><path d="M215 40 L70 180 A175 175 0 0 0 360 180 Z" fill="#79b7dd" stroke="#334155" stroke-width="2"/><line x1="215" y1="40" x2="70" y2="180" stroke="#334155"/><line x1="215" y1="40" x2="360" y2="180" stroke="#334155"/><text x="204" y="78" font-size="18" fill="#334155">α</text><text x="320" y="105" font-size="18" fill="#334155">R</text><circle cx="215" cy="40" r="5" fill="#334155"/></svg><figcaption>A área do setor depende simultaneamente do ângulo α e do raio R.</figcaption></figure>`;
    if (question.visual === "room") return `<figure class="geometry-final__visual"><svg viewBox="0 0 500 270" role="img" aria-label="Sala de seis por três metros com colunas alinhadas"><rect x="70" y="55" width="360" height="170" fill="#dff1df" stroke="#475569" stroke-width="2"/><text x="235" y="38" font-size="16" fill="#334155">6 m</text><text x="445" y="145" font-size="16" fill="#334155">3 m</text><g fill="#2f89c8" stroke="#1d5e90">${Array.from({length:8},(_,i)=>`<circle cx="250" cy="${72+i*20}" r="7"/>`).join("")}</g></svg><figcaption>A divisória atravessa o lado de 3 m; cada coluna ocupa seu diâmetro.</figcaption></figure>`;
    if (question.visual === "cylinder") return `<figure class="geometry-final__visual"><svg viewBox="0 0 500 260" role="img" aria-label="Folha retangular de dez por vinte centímetros sendo enrolada em duas orientações"><rect x="35" y="70" width="160" height="90" rx="2" fill="#e9eef5" stroke="#526174" stroke-width="2"/><text x="85" y="62" font-size="14" fill="#334155">20 cm</text><text x="3" y="120" font-size="14" fill="#334155">10 cm</text><path d="M215 115 H280" stroke="#FF7A00" stroke-width="3"/><path d="M270 105 L285 115 L270 125" fill="none" stroke="#FF7A00" stroke-width="3"/><ellipse cx="355" cy="72" rx="55" ry="18" fill="#eef3f8" stroke="#526174" stroke-width="2"/><rect x="300" y="72" width="110" height="110" fill="#eef3f8" stroke="#526174" stroke-width="2"/><ellipse cx="355" cy="182" rx="55" ry="18" fill="#e1e9f3" stroke="#526174" stroke-width="2"/><text x="318" y="225" font-size="13" fill="#334155">C = 10 ou 20 cm</text></svg><figcaption>Um lado vira a altura h e o outro vira a circunferência C da base.</figcaption></figure>`;
    return "";
  }

  function storesTable(question) {
    if (!question.stores) return "";
    return `<table class="geometry-final__table" aria-label="Orçamentos das cinco lojas"><thead><tr><th>Loja</th><th>Raio (cm)</th><th>Preço/unidade (R$)</th></tr></thead><tbody>${question.stores.map(([a,b,c]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join("")}</tbody></table>`;
  }

  function marks(question) {
    return `<div class="geometry-final__marks">
      <div class="geometry-final__mark geometry-final__mark--objective"><strong>Objetivo:</strong>${question.objective}</div>
      <div class="geometry-final__mark geometry-final__mark--data"><strong>Dados importantes:</strong>${question.data}</div>
      <div class="geometry-final__mark geometry-final__mark--clue"><strong>Pista de interpretação:</strong>${question.clue}</div>
      <div class="geometry-final__mark geometry-final__mark--trap"><strong>Armadilha:</strong>${question.trap}</div>
      <div class="geometry-final__mark geometry-final__mark--strategy"><strong>Estratégia:</strong>${question.strategy}</div>
    </div>`;
  }

  function steps(question) {
    return `<div class="geometry-final__steps">
      <section class="geometry-final__step"><h3>1. Primeiro: vamos entender o enunciado</h3><p>${question.understand}</p></section>
      <section class="geometry-final__step"><h3>2. O que precisamos perceber?</h3><p>${question.notice}</p></section>
      <section class="geometry-final__step"><h3>3. Onde está a armadilha?</h3><p>${question.trapExplanation}</p></section>
      <section class="geometry-final__step"><h3>4. Agora vamos montar a resolução</h3><p>${question.setup}</p></section>
      <section class="geometry-final__step"><h3>5. Resolução matemática</h3><div class="geometry-final__calculation">${question.calculation.map((line) => `<div>${line}</div>`).join("")}</div><div class="geometry-final__result">${question.result}</div></section>
      <section class="geometry-final__step"><h3>6. Por que as alternativas erradas estão erradas?</h3><ul class="geometry-final__wrong">${question.wrong.map((line) => `<li>${line}</li>`).join("")}</ul></section>
      <section class="geometry-final__step"><h3>7. Por que a alternativa correta está correta?</h3><p>${question.correctWhy}</p></section>
      <aside class="geometry-final__tip"><strong>8. Dica M.E.N.T.E</strong><br>${question.menteTip}</aside>
    </div>`;
  }

  function renderDetail(question) {
    const root = document.querySelector("#question-content");
    if (!root) return;
    addStyles();
    root.classList.add("geometry-final");

    const answersKey = "mente-answers";
    const pointsKey = "mente-points";
    let storedAnswers = {};
    try { storedAnswers = JSON.parse(localStorage.getItem(answersKey) || "{}"); } catch { storedAnswers = {}; }
    const previous = storedAnswers[question.id];

    const alternatives = `<fieldset class="answer-options" ${previous ? "disabled" : ""}><legend>Escolha uma alternativa</legend>${question.options.map((option,index)=>`<label class="${previous?.selected===index?"is-saved":""}"><input type="radio" name="geometry-final-answer" value="${index}" ${previous?.selected===index?"checked":""}><strong>${String.fromCharCode(65+index)}</strong><span>${option}</span></label>`).join("")}</fieldset>`;

    root.innerHTML = `<section class="portal-hero"><h2>Questão ${question.examNumber} · ENEM ${question.year}</h2><p>Nível M.E.N.T.E: ${question.stars} de 5 · ${question.topic}</p></section><article class="portal-card"><div class="question-detail__meta"><span>Geometria</span><span>${question.topic}</span><span>ENEM ${question.year}</span><span>${"★".repeat(question.stars)}${"☆".repeat(5-question.stars)}</span></div><p class="question-statement">${question.detail}</p>${visualFor(question)}${storesTable(question)}${marks(question)}${alternatives}<button class="portal-button" id="geometry-final-complete" ${previous?"disabled":""}>${previous?"Questão já respondida":"Responder e concluir"}</button><div id="geometry-final-feedback" class="answer-feedback" role="status"></div>${steps(question)}<p class="geometry-final__source">Questão ${question.examNumber} · ENEM ${question.year} · <a href="${INEP_SOURCE_URL}" target="_blank" rel="noopener">Provas e gabaritos do INEP</a></p></article>`;

    const feedback = document.querySelector("#geometry-final-feedback");
    const showResult = (answer) => {
      if (!feedback) return;
      if (answer.correct) feedback.innerHTML = `<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>${question.correctWhy}</p></div>`;
      else feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${question.trapExplanation}</p><p>${question.setup}</p><p class="result-box__answer"><strong>Resposta correta:</strong> ${String.fromCharCode(65+question.correct)} — ${question.options[question.correct]}</p></div>`;
    };
    if (previous) showResult(previous);

    const button = document.querySelector("#geometry-final-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="geometry-final-answer"]:checked');
      if (!selected) { feedback.innerHTML = '<p class="form-error">Escolha uma alternativa antes de concluir.</p>'; return; }
      const selectedIndex = Number(selected.value);
      const isCorrect = selectedIndex === question.correct;
      storedAnswers[question.id] = { selected: selectedIndex, correct: isCorrect, answeredAt: new Date().toISOString() };
      localStorage.setItem(answersKey, JSON.stringify(storedAnswers));
      if (isCorrect) {
        const total = Number(localStorage.getItem(pointsKey) || 0) + 10;
        localStorage.setItem(pointsKey, total);
        const points = document.querySelector("#points");
        if (points) points.textContent = total;
      }
      document.querySelectorAll('input[name="geometry-final-answer"]').forEach((input)=>{input.disabled=true;});
      button.disabled = true;
      button.textContent = "Questão já respondida";
      showResult(storedAnswers[question.id]);
    };
  }

  migrateOldGeometryAnswers();
  if (document.querySelector("#questions-grid")) applyCatalog();
  if (document.querySelector("#question-content")) {
    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    const question = selected ? geometryQuestions[selected.id] : null;
    if (question) renderDetail(question);
  }
})();
