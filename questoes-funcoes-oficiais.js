"use strict";

(() => {
  const functionOfficialQuestions = {
    6: {
      id: 6,
      examNumber: 146,
      category: "Funções",
      topic: "Função quadrática e otimização",
      year: 2024,
      stars: 1,
      text: "Um fazendeiro quer construir um galinheiro retangular usando telas de custos diferentes em pares de lados e gastar, no máximo, R$ 6 000,00. Qual pode ser a medida do maior lado para obter a maior área possível?",
      detail: "Um fazendeiro pretende construir um galinheiro ocupando uma região plana de formato retangular, com lados de comprimentos L metro e C metro. Os lados serão cercados por telas de tipos diferentes. Nos lados de comprimento L metro, será utilizada uma tela cujo metro linear custa R$ 20,00, enquanto, nos outros dois lados, uma que custa R$ 15,00. O fazendeiro quer gastar, no máximo, R$ 6 000,00 na compra de toda a tela necessária para o galinheiro, e deseja que o galinheiro tenha a maior área possível. Qual será a medida, em metro, do maior lado do galinheiro?",
      options: ["85", "100", "175", "200", "350"],
      correct: 1,
      explanation: "Os dois lados de medida L custam 2·20·L = 40L reais, e os dois lados de medida C custam 2·15·C = 30C reais. Para maximizar a área, usamos todo o orçamento: 40L + 30C = 6000. Isolando C, temos C = 200 - (4/3)L. A área é A(L) = L·C = 200L - (4/3)L², uma função quadrática com concavidade para baixo. O máximo ocorre no vértice: L = 75. Então C = 100. Portanto, o maior lado mede 100 m, alternativa B.",
      intro: "Transforme as condições do problema em uma função e descubra onde a área é máxima."
    },
    7: {
      id: 7,
      examNumber: 145,
      category: "Funções",
      topic: "Interpretação de gráficos de funções",
      year: 2025,
      stars: 2,
      text: "Um gráfico relaciona a frequência respiratória de um praticante de meditação ao tempo. A partir do instante t1, em que se inicia a prática meditativa, como essa frequência se comporta?",
      detail: "Pesquisas na área de neurobiologia confirmam que a prática meditativa é responsável por diminuir consideravelmente a frequência respiratória para praticantes avançados, que, após iniciarem a meditação, têm suas frequências respiratórias reduzidas até se estabilizarem em um nível mais baixo. O gráfico apresenta a relação da frequência respiratória, em incursões respiratórias por minuto (rpm), em relação ao tempo, em minuto, de um praticante avançado, em que f1 representa a frequência no instante t1, no qual se inicia a prática meditativa; e f2, a frequência no instante t2, a partir do qual esta se estabiliza durante a meditação. A partir do instante t1, em que se inicia a prática meditativa, o comportamento da frequência respiratória, em relação ao tempo,",
      options: [
        "mantém-se constante.",
        "é diretamente proporcional ao tempo.",
        "é inversamente proporcional ao tempo.",
        "diminui até o instante t2, a partir do qual se torna constante.",
        "diminui de forma proporcional ao tempo, tanto entre t1 e t2 quanto após t2."
      ],
      correct: 3,
      explanation: "No instante t1 começa a prática meditativa. A partir daí, a curva do gráfico desce, mostrando que a frequência respiratória diminui. Essa queda continua até t2. Depois de t2, o gráfico fica horizontal no nível f2, indicando que a frequência se estabiliza e passa a permanecer constante. Portanto, a alternativa correta é D.",
      intro: "Leia o formato do gráfico por trechos e observe quando a frequência diminui e quando se estabiliza.",
      graph: true
    }
  };

  function resetOldPlaceholderAnswers() {
    const migrations = [
      ["mente-q146-2024-v1", 6],
      ["mente-q145-2025-v1", 7]
    ];
    migrations.forEach(([migrationKey, id]) => {
      if (localStorage.getItem(migrationKey)) return;
      try {
        const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
        delete answers[id];
        localStorage.setItem("mente-answers", JSON.stringify(answers));
      } catch {
        localStorage.removeItem("mente-answers");
      }
      localStorage.setItem(migrationKey, "true");
    });
  }

  function applyCatalogOverrides() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;
    Object.values(functionOfficialQuestions).forEach((official) => {
      const index = questions.findIndex((item) => item.id === official.id);
      if (index >= 0) Object.assign(questions[index], official, { visual: official.graph ? "line" : null });
    });
    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#functions-official-styles")) return;
    const style = document.createElement("style");
    style.id = "functions-official-styles";
    style.textContent = `
      .function-graph-wrap{margin:24px auto;padding:18px;border:1px solid var(--line);border-radius:14px;background:#fbfcfe;max-width:620px}
      .function-graph{display:block;width:100%;height:auto}
      .function-graph .axis{stroke:#475569;stroke-width:2}
      .function-graph .guide{stroke:#cbd5e1;stroke-width:1.5;stroke-dasharray:5 5}
      .function-graph .curve{fill:none;stroke:#5b21b6;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
      .function-graph text{font-family:Inter,Arial,sans-serif;fill:#475569;font-size:14px;font-weight:700}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function meditationGraph() {
    return `
      <figure class="function-graph-wrap">
        <svg class="function-graph" viewBox="0 0 620 310" role="img" aria-label="Gráfico da frequência respiratória em função do tempo">
          <line class="axis" x1="75" y1="255" x2="560" y2="255"/>
          <line class="axis" x1="75" y1="255" x2="75" y2="35"/>
          <line class="guide" x1="75" y1="105" x2="245" y2="105"/>
          <line class="guide" x1="75" y1="195" x2="405" y2="195"/>
          <line class="guide" x1="245" y1="255" x2="245" y2="105"/>
          <line class="guide" x1="405" y1="255" x2="405" y2="195"/>
          <path class="curve" d="M95 105 L245 105 C285 105 295 195 405 195 L535 195"/>
          <text x="48" y="110">f₁</text>
          <text x="48" y="200">f₂</text>
          <text x="235" y="278">t₁</text>
          <text x="395" y="278">t₂</text>
          <text x="505" y="288">Tempo (min)</text>
          <text transform="translate(20 220) rotate(-90)">Frequência respiratória (rpm)</text>
          <text x="186" y="300">Início da prática meditativa</text>
        </svg>
      </figure>`;
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

    const alternatives = `
      <fieldset class="answer-options" ${previous ? "disabled" : ""}>
        <legend>Escolha uma alternativa</legend>
        ${official.options.map((option, index) => `
          <label class="${previous?.selected === index ? "is-saved" : ""}">
            <input type="radio" name="function-official-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${official.examNumber} · ENEM ${official.year}</h2>
        <p>${official.intro}</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${official.category}</span><span>${official.topic}</span><span>ENEM ${official.year}</span><span>${"★".repeat(official.stars)}${"☆".repeat(5 - official.stars)}</span>
        </div>
        <p class="question-statement">${official.detail}</p>
        ${official.graph ? meditationGraph() : ""}
        ${alternatives}
        <button class="portal-button" id="function-official-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="function-official-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão ${official.examNumber} · ENEM ${official.year}</p>
      </article>`;

    const feedback = document.querySelector("#function-official-feedback");
    const correctLetter = String.fromCharCode(65 + official.correct);
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você interpretou corretamente o comportamento da função.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${official.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> ${correctLetter} — ${official.options[official.correct]}</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#function-official-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="function-official-answer"]:checked');
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
      document.querySelectorAll('input[name="function-official-answer"]').forEach((input) => { input.disabled = true; });
      button.disabled = true;
      button.textContent = "Questão já respondida";
      showResult(storedAnswers[official.id]);
    };
  }

  resetOldPlaceholderAnswers();
  if (document.querySelector("#questions-grid")) applyCatalogOverrides();
  if (document.querySelector("#question-content")) {
    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    const official = selected ? functionOfficialQuestions[selected.id] : null;
    if (official && selected.examNumber === official.examNumber) renderDetail(official);
  }
})();
