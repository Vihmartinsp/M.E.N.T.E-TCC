"use strict";

const DEMO_USER_KEY = "mente-demo-user";
const INEP_SOURCE_URL = "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos";

const categoryColors = {
  "Geometria": "#FF751F",
  "Funções": "#9D4EDD",
  "Estatística e Probabilidade": "#004A00",
  "Matemática Financeira": "#FFEE48",
  "Grandezas e Medidas": "#D70101",
  "Gráficos e Tabelas": "#2A68B2",
};

const questions = [
  { id: 1, category: "Geometria", topic: "Área de figura plana", year: 2011, stars: 1, text: "Uma praça quadrada de lado 20 m receberá grama, exceto em uma região quadrada central de lado 4 m. Qual é a área que será gramada?", visual: "squares" },
  { id: 2, category: "Geometria", topic: "Perímetro e área", year: 2013, stars: 2, text: "Um terreno retangular mede 30 m por 20 m. Uma cerca deve contorná-lo, deixando uma abertura de 4 m para o portão. Quantos metros de cerca serão usados?" },
  { id: 3, category: "Geometria", topic: "Volume", year: 2015, stars: 3, text: "Uma caixa-d'água em forma de paralelepípedo mede 2 m de comprimento, 1,5 m de largura e 1 m de altura. Qual é sua capacidade em litros?" },
  { id: 4, category: "Geometria", topic: "Geometria espacial", year: 2017, stars: 4, text: "Um reservatório cilíndrico tem raio interno de 2 m e altura de 5 m. Usando π = 3, qual é o volume máximo armazenado?", visual: "cylinder" },
  { id: 5, examNumber: 139, category: "Geometria", topic: "Geometria plana contextualizada", year: 2025, stars: 4, text: "Uma ciclovia circular de raio 1 km deve ser protegida por policiais posicionados de modo que nenhum ponto fique a mais de 200 m de um deles. Qual é a quantidade mínima necessária?", detail: "No entorno de uma lagoa circular, cujo raio mede 1 km, há uma ciclovia. Devido aos frequentes roubos de bicicleta, a prefeitura planeja alocar policiais em posições estratégicas para patrulhar essa ciclovia, de forma a torná-la totalmente protegida. Um ponto da ciclovia é considerado protegido se houver pelo menos um policial a, no máximo, 200 m de distância daquele ponto, posicionado sobre a ciclovia. A figura ilustra um ponto P sobre a ciclovia, que estará protegido se houver pelo menos um policial posicionado sobre a região de cor cinza-escuro. Desconsidere a largura da pista da ciclovia e utilize 3 como aproximação para π. Nessas condições, qual é a quantidade mínima necessária de policiais a serem alocados ao longo dessa ciclovia para torná-la protegida?", options: ["4", "8", "15", "30", "60"], correct: 2, visual: "bikeCircle" },

  { id: 6, category: "Funções", topic: "Função afim I", year: 2010, stars: 1, text: "Um táxi cobra bandeirada de R$ 5,00 e R$ 2,00 por quilômetro rodado. Qual função representa o preço P de uma corrida de x quilômetros?" },
  { id: 7, category: "Funções", topic: "Função afim II", year: 2012, stars: 2, text: "A temperatura de um forno aumenta linearmente de 20 °C para 200 °C em 30 minutos. Qual será a temperatura após 10 minutos?", visual: "line" },
  { id: 8, category: "Funções", topic: "Função quadrática e modelagem", year: 2014, stars: 3, text: "A altura de uma bola é dada por h(t) = -5t² + 20t, em metros. Qual é a altura máxima atingida?" },
  { id: 9, category: "Funções", topic: "Análise de função", year: 2018, stars: 4, text: "O lucro de uma empresa é L(x) = -2x² + 120x - 1 000. Para qual quantidade x o lucro é máximo?" },
  { id: 10, category: "Funções", topic: "Interpretação de funções", year: 2021, stars: 5, text: "O consumo C(t) de água varia por trechos lineares ao longo do dia. Entre 8 h e 12 h, passa de 200 L para 440 L. Qual é a taxa média de crescimento nesse intervalo?" },

  { id: 11, category: "Estatística e Probabilidade", topic: "Média aritmética", year: 2009, stars: 1, text: "As notas de um estudante foram 6, 7, 8 e 9. Qual é a média aritmética dessas notas?" },
  { id: 12, category: "Estatística e Probabilidade", topic: "Estatística descritiva", year: 2012, stars: 2, text: "Os tempos, em minutos, foram 12, 15, 15, 18 e 20. Determine a mediana e a moda do conjunto." },
  { id: 13, category: "Estatística e Probabilidade", topic: "Probabilidade", year: 2015, stars: 3, text: "Uma urna contém 5 bolas azuis, 3 vermelhas e 2 verdes. Ao retirar uma bola ao acaso, qual é a probabilidade de ela ser vermelha?", visual: "balls" },
  { id: 14, category: "Estatística e Probabilidade", topic: "Análise descritiva", year: 2019, stars: 4, text: "Uma turma tem média 7,0 com 20 alunos. Após incluir a nota de um novo aluno, a média passa a 7,1. Qual foi a nota incluída?" },
  { id: 15, category: "Estatística e Probabilidade", topic: "Probabilidade contextualizada", year: 2022, stars: 5, text: "Em um processo seletivo, 60% dominam planilhas, 45% dominam inglês e 25% dominam ambos. Qual é a probabilidade de um candidato dominar ao menos uma habilidade?" },

  { id: 16, category: "Matemática Financeira", topic: "Juros", year: 2010, stars: 1, text: "Um capital de R$ 1.000 é aplicado a juros simples de 2% ao mês por 3 meses. Qual será o montante?" },
  { id: 17, category: "Matemática Financeira", topic: "Porcentagem", year: 2013, stars: 2, text: "Um produto de R$ 250 recebeu desconto de 20%. Qual é o novo preço?" },
  { id: 18, category: "Matemática Financeira", topic: "Juros compostos", year: 2016, stars: 3, text: "Uma aplicação de R$ 2.000 rende 10% ao ano, com capitalização anual. Qual será o saldo após 2 anos?" },
  { id: 19, category: "Matemática Financeira", topic: "Financiamento", year: 2019, stars: 4, text: "Um bem de R$ 12.000 é financiado com entrada de 20% e o restante em 12 parcelas iguais, sem juros. Qual é o valor de cada parcela?" },
  { id: 20, category: "Matemática Financeira", topic: "Problema financeiro contextualizado", year: 2023, stars: 5, text: "Uma dívida de R$ 5.000 cresce 2% ao mês por juros compostos. Depois de dois meses, é pago R$ 1.000. Qual é o saldo imediatamente após o pagamento?" },

  { id: 21, category: "Grandezas e Medidas", topic: "Conversão de unidades", year: 2009, stars: 1, text: "Uma garrafa contém 1,5 litro de água. Quantos mililitros há nessa garrafa?" },
  { id: 22, category: "Grandezas e Medidas", topic: "Escalas e medidas", year: 2011, stars: 2, text: "Em um mapa de escala 1:100 000, duas cidades estão separadas por 7 cm. Qual é a distância real, em quilômetros?", visual: "scale" },
  { id: 23, category: "Grandezas e Medidas", topic: "Razões e unidades", year: 2014, stars: 3, text: "Um automóvel percorre 420 km com 35 litros de combustível. Qual é seu consumo médio em quilômetros por litro?" },
  { id: 24, category: "Grandezas e Medidas", topic: "Grandezas proporcionais", year: 2018, stars: 4, text: "Quatro máquinas produzem 1.200 peças em 5 horas. Mantendo o ritmo, quantas peças seis máquinas produzem em 8 horas?" },
  { id: 25, category: "Grandezas e Medidas", topic: "Situação contextualizada", year: 2021, stars: 5, text: "Uma receita para 6 pessoas usa 450 g de farinha. Para servir 14 pessoas na mesma proporção, quantos quilogramas de farinha serão necessários?" },

  { id: 26, category: "Gráficos e Tabelas", topic: "Leitura de gráficos", year: 2010, stars: 1, text: "O gráfico mostra vendas de 20, 30, 25 e 40 unidades entre janeiro e abril. Em qual mês ocorreu a maior venda?", visual: "bars" },
  { id: 27, category: "Gráficos e Tabelas", topic: "Tabelas", year: 2013, stars: 2, text: "Uma tabela registra 120 usuários na segunda, 150 na terça e 180 na quarta. Qual foi o aumento percentual de segunda para quarta?", visual: "table" },
  { id: 28, category: "Gráficos e Tabelas", topic: "Interpretação de gráfico", year: 2016, stars: 3, text: "Em um gráfico de temperatura, os valores sobem de 18 °C às 6 h para 30 °C às 12 h e caem para 24 °C às 18 h. Em qual intervalo ocorre queda?", visual: "line" },
  { id: 29, category: "Gráficos e Tabelas", topic: "Comparação de gráficos", year: 2020, stars: 4, text: "Duas escolas reduziram o consumo: A passou de 500 para 400 kWh e B, de 300 para 225 kWh. Qual teve a maior redução percentual?" },
  { id: 30, category: "Gráficos e Tabelas", topic: "Gráfico contextualizado", year: 2022, stars: 5, text: "Um gráfico acumulado registra 100 atendimentos às 9 h, 280 às 12 h e 520 às 17 h. Compare as taxas médias dos dois intervalos e indique o de maior fluxo." },
].map((question) => ({ ...question, status: "Não respondida" }));

const visualTemplates = {
  squares: '<div class="mini-shape mini-shape--square"><span></span></div>',
  cylinder: '<div class="mini-cylinder"><span></span></div>',
  line: '<div class="mini-line"><i></i><i></i><i></i><i></i></div>',
  balls: '<div class="mini-balls"><i></i><i></i><i></i><i></i><i></i><i></i></div>',
  scale: '<div class="mini-scale"><span>0</span><i></i><span>7 cm</span></div>',
  bars: '<div class="mini-bars"><i style="height:40%"></i><i style="height:65%"></i><i style="height:52%"></i><i style="height:88%"></i></div>',
  table: '<table class="mini-table" aria-label="Usuários por dia"><tr><th>Seg.</th><th>Ter.</th><th>Qua.</th></tr><tr><td>120</td><td>150</td><td>180</td></tr></table>',
  bikeCircle: '<div class="mini-bike-circle"><i></i><span>P</span></div>',
};

const grid = document.querySelector("#questions-grid");
const count = document.querySelector("#question-count");
const emptyState = document.querySelector("#empty-state");
const filters = {
  category: document.querySelector("#area-filter"),
  topic: document.querySelector("#topic-filter"),
  year: document.querySelector("#year-filter"),
};
let selectedStatus = "Todas";

function fillSelect(select, values) {
  values.forEach((value) => select.add(new Option(value, value)));
}

function updateTopicOptions() {
  const currentTopic = filters.topic.value;
  const topics = questions
    .filter((question) => !filters.category.value || question.category === filters.category.value)
    .map((question) => question.topic);
  filters.topic.replaceChildren(new Option("Todos os conteúdos", ""));
  fillSelect(filters.topic, [...new Set(topics)].sort());
  filters.topic.value = topics.includes(currentTopic) ? currentTopic : "";
}

function renderStars(amount) {
  return `<span class="question-card__stars" aria-label="Dificuldade ${amount} de 5">${"★".repeat(amount)}${"☆".repeat(5 - amount)}</span>`;
}

function renderQuestions() {
  const visible = questions.filter((question) =>
    (!filters.category.value || question.category === filters.category.value) &&
    (!filters.topic.value || question.topic === filters.topic.value) &&
    (!filters.year.value || String(question.year) === filters.year.value) &&
    (selectedStatus === "Todas" || question.status === selectedStatus));

  count.textContent = `${visible.length} ${visible.length === 1 ? "questão encontrada" : "questões encontradas"}`;
  emptyState.hidden = visible.length > 0;
  grid.innerHTML = visible.map((question) => {
    const color = categoryColors[question.category];
    return `
      <article class="question-card" style="--category-color:${color}">
        <div class="question-card__meta">
          <span class="question-card__category">${question.category}</span>
          ${renderStars(question.stars)}
        </div>
        <div class="question-card__tags"><span>${question.topic}</span><span>Adaptada do ENEM ${question.year}</span></div>
        ${question.visual ? `<div class="question-card__visual" aria-hidden="true">${visualTemplates[question.visual]}</div>` : ""}
        <p class="question-card__text">${question.text}</p>
        <div class="question-card__footer">
          <a href="${INEP_SOURCE_URL}" target="_blank" rel="noopener">Provas do INEP</a>
          <button type="button" data-question-id="${question.id}">Resolver <span aria-hidden="true">→</span></button>
        </div>
      </article>`;
  }).join("");
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-question-id]");
  if (!button) return;
  const question = questions.find((item) => item.id === Number(button.dataset.questionId));
  localStorage.setItem("mente-selected-question", JSON.stringify(question));
  window.location.href = `./questao.html?id=${question.id}`;
});

const tutorialSteps = [
  ["Bem-vindo à M.E.N.T.E!", "Aqui você aprende Matemática entendendo cada decisão, e não apenas decorando fórmulas."],
  ["Encontre o conteúdo certo", "Use os filtros de matéria, conteúdo e ano. As estrelas mostram a dificuldade de 1 a 5."],
  ["Resolva e destrinche", "Abra uma questão, registre seu raciocínio e depois marque-a como concluída para ganhar pontos."],
  ["Acompanhe sua jornada", "Use o roteiro, módulos, explicações, simulados, vídeo aulas e desempenho no menu lateral."],
];
function startTutorial() {
  if (localStorage.getItem("mente-tutorial-seen")) return;
  const modal = document.querySelector("#tutorial"); let step = 0;
  const draw = () => { document.querySelector("#tutorial-title").textContent = tutorialSteps[step][0]; document.querySelector("#tutorial-copy").textContent = tutorialSteps[step][1]; document.querySelector("#tutorial-progress").textContent = `${step + 1} / ${tutorialSteps.length}`; document.querySelector("#tutorial-next").textContent = step === tutorialSteps.length - 1 ? "Começar" : "Próximo"; };
  const close = () => { localStorage.setItem("mente-tutorial-seen", "true"); modal.hidden = true; };
  document.querySelector("#tutorial-skip").onclick = close;
  document.querySelector("#tutorial-next").onclick = () => { if (++step >= tutorialSteps.length) close(); else draw(); };
  draw(); modal.hidden = false;
}

function loadDemoUser() {
  let user;
  try { user = JSON.parse(localStorage.getItem(DEMO_USER_KEY)); }
  catch (error) { localStorage.removeItem(DEMO_USER_KEY); }
  if (!user?.email) { window.location.replace("./login.html"); return; }
  const name = user.name || user.email.split("@")[0] || "Visitante";
  document.querySelector("#user-name").textContent = name;
  document.querySelector("#user-avatar").textContent = name.charAt(0).toUpperCase();
}

fillSelect(filters.category, Object.keys(categoryColors));
updateTopicOptions();
fillSelect(filters.year, [...new Set(questions.map((item) => item.year))].sort((a, b) => b - a));
filters.category.addEventListener("change", () => { updateTopicOptions(); renderQuestions(); });
filters.topic.addEventListener("change", renderQuestions);
filters.year.addEventListener("change", renderQuestions);

document.querySelectorAll(".status-button").forEach((button) => button.addEventListener("click", () => {
  document.querySelector(".status-button.is-active")?.classList.remove("is-active");
  button.classList.add("is-active");
  selectedStatus = button.dataset.status;
  renderQuestions();
}));

document.querySelector("#clear-filters").addEventListener("click", () => {
  Object.values(filters).forEach((select) => { select.value = ""; });
  updateTopicOptions();
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
startTutorial();
