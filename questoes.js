"use strict";

const DEMO_USER_KEY = "mente-demo-user";

const questions = [
  { id: 1, area: "Matemática", topic: "Geometria", year: 2023, status: "Não respondida", difficulty: "Média", title: "Área de figuras planas", text: "Uma praça retangular receberá um jardim circular em seu centro. Qual expressão representa a área restante?" },
  { id: 2, area: "Matemática", topic: "Porcentagem", year: 2022, status: "Acertada", difficulty: "Fácil", title: "Desconto sucessivo", text: "Uma loja aplicou dois descontos consecutivos a um produto. Determine o valor final da compra." },
  { id: 3, area: "Matemática", topic: "Estatística", year: 2021, status: "Revisar", difficulty: "Média", title: "Análise de gráficos", text: "O gráfico apresenta o consumo mensal de água de uma família. Identifique a média do período." },
  { id: 4, area: "Ciências da Natureza", topic: "Física", year: 2023, status: "Não respondida", difficulty: "Difícil", title: "Consumo de energia", text: "A potência e o tempo de uso de aparelhos domésticos permitem calcular o consumo total de energia." },
  { id: 5, area: "Matemática", topic: "Probabilidade", year: 2020, status: "Acertada", difficulty: "Média", title: "Escolhas ao acaso", text: "Em uma urna há bolas de cores distintas. Calcule a chance de retirar uma bola com a característica indicada." },
  { id: 6, area: "Ciências Humanas", topic: "Geografia", year: 2022, status: "Revisar", difficulty: "Fácil", title: "Dinâmica populacional", text: "A tabela compara taxas demográficas de diferentes regiões brasileiras ao longo de uma década." },
];

const grid = document.querySelector("#questions-grid");
const count = document.querySelector("#question-count");
const emptyState = document.querySelector("#empty-state");
const filters = {
  area: document.querySelector("#area-filter"),
  topic: document.querySelector("#topic-filter"),
  year: document.querySelector("#year-filter"),
};
let selectedStatus = "Todas";

function fillSelect(select, values) {
  values.forEach((value) => select.add(new Option(value, value)));
}

function renderQuestions() {
  const visible = questions.filter((question) =>
    (!filters.area.value || question.area === filters.area.value) &&
    (!filters.topic.value || question.topic === filters.topic.value) &&
    (!filters.year.value || String(question.year) === filters.year.value) &&
    (selectedStatus === "Todas" || question.status === selectedStatus));

  count.textContent = `${visible.length} ${visible.length === 1 ? "questão" : "questões"}`;
  emptyState.hidden = visible.length > 0;
  grid.innerHTML = visible.map((question) => `
    <article class="question-card">
      <div class="question-card__meta"><span>${question.area}</span><span class="difficulty difficulty--${question.difficulty.toLowerCase().replace("í", "i")}">${question.difficulty}</span></div>
      <p class="question-card__number">Questão ${String(question.id).padStart(2, "0")} · ${question.year}</p>
      <h3>${question.title}</h3>
      <p class="question-card__text">${question.text}</p>
      <div class="question-card__footer"><span>${question.topic}</span><button type="button">Resolver questão <span aria-hidden="true">→</span></button></div>
    </article>`).join("");
}

function loadDemoUser() {
  let user;
  try {
    user = JSON.parse(localStorage.getItem(DEMO_USER_KEY));
  } catch (error) {
    localStorage.removeItem(DEMO_USER_KEY);
  }

  if (!user?.email) {
    window.location.replace("./login.html");
    return;
  }

  const name = user.name || user.email.split("@")[0] || "Visitante";
  document.querySelector("#user-name").textContent = name;
  document.querySelector("#user-avatar").textContent = name.charAt(0).toUpperCase();
}

fillSelect(filters.area, [...new Set(questions.map((item) => item.area))].sort());
fillSelect(filters.topic, [...new Set(questions.map((item) => item.topic))].sort());
fillSelect(filters.year, [...new Set(questions.map((item) => item.year))].sort((a, b) => b - a));
Object.values(filters).forEach((select) => select.addEventListener("change", renderQuestions));

document.querySelectorAll(".status-button").forEach((button) => button.addEventListener("click", () => {
  document.querySelector(".status-button.is-active")?.classList.remove("is-active");
  button.classList.add("is-active");
  selectedStatus = button.dataset.status;
  renderQuestions();
}));

document.querySelector("#clear-filters").addEventListener("click", () => {
  Object.values(filters).forEach((select) => { select.value = ""; });
  selectedStatus = "Todas";
  document.querySelector(".status-button.is-active")?.classList.remove("is-active");
  document.querySelector('[data-status="Todas"]').classList.add("is-active");
  renderQuestions();
});

document.querySelector("#logout-button").addEventListener("click", () => {
  localStorage.removeItem(DEMO_USER_KEY);
  window.location.replace("./login.html");
});

const toggle = document.querySelector("#menu-toggle");
function toggleSidebar(open) {
  document.body.classList.toggle("sidebar-open", open);
  toggle.setAttribute("aria-expanded", String(open));
}
toggle.addEventListener("click", () => toggleSidebar(!document.body.classList.contains("sidebar-open")));
document.querySelector("#sidebar-backdrop").addEventListener("click", () => toggleSidebar(false));

renderQuestions();
loadDemoUser();
