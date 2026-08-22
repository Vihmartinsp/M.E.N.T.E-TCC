"use strict";

(() => {
  const officialQuestion = {
    id: 4,
    examNumber: 164,
    category: "Geometria",
    topic: "Triângulo equilátero e centro geométrico",
    year: 2024,
    stars: 2,
    text: "Três postos de saúde ficarão em pontos que distam 10 km entre si, e um hospital deve ficar à mesma distância dos três postos. Em qual intervalo está essa distância?",
    detail: "A prefeitura de uma cidade planeja construir três postos de saúde. Esses postos devem ser construídos em locais equidistantes entre si e de forma que as distâncias desses três postos ao hospital dessa cidade sejam iguais. Foram conseguidos três locais para a construção dos postos de saúde que apresentam as características desejadas e que distam 10 km entre si, conforme o esquema, no qual o ponto H representa o local onde está sendo construído o hospital; os pontos P1, P2 e P3, os postos de saúde; e esses quatro pontos estão em um mesmo plano. A distância, em quilômetro, entre o hospital e cada um dos postos de saúde, é um valor entre",
    options: ["2 e 3", "4 e 5", "5 e 6", "7 e 8", "8 e 9"],
    correct: 2,
    explanation: "Como P1, P2 e P3 estão a 10 km uns dos outros, eles formam um triângulo equilátero de lado 10 km. O hospital H está à mesma distância dos três vértices, então ocupa o centro desse triângulo. A altura de um triângulo equilátero de lado 10 é h = 10·√3/2 = 5√3. O centro divide a mediana na razão 2:1, a partir do vértice. Assim, a distância de H a qualquer posto é (2/3)·5√3 = 10√3/3 ≈ 5,77 km. Esse valor está entre 5 e 6 km. Portanto, a alternativa correta é C.",
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q164-2024-v1";
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
    if (document.querySelector("#geometry-center-official-styles")) return;
    const style = document.createElement("style");
    style.id = "geometry-center-official-styles";
    style.textContent = `
      .health-diagram-wrap{margin:24px auto;padding:18px;border:1px solid var(--line);border-radius:14px;background:#fbfcfe;max-width:560px}
      .health-diagram{display:block;width:min(460px,100%);height:auto;margin:0 auto}
      .health-diagram text{font-family:Inter,Arial,sans-serif;fill:#334155;font-size:14px;font-weight:800}
      .health-diagram .side{stroke:#64748b;stroke-width:3;fill:none}
      .health-diagram .radius{stroke:#94a3b8;stroke-width:2;stroke-dasharray:7 6}
      .health-diagram .post{fill:#f59e0b;stroke:#b45309;stroke-width:2}
      .health-diagram .hospital{fill:#2563eb;stroke:#1d4ed8;stroke-width:2}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function healthDiagram() {
    return `
      <figure class="health-diagram-wrap">
        <svg class="health-diagram" viewBox="0 0 500 400" role="img" aria-label="Triângulo equilátero com três postos de saúde e o hospital no centro">
          <path class="side" d="M250 45 L420 340 L80 340 Z"/>
          <line class="radius" x1="250" y1="242" x2="250" y2="45"/>
          <line class="radius" x1="250" y1="242" x2="420" y2="340"/>
          <line class="radius" x1="250" y1="242" x2="80" y2="340"/>
          <circle class="post" cx="250" cy="45" r="10"/>
          <circle class="post" cx="420" cy="340" r="10"/>
          <circle class="post" cx="80" cy="340" r="10"/>
          <circle class="hospital" cx="250" cy="242" r="11"/>
          <text x="266" y="42">P₁</text>
          <text x="432" y="346">P₂</text>
          <text x="45" y="346">P₃</text>
          <text x="266" y="248">H</text>
          <text x="335" y="184">10 km</text>
          <text x="142" y="184">10 km</text>
          <text x="224" y="372">10 km</text>
        </svg>
        <figcaption style="margin-top:10px;text-align:center;color:var(--muted);font-size:12px">Os três postos formam um triângulo equilátero; o hospital está à mesma distância dos três vértices.</figcaption>
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
            <input type="radio" name="geometry-center-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${officialQuestion.examNumber} · ENEM ${officialQuestion.year}</h2>
        <p>Observe a simetria da figura e identifique a relação entre o centro do triângulo e seus vértices.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${officialQuestion.category}</span><span>${officialQuestion.topic}</span><span>ENEM ${officialQuestion.year}</span><span>${"★".repeat(officialQuestion.stars)}${"☆".repeat(5 - officialQuestion.stars)}</span>
        </div>
        <p class="question-statement">${officialQuestion.detail}</p>
        ${healthDiagram()}
        ${alternatives}
        <button class="portal-button" id="geometry-center-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="geometry-center-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 164 · ENEM 2024</p>
      </article>`;

    const feedback = document.querySelector("#geometry-center-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você identificou corretamente a distância do centro aos vértices do triângulo equilátero.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${officialQuestion.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> C — 5 e 6</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#geometry-center-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="geometry-center-answer"]:checked');
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
      document.querySelectorAll('input[name="geometry-center-answer"]').forEach((input) => { input.disabled = true; });
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
