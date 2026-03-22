/* Quiz modal (4-step) */
(function(){
  const state = {
    step: 1,
    city: "",
    age: "",        // "1".."15" or "16+"
    district: "",
    exp: "",
    goal: "",
    parent_name: "",
    phone: ""
  };

  const AGE_OPTIONS = Array.from({ length: 13 }, (_, i) => String(i + 3)).concat(["16+"]);
  const DISTRICT_OPTIONS_NSK = [
    "Дзержинский","Железнодорожный","Заельцовский","Калининский","Кировский",
    "Ленинский","Октябрьский","Первомайский","Советский","Центральный"
  ];

  function getDistrictOptions(){
    const city = (state.city || "").trim();
    const map = window.SITE_DATA && window.SITE_DATA.districtsByCity;
    const list = (city && map && map[city]) ? map[city] : DISTRICT_OPTIONS_NSK;
    return (list || []).filter(Boolean);
  }

  const qs  = (sel, root=document) => root.querySelector(sel);
  const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (m)=> ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    })[m]);
  }

  function ageDisplay(v){
    if(!v) return "Выберите возраст";
    if(v === "16+") return "16+ лет";
    return `${v} лет`;
  }

  // RU phone mask: always starts with +7
  function digitsOnly(v){ return String(v || "").replace(/\D/g, ""); }

  function formatRuPhone(raw){
    let d = digitsOnly(raw);
    // normalize: if user pasted 8XXXXXXXXXX or 7XXXXXXXXXX -> keep last 10 digits
    if(d.startsWith("8")) d = "7" + d.slice(1);
    if(d.startsWith("7")) d = d.slice(1);
    d = d.slice(0, 10);

    let out = "+7";
    if(d.length === 0) return out;

    out += " (" + d.slice(0, Math.min(3, d.length));
    if(d.length >= 3) out += ")";
    if(d.length > 3) out += " " + d.slice(3, Math.min(6, d.length));
    if(d.length > 6) out += "-" + d.slice(6, Math.min(8, d.length));
    if(d.length > 8) out += "-" + d.slice(8, 10);
    return out;
  }

  function applyPhoneMask(el){
    if(!el) return;
    const formatted = formatRuPhone(el.value);
    el.value = formatted;
  }

  function isPhoneComplete(v){
    const d = digitsOnly(v);
    // with +7 mask we expect 11 digits total including country code 7
    // but we store without leading 7 in formatter; check 10 digits after +7:
    // digitsOnly("+7 (999) 111-22-33") => 79991112233 (11 digits)
    return d.length >= 11;
  }

  function setPickerValue(type, value){
    if(type === "age"){
      state.age = value || "";
      const inp = qs("#quizAge");
      const disp = qs("#quizAgeDisplay");
      if(inp) inp.value = state.age;
      if(disp) disp.textContent = ageDisplay(state.age);
    }
    if(type === "district"){
      state.district = value || "";
      const inp = qs("#quizDistrict");
      const disp = qs("#quizDistrictDisplay");
      if(inp) inp.value = state.district;
      if(disp) disp.textContent = state.district || "Выберите район";
    }
  }

  function openPicker(type, anchorEl){
  const sheet = qs("#quizPickerSheet");
  if(!sheet) return;

  const panel = sheet.querySelector(".quiz-picker-panel");
  const title = qs("#quizPickerTitle");
  const host  = qs("#quizPickerOptions");
  if(!panel || !title || !host) return;

  // Reset
  host.innerHTML = "";
  sheet.dataset.picker = type;

  // desktop grid helper classes
  sheet.classList.remove("is-age","is-district","is-desktop");
  const isDesktop = window.matchMedia("(min-width: 992px)").matches;
  if(isDesktop) sheet.classList.add("is-desktop");
  sheet.classList.add(type === "age" ? "is-age" : "is-district");

  const options = type === "age" ? AGE_OPTIONS : getDistrictOptions();
  title.textContent = type === "age" ? "Выберите возраст" : "Выберите район";

  options.forEach((val) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-picker-option";
    btn.textContent = val;
    btn.setAttribute("data-value", val);
    host.appendChild(btn);
  });

  // Show
  sheet.classList.remove("d-none");
  sheet.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => sheet.classList.add("is-open"));

  const modalBody = qs("#quizModal .modal-body");
  if(!modalBody) return;

  // Base styles (will be overridden by placement logic)
  panel.style.top = "0px";
  panel.style.left = "0px";
  panel.style.width = "";
  panel.style.maxHeight = "";
  panel.classList.remove("is-flip");

  const pad = 16;
  const gap = 8;

  // Desktop: show picker in the center of the viewport (may overflow quiz bounds — that's OK)
  if(isDesktop){
    // When sheet is fixed, coordinates are relative to the viewport
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;

    const padD = 20;
    const maxW = (type === "district") ? 760 : 600;
    const width = Math.min(maxW, vw - padD * 2);

    panel.style.width = width + "px";
    panel.style.left = Math.max(padD, (vw - width) / 2) + "px";
    panel.style.maxHeight = Math.max(340, Math.min(680, vh - padD * 2)) + "px";

    // center vertically after layout
    requestAnimationFrame(() => {
      const pr = panel.getBoundingClientRect();
      const top = Math.max(padD, Math.min((vh - pr.height) / 2, vh - pr.height - padD));
      panel.style.top = top + "px";
    });

    return;
  }
// Mobile: anchor to the trigger (and flip up if needed)
  if(anchorEl){
    const bodyRect = modalBody.getBoundingClientRect();
    const a = anchorEl.getBoundingClientRect();

    const padM = 12;

    const width = Math.min(a.width, bodyRect.width - padM * 2);
    panel.style.width = width + "px";

    const left = Math.min(bodyRect.width - width - padM, Math.max(padM, a.left - bodyRect.left));
    panel.style.left = left + "px";

    // Initial placement below the trigger (will flip if needed)
    panel.style.top = (a.bottom - bodyRect.top + gap) + "px";

    requestAnimationFrame(() => {
      const bodyRect2 = modalBody.getBoundingClientRect();
      const a2 = anchorEl.getBoundingClientRect();
      const pr = panel.getBoundingClientRect();

      const spaceBelow = (bodyRect2.bottom - a2.bottom) - padM - gap;
      const spaceAbove = (a2.top - bodyRect2.top) - padM - gap;

      const openDown = spaceBelow >= 260 || spaceBelow >= spaceAbove;

      if(openDown){
        panel.classList.remove("is-flip");
        panel.style.top = (a2.bottom - bodyRect2.top + gap) + "px";
        panel.style.maxHeight = Math.max(180, Math.min(520, spaceBelow)) + "px";
      } else {
        panel.classList.add("is-flip");
        const top = (a2.top - bodyRect2.top) - pr.height - gap;
        panel.style.top = Math.max(padM, top) + "px";
        panel.style.maxHeight = Math.max(180, Math.min(520, spaceAbove)) + "px";
      }
    });
  }
}


function closePicker(){
    const sheet = qs("#quizPickerSheet");
    if(!sheet) return;

    const panel = sheet.querySelector(".quiz-picker-panel");
    if(panel){
      panel.style.top = "";
      panel.style.left = "";
      panel.style.width = "";
      panel.style.maxHeight = "";
      panel.classList.remove("is-flip");
    }

    sheet.classList.remove("is-open");
    sheet.classList.add("d-none");
    sheet.setAttribute("aria-hidden","true");
    sheet.dataset.picker = "";
  }


  function showStep(n){
    const modalEl = qs("#quizModal");
    if(!modalEl) return;

    const steps = qsa(".quiz-step");
    steps.forEach(s => s.classList.toggle("d-none", Number(s.dataset.step) !== n));

    state.step = n;

    const stepEl = qs(".js-quiz-step");
    const totalEl = qs(".js-quiz-total");
    const progressEl = qs(".js-quiz-progress-fill");
    const total = 5;
    const shownStep = Math.min(n, total);

    if(stepEl) stepEl.textContent = shownStep;
    if(totalEl) totalEl.textContent = total;
    if(progressEl){
      const pct = Math.min(100, (shownStep / total) * 100);
      progressEl.style.width = pct + "%";
    }

    const prevBtn = qs("#quizPrevBtn");
    const nextBtn = qs("#quizNextBtn");

    if(prevBtn) prevBtn.disabled = (n === 1);
    if(nextBtn){
      if(n === 6){
        nextBtn.classList.add("d-none");
      } else {
        nextBtn.classList.remove("d-none");
        nextBtn.textContent = (n === 5) ? "Показать рекомендацию" : "Далее";
      }
    }

    modalEl.classList.toggle("quiz-is-result", n === 6);

    updateNextEnabled();

    if(n === 6){
      renderResult();
      updateSubmitEnabled();
    }
  }

  function updateFromInputs(){
    const prevCity = state.city;
    state.city = qs('input[name="quiz_city"]:checked')?.value || "";

    // If city changed (or cleared) — reset district selection
    if(prevCity !== state.city){
      setPickerValue("district", "");
    }

    const ageInp = qs("#quizAge");
    if(ageInp) state.age = ageInp.value || "";

    const distInp = qs("#quizDistrict");
    if(distInp) state.district = distInp.value || "";

    state.exp = qs('input[name="quiz_exp"]:checked')?.value || "";
    state.goal = qs('input[name="quiz_goal"]:checked')?.value || "";

    // Result step inputs
    const nm = qs("#quizParentName");
    if(nm) state.parent_name = (nm.value || "").trim();
    const ph = qs("#quizPhone");
    if(ph) state.phone = (ph.value || "").trim();

    syncDistrictPicker();
  }

  function syncDistrictPicker(){
    const btn = qs("#quizDistrictBtn");
    const input = qs("#quizDistrict");
    const val = qs("#quizDistrictVal");
    if(!btn || !input) return;

    const hasCity = !!state.city;
    btn.disabled = !hasCity;
    btn.classList.toggle("is-disabled", !hasCity);

    const label = btn.querySelector(".quiz-picker-label");
    if(!hasCity){
      input.value = "";
      if(val) val.textContent = "";
      if(label) label.textContent = "Сначала выберите город";
      return;
    }

    // Validate selected district against current city options
    const options = getDistrictOptions();
    if(input.value && !options.includes(input.value)){
      setPickerValue("district", "");
    }

    if(label && !input.value){
      label.textContent = "Выберите район";
    }
  }

  function isStepValid(n){
    updateFromInputs();
    if(n === 1) return !!state.city;
    if(n === 2) return !!state.age;
    if(n === 3) return !!state.district;
    if(n === 4) return !!state.exp;
    if(n === 5) return !!state.goal;
    return true;
  }

  function updateNextEnabled(){
    const nextBtn = qs("#quizNextBtn");
    if(!nextBtn) return;
    if(state.step === 6) return;
    nextBtn.disabled = !isStepValid(state.step);
  }


  function updateSubmitEnabled(){
    const btn = qs("#quizSubmitBtn");
    if(!btn) return;
    updateFromInputs();
    const okName = !!state.parent_name;
    const okPhone = isPhoneComplete(state.phone);
    btn.disabled = !(okName && okPhone);
  }
  function getAgeGroup(){
    const v = state.age;
    if(!v) return "";
    let n = 0;
    if(v === "16+") n = 16;
    else {
      n = parseInt(v, 10);
      if(!Number.isFinite(n)) n = 0;
    }
    if(n <= 5) return "3–5";
    if(n <= 8) return "6–8";
    if(n <= 11) return "9–11";
    if(n <= 14) return "12–14";
    return "15+";
  }

  function recommend(){
    const ageGroup = getAgeGroup();
    const exp = state.exp;
    const goal = state.goal;

    // Frequency by age group
    let freq = "2–3 раза в неделю";
    if(ageGroup === "3–5") freq = "2 раза в неделю";
    if(ageGroup === "6–8") freq = "2–3 раза в неделю";
    if(ageGroup === "9–11") freq = "3 раза в неделю";
    if(ageGroup === "12–14") freq = "3–4 раза в неделю";
    if(ageGroup === "15+") freq = "3–4 раза в неделю";

    // Format
    let formatKey = "team";
    let formatText = "Групповые тренировки";
    let extra = "Фокус: базовая техника + игровые ситуации.";

    const proGoal = (goal === "Играть профессионально");
    const tourGoal = (goal === "Играть на турнирах");
    const skillsGoal = (goal === "Улучшить навыки" || goal === "Научиться финтить");
    const funGoal = (goal === "Чтобы девчонки в обморок падали");
    const forSelf = (goal === "Для себя");

    if(proGoal){
      formatKey = "solo";
      formatText = "Индивидуально 1-на-1 + мини-группа";
      extra = "Рекомендуем: индивидуальные акценты + мини-группа для переноса навыка в игру.";
      if(ageGroup === "15+") freq = "4 раза в неделю (если цель — спортшкола/академия)";
    } else if(tourGoal){
      formatKey = "mini";
      formatText = "Мини-группа (техника) + игровые упражнения";
      extra = "Упор: скорость решений и качество действий под давление.";
    } else if(skillsGoal){
      formatKey = (exp === "Спортивная школа" || exp === "Коммерческий клуб") ? "mini" : "team";
      formatText = (formatKey === "mini") ? "Мини-группа (акцент на технику)" : "Групповые тренировки";
      extra = "Цель: уверенный контроль мяча, обыгрыш 1-на-1, первый пас и завершение.";
    } else if(funGoal){
      formatKey = "team";
      formatText = "Групповые тренировки (и да — финты тоже будут 😄)";
      extra = "Сначала — база и уверенность с мячом, затем — финты и игра 1-на-1.";
    } else if(forSelf){
      formatKey = "team";
      formatText = "Групповые тренировки";
      extra = "Комфортный прогресс: техника + игра + уверенность в 1-на-1.";
    } else {
      formatKey = "team";
      formatText = "Групповые тренировки";
      extra = "Структура + интенсивность + понятная обратная связь.";
    }

    // Add chess suggestion
    let chess = "";
    if(proGoal || tourGoal){
      chess = "Можно добавить «Шахматы + футбол» для развития концентрации и принятия решений.";
    }

    return { ageGroup, freq, formatKey, formatText, extra, chess };
  }

  function renderResult(){
    updateFromInputs();
    const sum = qs("#quizSummary");
    const recHost = qs("#quizRecommendation");
    const r = recommend();

    if(sum){
      const ageLine = (state.age === "16+") ? "16+ лет" : `${state.age} лет`;
      const rows = [
        `Город: <b>${state.city || "—"}</b>`,
        `Возраст: <b>${state.age ? ageLine : "—"}</b>`,
        `Район: <b>${state.district || "—"}</b>`,
        `Опыт: <b>${state.exp || "—"}</b>`,
        `Цель: <b>${state.goal || "—"}</b>`
      ];
      sum.innerHTML = rows.map(rw=>`
        <div class="d-flex gap-2 align-items-start mb-2">
          <i class="bi bi-check2-circle" style="color:var(--accent-3)"></i>
          <div>${rw}</div>
        </div>
      `).join("");
    }

    if(recHost){
      recHost.innerHTML = `
        <div class="fw-bold mb-1">${r.formatText}</div>
        <div class="muted small mb-2">Частота: <b>${r.freq}</b></div>
        <div class="muted">${r.extra}</div>
        ${r.chess ? `<div class="soft-line my-3"></div><div class="muted small"><i class="bi bi-grid-3x3-gap-fill me-1" style="color:var(--accent-3)"></i>${r.chess}</div>` : ""}
      `;
    }

    // Prefill +7 phone on mobile (and keep formatting)
    const ph = qs("#quizPhone");
    if(ph){
      if(!(ph.value || "").trim()) ph.value = "+7";
      applyPhoneMask(ph);
    }

    updateSubmitEnabled();

    // Store globally for sending / analytics
    window.SITE_QUIZ_RESULT = {
      age: state.age,
      ageGroup: r.ageGroup,
      district: state.district,
      exp: state.exp,
      goal: state.goal,
      recommendation: r
    };
  }

  async function postJSON(url, payload){
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
    if(!res.ok){
      const txt = await res.text().catch(()=> "");
      throw new Error(`HTTP ${res.status}: ${txt}`.slice(0, 300));
    }
    return res.json().catch(()=> ({}));
  }

  function buildLeadPayload(){
    updateFromInputs();
    const r = recommend();
    const ageLine = (state.age === "16+") ? "16+ лет" : `${state.age} лет`;

    const commentLines = [
      "Квиз (для тренера):",
      `— Возраст: ${ageLine} (группа: ${r.ageGroup})`,
      `— Район: ${state.district}`,
      `— Опыт: ${state.exp}`,
      `— Цель: ${state.goal}`,
      "",
      "Рекомендация (ориентир):",
      `— Формат: ${r.formatText}`,
      `— Частота: ${r.freq}`
    ];
    if(r.chess) commentLines.push(`— Доп.: ${r.chess}`);

    const payload = {
      parent_name: state.parent_name,
      phone: state.phone,
      child_age: ageLine,
      format: r.formatText,
      city: state.city,
      location_title: state.district,
      comment: commentLines.join("\n"),
      page: location.pathname.split("/").pop() || "index.html",
      timestamp: new Date().toISOString(),

      // extra fields (helpful for Telegram message formatting)
      quiz_age: state.age,
      quiz_age_group: r.ageGroup,
      quiz_district: state.district,
      quiz_exp: state.exp,
      quiz_goal: state.goal,
      quiz_recommendation_format: r.formatText,
      quiz_recommendation_freq: r.freq,
      quiz_recommendation_extra: r.extra
    };

    return payload;
  }

  
  function showSubmitError(msg){
    const err = qs("#quizSubmitError");
    if(err){
      err.textContent = msg;
      err.classList.add("is-show");
    }
  }

  function clearSubmitError(){
    const err = qs("#quizSubmitError");
    if(err){
      err.textContent = "";
      err.classList.remove("is-show");
    }
  }

  function setFieldError(inputEl, errEl, msg){
    if(inputEl) inputEl.classList.add("is-invalid");
    if(errEl){
      errEl.textContent = msg;
      errEl.classList.add("is-show");
    }
  }

  function clearFieldError(inputEl, errEl){
    if(inputEl) inputEl.classList.remove("is-invalid");
    if(errEl){
      errEl.textContent = "";
      errEl.classList.remove("is-show");
    }
  }

  function clearAllErrors(){
    clearSubmitError();
    clearFieldError(qs("#quizParentName"), qs("#quizParentNameError"));
    clearFieldError(qs("#quizPhone"), qs("#quizPhoneError"));
  }

  function scrollToField(el){
    if(!el) return;
    try{
      el.scrollIntoView({ behavior:"smooth", block:"center" });
    }catch(_){}
  }

async function submitLead(){
    const btn = qs("#quizSubmitBtn");
    if(!btn) return;

    updateFromInputs();
    clearAllErrors();

    const pn = qs("#quizParentName");
    const pnErr = qs("#quizParentNameError");
    const ph = qs("#quizPhone");
    const phErr = qs("#quizPhoneError");

    // Name required
    if(!state.parent_name){
      setFieldError(pn, pnErr, 'Введите имя.');
      scrollToField(pn);
      try{ pn && pn.focus({preventScroll:true}); }catch(_){ pn && pn.focus(); }
      return;
    }

    // Phone required
    if(!state.phone || state.phone.trim() === "+7"){
      setFieldError(ph, phErr, 'Введите телефон.');
      scrollToField(ph);
      try{ ph && ph.focus({preventScroll:true}); }catch(_){ ph && ph.focus(); }
      return;
    }

    if(!isPhoneComplete(state.phone)){
      setFieldError(ph, phErr, 'Введите телефон полностью (например: +7 (999) 111-22-33).');
      scrollToField(ph);
      try{ ph && ph.focus({preventScroll:true}); }catch(_){ ph && ph.focus(); }
      return;
    }

    const old = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Отправляем...';

    try{
      const payload = buildLeadPayload();
      const mode = (window.SITE_CONFIG && SITE_CONFIG.forms && SITE_CONFIG.forms.mode) ? SITE_CONFIG.forms.mode : "demo";
      const endpoint = (window.SITE_CONFIG && SITE_CONFIG.forms) ? SITE_CONFIG.forms.endpoint : "";

      if(mode === "webhook" || mode === "formspree"){
        if(!endpoint) throw new Error("No endpoint configured");
        await postJSON(endpoint, payload);
      }else{
        // demo: simulate latency
        await new Promise(r=>setTimeout(r, 650));
      }

      btn.innerHTML = '<i class="bi bi-check2-circle me-1"></i>Заявка отправлена';
      btn.classList.remove("btn-accent");
      btn.classList.add("btn-outline-accent");

      // auto-close
      setTimeout(()=>{
        const modalEl = qs("#quizModal");
        if(modalEl && window.bootstrap){
          const modal = bootstrap.Modal.getInstance(modalEl);
          if(modal) modal.hide();
        }
      }, 900);

    }catch(err){
      console.error(err);
      btn.disabled = false;
      btn.innerHTML = old;
      showSubmitError("Не удалось отправить. Проверь endpoint в config.js или попробуй позже.");
    }
  }

  function goNext(){
    if(!isStepValid(state.step)) return;
    if(state.step < 5) showStep(state.step + 1);
    else if(state.step === 5) showStep(6);
  }

  function goPrev(){
    if(state.step <= 1) return;
    showStep(state.step - 1);
  }

  function resetQuiz(){
    state.step = 1;
    state.city = "";
    state.age = "";
    state.district = "";
    state.exp = "";
    state.goal = "";
    state.parent_name = "";
    state.phone = "";

    // Clear city radio
    qsa('input[name="quiz_city"]').forEach(i => i.checked = false);

    setPickerValue("age", "");
    setPickerValue("district", "");
    syncDistrictPicker();

    qsa("input[name='quiz_exp']").forEach(i=>i.checked=false);
    qsa("input[name='quiz_goal']").forEach(i=>i.checked=false);

    const nameInp = qs("#quizParentName");
    const phoneInp = qs("#quizPhone");
    if(nameInp) nameInp.value = "";
    if(phoneInp) phoneInp.value = "";

    showStep(1);
  }

  function wire(){
    const modalEl = qs("#quizModal");
    if(!modalEl) return;

    modalEl.addEventListener("show.bs.modal", ()=> {
      resetQuiz();
    });

    // Lock background while quiz is open
    modalEl.addEventListener("shown.bs.modal", ()=>{
      document.body.classList.add("quiz-open");
      document.documentElement.classList.add("quiz-open");
    });
    modalEl.addEventListener("hidden.bs.modal", ()=>{
      document.body.classList.remove("quiz-open");
      document.documentElement.classList.remove("quiz-open");
    });

    // enable/disable next on change
    modalEl.addEventListener("change", ()=> { updateNextEnabled(); updateSubmitEnabled(); });
    // Phone mask (+7 ...) in the result step
    modalEl.addEventListener("focusin", (e)=>{
      const t = e.target;
      if(t && t.id === "quizPhone"){
        clearSubmitError();
        clearFieldError(qs("#quizPhone"), qs("#quizPhoneError"));
        clearFieldError(qs("#quizParentName"), qs("#quizParentNameError"));
        t.classList.remove("is-invalid");
        if(!(t.value || "").trim()) t.value = "+7";
        applyPhoneMask(t);
        // put caret to end
        try{ t.setSelectionRange(t.value.length, t.value.length); }catch(_){}
        updateSubmitEnabled();
      }
      if(t && t.id === "quizParentName"){
        clearSubmitError();
        clearFieldError(qs("#quizPhone"), qs("#quizPhoneError"));
        clearFieldError(qs("#quizParentName"), qs("#quizParentNameError"));
        t.classList.remove("is-invalid");
        updateSubmitEnabled();
      }
    });

    modalEl.addEventListener("input", (e)=>{
      const t = e.target;
      if(t && t.id === "quizPhone"){
        t.classList.remove("is-invalid");
        clearSubmitError();
        clearFieldError(qs("#quizPhone"), qs("#quizPhoneError"));
        clearFieldError(qs("#quizParentName"), qs("#quizParentNameError"));
        applyPhoneMask(t);
        // caret to end (simple, stable)
        try{ t.setSelectionRange(t.value.length, t.value.length); }catch(_){}
        updateSubmitEnabled();
      }
      if(t && t.id === "quizParentName"){
        t.classList.remove("is-invalid");
        clearSubmitError();
        clearFieldError(qs("#quizPhone"), qs("#quizPhoneError"));
        clearFieldError(qs("#quizParentName"), qs("#quizParentNameError"));
        updateSubmitEnabled();
      }
    });


    const nextBtn = qs("#quizNextBtn");
    const prevBtn = qs("#quizPrevBtn");
    if(nextBtn) nextBtn.addEventListener("click", goNext);
    if(prevBtn) prevBtn.addEventListener("click", goPrev);

    // picker triggers and interactions (event delegation)
    modalEl.addEventListener("click", (e)=>{
      const trigger = e.target.closest("[data-quiz-picker]");
      if(trigger){
        const type = trigger.getAttribute("data-quiz-picker");
        openPicker(type, trigger);
        return;
      }

      // click backdrop closes picker
      if(e.target && e.target.id === "quizPickerSheet"){
        closePicker();
        return;
      }

      const closeBtn = e.target.closest("#quizPickerClose");
      if(closeBtn){
        closePicker();
        return;
      }

      const opt = e.target.closest(".quiz-picker-option");
      if(opt){
        const sheet = qs("#quizPickerSheet");
        const type = (sheet && sheet.dataset.picker) ? sheet.dataset.picker : "";
        const value = opt.getAttribute("data-value") || "";
        if(type) setPickerValue(type, value);
        closePicker();
        updateNextEnabled();
        return;
      }

      const submitBtn = e.target.closest("#quizSubmitBtn");
      if(submitBtn){
        submitLead();
        return;
      }
    });

    modalEl.addEventListener("keydown", (e)=>{
      if(e.key === "Escape"){
        const sheet = qs("#quizPickerSheet");
        if(sheet && !sheet.classList.contains("d-none")){
          e.preventDefault();
          closePicker();
        }
      }
      if(e.key === "Enter"){
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
        if(tag === "input" || tag === "textarea") return;
        if(state.step !== 6){
          e.preventDefault();
          goNext();
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", wire);
})();