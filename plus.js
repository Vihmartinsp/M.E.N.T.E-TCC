"use strict";

(() => {
  if (document.body.dataset.page !== "plus") return;
  const main = document.querySelector(".portal-main");
  if (!main) return;

  const rows = [
    ["30 questões oficiais e explicações completas", true, true],
    ["Busca, filtros e progresso", true, true],
    ["Roteiro de estudos", true, true],
    ["Simulados em formatos prontos", true, true],
    ["Perfil, metas e emblemas", true, true],
    ["Avatares básicos", true, true],
    ["Avatares e acessórios especiais", false, true],
    ["Personalização de quantidade e tempo do simulado", false, true],
    ["Análises avançadas de desempenho", false, true],
    ["Revisão inteligente e recursos adaptativos", false, true],
    ["Desafios e recompensas exclusivas", false, true],
  ];

  function currentState() {
    return window.MENTE_PLUS?.state || { active:false, actualActive:false, trialUsed:false, expiresAt:null, loaded:false, role:"aluno", preview:"real" };
  }

  function isStaff(state) {
    return ["admin", "super_admin"].includes(String(state.role || "").toLowerCase());
  }

  function stateCopy(state) {
    const previewing = isStaff(state) && state.preview !== "real";
    if (state.active) {
      const date = state.actualActive && state.expiresAt ? window.MENTE_PLUS?.formatDate?.(state.expiresAt) : "";
      return {
        title: previewing ? "Prévia do M.E.N.T.E Plus" : "M.E.N.T.E Plus ativo",
        text: previewing ? "Você está vendo a experiência Plus em modo administrativo." : date ? `Seu acesso Plus está liberado até ${date}.` : "Seu acesso Plus está liberado.",
        detail: previewing ? "Essa prévia não altera o plano real da sua conta." : "Recursos premium disponíveis neste perfil.",
      };
    }
    return {
      title: previewing ? "Prévia do Plano Convencional" : "Plano Convencional",
      text: previewing ? "Você está vendo exatamente como a experiência convencional se comporta para um aluno." : "As ferramentas essenciais de estudo continuam disponíveis gratuitamente.",
      detail: previewing ? "Essa prévia não altera o plano real da sua conta." : state.trialUsed ? "Seu teste gratuito já foi utilizado." : "Você pode experimentar o Plus por 7 dias.",
    };
  }

  function render() {
    const state = currentState();
    const staff = isStaff(state);
    const previewing = staff && state.preview !== "real";
    const copy = stateCopy(state);
    main.innerHTML = `
      <div class="plus-page">
        <section class="plus-hero">
          <div>
            <p class="plus-eyebrow">Uma camada extra de personalização e inteligência</p>
            <h2>M.E.N.T.E <span>Plus</span></h2>
            <p>O plano convencional mantém todas as funcionalidades educacionais essenciais. O Plus amplia a experiência com personalização, análises, recursos adaptativos e gamificação avançada.</p>
            ${staff ? `<div class="plus-admin-preview">👑 <strong>Modo administrador:</strong> use o seletor “Visualizar” no topo para alternar entre <strong>Convencional</strong> e <strong>Plus</strong>. Isso muda apenas a prévia da interface e não altera o plano real da conta.</div>` : ""}
            <div class="plus-hero__actions">
              <button class="plus-primary" id="plus-trial" type="button" ${staff || state.actualActive || state.trialUsed ? "disabled" : ""}>${staff ? "Prévia disponível no topo" : state.actualActive ? "★ Plus ativo" : state.trialUsed ? "Teste já utilizado" : "Experimentar Plus por 7 dias"}</button>
              <a class="plus-secondary" href="desempenho.html">Voltar ao perfil</a>
            </div>
            <p class="plus-feedback" id="plus-feedback" aria-live="polite"></p>
          </div>
          <aside class="plus-status-card">
            <small>${previewing ? "Modo de visualização" : "Seu plano atual"}</small>
            <strong>${copy.title}</strong>
            <p>${copy.text}</p>
            <div class="plus-status-card__line"></div>
            <b>${copy.detail}</b>
          </aside>
        </section>

        <section class="plus-section">
          <div class="plus-section-head"><div><h3>Dois planos, o mesmo objetivo educacional</h3><p>O conteúdo essencial não fica bloqueado. O Plus adiciona ferramentas extras de personalização e acompanhamento.</p></div><span class="plus-pill">VERSÃO TCC</span></div>
          <div class="plus-plans">
            <article class="plus-plan ${!state.active ? "plus-plan--selected" : ""}">
              <span class="plus-plan__badge">CONVENCIONAL</span>
              <h4>M.E.N.T.E</h4>
              <div class="plus-plan__price"><strong>Gratuito</strong><span>recursos essenciais</span></div>
              <p>Para estudar, praticar e acompanhar sua evolução sem perder as funções principais da plataforma.</p>
              <ul class="plus-feature-list"><li>Questões e explicações completas</li><li>Roteiro de estudos</li><li>Simulados prontos</li><li>Perfil, metas, XP e emblemas</li><li>Avatares básicos</li></ul>
            </article>
            <article class="plus-plan plus-plan--plus ${state.active ? "plus-plan--selected" : ""}">
              <span class="plus-plan__badge">PLUS</span>
              <h4>M.E.N.T.E Plus</h4>
              <div class="plus-plan__price"><strong>7 dias</strong><span>teste demonstrativo</span></div>
              <p>Uma experiência ampliada para quem quer mais personalização, análise e recursos inteligentes.</p>
              <ul class="plus-feature-list"><li>Tudo do plano convencional</li><li>Avatares e itens especiais</li><li>Simulados mais personalizáveis</li><li>Análises avançadas</li><li>Recursos adaptativos e recompensas exclusivas</li></ul>
            </article>
          </div>
        </section>

        <section class="plus-section">
          <div class="plus-section-head"><div><h3>Comparação de recursos</h3><p>Uma visão clara do que cada plano oferece.</p></div></div>
          <div class="plus-compare"><table><thead><tr><th>Recurso</th><th>Convencional</th><th>M.E.N.T.E Plus</th></tr></thead><tbody>${rows.map(([label,free,plus])=>`<tr><td>${label}</td><td class="${free?"plus-check":"plus-muted"}">${free?"✓":"—"}</td><td class="${plus?"plus-star":"plus-muted"}">${plus?"★":"—"}</td></tr>`).join("")}</tbody></table></div>
        </section>

        <section class="plus-section">
          <div class="plus-section-head"><div><h3>Os 4 pilares do Plus</h3><p>O premium foi pensado para enriquecer a experiência, não para limitar o aprendizado básico.</p></div></div>
          <div class="plus-pillars">
            <article class="plus-pillar"><span>🎨</span><h4>Personalização</h4><p>Mais avatares, itens especiais e futuras opções visuais para deixar o perfil com a cara do aluno.</p></article>
            <article class="plus-pillar"><span>🧠</span><h4>Inteligência</h4><p>Espaço para recursos adaptativos, dicas avançadas e revisão orientada pelo desempenho.</p></article>
            <article class="plus-pillar"><span>📊</span><h4>Desempenho</h4><p>Análises mais detalhadas para identificar forças, dificuldades e padrões de evolução.</p></article>
            <article class="plus-pillar"><span>🏆</span><h4>Gamificação</h4><p>Desafios, recompensas, itens e conquistas exclusivas para tornar a rotina de estudo mais envolvente.</p></article>
          </div>
        </section>

        <div class="plus-note"><strong>Importante para o TCC:</strong> esta versão não realiza cobrança real. O sistema de planos, controle de acesso e teste de 7 dias funciona no Supabase M.E.N.T.E 2, deixando a arquitetura pronta para uma futura integração com pagamento sem armazenar dados financeiros no projeto atual.</div>
      </div>`;

    document.querySelector("#plus-trial")?.addEventListener("click", activateTrial);
  }

  async function activateTrial() {
    const state = currentState();
    if (isStaff(state)) return;
    const button = document.querySelector("#plus-trial");
    const feedback = document.querySelector("#plus-feedback");
    if (!button || !feedback) return;
    button.disabled = true;
    feedback.classList.remove("is-error");
    feedback.textContent = "Ativando seu teste Plus...";

    const client = window.menteSupabase;
    if (!client) {
      feedback.classList.add("is-error");
      feedback.textContent = "A conexão com o M.E.N.T.E 2 ainda não ficou disponível. Tente novamente em alguns segundos.";
      button.disabled = false;
      return;
    }

    try {
      const { data: sessionData } = await client.auth.getSession();
      if (!sessionData?.session?.user) throw new Error("Faça login novamente para ativar o teste Plus.");
      const { error } = await client.rpc("ativar_teste_mente_plus", { p_dias: 7 });
      if (error) throw error;
      window.dispatchEvent(new CustomEvent("mente:plan-refresh"));
      await window.MENTE_PLUS?.refresh?.();
      feedback.textContent = "M.E.N.T.E Plus ativado! Seus recursos premium já estão liberados.";
      setTimeout(render, 400);
    } catch (error) {
      feedback.classList.add("is-error");
      feedback.textContent = error?.message || "Não foi possível ativar o teste agora.";
      button.disabled = false;
    }
  }

  window.addEventListener("mente:plan-updated", render);
  render();
})();
