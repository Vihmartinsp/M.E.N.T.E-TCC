"use strict";

(() => {
  const subjectNames = ["Geometria","Funções","Estatística e Probabilidade","Matemática Financeira","Grandezas e Medidas","Gráficos e Tabelas"];
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".roadmap-task__action");
    if (!link || !link.getAttribute("href")?.startsWith("questoes.html")) return;
    const task = link.closest(".roadmap-task");
    const label = task?.querySelector(".roadmap-task__eyebrow")?.textContent || "";
    const subject = subjectNames.find((name) => label.includes(name));
    if (!subject) return;
    event.preventDefault();
    location.href = `questoes.html?materia=${encodeURIComponent(subject)}`;
  });
})();