"use strict";

(() => {
  const functionOfficialQuestions = {
    6: {
      id: 6,
      examNumber: 145,
      category: "Funções",
      topic: "Leitura do comportamento de uma função por trechos",
      year: 2025,
      stars: 1,
      text: "A partir do instante t1, em que se inicia a prática meditativa, como se comporta a frequência respiratória em relação ao tempo?",
      detail: "Pesquisas na área de neurobiologia confirmam que a prática meditativa é responsável por diminuir consideravelmente a frequência respiratória para praticantes avançados, que, após iniciarem a meditação, têm suas frequências respiratórias reduzidas até se estabilizarem em um nível mais baixo. O gráfico apresenta a relação da frequência respiratória, em incursões de respirações por minuto (rpm), em relação ao tempo, em minuto, de um praticante avançado, em que f1 representa a frequência no instante t1, no qual se inicia a prática meditativa; e f2, a frequência no instante t2, a partir do qual esta se estabiliza durante a meditação. A partir do instante t1, em que se inicia a prática meditativa, o comportamento da frequência respiratória, em relação ao tempo,",
      source: "Disponível em: www.redepsi.com.br. Acesso em: 3 dez. 2018 (adaptado).",
      options: [
        "mantém-se constante.",
        "é diretamente proporcional ao tempo.",
        "é inversamente proporcional ao tempo.",
        "diminui até o instante t2, a partir do qual se torna constante.",
        "diminui de forma proporcional ao tempo, tanto entre t1 e t2 quanto após t2."
      ],
      correct: 3,
      visual: "meditation",
      explanationHtml: `
        <div class="mente-solution">
          <h3>1. Primeiro: vamos entender o enunciado</h3>
          <p>A questão não pede nenhuma conta. Ela quer que o estudante leia o gráfico e descreva o comportamento da frequência respiratória depois que a meditação começa.</p>
          <h3>2. O que precisamos perceber?</h3>
          <p>Entre t1 e t2, a curva desce: a frequência respiratória diminui. A partir de t2, a curva fica horizontal: a frequência deixa de diminuir e permanece constante em f2.</p>
          <h3>3. Onde está a armadilha?</h3>
          <p>Palavras como “diretamente proporcional” e “inversamente proporcional” podem parecer sofisticadas, mas o gráfico não mostra nenhuma dessas relações. Também não podemos dizer que a frequência continua diminuindo depois de t2, porque o gráfico fica horizontal.</p>
          <h3>4. Agora vamos montar a resolução</h3>
          <p>Basta traduzir cada trecho do gráfico para palavras e comparar essa descrição com as alternativas.</p>
          <h3>5. Resolução matemática</h3>
          <p><strong>Dados:</strong> gráfico da frequência respiratória; instantes t1 e t2; níveis f1 e f2.</p>
          <p><strong>Precisamos descobrir:</strong> descrever o comportamento da frequência após t1.</p>
          <p><strong>Estratégia:</strong> ler a inclinação da curva em cada intervalo.</p>
          <p><strong>Cálculo / leitura:</strong><br>De t1 até t2: a curva é decrescente.<br>Depois de t2: a curva é horizontal, então a frequência é constante.</p>
          <p><strong>Resultado:</strong> diminui até t2 e, depois, permanece constante — alternativa D.</p>
          <h3>6. Por que as alternativas erradas estão erradas?</h3>
          <ul>
            <li><strong>A:</strong> seria verdadeira apenas depois de t2. Entre t1 e t2 a frequência ainda está diminuindo.</li>
            <li><strong>B:</strong> uma relação diretamente proporcional não corresponde ao gráfico apresentado e, além disso, a frequência não aumenta com o tempo.</li>
            <li><strong>C:</strong> uma relação inversamente proporcional continuaria variando; o gráfico mostra estabilização após t2.</li>
            <li><strong>E:</strong> depois de t2 não existe mais diminuição. O trecho é horizontal.</li>
          </ul>
          <h3>7. Por que a alternativa correta está correta?</h3>
          <p>A alternativa D descreve exatamente os dois trechos mostrados: queda entre t1 e t2 e estabilização a partir de t2.</p>
          <h3>8. Dica M.E.N.T.E</h3>
          <p>Em gráficos, leia um intervalo de cada vez. Curva descendo significa diminuição; trecho horizontal significa valor constante.</p>
        </div>`
    },
    7: {
      id: 7,
      examNumber: 177,
      category: "Funções",
      topic: "Função afim: custo fixo e custo variável",
      year: 2024,
      stars: 2,
      text: "Uma empresa tem custo fixo e custo variável proporcional ao número de mochilas. Qual será o custo total para produzir 80 mochilas?",
      detail: "Uma empresa produz mochilas escolares sob encomenda. Essa empresa tem um custo total de produção, composto por um custo fixo, que não depende do número de mochilas, mais um custo variável, que é proporcional ao número de mochilas produzidas. O custo total cresce de forma linear, e a tabela apresenta esse custo para três quantidades de mochilas produzidas. O custo total, em real, para a produção de 80 mochilas será",
      options: ["2 400,00", "2 520,00", "2 550,00", "2 700,00", "2 800,00"],
      correct: 2,
      visual: "backpackTable",
      explanationHtml: `
        <div class="mente-solution">
          <h3>1. Primeiro: vamos entender o enunciado</h3>
          <p>O custo total tem duas partes. Uma existe mesmo antes de produzir qualquer mochila; a outra aumenta conforme a quantidade produzida. Isso é exatamente a estrutura de uma função afim.</p>
          <h3>2. O que precisamos perceber?</h3>
          <p>A diferença entre os custos de duas linhas da tabela revela quanto o custo aumenta por mochila. Depois, usamos um dos pontos da tabela para descobrir o valor fixo.</p>
          <h3>3. Onde está a armadilha?</h3>
          <p>Se o estudante fizer apenas uma regra de três entre quantidade e custo, estará supondo que o custo começa em zero. O enunciado avisa que existe um custo fixo, então essa proporcionalidade direta não vale.</p>
          <h3>4. Agora vamos montar a resolução</h3>
          <p>Representamos o custo por <strong>C(x) = ax + b</strong>, em que a é o custo variável por mochila e b é o custo fixo.</p>
          <h3>5. Resolução matemática</h3>
          <p><strong>Dados:</strong> C(30) = 1 050; C(50) = 1 650; C(100) = 3 150.</p>
          <p><strong>Precisamos descobrir:</strong> C(80).</p>
          <p><strong>Estratégia:</strong> calcular a taxa a, encontrar b e substituir x = 80.</p>
          <div class="solution-math">a = (1 650 − 1 050) / (50 − 30) = 600 / 20 = 30<br>1 050 = 30·30 + b<br>b = 150<br>C(x) = 30x + 150<br>C(80) = 30·80 + 150 = 2 550</div>
          <p><strong>Resultado:</strong> R$ 2 550,00 — alternativa C.</p>
          <h3>6. Por que as alternativas erradas estão erradas?</h3>
          <ul>
            <li><strong>A (2 400):</strong> é 30 × 80. O estudante encontrou corretamente o custo variável por mochila, mas esqueceu os R$ 150,00 de custo fixo.</li>
            <li><strong>B (2 520):</strong> pode surgir ao fazer 80% de R$ 3 150,00, tratando a relação como proporcional direta e ignorando o custo fixo.</li>
            <li><strong>D (2 700):</strong> indica que a taxa de variação ou o custo fixo foi calculado maior do que o valor mostrado pela tabela.</li>
            <li><strong>E (2 800):</strong> corresponde a usar R$ 35,00 por mochila, obtido de 1 050 ÷ 30, como se todo o custo fosse variável. Esse valor médio inclui parte do custo fixo.</li>
          </ul>
          <h3>7. Por que a alternativa correta está correta?</h3>
          <p>A função que reproduz todos os valores da tabela é C(x) = 30x + 150. Para 80 mochilas, ela fornece R$ 2 550,00.</p>
          <h3>8. Dica M.E.N.T.E</h3>
          <p>Quando houver “valor fixo + valor por unidade”, não use regra de três direta. Procure a taxa de variação e o valor inicial.</p>
        </div>`
    },
    8: {
      id: 8,
      examNumber: 146,
      category: "Funções",
      topic: "Função quadrática e valor máximo",
      year: 2024,
      stars: 3,
      text: "Um fazendeiro quer construir um galinheiro retangular com telas de custos diferentes e área máxima. Qual será a medida do maior lado?",
      detail: "Um fazendeiro pretende construir um galinheiro ocupando uma região plana de formato retangular, com lados de comprimentos L metro e C metro. Os lados serão cercados por telas de tipos diferentes. Nos lados de comprimento L metro, será utilizada uma tela cujo metro linear custa R$ 20,00, enquanto, nos outros dois lados, uma que custa R$ 15,00. O fazendeiro quer gastar, no máximo, R$ 6 000,00 na compra de toda a tela necessária para o galinheiro, e deseja que o galinheiro tenha a maior área possível. Qual será a medida, em metro, do maior lado do galinheiro?",
      options: ["85", "100", "175", "200", "350"],
      correct: 1,
      visual: null,
      explanationHtml: `
        <div class="mente-solution">
          <h3>1. Primeiro: vamos entender o enunciado</h3>
          <p>A questão mistura Geometria com Funções. A figura é um retângulo, mas o ponto principal é descobrir quais dimensões fazem a área ser máxima respeitando um limite de gasto.</p>
          <h3>2. O que precisamos perceber?</h3>
          <p>Como há dois lados de comprimento L e dois de comprimento C, o custo total é 40L + 30C. Para obter a maior área possível, usamos todo o orçamento disponível e transformamos uma das medidas em função da outra.</p>
          <h3>3. Onde está a armadilha?</h3>
          <p>Um quadrado maximiza a área quando todos os lados têm o mesmo custo por metro. Aqui os lados L e C usam telas de preços diferentes. Por isso, não podemos simplesmente impor L = C.</p>
          <h3>4. Agora vamos montar a resolução</h3>
          <p>Da restrição 40L + 30C = 6 000, isolamos C. Depois substituímos em A = L·C e encontramos o vértice da parábola.</p>
          <h3>5. Resolução matemática</h3>
          <p><strong>Dados:</strong> 40L + 30C = 6 000 e A = L·C.</p>
          <p><strong>Precisamos descobrir:</strong> as dimensões que maximizam a área e, depois, o maior lado.</p>
          <p><strong>Estratégia:</strong> transformar A em função de L e usar o vértice.</p>
          <div class="solution-math">30C = 6 000 − 40L<br>C = 200 − (4/3)L<br>A(L) = L[200 − (4/3)L]<br>A(L) = 200L − (4/3)L²<br>Lᵥ = −200 / [2·(−4/3)] = 75<br>C = 200 − (4/3)·75 = 100</div>
          <p><strong>Resultado:</strong> os lados medem 75 m e 100 m; o maior lado mede 100 m — alternativa B.</p>
          <h3>6. Por que as alternativas erradas estão erradas?</h3>
          <ul>
            <li><strong>A (85):</strong> aparece aproximadamente quando se supõe L = C e se divide o orçamento pelo custo dos quatro lados. Essa suposição ignora que as telas têm preços diferentes.</li>
            <li><strong>C (175):</strong> pode surgir ao dividir 6 000 por 20 + 15, esquecendo que existem dois lados de cada tipo e sem maximizar a área.</li>
            <li><strong>D (200):</strong> é o valor de C quando L = 0. Nesse caso não existe um retângulo útil e a área é zero.</li>
            <li><strong>E (350):</strong> é a soma dos valores-limite 150 e 200 obtidos quando um dos lados é zero. Esses extremos não formam a solução de área máxima.</li>
          </ul>
          <h3>7. Por que a alternativa correta está correta?</h3>
          <p>A função da área é uma parábola voltada para baixo. Seu vértice ocorre em L = 75 m, o que produz C = 100 m. Logo, o maior lado é 100 m.</p>
          <h3>8. Dica M.E.N.T.E</h3>
          <p>Quando aparecer “maior” ou “menor” valor e você conseguir montar uma função quadrática, procure o vértice da parábola.</p>
        </div>`
    }
  };

  function resetAnswers() {
    const migrationKey = "mente-funcoes-final-145-177-146-v2";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      [6, 7, 8].forEach((id) => delete answers[id]);
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch {
      localStorage.removeItem("mente-answers");
    }
    localStorage.setItem(migrationKey, "true");
  }

  function applyCatalogOverrides() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;
    Object.values(functionOfficialQuestions).forEach((official) => {
      const index = questions.findIndex((item) => item.id === official.id);
      if (index >= 0) Object.assign(questions[index], official, { visual: null });
    });
    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#functions-final-question-styles")) return;
    const style = document.createElement("style");
    style.id = "functions-final-question-styles";
    style.textContent = `
      .function-question-visual{margin:24px auto;padding:18px;border:1px solid var(--line);border-radius:14px;background:#fbfcfe;max-width:650px}
      .function-question-visual svg{display:block;width:100%;height:auto}
      .function-question-visual .axis{stroke:#475569;stroke-width:2}.function-question-visual .guide{stroke:#cbd5e1;stroke-width:1.5;stroke-dasharray:5 5}.function-question-visual .curve{fill:none;stroke:#AB47BC;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.function-question-visual text{font-family:Inter,Arial,sans-serif;fill:#475569;font-size:14px;font-weight:700}
      .function-data-table{width:min(520px,100%);margin:22px auto;border-collapse:collapse;background:#fff}.function-data-table th,.function-data-table td{padding:12px 14px;border:1px solid #d9e1ec;text-align:center}.function-data-table th{background:#f7eef9;color:#71357d}
      .mente-solution{margin-top:18px}.mente-solution h3{margin:22px 0 8px;color:#71357d;font-size:17px}.mente-solution p,.mente-solution li{line-height:1.7;color:#526174}.mente-solution ul{padding-left:22px}.solution-math{margin:14px 0;padding:14px 16px;border:1px solid #e4d1e8;border-radius:12px;background:#fbf5fc;color:#402448;font-weight:700;line-height:1.9}
      .answer-feedback .result-box{margin-top:20px}.answer-feedback .result-box__answer{margin-top:14px;font-weight:700}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function meditationGraph() {
    return `<figure class="function-question-visual"><svg viewBox="0 0 620 310" role="img" aria-label="Gráfico da frequência respiratória em função do tempo"><line class="axis" x1="75" y1="255" x2="560" y2="255"/><line class="axis" x1="75" y1="255" x2="75" y2="35"/><line class="guide" x1="75" y1="105" x2="245" y2="105"/><line class="guide" x1="75" y1="195" x2="405" y2="195"/><line class="guide" x1="245" y1="255" x2="245" y2="105"/><line class="guide" x1="405" y1="255" x2="405" y2="195"/><path class="curve" d="M95 105 L245 105 C285 105 295 195 405 195 L535 195"/><text x="48" y="110">f₁</text><text x="48" y="200">f₂</text><text x="235" y="278">t₁</text><text x="395" y="278">t₂</text><text x="505" y="288">Tempo (min)</text><text transform="translate(20 220) rotate(-90)">Frequência respiratória (rpm)</text><text x="186" y="300">Início da prática meditativa</text></svg></figure>`;
  }

  function backpackTable() {
    return `<table class="function-data-table" aria-label="Custo total de produção de mochilas"><thead><tr><th>Quantidade de mochilas</th><th>Custo total (R$)</th></tr></thead><tbody><tr><td>30</td><td>1 050,00</td></tr><tr><td>50</td><td>1 650,00</td></tr><tr><td>100</td><td>3 150,00</td></tr></tbody></table>`;
  }

  function questionVisual(official) {
    if (official.visual === "meditation") return meditationGraph();
    if (official.visual === "backpackTable") return backpackTable();
    return "";
  }

  function renderDetail(official) {
    const root = document.querySelector("#question-content");
    if (!root) return;
    addStyles();

    const answersKey = "mente-answers";
    const pointsKey = "mente-points";
    let storedAnswers = {};
    try { storedAnswers = JSON.parse(localStorage.getItem(answersKey) || "{}"); } catch { storedAnswers = {}; }
    const previous = storedAnswers[official.id];

    const alternatives = `<fieldset class="answer-options" ${previous ? "disabled" : ""}><legend>Escolha uma alternativa</legend>${official.options.map((option, index) => `<label class="${previous?.selected === index ? "is-saved" : ""}"><input type="radio" name="function-final-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}><strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span></label>`).join("")}</fieldset>`;

    root.innerHTML = `<section class="portal-hero"><h2>Questão ${official.examNumber} · ENEM ${official.year}</h2></section><article class="portal-card"><div class="question-detail__meta"><span>${official.category}</span><span>${official.topic}</span><span>ENEM ${official.year}</span><span>${"★".repeat(official.stars)}${"☆".repeat(5 - official.stars)}</span></div><p class="question-statement">${official.detail}</p>${official.source ? `<p class="official-source">${official.source}</p>` : ""}${questionVisual(official)}${alternatives}<button class="portal-button" id="function-final-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button><div id="function-final-feedback" class="answer-feedback" role="status"></div><p class="official-source">Questão ${official.examNumber} · ENEM ${official.year}</p></article>`;

    const feedback = document.querySelector("#function-final-feedback");
    const correctLetter = String.fromCharCode(65 + official.correct);
    const showResult = (answer) => {
      const status = answer.correct ? "result-box--correct" : "result-box--wrong";
      const title = answer.correct ? "Parabéns, você acertou!" : "Vamos destrinchar esta questão";
      feedback.innerHTML = `<div class="result-box ${status}"><h3>${title}</h3><p class="result-box__answer"><strong>Resposta correta:</strong> ${correctLetter} — ${official.options[official.correct]}</p>${official.explanationHtml}</div>`;
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#function-final-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="function-final-answer"]:checked');
      if (!selected) {
        feedback.innerHTML = '<p class="form-error">Escolha uma alternativa antes de concluir.</p>';
        return;
      }
      const selectedIndex = Number(selected.value);
      const isCorrect = selectedIndex === official.correct;
      storedAnswers[official.id] = { selected: selectedIndex, correct: isCorrect, answeredAt: new Date().toISOString() };
      localStorage.setItem(answersKey, JSON.stringify(storedAnswers));
      if (isCorrect) {
        const total = Number(localStorage.getItem(pointsKey) || 0) + 10;
        localStorage.setItem(pointsKey, total);
        const points = document.querySelector("#points");
        if (points) points.textContent = total;
      }
      document.querySelectorAll('input[name="function-final-answer"]').forEach((input) => { input.disabled = true; });
      button.disabled = true;
      button.textContent = "Questão já respondida";
      showResult(storedAnswers[official.id]);
    };
  }

  resetAnswers();
  if (document.querySelector("#questions-grid")) applyCatalogOverrides();
  if (document.querySelector("#question-content")) {
    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    const official = selected ? functionOfficialQuestions[selected.id] : null;
    if (official && selected.examNumber === official.examNumber) renderDetail(official);
  }
})();
