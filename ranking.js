"use strict";

(() => {
  if (document.body.dataset.page !== "ranking") return;
  const root = document.querySelector("#ranking-root");
  if (!root) return;

  const state={client:null,user:null,rows:[],loading:false,error:null};
  const esc=(value)=>String(value??"").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const isPlus=()=>Boolean(window.MENTE_PLUS?.isActive?.());
  const initials=(name)=>String(name||"Aluno").trim().split(/\s+/).slice(0,2).map(p=>p[0]?.toUpperCase()||"").join("")||"A";

  function waitForClient(){
    if(window.menteSupabase)return Promise.resolve(window.menteSupabase);
    return new Promise((resolve)=>{let done=false;const finish=()=>{if(done)return;done=true;resolve(window.menteSupabase||null)};window.addEventListener("mente:supabase-ready",finish,{once:true});setTimeout(finish,2200)});
  }

  function currentIndex(){return state.user?state.rows.findIndex((row)=>row.user_id===state.user.id):-1}
  function currentRow(){const i=currentIndex();return i>=0?state.rows[i]:null}

  function render(){
    if(state.loading){root.innerHTML='<div class="ranking-page"><div class="ranking-empty">Carregando o ranking da comunidade...</div></div>';return}
    if(state.error){root.innerHTML=`<div class="ranking-page"><div class="ranking-empty">Não foi possível carregar o ranking agora.<br><button class="ranking-refresh" id="ranking-retry" type="button" style="margin-top:12px">Tentar novamente</button></div></div>`;document.querySelector("#ranking-retry")?.addEventListener("click",load);return}

    const rows=state.rows,top=rows.slice(0,3),idx=currentIndex(),me=currentRow(),position=idx>=0?idx+1:null;
    const podiumOrder=top.length>=3?[top[1],top[0],top[2]]:top;
    root.innerHTML=`<div class="ranking-page">
      <section class="ranking-explainer"><div><small>Ranking por evolução</small><strong>XP define a classificação — não os pontos disponíveis</strong><p>Assim, gastar pontos para revisar questões não faz você cair no ranking. Questões e jogos podem gerar XP, enquanto os jogos têm limite diário para evitar vantagem por repetição.</p></div><span class="ranking-explainer__chip">Atualização online</span></section>

      <section class="ranking-podium"><div class="ranking-podium__head"><div><h3>Pódio M.E.N.T.E</h3><p>Os três estudantes com maior XP acumulado.</p></div><button class="ranking-refresh" id="ranking-refresh" type="button">Atualizar ranking</button></div>
        ${top.length?`<div class="podium-grid">${podiumOrder.map((row)=>{const pos=rows.indexOf(row)+1;return`<article class="podium-card ${pos===1?"is-first":""} ${state.user?.id===row.user_id?"is-current":""}"><span class="podium-position">${pos}º</span><div class="podium-avatar">${esc(initials(row.nome_publico))}</div><strong>${esc(row.nome_publico||"Aluno")}</strong><b>${Number(row.xp)||0} XP</b><span>Nível ${Number(row.nivel)||1}${state.user?.id===row.user_id?" · você":""}</span></article>`}).join("")}</div>`:'<div class="ranking-empty">O ranking começa a aparecer quando os alunos acumulam XP.</div>'}
      </section>

      <div class="ranking-layout">
        <section class="ranking-list-card"><div class="ranking-list-card__head"><div><h3>Classificação geral</h3><p>Até 50 posições, ordenadas por XP acumulado.</p></div></div>
          ${rows.length?`<div class="ranking-list">${rows.map((row,index)=>`<div class="ranking-row ${state.user?.id===row.user_id?"is-current":""}"><span class="ranking-row__pos">${index+1}</span><div class="ranking-row__user"><span class="ranking-row__avatar">${esc(initials(row.nome_publico))}</span><div><strong>${esc(row.nome_publico||"Aluno")}</strong><small>${state.user?.id===row.user_id?"Sua posição atual":"Estudante M.E.N.T.E"}</small></div></div><span class="ranking-row__xp">${Number(row.xp)||0} XP</span><span class="ranking-row__level">Nível ${Number(row.nivel)||1}</span></div>`).join("")}</div>`:'<div class="ranking-empty">Ainda não há estudantes classificados.</div>'}
        </section>

        <aside class="ranking-side">
          <section class="ranking-me"><h3>Sua posição</h3><p>O ranking usa XP, que representa evolução acumulada.</p>${state.user?(me?`<div class="ranking-me__position"><strong>${position}º</strong><span>de ${rows.length} participantes</span></div><div class="ranking-me__stats"><div><small>Seu XP</small><b>${Number(me.xp)||0}</b></div><div><small>Seu nível</small><b>${Number(me.nivel)||1}</b></div></div>`:'<div class="ranking-empty" style="margin-top:12px">Responda uma questão ou conclua um jogo valendo XP para entrar no ranking.</div>'):'<div class="ranking-empty" style="margin-top:12px">Entre na sua conta para destacar sua posição.</div>'}</section>
          ${renderPlusInsight(me,idx)}
        </aside>
      </div>
    </div>`;
    document.querySelector("#ranking-refresh")?.addEventListener("click",load);
    document.querySelector("#ranking-plus-insight")?.addEventListener("click",()=>{if(!isPlus())window.MENTE_PLUS?.openUpgrade?.("A análise estratégica do Ranking M.E.N.T.E")});
  }

  function renderPlusInsight(me,idx){
    const active=isPlus();let distanceText="Entre no ranking para liberar sua análise.",levelText="Complete atividades para gerar XP.";
    if(me){
      const xp=Number(me.xp)||0;const next=idx>0?state.rows[idx-1]:null;const distance=next?Math.max(1,(Number(next.xp)||0)-xp+1):0;const toLevel=xp%100===0?100:100-(xp%100);
      distanceText=next?`Faltam ${distance} XP para ultrapassar ${next.nome_publico||"a posição acima"}.`:"Você está no topo do ranking atual.";
      levelText=`Faltam ${toLevel} XP para a próxima faixa de nível.`;
    }
    return `<section class="ranking-plus-insight ${active?"":"ranking-plus-locked"}" id="ranking-plus-insight"><small>Análise Plus</small><h3>Próximo movimento</h3><p>Uma leitura rápida para transformar posição em meta de estudo.</p><div class="ranking-plus-insight__metric"><b>${active?"Distância no ranking":"Análise bloqueada"}</b><span>${active?esc(distanceText):"Veja quanto XP falta para alcançar a próxima posição."}</span></div><div class="ranking-plus-insight__metric"><b>${active?"Meta de nível":"Meta inteligente"}</b><span>${active?esc(levelText):"Receba uma meta baseada no seu XP atual."}</span></div></section>`;
  }

  async function load(){
    if(state.loading)return;state.loading=true;state.error=null;render();
    try{
      state.client=state.client||await waitForClient();if(!state.client)throw new Error("Conexão indisponível");
      const {data:sessionData}=await state.client.auth.getSession();state.user=sessionData?.session?.user||null;
      const {data,error}=await state.client.from("ranking").select("user_id,nome_publico,xp,nivel,updated_at").order("xp",{ascending:false}).order("updated_at",{ascending:true}).limit(50);
      if(error)throw error;state.rows=data||[];
    }catch(error){state.error=error;console.warn("[M.E.N.T.E Ranking]",error)}finally{state.loading=false;render()}
  }

  load();
  window.addEventListener("mente:plan-updated",()=>{if(!state.loading)render()});
  window.addEventListener("mente:points-updated",()=>setTimeout(load,300));
})();
