"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const USER_STORAGE_KEY = "mente-demo-user";
const tabs = document.querySelectorAll(".access-tabs__button");
const forms = document.querySelectorAll(".access-form");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const googleButton = document.querySelector("#google-login");
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

function showStatus(target, message, type = "error") {
  const status = target.matches?.(".access-form")
    ? target.querySelector(".access-form__status")
    : document.querySelector("#google-status");
  status.textContent = message;
  status.dataset.type = type;
}

function setBusy(button, busy, busyText = "Aguarde...") {
  if (!button.dataset.defaultText) button.dataset.defaultText = button.textContent.trim();
  button.disabled = busy;
  button.textContent = busy ? busyText : button.dataset.defaultText;
}

function firebaseMessage(error) {
  const messages = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/invalid-email": "Digite um endereço de e-mail válido.",
    "auth/popup-closed-by-user": "A janela do Google foi fechada antes da conclusão.",
    "auth/popup-blocked": "O navegador bloqueou a janela do Google. Libere pop-ups e tente novamente.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  };
  return messages[error.code] || "Não foi possível autenticar. Tente novamente.";
}

async function syncUser(firebaseUser, name) {
  const idToken = await firebaseUser.getIdToken(true);
  const response = await fetch("/api/auth/firebase", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name || firebaseUser.displayName }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Não foi possível carregar seus dados.");

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
  localStorage.setItem("mente-points", String(result.user.points || 0));
  window.location.replace("./questoes.html");
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

tabs.forEach((tab) => tab.addEventListener("click", () => activateTab(tab)));

async function configureFirebase() {
  const response = await fetch("/api/config/firebase");
  if (!response.ok) throw new Error("Não foi possível carregar a configuração do Firebase.");
  const config = await response.json();
  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new Error("Configuração do Firebase incompleta no servidor.");
  }
  return getAuth(initializeApp(config));
}

try {
  const auth = await configureFirebase();
  if (new URLSearchParams(window.location.search).has("logout")) {
    await signOut(auth);
    localStorage.removeItem(USER_STORAGE_KEY);
    history.replaceState({}, "", "./login.html");
  }

  googleButton.addEventListener("click", async () => {
    showStatus(googleButton, "", "");
    setBusy(googleButton, true, "Abrindo Google...");
    try {
      const credential = await signInWithPopup(auth, provider);
      await syncUser(credential.user);
    } catch (error) {
      console.error("Falha no login com Google:", error);
      showStatus(googleButton, firebaseMessage(error));
      setBusy(googleButton, false);
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;
    const button = loginForm.querySelector('button[type="submit"]');
    const data = new FormData(loginForm);
    setBusy(button, true);
    try {
      const credential = await signInWithEmailAndPassword(auth, data.get("email"), data.get("password"));
      await syncUser(credential.user);
    } catch (error) {
      console.error("Falha no login:", error);
      showStatus(loginForm, firebaseMessage(error));
      setBusy(button, false);
    }
  });

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!registerForm.reportValidity()) return;
    const button = registerForm.querySelector('button[type="submit"]');
    const data = new FormData(registerForm);
    setBusy(button, true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, data.get("email"), data.get("password"));
      await updateProfile(credential.user, { displayName: data.get("name").trim() });
      await syncUser(credential.user, data.get("name"));
    } catch (error) {
      console.error("Falha no cadastro:", error);
      showStatus(registerForm, firebaseMessage(error));
      setBusy(button, false);
    }
  });

} catch (error) {
  console.error(error);
  showStatus(googleButton, error.message);
  googleButton.disabled = true;
}
