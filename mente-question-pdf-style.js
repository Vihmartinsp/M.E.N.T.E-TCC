"use strict";

(() => {
  const moduleOrder = [
    "Geometria",
    "Funções",
    "Estatística e Probabilidade",
    "Matemática Financeira",
    "Grandezas e Medidas",
    "Gráficos e Tabelas",
  ];

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

  function allQuestions() {
    const modules = window.MENTE_FINAL_MODULES || {};
    return moduleOrder.flatMap((category) => modules[category]?.questions || []);
  }

  function currentQuestion() {
    const idFromUrl = Number(new URLSearchParams(location.search).get("id"));
    let id = idFromUrl;
    if (!id) {
      try {
        id = Number(JSON.parse(localStorage.getItem("mente-selected-question") || "null")?.id) || 0;
      } catch {
        id = 0;
      }
    }
    return allQuestions().find((question) => Number(question.id) === id) || null;
  }

  function savedAnswer(questionId) {
    try {
      return JSON.parse(localStorage.getItem("mente-answers") || "{}")[questionId] || null;
    } catch {
      return null;
    }
  }

  function wrongAlternativesHtml(text) {
    if (!text) return "";
    const matches = [...String(text).matchAll(/Alternativa\s+([A-E]):\s*([\s\S]*?)(?=Alternativa\s+[A-E]:|$)/gi)];
    if (!matches.length) return `<p>${esc(text)}</p>`;
    return matches.map((match) => (
      `<p class="mente-pdf-wrong-line"><strong>Alternativa ${esc(match[1].toUpperCase())}:</strong> ${esc(match[2].trim())}</p>`
    )).join("");
  }

  function explanationHtml(question, answer) {
    const resultClass = answer?.correct ? "is-correct" : "is-wrong";
    const resultTitle = answer?.correct ? "✅ Você acertou!" : "Vamos transformar esse erro em aprendizado";

    return `
      <div class="mente-pdf-explanation ${resultClass}">
        <h3 class="mente-pdf-result-title">${resultTitle}</h3>

        <section class="mente-pdf-step">
          <h4>1. Primeiro: vamos entender o enunciado</h4>
          <p class="mente-pdf-blue">${esc(question.objective)}</p>
          <p>${esc(question.understand)}</p>
        </section>

        <section class="mente-pdf-step">
          <h4>2. O que precisamos perceber?</h4>
          <p class="mente-pdf-green">${esc(question.data)}</p>
          <p class="mente-pdf-orange">${esc(question.clue)}</p>
          <div class="mente-pdf-bullets">${esc(question.perceive).replace(/•/g, "<br>•")}</div>
        </section>

        <section class="mente-pdf-step">
          <h4>3. Onde está a armadilha?</h4>
          <p class="mente-pdf-red">${esc(question.trapDetail || question.trap)}</p>
        </section>

        <section class="mente-pdf-step">
          <h4>4. Agora vamos montar a resolução</h4>
          <p class="mente-pdf-purple">${esc(question.strategy)}</p>
          <p>${esc(question.setup)}</p>
        </section>

        <section class="mente-pdf-step">
          <h4>5. Resolução matemática</h4>
          <p class="mente-pdf-red mente-pdf-resolution">${esc(question.resolution)}</p>
        </section>

        <section class="mente-pdf-step">
          <h4>6. Se você marcou outra alternativa</h4>
          <div class="mente-pdf-wrongs">${wrongAlternativesHtml(question.wrong)}</div>
        </section>

        <section class="mente-pdf-step">
          <h4>7. Por que a alternativa correta está correta?</h4>
          <p class="mente-pdf-green mente-pdf-correct">${esc(question.correctExplanation)}</p>
        </section>

        <section class="mente-pdf-step">
          <h4>8. Dica M.E.N.T.E</h4>
          <p class="mente-pdf-purple mente-pdf-tip">${esc(question.tip)}</p>
        </section>
      </div>`;
  }

  function applyPdfStyle() {
    const root = document.querySelector("#question-content");
    const question = currentQuestion();
    if (!root || !question) return;

    // O bloco em cartões Objetivo/Dados/Pista/Armadilha/Estratégia foi retirado
    // de todas as questões. As mesmas cores agora aparecem dentro da explicação.
    root.querySelectorAll(".mente-reading").forEach((element) => element.remove());

    const feedback = root.querySelector("#mente-final-feedback");
    const answer = savedAnswer(question.id);
    if (feedback && answer) feedback.innerHTML = explanationHtml(question, answer);
  }

  function start() {
    applyPdfStyle();
    const root = document.querySelector("#question-content");
    if (!root) return;

    const observer = new MutationObserver(() => {
      const question = currentQuestion();
      if (!question) return;
      root.querySelectorAll(".mente-reading").forEach((element) => element.remove());
      const feedback = root.querySelector("#mente-final-feedback");
      const answer = savedAnswer(question.id);
      if (feedback && answer && !feedback.querySelector(".mente-pdf-explanation")) {
        feedback.innerHTML = explanationHtml(question, answer);
      }
    });
    observer.observe(root, { childList: true, subtree: true });

    document.addEventListener("click", (event) => {
      if (!event.target.closest?.("#mente-final-answer")) return;
      setTimeout(applyPdfStyle, 80);
      setTimeout(applyPdfStyle, 350);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(start, 0));
  else setTimeout(start, 0);
})();
