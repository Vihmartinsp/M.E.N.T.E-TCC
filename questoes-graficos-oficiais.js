"use strict";

(() => {
  const graphOfficialQuestions = {
    26: {
      id: 26,
      examNumber: 178,
      category: "Gráficos e Tabelas",
      topic: "Interpretação de gráficos e função por partes",
      year: 2023,
      stars: 5,
      text: "Uma torneira inteligente libera água por 3 segundos, interrompe o fluxo por 5 segundos e volta a liberar água por mais 3 segundos. Qual gráfico representa o volume acumulado de água ao longo do tempo?",
      detail: "Estudantes trabalhando com robótica criaram uma ‘torneira inteligente’ que automatiza sua abertura e seu fechamento durante a limpeza das mãos. Ao se colocar as mãos sob a torneira, ela libera água durante 3 segundos para que a pessoa possa molhá-las. Em seguida, interrompe o fornecimento de água por 5 segundos, enquanto a pessoa ensaboa suas mãos, e finaliza o ciclo liberando água para o enxágue por mais 3 segundos. Considere o tempo t, em segundo, contado a partir do instante em que se inicia o ciclo. A vazão de água nessa torneira é constante. Um esboço de gráfico que descreve o volume de água acumulado, em litro, liberado por essa torneira durante um ciclo de lavagem das mãos, em função do tempo t, é",
      options: ["A", "B", "C", "D", "E"],
      correct: 1,
      explanation: "Como a vazão é constante, enquanto a torneira está aberta o volume acumulado cresce linearmente. Nos 3 primeiros segundos, o gráfico deve subir. Depois, a água fica desligada por 5 segundos, do instante 3 até o instante 8, então o volume acumulado permanece constante e o gráfico fica horizontal. Por fim, a torneira volta a liberar água por mais 3 segundos, de 8 a 11 segundos, e o volume acumulado volta a crescer com a mesma inclinação. O único gráfico com esse comportamento é o da alternativa B.",
    },
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q178-2023-v1";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      delete answers[26];
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch {
      localStorage.removeItem("mente-answers");
    }
    localStorage.setItem(migrationKey, "true");
  }

  function applyCatalogOverrides() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;
    Object.values(graphOfficialQuestions).forEach((official) => {
      const index = questions.findIndex((item) => item.id === official.id);
      if (index >= 0) Object.assign(questions[index], official, { visual: "line" });
    });
    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#graph-official-question-styles")) return;
    const style = document.createElement("style");
    style.id = "graph-official-question-styles";
    style.textContent = `
      .graph-options{display:grid;gap:14px;margin:22px 0}
      .graph-option{display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:center;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:#fbfcfe;cursor:pointer}
      .graph-option:has(input:checked){border-color:var(--blue);background:#f0f5ff}
      .graph-option input{accent-color:var(--blue)}
      .graph-option__letter{display:grid;width:26px;height:26px;place-items:center;border-radius:50%;color:var(--blue);background:var(--blue-pale);font-size:11px;font-weight:800}
      .graph-option svg{display:block;width:min(420px,100%);height:auto}
      .graph-axis{stroke:#64748b;stroke-width:1.5}
      .graph-grid{stroke:#e2e8f0;stroke-width:1}
      .graph-line{fill:none;stroke:#0ea5e9;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
      .graph-label{fill:#64748b;font:10px Inter,Arial,sans-serif}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function graphSvg(type) {
    const paths = {
      A: "M45 145 L120 85 M250 115 L325 55",
      B: "M45 145 L120 85 L250 85 L325 25",
      C: "M45 95 L120 95 M250 95 L325 95",
      D: "M45 145 L325 35",
      E: "M45 145 L120 85 M250 145 L325 25",
    };
    const grid = Array.from({length: 7}, (_, i) => `<line class=\"graph-grid\" x1=\"45\" y1=\"${25+i*20}\" x2=\"325\" y2=\"${25+i*20}\"/>`).join("") + Array.from({length: 12}, (_, i) => `<line class=\"graph-grid\" x1=\"${45+i*25.45}\" y1=\"25\" x2=\"${45+i*25.45}\" y2=\"145\"/>`).join("");
    return `<svg viewBox=\"0 0 360 175\" role=\"img\" aria-label=\"Gráfico da alternativa ${type}\">${grid}<line class=\"graph-axis\" x1=\"45\" y1=\"145\" x2=\"335\" y2=\"145\"/><line class=\"graph-axis\" x1=\"45\" y1=\"150\" x2=\"45\" y2=\"20\"/><path class=\"graph-line\" d=\"${paths[type]}\"/><text class=\"graph-label\" x=\"328\" y=\"162\">t (s)</text><text class=\"graph-label\" x=\"5\" y=\"18\">Volume</text><text class=\"graph-label\" x=\"41\" y=\"160\">0</text><text class=\"graph-label\" x=\"114\" y=\"160\">3</text><text class=\"graph-label\" x=\"244\" y=\"160\">8</text><text class=\"graph-label\" x=\"316\" y=\"160\">11</text></svg>`;
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

    const alternatives = `<fieldset class=\"graph-options\" ${previous ? "disabled" : ""}><legend>Escolha o gráfico correto</legend>${official.options.map((option, index) => `<label class=\"graph-option\"><input type=\"radio\" name=\"graph-official-answer\" value=\"${index}\" ${previous?.selected === index ? "checked" : ""}><span class=\"graph-option__letter\">${option}</span>${graphSvg(option)}</label>`).join("")}</fieldset>`;

    root.innerHTML = `
      <section class="portal-hero"><h2>Questão ${official.examNumber} · ENEM ${official.year}</h2><p>Observe como o volume acumulado muda em cada etapa do ciclo da torneira.</p></section>
      <article class="portal-card">
        <div class="question-detail__meta"><span>${official.category}</span><span>${official.topic}</span><span>ENEM ${official.year}</span><span>${"★".repeat(official.stars)}${"☆".repeat(5-official.stars)}</span></div>
        <p class="question-statement">Estudantes trabalhando com robótica criaram uma “torneira inteligente” que automatiza sua abertura e seu fechamento durante a limpeza das mãos.</p>
        <p class="question-statement">Ao se colocar as mãos sob a torneira, ela libera água durante <strong>3 segundos</strong> para molhá-las. Em seguida, interrompe o fornecimento de água por <strong>5 segundos</strong>, enquanto a pessoa ensaboa as mãos, e finaliza o ciclo liberando água para o enxágue por mais <strong>3 segundos</strong>. A vazão da torneira é constante.</p>
        <p class="question-statement"><strong>Qual gráfico descreve o volume de água acumulado ao longo do ciclo?</strong></p>
        ${alternatives}
        <button class="portal-button" id="graph-official-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="graph-official-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 178 · ENEM 2023</p>
      </article>`;

    const feedback = document.querySelector("#graph-official-feedback");
    const showResult = (answer) => {
      if (answer.correct) feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você interpretou corretamente o comportamento do volume acumulado.</p></div>';
      else feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${official.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> B</p></div>`;
    };
    if (previous) showResult(previous);

    const button = document.querySelector("#graph-official-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="graph-official-answer"]:checked');
      if (!selected) { feedback.innerHTML = '<p class="form-error">Escolha uma alternativa antes de concluir.</p>'; return; }
      const selectedIndex = Number(selected.value);
      const isCorrect = selectedIndex === official.correct;
      storedAnswers[official.id] = { selected: selectedIndex, correct: isCorrect, answeredAt: new Date().toISOString() };
      localStorage.setItem(answersKey, JSON.stringify(storedAnswers));
      if (isCorrect) {
        const total = Number(localStorage.getItem(pointsKey) || 0) + 10;
        localStorage.setItem(pointsKey, total);
        const points = document.querySelector("#points"); if (points) points.textContent = total;
      }
      document.querySelectorAll('input[name="graph-official-answer"]').forEach((input) => { input.disabled = true; });
      button.disabled = true; button.textContent = "Questão já respondida"; showResult(storedAnswers[official.id]);
    };
  }

  resetOldPlaceholderAnswer();
  if (document.querySelector("#questions-grid")) applyCatalogOverrides();
  if (document.querySelector("#question-content")) {
    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    const official = selected ? graphOfficialQuestions[selected.id] : null;
    if (official && selected.examNumber === official.examNumber) renderDetail(official);
  }
})();
