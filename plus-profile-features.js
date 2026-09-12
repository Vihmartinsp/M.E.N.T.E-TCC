"use strict";

(() => {
  if (document.body.dataset.page !== "desempenho") return;

  function ensureStyles() {
    if (document.querySelector("#plus-profile-feature-styles")) return;
    const style = document.createElement("style");
    style.id = "plus-profile-feature-styles";
    style.textContent = `
      .plus-insights{margin:20px 0;padding:22px;border:1px solid #e7dcff;border-radius:22px;background:linear-gradient(135deg,#fbf9ff 0%,#fffdf2 100%);box-shadow:0 12px 32px rgba(73,63,130,.08)}
      .plus-insights__head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}.plus-insights__head small{display:block;color:#7c3aed;font-size:10px;font-weight:900;letter-spacing:1px;text-transform:uppercase}.plus-insights__head h3{margin:4px 0 5px;color:#17213a;font-size:20px}.plus-insights__head p{margin:0;color:#66758c;font-size:13px}.plus-insights__badge{padding:6px 10px;border-radius:999px;background:#fff2a8;color:#725300;font-size:10px;font-weight:900;white-space:nowrap}
      .plus-insights__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.plus-insight-card{padding:16px;border:1px solid #e5e8ef;border-radius:16px;background:#fff}.plus-insight-card span{display:block;margin-bottom:6px;color:#7c8799;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px}.plus-insight-card strong{display:block;color:#1c2940;font-size:16px;line-height:1.25}.plus-insight-card p{margin:6px 0 0;color:#68758a;font-size:12px;line-height:1.45}.plus-insights__actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.plus-insights__actions a{display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border-radius:11px;text-decoration:none;font-size:12px;font-weight:800}.plus-insights__actions a:first-child{background:#4f46e5;color:#fff}.plus-insights__actions a:last-child{background:#eef2ff;color:#4338ca}
      @media(max-width:850px){.plus-insights__grid{grid-template-columns:1fr}.plus-insights__head{flex-direction:column}}
    `;
    document.head.appendChild(style);
  }

  function readSubjects() {
    return [...document.querySelectorAll(".subject-row")].map((row) => {
      const name = row.querySelector(".subject-row__name span:last-child")?.textContent?.trim() || "Matéria";
      const score = row.querySelector(".subject-row__score")?.textContent || "";
      const match = score.match(/(\d+)%/);
      const accuracy = match ? Number(match[1]) : null;
      const answered = !/sem dados/i.test(score) && accuracy !== null;
      return { name, accuracy, answered };
    }).filter((item) => item.answered);
  }

  function cleanName(name) {
    return name.replace(/^[^A-Za-zÀ-ÿƒ]+\s*/, "").trim();
  }

  function render() {
    ensureStyles();
    const active = Boolean(window.MENTE_PLUS?.isActive?.());
    const existing = document.querySelector("#plus-profile-insights");
    if (!active) { existing?.remove(); return; }

    const anchor = document.querySelector(".profile-showcase") || document.querySelector(".profile-summary");
    if (!anchor) return;
    const subjects = readSubjects();
    const sorted = [...subjects].sort((a,b) => b.accuracy - a.accuracy);
    const best = sorted[0] || null;
    const priority = sorted.length ? sorted[sorted.length - 1] : null;
    const focus = priority ? cleanName(priority.name) : "uma matéria para gerar diagnóstico";

    let section = existing;
    if (!section) {
      section = document.createElement("section");
      section.id = "plus-profile-insights";
      section.className = "plus-insights";
      anchor.insertAdjacentElement("afterend", section);
    }

    section.innerHTML = `
      <div class="plus-insights__head"><div><small>★ M.E.N.T.E Plus</small><h3>Diagnóstico avançado</h3><p>Uma leitura mais detalhada do seu desempenho para decidir o próximo estudo.</p></div><span class="plus-insights__badge">EXCLUSIVO PLUS</span></div>
      <div class="plus-insights__grid">
        <article class="plus-insight-card"><span>Ponto forte</span><strong>${best ? `${best.name} · ${best.accuracy}%` : "Ainda sem dados"}</strong><p>${best ? "É a matéria com melhor taxa de acerto entre as que você já praticou." : "Responda algumas questões para o Plus identificar seu ponto forte."}</p></article>
        <article class="plus-insight-card"><span>Prioridade de revisão</span><strong>${priority ? `${priority.name} · ${priority.accuracy}%` : "Gerar diagnóstico"}</strong><p>${priority ? "Essa matéria aparece primeiro na revisão inteligente por ter a menor taxa atual." : "Seu histórico ainda é pequeno; o diagnóstico melhora conforme você pratica."}</p></article>
        <article class="plus-insight-card"><span>Próxima ação sugerida</span><strong>${priority ? `Revisar ${focus}` : "Fazer uma rodada de questões"}</strong><p>O Plus combina erros e desempenho para sugerir uma sequência de revisão.</p></article>
      </div>
      <div class="plus-insights__actions"><a href="revisao-plus.html">Abrir Revisão Inteligente →</a><a href="roteiro.html">Ir para o roteiro adaptativo</a></div>`;
  }

  window.addEventListener("mente:plan-updated", render);
  window.addEventListener("mente:profile-updated", render);
  window.addEventListener("load", render, { once: true });
  setTimeout(render, 700);
  setTimeout(render, 1700);
})();
