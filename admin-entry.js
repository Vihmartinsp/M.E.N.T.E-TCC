"use strict";

(() => {
  async function getClient() {
    if (window.menteSupabase) return window.menteSupabase;
    return new Promise((resolve) => {
      let done = false;
      const finish = (client) => { if (!done) { done = true; resolve(client || null); } };
      window.addEventListener("mente:supabase-ready", () => finish(window.menteSupabase), { once: true });
      setTimeout(() => finish(window.menteSupabase), 1200);
    });
  }

  async function getRole(client) {
    if (!client) return null;
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData?.session?.user) return null;
    const user = sessionData.session.user;
    const { data, error } = await client.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
    if (error) return null;
    return { user, role: data?.role || "aluno" };
  }

  function removeAdminEntry() {
    document.querySelectorAll('[data-admin-entry], .mente-account-menu a[href="./admin.html"]').forEach((el) => el.remove());
  }

  function decorateSuperAdmin() {
    const copy = document.querySelector(".user-menu__copy");
    if (copy) {
      const small = copy.querySelector("small");
      if (small && small.textContent !== "👑 Super Admin") small.textContent = "👑 Super Admin";
      const button = copy.closest(".user-menu");
      if (button && button.title !== "Super Admin M.E.N.T.E") button.title = "Super Admin M.E.N.T.E";
    }

    const menu = document.querySelector(".mente-account-menu");
    if (menu && !menu.querySelector('[href="./admin.html"]')) {
      const link = document.createElement("a");
      link.href = "./admin.html";
      link.setAttribute("role", "menuitem");
      link.dataset.adminEntry = "1";
      link.innerHTML = '<span>👑</span> Painel administrativo';
      const logout = menu.querySelector("[data-mente-logout]");
      if (logout) menu.insertBefore(link, logout); else menu.appendChild(link);
    }
  }

  function decorateWithRetries() {
    const delays = [0, 250, 700, 1500, 3000];
    delays.forEach((delay) => setTimeout(decorateSuperAdmin, delay));
  }

  async function init() {
    removeAdminEntry();
    const client = await getClient();
    const account = await getRole(client);
    const role = account?.role || "aluno";
    window.menteUserRole = role;
    try { window.dispatchEvent(new CustomEvent("mente:role-ready", { detail: { role } })); } catch {}

    if (role !== "super_admin") {
      removeAdminEntry();
      return;
    }
    decorateWithRetries();
  }

  init().catch((error) => {
    removeAdminEntry();
    console.warn("[M.E.N.T.E] Não foi possível carregar o acesso administrativo.", error);
  });
})();
