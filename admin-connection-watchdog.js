"use strict";

(() => {
  const loading = document.querySelector("#admin-loading");
  const denied = document.querySelector("#admin-denied");
  const content = document.querySelector("#admin-content");
  if (!loading || !denied || !content) return;

  let fired = false;
  const timer = setTimeout(() => {
    if (loading.hidden || !content.hidden) return;
    fired = true;
    loading.hidden = true;
    denied.hidden = false;
    const title = denied.querySelector("h2");
    const text = denied.querySelector("p");
    if (title) title.textContent = "A conexão demorou mais que o esperado";
    if (text) text.textContent = "O Supabase está online, mas esta página não recebeu os dados a tempo. Recarregue para tentar novamente.";
    let retry = denied.querySelector("[data-admin-retry]");
    if (!retry) {
      retry = document.createElement("button");
      retry.type = "button";
      retry.dataset.adminRetry = "1";
      retry.textContent = "↻ Tentar novamente";
      retry.style.cssText = "margin-left:10px;padding:10px 14px;border:0;border-radius:9px;background:#1769e0;color:#fff;font-weight:800;cursor:pointer";
      retry.addEventListener("click", () => location.reload());
      denied.appendChild(retry);
    }
  }, 10000);

  const observer = new MutationObserver(() => {
    if (!content.hidden) {
      clearTimeout(timer);
      if (fired) denied.hidden = true;
      observer.disconnect();
    }
  });
  observer.observe(content, { attributes: true, attributeFilter: ["hidden"] });
})();
