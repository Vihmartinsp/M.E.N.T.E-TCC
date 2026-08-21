"use strict";

(() => {
  const officialQuestions = {
    1: {
      id: 1,
      examNumber: 150,
      category: "Geometria",
      topic: "Geometria plana e medidas",
      year: 2024,
      stars: 2,
      text: "Uma sala de 3 m por 6 m será dividida por colunas cilíndricas. Considerando os limites de raio e de espaçamento entre colunas e paredes, em qual loja a compra terá o menor custo total?",
      detail: "Uma sala com piso no formato retangular, com lados de medidas 3 m e 6 m, será dividida em dois ambientes. Para isso, serão utilizadas colunas em formato cilíndrico, dispostas perpendicularmente ao piso e representadas na figura pelos círculos de cor azul. Os centros desses círculos estarão sobre uma reta paralela aos lados de menor medida do piso da sala. Os vãos entre duas colunas e entre uma coluna e a parede não poderão ser superiores a 15 cm. Para efetuar a compra dessas colunas, foram feitos orçamentos com base em dados fornecidos por cinco lojas. A compra será realizada na loja cujo orçamento resulte no menor valor total possível. A compra será realizada na loja",
      options: ["I", "II", "III", "IV", "V"],
      correct: 2,
      explanation: "A divisória ocupa os 3 m do lado menor da sala, isto é, 300 cm. Para uma coluna de raio r, o diâmetro é 2r. Com n colunas, existem n + 1 vãos (incluindo os dois vãos junto às paredes), cada um podendo medir no máximo 15 cm. Assim, precisamos de n(2r) + (n + 1)·15 ≥ 300. Loja I: raio 5 cm → 12 colunas → R$ 720. Loja II: raio 10 cm → 9 colunas → R$ 630. Loja III: raio 12 cm → 8 colunas → R$ 600. Loja IV: raio 15 cm → 7 colunas → R$ 630. A Loja V não atende ao limite, pois o raio é 20 cm. Portanto, o menor custo é o da Loja III.",
      stores: [
        ["I", "5", "60"],
        ["II", "10", "70"],
        ["III", "12", "75"],
        ["IV", "15", "90"],
        ["V", "20", "120"],
      ],
    },
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q150-2024-v1";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      delete answers[1];
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch {
      localStorage.removeItem("mente-answers");
    }
    localStorage.setItem(migrationKey, "true");
  }

  function applyCatalogOverrides() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;

    Object.values(officialQuestions).forEach((official) => {
      const index = questions.findIndex((item) => item.id === official.id);
      if (index >= 0) Object.assign(questions[index], official, { visual: null });
    });

    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addOfficialStyles() {
    if (document.querySelector("#official-question-styles")) return;
    const style = document.createElement("style");
    style.id = "official-question-styles";
    style.textContent = `
      .official-question-visual{margin:24px auto;padding:18px;border:1px solid var(--line);border-radius:14px;background:#fbfcfe}
      .official-room{display:block;width:min(460px,100%);height:auto;margin:0 auto}
      .official-room text{font-family:Inter,Arial,sans-serif;fill:#34445d;font-size:14px;font-weight:700}
      .official-question-caption{margin:10px 0 0;color:var(--muted);font-size:11px;line-height:1.5;text-align:center}
      .official-budget-table{width:min(520px,100%);margin:22px auto;border-collapse:collapse;background:#fff;font-size:12px}
      .official-budget-table th,.official-budget-table td{padding:9px 12px;border:1px solid #cfd8e5;text-align:center}
      .official-budget-table th{color:#263851;background:#edf2f7;font-weight:800}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function roomDiagram() {
    return `
      <figure class="official-question-visual">
        <svg class="official-room" viewBox="0 0 520 275" role="img" aria-label="Sala retangular de 6 metros por 3 metros dividida por uma fileira de colunas">
          <rect x="70" y="50" width="380" height="190" rx="2" fill="#dff1df" stroke="#475569" stroke-width="2"/>
          <line x1="70" y1="34" x2="450" y2="34" stroke="#64748b" stroke-width="1.5"/>
          <line x1="70" y1="28" x2="70" y2="40" stroke="#64748b" stroke-width="1.5"/>
          <line x1="450" y1="28" x2="450" y2="40" stroke="#64748b" stroke-width="1.5"/>
          <text x="250" y="25">6 m</text>
          <line x1="468" y1="50" x2="468" y2="240" stroke="#64748b" stroke-width="1.5"/>
          <line x1="462" y1="50" x2="474" y2="50" stroke="#64748b" stroke-width="1.5"/>
          <line x1="462" y1="240" x2="474" y2="240" stroke="#64748b" stroke-width="1.5"/>
          <text x="478" y="150">3 m</text>
          <g fill="#168bd2" stroke="#0d69a6" stroke-width="1">
            <circle cx="260" cy="72" r="7"/><circle cx="260" cy="93" r="7"/><circle cx="260" cy="114" r="7"/>
            <circle cx="260" cy="135" r="7"/><circle cx="260" cy="156" r="7"/><circle cx="260" cy="177" r="7"/>
            <circle cx="260" cy="198" r="7"/><circle cx="260" cy="219" r="7"/>
          </g>
        </svg>
        <figcaption class="official-question-caption">Os centros das colunas ficam alinhados paralelamente aos lados de 3 m da sala.</figcaption>
      </figure>`;
  }

  function budgetTable(stores) {
    return `
      <table class="official-budget-table" aria-label="Orçamentos das cinco lojas">
        <thead><tr><th>Loja</th><th>Raio (cm)</th><th>Preço por unidade (R$)</th></tr></thead>
        <tbody>${stores.map(([store, radius, price]) => `<tr><td>${store}</td><td>${radius}</td><td>${price}</td></tr>`).join("")}</tbody>
      </table>`;
  }

  function renderOfficialDetail(official) {
    const root = document.querySelector("#question-content");
    if (!root) return;

    addOfficialStyles();

    const answersKey = "mente-answers";
    const pointsKey = "mente-points";
    const storedAnswers = JSON.parse(localStorage.getItem(answersKey) || "{}");
    const previous = storedAnswers[official.id];
    const alternatives = `
      <fieldset class="answer-options" ${previous ? "disabled" : ""}>
        <legend>Escolha uma alternativa</legend>
        ${official.options.map((option, index) => `
          <label class="${previous?.selected === index ? "is-saved" : ""}">
            <input type="radio" name="official-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${official.examNumber} · ENEM ${official.year}</h2>
        <p>Leia com atenção, destaque os dados importantes e escolha a alternativa que melhor responde ao problema.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${official.category}</span><span>${official.topic}</span><span>ENEM ${official.year}</span><span>${"★".repeat(official.stars)}${"☆".repeat(5 - official.stars)}</span>
        </div>
        <p class="question-statement">Uma sala com piso no formato retangular, com lados de medidas 3 m e 6 m, será dividida em dois ambientes. Para isso, serão utilizadas colunas em formato cilíndrico, dispostas perpendicularmente ao piso. Os centros dessas colunas estarão sobre uma reta paralela aos lados de menor medida do piso da sala. Os vãos entre duas colunas e entre uma coluna e a parede não poderão ser superiores a 15 cm.</p>
        ${roomDiagram()}
        <p class="question-statement">Para efetuar a compra dessas colunas, foram feitos orçamentos com base em dados fornecidos por cinco lojas.</p>
        ${budgetTable(official.stores)}
        <p class="question-statement">A compra será realizada na loja cujo orçamento resulte no menor valor total possível. A compra será realizada na loja</p>
        ${alternatives}
        <button class="portal-button" id="official-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="official-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 150 · ENEM 2024</p>
      </article>`;

    const feedback = document.querySelector("#official-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Continue assim. Seus pontos e seu progresso já foram atualizados.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${official.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> C — III</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#official-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="official-answer"]:checked');
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

      document.querySelectorAll('input[name="official-answer"]').forEach((input) => { input.disabled = true; });
      button.disabled = true;
      button.textContent = "Questão já respondida";
      showResult(storedAnswers[official.id]);
    };
  }

  resetOldPlaceholderAnswer();

  if (document.querySelector("#questions-grid")) {
    applyCatalogOverrides();
  }

  if (document.querySelector("#question-content")) {
    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    const official = selected ? officialQuestions[selected.id] : null;
    if (official && selected.examNumber === official.examNumber) renderOfficialDetail(official);
  }
})();
