"use strict";

(() => {
  if (document.body.dataset.page !== "simulados") return;
  const main = document.querySelector(".portal-main");
  if (!main) return;

  const COLORS = {
    "Geometria":"#FF7A00",
    "Funções":"#9D4EDD",
    "Estatística e Probabilidade":"#16803C",
    "Matemática Financeira":"#D9A400",
    "Grandezas e Medidas":"#D70101",
    "Gráficos e Tabelas":"#FF2E9A"
  };

  const BANK = [
    {id:"sim-g1",category:"Geometria",difficulty:1,topic:"Área e revestimento",statement:"Uma escola vai revestir uma parede retangular de 6 m de comprimento por 2,8 m de altura com placas de 20 cm por 40 cm. Para compensar recortes e perdas, serão compradas 10% de placas a mais que o mínimo necessário. Quantas placas devem ser compradas?",options:["210","220","231","240","252"],correct:2,explanation:"A parede tem 6×2,8=16,8 m². Cada placa tem 0,2×0,4=0,08 m². São 16,8/0,08=210 placas. Com 10% extra: 210×1,10=231."},
    {id:"sim-g2",category:"Geometria",difficulty:2,topic:"Área do círculo",statement:"Uma praça circular de raio 7 m será coberta com grama. Considere π=22/7. Qual é a área que receberá grama?",options:["44 m²","77 m²","98 m²","154 m²","308 m²"],correct:3,explanation:"A=πr²=(22/7)×49=154 m²."},
    {id:"sim-g3",category:"Geometria",difficulty:4,topic:"Volume do cilindro",statement:"Um reservatório cilíndrico possui diâmetro interno de 2 m e altura de 3 m. Por segurança, ele é abastecido apenas até 80% de sua capacidade total. Usando π=3,14, qual volume de água, em litros, ele recebe quando atinge esse limite?",options:["5 024","6 280","7 536","8 792","9 420"],correct:2,explanation:"O raio é 1 m. V=πr²h=3,14×1×3=9,42 m³. 80% disso é 7,536 m³ = 7 536 L."},
    {id:"sim-g4",category:"Geometria",difficulty:5,topic:"Escala de área",statement:"Em uma maquete na escala 1:100, a área de uma placa decorativa mede 24 cm². Mantendo a semelhança, qual é a área correspondente da placa real?",options:["0,24 m²","2,4 m²","12 m²","24 m²","240 m²"],correct:3,explanation:"A escala linear é 100, então a escala de área é 100²=10 000. 24 cm²×10 000=240 000 cm²=24 m²."},

    {id:"sim-f1",category:"Funções",difficulty:2,topic:"Função afim",statement:"Um aplicativo de transporte cobra uma taxa fixa de R$30,00 mais R$0,50 por minuto de uso. Uma pessoa dispõe de no máximo R$75,00. Qual o maior número inteiro de minutos que ela pode utilizar o serviço sem ultrapassar esse valor?",options:["60","75","80","90","105"],correct:3,explanation:"30+0,5x≤75. Logo 0,5x≤45 e x≤90."},
    {id:"sim-f2",category:"Funções",difficulty:3,topic:"Função quadrática",statement:"A receita mensal de uma pequena empresa, em centenas de reais, é modelada por R(x)=-2x²+80x, em que x representa a quantidade de lotes vendidos. Para qual valor de x a receita é máxima?",options:["10","20","30","40","80"],correct:1,explanation:"O máximo ocorre no vértice: x=-b/(2a)=-80/(2×-2)=20."},
    {id:"sim-f3",category:"Funções",difficulty:4,topic:"Função exponencial",statement:"A quantidade de um medicamento no organismo é reduzida à metade a cada 6 horas. Logo após a aplicação havia 160 mg da substância. Desconsiderando novas doses, qual quantidade resta após 18 horas?",options:["10 mg","20 mg","30 mg","40 mg","80 mg"],correct:1,explanation:"Em 18 h passam 3 meias-vidas: 160→80→40→20 mg."},
    {id:"sim-f4",category:"Funções",difficulty:5,topic:"Função definida por trechos",statement:"Um reservatório contém inicialmente 5 000 L. Durante os primeiros 20 minutos, a água é retirada à taxa constante de 120 L/min. Depois disso, a taxa cai para 60 L/min. Quantos litros restam após 35 minutos?",options:["1 100","1 400","1 700","2 000","2 300"],correct:2,explanation:"Nos primeiros 20 min saem 2 400 L. Nos 15 min seguintes saem 900 L. Restam 5 000-2 400-900=1 700 L."},

    {id:"sim-s1",category:"Estatística e Probabilidade",difficulty:1,topic:"Média aritmética",statement:"As notas de cinco estudantes em uma atividade foram 6, 7, 8, 9 e 10. Qual é a média dessas notas?",options:["7,0","7,5","8,0","8,5","9,0"],correct:2,explanation:"A soma é 40 e há 5 valores: 40/5=8."},
    {id:"sim-s2",category:"Estatística e Probabilidade",difficulty:2,topic:"Mediana",statement:"Os tempos, em minutos, gastos por seis participantes para concluir uma tarefa foram 12, 14, 14, 15, 20 e 30. Qual é a mediana?",options:["14","14,5","15","15,5","17,5"],correct:1,explanation:"Há 6 valores, então a mediana é a média dos dois centrais: (14+15)/2=14,5."},
    {id:"sim-s3",category:"Estatística e Probabilidade",difficulty:3,topic:"Média ponderada",statement:"Em uma pesquisa de satisfação, 4 pessoas deram nota 1, 6 deram nota 2, 10 deram nota 3, 12 deram nota 4 e 8 deram nota 5. Qual foi a média das notas?",options:["3,05","3,20","3,35","3,50","3,75"],correct:2,explanation:"A soma ponderada é 4+12+30+48+40=134. Como são 40 pessoas, 134/40=3,35."},
    {id:"sim-s4",category:"Estatística e Probabilidade",difficulty:5,topic:"Probabilidade sem reposição",statement:"Uma urna contém 5 bolas vermelhas, 3 azuis e 2 verdes. Duas bolas são retiradas ao acaso, sem reposição. Qual é a probabilidade de ambas serem vermelhas?",options:["1/5","2/9","1/4","5/18","4/9"],correct:1,explanation:"A probabilidade é (5/10)×(4/9)=20/90=2/9."},

    {id:"sim-m1",category:"Matemática Financeira",difficulty:1,topic:"Desconto percentual",statement:"Uma mochila de R$240,00 está com 15% de desconto à vista. Qual é o preço final?",options:["R$196,00","R$204,00","R$210,00","R$216,00","R$225,00"],correct:1,explanation:"15% de 240 é 36. Portanto, 240-36=204."},
    {id:"sim-m2",category:"Matemática Financeira",difficulty:3,topic:"Descontos sucessivos",statement:"Um produto de R$500,00 recebe primeiro desconto de 20% e, sobre o valor já reduzido, novo desconto de 10%. Qual é o preço final?",options:["R$350,00","R$360,00","R$365,00","R$370,00","R$400,00"],correct:1,explanation:"500×0,80=400 e 400×0,90=360. Descontos sucessivos não somam diretamente."},
    {id:"sim-m3",category:"Matemática Financeira",difficulty:4,topic:"Juros simples",statement:"Uma quantia de R$2.500,00 é aplicada a juros simples de 1,5% ao mês durante 8 meses. Qual será o montante ao final?",options:["R$2.650,00","R$2.725,00","R$2.800,00","R$2.875,00","R$3.000,00"],correct:2,explanation:"J=2 500×0,015×8=300. Montante=2 500+300=2 800."},
    {id:"sim-m4",category:"Matemática Financeira",difficulty:5,topic:"Juros compostos",statement:"Um investimento de R$2.000,00 rende 5% ao mês, com capitalização composta. Qual o montante após 3 meses?",options:["R$2.250,00","R$2.300,00","R$2.315,25","R$2.320,00","R$2.350,00"],correct:2,explanation:"M=2 000×1,05³=2 315,25."},

    {id:"sim-q1",category:"Grandezas e Medidas",difficulty:1,topic:"Capacidade",statement:"Uma garrafa contém 2,5 litros de água. Essa quantidade corresponde a quantos mililitros?",options:["25","250","1 250","2 500","25 000"],correct:3,explanation:"1 L=1 000 mL, então 2,5 L=2 500 mL."},
    {id:"sim-q2",category:"Grandezas e Medidas",difficulty:2,topic:"Velocidade",statement:"Um automóvel se desloca a 72 km/h. Qual é essa velocidade em metros por segundo?",options:["10 m/s","15 m/s","20 m/s","25 m/s","30 m/s"],correct:2,explanation:"Para converter km/h em m/s, divide-se por 3,6: 72/3,6=20 m/s."},
    {id:"sim-q3",category:"Grandezas e Medidas",difficulty:4,topic:"Escala",statement:"Em um mapa na escala 1:25 000, a distância entre dois pontos mede 6,4 cm. Qual é a distância real entre eles?",options:["0,64 km","1,0 km","1,6 km","6,4 km","16 km"],correct:2,explanation:"6,4×25 000=160 000 cm=1 600 m=1,6 km."},
    {id:"sim-q4",category:"Grandezas e Medidas",difficulty:5,topic:"Volume de chuva",statement:"Uma chuva acumulada de 30 mm cai uniformemente sobre uma área plana de 200 m². Desprezando perdas, qual volume de água atingiu essa área?",options:["600 L","1 500 L","3 000 L","6 000 L","60 000 L"],correct:3,explanation:"30 mm=0,03 m. Volume=0,03×200=6 m³=6 000 L."},

    {id:"sim-r1",category:"Gráficos e Tabelas",difficulty:1,topic:"Leitura de dados",statement:"O consumo mensal de energia de uma residência foi registrado na tabela.",support:"<table><tr><th>Mês</th><th>Jan</th><th>Fev</th><th>Mar</th><th>Abr</th><th>Mai</th></tr><tr><th>Consumo (kWh)</th><td>200</td><td>180</td><td>150</td><td>210</td><td>260</td></tr></table>",question:"Entre meses consecutivos, em qual intervalo ocorreu o maior aumento de consumo?",options:["Jan–Fev","Fev–Mar","Mar–Abr","Abr–Mai","Os aumentos foram iguais"],correct:2,explanation:"De março para abril o consumo sobe de 150 para 210, aumento de 60 kWh, maior que o aumento de 50 kWh entre abril e maio."},
    {id:"sim-r2",category:"Gráficos e Tabelas",difficulty:3,topic:"Taxa em tabela",statement:"Uma loja acompanhou vendas e devoluções de quatro produtos.",support:"<table><tr><th>Produto</th><th>Vendidos</th><th>Devolvidos</th></tr><tr><td>A</td><td>200</td><td>10</td></tr><tr><td>B</td><td>250</td><td>15</td></tr><tr><td>C</td><td>150</td><td>12</td></tr><tr><td>D</td><td>100</td><td>10</td></tr></table>",question:"Qual produto apresentou a maior taxa de devolução em relação à quantidade vendida?",options:["A","B","C","D","A e B"],correct:3,explanation:"As taxas são A=5%, B=6%, C=8% e D=10%. Logo, D é a maior."},
    {id:"sim-r3",category:"Gráficos e Tabelas",difficulty:4,topic:"Variação percentual",statement:"A população de uma cidade passou de 120 mil habitantes para 150 mil e, alguns anos depois, para 180 mil. Considerando apenas o valor inicial e o final, qual foi o crescimento percentual total?",options:["25%","30%","40%","50%","60%"],correct:3,explanation:"O aumento foi de 60 mil sobre uma base de 120 mil: 60/120=0,5=50%."},
    {id:"sim-r4",category:"Gráficos e Tabelas",difficulty:5,topic:"Leitura combinada de percentuais",statement:"Em uma pesquisa com 800 estudantes, 45% disseram usar ônibus para ir à escola. Entre os que usam ônibus, 25% levam mais de uma hora no trajeto. Quantos estudantes, aproximadamente, estão nessa situação?",options:["72","80","90","100","180"],correct:2,explanation:"45% de 800=360. Depois, 25% de 360=90 estudantes."}
  ];

  const HISTORY_KEY = "mente-sim-history-v1";
  const ACTIVE_KEY = "mente-sim-active-v1";
  let session = null;
  let timerId = null;
  let selectedPreset = {count:10,minutes:30,label:"Diagnóstico"};

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i=copy.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
    return copy;
  };
  const readJson = (key,fallback) => { try { return JSON.parse(localStorage.getItem(key)||"null") ?? fallback; } catch { return fallback; } };
  const saveJson = (key,value) => localStorage.setItem(key,JSON.stringify(value));
  const fmtTime = (seconds) => `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;

  function buildRandomSet(count) {
    const groups = Object.entries(COLORS).map(([category]) => shuffle(BANK.filter(q => q.category===category)));
    const categoryOrder = shuffle(groups.map((_,i)=>i));
    const result = [];
    let round = 0;
    while (result.length < count) {
      for (const idx of categoryOrder) {
        const q = groups[idx][round];
        if (q && result.length < count) result.push(q);
      }
      round++;
      if (round > 10) break;
    }
    return shuffle(result);
  }

  main.innerHTML = `
    <div class="sim-app">
      <section class="sim-hero">
        <div><p class="sim-eyebrow">Treino com clima de prova</p><h2>Simulados M.E.N.T.E</h2><p>Monte uma prova rápida ou completa com questões inéditas, contextualizadas no estilo ENEM. Cada tentativa sorteia uma combinação diferente e o cronômetro começa junto com a prova.</p></div>
        <aside class="sim-hero__side"><small>Como funciona</small><strong>Questões novas a cada tentativa</strong><span>Dificuldade por estrelas, navegação livre, marcação para revisão, cronômetro e resultado detalhado no final.</span></aside>
      </section>

      <section class="sim-setup" id="sim-setup">
        <div class="sim-section-head"><div><h3>Escolha seu simulado</h3><p>Você pode usar um formato pronto ou personalizar quantidade e tempo.</p></div></div>
        <div class="sim-presets" id="sim-presets">
          <button class="sim-preset" type="button" data-count="5" data-minutes="15" data-label="Aquecimento"><small>5 questões</small><strong>⚡ Aquecimento</strong><span>15 min · ótimo para uma revisão rápida</span></button>
          <button class="sim-preset is-active" type="button" data-count="10" data-minutes="30" data-label="Diagnóstico"><small>10 questões</small><strong>🎯 Diagnóstico</strong><span>30 min · mistura equilibrada de matérias</span></button>
          <button class="sim-preset" type="button" data-count="15" data-minutes="45" data-label="Desafio"><small>15 questões</small><strong>🔥 Desafio</strong><span>45 min · exige mais resistência e atenção</span></button>
          <button class="sim-preset" type="button" data-count="20" data-minutes="60" data-label="Completo"><small>20 questões</small><strong>🏁 Completo</strong><span>60 min · treino longo e variado</span></button>
        </div>
        <div class="sim-custom">
          <label class="sim-field"><span>Quantidade de questões</span><select id="sim-count"><option value="5">5 questões</option><option value="10" selected>10 questões</option><option value="15">15 questões</option><option value="20">20 questões</option></select></label>
          <label class="sim-field"><span>Tempo de prova</span><select id="sim-minutes"><option value="15">15 minutos</option><option value="30" selected>30 minutos</option><option value="45">45 minutos</option><option value="60">60 minutos</option><option value="90">90 minutos</option></select></label>
        </div>
        <div class="sim-actions"><button class="sim-primary" id="sim-start" type="button">Começar simulado →</button></div>
      </section>

      <section class="sim-test sim-hidden" id="sim-test" aria-live="polite"></section>
      <section class="sim-result sim-hidden" id="sim-result" aria-live="polite"></section>
      <section class="sim-history" id="sim-history"></section>
    </div>`;

  const setup = document.querySelector("#sim-setup");
  const test = document.querySelector("#sim-test");
  const result = document.querySelector("#sim-result");

  function renderHistory() {
    const history = readJson(HISTORY_KEY, []);
    const box = document.querySelector("#sim-history");
    box.innerHTML = `<div class="sim-section-head"><div><h3>Histórico de simulados</h3><p>Por enquanto fica salvo neste navegador. Depois pode ser ligado ao banco do perfil.</p></div></div>` + (history.length ? `<div class="sim-history__list">${history.slice(0,6).map(item=>`<article class="sim-history-item"><div><strong>${esc(item.label)} · ${item.total} questões</strong><small>${new Date(item.finishedAt).toLocaleString("pt-BR")}</small></div><b>${item.correct}/${item.total}</b><span>${item.percent}% · ${fmtTime(item.timeUsed)}</span></article>`).join("")}</div>` : `<div class="sim-empty">Você ainda não concluiu nenhum simulado.</div>`);
  }

  function saveActive() { if (session) saveJson(ACTIVE_KEY, session); }
  function clearTimer() { if (timerId) { clearInterval(timerId); timerId=null; } }

  function startSim(count, minutes, label) {
    clearTimer();
    const now = Date.now();
    session = {
      id:`sim-${now}`,
      label,
      count,
      minutes,
      questions:buildRandomSet(count).map(q=>q.id),
      answers:{},
      review:{},
      current:0,
      startedAt:now,
      deadline:now + minutes*60*1000,
      finished:false
    };
    saveActive();
    setup.classList.add("sim-hidden");
    result.classList.add("sim-hidden");
    test.classList.remove("sim-hidden");
    renderQuestion();
    startTimer();
  }

  function currentQuestions() { return session.questions.map(id=>BANK.find(q=>q.id===id)).filter(Boolean); }

  function renderQuestion() {
    const qs = currentQuestions();
    const q = qs[session.current];
    if (!q) return;
    const answered = Object.keys(session.answers).length;
    const pct = Math.round(((session.current+1)/qs.length)*100);
    const chosen = session.answers[q.id];
    const support = q.support ? `<div class="sim-support">${q.support}</div>` : "";
    const prompt = q.question ? `<p class="sim-context"><strong>${esc(q.question)}</strong></p>` : "";
    test.innerHTML = `
      <div class="sim-test__top">
        <div class="sim-progress-copy"><strong>${esc(session.label)} · questão ${session.current+1} de ${qs.length}</strong><small>${answered} respondida${answered===1?"":"s"}</small></div>
        <div class="sim-progress-track"><span style="width:${pct}%"></span></div>
        <div class="sim-timer" id="sim-timer">⏱ <span>--:--</span></div>
      </div>
      <div class="sim-test__body">
        <article class="sim-question" style="--subject-color:${COLORS[q.category]}">
          <div class="sim-question__meta"><span class="sim-chip sim-chip--subject">${esc(q.category)}</span><span class="sim-chip">${esc(q.topic)}</span><span class="sim-stars" aria-label="Dificuldade ${q.difficulty} de 5">${"★".repeat(q.difficulty)}${"☆".repeat(5-q.difficulty)}</span></div>
          <h3>${esc(q.statement)}</h3>${support}${prompt}
          <div class="sim-options">${q.options.map((opt,i)=>`<label class="sim-option"><input type="radio" name="sim-answer" value="${i}" ${Number(chosen)===i?"checked":""}><b>${String.fromCharCode(65+i)}</b><span>${esc(opt)}</span></label>`).join("")}</div>
          <div class="sim-question__nav"><button class="sim-secondary" id="sim-prev" type="button" ${session.current===0?"disabled":""}>← Anterior</button><button class="sim-primary" id="sim-next" type="button">${session.current===qs.length-1?"Finalizar simulado":"Próxima →"}</button></div>
        </article>
        <aside class="sim-palette"><h4>Mapa da prova</h4><p>Clique em um número para navegar.</p><div class="sim-palette__grid">${qs.map((item,i)=>`<button type="button" class="sim-qnav ${i===session.current?"is-current":""} ${session.answers[item.id]!==undefined?"is-answered":""} ${session.review[item.id]?"is-review":""}" data-index="${i}">${i+1}</button>`).join("")}</div><button class="sim-review-toggle" id="sim-review-toggle" type="button">${session.review[q.id]?"★ Marcada para revisar":"☆ Marcar para revisar"}</button><button class="sim-danger" id="sim-finish" type="button" style="width:100%;margin-top:10px">Entregar prova</button></aside>
      </div>`;

    test.querySelectorAll('input[name="sim-answer"]').forEach(input=>input.addEventListener("change",()=>{session.answers[q.id]=Number(input.value);saveActive();renderQuestion();updateTimerDisplay();}));
    document.querySelector("#sim-prev")?.addEventListener("click",()=>{session.current=Math.max(0,session.current-1);saveActive();renderQuestion();updateTimerDisplay();});
    document.querySelector("#sim-next")?.addEventListener("click",()=>{if(session.current===qs.length-1){requestFinish();}else{session.current++;saveActive();renderQuestion();updateTimerDisplay();}});
    test.querySelectorAll(".sim-qnav").forEach(btn=>btn.addEventListener("click",()=>{session.current=Number(btn.dataset.index);saveActive();renderQuestion();updateTimerDisplay();}));
    document.querySelector("#sim-review-toggle")?.addEventListener("click",()=>{session.review[q.id]=!session.review[q.id];if(!session.review[q.id])delete session.review[q.id];saveActive();renderQuestion();updateTimerDisplay();});
    document.querySelector("#sim-finish")?.addEventListener("click",requestFinish);
    updateTimerDisplay();
  }

  function requestFinish() {
    const unanswered = session.questions.filter(id=>session.answers[id]===undefined).length;
    if (unanswered && !confirm(`Ainda há ${unanswered} questão(ões) sem resposta. Deseja entregar mesmo assim?`)) return;
    finishSim(false);
  }

  function startTimer() {
    clearTimer();
    updateTimerDisplay();
    timerId=setInterval(()=>{
      if (!session || session.finished) return clearTimer();
      const remaining=Math.ceil((session.deadline-Date.now())/1000);
      if (remaining<=0) finishSim(true); else updateTimerDisplay();
    },1000);
  }

  function updateTimerDisplay() {
    const el=document.querySelector("#sim-timer");
    if (!el || !session) return;
    const remaining=Math.max(0,Math.ceil((session.deadline-Date.now())/1000));
    el.querySelector("span").textContent=fmtTime(remaining);
    el.classList.toggle("is-warning",remaining<=300 && remaining>60);
    el.classList.toggle("is-danger",remaining<=60);
  }

  function finishSim(timeout) {
    if (!session || session.finished) return;
    clearTimer();
    session.finished=true;
    const qs=currentQuestions();
    const correct=qs.filter(q=>session.answers[q.id]===q.correct).length;
    const percent=Math.round((correct/qs.length)*100);
    const finishedAt=Date.now();
    const totalSeconds=session.minutes*60;
    const remaining=Math.max(0,Math.ceil((session.deadline-finishedAt)/1000));
    const timeUsed=Math.min(totalSeconds,Math.max(0,totalSeconds-remaining));
    const perSubject={};
    qs.forEach(q=>{perSubject[q.category]??={total:0,correct:0};perSubject[q.category].total++;if(session.answers[q.id]===q.correct)perSubject[q.category].correct++;});
    const record={id:session.id,label:session.label,total:qs.length,correct,percent,timeUsed,finishedAt,timeout,perSubject};
    const history=readJson(HISTORY_KEY,[]).filter(x=>x.id!==record.id);
    history.unshift(record);saveJson(HISTORY_KEY,history.slice(0,20));localStorage.removeItem(ACTIVE_KEY);
    test.classList.add("sim-hidden");result.classList.remove("sim-hidden");renderResult(record,qs);renderHistory();
  }

  function renderResult(record,qs) {
    const message=record.percent>=80?"Excelente desempenho!":record.percent>=60?"Bom resultado — já dá para enxergar onde revisar.":"Esse resultado é um ótimo diagnóstico para orientar o próximo estudo.";
    result.innerHTML=`
      <div class="sim-result__hero"><div class="sim-score-ring" style="--score:${record.percent}"><strong>${record.percent}%</strong></div><div><p class="sim-eyebrow">${record.timeout?"Tempo encerrado":"Simulado concluído"}</p><h3>${record.correct} de ${record.total} acertos</h3><p>${message}</p></div></div>
      <div class="sim-result-stats"><article class="sim-result-stat"><small>Tempo usado</small><strong>${fmtTime(record.timeUsed)}</strong></article><article class="sim-result-stat"><small>Questões</small><strong>${record.total}</strong></article><article class="sim-result-stat"><small>Para revisar</small><strong>${qs.filter(q=>session.review[q.id]).length}</strong></article></div>
      <div class="sim-section-head"><div><h3>Desempenho por matéria</h3><p>Veja em quais áreas você foi melhor e onde vale revisar.</p></div></div>
      <div class="sim-breakdown">${Object.entries(record.perSubject).map(([name,s])=>`<article style="border-top:4px solid ${COLORS[name]}"><strong>${esc(name)}</strong><span>${s.correct}/${s.total} acertos · ${Math.round(s.correct/s.total*100)}%</span></article>`).join("")}</div>
      <div class="sim-section-head" style="margin-top:24px"><div><h3>Correção comentada</h3><p>As explicações ficam disponíveis depois da entrega, como em uma revisão pós-prova.</p></div></div>
      <div class="sim-review-list">${qs.map((q,i)=>{const ans=session.answers[q.id];const ok=ans===q.correct;return `<article class="sim-review-item ${ok?"is-correct":"is-wrong"}"><h4>${i+1}. ${esc(q.category)} · ${"★".repeat(q.difficulty)}</h4><p><strong>Sua resposta:</strong> ${ans===undefined?"Não respondida":`${String.fromCharCode(65+ans)}) ${esc(q.options[ans])}`}</p><p><strong>Resposta correta:</strong> ${String.fromCharCode(65+q.correct)}) ${esc(q.options[q.correct])}</p><p><strong>Explicação:</strong> ${esc(q.explanation)}</p></article>`}).join("")}</div>
      <div class="sim-actions"><button class="sim-secondary" id="sim-back-setup" type="button">Voltar aos formatos</button><button class="sim-primary" id="sim-again" type="button">Sortear outro simulado →</button></div>`;
    document.querySelector("#sim-back-setup")?.addEventListener("click",()=>{result.classList.add("sim-hidden");setup.classList.remove("sim-hidden");session=null;});
    document.querySelector("#sim-again")?.addEventListener("click",()=>startSim(record.total,Math.max(15,Math.round(record.total*3)),record.label));
  }

  document.querySelectorAll(".sim-preset").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".sim-preset").forEach(x=>x.classList.remove("is-active"));btn.classList.add("is-active");selectedPreset={count:Number(btn.dataset.count),minutes:Number(btn.dataset.minutes),label:btn.dataset.label};document.querySelector("#sim-count").value=String(selectedPreset.count);document.querySelector("#sim-minutes").value=String(selectedPreset.minutes);
  }));
  document.querySelector("#sim-start")?.addEventListener("click",()=>{const count=Number(document.querySelector("#sim-count").value);const minutes=Number(document.querySelector("#sim-minutes").value);startSim(count,minutes,selectedPreset.label||"Personalizado");});
  document.querySelector("#sim-count")?.addEventListener("change",()=>{document.querySelectorAll(".sim-preset").forEach(x=>x.classList.remove("is-active"));selectedPreset.label="Personalizado";});
  document.querySelector("#sim-minutes")?.addEventListener("change",()=>{document.querySelectorAll(".sim-preset").forEach(x=>x.classList.remove("is-active"));selectedPreset.label="Personalizado";});

  const active=readJson(ACTIVE_KEY,null);
  if (active && !active.finished && active.deadline>Date.now() && Array.isArray(active.questions)) {
    session=active;setup.classList.add("sim-hidden");test.classList.remove("sim-hidden");renderQuestion();startTimer();
  } else if (active) localStorage.removeItem(ACTIVE_KEY);
  renderHistory();
})();
