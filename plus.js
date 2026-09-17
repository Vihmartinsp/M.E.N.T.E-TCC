"use strict";

(() => {
  if (document.body.dataset.page !== "plus") return;
  const main = document.querySelector(".portal-main");
  if (!main) return;

  const rows = [
    ["30 questões oficiais e explicações completas", true, true],
    ["Busca, filtros e progresso", true, true],
    ["Roteiro de estudos com missões verificadas", true, true],
    ["Simulados em formatos prontos", true, true],
    ["Jogos matemáticos com recompensa diária limitada", true, true],
    ["Ranking geral por XP", true, true],
    ["Perfil, metas, XP e emblemas", true, true],
    ["Editor de avatar com peças básicas", true, true],
    ["Itens de avatar desbloqueáveis por mérito", true, true],
    ["Cabelos, cores, roupas, acessórios e fundos Plus", false, true],
    ["Personalização de quantidade e tempo do simulado", false, true],
    ["Modo Foco nos jogos: tema e dificuldade", false, true],
    ["Histórico detalhado de partidas", false, true],
    ["Análise estratégica da posição no ranking", false, true],
    ["Diagnóstico avançado no perfil", false, true],
    ["Revisão Inteligente com fila de erros priorizada", false, true],
  ];

  const stateNow = () => window.MENTE_PLUS?.state || { active:false, actualActive:false, trialUsed:false, expiresAt:null, role:"aluno", preview:"real" };
  const isStaff = (state) => ["admin","super_admin"].includes(String(state.role || "").toLowerCase());

  function copyFor(state) {
    const preview = isStaff(state) && state.preview !== "real";
    if (preview) return { title: state.active ? "Prévia do M.E.N.T.E Plus" : "Prévia do Plano Convencional", text: "Você está comparando a experiência como administrador.", detail: "O plano real da sua conta não é alterado." };
    if (state.actualActive) {
      const date = state.expiresAt ? window.MENTE_PLUS?.formatDate?.(state.expiresAt) : "";
      return { title:"M.E.N.T.E Plus ativo", text:date ? `Seu acesso Plus está liberado até ${date}.` : "Seu acesso Plus está liberado.", detail:"Recursos premium disponíveis neste perfil." };
    }
    return { title:"Plano Convencional", text:"As ferramentas essenciais de estudo continuam disponíveis gratuitamente.", detail:state.trialUsed ? "Seu teste gratuito já foi utilizado." : "Você pode experimentar o Plus por 7 dias ou conquistá-lo pelo seu desempenho." };
  }

  function render() {
    const state = stateNow();
    const staff = isStaff(state);
    const preview = staff && state.preview !== "real";
    const copy = copyFor(state);
    const active = Boolean(state.active);

    main.innerHTML = `<div class="plus-page">
      <section class="plus-hero"><div>
        <p class="plus-eyebrow">Mais personalização, análise e revisão</p><h2>M.E.N.T.E <span>Plus</span></h2>
        <p>O plano convencional mantém as funções educacionais essenciais. O Plus acrescenta recursos avançados de personalização, análise e estudo sem transformar o ranking em vantagem paga.</p>
        ${staff ? '<div class="plus-admin-preview">👑 <strong>Modo administrador:</strong> este aviso e o seletor “Visualizar” aparecem apenas para contas administrativas. Use o topo para comparar Convencional e Plus sem alterar o plano real.</div>' : ''}
        <div class="plus-hero__actions">
          ${active ? '<a class="plus-primary" href="revisao-plus.html">Abrir Revisão Inteligente →</a>' : `<button class="plus-primary" id="plus-trial" type="button" ${staff || state.actualActive || state.trialUsed ? "disabled" : ""}>${staff ? "Prévia disponível no topo" : state.trialUsed ? "Teste já utilizado" : "Experimentar Plus por 7 dias"}</button>`}
          <a class="plus-secondary" href="jogos.html">Ver Jogos</a><a class="plus-secondary" href="ranking.html">Ver Ranking</a>
        </div><p class="plus-feedback" id="plus-feedback" aria-live="polite"></p>
      </div><aside class="plus-status-card"><small>${preview ? "Modo de visualização" : "Seu plano atual"}</small><strong>${copy.title}</strong><p>${copy.text}</p><div class="plus-status-card__line"></div><b>${copy.detail}</b></aside></section>

      <section class="plus-section"><div class="plus-section-head"><div><h3>Dois planos, o mesmo objetivo educacional</h3><p>Questões, ranking e jogos continuam acessíveis a todos. O Plus aprofunda a personalização e a análise.</p></div></div>
        <div class="plus-plans"><article class="plus-plan ${!active ? "plus-plan--selected" : ""}"><span class="plus-plan__badge">CONVENCIONAL</span><h4>M.E.N.T.E</h4><div class="plus-plan__price"><strong>Gratuito</strong><span>recursos essenciais</span></div><p>Para estudar, praticar, jogar e acompanhar a evolução normalmente.</p><ul class="plus-feature-list"><li>Questões e explicações completas</li><li>Roteiro de estudos</li><li>Simulados prontos</li><li>Jogos com pontos limitados por dia</li><li>Ranking geral por XP</li><li>Perfil, XP, metas e emblemas</li><li>Avatar personalizável com peças básicas</li></ul></article>
        <article class="plus-plan plus-plan--plus ${active ? "plus-plan--selected" : ""}"><span class="plus-plan__badge">PLUS</span><h4>M.E.N.T.E Plus</h4><div class="plus-plan__price"><strong>7 dias</strong><span>teste gratuito inicial</span></div><p>Para quem quer uma experiência mais personalizada e orientada pelo próprio desempenho.</p><ul class="plus-feature-list"><li>Tudo do Convencional</li><li>Mais itens para o avatar</li><li>Simulado personalizável</li><li>Modo Foco nos jogos</li><li>Histórico detalhado de partidas</li><li>Análise estratégica do ranking</li><li>Diagnóstico avançado</li><li>Revisão Inteligente</li></ul></article></div></section>

      <section class="plus-section"><div class="plus-section-head"><div><h3>Ganhe Plus pelo seu esforço</h3><p>Como os jogos agora também rendem pontos, os marcos ficaram mais altos. A sequência de dias continua obrigatória, então não basta repetir partidas.</p></div></div>
        <div class="plus-pillars">
          <article class="plus-pillar"><span>🔥</span><h4>7 dias + 500 pontos</h4><p>Conquiste <strong>3 dias de Plus</strong> ao manter sua primeira sequência de uma semana.</p></article>
          <article class="plus-pillar"><span>⭐</span><h4>14 dias + 1.200 pontos</h4><p>Conquiste <strong>mais 7 dias de Plus</strong> por consistência real nos estudos.</p></article>
          <article class="plus-pillar"><span>🏆</span><h4>30 dias + 2.500 pontos</h4><p>Conquiste <strong>mais 15 dias de Plus</strong> ao atingir o maior marco de mérito.</p></article>
          <article class="plus-pillar"><span>✨</span><h4>Recompensa automática</h4><p>Ao atingir os dois requisitos, o acesso é liberado automaticamente e os dias são adicionados ao seu plano.</p></article>
        </div>
        <div id="plus-merit-progress" style="margin-top:18px"><p style="color:#64748b">Carregando seu progresso de mérito...</p></div>
      </section>

      <section class="plus-section"><div class="plus-section-head"><div><h3>Novidades Plus</h3><p>Recursos novos que já conversam com Jogos e Ranking.</p></div></div><div class="plus-pillars">
        <article class="plus-pillar"><span>🎯</span><h4>Modo Foco nos jogos</h4><p>Escolha entre Porcentagem, Equações, Geometria, Estatística ou modo misto e ative a dificuldade Expert. A recompensa diária continua igual para todos.</p></article>
        <article class="plus-pillar"><span>🗂️</span><h4>Histórico de partidas</h4><p>Veja suas últimas partidas, acertos, pontos recebidos e horários para acompanhar sua regularidade.</p></article>
        <article class="plus-pillar"><span>📈</span><h4>Análise do ranking</h4><p>Descubra quanto XP falta para alcançar a posição acima e qual é sua próxima meta de nível.</p></article>
        <article class="plus-pillar"><span>🧠</span><h4>Revisão Inteligente</h4><p>Erros registrados continuam sendo organizados automaticamente para priorizar os conteúdos mais frágeis.</p></article>
      </div></section>

      <section class="plus-section"><div class="plus-section-head"><div><h3>Comparação de recursos</h3><p>As diferenças abaixo já estão aplicadas nesta versão do site.</p></div></div><div class="plus-compare"><table><thead><tr><th>Recurso</th><th>Convencional</th><th>M.E.N.T.E Plus</th></tr></thead><tbody>${rows.map(([label,free,plus]) => `<tr><td>${label}</td><td class="${free ? "plus-check" : "plus-muted"}">${free ? "✓" : "—"}</td><td class="${plus ? "plus-star" : "plus-muted"}">${plus ? "★" : "—"}</td></tr>`).join("")}</tbody></table></div></section>

      <section class="plus-section"><div class="plus-section-head"><div><h3>O que muda na prática?</h3><p>O Plus melhora a experiência sem bloquear o conteúdo educacional principal.</p></div></div><div class="plus-pillars">
        <article class="plus-pillar"><span>🎨</span><h4>Avatar personalizável</h4><p>Todo aluno monta seu personagem. O Plus libera estilos extras de cabelo, cores, roupas, acessórios, fundos e molduras.</p></article>
        <article class="plus-pillar"><span>🧪</span><h4>Simulado</h4><p>Formatos prontos são gratuitos; quantidade e tempo personalizados são liberados no Plus.</p></article>
        <article class="plus-pillar"><span>🎮</span><h4>Jogos</h4><p>Todos podem jogar e ganhar pontos dentro do mesmo limite diário. O Plus libera filtros de tema, dificuldade e histórico.</p></article>
        <article class="plus-pillar"><span>📊</span><h4>Diagnóstico e ranking</h4><p>O Plus mostra leituras extras do desempenho e metas mais específicas, sem alterar a pontuação do ranking.</p></article>
      </div></section>
    </div>`;

    document.querySelector("#plus-trial")?.addEventListener("click", activateTrial);
  }

  async function activateTrial() {
    const state = stateNow();
    if (isStaff(state)) return;
    const button = document.querySelector("#plus-trial"), feedback = document.querySelector("#plus-feedback");
    if (!button || !feedback) return;
    button.disabled = true;
    button.textContent = "Ativando...";
    feedback.textContent = "Preparando seu acesso Plus...";
    feedback.classList.remove("is-error");
    try {
      const client = window.menteSupabase;
      if (!client) throw new Error("A conexão com o M.E.N.T.E 2 ainda não está disponível.");
      const { data: sessionData } = await client.auth.getSession();
      if (!sessionData?.session?.user) throw new Error("Faça login novamente para ativar o teste Plus.");
      const { data, error } = await client.rpc("ativar_teste_mente_plus", { p_dias:7 });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      const date = row?.plus_expira_em ? window.MENTE_PLUS?.formatDate?.(row.plus_expira_em) : "";
      button.textContent = "✓ Teste Plus em andamento";
      feedback.textContent = date ? `Seu teste Plus está em andamento até ${date}. Aproveite os recursos premium!` : "Seu teste Plus de 7 dias está em andamento. Aproveite os recursos premium!";
      setTimeout(() => window.MENTE_PLUS?.refresh?.(), 1400);
    } catch (error) {
      feedback.classList.add("is-error");
      feedback.textContent = error?.message || "Não foi possível ativar o teste agora.";
      button.disabled = false;
      button.textContent = "Experimentar Plus por 7 dias";
    }
  }

  window.addEventListener("mente:plan-updated", render);
  render();
})();
