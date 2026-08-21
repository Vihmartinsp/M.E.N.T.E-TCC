"use strict";

(() => {
  const geometryOfficialQuestions = {
    2: {
      id: 2,
      examNumber: 151,
      category: "Geometria",
      topic: "Raciocínio lógico e organização de informações",
      year: 2025,
      stars: 3,
      text: "Uma empresa usa um código numérico de 7 dígitos para identificar visitantes, combinando andar, setor, funcionário e período do dia. Qual é o código de um visitante que vai ao 2º andar, setor 08, encontrar o funcionário 109 às 10 horas da manhã?",
      detail: "Para acompanhar o fluxo de visitantes em seu prédio, uma empresa estabeleceu um código de identificação para a visitação. De acordo com a regra estabelecida, cada visitante será identificado com um código sequencial numérico com 7 dígitos, determinado, da esquerda para a direita, da seguinte forma: o primeiro dígito indica o andar ao qual o visitante se dirige, que é um número de 1 a 4; os dois próximos dígitos correspondem ao número do setor da empresa ao qual o visitante se destina, variando de 01 a 20; os três dígitos seguintes correspondem ao número do funcionário da empresa com quem o visitante irá se reunir, variando de 001 a 135; e o último dígito indica se o visitante chegou à empresa pela manhã, dígito 0, ou à tarde, dígito 1. Um visitante chegou à empresa às 10 horas da manhã para se reunir com um funcionário identificado pelo número 109, que trabalha no setor 08 da empresa, localizado no 2º andar. O código de identificação desse visitante é",
      options: ["0109082", "0281090", "1010982", "2081090", "2810910"],
      correct: 3,
      explanation: "O código deve ser montado exatamente na ordem indicada. O 1º dígito representa o andar: 2. Os dois seguintes representam o setor: 08. Os três seguintes representam o funcionário: 109. Como a visita ocorreu às 10 horas da manhã, o último dígito é 0. Juntando as partes, obtemos 2 | 08 | 109 | 0 = 2081090. Portanto, a alternativa correta é D.",
    },
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q151-2025-v1";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      delete answers[2];
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch {
      localStorage.removeItem("mente-answers");
    }
    localStorage.setItem(migrationKey, "true");
  }

  function applyCatalogOverrides() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;

    Object.values(geometryOfficialQuestions).forEach((official) => {
      const index = questions.findIndex((item) => item.id === official.id);
      if (index >= 0) Object.assign(questions[index], official, { visual: null });
    });

    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#geometry-official-question-styles")) return;
    const style = document.createElement("style");
    style.id = "geometry-official-question-styles";
    style.textContent = `
      .code-rule-list{display:grid;gap:10px;margin:22px 0;padding:0;list-style:none}
      .code-rule-list li{display:grid;grid-template-columns:118px 1fr;gap:14px;align-items:start;padding:13px 15px;border:1px solid var(--line);border-radius:10px;background:#fbfcfe}
      .code-rule-list strong{color:#1d4edb;font-size:12px}
      .code-rule-list span{color:#536076;font-size:12px;line-height:1.55}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
      @media(max-width:540px){.code-rule-list li{grid-template-columns:1fr;gap:5px}}
    `;
    document.head.appendChild(style);
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
            <input type="radio" name="geometry-official-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${official.examNumber} · ENEM ${official.year}</h2>
        <p>Leia com atenção e organize cada informação na posição correta do código.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${official.category}</span><span>${official.topic}</span><span>ENEM ${official.year}</span><span>${"★".repeat(official.stars)}${"☆".repeat(5 - official.stars)}</span>
        </div>
        <p class="question-statement">Para acompanhar o fluxo de visitantes em seu prédio, uma empresa estabeleceu um código de identificação para a visitação. Cada visitante será identificado com um código sequencial numérico de 7 dígitos, determinado da esquerda para a direita da seguinte forma:</p>
        <ul class="code-rule-list">
          <li><strong>1º dígito</strong><span>Indica o andar ao qual o visitante se dirige, de 1 a 4.</span></li>
          <li><strong>2º e 3º dígitos</strong><span>Indicam o setor da empresa, com números de 01 a 20.</span></li>
          <li><strong>4º, 5º e 6º dígitos</strong><span>Indicam o funcionário da empresa, com números de 001 a 135.</span></li>
          <li><strong>7º dígito</strong><span>Indica o período da visita: 0 para manhã e 1 para tarde.</span></li>
        </ul>
        <p class="question-statement">Um visitante chegou à empresa às 10 horas da manhã para se reunir com um funcionário identificado pelo número 109, que trabalha no setor 08 da empresa, localizado no 2º andar.</p>
        <p class="question-statement"><strong>O código de identificação desse visitante é</strong></p>
        ${alternatives}
        <button class="portal-button" id="geometry-official-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="geometry-official-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 151 · ENEM 2025</p>
      </article>`;

    const feedback = document.querySelector("#geometry-official-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você organizou corretamente as informações do código.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${official.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> D — 2081090</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#geometry-official-complete");
    if (!button || previous) return;

    button.onclick = () => {
      const selected = document.querySelector('input[name="geometry-official-answer"]:checked');
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

      document.querySelectorAll('input[name="geometry-official-answer"]').forEach((input) => { input.disabled = true; });
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
    const official = selected ? geometryOfficialQuestions[selected.id] : null;
    if (official && selected.examNumber === official.examNumber) renderDetail(official);
  }
})();
