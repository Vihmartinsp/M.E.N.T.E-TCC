"use strict";

const DEMO_USER_KEY = "mente-demo-user";
const tabs = document.querySelectorAll(".access-tabs__button");
const forms = document.querySelectorAll(".access-form");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");

function showStatus(form, message, type = "error") {
  const status = form.querySelector(".access-form__status");
  status.textContent = message;
  status.dataset.type = type;
}

function activateTab(selectedTab) {
  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  forms.forEach((form) => {
    form.hidden = form.id !== selectedTab.getAttribute("aria-controls");
    showStatus(form, "", "");
  });
}

function saveDemoUser({ email, name }) {
  const fallbackName = email.split("@")[0] || "Visitante";
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify({
    email,
    name: name?.trim() || fallbackName,
  }));
  window.location.href = "./questoes.html";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab));
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;

  const email = new FormData(loginForm).get("email").trim();
  saveDemoUser({ email });
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!registerForm.reportValidity()) return;

  const data = new FormData(registerForm);
  saveDemoUser({
    email: data.get("email").trim(),
    name: data.get("name"),
  });
});
