"use strict";

const question = JSON.parse(localStorage.getItem("mente-selected-question") || "null");
const root = document.querySelector("#question-content");
const pointsKey = "mente-points";
const answersKey = "mente-answers";
document.querySelector("#points").textContent = localStorage.getItem(pointsKey) || 0;

const solutions = {
  1: { options: ["384 m²", "396 m²", "400 m²", "416 m²", "800 m²"], correct: 0, explanation: "A praça inteira tem 20 × 20 = 400 m². A parte central, que não recebe grama, tem 4 × 4 = 16 m². Retirando essa parte: 400 − 16 = 384 m²." },
  2: { options: ["46 m", "54 m", "96 m", "100 m", "600 m"], correct: 2, explanation: "O perímetro do retângulo é 2 × (30 + 20) = 100 m. Como os 4 m do portão não recebem cerca, usamos 100 − 4 = 96 m." },
  3: { options: ["300 L", "1 500 L", "2 000 L", "3 000 L", "30 000 L"], correct: 3, explanation: "O volume é 2 × 1,5 × 1 = 3 m³. Cada metro cúbico corresponde a 1 000 litros, então 3 m³ = 3 000 L." },
  4: { options: ["30 m³", "45 m³", "60 m³", "75 m³", "120 m³"], correct: 2, explanation: "No cilindro, V = πr²h. Substituindo π = 3, r = 2 e h = 5: V = 3 × 2² × 5 = 3 × 4 × 5 = 60 m³." },
  5: { options: ["4", "8", "15", "30", "60"], correct: 2, explanation: "Primeiro calculamos o comprimento da ciclovia: C = 2πr = 2 × 3 × 1 000 = 6 000 m. Um policial protege 200 m para cada lado de sua posição, cobrindo 400 m. Assim, 6 000 ÷ 400 = 15 policiais." },
  6: { options: ["P(x) = 2x", "P(x) = 5x", "P(x) = 5 + 2x", "P(x) = 2 + 5x", "P(x) = 7x"], correct: 2, explanation: "A bandeirada de R$ 5 é um valor fixo, pago mesmo antes do deslocamento. Os R$ 2 são multiplicados por cada quilômetro x. Portanto, P(x) = 5 + 2x." },
  7: { options: ["60 °C", "70 °C", "80 °C", "90 °C", "100 °C"], correct: 2, explanation: "A temperatura aumenta 200 − 20 = 180 °C em 30 minutos, ou 6 °C por minuto. Em 10 minutos aumenta 60 °C; somando aos 20 °C iniciais, chega a 80 °C." },
  8: { options: ["10 m", "15 m", "20 m", "25 m", "40 m"], correct: 2, explanation: "A altura máxima está no vértice da parábola. O instante é t = −b/(2a) = −20/(2 × −5) = 2. Substituindo: h(2) = −5×4 + 20×2 = 20 m." },
  9: { options: ["20", "25", "30", "40", "60"], correct: 2, explanation: "Como o coeficiente de x² é negativo, o vértice representa o lucro máximo. Calculamos x = −b/(2a) = −120/(2 × −2) = 30." },
  10: { options: ["40 L/h", "50 L/h", "60 L/h", "80 L/h", "120 L/h"], correct: 2, explanation: "O consumo aumenta 440 − 200 = 240 L. O intervalo dura 12 − 8 = 4 horas. A taxa média é 240 ÷ 4 = 60 L/h." },
  11: { options: ["7", "7,5", "8", "8,5", "9"], correct: 1, explanation: "Somamos as quatro notas: 6 + 7 + 8 + 9 = 30. Depois dividimos pela quantidade de notas: 30 ÷ 4 = 7,5." },
  12: { options: ["Mediana 12 e moda 15", "Mediana 15 e moda 15", "Mediana 15 e moda 18", "Mediana 16 e moda 15", "Mediana 18 e moda 20"], correct: 1, explanation: "Os dados já estão em ordem. O valor central é 15, portanto essa é a mediana. Como 15 também é o único valor que aparece duas vezes, ele é a moda." },
  13: { options: ["1/10", "2/10", "3/10", "5/10", "7/10"], correct: 2, explanation: "Há 5 + 3 + 2 = 10 bolas no total e 3 são vermelhas. A probabilidade é casos favoráveis sobre o total: 3/10." },
  14: { options: ["7,1", "8,0", "8,5", "9,0", "9,1"], correct: 4, explanation: "A soma inicial é 20 × 7 = 140. Com 21 alunos, a nova soma é 21 × 7,1 = 149,1. A nota incluída é 149,1 − 140 = 9,1." },
  15: { options: ["25%", "55%", "70%", "80%", "105%"], correct: 3, explanation: "Somamos quem domina cada habilidade e retiramos quem foi contado duas vezes: 60% + 45% − 25% = 80%." },
  16: { options: ["R$ 1.020", "R$ 1.040", "R$ 1.060", "R$ 1.080", "R$ 1.200"], correct: 2, explanation: "Nos juros simples, J = C×i×t = 1 000×0,02×3 = 60. O montante é capital mais juros: 1 000 + 60 = R$ 1.060." },
  17: { options: ["R$ 180", "R$ 190", "R$ 200", "R$ 210", "R$ 230"], correct: 2, explanation: "Vinte por cento de R$ 250 são 0,20 × 250 = R$ 50. Subtraindo o desconto: 250 − 50 = R$ 200." },
  18: { options: ["R$ 2.200", "R$ 2.400", "R$ 2.420", "R$ 2.440", "R$ 4.000"], correct: 2, explanation: "Em juros compostos, M = 2 000×(1,10)². Como 1,10² = 1,21, o saldo é 2 000×1,21 = R$ 2.420." },
  19: { options: ["R$ 200", "R$ 640", "R$ 800", "R$ 960", "R$ 1.000"], correct: 2, explanation: "A entrada é 20% de 12 000, ou R$ 2.400. Restam R$ 9.600. Dividindo em 12 parcelas: 9 600 ÷ 12 = R$ 800." },
  20: { options: ["R$ 4.000", "R$ 4.102", "R$ 4.200", "R$ 4.202", "R$ 5.202"], correct: 3, explanation: "Após dois meses: 5 000×1,02² = 5 000×1,0404 = R$ 5.202. Depois do pagamento de R$ 1.000, restam R$ 4.202." },
  21: { options: ["15 mL", "150 mL", "1 500 mL", "15 000 mL", "150 000 mL"], correct: 2, explanation: "Um litro possui 1 000 mililitros. Então 1,5 × 1 000 = 1 500 mL." },
  22: { options: ["0,7 km", "7 km", "10 km", "70 km", "700 km"], correct: 1, explanation: "Na escala 1:100 000, cada centímetro representa 100 000 cm reais, isto é, 1 km. Portanto, 7 cm representam 7 km." },
  23: { options: ["10 km/L", "11 km/L", "12 km/L", "14 km/L", "15 km/L"], correct: 2, explanation: "O consumo médio é a distância dividida pelo combustível: 420 ÷ 35 = 12 km/L." },
  24: { options: ["1 800", "2 400", "2 880", "3 600", "5 760"], correct: 2, explanation: "Cada máquina produz 1 200 ÷ (4×5) = 60 peças por hora. Seis máquinas por 8 horas produzem 6×8×60 = 2 880 peças." },
  25: { options: ["0,75 kg", "0,90 kg", "1,05 kg", "1,20 kg", "1,40 kg"], correct: 2, explanation: "Por pessoa são usados 450 ÷ 6 = 75 g. Para 14 pessoas: 75×14 = 1 050 g. Convertendo, 1 050 g = 1,05 kg." },
  26: { options: ["Janeiro", "Fevereiro", "Março", "Abril", "Todos iguais"], correct: 3, explanation: "Comparamos as alturas ou os valores das quatro barras: 20, 30, 25 e 40. O maior valor é 40, correspondente a abril." },
  27: { options: ["20%", "30%", "40%", "50%", "60%"], correct: 3, explanation: "O aumento foi de 180 − 120 = 60 usuários. Em relação aos 120 iniciais, 60/120 = 0,5, ou 50%." },
  28: { options: ["Das 6 h às 12 h", "Das 6 h às 18 h", "Das 12 h às 18 h", "Somente às 12 h", "Não há queda"], correct: 2, explanation: "Entre 6 h e 12 h a temperatura sobe de 18 °C para 30 °C. Entre 12 h e 18 h ela cai de 30 °C para 24 °C." },
  29: { options: ["Escola A", "Escola B", "As duas igualmente", "Não é possível comparar", "Nenhuma reduziu"], correct: 1, explanation: "A escola A reduziu 100/500 = 20%. A escola B reduziu 75/300 = 25%. Embora A tenha reduzido mais kWh, B teve a maior redução percentual." },
  30: { options: ["9–12 h: 48/h; 12–17 h: 60/h", "9–12 h: 60/h; 12–17 h: 48/h", "Ambos: 60/h", "Ambos: 48/h", "Não é possível calcular"], correct: 1, explanation: "Das 9 h às 12 h são 180 atendimentos em 3 horas: 60/h. Das 12 h às 17 h são 240 em 5 horas: 48/h. O maior fluxo médio ocorre no primeiro intervalo." },
};

function lagoonDiagram() {
  return `<figure class="lagoon-diagram"><svg viewBox="0 0 430 285" role="img" aria-labelledby="lagoon-title lagoon-desc"><title id="lagoon-title">Ciclovia circular ao redor de uma lagoa</title><desc id="lagoon-desc">Lagoa circular azul, ciclovia cinza e região de alcance de duzentos metros para cada lado do ponto P.</desc><circle cx="190" cy="142" r="103" fill="#10add2"/><circle cx="190" cy="142" r="112" fill="none" stroke="#d8dee5" stroke-width="12"/><circle cx="190" cy="142" r="119" fill="none" stroke="#263747" stroke-width="2"/><path d="M269 58 A112 112 0 0 1 301 103" fill="none" stroke="#4b5563" stroke-width="13" stroke-linecap="round"/><circle cx="287" cy="79" r="5" fill="#172535"/><text x="276" y="99" font-size="16" font-style="italic">P</text><path d="M289 67 L337 30 M299 87 L353 63" stroke="#172535" stroke-width="1.5"/><text x="338" y="29" font-size="14">200 m</text><text x="354" y="67" font-size="14">200 m</text></svg><figcaption>Cada policial protege até 200 m da ciclovia em cada direção a partir de sua posição.</figcaption></figure>`;
}

if (!question || !solutions[question.id]) {
  root.innerHTML = '<article class="portal-card"><h2>Questão não encontrada</h2><p>Volte ao catálogo e escolha uma questão para começar.</p><a class="portal-button" href="questoes.html">Ver questões</a></article>';
} else {
  const solution = solutions[question.id];
  const storedAnswers = JSON.parse(localStorage.getItem(answersKey) || "{}");
  const previous = storedAnswers[question.id];
  const alternatives = `<fieldset class="answer-options" ${previous ? "disabled" : ""}><legend>Escolha uma alternativa</legend>${solution.options.map((option, index) => `<label class="${previous?.selected === index ? "is-saved" : ""}"><input type="radio" name="answer" value="${index}" ${previous?.selected === index ? "checked" : ""}><strong>${String.fromCharCode(65 + index)}</strong><span>${option}</span></label>`).join("")}</fieldset>`;
  root.innerHTML = `<section class="portal-hero"><h2>${question.examNumber ? `Questão ${question.examNumber} · ENEM ${question.year}` : `Exercício ${String(question.id).padStart(2, "0")}`}</h2><p>Leia com atenção, destaque os dados importantes e escolha a alternativa que melhor responde ao problema.</p></section><article class="portal-card"><div class="question-detail__meta"><span>${question.category}</span><span>${question.topic}</span><span>ENEM ${question.year}</span><span>${"★".repeat(question.stars)}${"☆".repeat(5 - question.stars)}</span></div><p class="question-statement">${question.detail || question.text}</p>${question.visual === "bikeCircle" ? lagoonDiagram() : ""}${alternatives}<button class="portal-button" id="complete" ${previous ? "disabled" : ""}>${previous ? "Questão já respondida" : "Responder e concluir"}</button><div id="feedback" class="answer-feedback" role="status"></div></article>`;

  const feedback = document.querySelector("#feedback");
  function showResult(answer) {
    if (answer.correct) {
      feedback.innerHTML = '<div class="result-box result-box--correct"><h3>Parabéns, você acertou!</h3><p>Continue assim. Seus pontos e seu progresso já foram atualizados.</p></div>';
    } else {
      feedback.innerHTML = `<div class="result-box result-box--wrong"><h3>Vamos destrinchar esta questão</h3><p>${solution.explanation}</p><p class="result-box__answer"><strong>Resposta correta:</strong> ${String.fromCharCode(65 + solution.correct)} — ${solution.options[solution.correct]}</p></div>`;
    }
  }
  if (previous) showResult(previous);

  document.querySelector("#complete").onclick = () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
      feedback.innerHTML = '<p class="form-error">Escolha uma alternativa antes de concluir.</p>';
      return;
    }
    const selectedIndex = Number(selected.value);
    const isCorrect = selectedIndex === solution.correct;
    storedAnswers[question.id] = { selected: selectedIndex, correct: isCorrect, answeredAt: new Date().toISOString() };
    localStorage.setItem(answersKey, JSON.stringify(storedAnswers));
    if (isCorrect) {
      const total = Number(localStorage.getItem(pointsKey) || 0) + 10;
      localStorage.setItem(pointsKey, total);
      document.querySelector("#points").textContent = total;
    }
    document.querySelectorAll('input[name="answer"]').forEach((input) => { input.disabled = true; });
    const button = document.querySelector("#complete");
    button.disabled = true;
    button.textContent = "Questão já respondida";
    showResult(storedAnswers[question.id]);
  };
}
