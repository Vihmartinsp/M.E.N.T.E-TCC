"use strict";

(() => {
  const officialQuestion = {
    id: 10,
    examNumber: 160,
    category: "Funções",
    topic: "Função tangente: parâmetros, deslocamentos e assíntotas",
    year: 2025,
    stars: 5,
    text: "Uma função tangente descreve a distância da lâmina de água ao tampo da mesa. Qual expressão representa corretamente a relação entre D e T?",
    detail: "Um recipiente tem um formato que faz com que, ao ser enchido de água com uma vazão constante, a distância D da lâmina de água ao tampo da mesa, em centímetro, aumente em relação ao tempo T, em minuto, de acordo com uma função do tipo D = k + tg[p(T + m)], sendo os parâmetros k, p e m números reais, para T variando entre 0 e 4 minutos, conforme ilustrado na figura, na qual estão apresentadas assíntotas verticais da função tangente utilizada na definição de D. A expressão algébrica que representa a relação entre D e T é",
    options: [
      "D = 2,5 + tg{30[T − (5 − 2π)/2]}",
      "D = 4 + tg{30(T + 5/2)}",
      "D = 4 + tg{2,5[T + (5 + 2π)/2]}",
      "D = 30 + tg{(1/2)(T − 5)}",
      "D = 30 + tg{(1/2)(T − 5/2)}"
    ],
    correct: 4,
    explanationHtml: `
      <div class="mente-solution">
        <h3>1. Primeiro: vamos entender o enunciado</h3>
        <p>Aqui não basta reconhecer uma tangente. Precisamos descobrir como o gráfico básico de tg foi deslocado e esticado para coincidir com a curva mostrada.</p>
        <h3>2. O que precisamos perceber?</h3>
        <p>O ponto central do ramo está em T = 2,5 e D = 30. Nesse ponto, o argumento da tangente pode ser zero, então tg(0) = 0. Isso permite identificar k = 30 e o deslocamento horizontal para T = 2,5.</p>
        <h3>3. Onde está a armadilha?</h3>
        <p>Os números 4 e 2,5 aparecem no gráfico, mas não significam automaticamente k ou p. O parâmetro precisa ser deduzido pelo efeito que causa no gráfico.</p>
        <h3>4. Agora vamos montar a resolução</h3>
        <p>Começamos pelo ponto central, depois usamos as assíntotas. Na tangente padrão, a distância do centro até uma assíntota é π/2. Com o fator p dentro da função, essa distância passa a ser π/(2p).</p>
        <h3>5. Resolução matemática</h3>
        <p><strong>Dados:</strong> forma D = k + tg[p(T + m)]; ponto central (2,5; 30); assíntotas em 2,5 − π e 2,5 + π.</p>
        <p><strong>Precisamos descobrir:</strong> k, p e m.</p>
        <p><strong>Estratégia:</strong> usar o ponto central e a distância às assíntotas.</p>
        <div class="solution-math">No ponto central: D = k = 30.<br>Para o argumento ser zero em T = 2,5: 2,5 + m = 0 → m = −2,5 = −5/2.<br>Distância do centro a cada assíntota: π.<br>π/(2p) = π → 1/(2p) = 1 → p = 1/2.<br>D = 30 + tg[(1/2)(T − 5/2)]</div>
        <p><strong>Resultado:</strong> alternativa E.</p>
        <h3>6. Por que as alternativas erradas estão erradas?</h3>
        <ul>
          <li><strong>A:</strong> usa 2,5 como deslocamento vertical e 30 como fator horizontal. O gráfico mostra que o nível central é D = 30, não D = 2,5.</li>
          <li><strong>B:</strong> usa k = 4, embora 4 seja um valor do eixo do tempo. Também não respeita o ponto central em T = 2,5.</li>
          <li><strong>C:</strong> novamente usa 4 como deslocamento vertical e mistura o valor 2,5 com o fator de escala horizontal.</li>
          <li><strong>D:</strong> acerta k = 30 e p = 1/2, mas T − 5 colocaria o centro do ramo em T = 5. O gráfico mostra o centro em T = 2,5.</li>
        </ul>
        <h3>7. Por que a alternativa correta está correta?</h3>
        <p>A alternativa E possui k = 30, deslocamento horizontal para T = 2,5 e p = 1/2, exatamente os três comportamentos mostrados no gráfico.</p>
        <h3>8. Dica M.E.N.T.E</h3>
        <p>Em funções transformadas, não tente adivinhar todos os parâmetros ao mesmo tempo. Descubra um efeito por vez: deslocamento vertical, deslocamento horizontal e escala.</p>
      </div>`
  };

  function resetAnswer() {
    const migrationKey = "mente-funcoes-final-q160-v2";
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
    if (document.querySelector("#function-tangent-final-styles")) return;
    const style = document.createElement("style");
    style.id = "function-tangent-final-styles";
    style.textContent = `
      .tangent-question-wrap{margin:24px auto;padding:18px;border:1px solid var(--line);border-radius:14px;background:#fbfcfe;max-width:690px}.tangent-question-wrap svg{display:block;width:100%;height:auto}.tangent-axis{stroke:#475569;stroke-width:2}.tangent-guide{stroke:#94a3b8;stroke-width:1.5;stroke-dasharray:5 5}.tangent-asymptote{stroke:#65a30d;stroke-width:2;stroke-dasharray:5 5}.tangent-curve{fill:none;stroke:#AB47BC;stroke-width:5;stroke-linecap:round}.tangent-question-wrap text{font-family:Inter,Arial,sans-serif;fill:#475569;font-size:14px;font-weight:700}
      .mente-solution{margin-top:18px}.mente-solution h3{margin:22px 0 8px;color:#71357d;font-size:17px}.mente-solution p,.mente-solution li{line-height:1.7;color:#526174}.mente-solution ul{padding-left:22px}.solution-math{margin:14px 0;padding:14px 16px;border:1px solid #e4d1e8;border-radius:12px;background:#fbf5fc;color:#402448;font-weight:700;line-height:1.9}.official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function tangentGraph() {
    return `<figure class="tangent-question-wrap"><svg viewBox="0 0 690 390" role="img" aria-label="Gráfico de uma função tangente com ponto central em T igual a 2,5 e D igual a 30 e assíntotas em 2,5 menos pi e 2,5 mais pi"><line class="tangent-axis" x1="90" y1="325" x2="620" y2="325"/><line class="tangent-axis" x1="180" y1="350" x2="180" y2="35"/><line class="tangent-asymptote" x1="115" y1="45" x2="115" y2="335"/><line class="tangent-asymptote" x1="575" y1="45" x2="575" y2="335"/><line class="tangent-guide" x1="180" y1="205" x2="390" y2="205"/><line class="tangent-guide" x1="390" y1="325" x2="390" y2="205"/><line class="tangent-guide" x1="515" y1="325" x2="515" y2="135"/><path class="tangent-curve" d="M125 315 C155 300 165 250 185 215 C220 160 285 130 390 205 C445 245 475 175 515 135 C535 115 550 82 565 55"/><circle cx="390" cy="205" r="5" fill="#AB47BC"/><text x="165" y="342">0</text><text x="378" y="346">2,5</text><text x="507" y="346">4</text><text x="145" y="210">30</text><text x="92" y="365">(5 − 2π)/2</text><text x="525" y="365">(5 + 2π)/2</text><text x="625" y="342">T</text><text x="165" y="48">D</text></svg></figure>`;
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

    const alternatives = `<fieldset class="answer-options" ${previous ? "disabled" : ""}><legend>Escolha uma alternativa</legend>${officialQuestion.options.map((option, index) => `<label class="${previous?.selected === index ? "is-saved" : ""}"><input type="radio" name="function-tangent-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}><strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span></label>`).join("")}</fieldset>`;

    root.innerHTML = `<section class="portal-hero"><h2>Questão ${officialQuestion.examNumber} · ENEM ${officialQuestion.year}</h2></section><article class="portal-card"><div class="question-detail__meta"><span>${officialQuestion.category}</span><span>${officialQuestion.topic}</span><span>ENEM ${officialQuestion.year}</span><span>★★★★★</span></div><p class="question-statement">${officialQuestion.detail}</p>${tangentGraph()}${alternatives}<button class="portal-button" id="function-tangent-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button><div id="function-tangent-feedback" class="answer-feedback" role="status"></div><p class="official-source">Questão 160 · ENEM 2025</p></article>`;

    const feedback = document.querySelector("#function-tangent-feedback");
    const showResult = (answer) => {
      const status = answer.correct ? "result-box--correct" : "result-box--wrong";
      const title = answer.correct ? "Parabéns, você acertou!" : "Vamos destrinchar esta questão";
      feedback.innerHTML = `<div class="result-box ${status}"><h3>${title}</h3><p class="result-box__answer"><strong>Resposta correta:</strong> E — ${officialQuestion.options[officialQuestion.correct]}</p>${officialQuestion.explanationHtml}</div>`;
    };
    if (previous) showResult(previous);

    const button = document.querySelector("#function-tangent-complete");
    if (!button || previous) return;
    button.onclick = () => {
      const selected = document.querySelector('input[name="function-tangent-answer"]:checked');
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
      document.querySelectorAll('input[name="function-tangent-answer"]').forEach((input) => { input.disabled = true; });
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
