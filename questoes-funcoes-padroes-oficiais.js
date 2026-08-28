"use strict";

(() => {
  const officialQuestion = {
    id: 9,
    examNumber: 170,
    category: "Funções",
    topic: "Função logarítmica e escala Richter",
    year: 2024,
    stars: 4,
    text: "Dois terremotos têm magnitudes relacionadas pela escala Richter. Sabendo que o primeiro teve magnitude 6,9 e energia igual a um décimo da energia do segundo, qual é a magnitude aproximada do segundo?",
    detail: "Em uma região com grande incidência de terremotos, observou-se que dois terremotos ocorridos apresentaram magnitudes M1 e M2, medidas segundo a escala Richter, e liberaram energias iguais a E1 e E2, respectivamente. Entre os estudiosos do assunto, é conhecida uma expressão algébrica relacionando esses valores dada por M2 − M1 = (2/3) · log(E2 / E1). Estudos mais abrangentes observaram que o primeiro terremoto apresentou a magnitude M1 = 6,9 e a energia liberada foi um décimo da observada no segundo terremoto. O valor aproximado da magnitude M2 do segundo terremoto, expresso com uma casa decimal, é igual a",
    options: ["5,4", "6,2", "7,6", "8,2", "8,4"],
    correct: 2,
    explanationHtml: `
      <div class="mente-solution">
        <h3>1. Primeiro: vamos entender o enunciado</h3>
        <p>A fórmula já foi fornecida. O desafio principal é traduzir corretamente a frase “a energia do primeiro foi um décimo da observada no segundo”.</p>
        <h3>2. O que precisamos perceber?</h3>
        <p>Se E1 = E2/10, então a razão que aparece na fórmula é E2/E1 = 10. Como o logaritmo é decimal, log(10) = 1.</p>
        <h3>3. Onde está a armadilha?</h3>
        <p>Trocar E2/E1 por E1/E2 muda 10 para 0,1 e faz o logaritmo ficar negativo. Outra armadilha é inverter 2/3 para 3/2.</p>
        <h3>4. Agora vamos montar a resolução</h3>
        <p>Substituímos a razão 10 e M1 = 6,9 na expressão. Depois arredondamos M2 para uma casa decimal.</p>
        <h3>5. Resolução matemática</h3>
        <p><strong>Dados:</strong> M1 = 6,9; E2/E1 = 10; log(10) = 1.</p>
        <p><strong>Precisamos descobrir:</strong> M2.</p>
        <p><strong>Estratégia:</strong> substituir os valores na expressão dada.</p>
        <div class="solution-math">M2 − 6,9 = (2/3)·1<br>M2 = 6,9 + 0,666...<br>M2 = 7,566...<br>Com uma casa decimal: M2 ≈ 7,6</div>
        <p><strong>Resultado:</strong> 7,6 — alternativa C.</p>
        <h3>6. Por que as alternativas erradas estão erradas?</h3>
        <ul>
          <li><strong>A (5,4):</strong> pode surgir ao inverter a razão das energias e ainda trocar 2/3 por 3/2, produzindo 6,9 − 1,5.</li>
          <li><strong>B (6,2):</strong> surge ao inverter E2/E1, usando log(0,1) = −1. Nesse caso seria 6,9 − 2/3.</li>
          <li><strong>D (8,2):</strong> indica uso de um acréscimo maior do que 2/3, como se o fator da expressão tivesse sido alterado.</li>
          <li><strong>E (8,4):</strong> é exatamente o resultado de usar 3/2 no lugar de 2/3: 6,9 + 1,5.</li>
        </ul>
        <h3>7. Por que a alternativa correta está correta?</h3>
        <p>A razão correta é E2/E1 = 10, então o logaritmo vale 1. A magnitude aumenta em 2/3, chegando a aproximadamente 7,6.</p>
        <h3>8. Dica M.E.N.T.E</h3>
        <p>Em fórmulas com razões, transforme primeiro a frase do enunciado em uma igualdade. Isso evita inverter numerador e denominador.</p>
      </div>`
  };

  function resetAnswer() {
    const migrationKey = "mente-funcoes-final-q170-v2";
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
    if (document.querySelector("#function-log-final-styles")) return;
    const style = document.createElement("style");
    style.id = "function-log-final-styles";
    style.textContent = `
      .function-given-formula{margin:22px auto;padding:16px 20px;max-width:520px;border:1px solid #e4d1e8;border-radius:14px;background:#fbf5fc;color:#71357d;font-size:22px;font-weight:900;text-align:center}
      .mente-solution{margin-top:18px}.mente-solution h3{margin:22px 0 8px;color:#71357d;font-size:17px}.mente-solution p,.mente-solution li{line-height:1.7;color:#526174}.mente-solution ul{padding-left:22px}.solution-math{margin:14px 0;padding:14px 16px;border:1px solid #e4d1e8;border-radius:12px;background:#fbf5fc;color:#402448;font-weight:700;line-height:1.9}
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

    const alternatives = `<fieldset class="answer-options" ${previous ? "disabled" : ""}><legend>Escolha uma alternativa</legend>${officialQuestion.options.map((option, index) => `<label class="${previous?.selected === index ? "is-saved" : ""}"><input type="radio" name="function-log-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}><strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span></label>`).join("")}</fieldset>`;

    root.innerHTML = `<section class="portal-hero"><h2>Questão ${officialQuestion.examNumber} · ENEM ${officialQuestion.year}</h2></section><article class="portal-card"><div class="question-detail__meta"><span>${officialQuestion.category}</span><span>${officialQuestion.topic}</span><span>ENEM ${officialQuestion.year}</span><span>★★★★☆</span></div><p class="question-statement">${officialQuestion.detail}</p><div class="function-given-formula">M₂ − M₁ = (2/3) · log(E₂ / E₁)</div>${alternatives}<button class="portal-button" id="function-log-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button><div id="function-log-feedback" class="answer-feedback" role="status"></div><p class="official-source">Questão 170 · ENEM 2024</p></article>`;

    const feedback = document.querySelector("#function-log-feedback");
    const showResult = (answer) => {
      const status = answer.correct ? "result-box--correct" : "result-box--wrong";
      const title = answer.correct ? "Parabéns, você acertou!" : "Vamos destrinchar esta questão";
      feedback.innerHTML = `<div class="result-box ${status}"><h3>${title}</h3><p class="result-box__answer"><strong>Resposta correta:</strong> C — 7,6</p>${officialQuestion.explanationHtml}</div>`;
    };
    if (previous) showResult(previous);

    const button = document.querySelector("#function-log-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="function-log-answer"]:checked');
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
      document.querySelectorAll('input[name="function-log-answer"]').forEach((input) => { input.disabled = true; });
      button.disabled = true;
      button.textContent = "Questão já respondida";
      showResult(storedAnswers[officialQuestion.id]);
    };
  }

  resetAnswer();
  if (document.querySelector("#questions-grid")) applyCatalogOverride();
  if (document.querySelector("#question-content")) {
    let selected = null;
    try { selected = JSON.parse(localStorage.getItem("mente-selected-question") || "null"); } catch { selected = null; }
    if (selected && selected.id === officialQuestion.id && selected.examNumber === officialQuestion.examNumber) renderDetail();
  }
})();
