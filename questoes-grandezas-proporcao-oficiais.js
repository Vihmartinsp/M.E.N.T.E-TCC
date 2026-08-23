"use strict";

(() => {
  const officialQuestion = {
    id: 23,
    examNumber: 150,
    category: "Grandezas e Medidas",
    topic: "Porcentagem e proporcionalidade",
    year: 2023,
    stars: 3,
    text: "Após a ingestão de uma quantidade q de álcool, a concentração C no sangue corresponde, ao final da primeira hora, a aproximadamente 90% dessa quantidade. Qual expressão representa C nesse instante?",
    detail: "Dirigir após ingerir bebidas alcoólicas é uma atitude extremamente perigosa, uma vez que, a partir da primeira dose, a pessoa já começa a ter perda de sensibilidade de movimentos e de reflexos. Apesar de a eliminação e absorção do álcool depender de cada pessoa e de como o organismo consegue metabolizar a substância, ao final da primeira hora após a ingestão, a concentração de álcool (C) no sangue corresponde a aproximadamente 90% da quantidade (q) de álcool ingerida, e a eliminação total dessa concentração pode demorar até 12 horas. Nessas condições, ao final da primeira hora após a ingestão da quantidade q de álcool, a concentração C dessa substância no sangue é expressa algebricamente por",
    options: ["C = 0,9q", "C = 0,1q", "C = 1 − 0,1q", "C = 1 − 0,9q", "C = q − 10"],
    correct: 0,
    explanation: "O enunciado informa diretamente que, ao final da primeira hora, a concentração C corresponde a 90% da quantidade q ingerida. Como 90% = 90/100 = 0,9, basta multiplicar q por 0,9. Logo, C = 0,9q. Portanto, a alternativa correta é A.",
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q150-2023-v2";
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
    if (index >= 0) Object.assign(questions[index], officialQuestion, { visual: null });
    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#proportion-official-styles")) return;
    const style = document.createElement("style");
    style.id = "proportion-official-styles";
    style.textContent = `
      .proportion-highlight{margin:22px 0;padding:18px;border:1px solid #fecaca;border-radius:14px;background:#fff7f7}
      .proportion-highlight strong{display:block;margin-bottom:6px;color:#b91c1c;font-size:14px}
      .proportion-highlight span{color:#475569;line-height:1.6}
      .proportion-formula{display:inline-block;margin-top:10px;padding:9px 13px;border-radius:10px;background:#D70101;color:#fff;font-weight:900}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
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
            <input type="radio" name="proportion-official-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${officialQuestion.examNumber} · ENEM ${officialQuestion.year}</h2>
        <p>Transforme a porcentagem informada no enunciado em uma relação algébrica simples.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${officialQuestion.category}</span><span>${officialQuestion.topic}</span><span>ENEM ${officialQuestion.year}</span><span>${"★".repeat(officialQuestion.stars)}${"☆".repeat(5 - officialQuestion.stars)}</span>
        </div>
        <p class="question-statement">${officialQuestion.detail}</p>
        <div class="proportion-highlight">
          <strong>Dado principal do enunciado</strong>
          <span>Ao final da primeira hora, a concentração corresponde a <strong style="display:inline;color:#b91c1c">90%</strong> da quantidade ingerida.</span>
        </div>
        ${alternatives}
        <button class="portal-button" id="proportion-official-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="proportion-official-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 150 · ENEM 2023</p>
      </article>`;

    const feedback = document.querySelector("#proportion-official-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você transformou corretamente 90% em 0,9 e identificou a relação proporcional.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${officialQuestion.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> A — C = 0,9q</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#proportion-official-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="proportion-official-answer"]:checked');
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
      document.querySelectorAll('input[name="proportion-official-answer"]').forEach((input) => { input.disabled = true; });
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
