"use strict";

(() => {
  const officialQuestion = {
    id: 13,
    examNumber: 176,
    category: "Estatística e Probabilidade",
    topic: "Reta de tendência e estimativa",
    year: 2024,
    stars: 4,
    text: "As receitas anuais de uma indústria foram representadas em um gráfico de dispersão com uma reta de tendência. Qual é a estimativa da receita para 2026?",
    detail: "As receitas anuais obtidas por uma indústria no período de 2014 a 2021, em milhão de reais, foram registradas, por pontos, em um gráfico. Nele, também está representada a reta que descreve a tendência de evolução das receitas. Essa reta pode ser utilizada para estimar as receitas dos anos seguintes. A estimativa da receita, em milhão de reais, dessa indústria, para o ano de 2026, obtida a partir dessa reta de tendência, é",
    options: ["7", "8", "9", "10", "11"],
    correct: 1,
    explanation: "Pela reta de tendência, podemos usar pontos fáceis de ler: em 2014, a estimativa é 4 milhões; em 2017, 5 milhões; e em 2020, 6 milhões. Portanto, a receita estimada aumenta 1 milhão a cada 3 anos. De 2020 até 2026 passam 6 anos, ou seja, dois períodos de 3 anos. Assim, a estimativa aumenta 2 milhões: 6 + 2 = 8 milhões. Logo, a alternativa correta é B.",
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q176-2024-v1";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      delete answers[officialQuestion.id];
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch {
      localStorage.removeItem("mente-answers");
    }
    localStorage.setItem(migrationKey, "true");
  }

  function applyCatalogOverride() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;
    const index = questions.findIndex((item) => item.id === officialQuestion.id);
    if (index >= 0) Object.assign(questions[index], officialQuestion, { visual: "line" });
    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#statistics-trend-question-styles")) return;
    const style = document.createElement("style");
    style.id = "statistics-trend-question-styles";
    style.textContent = `
      .trend-chart-wrap{margin:24px auto;padding:18px;border:1px solid var(--line);border-radius:14px;background:#fbfcfe;max-width:650px}
      .trend-chart{display:block;width:100%;height:auto}
      .trend-chart .grid{stroke:#dbe3ec;stroke-width:1}
      .trend-chart .axis{stroke:#334155;stroke-width:2}
      .trend-chart .trend{stroke:#ef4444;stroke-width:3;fill:none}
      .trend-chart .point{fill:#f97316;stroke:#fff;stroke-width:2}
      .trend-chart text{font-family:Inter,Arial,sans-serif;fill:#475569;font-size:12px;font-weight:700}
      .trend-caption{margin:10px 0 0;color:var(--muted);font-size:12px;text-align:center;line-height:1.5}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function trendChart() {
    const years = [2014,2015,2016,2017,2018,2019,2020,2021];
    const values = [3.5,4.8,4.6,4.4,5.4,5.8,4.9,6.5];
    const x = (year) => 88 + (year - 2014) * 62;
    const y = (value) => 300 - value * 36;
    const verticalGrid = years.map((year) => `<line class="grid" x1="${x(year)}" y1="45" x2="${x(year)}" y2="300"/><text x="${x(year)-16}" y="323">${year}</text>`).join("");
    const horizontalGrid = [0,1,2,3,4,5,6,7].map((value) => `<line class="grid" x1="70" y1="${y(value)}" x2="540" y2="${y(value)}"/><text x="49" y="${y(value)+4}">${value}</text>`).join("");
    const points = years.map((year,index) => `<circle class="point" cx="${x(year)}" cy="${y(values[index])}" r="5"/>`).join("");
    return `
      <figure class="trend-chart-wrap">
        <svg class="trend-chart" viewBox="0 0 600 360" role="img" aria-label="Gráfico de dispersão das receitas anuais de 2014 a 2021 com reta de tendência crescente">
          ${horizontalGrid}
          ${verticalGrid}
          <line class="axis" x1="70" y1="300" x2="555" y2="300"/>
          <line class="axis" x1="70" y1="300" x2="70" y2="35"/>
          <path class="trend" d="M ${x(2014)} ${y(4)} L ${x(2021)} ${y(6.333)}"/>
          ${points}
          <text x="282" y="348">Ano</text>
          <text transform="translate(18 238) rotate(-90)">Receita anual (em milhão de reais)</text>
        </svg>
        <figcaption class="trend-caption">Os pontos representam as receitas observadas; a linha representa a tendência usada para estimar anos futuros.</figcaption>
      </figure>`;
  }

  function renderDetail() {
    const root = document.querySelector("#question-content");
    if (!root) return;
    addStyles();

    const answersKey = "mente-answers";
    const pointsKey = "mente-points";
    let storedAnswers = {};
    try { storedAnswers = JSON.parse(localStorage.getItem(answersKey) || "{}"); } catch { storedAnswers = {}; }
    const previous = storedAnswers[officialQuestion.id];

    const alternatives = `
      <fieldset class="answer-options" ${previous ? "disabled" : ""}>
        <legend>Escolha uma alternativa</legend>
        ${officialQuestion.options.map((option, index) => `
          <label class="${previous?.selected === index ? "is-saved" : ""}">
            <input type="radio" name="statistics-trend-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${officialQuestion.examNumber} · ENEM ${officialQuestion.year}</h2>
        <p>Use a reta de tendência, e não os pontos isolados, para projetar a receita de um ano futuro.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${officialQuestion.category}</span><span>${officialQuestion.topic}</span><span>ENEM ${officialQuestion.year}</span><span>${"★".repeat(officialQuestion.stars)}${"☆".repeat(5 - officialQuestion.stars)}</span>
        </div>
        <p class="question-statement">${officialQuestion.detail}</p>
        ${trendChart()}
        ${alternatives}
        <button class="portal-button" id="statistics-trend-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="statistics-trend-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 176 · ENEM 2024</p>
      </article>`;

    const feedback = document.querySelector("#statistics-trend-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você usou corretamente a reta de tendência para fazer a estimativa.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${officialQuestion.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> B — 8 milhões de reais</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#statistics-trend-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="statistics-trend-answer"]:checked');
      if (!selected) {
        feedback.innerHTML = '<p class="form-error">Escolha uma alternativa antes de concluir.</p>';
        return;
      }
      const selectedIndex = Number(selected.value);
      const isCorrect = selectedIndex === officialQuestion.correct;
      storedAnswers[officialQuestion.id] = { selected: selectedIndex, correct: isCorrect, answeredAt: new Date().toISOString() };
      localStorage.setItem(answersKey, JSON.stringify(storedAnswers));
      if (isCorrect) {
        const total = Number(localStorage.getItem(pointsKey) || 0) + 10;
        localStorage.setItem(pointsKey, total);
        const points = document.querySelector("#points");
        if (points) points.textContent = total;
      }
      document.querySelectorAll('input[name="statistics-trend-answer"]').forEach((input) => { input.disabled = true; });
      button.disabled = true;
      button.textContent = "Questão já respondida";
      showResult(storedAnswers[officialQuestion.id]);
    };
  }

  resetOldPlaceholderAnswer();
  if (document.querySelector("#questions-grid")) applyCatalogOverride();
  if (document.querySelector("#question-content")) {
    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    if (selected && selected.id === officialQuestion.id && selected.examNumber === officialQuestion.examNumber) renderDetail();
  }
})();
