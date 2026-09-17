"use strict";

(() => {
  if (document.body.dataset.page !== "jogos") return;
  const root = document.querySelector("#games-root");
  if (!root) return;

  const state = {
    client: null,
    user: null,
    status: { partidas_hoje:0, pontos_jogos_hoje:0, limite_partidas:3, limite_pontos:30, total_partidas:0, melhor_pontuacao:0 },
    timer: null,
    seconds: 0,
    startedAt: 0,
    game: null,
    domino: null,
    sprint: null,
    history: []
  };

  const $ = (selector) => document.querySelector(selector);
  const isPlus = () => Boolean(window.MENTE_PLUS?.isActive?.());
  const shuffle = (items) => [...items].sort(() => Math.random() - .5);
  const rand = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function waitForClient(){
    if(window.menteSupabase) return Promise.resolve(window.menteSupabase);
    return new Promise((resolve)=>{
      let done=false;
      const finish=()=>{if(done)return;done=true;resolve(window.menteSupabase||null)};
      window.addEventListener("mente:supabase-ready",finish,{once:true});
      setTimeout(finish,2200);
    });
  }

  function renderBase(){
    root.innerHTML=`<div class="games-page">
      <section class="games-overview">
        <article class="games-intro"><p class="games-kicker">Aprender jogando</p><h3>Treinos curtos, pontos com limite e revisão de verdade</h3><p>Os jogos reforçam cálculo mental e interpretação sem substituir as questões do ENEM. As recompensas são limitadas para o ranking continuar justo.</p><div class="games-rules"><span class="games-rule">90 s no Dominó</span><span class="games-rule">60 s no Sprint</span><span class="games-rule">máx. +10 pts por partida</span><span class="games-rule">3 partidas com recompensa por dia</span><span class="games-rule">máx. +30 pts/dia</span></div></article>
        <aside class="games-limit-card"><small>Recompensa de hoje</small><strong id="games-daily-title">Carregando...</strong><p id="games-daily-copy">Consultando seu progresso.</p><div class="games-limit-track"><span id="games-daily-track" style="width:0%"></span></div><div class="games-limit-meta"><span id="games-daily-points">0/30 pts</span><span id="games-daily-rounds">0/3 partidas</span></div></aside>
      </section>

      <section class="game-plus-card" id="game-plus-card"><div class="game-plus-card__head"><div><small>Experiência Plus</small><strong>Modo Foco para estudar do seu jeito</strong><p>No Plus você escolhe o tema e a dificuldade dos jogos e recebe um histórico detalhado. O limite de pontos é o mesmo para todos, então o ranking continua justo.</p></div></div><div class="game-plus-controls"><label>Tema<select id="game-topic"><option value="misto">Misto</option><option value="porcentagem">Porcentagem</option><option value="equacoes">Equações</option><option value="geometria">Geometria</option><option value="estatistica">Estatística</option></select></label><label>Dificuldade<select id="game-difficulty"><option value="normal">Normal</option><option value="expert">Expert</option></select></label></div></section>

      <section class="game-picker">
        <article class="game-card"><div class="game-card__icon">÷</div><h3>Dominó Matemático</h3><p>Conecte cada conta ao resultado correto antes do tempo acabar. Um erro tira 3 segundos do relógio.</p><div class="game-card__meta"><span>90 segundos</span><span>6 pares</span><span>até +10 pts</span></div><button class="game-start" type="button" data-start-game="domino">Jogar Dominó</button></article>
        <article class="game-card"><div class="game-card__icon">→</div><h3>Sprint de Cálculo <span class="game-plus-badge">FOCO PLUS</span></h3><p>Resolva uma sequência rápida de desafios. No Plus, você escolhe o conteúdo e ativa o nível Expert.</p><div class="game-card__meta"><span>60 segundos</span><span>10 desafios</span><span>até +10 pts</span></div><button class="game-start" type="button" data-start-game="sprint">Começar Sprint</button></article>
      </section>

      <section class="game-arena" id="game-arena" hidden></section>
      <section class="game-history" id="game-history" hidden></section>
      <p class="games-note">Os pontos dos jogos são extras e limitados a 30 por dia. Depois do limite você ainda pode jogar normalmente para treinar, mas sem receber novos pontos ou XP naquela data.</p>
    </div>`;
    bindBase();
    updatePlusUi();
    updateDailyUi();
  }

  function bindBase(){
    document.querySelectorAll("[data-start-game]").forEach((button)=>button.addEventListener("click",()=>startGame(button.dataset.startGame)));
    $("#game-plus-card")?.addEventListener("click",(event)=>{
      if(isPlus()) return;
      if(event.target.closest("select")){ event.preventDefault(); window.MENTE_PLUS?.openUpgrade?.("O Modo Foco dos Jogos Matemáticos"); }
    },true);
  }

  function updatePlusUi(){
    const card=$("#game-plus-card");
    if(!card) return;
    const active=isPlus();
    card.classList.toggle("game-plus-locked",!active);
    card.querySelectorAll("select").forEach((el)=>el.disabled=!active);
    if(active){ loadHistory(); }
    else { const history=$("#game-history"); if(history) history.hidden=true; }
  }

  function updateDailyUi(){
    const s=state.status||{};
    const rounds=Math.min(Number(s.partidas_hoje)||0,Number(s.limite_partidas)||3);
    const points=Math.min(Number(s.pontos_jogos_hoje)||0,Number(s.limite_pontos)||30);
    const roundLimit=Number(s.limite_partidas)||3, pointLimit=Number(s.limite_pontos)||30;
    const pct=Math.min(100,Math.round((points/pointLimit)*100));
    const title=$("#games-daily-title"),copy=$("#games-daily-copy"),track=$("#games-daily-track"),p=$("#games-daily-points"),r=$("#games-daily-rounds");
    if(title) title.textContent=state.user?(rounds>=roundLimit||points>=pointLimit?"Limite de recompensa atingido":`${roundLimit-rounds} partida${roundLimit-rounds===1?"":"s"} valendo pontos`):"Modo prática";
    if(copy) copy.textContent=state.user?"Você pode continuar jogando depois do limite, mas sem pontos extras.":"Entre na sua conta para salvar pontos e XP dos jogos.";
    if(track) track.style.width=`${pct}%`;
    if(p) p.textContent=`${points}/${pointLimit} pts`;
    if(r) r.textContent=`${rounds}/${roundLimit} partidas`;
  }

  function selectedSettings(){
    return { topic:isPlus()?($("#game-topic")?.value||"misto"):"misto", difficulty:isPlus()?($("#game-difficulty")?.value||"normal"):"normal" };
  }

  function mathQuestion(topic="misto",difficulty="normal"){
    const expert=difficulty==="expert";
    const pool=topic==="misto"?["aritmetica","porcentagem","equacoes","geometria","estatistica"]:[topic];
    const kind=pool[rand(0,pool.length-1)];
    if(kind==="porcentagem"){
      const pct=expert?[15,25,35,40,60,75][rand(0,5)]:[10,20,25,50][rand(0,3)];
      const base=expert?rand(4,18)*20:rand(2,10)*20;
      return {topic:"Porcentagem",text:`${pct}% de ${base}`,answer:base*pct/100,explain:`${pct}/100 × ${base} = ${base*pct/100}`};
    }
    if(kind==="equacoes"){
      const x=expert?rand(4,18):rand(2,12),a=expert?rand(3,8):rand(2,5),b=rand(1,12),c=a*x+b;
      return {topic:"Equações",text:`${a}x + ${b} = ${c}`,answer:x,explain:`${a}x = ${c-b}; x = ${x}`};
    }
    if(kind==="geometria"){
      const a=expert?rand(6,18):rand(3,12),b=expert?rand(5,15):rand(2,10);
      return {topic:"Geometria",text:`Área: ${a} × ${b}`,answer:a*b,explain:`A = base × altura = ${a*b}`};
    }
    if(kind==="estatistica"){
      const a=rand(2,12),b=rand(4,16),c=rand(6,20),sum=a+b+c;
      const adjust=sum%3,cc=c-adjust;
      return {topic:"Estatística",text:`Média de ${a}, ${b} e ${cc}`,answer:(a+b+cc)/3,explain:`(${a}+${b}+${cc}) ÷ 3 = ${(a+b+cc)/3}`};
    }
    const op=rand(0,2);
    if(op===0){const a=expert?rand(18,80):rand(4,30),b=expert?rand(12,60):rand(3,20);return{topic:"Cálculo",text:`${a} + ${b}`,answer:a+b,explain:`${a}+${b}=${a+b}`}}
    if(op===1){const a=expert?rand(30,95):rand(10,45),b=rand(3,Math.min(25,a-1));return{topic:"Cálculo",text:`${a} − ${b}`,answer:a-b,explain:`${a}-${b}=${a-b}`}}
    const a=expert?rand(6,14):rand(2,9),b=expert?rand(5,12):rand(2,9);return{topic:"Cálculo",text:`${a} × ${b}`,answer:a*b,explain:`${a}×${b}=${a*b}`};
  }

  function uniqueQuestions(count,settings){
    const out=[],answers=new Set(),texts=new Set();let guard=0;
    while(out.length<count&&guard<200){guard++;const q=mathQuestion(settings.topic,settings.difficulty);if(answers.has(q.answer)||texts.has(q.text))continue;answers.add(q.answer);texts.add(q.text);out.push(q)}
    return out;
  }

  function startTimer(seconds,onEnd){
    clearInterval(state.timer);state.seconds=seconds;state.startedAt=Date.now();
    const tick=()=>{const el=$("#game-timer");if(el){el.textContent=`${state.seconds}s`;el.classList.toggle("is-low",state.seconds<=10)}if(state.seconds<=0){clearInterval(state.timer);state.timer=null;onEnd();return}state.seconds--};
    tick();state.timer=setInterval(tick,1000);
  }

  function stopTimer(){clearInterval(state.timer);state.timer=null;}
  function elapsed(){return Math.max(5,Math.min(900,Math.round((Date.now()-state.startedAt)/1000)))}

  function arenaFrame(title,subtitle,seconds,inner){
    const arena=$("#game-arena");arena.hidden=false;arena.innerHTML=`<div class="game-arena__top"><div><h3>${title}</h3><p>${subtitle}</p></div><div class="game-timer" id="game-timer">${seconds}s</div></div><div id="game-live">${inner}</div>`;arena.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function startGame(kind){
    stopTimer();state.game=kind;
    if(kind==="domino") startDomino(); else startSprint();
  }

  function startDomino(){
    const settings=selectedSettings();const questions=uniqueQuestions(6,settings);
    state.domino={questions,matched:new Set(),selected:null,wrong:0};
    const tiles=shuffle(questions.flatMap((q,index)=>[
      {key:`q-${index}`,pair:index,kind:"q",top:"CONTA",value:q.text},
      {key:`a-${index}`,pair:index,kind:"a",top:"RESULTADO",value:String(q.answer)}
    ]));
    state.domino.tiles=tiles;
    arenaFrame("Dominó Matemático","Selecione uma conta e depois o resultado correspondente. Erros custam 3 segundos.",90,`<div class="game-progress"><span id="game-progress-text">0/6 pares</span><div class="game-progress__track"><span id="game-progress-bar" style="width:0%"></span></div></div><div class="domino-board" id="domino-board"></div>`);
    renderDomino();startTimer(90,()=>finishDomino("tempo"));
  }

  function renderDomino(){
    const board=$("#domino-board");if(!board)return;
    const d=state.domino;
    board.innerHTML=d.tiles.map((tile)=>`<button type="button" class="domino-tile ${d.matched.has(tile.pair)?"is-matched":""} ${d.selected===tile.key?"is-selected":""}" data-domino-key="${tile.key}" ${d.matched.has(tile.pair)?"disabled":""}><b>${tile.top}</b><span>${esc(tile.value)}</span></button>`).join("");
    board.querySelectorAll("[data-domino-key]").forEach((btn)=>btn.addEventListener("click",()=>chooseDomino(btn.dataset.dominoKey)));
    const count=d.matched.size,pct=Math.round(count/6*100);if($("#game-progress-text"))$("#game-progress-text").textContent=`${count}/6 pares`;if($("#game-progress-bar"))$("#game-progress-bar").style.width=`${pct}%`;
  }

  function chooseDomino(key){
    const d=state.domino;if(!d)return;const tile=d.tiles.find((t)=>t.key===key);if(!tile||d.matched.has(tile.pair))return;
    if(!d.selected){d.selected=key;renderDomino();return}
    if(d.selected===key){d.selected=null;renderDomino();return}
    const first=d.tiles.find((t)=>t.key===d.selected);const correct=first&&first.kind!==tile.kind&&first.pair===tile.pair;
    if(correct){d.matched.add(tile.pair);d.selected=null;renderDomino();if(d.matched.size===6)finishDomino("completo");return}
    d.wrong++;state.seconds=Math.max(0,state.seconds-3);const wrongButton=document.querySelector(`[data-domino-key="${CSS.escape(key)}"]`);wrongButton?.classList.add("is-wrong");setTimeout(()=>{d.selected=null;renderDomino()},260);
  }

  async function finishDomino(reason){
    if(!state.domino)return;stopTimer();const d=state.domino;const hits=d.matched.size;const duration=elapsed();const score=hits*100+state.seconds*2;
    state.domino=null;await showResult("domino",hits,duration,score,reason==="completo"?"Dominó concluído!":"Tempo encerrado!",`${hits} de 6 pares corretos${d.wrong?` · ${d.wrong} tentativa${d.wrong===1?"":"s"} incorreta${d.wrong===1?"":"s"}`:""}.`);
  }

  function answerChoices(answer){
    const set=new Set([answer]);let guard=0;
    while(set.size<4&&guard<50){guard++;let delta=rand(1,Math.max(3,Math.round(Math.abs(answer)*.3)||3));if(Math.random()<.5)delta*=-1;const value=answer+delta;if(value>=0)set.add(value)}
    return shuffle([...set]).slice(0,4);
  }

  function startSprint(){
    const settings=selectedSettings();const questions=uniqueQuestions(10,settings).map(q=>({...q,choices:answerChoices(q.answer)}));
    state.sprint={questions,index:0,hits:0,locked:false};
    arenaFrame("Sprint de Cálculo",isPlus()?`Modo ${settings.topic==="misto"?"Misto":settings.topic} · ${settings.difficulty==="expert"?"Expert":"Normal"}`:"Modo misto · responda o máximo que conseguir.",60,`<div class="game-progress"><span id="game-progress-text">Questão 1/10</span><div class="game-progress__track"><span id="game-progress-bar" style="width:10%"></span></div></div><div id="sprint-stage"></div>`);
    renderSprint();startTimer(60,()=>finishSprint("tempo"));
  }

  function renderSprint(){
    const s=state.sprint,stage=$("#sprint-stage");if(!s||!stage)return;if(s.index>=s.questions.length){finishSprint("completo");return}
    const q=s.questions[s.index];stage.innerHTML=`<div class="sprint-question"><span class="sprint-topic">${esc(q.topic)}</span><h4>${esc(q.text)} = ?</h4><div class="sprint-choices">${q.choices.map((choice)=>`<button type="button" class="game-choice" data-sprint-choice="${choice}">${choice}</button>`).join("")}</div><div class="game-feedback" id="game-feedback">Escolha uma alternativa.</div></div>`;
    stage.querySelectorAll("[data-sprint-choice]").forEach((btn)=>btn.addEventListener("click",()=>chooseSprint(Number(btn.dataset.sprintChoice),btn)));
    if($("#game-progress-text"))$("#game-progress-text").textContent=`Questão ${s.index+1}/10 · ${s.hits} acertos`;if($("#game-progress-bar"))$("#game-progress-bar").style.width=`${Math.round((s.index+1)/10*100)}%`;
  }

  function chooseSprint(value,button){
    const s=state.sprint;if(!s||s.locked)return;s.locked=true;const q=s.questions[s.index],correct=value===q.answer;
    if(correct){s.hits++;button.classList.add("is-correct")}else{button.classList.add("is-wrong");document.querySelectorAll("[data-sprint-choice]").forEach((b)=>{if(Number(b.dataset.sprintChoice)===q.answer)b.classList.add("is-correct")})}
    const fb=$("#game-feedback");if(fb)fb.textContent=correct?`Certo. ${q.explain}`:`Resposta correta: ${q.answer}. ${q.explain}`;
    setTimeout(()=>{if(!state.sprint)return;s.index++;s.locked=false;renderSprint()},650);
  }

  async function finishSprint(reason){
    if(!state.sprint)return;stopTimer();const s=state.sprint;const hits=s.hits,duration=elapsed();const score=hits*100+state.seconds*2;state.sprint=null;
    await showResult("sprint",hits,duration,score,reason==="completo"?"Sprint concluído!":"Tempo encerrado!",`${hits} de 10 desafios corretos.`);
  }

  async function submitResult(game,hits,duration,score){
    if(!state.client||!state.user)return {status:"pratica",pontos_recebidos:0,xp_recebido:0};
    const {data,error}=await state.client.rpc("registrar_resultado_jogo",{p_jogo:game,p_acertos:hits,p_duracao_seg:duration,p_pontuacao:score});
    if(error)throw error;const row=Array.isArray(data)?data[0]:data;
    if(row){state.status={...state.status,...row};localStorage.setItem("mente-points",String(Number(row.pontos_totais)||0));document.querySelectorAll(".score strong,#global-points,#points").forEach(el=>el.textContent=String(Number(row.pontos_totais)||0));try{window.dispatchEvent(new CustomEvent("mente:points-updated",{detail:row}))}catch{}window.MENTE_PLUS?.refresh?.();}
    return row||{status:"erro",pontos_recebidos:0,xp_recebido:0};
  }

  async function showResult(game,hits,duration,score,title,copy){
    const live=$("#game-live");if(!live)return;live.innerHTML=`<div class="game-result"><strong>${esc(title)}</strong><p>${esc(copy)} Salvando resultado...</p></div>`;
    let reward;try{reward=await submitResult(game,hits,duration,score)}catch(error){reward={status:"erro",pontos_recebidos:0,xp_recebido:0,error:error?.message};}
    updateDailyUi();
    const practice=reward.status==="pratica",limited=reward.status==="limite_diario",failed=reward.status==="erro";
    const rewardText=practice?"Modo prática: entre na conta para ganhar pontos.":failed?"O resultado foi concluído, mas não foi possível sincronizar a recompensa.":limited?"Limite diário atingido: esta partida valeu apenas como treino.":`Você ganhou +${reward.pontos_recebidos} pontos e +${reward.xp_recebido} XP.`;
    live.innerHTML=`<div class="game-result"><strong>${esc(title)}</strong><p>${esc(copy)} ${esc(rewardText)}</p><div class="game-result__reward"><span>${hits} acertos</span><span>${duration}s de partida</span><span>${score} de score</span>${!practice&&!failed?`<span>+${Number(reward.pontos_recebidos)||0} pts</span>`:""}</div><div class="game-result__actions"><button class="game-start" type="button" data-play-again="${game}">Jogar novamente</button><button class="game-secondary" type="button" data-close-arena>Voltar aos jogos</button></div></div>`;
    live.querySelector("[data-play-again]")?.addEventListener("click",()=>startGame(game));live.querySelector("[data-close-arena]")?.addEventListener("click",()=>{$("#game-arena").hidden=true;window.scrollTo({top:0,behavior:"smooth"})});
    if(isPlus())loadHistory();
  }

  async function loadHistory(){
    const box=$("#game-history");if(!box||!isPlus()||!state.client||!state.user){if(box)box.hidden=true;return}
    const {data,error}=await state.client.from("jogos_resultados").select("jogo,acertos,pontuacao,pontos_ganhos,duracao_seg,criado_em").eq("user_id",state.user.id).order("criado_em",{ascending:false}).limit(8);
    if(error){box.hidden=true;return}state.history=data||[];box.hidden=false;box.innerHTML=`<h3>Histórico detalhado <span class="game-plus-badge">PLUS</span></h3><p>Suas últimas partidas para acompanhar constância, precisão e ritmo.</p>${state.history.length?`<div class="game-history-list">${state.history.map((row)=>`<div class="game-history-row"><strong>${row.jogo==="domino"?"Dominó Matemático":"Sprint de Cálculo"}</strong><span>${Number(row.acertos)||0} acertos</span><span>+${Number(row.pontos_ganhos)||0} pts</span><span>${new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(row.criado_em))}</span></div>`).join("")}</div>`:'<div class="game-empty">Seu histórico aparece aqui depois da primeira partida.</div>'}`;
  }

  async function loadAccount(){
    state.client=await waitForClient();if(!state.client){updateDailyUi();return}
    try{const {data}=await state.client.auth.getSession();state.user=data?.session?.user||null;if(!state.user){updateDailyUi();return}const {data:status,error}=await state.client.rpc("mente_jogos_status");if(!error){const row=Array.isArray(status)?status[0]:status;if(row)state.status={...state.status,...row}}updateDailyUi();if(isPlus())loadHistory()}catch{updateDailyUi()}
  }

  renderBase();loadAccount();
  window.addEventListener("mente:plan-updated",()=>{updatePlusUi()});
  window.addEventListener("mente:supabase-ready",()=>{if(!state.client)loadAccount()});
})();
