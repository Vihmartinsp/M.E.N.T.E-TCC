"use strict";

(() => {
  const official = {
    id: 12,
    examNumber: 143,
    category: "Estatística e Probabilidade",
    topic: "Leitura e comparação de dados",
    year: 2025,
    stars: 1,
    text: "Cinco alimentos são vendidos em pacotes com diferentes números de porções e diferentes quantidades de sódio por porção. Qual deles tem a menor quantidade total de sódio por pacote?",
    detail: "Na cantina de uma escola, há cinco alimentos vendidos em pacotes com diferentes quantidades de porções. As informações nutricionais contidas nos rótulos desses produtos estão indicadas abaixo. Uma estudante opta sempre pelo alimento com a menor quantidade total de sódio por pacote. Qual desses produtos deve ser o escolhido pela estudante?",
    options: ["Batata chips.", "Palitos salgados.", "Biscoito multigrãos.", "Biscoito de polvilho.", "Biscoito de água e sal."],
    correct: 0,
    products: [
      { name: "Batata chips", portions: 3, grams: 50, sodium: 170, className: "nutrition-card--blue" },
      { name: "Palitos salgados", portions: 4, grams: 20, sodium: 501, className: "nutrition-card--green" },
      { name: "Biscoito multigrãos", portions: 8, grams: 25, sodium: 264, className: "nutrition-card--purple" },
      { name: "Biscoito de polvilho", portions: 6, grams: 15, sodium: 175, className: "nutrition-card--peach" },
      { name: "Biscoito de água e sal", portions: 5, grams: 40, sodium: 166, className: "nutrition-card--yellow" }
    ],
    explanation: "Para descobrir a quantidade total de sódio em cada pacote, multiplicamos o número de porções pela quantidade de sódio de uma porção. Batata chips: 3 × 170 = 510 mg. Palitos salgados: 4 × 501 = 2 004 mg. Biscoito multigrãos: 8 × 264 = 2 112 mg. Biscoito de polvilho: 6 × 175 = 1 050 mg. Biscoito de água e sal: 5 × 166 = 830 mg. O menor total é 510 mg, portanto a alternativa correta é A — Batata chips."
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q143-2025-v1";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      delete answers[official.id];
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch {
      localStorage.removeItem("mente-answers");
    }
    localStorage.setItem(migrationKey, "true");
  }

  function applyCatalogOverride() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;
    const index = questions.findIndex((item) => item.id === official.id);
    if (index >= 0) Object.assign(questions[index], official, { visual: null });
    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#statistics-data-official-styles")) return;
    const style = document.createElement("style");
    style.id = "statistics-data-official-styles";
    style.textContent = `
      .nutrition-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:22px 0}
      .nutrition-card{padding:15px 16px;border:1px solid #dfe6ee;border-radius:14px;text-align:center;color:#26384e;font-size:12px;line-height:1.55}
      .nutrition-card strong{display:block;margin-bottom:5px;font-size:14px;color:#18334c}
      .nutrition-card--blue{background:#d9f1ff}.nutrition-card--green{background:#dff3dd}.nutrition-card--purple{background:#eee6ff}.nutrition-card--peach{background:#ffe3d8}.nutrition-card--yellow{background:#fff3bd}
      .nutrition-card:last-child{grid-column:1/-1;max-width:360px;width:100%;justify-self:center}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
      @media(max-width:620px){.nutrition-grid{grid-template-columns:1fr}.nutrition-card:last-child{grid-column:auto;max-width:none}}
    `;
    document.head.appendChild(style);
  }

  function nutritionCards() {
    return `<div class="nutrition-grid" aria-label="Informações nutricionais dos cinco produtos">${official.products.map((product) => `
      <div class="nutrition-card ${product.className}">
        <strong>${product.name}</strong>
        Pacote com ${product.portions} ${product.portions === 1 ? "porção" : "porções"} de ${product.grams} g<br>
        ${product.sodium} mg de sódio por porção
      </div>`).join("")}</div>`;
  }

  function renderDetail() {
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
            <input type="radio" name="statistics-data-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${official.examNumber} · ENEM ${official.year}</h2>
        <p>Compare os dados dos rótulos e transforme a informação “por porção” no total de cada pacote.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${official.category}</span><span>${official.topic}</span><span>ENEM ${official.year}</span><span>${"★".repeat(official.stars)}${"☆".repeat(5 - official.stars)}</span>
        </div>
        <p class="question-statement">Na cantina de uma escola, há cinco alimentos vendidos em pacotes com diferentes quantidades de porções.</p>
        <p class="question-statement">As informações nutricionais contidas nos rótulos desses produtos estão indicadas abaixo.</p>
        ${nutritionCards()}
        <p class="question-statement">Uma estudante opta sempre pelo alimento com a <strong>menor quantidade total de sódio por pacote</strong>.</p>
        <p class="question-statement"><strong>Qual desses produtos deve ser o escolhido pela estudante?</strong></p>
        ${alternatives}
        <button class="portal-button" id="statistics-data-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="statistics-data-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 143 · ENEM 2025</p>
      </article>`;

    const feedback = document.querySelector("#statistics-data-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você comparou corretamente o total de sódio presente em cada pacote.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${official.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> A — Batata chips.</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#statistics-data-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="statistics-data-answer"]:checked');
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
      document.querySelectorAll('input[name="statistics-data-answer"]').forEach((input) => { input.disabled = true; });
      button.disabled = true;
      button.textContent = "Questão já respondida";
      showResult(storedAnswers[official.id]);
    };
  }

  resetOldPlaceholderAnswer();
  if (document.querySelector("#questions-grid")) applyCatalogOverride();
  if (document.querySelector("#question-content")) {
    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    if (selected?.id === official.id && selected?.examNumber === official.examNumber) renderDetail();
  }
})();
