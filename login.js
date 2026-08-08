"use strict";

const SUPABASE_URL = "https://sidnlsdsnpgsyrddndof.supabase.co";
const SUPABASE_KEY = "sb_publishable_ti_u7RKlGnis3Yq7eE3Yrw_H3NuSP2f";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
);

const tabs = document.querySelectorAll(".access-tabs__button");
const forms = document.querySelectorAll(".access-form");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");

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

function getLoginErrorMessage(error) {
  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }

  if (message.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }

  if (message.includes("too many requests")) {
    return "Muitas tentativas. Aguarde um pouco e tente novamente.";
  }

  return "Não foi possível entrar. Tente novamente.";
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
  const email = data.get("email");
  const password = data.get("password");

  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    window.location.href = "./index.html";
  } catch (error) {
    console.error("Erro no login Supabase:", error);
    showStatus(loginForm, getLoginErrorMessage(error));
  } finally {
    setSubmitting(loginForm, false);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showStatus(registerForm, "", "");
  setSubmitting(registerForm, true);

  const data = new FormData(registerForm);
  const nome = data.get("name");
  const telefone = data.get("phone");
  const email = data.get("email");
  const password = data.get("password");

  try {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: nome,
          phone: telefone,
        },
      },
    });

    if (error) {
      throw error;
    }

    showStatus(
      registerForm,
      "Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.",
      "success",
    );
  } catch (error) {
    console.error("Erro no cadastro Supabase:", error);
    showStatus(registerForm, error.message);
  } finally {
    setSubmitting(registerForm, false);
  }
});
