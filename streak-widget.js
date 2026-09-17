"use strict";

(() => {
  const state={client:null,data:null,selected:null,loading:false};
  const esc=(value)=>String(value??"").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function waitForClient(){
    if(window.menteSupabase)return Promise.resolve(window.menteSupabase);
    return new Promise((resolve)=>{
      let done=false;
      const finish=()=>{if(done)return;done=true;resolve(window.menteSupabase||null)};
      window.addEventListener("mente:supabase-ready",finish,{once:true});
      setTimeout(finish,2200);
    });
  }

  function dateObj(value){return new Date(`${value}T12:00:00`)}
  function weekday(value,short=false){
    const text=new Intl.DateTimeFormat("pt-BR",{weekday:short?"short":"long"}).format(dateObj(value)).replace("-feira","");
    return short?text.replace(".","").slice(0,3):text;
  }
  function dateLabel(value){return new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short"}).format(dateObj(value)).replace(".","")}
  function fullDate(value){return new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"2-digit",month:"long"}).format(dateObj(value))}

  function ensureSlot(){
    if(document.querySelector("#mente-streak-widget"))return document.querySelector("#mente-streak-widget");
    const main=document.querySelector(".portal-main");
    if(!main)return null;
    const host=document.createElement("section");
    host.id="mente-streak-widget";
    host.className="mente-streak";
    const hero=main.querySelector(".portal-hero");
    main.insertBefore(host,hero||main.firstChild);
    return host;
  }

  function renderLoading(){
    const host=ensureSlot();if(!host)return;
    host.innerHTML='<div class="mente-streak__loading">Carregando sua sequência de estudos...</div>';
  }

  function renderGuest(){
    const host=ensureSlot();if(!host)return;
    host.innerHTML='<div class="mente-streak__guest"><strong>Sequência de estudos</strong> · <a href="login.html">Entre na sua conta</a> para acompanhar seus dias e pontos.</div>';
  }

  function dayClass(day){return `${day.na_sequencia?" is-active":""}${day.hoje?" is-today":""}`}

  function render(){
    const host=ensureSlot();if(!host)return;
    const data=state.data;
    if(!data?.autenticado){renderGuest();return}
    const days=Array.isArray(data.dias)?data.dias:[];
    const week=days.slice(-7);
    const today=week.find(day=>day.hoje)||week[week.length-1];
    if(!state.selected)state.selected=today?.data||days[days.length-1]?.data||null;
    const selected=days.find(day=>day.data===state.selected)||today||days[days.length-1];
    const todayBonus=Number(today?.bonus_pontos)||0;
    const nextBonus=Number(data.bonus_proximo)||10;
    const bonusCopy=today?.na_sequencia?`Hoje: +${todayBonus} pts de sequência`:`Complete o dia para +${nextBonus} pts`;
    const seq=Number(data.sequencia)||0;

    host.innerHTML=`
      <button class="mente-streak__summary" type="button" id="mente-streak-toggle" aria-expanded="false">
        <span class="mente-streak__flame" aria-hidden="true">◆</span>
        <span class="mente-streak__copy"><small>Sequência de estudos</small><strong>${seq} dia${seq===1?"":"s"} seguido${seq===1?"":"s"}</strong><span>${esc(bonusCopy)}</span></span>
        <span class="mente-streak__week">${week.map(day=>`<span class="mente-streak__day${dayClass(day)}"><b>${esc(weekday(day.data,true))}</b><i>${day.na_sequencia?"✓":dateObj(day.data).getDate()}</i><small>${Number(day.pontos_dia)||0} pts</small></span>`).join("")}</span>
        <span class="mente-streak__chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="mente-streak__details" id="mente-streak-details">
        <div class="mente-streak__panel">
          <div class="mente-streak__panel-head"><strong>Seus últimos 14 dias</strong><span>Clique em um dia para ver os pontos.</span></div>
          <div class="mente-streak__history">${days.map(day=>`<button type="button" class="mente-streak__history-day${dayClass(day)}${day.data===state.selected?" is-selected":""}" data-streak-day="${esc(day.data)}"><small>${esc(weekday(day.data,true))} · ${esc(dateLabel(day.data))}</small><strong>${day.na_sequencia?"Dia mantido":"Sem sequência"}</strong><span>${Number(day.pontos_dia)||0} pontos</span></button>`).join("")}</div>
          ${selected?`<div class="mente-streak__selected"><strong>${esc(fullDate(selected.data))}${selected.hoje?" · hoje":""}</strong><div class="mente-streak__metric"><small>Pontos do dia</small><b>${Number(selected.pontos_dia)||0}</b></div><div class="mente-streak__metric"><small>Atividades</small><b>${Number(selected.pontos_atividade)||0}</b></div><div class="mente-streak__metric"><small>Bônus sequência</small><b>+${Number(selected.bonus_pontos)||0}</b></div></div>`:""}
        </div>
      </div>`;

    const toggle=host.querySelector("#mente-streak-toggle");
    toggle?.addEventListener("click",()=>{
      const open=host.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded",String(open));
    });
    host.querySelectorAll("[data-streak-day]").forEach(button=>button.addEventListener("click",()=>{
      state.selected=button.dataset.streakDay;
      const wasOpen=host.classList.contains("is-open");
      render();
      if(wasOpen){host.classList.add("is-open");host.querySelector("#mente-streak-toggle")?.setAttribute("aria-expanded","true")}
    }));
  }

  async function load(){
    if(state.loading)return;
    state.loading=true;renderLoading();
    try{
      state.client=state.client||await waitForClient();
      if(!state.client){state.data={autenticado:false};render();return}
      const {data:sessionData}=await state.client.auth.getSession();
      if(!sessionData?.session?.user){state.data={autenticado:false};render();return}
      const {data,error}=await state.client.rpc("mente_sequencia_resumo");
      if(error)throw error;
      state.data=data||{autenticado:true,sequencia:0,dias:[]};
      render();
    }catch(error){
      console.warn("[M.E.N.T.E Sequência]",error);
      const host=ensureSlot();if(host)host.innerHTML='<div class="mente-streak__loading">Não foi possível carregar a sequência agora.</div>';
    }finally{state.loading=false}
  }

  function boot(){if(!ensureSlot()){setTimeout(boot,80);return}load()}
  boot();
  window.addEventListener("mente:points-updated",()=>setTimeout(load,220));
  window.addEventListener("mente:plan-updated",()=>setTimeout(load,220));
  window.addEventListener("mente:supabase-ready",()=>{if(!state.client)setTimeout(load,120)});
  window.addEventListener("focus",()=>{if(state.data)setTimeout(load,120)});
})();