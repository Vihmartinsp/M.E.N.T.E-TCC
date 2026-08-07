"use strict";

const questionForm = document.querySelector(".question-form");
const hintButton = document.querySelector(".hint-toggle");
const hint = document.querySelector("#question-tip");
const feedback = document.querySelector(".answer-feedback");
const answerInputs = questionForm.querySelectorAll('input[name="answer"]');

answerInputs.forEach((input) => {
  input.addEventListener("change", () => {
    questionForm.querySelectorAll(".answer").forEach((answer) => {
      answer.classList.remove("answer--correct", "answer--incorrect");
    });
    feedback.className = "answer-feedback";
    feedback.textContent = "";
  });
});

hintButton.addEventListener("click", () => {
  const shouldShowHint = hint.hidden;

  hint.hidden = !shouldShowHint;
  hintButton.setAttribute("aria-expanded", String(shouldShowHint));
  hintButton.textContent = shouldShowHint ? "Ocultar dica" : "Ver dica";
});

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedAnswer = questionForm.querySelector('input[name="answer"]:checked');
  const answerLabels = questionForm.querySelectorAll(".answer");

  answerLabels.forEach((answer) => {
    answer.classList.remove("answer--correct", "answer--incorrect");
  });

  feedback.className = "answer-feedback";

  if (!selectedAnswer) {
    feedback.textContent = "Escolha uma alternativa antes de confirmar.";
    feedback.classList.add("answer-feedback--error");
    return;
  }

  const selectedLabel = selectedAnswer.closest(".answer");

  if (selectedAnswer.value === "B") {
    selectedLabel.classList.add("answer--correct");
    feedback.textContent = "Ótimo! Você acertou 🎉";
    feedback.classList.add("answer-feedback--success");
    return;
  }

  selectedLabel.classList.add("answer--incorrect");
  feedback.textContent = "Ainda não. Tente pensar no vértice da parábola.";
  feedback.classList.add("answer-feedback--error");
});
