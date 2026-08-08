"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  connectFirestoreEmulator,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhX8z6sOlQFEzBTEvGMjSbQlBH4psCerY",
  authDomain: "mentee-bc47f.firebaseapp.com",
  projectId: "mentee-bc47f",
  storageBucket: "mentee-bc47f.firebasestorage.app",
  messagingSenderId: "271840757969",
  appId: "1:271840757969:web:53c9c0d0ddfe93f77cddf0",
  measurementId: "G-HSF741RN5P",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

const isLocalEnvironment =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

if (isLocalEnvironment) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(database, "127.0.0.1", 8080);
}

isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

const tabs = document.querySelectorAll(".access-tabs__button");
const forms = document.querySelectorAll(".access-form");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");

const authErrorMessages = {
  "auth/email-already-in-use": "Este e-mail já está cadastrado.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/invalid-email": "Digite um endereço de e-mail válido.",
  "auth/missing-password": "Digite sua senha.",
  "auth/network-request-failed": "Não foi possível conectar. Verifique sua internet.",
  "auth/operation-not-allowed": "Cadastro por e-mail e senha não está ativado no Firebase.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
  "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  "permission-denied":
    "A conta foi autenticada, mas o Firestore recusou o salvamento do perfil.",
  "failed-precondition": "O Firestore ainda não está configurado corretamente.",
  "unavailable": "O Firestore está temporariamente indisponível.",
};

function showStatus(form, message, type = "error") {
  const status = form.querySelector(".access-form__status");
  status.textContent = message;
  status.dataset.type = type;
}

function setSubmitting(form, isSubmitting) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "Aguarde..." : button.dataset.defaultText;
}

function getErrorMessage(error) {
  return authErrorMessages[error.code] || "Não foi possível concluir a operação. Tente novamente.";
}

function activateTab(selectedTab) {
  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
  });

  forms.forEach((form) => {
    form.hidden = form.id !== selectedTab.getAttribute("aria-controls");
    showStatus(form, "", "");
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab));
});

forms.forEach((form) => {
  const button = form.querySelector('button[type="submit"]');
  button.dataset.defaultText = button.textContent;
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showStatus(loginForm, "", "");
  setSubmitting(loginForm, true);

  const data = new FormData(loginForm);

  try {
    await signInWithEmailAndPassword(auth, data.get("email"), data.get("password"));
    showStatus(loginForm, "Login realizado! Redirecionando...", "success");
    window.location.href = "./index.html";
  } catch (error) {
    showStatus(loginForm, getErrorMessage(error));
  } finally {
    setSubmitting(loginForm, false);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showStatus(registerForm, "", "");
  setSubmitting(registerForm, true);

  const data = new FormData(registerForm);
  const email = data.get("email");
  const password = data.get("password");
  const name = data.get("name");
  let isFirestoreProfileSaveError = false;

  try {
    let credential;

    try {
      credential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erro no Authentication:", error);
      throw error;
    }

    try {
      await updateProfile(credential.user, { displayName: name });
    } catch (error) {
      console.error("Erro ao atualizar perfil no Authentication:", error);
      throw error;
    }

    try {
      await setDoc(doc(database, "users", credential.user.uid), {
        name,
        phone: data.get("phone"),
        email: credential.user.email,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao gravar usuário no Firestore:", error);
      isFirestoreProfileSaveError = true;
      throw error;
    }

    showStatus(registerForm, "Conta criada! Redirecionando...", "success");
    window.location.href = "./index.html";
  } catch (error) {
    console.error(
      "Erro ao criar conta:",
      error.code,
      error.message,
      error,
    );

    const message = isFirestoreProfileSaveError
      ? "Seu usuário foi criado no Firebase Authentication, mas não foi possível salvar o perfil no Firestore. Verifique as regras do banco."
      : getErrorMessage(error);
    showStatus(registerForm, message);
  } finally {
    setSubmitting(registerForm, false);
  }
});
