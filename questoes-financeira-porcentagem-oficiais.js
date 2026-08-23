"use strict";

(() => {
  const officialQuestion = {
    id: 16,
    examNumber: 140,
    category: "Matemática Financeira",
    topic: "Porcentagem e composição percentual",
    year: 2025,
    stars: 1,
    text: "Uma solução de 10 litros contém 99,95% de S1. Retira-se apenas S1, mantendo S2 constante, até que 99,90% da nova solução seja S1. Quantos litros de S1 foram retirados?",
    detail: "Em um laboratório, um recipiente contém 10 litros de uma solução composta apenas pelas substâncias S1 e S2. Dessa solução, 99,95% é de S1. Uma quantidade de S1 será retirada dessa solução, mantendo a quantidade inicial de S2, de modo que 99,90% da nova solução seja de S1. Qual é a quantidade de S1, em litro, que será retirada?",
    options: ["0,0050", "0,0100", "0,5000", "4,9775", "5,0000"],
    correct: 4,
    explanation: "No início, S2 representa 0,05% de 10 L, isto é, 0,005 L. Como apenas S1 é retirada, a quantidade de S2 permanece 0,005 L. Na nova solução, se S1 corresponde a 99,90%, então S2 corresponde a 0,10% do volume total. Logo, 0,005 = 0,001 × V, de onde V = 5 L. Como o volume inicial era 10 L, foram retirados 10 − 5 = 5 L de S1. Portanto, a alternativa correta é E.",
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q140-2025-v1";
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
    if (document.querySelector("#finance-percentage-question-styles")) return;
    const style = document.createElement("style");
    style.id = "finance-percentage-question-styles";
    style.textContent = `
      .finance-percentage-box{margin:22px 0;padding:18px;border:1px solid #f5df7f;border-radius:14px;background:#fffdf2}
      .finance-percentage-box strong{display:block;margin-bottom:8px;color:#8a7000;font-size:13px}
      .finance-percentage-box p{margin:5px 0;color:#475569;font-size:13px;line-height:1.65}
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
            <input type="radio" name="finance-percentage-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${officialQuestion.examNumber} · ENEM ${officialQuestion.year}</h2>
        <p>Interprete as porcentagens e observe qual componente permanece constante.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${officialQuestion.category}</span><span>${officialQuestion.topic}</span><span>ENEM ${officialQuestion.year}</span><span>${"★".repeat(officialQuestion.stars)}${"☆".repeat(5 - officialQuestion.stars)}</span>
        </div>
        <p class="question-statement">${officialQuestion.detail}</p>
        <div class="finance-percentage-box">
          <strong>Dica de interpretação</strong>
          <p>Se 99,95% da solução é S1, o restante é S2. E como somente S1 é retirada, a quantidade de S2 não muda.</p>
        </div>
        ${alternatives}
        <button class="portal-button" id="finance-percentage-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="finance-percentage-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 140 · ENEM 2025</p>
      </article>`;

    const feedback = document.querySelector("#finance-percentage-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você percebeu corretamente que S2 permanece constante e usou a porcentagem restante da nova solução.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${officialQuestion.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> E — 5,0000 L</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#finance-percentage-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="finance-percentage-answer"]:checked');
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
      document.querySelectorAll('input[name="finance-percentage-answer"]').forEach((input) => { input.disabled = true; });
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
