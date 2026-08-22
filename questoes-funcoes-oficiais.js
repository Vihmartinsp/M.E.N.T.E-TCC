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
      explanation: "Os dois lados de medida L custam 2·20·L = 40L reais, e os dois lados de medida C custam 2·15·C = 30C reais. Para maximizar a área, usamos todo o orçamento: 40L + 30C = 6000. Isolando C, temos C = 200 - (4/3)L. A área é A(L) = L·C = 200L - (4/3)L², uma função quadrática com concavidade para baixo. O máximo ocorre no vértice: L = -b/(2a) = -200/[2·(-4/3)] = 75. Então C = 200 - (4/3)·75 = 100. Portanto, o maior lado mede 100 m, alternativa B.",
    },
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q146-2024-v1";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      delete answers[6];
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

  function renderDetail(official) {
    const root = document.querySelector("#question-content");
    if (!root) return;

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
        <p>Transforme as condições do problema em uma função e descubra onde a área é máxima.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${official.category}</span><span>${official.topic}</span><span>ENEM ${official.year}</span><span>${"★".repeat(official.stars)}${"☆".repeat(5 - official.stars)}</span>
        </div>
        <p class="question-statement">${official.detail}</p>
        ${alternatives}
        <button class="portal-button" id="function-official-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="function-official-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 146 · ENEM 2024</p>
      </article>`;

    const feedback = document.querySelector("#function-official-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você identificou corretamente o ponto de máximo da situação.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${official.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> B — 100</p></div>`;
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

  resetOldPlaceholderAnswer();
  if (document.querySelector("#questions-grid")) applyCatalogOverrides();
  if (document.querySelector("#question-content")) {
    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    const official = selected ? functionOfficialQuestions[selected.id] : null;
    if (official && selected.examNumber === official.examNumber) renderDetail(official);
  }
})();
