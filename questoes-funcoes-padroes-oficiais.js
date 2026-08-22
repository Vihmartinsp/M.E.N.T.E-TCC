"use strict";

(() => {
  const patternOfficialQuestions = {
    9: {
      id: 9,
      examNumber: 179,
      category: "Funções",
      topic: "Sequências e padrões numéricos",
      year: 2023,
      stars: 5,
      text: "Um povo utiliza as palavras 'urapum' e 'okosa' para representar números seguindo um padrão. De acordo com as representações mostradas, como devem ser escritos os numerais cinco e sete?",
      detail: "As características culturais variam de povo para povo. Há notícias de um povo que possuía formas de contar diferentes das nossas, como indicado no quadrinho a seguir. Segundo o padrão de contagem indicado na figura, as representações dos numerais cinco e sete, nessa cultura, devem ser, respectivamente,",
      options: [
        "okosa urapum urapum urapum e okosa okosa urapum urapum urapum.",
        "okosa okosa urapum e okosa okosa okosa okosa urapum.",
        "okosa okosa urapum e okosa okosa okosa urapum.",
        "okosa urapum urapum e okosa urapum okosa urapum urapum.",
        "okosa okosa urapum e okosa okosa okosa okosa."
      ],
      correct: 2,
      explanation: "Pelo padrão apresentado, 'urapum' representa 1 e 'okosa' representa 2. Assim, 3 aparece como okosa urapum (2 + 1), 4 como okosa okosa (2 + 2) e 6 como okosa okosa okosa (2 + 2 + 2). Portanto, 5 = 2 + 2 + 1, isto é, okosa okosa urapum; e 7 = 2 + 2 + 2 + 1, isto é, okosa okosa okosa urapum. A alternativa correta é C.",
      intro: "Procure a regra que transforma cada número em uma combinação de palavras e use o mesmo padrão para 5 e 7."
    }
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q179-2023-v1";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      delete answers[9];
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch {
      localStorage.removeItem("mente-answers");
    }
    localStorage.setItem(migrationKey, "true");
  }

  function applyCatalogOverrides() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;
    Object.values(patternOfficialQuestions).forEach((official) => {
      const index = questions.findIndex((item) => item.id === official.id);
      if (index >= 0) Object.assign(questions[index], official, { visual: null });
    });
    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#pattern-official-styles")) return;
    const style = document.createElement("style");
    style.id = "pattern-official-styles";
    style.textContent = `
      .pattern-strip{display:grid;grid-template-columns:repeat(6,minmax(92px,1fr));gap:10px;margin:24px 0;overflow-x:auto}
      .pattern-card{min-width:92px;padding:14px 10px;border:1px solid var(--line);border-radius:12px;background:#fbfcfe;text-align:center}
      .pattern-card__word{min-height:42px;display:grid;place-items:center;color:#5b21b6;font-size:11px;line-height:1.35;font-weight:800;text-transform:uppercase}
      .pattern-card__number{display:grid;width:34px;height:34px;margin:9px auto 0;place-items:center;border-radius:9px;background:#fff;border:2px solid #5b21b6;color:#5b21b6;font-weight:900}
      .pattern-card--question .pattern-card__word{font-size:24px;color:#0f172a}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function patternVisual() {
    const items = [
      ["URAPUM", "1"],
      ["OKOSA", "2"],
      ["OKOSA URAPUM", "3"],
      ["OKOSA OKOSA", "4"],
      ["?", "5"],
      ["OKOSA OKOSA OKOSA", "6"]
    ];
    return `<div class="pattern-strip" aria-label="Padrão de contagem de 1 a 6">${items.map(([word, number]) => `<div class="pattern-card ${word === "?" ? "pattern-card--question" : ""}"><div class="pattern-card__word">${word}</div><div class="pattern-card__number">${number}</div></div>`).join("")}</div>`;
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
            <input type="radio" name="pattern-official-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
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
        <p class="question-statement">As características culturais variam de povo para povo. Há notícias de um povo que possuía formas de contar diferentes das nossas, como indicado no padrão abaixo.</p>
        ${patternVisual()}
        <p class="question-statement"><strong>Segundo o padrão de contagem indicado, as representações dos numerais cinco e sete devem ser, respectivamente,</strong></p>
        ${alternatives}
        <button class="portal-button" id="pattern-official-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="pattern-official-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 179 · ENEM 2023</p>
      </article>`;

    const feedback = document.querySelector("#pattern-official-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você reconheceu corretamente a regularidade do sistema de contagem.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${official.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> C — ${official.options[official.correct]}</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#pattern-official-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="pattern-official-answer"]:checked');
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
      document.querySelectorAll('input[name="pattern-official-answer"]').forEach((input) => { input.disabled = true; });
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
    const official = selected ? patternOfficialQuestions[selected.id] : null;
    if (official && selected.examNumber === official.examNumber) renderDetail(official);
  }
})();
