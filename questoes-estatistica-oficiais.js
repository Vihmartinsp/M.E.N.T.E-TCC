"use strict";

(() => {
  const statisticsOfficialQuestions = {
    11: {
      id: 11,
      examNumber: 165,
      category: "Estatística e Probabilidade",
      topic: "Média, mediana, moda e desvio padrão",
      year: 2025,
      stars: 4,
      text: "Em um estudo clínico, cinco grupos de 11 mulheres foram comparados a partir de medidas estatísticas de suas idades. Qual grupo certamente possui a maioria das mulheres com idades entre 20 e 30 anos?",
      detail: "Em um estudo clínico, 55 mulheres foram distribuídas, aleatoriamente, em 5 grupos de 11 pessoas. Para testar uma nova medicação, será escolhido um grupo no qual a maioria das mulheres tenha idades entre 20 e 30 anos. Os demais grupos tomarão placebo ou medicações já existentes no mercado. O quadro, parcialmente preenchido, informa alguns dados relativos às idades das mulheres desses grupos. Mesmo com o quadro incompleto, foi possível selecionar um desses grupos porque, apenas com os dados apresentados no quadro, foi identificado um grupo que, certamente, atendia ao critério de escolha. O grupo escolhido foi o",
      options: ["1", "2", "3", "4", "5"],
      correct: 3,
      explanation: "O grupo 4 tem média de 25 anos e desvio padrão igual a 1. Isso mostra que as idades estão muito concentradas em torno de 25. Se pelo menos 6 das 11 mulheres estivessem fora do intervalo de 20 a 30 anos, cada uma dessas idades estaria a mais de 5 anos da média. Só essas 6 mulheres já fariam o desvio padrão ser muito maior que 1. Portanto, não é possível que a maioria esteja fora desse intervalo: no grupo 4, certamente pelo menos 6 mulheres têm entre 20 e 30 anos. Assim, a alternativa correta é D, grupo 4.",
      table: [
        ["1", "", "", "25", "", "", "10"],
        ["2", "", "", "", "25", "", "9"],
        ["3", "", "", "", "", "25", ""],
        ["4", "", "", "25", "", "", "1"],
        ["5", "20", "35", "", "", "", ""],
      ],
    },
  };

  function resetOldPlaceholderAnswer() {
    const migrationKey = "mente-q165-2025-v1";
    if (localStorage.getItem(migrationKey)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      delete answers[11];
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch {
      localStorage.removeItem("mente-answers");
    }
    localStorage.setItem(migrationKey, "true");
  }

  function applyCatalogOverrides() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;

    Object.values(statisticsOfficialQuestions).forEach((official) => {
      const index = questions.findIndex((item) => item.id === official.id);
      if (index >= 0) Object.assign(questions[index], official, { visual: null });
    });

    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
  }

  function addStyles() {
    if (document.querySelector("#statistics-official-question-styles")) return;
    const style = document.createElement("style");
    style.id = "statistics-official-question-styles";
    style.textContent = `
      .statistics-table-wrap{margin:24px 0;overflow-x:auto}
      .statistics-table{width:100%;min-width:680px;border-collapse:collapse;background:#fff;font-size:12px}
      .statistics-table th,.statistics-table td{padding:9px 10px;border:1px solid #cfd8e5;text-align:center}
      .statistics-table th{color:#18354d;background:#dcefdc;font-weight:800}
      .statistics-table td:first-child{font-weight:800;background:#f7faf7}
      .official-source{margin:12px 0 0;color:var(--muted);font-size:11px;text-align:center}
    `;
    document.head.appendChild(style);
  }

  function statisticsTable(rows) {
    const headers = ["Grupo", "Menor idade", "Maior idade", "Média", "Mediana", "Moda", "Desvio padrão"];
    return `
      <div class="statistics-table-wrap">
        <table class="statistics-table" aria-label="Dados estatísticos das idades dos cinco grupos">
          <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((value) => `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>`;
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
            <input type="radio" name="statistics-official-answer" value="${index}" ${previous?.selected === index ? "checked" : ""}>
            <strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span>
          </label>`).join("")}
      </fieldset>`;

    root.innerHTML = `
      <section class="portal-hero">
        <h2>Questão ${official.examNumber} · ENEM ${official.year}</h2>
        <p>Observe quais informações estatísticas permitem garantir onde está a maioria das idades.</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta">
          <span>${official.category}</span><span>${official.topic}</span><span>ENEM ${official.year}</span><span>${"★".repeat(official.stars)}${"☆".repeat(5 - official.stars)}</span>
        </div>
        <p class="question-statement">Em um estudo clínico, 55 mulheres foram distribuídas, aleatoriamente, em 5 grupos de 11 pessoas. Para testar uma nova medicação, será escolhido um grupo no qual a maioria das mulheres tenha idades entre 20 e 30 anos. Os demais grupos tomarão placebo ou medicações já existentes no mercado. O quadro, parcialmente preenchido, informa alguns dados relativos às idades das mulheres desses grupos.</p>
        ${statisticsTable(official.table)}
        <p class="question-statement">Mesmo com o quadro incompleto, foi possível selecionar um desses grupos porque, apenas com os dados apresentados no quadro, foi identificado um grupo que, certamente, atendia ao critério de escolha.</p>
        <p class="question-statement"><strong>O grupo escolhido foi o</strong></p>
        ${alternatives}
        <button class="portal-button" id="statistics-official-complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button>
        <div id="statistics-official-feedback" class="answer-feedback" role="status"></div>
        <p class="official-source">Questão 165 · ENEM 2025</p>
      </article>`;

    const feedback = document.querySelector("#statistics-official-feedback");
    const showResult = (answer) => {
      if (answer.correct) {
        feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Você identificou corretamente o grupo cuja distribuição das idades garante o critério.</p></div>';
      } else {
        feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${official.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> D — grupo 4</p></div>`;
      }
    };

    if (previous) showResult(previous);

    const button = document.querySelector("#statistics-official-complete");
    if (!button || previous) return;

    button.onclick = () => {
      const selected = document.querySelector('input[name="statistics-official-answer"]:checked');
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

      document.querySelectorAll('input[name="statistics-official-answer"]').forEach((input) => { input.disabled = true; });
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
    const official = selected ? statisticsOfficialQuestions[selected.id] : null;
    if (official && selected.examNumber === official.examNumber) renderDetail(official);
  }
})();
