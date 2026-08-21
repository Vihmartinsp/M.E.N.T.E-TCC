"use strict";

const DEMO_USER_KEY = "mente-demo-user";
const tabs = document.querySelectorAll(".access-tabs__button");
const forms = document.querySelectorAll(".access-form");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const googleButton = document.querySelector("#google-login");

function showStatus(target, message, type = "error") {
  const status = target.matches?.(".access-form")
    ? target.querySelector(".access-form__status")
    : document.querySelector("#google-status");

  if (!status) return;
  status.textContent = message;
  status.dataset.type = type;
}

function activateTab(selectedTab) {
  tabs.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  forms.forEach((form) => {
    form.hidden = form.id !== selectedTab.getAttribute("aria-controls");
    showStatus(form, "", "");
  });
}

function enterPlatform({ email, name }) {
  const fallbackName = email.split("@")[0] || "Visitante";
  try {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify({
      email,
      name: name?.trim() || fallbackName,
    }));
  } catch (error) {
    console.warn("O navegador não permitiu salvar a sessão demonstrativa.", error);
  }
  window.location.href = "./questoes.html";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab));
});

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!loginForm.reportValidity()) return;

    const data = new FormData(loginForm);
    enterPlatform({ email: data.get("email") });
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!registerForm.reportValidity()) return;

    const data = new FormData(registerForm);
    enterPlatform({
      email: data.get("email"),
      name: String(data.get("name") || ""),
    });
  });
}

if (googleButton) {
  googleButton.addEventListener("click", () => {
    showStatus(
      googleButton,
      "O login com Google ainda está em configuração. Por enquanto, entre com seu e-mail.",
      "info",
    );
  });
}
