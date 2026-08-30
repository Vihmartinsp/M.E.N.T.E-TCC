"use strict";

(() => {
  const client = window.menteSupabase;
  if (!client) return;

  const labels = {
    professor: "Professor(a) M.E.N.T.E",
    admin: "Administrador(a) M.E.N.T.E",
    super_admin: "Super Admin M.E.N.T.E",
  };

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

  function decorateUser(role) {
    if (!labels[role]) return false;

    const copy = document.querySelector(".user-menu__copy");
    if (copy) {
      const small = copy.querySelector("small");
      if (small) small.textContent = role === "super_admin" ? "👑 Super Admin" : role === "admin" ? "◆ Administrador(a)" : "✦ Professor(a)";
      const button = copy.closest(".user-menu");
      if (button) button.title = labels[role];
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
      if (logout) menu.insertBefore(link, logout); else menu.appendChild(link);
    }
    return true;
  }

  async function init() {
    const account = await getRole();
    if (!account || !labels[account.role]) return;
    window.menteUserRole = account.role;

    if (decorateUser(account.role)) return;
    const observer = new MutationObserver(() => {
      if (decorateUser(account.role)) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 8000);
  }

  init().catch((error) => console.warn("[M.E.N.T.E] Não foi possível carregar o acesso administrativo.", error));
})();
