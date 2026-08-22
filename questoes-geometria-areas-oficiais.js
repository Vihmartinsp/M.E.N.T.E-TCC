"use strict";

(() => {
  const officialQuestion = {
    id: 3,
    examNumber: 155,
    category: "Geometria",
    topic: "Áreas de figuras planas",
    year: 2023,
    stars: 3,
    text: "Uma piscina quadrada tem área de 400 m² e será cercada por uma calçada de 5 m de largura. Qual é a área ocupada apenas pela calçada?",
    detail: "Na planta baixa de um clube, a piscina é representada por um quadrado cuja área real mede 400 m². Ao redor dessa piscina, será construída uma calçada, de largura constante igual a 5 m. Qual é a medida da área, em metro quadrado, ocupada pela calçada?",
    options: ["1 000", "900", "600", "500", "400"],
    correct: 3,
    explanation: "Como a piscina é quadrada e tem área de 400 m², seu lado mede √400 = 20 m. A calçada tem 5 m de largura em cada lado, então o quadrado externo mede 20 + 5 + 5 = 30 m de lado. A área total é 30² = 900 m². Retirando a área da piscina, 900 − 400 = 500 m². Portanto, a alternativa correta é D.",
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q155-2023-v1";
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
    if (document.querySelector("#geometry-area-official-styles")) return;
    const style = document.createElement("style");
    style.id = "geometry-area-official-styles";
    style.textContent = `
      .pool-diagram-wrap{margin:24px auto;padding:18px;border:1px solid var(--line);border-radius:14px;background:#fbfcfe;max-width:520px}
      .pool-diagram{display:block;width:min(420px,100%);height:auto;margin:0 auto}
      .pool-diagram text{font-family:Inter,Arial,sans-serif;fill:#334155;font-size:13px;font-weight:700}
      .pool-caption{margin:10px 0 0;color:var(--muted);font-size:12px;text-align:center;line-height:1.5}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function poolDiagram() {
    return `
      <figure class="pool-diagram-wrap">
        <svg class="pool-diagram" viewBox="0 0 460 390" role="img" aria-label="Piscina quadrada cercada por uma calçada de 5 metros de largura">
          <rect x="55" y="35" width="350" height="350" fill="#e5e7eb" stroke="#64748b" stroke-width="2"/>
          <rect x="113" y="93" width="234" height="234" fill="#63c5da" stroke="#0e7490" stroke-width="2"/>
          <text x="205" y="214">Piscina</text>
          <text x="347" y="72">Calçada</text>
          <line x1="340" y1="77" x2="365" y2="105" stroke="#64748b" stroke-width="1.5"/>
          <line x1="113" y1="78" x2="55" y2="78" stroke="#64748b" stroke-width="1.5"/>
          <line x1="113" y1="72" x2="113" y2="84" stroke="#64748b" stroke-width="1.5"/>
          <line x1="55" y1="72" x2="55" y2="84" stroke="#64748b" stroke-width="1.5"/>
          <text x="75" y="67">5 m</text>
          <line x1="98" y1="93" x2="98" y2="35" stroke="#64748b" stroke-width="1.5"/>
          <line x1="92" y1="93" x2="104" y2="93" stroke="#64748b" stroke-width="1.5"/>
          <line x1="92" y1="35" x2="104" y2="35" stroke="#64748b" stroke-width="1.5"/>
          <text x="64" y="68">5 m</text>
          <line x1="347" y1="342" x2="405" y2="342" stroke="#64748b" stroke-width="1.5"/>
          <line x1="347" y1="336" x2="347" y2="348" stroke="#64748b" stroke-width="1.5"/>
          <line x1="405" y1="336" x2="405" y2="348" stroke="#64748b" stroke-width="1.5"/>
          <text x="366" y="331">5 m</text>
          <line x1="362" y1="327" x2="362" y2="385" stroke="#64748b" stroke-width="1.5"/>
          <line x1="356" y1="327" x2="368" y2="327" stroke="#64748b" stroke-width="1.5"/>
          <line x1="356" y1="385" x2="368" y2="385" stroke="#64748b" stroke-width="1.5"/>
          <text x="372" y="361">5 m</text>
        </svg>
        <figcaption class="pool-caption">A piscina ocupa o quadrado azul; a região cinza representa a calçada de 5 m ao redor.</figcaption>
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
            <input type="radio" name="geometry-area-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${officialQuestion.examNumber} · ENEM ${officialQuestion.year}</h2>
        <p>Identifique as duas áreas do desenho e descubra qual parte corresponde somente à calçada.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${officialQuestion.category}</span><span>${officialQuestion.topic}</span><span>ENEM ${officialQuestion.year}</span><span>${"★".repeat(officialQuestion.stars)}${"☆".repeat(5 - officialQuestion.stars)}</span>
        </div>
        <p class="question-statement">${officialQuestion.detail}</p>
        ${poolDiagram()}
        ${alternatives}
        <button class="portal-button" id="geometry-area-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="geometry-area-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 155 · ENEM 2023</p>
      </article>`;

    const feedback = document.querySelector("#geometry-area-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você separou corretamente a área da piscina da área total.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${officialQuestion.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> D — 500 m²</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#geometry-area-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="geometry-area-answer"]:checked');
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
      document.querySelectorAll('input[name="geometry-area-answer"]').forEach((input) => { input.disabled = true; });
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
