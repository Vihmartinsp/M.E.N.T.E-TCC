"use strict";

(() => {
  const client = window.menteSupabase;
  if (!client) return;

  async function getRole() {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData.session?.user) return null;

    const user = sessionData.session.user;
    const { data, error } = await client
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

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
      if (small) small.textContent = "👑 Super Admin";
      const button = copy.closest(".user-menu");
      if (button) button.title = "Super Admin M.E.N.T.E";
    }

    const menu = document.querySelector(".mente-account-menu");
    if (!menu) return false;

    if (!menu.querySelector('[href="./admin.html"]')) {
      const link = document.createElement("a");
      link.href = "./admin.html";
      link.setAttribute("role", "menuitem");
      link.dataset.adminEntry = "1";
      link.innerHTML = '<span>👑</span> Painel administrativo';
      const logout = menu.querySelector("[data-mente-logout]");
      if (logout) menu.insertBefore(link, logout);
      else menu.appendChild(link);
    }

    return true;
  }

  async function init() {
    removeAdminEntry();
    const account = await getRole();
    if (!account || account.role !== "super_admin") {
      window.menteUserRole = account?.role || "aluno";
      removeAdminEntry();
      return;
    }

    window.menteUserRole = "super_admin";
    if (decorateSuperAdmin()) return;

    const observer = new MutationObserver(() => {
      if (decorateSuperAdmin()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 8000);
  }

  init().catch((error) => {
    removeAdminEntry();
    console.warn("[M.E.N.T.E] Não foi possível carregar o acesso administrativo.", error);
  });
})();
