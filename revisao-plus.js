"use strict";

(() => {
  const root = document.querySelector("#plus-review-root");
  if (!root) return;

  const subjectInfo = {
    "Geometria": "📐",
    "Funções": "ƒ",
    "Estatística e Probabilidade": "📊",
    "Matemática Financeira": "💰",
    "Grandezas e Medidas": "📏",
    "Gráficos e Tabelas": "📈",
  };

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }

  function allQuestions() {
    const modules = window.MENTE_FINAL_MODULES || {};
    return Object.values(modules).flatMap((module) => module?.questions || []);
  }

  function normalizeAnswer(answer) {
    if (!answer) return null;
    if (typeof answer.correct === "boolean") return answer.correct;
    if (typeof answer.acertou === "boolean") return answer.acertou;
    return null;
  }

  function buildData() {
    const answers = readJson("mente-answers", {});
    const questions = allQuestions();
    const rows = questions.map((question) => {
      const answer = answers[question.id] || answers[String(question.id)];
      const correct = normalizeAnswer(answer);
      return { question, answer, correct };
    }).filter((item) => item.answer && item.correct !== null);

    const stats = new Map();
    Object.keys(subjectInfo).forEach((name) => stats.set(name, { name, total: 0, correct: 0, wrong: 0 }));
    rows.forEach((item) => {
      const name = item.question.category || item.question.subject || "Matemática";
      if (!stats.has(name)) stats.set(name, { name, total: 0, correct: 0, wrong: 0 });
      const row = stats.get(name);
      row.total += 1;
      if (item.correct) row.correct += 1; else row.wrong += 1;
    });

    const practiced = [...stats.values()].filter((item) => item.total > 0).map((item) => ({ ...item, accuracy: Math.round(item.correct / item.total * 100) }));
    practiced.sort((a,b) => a.accuracy - b.accuracy || b.wrong - a.wrong);
    const priority = practiced[0] || null;
    const total = rows.length;
    const correct = rows.filter((item) => item.correct).length;
    const accuracy = total ? Math.round(correct / total * 100) : 0;

    const wrong = rows.filter((item) => item.correct === false);
    const orderedWrong = priority
      ? [...wrong].sort((a,b) => Number((b.question.category === priority.name)) - Number((a.question.category === priority.name)))
      : wrong;

    return { rows, practiced, priority, total, correct, accuracy, wrong: orderedWrong, questions };
  }

  function questionLabel(question) {
    const number = question.examNumber || question.enem_numero || question.id;
    const year = question.examYear || question.enem_ano || "";
    return `Questão ${number}${year ? ` · ENEM ${year}` : ""}`;
  }

  function topicLabel(question) {
    return question.topic || question.topico || question.content || "Conteúdo da matéria";
  }

  function renderLocked() {
    root.innerHTML = `<section class="plus-review-locked"><span>🔒</span><h2>Revisão Inteligente é um recurso Plus</h2><p>No plano convencional, você continua com questões, explicações, simulados prontos e roteiro de estudos. No Plus, seus erros são reunidos automaticamente em uma fila de revisão priorizada.</p><a href="plus.html">Conhecer o M.E.N.T.E Plus →</a></section>`;
  }

  function renderPlus() {
    const data = buildData();
    const priorityName = data.priority?.name || "Ainda sem diagnóstico";
    const priorityAccuracy = data.priority ? `${data.priority.accuracy}%` : "—";
    const queue = data.wrong.slice(0, 8);

    root.innerHTML = `<div class="plus-review-page">
      <section class="plus-review-hero">
        <div><small>★ Recurso M.E.N.T.E Plus</small><h2>Revisão Inteligente</h2><p>O sistema organiza suas respostas erradas, identifica a matéria que mais precisa de atenção e cria uma fila curta para você revisar sem procurar manualmente.</p></div>
        <aside class="plus-review-score"><strong>${data.total ? `${data.accuracy}%` : "—"}</strong><span>taxa atual de acertos</span></aside>
      </section>

      <section class="plus-review-section">
        <div class="plus-review-head"><div><h3>Diagnóstico automático</h3><p>Baseado no histórico de questões registrado neste perfil.</p></div><span class="plus-review-pill">PLUS</span></div>
        <div class="plus-review-priority">
          <article class="plus-review-stat"><small>Prioridade</small><strong>${esc(priorityName)}</strong></article>
          <article class="plus-review-stat"><small>Desempenho nessa prioridade</small><strong>${priorityAccuracy}</strong></article>
          <article class="plus-review-stat"><small>Questões para revisar</small><strong>${data.wrong.length}</strong></article>
        </div>
      </section>

      <section class="plus-review-section">
        <div class="plus-review-head"><div><h3>Sua fila de revisão</h3><p>Erros da matéria prioritária aparecem primeiro.</p></div></div>
        ${queue.length ? `<div class="plus-review-list">${queue.map((item,index) => {
          const q = item.question;
          const subject = q.category || q.subject || "Matemática";
          return `<article class="plus-review-item"><span class="plus-review-item__index">${index + 1}</span><div><strong>${subjectInfo[subject] || "✦"} ${esc(subject)} · ${esc(questionLabel(q))}</strong><span>${esc(topicLabel(q))} · resposta anterior incorreta</span></div><a href="questao.html?id=${encodeURIComponent(q.id)}">Revisar questão →</a></article>`;
        }).join("")}</div>` : `<div class="plus-review-empty">${data.total ? "Você não tem erros registrados agora. Ótimo momento para fazer novas questões e manter a revisão atualizada." : "Responda algumas questões para o Plus montar sua primeira fila de revisão."}</div>`}
      </section>
    </div>`;
  }

  function render() {
    if (window.MENTE_PLUS?.isActive?.()) renderPlus(); else renderLocked();
  }

  window.addEventListener("mente:plan-updated", render);
  window.addEventListener("load", render, { once: true });
  setTimeout(render, 800);
})();
