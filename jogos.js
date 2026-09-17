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
    memory: null,
    truefalse: null,
    sequence: null,
    history: []
  };

  const $ = (selector) => document.querySelector(selector);
  const isPlus = () => Boolean(window.MENTE_PLUS?.isActive?.());
  const shuffle = (items) => [...items].sort(() => Math.random() - .5);
  const rand = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
  const pick = (items) => items[rand(0,items.length-1)];
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmt = (value) => Number.isInteger(Number(value)) ? String(Number(value)) : String(Math.round(Number(value)*100)/100).replace(".",",");
  const difficultyLabel = (value) => ({facil:"Fácil",normal:"Normal",dificil:"Difícil",expert:"Expert"})[value] || "Normal";
  const topicLabel = (value) => ({misto:"Misto",aritmetica:"Cálculo",porcentagem:"Porcentagem",equacoes:"Equações",geometria:"Geometria",estatistica:"Estatística"})[value] || "Misto";
  const GAME_NAMES = {domino:"Dominó Matemático",sprint:"Sprint de Cálculo",memoria:"Memória Matemática",verdadeiro_falso:"Verdadeiro ou Falso",sequencia:"Sequência Lógica"};

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
        <article class="games-intro"><p class="games-kicker">Aprender jogando</p><h3>Treinos rápidos para revisar Matemática sem cair na mesmice</h3><p>Agora você pode alternar entre cinco jogos e três níveis livres. O nível Expert e o foco por conteúdo fazem parte do M.E.N.T.E Plus.</p><div class="games-rules"><span class="games-rule">5 jogos diferentes</span><span class="games-rule">Fácil · Normal · Difícil</span><span class="games-rule">Expert no Plus</span><span class="games-rule">máx. +10 pts por partida</span><span class="games-rule">3 partidas com recompensa/dia</span></div></article>
        <aside class="games-limit-card"><small>Recompensa de hoje</small><strong id="games-daily-title">Carregando...</strong><p id="games-daily-copy">Consultando seu progresso.</p><div class="games-limit-track"><span id="games-daily-track" style="width:0%"></span></div><div class="games-limit-meta"><span id="games-daily-points">0/30 pts</span><span id="games-daily-rounds">0/3 partidas</span></div></aside>
      </section>

      <section class="game-settings-card" id="game-settings-card">
        <div class="game-settings-card__copy"><small>Configuração do treino</small><strong>Escolha o ritmo antes de jogar</strong><p>Fácil, Normal e Difícil ficam disponíveis para todos. O Plus libera o nível Expert e permite focar em um conteúdo específico.</p></div>
        <div class="game-plus-controls">
          <label>Dificuldade<select id="game-difficulty"><option value="facil">Fácil</option><option value="normal" selected>Normal</option><option value="dificil">Difícil</option><option value="expert">Expert · PLUS</option></select></label>
          <label class="is-plus-control">Tema <span class="game-plus-badge">PLUS</span><select id="game-topic" data-plus-control><option value="misto">Misto</option><option value="aritmetica">Cálculo</option><option value="porcentagem">Porcentagem</option><option value="equacoes">Equações</option><option value="geometria">Geometria</option><option value="estatistica">Estatística</option></select></label>
        </div>
      </section>

      <section class="game-picker">
        <article class="game-card"><div class="game-card__icon">÷</div><h3>Dominó Matemático</h3><p>Conecte cada conta ao resultado correto. Uma tentativa errada tira alguns segundos do relógio.</p><div class="game-card__meta"><span>90 segundos</span><span>6 pares</span><span>até +10 pts</span></div><button class="game-start" type="button" data-start-game="domino">Jogar Dominó</button></article>
        <article class="game-card"><div class="game-card__icon">→</div><h3>Sprint de Cálculo</h3><p>Resolva 10 desafios em sequência e tente terminar antes do cronômetro chegar a zero.</p><div class="game-card__meta"><span>60 segundos</span><span>10 desafios</span><span>até +10 pts</span></div><button class="game-start" type="button" data-start-game="sprint">Começar Sprint</button></article>
        <article class="game-card"><div class="game-card__icon">▦</div><h3>Memória Matemática <span class="game-new-badge">NOVO</span></h3><p>Vire duas cartas por vez e encontre o par formado pela conta e pelo resultado correto.</p><div class="game-card__meta"><span>90 segundos</span><span>6 pares</span><span>memória + cálculo</span></div><button class="game-start" type="button" data-start-game="memoria">Jogar Memória</button></article>
        <article class="game-card"><div class="game-card__icon">V/F</div><h3>Verdadeiro ou Falso <span class="game-new-badge">NOVO</span></h3><p>Decida rápido se cada afirmação matemática está certa ou errada e mantenha a sequência.</p><div class="game-card__meta"><span>60 segundos</span><span>10 afirmações</span><span>resposta rápida</span></div><button class="game-start" type="button" data-start-game="verdadeiro_falso">Começar V/F</button></article>
        <article class="game-card"><div class="game-card__icon">1·2·?</div><h3>Sequência Lógica <span class="game-new-badge">NOVO</span></h3><p>Descubra o padrão e escolha qual número completa a sequência. A complexidade cresce com a dificuldade.</p><div class="game-card__meta"><span>75 segundos</span><span>8 sequências</span><span>raciocínio lógico</span></div><button class="game-start" type="button" data-start-game="sequencia">Jogar Sequências</button></article>
      </section>

      <section class="game-arena" id="game-arena" hidden></section>
      <section class="game-history" id="game-history" hidden></section>
      <p class="games-note">Os jogos continuam limitados a 30 pontos e XP por dia. Depois do limite, todos permanecem disponíveis em modo treino, sem recompensa extra. Assim dá para revisar bastante sem transformar o ranking em disputa de repetição.</p>
    </div>`;
    bindBase();
    updatePlusUi();
    updateDailyUi();
  }

  function bindBase(){
    document.querySelectorAll("[data-start-game]").forEach((button)=>button.addEventListener("click",()=>startGame(button.dataset.startGame)));
    $("#game-topic")?.addEventListener("mousedown",(event)=>{
      if(isPlus())return;
      event.preventDefault();
      window.MENTE_PLUS?.openUpgrade?.("O foco por conteúdo nos Jogos Matemáticos");
    });
    $("#game-difficulty")?.addEventListener("change",(event)=>{
      if(event.target.value==="expert"&&!isPlus()){
        event.target.value="dificil";
        window.MENTE_PLUS?.openUpgrade?.("A dificuldade Expert dos Jogos Matemáticos");
      }
    });
  }

  function updatePlusUi(){
    const active=isPlus();
    const topic=$("#game-topic"),difficulty=$("#game-difficulty");
    if(topic)topic.disabled=!active;
    if(difficulty){
      const expert=[...difficulty.options].find(option=>option.value==="expert");
      if(expert)expert.disabled=!active;
      if(!active&&difficulty.value==="expert")difficulty.value="dificil";
    }
    $("#game-settings-card")?.classList.toggle("has-plus",active);
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
    let difficulty=$("#game-difficulty")?.value||"normal";
    if(difficulty==="expert"&&!isPlus())difficulty="dificil";
    return {topic:isPlus()?($("#game-topic")?.value||"misto"):"misto",difficulty};
  }

  function difficultyRank(value){return ({facil:0,normal:1,dificil:2,expert:3})[value]??1}

  function mathQuestion(topic="misto",difficulty="normal"){
    const level=difficultyRank(difficulty);
    const pool=topic==="misto"?["aritmetica","porcentagem","equacoes","geometria","estatistica"]:[topic];
    const kind=pick(pool);

    if(kind==="porcentagem"){
      if(level===0){const pct=pick([10,20,25,50]);const base=rand(2,10)*20;return{topic:"Porcentagem",text:`${pct}% de ${base}`,answer:base*pct/100,explain:`${pct}/100 × ${base} = ${fmt(base*pct/100)}`}}
      if(level===1){const pct=pick([15,20,25,30,40,50]);const base=rand(4,16)*20;return{topic:"Porcentagem",text:`${pct}% de ${base}`,answer:base*pct/100,explain:`${pct}/100 × ${base} = ${fmt(base*pct/100)}`}}
      if(level===2){const pct=pick([12.5,25,35,45,60,75]);const base=rand(4,20)*40;return{topic:"Porcentagem",text:`${fmt(pct)}% de ${base}`,answer:base*pct/100,explain:`${fmt(pct)}/100 × ${base} = ${fmt(base*pct/100)}`}}
      const pct=pick([15,25,30,35,40]);const base=rand(5,25)*40;const answer=base-(base*pct/100);return{topic:"Porcentagem",text:`${base} com ${pct}% de desconto`,answer,explain:`${base} − ${fmt(base*pct/100)} = ${fmt(answer)}`};
    }

    if(kind==="equacoes"){
      if(level===0){const x=rand(2,18),b=rand(2,12),c=x+b;return{topic:"Equações",text:`x + ${b} = ${c}`,answer:x,explain:`x = ${c} − ${b} = ${x}`}}
      if(level===1){const x=rand(2,15),a=rand(2,5),b=rand(1,12),c=a*x+b;return{topic:"Equações",text:`${a}x + ${b} = ${c}`,answer:x,explain:`${a}x = ${c-b}; x = ${x}`}}
      if(level===2){const x=rand(3,18),a=rand(3,9),b=rand(2,16),c=a*x-b;return{topic:"Equações",text:`${a}x − ${b} = ${c}`,answer:x,explain:`${a}x = ${c+b}; x = ${x}`}}
      const x=rand(3,15),inside=rand(1,8),a=rand(2,6),c=a*(x+inside);return{topic:"Equações",text:`${a}(x + ${inside}) = ${c}`,answer:x,explain:`x + ${inside} = ${c/a}; x = ${x}`};
    }

    if(kind==="geometria"){
      if(level===0){const a=rand(3,12),b=rand(2,10);return{topic:"Geometria",text:`Área do retângulo ${a} × ${b}`,answer:a*b,explain:`A = base × altura = ${a*b}`}}
      if(level===1){const a=rand(4,16),b=rand(3,13);return{topic:"Geometria",text:`Perímetro do retângulo ${a} × ${b}`,answer:2*(a+b),explain:`P = 2(${a}+${b}) = ${2*(a+b)}`}}
      if(level===2){const b=rand(6,18)*2,h=rand(4,16);return{topic:"Geometria",text:`Área do triângulo: base ${b}, altura ${h}`,answer:b*h/2,explain:`A = (${b}×${h})/2 = ${b*h/2}`}}
      const r=rand(2,9);return{topic:"Geometria",text:`Área do círculo de raio ${r} (use π=3)`,answer:3*r*r,explain:`A = 3×${r}² = ${3*r*r}`};
    }

    if(kind==="estatistica"){
      if(level<=1){const a=rand(2,12),b=rand(4,16),c=rand(6,20),sum=a+b+c,cc=c-(sum%3);return{topic:"Estatística",text:`Média de ${a}, ${b} e ${cc}`,answer:(a+b+cc)/3,explain:`(${a}+${b}+${cc}) ÷ 3 = ${fmt((a+b+cc)/3)}`}}
      if(level===2){const values=shuffle([rand(2,8),rand(9,15),rand(16,25),rand(26,35),rand(36,48)]);const sorted=[...values].sort((a,b)=>a-b);return{topic:"Estatística",text:`Mediana de ${values.join(", ")}`,answer:sorted[2],explain:`Ordenando os valores, o termo central é ${sorted[2]}`}}
      const total=pick([20,25,40,50]),good=pick([5,10,15,20]);const adjusted=Math.min(good,total);return{topic:"Estatística",text:`Em ${total} casos, ${adjusted} são favoráveis. Probabilidade (%)`,answer:adjusted/total*100,explain:`${adjusted}/${total} × 100 = ${fmt(adjusted/total*100)}%`};
    }

    if(level===0){const op=rand(0,1);if(op===0){const a=rand(3,25),b=rand(2,20);return{topic:"Cálculo",text:`${a} + ${b}`,answer:a+b,explain:`${a}+${b}=${a+b}`}}const a=rand(10,40),b=rand(2,a-1);return{topic:"Cálculo",text:`${a} − ${b}`,answer:a-b,explain:`${a}−${b}=${a-b}`}}
    if(level===1){const op=rand(0,2);if(op===0){const a=rand(10,50),b=rand(5,35);return{topic:"Cálculo",text:`${a} + ${b}`,answer:a+b,explain:`${a}+${b}=${a+b}`}}if(op===1){const a=rand(20,70),b=rand(5,a-1);return{topic:"Cálculo",text:`${a} − ${b}`,answer:a-b,explain:`${a}−${b}=${a-b}`}}const a=rand(2,10),b=rand(2,10);return{topic:"Cálculo",text:`${a} × ${b}`,answer:a*b,explain:`${a}×${b}=${a*b}`}}
    if(level===2){if(Math.random()<.5){const b=rand(3,12),answer=rand(3,15),a=b*answer;return{topic:"Cálculo",text:`${a} ÷ ${b}`,answer,explain:`${a}÷${b}=${answer}`}}const a=rand(6,18),b=rand(4,14),c=rand(2,20);return{topic:"Cálculo",text:`${a} × ${b} + ${c}`,answer:a*b+c,explain:`${a}×${b}+${c}=${a*b+c}`}}
    const a=rand(8,20),b=rand(4,15),c=rand(2,10),d=rand(2,8);return{topic:"Cálculo",text:`(${a} + ${b}) × ${c} − ${d}`,answer:(a+b)*c-d,explain:`(${a}+${b})×${c}−${d}=${(a+b)*c-d}`};
  }

  function uniqueQuestions(count,settings){
    const out=[],texts=new Set();let guard=0;
    while(out.length<count&&guard<300){guard++;const q=mathQuestion(settings.topic,settings.difficulty);if(texts.has(q.text))continue;texts.add(q.text);out.push(q)}
    return out;
  }

  function answerChoices(answer){
    const target=Number(answer);const set=new Set([target]);let guard=0;
    while(set.size<4&&guard<80){guard++;let delta=rand(1,Math.max(3,Math.round(Math.abs(target)*.25)||3));if(Math.random()<.5)delta*=-1;let value=Math.round((target+delta)*100)/100;if(value>=0)set.add(value)}
    return shuffle([...set]).slice(0,4);
  }

  function settingsText(settings){return `Dificuldade ${difficultyLabel(settings.difficulty)} · ${topicLabel(settings.topic)}`}

  function startTimer(seconds,onEnd){
    clearInterval(state.timer);state.seconds=seconds;state.startedAt=Date.now();
    const tick=()=>{const el=$("#game-timer");if(el){el.textContent=`${state.seconds}s`;el.classList.toggle("is-low",state.seconds<=10)}if(state.seconds<=0){clearInterval(state.timer);state.timer=null;onEnd();return}state.seconds--};
    tick();state.timer=setInterval(tick,1000);
  }

  function stopTimer(){clearInterval(state.timer);state.timer=null;}
  function elapsed(){return Math.max(5,Math.min(900,Math.round((Date.now()-state.startedAt)/1000)))}

  function arenaFrame(title,subtitle,seconds,inner){
    const arena=$("#game-arena");arena.hidden=false;arena.innerHTML=`<div class="game-arena__top"><div><h3>${esc(title)}</h3><p>${esc(subtitle)}</p></div><div class="game-timer" id="game-timer">${seconds}s</div></div><div id="game-live">${inner}</div>`;arena.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function startGame(kind){
    stopTimer();state.game=kind;
    if(kind==="domino")startDomino();
    else if(kind==="sprint")startSprint();
    else if(kind==="memoria")startMemory();
    else if(kind==="verdadeiro_falso")startTrueFalse();
    else if(kind==="sequencia")startSequence();
  }

  function startDomino(){
    const settings=selectedSettings(),questions=uniqueQuestions(6,settings);
    state.domino={settings,questions,matched:new Set(),selected:null,wrong:0};
    state.domino.tiles=shuffle(questions.flatMap((q,index)=>[
      {key:`q-${index}`,pair:index,kind:"q",top:"CONTA",value:q.text},
      {key:`a-${index}`,pair:index,kind:"a",top:"RESULTADO",value:fmt(q.answer)}
    ]));
    arenaFrame("Dominó Matemático",`${settingsText(settings)} · erros tiram 3 segundos.`,90,`<div class="game-progress"><span id="game-progress-text">0/6 pares</span><div class="game-progress__track"><span id="game-progress-bar" style="width:0%"></span></div></div><div class="domino-board" id="domino-board"></div>`);
    renderDomino();startTimer(90,()=>finishDomino("tempo"));
  }

  function renderDomino(){
    const board=$("#domino-board"),d=state.domino;if(!board||!d)return;
    board.innerHTML=d.tiles.map((tile)=>`<button type="button" class="domino-tile ${d.matched.has(tile.pair)?"is-matched":""} ${d.selected===tile.key?"is-selected":""}" data-domino-key="${tile.key}" ${d.matched.has(tile.pair)?"disabled":""}><b>${tile.top}</b><span>${esc(tile.value)}</span></button>`).join("");
    board.querySelectorAll("[data-domino-key]").forEach((btn)=>btn.addEventListener("click",()=>chooseDomino(btn.dataset.dominoKey)));
    const count=d.matched.size,pct=Math.round(count/6*100);if($("#game-progress-text"))$("#game-progress-text").textContent=`${count}/6 pares`;if($("#game-progress-bar"))$("#game-progress-bar").style.width=`${pct}%`;
  }

  function chooseDomino(key){
    const d=state.domino;if(!d)return;const tile=d.tiles.find((t)=>t.key===key);if(!tile||d.matched.has(tile.pair))return;
    if(!d.selected){d.selected=key;renderDomino();return}
    if(d.selected===key){d.selected=null;renderDomino();return}
    const first=d.tiles.find((t)=>t.key===d.selected),correct=first&&first.kind!==tile.kind&&first.pair===tile.pair;
    if(correct){d.matched.add(tile.pair);d.selected=null;renderDomino();if(d.matched.size===6)finishDomino("completo");return}
    d.wrong++;state.seconds=Math.max(0,state.seconds-3);const wrongButton=document.querySelector(`[data-domino-key="${CSS.escape(key)}"]`);wrongButton?.classList.add("is-wrong");setTimeout(()=>{if(!state.domino)return;d.selected=null;renderDomino()},260);
  }

  async function finishDomino(reason){
    if(!state.domino)return;stopTimer();const d=state.domino,hits=d.matched.size,duration=elapsed(),score=hits*100+state.seconds*2;state.domino=null;
    await showResult("domino",hits,duration,score,reason==="completo"?"Dominó concluído!":"Tempo encerrado!",`${hits} de 6 pares corretos${d.wrong?` · ${d.wrong} tentativa${d.wrong===1?"":"s"} incorreta${d.wrong===1?"":"s"}`:""}.`);
  }

  function startSprint(){
    const settings=selectedSettings(),questions=uniqueQuestions(10,settings).map(q=>({...q,choices:answerChoices(q.answer)}));
    state.sprint={settings,questions,index:0,hits:0,locked:false};
    arenaFrame("Sprint de Cálculo",settingsText(settings),60,`<div class="game-progress"><span id="game-progress-text">Questão 1/10</span><div class="game-progress__track"><span id="game-progress-bar" style="width:10%"></span></div></div><div id="sprint-stage"></div>`);
    renderSprint();startTimer(60,()=>finishSprint("tempo"));
  }

  function renderSprint(){
    const s=state.sprint,stage=$("#sprint-stage");if(!s||!stage)return;if(s.index>=s.questions.length){finishSprint("completo");return}
    const q=s.questions[s.index];stage.innerHTML=`<div class="sprint-question"><span class="sprint-topic">${esc(q.topic)}</span><h4>${esc(q.text)} = ?</h4><div class="sprint-choices">${q.choices.map((choice)=>`<button type="button" class="game-choice" data-sprint-choice="${choice}">${esc(fmt(choice))}</button>`).join("")}</div><div class="game-feedback" id="game-feedback">Escolha uma alternativa.</div></div>`;
    stage.querySelectorAll("[data-sprint-choice]").forEach((btn)=>btn.addEventListener("click",()=>chooseSprint(Number(btn.dataset.sprintChoice),btn)));
    if($("#game-progress-text"))$("#game-progress-text").textContent=`Questão ${s.index+1}/10 · ${s.hits} acertos`;if($("#game-progress-bar"))$("#game-progress-bar").style.width=`${Math.round((s.index+1)/10*100)}%`;
  }

  function chooseSprint(value,button){
    const s=state.sprint;if(!s||s.locked)return;s.locked=true;const q=s.questions[s.index],correct=Math.abs(value-q.answer)<.001;
    if(correct){s.hits++;button.classList.add("is-correct")}else{button.classList.add("is-wrong");document.querySelectorAll("[data-sprint-choice]").forEach((b)=>{if(Math.abs(Number(b.dataset.sprintChoice)-q.answer)<.001)b.classList.add("is-correct")})}
    const fb=$("#game-feedback");if(fb)fb.textContent=correct?`Certo. ${q.explain}`:`Resposta correta: ${fmt(q.answer)}. ${q.explain}`;
    setTimeout(()=>{if(!state.sprint)return;s.index++;s.locked=false;renderSprint()},650);
  }

  async function finishSprint(reason){
    if(!state.sprint)return;stopTimer();const s=state.sprint,hits=s.hits,duration=elapsed(),score=hits*100+state.seconds*2;state.sprint=null;
    await showResult("sprint",hits,duration,score,reason==="completo"?"Sprint concluído!":"Tempo encerrado!",`${hits} de 10 desafios corretos.`);
  }

  function startMemory(){
    const settings=selectedSettings(),questions=uniqueQuestions(6,settings);
    const cards=shuffle(questions.flatMap((q,index)=>[
      {key:`mq-${index}`,pair:index,kind:"q",value:q.text},
      {key:`ma-${index}`,pair:index,kind:"a",value:fmt(q.answer)}
    ]));
    state.memory={settings,cards,open:[],matched:new Set(),wrong:0,locked:false};
    arenaFrame("Memória Matemática",`${settingsText(settings)} · encontre os 6 pares.`,90,`<div class="game-progress"><span id="game-progress-text">0/6 pares</span><div class="game-progress__track"><span id="game-progress-bar" style="width:0%"></span></div></div><div class="memory-board" id="memory-board"></div>`);
    renderMemory();startTimer(90,()=>finishMemory("tempo"));
  }

  function renderMemory(){
    const m=state.memory,board=$("#memory-board");if(!m||!board)return;
    board.innerHTML=m.cards.map(card=>{const revealed=m.open.includes(card.key)||m.matched.has(card.pair);return`<button type="button" class="memory-card ${revealed?"is-revealed":""} ${m.matched.has(card.pair)?"is-matched":""}" data-memory-key="${card.key}" ${m.matched.has(card.pair)?"disabled":""}><span class="memory-card__back">?</span><span class="memory-card__front"><small>${card.kind==="q"?"CONTA":"RESULTADO"}</small><b>${esc(card.value)}</b></span></button>`}).join("");
    board.querySelectorAll("[data-memory-key]").forEach(btn=>btn.addEventListener("click",()=>chooseMemory(btn.dataset.memoryKey)));
    const count=m.matched.size;if($("#game-progress-text"))$("#game-progress-text").textContent=`${count}/6 pares`;if($("#game-progress-bar"))$("#game-progress-bar").style.width=`${Math.round(count/6*100)}%`;
  }

  function chooseMemory(key){
    const m=state.memory;if(!m||m.locked||m.open.includes(key))return;const card=m.cards.find(item=>item.key===key);if(!card||m.matched.has(card.pair))return;
    m.open.push(key);renderMemory();if(m.open.length<2)return;
    m.locked=true;const [aKey,bKey]=m.open,a=m.cards.find(item=>item.key===aKey),b=m.cards.find(item=>item.key===bKey);const correct=a&&b&&a.pair===b.pair&&a.kind!==b.kind;
    setTimeout(()=>{if(!state.memory)return;if(correct)m.matched.add(a.pair);else{m.wrong++;state.seconds=Math.max(0,state.seconds-2)}m.open=[];m.locked=false;renderMemory();if(m.matched.size===6)finishMemory("completo")},correct?350:700);
  }

  async function finishMemory(reason){
    if(!state.memory)return;stopTimer();const m=state.memory,hits=m.matched.size,duration=elapsed(),score=hits*100+state.seconds*2;state.memory=null;
    await showResult("memoria",hits,duration,score,reason==="completo"?"Memória concluída!":"Tempo encerrado!",`${hits} de 6 pares encontrados${m.wrong?` · ${m.wrong} tentativa${m.wrong===1?"":"s"} incorreta${m.wrong===1?"":"s"}`:""}.`);
  }

  function startTrueFalse(){
    const settings=selectedSettings(),questions=uniqueQuestions(10,settings).map(q=>{
      const trueStatement=Math.random()<.5,wrong=answerChoices(q.answer).find(v=>Math.abs(v-q.answer)>.001)??q.answer+1;
      return {...q,shown:trueStatement?q.answer:wrong,correct:trueStatement};
    });
    state.truefalse={settings,questions,index:0,hits:0,streak:0,bestStreak:0,locked:false};
    arenaFrame("Verdadeiro ou Falso",`${settingsText(settings)} · responda 10 afirmações.`,60,`<div class="game-progress"><span id="game-progress-text">Afirmação 1/10</span><div class="game-progress__track"><span id="game-progress-bar" style="width:10%"></span></div></div><div id="truefalse-stage"></div>`);
    renderTrueFalse();startTimer(60,()=>finishTrueFalse("tempo"));
  }

  function renderTrueFalse(){
    const t=state.truefalse,stage=$("#truefalse-stage");if(!t||!stage)return;if(t.index>=t.questions.length){finishTrueFalse("completo");return}
    const q=t.questions[t.index];stage.innerHTML=`<div class="truefalse-question"><span class="sprint-topic">${esc(q.topic)}</span><h4>${esc(q.text)} = ${esc(fmt(q.shown))}</h4><p>Essa afirmação está correta?</p><div class="truefalse-actions"><button class="tf-button is-true" type="button" data-tf="true">Verdadeiro</button><button class="tf-button is-false" type="button" data-tf="false">Falso</button></div><div class="game-feedback" id="game-feedback">Sequência atual: ${t.streak}</div></div>`;
    stage.querySelectorAll("[data-tf]").forEach(btn=>btn.addEventListener("click",()=>chooseTrueFalse(btn.dataset.tf==="true",btn)));
    if($("#game-progress-text"))$("#game-progress-text").textContent=`Afirmação ${t.index+1}/10 · ${t.hits} acertos`;if($("#game-progress-bar"))$("#game-progress-bar").style.width=`${Math.round((t.index+1)/10*100)}%`;
  }

  function chooseTrueFalse(value,button){
    const t=state.truefalse;if(!t||t.locked)return;t.locked=true;const q=t.questions[t.index],correct=value===q.correct;
    if(correct){t.hits++;t.streak++;t.bestStreak=Math.max(t.bestStreak,t.streak);button.classList.add("is-correct")}else{t.streak=0;button.classList.add("is-wrong")}
    const fb=$("#game-feedback");if(fb)fb.textContent=correct?`Certo. ${q.explain}`:`Não. O resultado correto é ${fmt(q.answer)}. ${q.explain}`;
    setTimeout(()=>{if(!state.truefalse)return;t.index++;t.locked=false;renderTrueFalse()},700);
  }

  async function finishTrueFalse(reason){
    if(!state.truefalse)return;stopTimer();const t=state.truefalse,hits=t.hits,duration=elapsed(),score=hits*100+t.bestStreak*25+state.seconds*2;state.truefalse=null;
    await showResult("verdadeiro_falso",hits,duration,score,reason==="completo"?"Desafio concluído!":"Tempo encerrado!",`${hits} de 10 afirmações corretas · melhor sequência: ${t.bestStreak}.`);
  }

  function sequenceQuestion(difficulty){
    const level=difficultyRank(difficulty);
    if(level===0){const start=rand(1,15),step=rand(2,8),values=[0,1,2,3].map(i=>start+i*step),answer=start+4*step;return{text:values.join(" · "),answer,explain:`O padrão soma ${step} a cada termo.`}}
    if(level===1&&Math.random()<.5){const start=rand(1,8),mult=pick([2,3]),values=[start,start*mult,start*mult**2,start*mult**3],answer=start*mult**4;return{text:values.join(" · "),answer,explain:`Cada termo é o anterior multiplicado por ${mult}.`}}
    if(level<=1){const start=rand(2,15),step=rand(3,9),values=[0,1,2,3].map(i=>start+i*step),answer=start+4*step;return{text:values.join(" · "),answer,explain:`O padrão soma ${step} a cada termo.`}}
    if(level===2){const start=rand(1,10),d=rand(2,5),values=[start];let current=start,inc=d;for(let i=0;i<3;i++){current+=inc;values.push(current);inc++}const answer=current+inc;return{text:values.join(" · "),answer,explain:`As diferenças crescem de 1 em 1: +${d}, +${d+1}, +${d+2}, +${d+3}.`}}
    if(Math.random()<.5){const a=rand(1,6),b=rand(2,8),values=[a,b];while(values.length<5)values.push(values.at(-1)+values.at(-2));const answer=values.at(-1)+values.at(-2);return{text:values.join(" · "),answer,explain:"Cada termo é a soma dos dois anteriores."}}
    const start=rand(2,8),values=[start];let current=start;for(let i=0;i<4;i++){current=current*2+(i+1);values.push(current)}const answer=current*2+5;return{text:values.join(" · "),answer,explain:"O padrão dobra o termo e soma 1, depois 2, 3, 4 e 5."};
  }

  function startSequence(){
    const settings=selectedSettings(),questions=Array.from({length:8},()=>{const q=sequenceQuestion(settings.difficulty);return{...q,choices:answerChoices(q.answer)}});
    state.sequence={settings,questions,index:0,hits:0,locked:false};
    arenaFrame("Sequência Lógica",`Dificuldade ${difficultyLabel(settings.difficulty)} · encontre o próximo termo.`,75,`<div class="game-progress"><span id="game-progress-text">Sequência 1/8</span><div class="game-progress__track"><span id="game-progress-bar" style="width:12.5%"></span></div></div><div id="sequence-stage"></div>`);
    renderSequence();startTimer(75,()=>finishSequence("tempo"));
  }

  function renderSequence(){
    const s=state.sequence,stage=$("#sequence-stage");if(!s||!stage)return;if(s.index>=s.questions.length){finishSequence("completo");return}
    const q=s.questions[s.index];stage.innerHTML=`<div class="sequence-question"><span class="sprint-topic">Raciocínio lógico</span><h4>${esc(q.text)} · ?</h4><div class="sprint-choices">${q.choices.map(choice=>`<button type="button" class="game-choice" data-sequence-choice="${choice}">${esc(fmt(choice))}</button>`).join("")}</div><div class="game-feedback" id="game-feedback">Qual é o próximo número?</div></div>`;
    stage.querySelectorAll("[data-sequence-choice]").forEach(btn=>btn.addEventListener("click",()=>chooseSequence(Number(btn.dataset.sequenceChoice),btn)));
    if($("#game-progress-text"))$("#game-progress-text").textContent=`Sequência ${s.index+1}/8 · ${s.hits} acertos`;if($("#game-progress-bar"))$("#game-progress-bar").style.width=`${Math.round((s.index+1)/8*100)}%`;
  }

  function chooseSequence(value,button){
    const s=state.sequence;if(!s||s.locked)return;s.locked=true;const q=s.questions[s.index],correct=Math.abs(value-q.answer)<.001;
    if(correct){s.hits++;button.classList.add("is-correct")}else{button.classList.add("is-wrong");document.querySelectorAll("[data-sequence-choice]").forEach(b=>{if(Math.abs(Number(b.dataset.sequenceChoice)-q.answer)<.001)b.classList.add("is-correct")})}
    const fb=$("#game-feedback");if(fb)fb.textContent=correct?`Certo. ${q.explain}`:`Era ${fmt(q.answer)}. ${q.explain}`;
    setTimeout(()=>{if(!state.sequence)return;s.index++;s.locked=false;renderSequence()},750);
  }

  async function finishSequence(reason){
    if(!state.sequence)return;stopTimer();const s=state.sequence,hits=s.hits,duration=elapsed(),score=hits*125+state.seconds*2;state.sequence=null;
    await showResult("sequencia",hits,duration,score,reason==="completo"?"Sequências concluídas!":"Tempo encerrado!",`${hits} de 8 padrões identificados corretamente.`);
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
    const {data,error}=await state.client.from("jogos_resultados").select("jogo,acertos,pontuacao,pontos_ganhos,duracao_seg,criado_em").eq("user_id",state.user.id).order("criado_em",{ascending:false}).limit(10);
    if(error){box.hidden=true;return}state.history=data||[];box.hidden=false;box.innerHTML=`<h3>Histórico detalhado <span class="game-plus-badge">PLUS</span></h3><p>Suas últimas partidas para acompanhar constância, precisão e ritmo.</p>${state.history.length?`<div class="game-history-list">${state.history.map((row)=>`<div class="game-history-row"><strong>${esc(GAME_NAMES[row.jogo]||row.jogo||"Jogo")}</strong><span>${Number(row.acertos)||0} acertos</span><span>+${Number(row.pontos_ganhos)||0} pts</span><span>${new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(row.criado_em))}</span></div>`).join("")}</div>`:'<div class="game-empty">Seu histórico aparece aqui depois da primeira partida.</div>'}`;
  }

  async function loadAccount(){
    state.client=await waitForClient();if(!state.client){updateDailyUi();return}
    try{const {data}=await state.client.auth.getSession();state.user=data?.session?.user||null;if(!state.user){updateDailyUi();return}const {data:status,error}=await state.client.rpc("mente_jogos_status");if(!error){const row=Array.isArray(status)?status[0]:status;if(row)state.status={...state.status,...row}}updateDailyUi();if(isPlus())loadHistory()}catch{updateDailyUi()}
  }

  renderBase();loadAccount();
  window.addEventListener("mente:plan-updated",()=>{updatePlusUi()});
  window.addEventListener("mente:supabase-ready",()=>{if(!state.client)loadAccount()});
})();