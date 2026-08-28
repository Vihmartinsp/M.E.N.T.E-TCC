"use strict";

(() => {
  const modules = window.MENTE_FINAL_MODULES || {};
  const order = ["Geometria","Funções","Estatística e Probabilidade","Matemática Financeira","Grandezas e Medidas","Gráficos e Tabelas"];
  const allQuestions = order.flatMap((category) => modules[category]?.questions || []);
  if (!allQuestions.length) return;

  const slug = {
    "Geometria":"geometria",
    "Funções":"funcoes",
    "Estatística e Probabilidade":"estatistica-probabilidade",
    "Matemática Financeira":"matematica-financeira",
    "Grandezas e Medidas":"grandezas-medidas",
    "Gráficos e Tabelas":"graficos-tabelas",
  };
  const icon = {
    "Geometria":"📐","Funções":"ƒ","Estatística e Probabilidade":"📊","Matemática Financeira":"💰","Grandezas e Medidas":"⚖️","Gráficos e Tabelas":"📈"
  };
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  const letter = (i) => String.fromCharCode(65 + i);

  function migrateAnswers() {
    const key = "mente-conteudos-finais-v1";
    if (localStorage.getItem(key)) return;
    try {
      const answers = JSON.parse(localStorage.getItem("mente-answers") || "{}");
      allQuestions.forEach((q) => delete answers[q.id]);
      localStorage.setItem("mente-answers", JSON.stringify(answers));
    } catch { localStorage.removeItem("mente-answers"); }
    localStorage.setItem(key, "true");
  }

  function reviewHref(q) { return `explicacoes.html#${slug[q.category]}`; }

  function visualFor(q) {
    const key = `${q.category}-${q.examNumber}-${q.year}`;
    const wrap = (body, caption) => `<figure class="mente-visual">${body}${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
    const table = (headers, rows) => `<div class="mente-visual"><table class="mente-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

    if (key === "Geometria-139-2025") return wrap(`<svg viewBox="0 0 560 330" role="img" aria-label="Lagoa circular com ciclovia e trecho protegido em torno do ponto P"><circle cx="280" cy="165" r="118" fill="#dbeafe" stroke="#64748b" stroke-width="3"/><circle cx="280" cy="165" r="137" fill="none" stroke="#cbd5e1" stroke-width="18"/><path d="M382 74 A137 137 0 0 1 419 170" fill="none" stroke="#475569" stroke-width="18" stroke-linecap="round"/><circle cx="412" cy="116" r="7" fill="#FF7A00"/><text x="424" y="119" font-size="18" font-weight="800">P</text><text x="365" y="73" font-size="14">200 m</text><text x="424" y="164" font-size="14">200 m</text><line x1="280" y1="165" x2="398" y2="165" stroke="#334155" stroke-width="2"/><text x="321" y="153" font-size="14">1 km</text></svg>`,`A ciclovia acompanha a lagoa circular; cada policial protege até 200 m para cada lado de sua posição.`);
    if (key === "Geometria-155-2024") return wrap(`<svg viewBox="0 0 500 300" role="img" aria-label="Setor circular com ângulo alfa e raio R"><path d="M105 240 L350 240 A245 245 0 0 0 270 70 Z" fill="#fff1e6" stroke="#FF7A00" stroke-width="3"/><circle cx="105" cy="240" r="5" fill="#334155"/><path d="M151 240 A46 46 0 0 0 139 208" fill="none" stroke="#7c3aed" stroke-width="3"/><text x="145" y="214" font-size="18">α</text><text x="206" y="258" font-size="17">R</text><text x="85" y="263" font-size="16">S</text></svg>`,`A cobertura é um setor circular: o ângulo α e o raio R determinam a área.`) + table(["Tipo","α","R (m)"],[["I","15°","20"],["II","30°","22"],["III","40°","12"],["IV","60°","16"],["V","90°","10"]]);
    if (key === "Geometria-150-2024") return wrap(`<svg viewBox="0 0 600 310" role="img" aria-label="Sala retangular de 6 por 3 metros com fileira de colunas"><rect x="75" y="55" width="430" height="200" fill="#eff6ff" stroke="#475569" stroke-width="2"/><text x="275" y="38" font-size="16">6 m</text><text x="520" y="160" font-size="16">3 m</text><line x1="290" y1="65" x2="290" y2="245" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 5"/><g fill="#3b82f6">${[78,101,124,147,170,193,216,239].map(y=>`<circle cx="290" cy="${y}" r="8"/>`).join("")}</g></svg>`,`A fileira de colunas atravessa o lado de 3 m da sala.`) + table(["Loja","Raio (cm)","Preço/unidade (R$)"],[["I","5","60"],["II","10","70"],["III","12","75"],["IV","15","90"],["V","20","120"]]);
    if (key === "Geometria-175-2024") return wrap(`<svg viewBox="0 0 700 330" role="img" aria-label="Duas formas de enrolar uma folha de 10 por 20 centímetros para formar cilindros"><g transform="translate(55 30)"><text x="90" y="0" font-size="18" font-weight="800">Embalagem 1</text><rect x="40" y="25" width="135" height="230" fill="#fff7ed" stroke="#FF7A00" stroke-width="3"/><text x="82" y="280" font-size="15">10 cm</text><text x="-10" y="145" font-size="15">20 cm</text><path d="M205 45 C260 45 260 235 205 235" fill="none" stroke="#64748b" stroke-width="3"/><ellipse cx="205" cy="45" rx="45" ry="14" fill="none" stroke="#64748b" stroke-width="3"/><ellipse cx="205" cy="235" rx="45" ry="14" fill="none" stroke="#64748b" stroke-width="3"/></g><g transform="translate(365 65)"><text x="75" y="-35" font-size="18" font-weight="800">Embalagem 2</text><rect x="10" y="25" width="230" height="120" fill="#fff7ed" stroke="#FF7A00" stroke-width="3"/><text x="95" y="170" font-size="15">20 cm</text><text x="-38" y="90" font-size="15">10 cm</text><ellipse cx="125" cy="205" rx="92" ry="28" fill="none" stroke="#64748b" stroke-width="3"/><line x1="33" y1="205" x2="33" y2="265" stroke="#64748b" stroke-width="3"/><line x1="217" y1="205" x2="217" y2="265" stroke="#64748b" stroke-width="3"/><ellipse cx="125" cy="265" rx="92" ry="28" fill="none" stroke="#64748b" stroke-width="3"/></g></svg>`,`A mesma folha pode ser enrolada em duas orientações: um lado vira altura e o outro vira circunferência.`);
    if (key === "Funções-145-2025") return wrap(`<svg viewBox="0 0 620 300" role="img" aria-label="Frequência respiratória diminui entre t1 e t2 e depois fica constante"><line x1="70" y1="245" x2="560" y2="245" stroke="#334155" stroke-width="2"/><line x1="70" y1="245" x2="70" y2="35" stroke="#334155" stroke-width="2"/><path d="M85 75 L200 75 C265 78 300 130 360 190 L535 190" fill="none" stroke="#AB47BC" stroke-width="5"/><line x1="200" y1="75" x2="200" y2="245" stroke="#94a3b8" stroke-dasharray="5 5"/><line x1="360" y1="190" x2="360" y2="245" stroke="#94a3b8" stroke-dasharray="5 5"/><text x="185" y="270">t₁</text><text x="345" y="270">t₂</text><text x="35" y="80">f₁</text><text x="35" y="195">f₂</text><text x="500" y="275">tempo</text></svg>`,`De t₁ a t₂ a frequência diminui; depois de t₂, estabiliza.`);
    if (key === "Funções-177-2024") return table(["Quantidade de mochilas","Custo total (R$)"],[["30","1 050"],["50","1 650"],["100","3 150"]]);
    if (key === "Funções-160-2025") return wrap(`<svg viewBox="0 0 650 330" role="img" aria-label="Ramo crescente de tangente com centro em T 2,5 e D 30 e assíntotas laterais"><line x1="75" y1="270" x2="590" y2="270" stroke="#334155" stroke-width="2"/><line x1="75" y1="270" x2="75" y2="35" stroke="#334155" stroke-width="2"/><line x1="145" y1="45" x2="145" y2="270" stroke="#dc2626" stroke-dasharray="7 5"/><line x1="520" y1="45" x2="520" y2="270" stroke="#dc2626" stroke-dasharray="7 5"/><path d="M160 245 C245 238 278 205 330 150 C382 95 418 62 505 55" fill="none" stroke="#AB47BC" stroke-width="5"/><circle cx="330" cy="150" r="5" fill="#AB47BC"/><line x1="330" y1="150" x2="330" y2="270" stroke="#94a3b8" stroke-dasharray="4 4"/><line x1="75" y1="150" x2="330" y2="150" stroke="#94a3b8" stroke-dasharray="4 4"/><text x="312" y="295">2,5</text><text x="42" y="155">30</text><text x="95" y="315">(5−2π)/2</text><text x="485" y="315">(5+2π)/2</text></svg>`,`O ponto central do ramo é (2,5; 30); as linhas tracejadas representam as assíntotas verticais.`);
    if (key === "Estatística e Probabilidade-178-2024") return table(["Mês","Maio","Junho","Julho","Agosto","Setembro","Outubro"],[['Umidade (%)','66','64','54','46','60','64']]);
    if (key === "Estatística e Probabilidade-137-2023") return table(["Setor","Funcionários","Salário (R$)"],[["Produção","75","2 000"],["Administração","25","7 000"]]);
    if (key === "Estatística e Probabilidade-165-2025") return table(["Grupo","Menor","Maior","Média","Mediana","Moda","Desvio padrão"],[["1","—","—","25","—","—","10"],["2","—","—","—","25","—","9"],["3","—","—","—","—","25","—"],["4","—","—","25","—","—","1"],["5","20","35","—","—","—","—"]]);
    if (key === "Grandezas e Medidas-156-2025") return wrap(`<svg viewBox="0 0 560 330" role="img" aria-label="Desenho do sol com largura e altura de 20 centímetros"><g transform="translate(185 50)" fill="#fbbf24"><circle cx="95" cy="105" r="58"/>${[0,45,90,135,180,225,270,315].map(a=>`<polygon points="95,5 78,35 112,35" transform="rotate(${a} 95 105)"/>`).join("")}</g><line x1="150" y1="285" x2="410" y2="285" stroke="#475569" stroke-width="2"/><line x1="150" y1="275" x2="150" y2="295" stroke="#475569"/><line x1="410" y1="275" x2="410" y2="295" stroke="#475569"/><text x="258" y="315" font-size="16">20 cm</text><line x1="435" y1="55" x2="435" y2="270" stroke="#475569" stroke-width="2"/><line x1="425" y1="55" x2="445" y2="55" stroke="#475569"/><line x1="425" y1="270" x2="445" y2="270" stroke="#475569"/><text x="450" y="170" font-size="16">20 cm</text></svg>`,`O desenho mede 20 cm; a medida correspondente na obra real é 30 m.`);
    if (key === "Gráficos e Tabelas-156-2023") return wrap(`<svg viewBox="0 0 720 310" role="img" aria-label="Intensidade do sinal ao longo de 30 minutos com intervalos sem sinal entre 10 e 12 e 16 e 20"><line x1="60" y1="250" x2="680" y2="250" stroke="#334155" stroke-width="2"/><line x1="60" y1="250" x2="60" y2="35" stroke="#334155" stroke-width="2"/><polyline points="60,90 225,90 265,250 305,250 370,130 390,250 470,250 520,155 680,120" fill="none" stroke="#0284C7" stroke-width="5"/><g font-size="13">${[0,8,10,12,16,20,30].map((x,i)=>`<text x="${[57,220,258,299,382,463,665][i]}" y="275">${x}</text>`).join("")}</g><text x="590" y="298">tempo (min)</text></svg>`,`A linha coincide com o eixo horizontal nos intervalos de 10 a 12 min e de 16 a 20 min.`);
    if (key === "Gráficos e Tabelas-143-2025") return `<div class="mente-visual"><div class="mente-label-grid"><div class="mente-label"><strong>Batata chips</strong><br>3 porções de 50 g<br>170 mg de sódio/porção</div><div class="mente-label"><strong>Palitos salgados</strong><br>4 porções de 20 g<br>501 mg de sódio/porção</div><div class="mente-label"><strong>Biscoito multigrãos</strong><br>8 porções de 25 g<br>264 mg de sódio/porção</div><div class="mente-label"><strong>Biscoito de polvilho</strong><br>6 porções de 15 g<br>175 mg de sódio/porção</div><div class="mente-label"><strong>Biscoito de água e sal</strong><br>5 porções de 40 g<br>166 mg de sódio/porção</div></div></div>`;
    if (key === "Gráficos e Tabelas-147-2025") return wrap(`<svg viewBox="0 0 760 330" role="img" aria-label="Distribuição percentual das matrículas em 2023 e quantidades em 2024"><g transform="translate(70 45)"><circle cx="130" cy="120" r="90" fill="#e2e8f0"/><path d="M130 120 L130 30 A90 90 0 1 1 77 193 Z" fill="#0284C7"/><path d="M130 120 L77 193 A90 90 0 0 1 40 120 Z" fill="#38bdf8"/><path d="M130 120 L40 120 A90 90 0 0 1 57 67 Z" fill="#a5f3fc"/><path d="M130 120 L57 67 A90 90 0 0 1 130 30 Z" fill="#cbd5e1"/><text x="230" y="45">Inglês 60%</text><text x="230" y="75">Espanhol 25%</text><text x="230" y="105">Francês 10%</text><text x="230" y="135">Alemão 5%</text><text x="80" y="245" font-weight="800">2023</text></g><g transform="translate(450 55)"><line x1="20" y1="220" x2="250" y2="220" stroke="#334155"/><rect x="35" y="30" width="35" height="190" fill="#0284C7"/><rect x="85" y="165" width="35" height="55" fill="#0284C7"/><rect x="135" y="206" width="35" height="14" fill="#0284C7"/><rect x="185" y="206" width="35" height="14" fill="#0284C7"/><text x="38" y="25">280</text><text x="90" y="160">80</text><text x="140" y="201">20</text><text x="190" y="201">20</text><text x="43" y="245">I</text><text x="92" y="245">E</text><text x="143" y="245">F</text><text x="193" y="245">A</text><text x="90" y="275" font-weight="800">2024</text></g></svg>`,`2023 usa porcentagens; 2024 usa quantidades. Em 2025, o total será o de 2024 e a distribuição percentual será a de 2023.`);
    if (key === "Gráficos e Tabelas-178-2023") {
      const paths=["M10 105 L55 30 L55 105 L120 105 L165 30","M10 105 L55 60 L120 60 L165 15","M10 70 L55 70 L55 105 L120 105 L120 70 L165 70","M10 105 L165 15","M10 105 L55 55 L55 105 L120 105 L165 55"];
      return `<div class="mente-visual"><div class="mente-mini-graphs">${paths.map((p,i)=>`<div class="mente-mini-graph"><strong>${letter(i)}</strong><svg viewBox="0 0 180 125"><line x1="10" y1="110" x2="170" y2="110" stroke="#64748b"/><line x1="10" y1="110" x2="10" y2="10" stroke="#64748b"/><path d="${p}" fill="none" stroke="#0284C7" stroke-width="4"/></svg></div>`).join("")}</div><figcaption>Procure o gráfico de volume acumulado: cresce, fica constante durante a pausa e volta a crescer.</figcaption></div>`;
    }
    if (key === "Gráficos e Tabelas-169-2025") {
      const seqs=[[400,330,562.5,562.5,500],[40,30,45,45,50],[200,220,250,250,200],[240,250,295,295,250],[8,6.6,11.25,11.25,10]];
      const plot=(arr)=>{const min=Math.min(...arr),max=Math.max(...arr),span=max-min||1;return arr.map((v,i)=>`${10+i*38},${100-((v-min)/span)*75}`).join(" ")};
      return table(["Safra","11-12","12-13","13-14","14-15","15-16"],[['Área (ha)','200','220','250','250','200'],['Produtividade (sacas/ha)','40','30','45','45','50']]) + `<div class="mente-visual"><div class="mente-mini-graphs">${seqs.map((a,i)=>`<div class="mente-mini-graph"><strong>${letter(i)}</strong><svg viewBox="0 0 180 120"><line x1="10" y1="105" x2="170" y2="105" stroke="#64748b"/><polyline points="${plot(a)}" fill="none" stroke="#0284C7" stroke-width="4"/></svg><small>${a.join(' · ')}</small></div>`).join("")}</div></div>`;
    }
    return "";
  }

  function overrideCatalog() {
    if (typeof questions === "undefined" || typeof renderQuestions !== "function") return;
    allQuestions.forEach((q) => {
      const i = questions.findIndex((item) => item.id === q.id);
      const payload = { ...q, detail:q.statement, visual:null, status:"Não respondida" };
      if (i >= 0) Object.assign(questions[i], payload); else questions.push(payload);
    });
    if (typeof categoryColors !== "undefined") order.forEach((c)=>{ if(modules[c]) categoryColors[c]=modules[c].color; });
    if (typeof updateTopicOptions === "function") updateTopicOptions();
    renderQuestions();
    decorateCatalog();
  }

  function decorateCatalog() {
    const intro = document.querySelector(".intro p:last-child");
    if (intro) intro.textContent = "Explore 30 questões oficiais selecionadas do ENEM, organizadas por matéria, conteúdo e dificuldade.";
    document.querySelectorAll(".question-card").forEach((card) => {
      const btn = card.querySelector("[data-question-id]");
      if (!btn) return;
      const q = allQuestions.find((x) => x.id === Number(btn.dataset.questionId));
      if (!q) return;
      card.style.setProperty("--category-color", modules[q.category]?.color || q.color);
      const tags = card.querySelectorAll(".question-card__tags span");
      if (tags[1]) tags[1].textContent = `ENEM ${q.year} · questão ${q.examNumber}`;
      if (!card.querySelector(".mente-review-link")) {
        const link = document.createElement("a");
        link.className = "mente-review-link";
        link.href = reviewHref(q);
        link.textContent = `Revisar ${q.category} →`;
        const footer = card.querySelector(".question-card__footer");
        if (footer) footer.before(link); else card.appendChild(link);
      }
    });
  }

  function wrongFor(q, selected) {
    const L = letter(selected);
    const pieces = q.wrong.split(/(?:|•)/).map(s=>s.trim()).filter(Boolean);
    let hit = pieces.find(p=>new RegExp(`^(?:Alternativa\\s+)?${L}(?:\\s|\\(|:)`,"i").test(p));
    if (!hit) {
      const re = new RegExp(`Alternativa\\s+${L}:[\\s\\S]*?(?=Alternativa\\s+[A-E]:|$)`,"i");
      hit = q.wrong.match(re)?.[0];
    }
    return hit || q.wrong;
  }

  function renderQuestionDetail(q) {
    const root = document.querySelector("#question-content");
    if (!root) return;
    document.documentElement.style.setProperty("--subject-color", modules[q.category]?.color || q.color);
    let answers={}; try{answers=JSON.parse(localStorage.getItem("mente-answers")||"{}")}catch{answers={}}
    const previous=answers[q.id];
    const name=`mente-answer-${q.id}`;
    root.innerHTML = `
      <section class="portal-hero mente-question-hero">
        <p class="mente-level">${icon[q.category]} Nível M.E.N.T.E: ${"★".repeat(q.stars)}${"☆".repeat(5-q.stars)}</p>
        <h2>Questão ${q.examNumber} · ENEM ${q.year}</h2><p>${esc(q.topic)}</p>
      </section>
      <article class="portal-card">
        <div class="question-detail__meta"><span>${esc(q.category)}</span><span>${esc(q.topic)}</span><span>Questão ${q.examNumber}</span><span>${"★".repeat(q.stars)}${"☆".repeat(5-q.stars)}</span></div>
        <a class="mente-review-link" style="--category-color:${esc(q.color)}" href="${reviewHref(q)}">Revisar ${esc(q.category)} antes de responder →</a>
        <p class="question-statement">${esc(q.statement)}</p>
        ${visualFor(q)}
        <div class="mente-reading" aria-label="Leitura guiada M.E.N.T.E">
          <div class="mente-reading__item mente-reading__item--objective"><strong>🎯 Objetivo</strong><span>${esc(q.objective)}</span></div>
          <div class="mente-reading__item mente-reading__item--data"><strong>🔎 Dados importantes</strong><span>${esc(q.data)}</span></div>
          <div class="mente-reading__item mente-reading__item--clue"><strong>💡 Pista</strong><span>${esc(q.clue)}</span></div>
          <div class="mente-reading__item mente-reading__item--trap"><strong>⚠️ Armadilha</strong><span>${esc(q.trap)}</span></div>
          <div class="mente-reading__item mente-reading__item--strategy"><strong>🧠 Estratégia</strong><span>${esc(q.strategy)}</span></div>
        </div>
        <fieldset class="mente-answer-options" ${previous?"disabled":""}><legend>Escolha uma alternativa</legend>${q.options.map((opt,i)=>`<label><input type="radio" name="${name}" value="${i}" ${previous?.selected===i?"checked":""}><b>${letter(i)}</b><span>${esc(opt)}</span></label>`).join("")}</fieldset>
        <button class="portal-button" id="mente-final-answer" ${previous?"disabled":""}>${previous?"Questão já respondida":"Responder e ver a explicação"}</button>
        <div class="mente-feedback" id="mente-final-feedback" role="status"></div>
        <p class="mente-source">${esc(q.source)} · Questão ${q.examNumber}</p>
      </article>`;

    const feedback=document.querySelector("#mente-final-feedback");
    const show=(ans)=>{
      if(!feedback) return;
      if(ans.correct){
        feedback.innerHTML=`<div class="mente-feedback__box mente-feedback__box--correct"><h3>✅ Você acertou!</h3><h4>Por que a alternativa está correta?</h4><p>${esc(q.correctExplanation)}</p><h4>✏️ Resolução</h4><p>${esc(q.resolution)}</p><div class="mente-feedback__tip"><strong>💡 Dica M.E.N.T.E:</strong> ${esc(q.tip)}</div></div>`;
      }else{
        feedback.innerHTML=`<div class="mente-feedback__box mente-feedback__box--wrong"><h3>Vamos transformar esse erro em aprendizado</h3><h4>🧠 O que provavelmente aconteceu</h4><div class="mente-feedback__wrong-choice"><strong>Você marcou ${letter(ans.selected)}.</strong> ${esc(wrongFor(q,ans.selected))}</div><h4>🔎 Onde está a pista no enunciado?</h4><p>${esc(q.clue)}</p><h4>🧩 Como organizar o problema</h4><p>${esc(q.understand)} ${esc(q.perceive)}</p><h4>⚠️ Onde está a armadilha?</h4><p>${esc(q.trapDetail)}</p><h4>✏️ Como resolver</h4><p>${esc(q.setup)}</p><p>${esc(q.resolution)}</p><h4>✅ Por que a correta está certa?</h4><p>${esc(q.correctExplanation)}</p><div class="mente-feedback__tip"><strong>Como evitar esse erro:</strong> ${esc(q.tip)}</div></div>`;
      }
    };
    if(previous) show(previous);
    const button=document.querySelector("#mente-final-answer");
    if(button&&!previous) button.addEventListener("click",()=>{
      const selected=document.querySelector(`input[name="${name}"]:checked`);
      if(!selected){feedback.innerHTML='<p class="form-error">Escolha uma alternativa antes de responder.</p>';return;}
      const idx=Number(selected.value), correct=idx===q.correct;
      const answer={selected:idx,correct,answeredAt:new Date().toISOString(),examNumber:q.examNumber,year:q.year};
      answers[q.id]=answer; localStorage.setItem("mente-answers",JSON.stringify(answers));
      if(correct){const total=Number(localStorage.getItem("mente-points")||0)+10;localStorage.setItem("mente-points",String(total));const p=document.querySelector("#points");if(p)p.textContent=total;}
      document.querySelectorAll(`input[name="${name}"]`).forEach(i=>i.disabled=true);button.disabled=true;button.textContent="Questão já respondida";show(answer);
    });
  }

  const intro = {
    "Geometria": {title:"Geometria: enxergue a figura antes da fórmula",copy:"Geometria estuda formas, tamanhos, medidas e posições. No ENEM, o desafio costuma ser reconhecer a figura escondida em uma situação do cotidiano e descobrir qual medida realmente precisa ser calculada.",path:["Situação","Figura","Dados","Objetivo","Fórmula","Resolução"],concepts:[["Área de retângulos","Compare espaços em m², não apenas comprimentos."],["Circunferência","Use o contorno quando o problema fala de percurso circular."],["Setor circular","Relacione o ângulo à fração do círculo inteiro."],["Cilindros","Diferencie altura, circunferência, raio e volume."]]},
    "Funções": {title:"Funções: descubra o que depende do quê",copy:"Uma função representa uma relação entre grandezas. Antes de procurar uma expressão, identifique as variáveis, a forma como elas mudam e o que o gráfico ou a situação está dizendo.",path:["Situação","Variáveis","Relação","Função","Resultado"],concepts:[["Leitura por trechos","Leia crescimento, queda e estabilidade intervalo por intervalo."],["Função afim","Separe valor fixo de taxa variável."],["Função quadrática","Máximos e mínimos aparecem no vértice."],["Transformações","Em logaritmos e tangente, interprete parâmetros antes de calcular."]]},
    "Estatística e Probabilidade": {title:"Estatística e Probabilidade: transforme dados em informação",copy:"O objetivo não é decorar média ou probabilidade isoladamente. Primeiro entenda o que os dados representam, como estão organizados e qual medida realmente responde à pergunta.",path:["Dados","Significado","Organização","Comparação","Medida/Probabilidade","Resposta"],concepts:[["Mediana","Ordene os valores antes de procurar o centro."],["Médias","Confira quais valores entram e se existem pesos."],["Probabilidade","Identifique o espaço de possibilidades e a relação entre eventos."],["Dispersão","Média, mediana, moda e desvio padrão dizem coisas diferentes."]]},
    "Matemática Financeira": {title:"Matemática Financeira: entenda o que aconteceu com o dinheiro",copy:"Compras, reajustes, lucros e financiamentos ficam mais simples quando você separa valor inicial, despesas, receita, percentuais e o momento em que cada pagamento acontece.",path:["Situação","Valores","Relação","Operação","Resposta"],concepts:[["Porcentagem","Pergunte sempre: percentual de qual valor?"],["Custo total","Multiplique preços unitários pelas quantidades antes de comparar."],["Receita e lucro","Não misture faturamento, despesa e lucro."],["Juros compostos","Valores em datas diferentes precisam ser comparados na mesma data."]]},
    "Grandezas e Medidas": {title:"Grandezas e Medidas: unidade primeiro, conta depois",copy:"Comprimento, área, volume, capacidade, tempo e escalas aparecem em muitos problemas. O ponto-chave é perceber quando as unidades precisam ser compatibilizadas e qual fator de conversão corresponde à grandeza.",path:["Situação","Unidade","Conversão","Cálculo","Resposta"],concepts:[["Capacidade e volume","1 cm³ = 1 mL e 1 dm³ = 1 L."],["Unidades derivadas","A unidade segue a operação definida no enunciado."],["Escala linear","Compare medidas na mesma unidade."],["Escala de área","O fator linear precisa ser elevado ao quadrado."]]},
    "Gráficos e Tabelas": {title:"Gráficos e Tabelas: leia antes de calcular",copy:"Antes de olhar números isolados, descubra o que o gráfico ou a tabela representa. Título, eixos, unidades, legenda, categorias e intervalos dizem como os dados devem ser interpretados.",path:["Pergunta","Título/legenda","Eixos/unidades","Dados necessários","Relação","Resposta"],concepts:[["Intervalos","Duração é final menos início; some apenas os intervalos válidos."],["Rótulos e tabelas","Diferencie valor por unidade de valor total."],["Dois gráficos","Relacione porcentagem e quantidade usando a base correta."],["Grandeza acumulada","Se nada é acrescentado, o gráfico fica horizontal; não volta a zero."]]},
  };

  function renderExplanations() {
    const main=document.querySelector(".portal-main") || document.querySelector(".main-content");
    if(!main) return;
    main.innerHTML=`<div class="mente-explanations"><header class="portal-hero"><span class="portal-card__tag">M.E.N.T.E</span><h1>Explicações por matéria</h1><p>Aprenda a interpretar as questões antes de partir para as contas. As cores destacam somente o que realmente ajuda a organizar o raciocínio.</p></header><nav class="mente-subject-nav" aria-label="Matérias">${order.map(c=>`<a href="#${slug[c]}" style="border-bottom:3px solid ${modules[c].color}">${icon[c]} ${esc(c)}</a>`).join("")}</nav>${order.map(c=>{const m=modules[c],x=intro[c];return `<section class="mente-subject-section" id="${slug[c]}" style="--subject-color:${m.color}"><header class="mente-subject-header"><p class="mente-subject-header__eyebrow">${icon[c]} ${esc(c)} · cor ${m.color}</p><h2>${esc(x.title)}</h2><p>${esc(x.copy)}</p></header><div class="mente-subject-body"><h3>Como pensar</h3><div class="mente-path">${x.path.map(p=>`<span>${esc(p)}</span>`).join('<b>→</b>')}</div><h3>Conceitos que aparecem nas questões</h3><div class="mente-concepts">${x.concepts.map(([a,b])=>`<div class="mente-concept"><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join("")}</div><h3>Progressão dos 5 níveis</h3><div class="mente-level-list">${m.questions.map(q=>`<div class="mente-level-row"><strong>${"★".repeat(q.stars)}</strong><span>Questão ${q.examNumber} · ENEM ${q.year}<br><small>${esc(q.topic)}</small></span><b>${letter(q.correct)}</b></div>`).join("")}</div><div class="mente-reading"><div class="mente-reading__item mente-reading__item--objective"><strong>Azul</strong><span>O que a questão quer descobrir.</span></div><div class="mente-reading__item mente-reading__item--data"><strong>Verde</strong><span>Dados realmente necessários.</span></div><div class="mente-reading__item mente-reading__item--clue"><strong>Amarelo</strong><span>Pistas de interpretação e raciocínio.</span></div><div class="mente-reading__item mente-reading__item--trap"><strong>Vermelho</strong><span>Erros comuns e armadilhas.</span></div><div class="mente-reading__item mente-reading__item--strategy"><strong>Roxo</strong><span>Estratégia que vale guardar para outras questões.</span></div></div><a class="mente-subject-cta" href="questoes.html">Praticar ${esc(c)} →</a></div></section>`}).join("")}</div>`;
    if(location.hash) requestAnimationFrame(()=>document.querySelector(location.hash)?.scrollIntoView({block:"start"}));
  }

  migrateAnswers();
  if(document.querySelector("#questions-grid")) overrideCatalog();
  if(document.querySelector("#question-content")) {
    const params=new URLSearchParams(location.search); let id=Number(params.get("id"));
    if(!id){try{id=Number(JSON.parse(localStorage.getItem("mente-selected-question")||"null")?.id)}catch{id=0}}
    const q=allQuestions.find(x=>x.id===id); if(q) renderQuestionDetail(q);
  }
  if(document.body?.dataset?.page === "explicacoes") renderExplanations();
})();