"use strict";

const DEMO_USER_KEY = "mente-demo-user";
const tabs = document.querySelectorAll(".access-tabs__button");
const forms = document.querySelectorAll(".access-form");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const googleButton = document.querySelector("#google-login");
const supabaseClient = window.menteSupabase;

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

function saveCompatibilityUser(user, fallbackName = "") {
  const name = user?.user_metadata?.name
    || user?.user_metadata?.nome
    || fallbackName
    || user?.email?.split("@")[0]
    || "Aluno";

  try {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify({
      id: user?.id,
      email: user?.email,
      name,
      source: "supabase",
    }));
  } catch (error) {
    console.warn("O navegador não permitiu salvar a sessão local de compatibilidade.", error);
  }
}

async function enterPlatform(user, fallbackName = "") {
  saveCompatibilityUser(user, fallbackName);
  window.location.href = "./questoes.html";
}

async function checkExistingSession() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) return;
  if (data.session?.user) {
    await enterPlatform(data.session.user);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab));
});

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;

    const submitButton = loginForm.querySelector('button[type="submit"]');
    const data = new FormData(loginForm);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    try {
      submitButton.disabled = true;
      showStatus(loginForm, "Entrando...", "info");

      const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      await enterPlatform(authData.user);
    } catch (error) {
      const message = error?.message === "Invalid login credentials"
        ? "E-mail ou senha incorretos."
        : "Não foi possível entrar. Confira seus dados e tente novamente.";
      showStatus(loginForm, message, "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!registerForm.reportValidity()) return;

    const submitButton = registerForm.querySelector('button[type="submit"]');
    const data = new FormData(registerForm);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    try {
      submitButton.disabled = true;
      showStatus(registerForm, "Criando sua conta...", "info");

      const { data: authData, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { name, phone },
        },
      });

      if (error) throw error;

      if (authData.session?.user) {
        await enterPlatform(authData.session.user, name);
        return;
      }

      showStatus(
        registerForm,
        "Conta criada! Confira seu e-mail para confirmar o cadastro e depois faça login.",
        "success",
      );
      registerForm.reset();
    } catch (error) {
      let message = "Não foi possível criar sua conta. Tente novamente.";
      if (error?.message?.toLowerCase().includes("already registered")) {
        message = "Este e-mail já possui uma conta.";
      }
      showStatus(registerForm, message, "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

if (googleButton) {
  googleButton.addEventListener("click", async () => {
    try {
      googleButton.disabled = true;
      showStatus(googleButton, "Abrindo o Google...", "info");

      const redirectTo = new URL("./questoes.html", window.location.href).href;
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) throw error;
    } catch (error) {
      showStatus(
        googleButton,
        "O login com Google ainda precisa ser ativado no painel do Supabase.",
        "error",
      );
      googleButton.disabled = false;
    }
  });
}

checkExistingSession();
