"use strict";

(() => {
  const officialQuestion = {
    id: 10,
    examNumber: 180,
    category: "Funções",
    topic: "Função afim e variação por rodadas",
    year: 2025,
    stars: 5,
    text: "Quatro jogadores começam com 100 moedas e, a cada rodada, fazem transferências fixas entre as posições 1, 2, 3 e 4. Qual expressão representa o número de moedas do jogador da posição 1 após n rodadas?",
    detail: "Quatro amigos, cada um com 100 moedas, criaram um jogo no qual cada um assume uma das quatro posições, 1, 2, 3 ou 4, indicadas na figura, e nela permanece até o final. Em cada rodada, o jogador na posição 1 transfere 1 moeda para o jogador na posição 2; o jogador na posição 2 transfere 2 moedas para o jogador na posição 3; o jogador na posição 3 transfere 3 moedas para o jogador na posição 4; e o jogador na posição 4 transfere 4 moedas para o jogador na posição 1, completando a rodada. Ao final da rodada n, qual é a expressão algébrica que representa o número de moedas do jogador na posição 1?",
    options: ["103 + 4n", "103 + 3n", "100 + 4n", "100 + 3n", "99 + 4n"],
    correct: 3,
    explanation: "O jogador da posição 1 começa com 100 moedas. Em cada rodada, ele perde 1 moeda ao transferi-la para a posição 2, mas recebe 4 moedas da posição 4. Portanto, seu saldo líquido por rodada é +3 moedas. Depois de n rodadas, ele terá 100 + 3n moedas. A alternativa correta é D.",
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q180-2025-v1";
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
    if (document.querySelector("#coin-game-official-styles")) return;
    const style = document.createElement("style");
    style.id = "coin-game-official-styles";
    style.textContent = `
      .coin-game-wrap{margin:24px auto;padding:18px;border:1px solid var(--line);border-radius:14px;background:#fbfcfe;max-width:520px}
      .coin-game{display:block;width:min(420px,100%);height:auto;margin:0 auto}
      .coin-game .ring{fill:none;stroke:#94a3b8;stroke-width:4;stroke-dasharray:8 8}
      .coin-game .arrow{fill:none;stroke:#475569;stroke-width:3;marker-end:url(#coinArrow)}
      .coin-game .node{stroke:#fff;stroke-width:4}
      .coin-game .n1{fill:#d4a017}.coin-game .n2{fill:#5b21b6}.coin-game .n3{fill:#f97316}.coin-game .n4{fill:#16a34a}
      .coin-game text{font-family:Inter,Arial,sans-serif;font-weight:900;fill:#fff;font-size:18px;text-anchor:middle;dominant-baseline:middle}
      .coin-game-caption{margin:8px 0 0;text-align:center;color:var(--muted);font-size:12px;line-height:1.55}
      .transfer-list{display:grid;gap:9px;margin:18px 0;padding:0;list-style:none}
      .transfer-list li{padding:11px 13px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#526174;font-size:13px}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function gameVisual() {
    return `
      <figure class="coin-game-wrap">
        <svg class="coin-game" viewBox="0 0 420 330" role="img" aria-label="Quatro posições organizadas em ciclo, da posição 1 para 2, 2 para 3, 3 para 4 e 4 para 1">
          <defs><marker id="coinArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#475569"/></marker></defs>
          <path class="ring" d="M210 55 C310 55 350 120 350 165 C350 245 285 285 210 285 C135 285 70 245 70 165 C70 100 125 55 210 55"/>
          <path class="arrow" d="M235 67 C292 82 326 119 331 150"/>
          <path class="arrow" d="M330 186 C313 236 273 261 230 270"/>
          <path class="arrow" d="M190 270 C140 258 101 225 88 185"/>
          <path class="arrow" d="M89 145 C105 100 145 74 188 65"/>
          <circle class="node n1" cx="210" cy="55" r="30"/><text x="210" y="55">1</text>
          <circle class="node n2" cx="350" cy="165" r="30"/><text x="350" y="165">2</text>
          <circle class="node n3" cx="210" cy="285" r="30"/><text x="210" y="285">3</text>
          <circle class="node n4" cx="70" cy="165" r="30"/><text x="70" y="165">4</text>
        </svg>
        <figcaption class="coin-game-caption">Em cada rodada, as moedas circulam pelas posições 1 → 2 → 3 → 4 → 1.</figcaption>
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
            <input type="radio" name="coin-game-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${officialQuestion.examNumber} · ENEM ${officialQuestion.year}</h2>
        <p>Observe quanto o jogador da posição 1 perde e recebe em cada rodada e transforme essa variação em uma expressão.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${officialQuestion.category}</span><span>${officialQuestion.topic}</span><span>ENEM ${officialQuestion.year}</span><span>${"★".repeat(officialQuestion.stars)}${"☆".repeat(5 - officialQuestion.stars)}</span>
        </div>
        <p class="question-statement">Quatro amigos, cada um com 100 moedas, criaram um jogo no qual cada um assume uma das quatro posições, 1, 2, 3 ou 4, e nela permanece até o final.</p>
        ${gameVisual()}
        <p class="question-statement">Em cada rodada, as transferências são:</p>
        <ul class="transfer-list">
          <li>posição 1 transfere <strong>1 moeda</strong> para a posição 2;</li>
          <li>posição 2 transfere <strong>2 moedas</strong> para a posição 3;</li>
          <li>posição 3 transfere <strong>3 moedas</strong> para a posição 4;</li>
          <li>posição 4 transfere <strong>4 moedas</strong> para a posição 1.</li>
        </ul>
        <p class="question-statement"><strong>Ao final da rodada n, qual expressão representa o número de moedas do jogador da posição 1?</strong></p>
        ${alternatives}
        <button class="portal-button" id="coin-game-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="coin-game-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 180 · ENEM 2025</p>
      </article>`;

    const feedback = document.querySelector("#coin-game-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você identificou corretamente a variação de moedas por rodada.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${officialQuestion.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> D — 100 + 3n</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#coin-game-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="coin-game-answer"]:checked');
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
      document.querySelectorAll('input[name="coin-game-answer"]').forEach((input) => { input.disabled = true; });
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
