/**
 * Schedule page renderer (premium UI).
 * Reads: assets/data/schedule.flat.json (generated from Excel)
 */
(function(){
  const DAY_ORDER = ["mon","tue","wed","thu","fri","sat","sun"];
  const DAY_LABEL = {
    mon:{full:"Понедельник", short:"Пн."},
    tue:{full:"Вторник", short:"Вт."},
    wed:{full:"Среда", short:"Ср."},
    thu:{full:"Четверг", short:"Чт."},
    fri:{full:"Пятница", short:"Пт."},
    sat:{full:"Суббота", short:"Сб."},
    sun:{full:"Воскресенье", short:"Вс."}
  };

  const els = {
    weekGrid: document.getElementById("weekGrid"),
    daysAccordion: document.getElementById("daysAccordion"),
    foundCount: document.getElementById("foundCount"),
    chips: document.getElementById("activeChips"),
    reset: document.getElementById("resetFilters"),
    fCity: document.getElementById("fCity"),
    fDirection: document.getElementById("fDirection"),
    fDistrict: document.getElementById("fDistrict"),
    fBranch: document.getElementById("fBranch"),
    fAge: document.getElementById("fAge")
  };

  if(!els.weekGrid || !els.daysAccordion) return;

  let raw = [];
  let meta = null; // optional: assets/data/schedule.meta.json (cities/districts/branches)
  const state = {
    city: "",
    direction: "",
    district: "",
    branch: "",
    age: ""
  };

  function uniq(arr){
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function optAll(label="Все"){
    const o = document.createElement("option");
    o.value = "";
    o.textContent = label;
    return o;
  }

  function fillSelect(select, values, placeholder="Все"){
    if(!select) return;
    select.innerHTML = "";
    select.appendChild(optAll(placeholder));
    values.forEach(v=>{
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      select.appendChild(o);
    });
  }

  function setSelectValueIfExists(select, value){
    if(!select) return;
    const ok = Array.from(select.options).some(o=>o.value === value);
    select.value = ok ? value : "";
  }

  function getMetaCityList(){
    if(meta && meta.cities) return Object.keys(meta.cities);
    return [];
  }

  function getMetaDistricts(city){
    const c = meta?.cities?.[city];
    return Array.isArray(c?.districts) ? c.districts : [];
  }

  function getMetaBranches(city){
    const c = meta?.cities?.[city];
    return Array.isArray(c?.branches) ? c.branches : [];
  }

  function buildFilterOptions(){
    const prev = {
      city: els.fCity?.value || "",
      direction: els.fDirection?.value || "",
      district: els.fDistrict?.value || "",
      branch: els.fBranch?.value || "",
      age: els.fAge?.value || ""
    };

    // City options: prefer meta list (allows showing districts/branches even with no lessons yet)
    const cities = uniq([ ...getMetaCityList(), ...raw.map(x=>x.city) ]).sort();
    fillSelect(els.fCity, cities, "Выберите город");
    setSelectValueIfExists(els.fCity, prev.city);

    const city = els.fCity?.value || "";

    // Dependent filters are available only after choosing a city.
    const depSelects = [els.fDirection, els.fDistrict, els.fBranch, els.fAge];
    if(!city){
      depSelects.forEach(s=>{ if(s){ s.disabled = true; }});
      // Keep placeholders empty to avoid visual noise while disabled
      fillSelect(els.fDirection, [], "");
      fillSelect(els.fDistrict, [], "");
      fillSelect(els.fBranch, [], "");
      fillSelect(els.fAge, [], "");

      // Clear any previous values
      if(els.fDirection) els.fDirection.value = "";
      if(els.fDistrict) els.fDistrict.value = "";
      if(els.fBranch) els.fBranch.value = "";
      if(els.fAge) els.fAge.value = "";
      return;
    } else {
      depSelects.forEach(s=>{ if(s){ s.disabled = false; }});
    }

    const pool = city ? raw.filter(x=>x.city === city) : [];

    // Direction & age are derived from actual lessons for the selected city.
    fillSelect(els.fDirection, uniq(pool.map(x=>x.direction)).sort(), "Все");
    setSelectValueIfExists(els.fDirection, prev.direction);

    fillSelect(els.fAge, uniq(pool.map(x=>x.ageLabel)).sort(), "Любой возраст");
    setSelectValueIfExists(els.fAge, prev.age);

    // Districts: use meta for selected city (so you can keep a full list in filters)
    const districtValues = city
      ? uniq([ ...getMetaDistricts(city), ...pool.map(x=>x.district) ]).sort()
      : [];
    fillSelect(els.fDistrict, districtValues, "Все районы");
    setSelectValueIfExists(els.fDistrict, prev.district);

    // Branches: if meta exists — restrict by selected district.
    const district = els.fDistrict?.value || "";
    let branchValues = [];
    if(city){
      const mBranches = getMetaBranches(city);
      const listFromMeta = district
        ? mBranches.filter(b=>b.district === district).map(b=>b.name)
        : mBranches.map(b=>b.name);
      branchValues = uniq([ ...listFromMeta, ...pool.filter(x=> !district || x.district === district).map(x=>x.branch) ]).sort();
    } else {
      branchValues = [];
    }
    fillSelect(els.fBranch, branchValues, "Все филиалы");
    setSelectValueIfExists(els.fBranch, prev.branch);
  }

  function readState(){
    state.city = els.fCity?.value || "";
    state.direction = els.fDirection?.value || "";
    state.district = els.fDistrict?.value || "";
    state.branch = els.fBranch?.value || "";
    state.age = els.fAge?.value || "";
  }

  function buildChips(){
    if(!els.chips) return;
    const map = [
      ["city","Город"],
      ["direction","Направление"],
      ["district","Район"],
      ["branch","Филиал"],
      ["age","Возраст"]
    ];

    const frag = document.createDocumentFragment();
    map.forEach(([k,label])=>{
      const v = state[k];
      if(!v) return;
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = `<span class="muted small">${label}:</span> <span class="fw-bold">${escapeHtml(v)}</span>`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.innerHTML = `<i class="bi bi-x-lg"></i>`;
      btn.addEventListener("click", ()=>{
        // reset this field
        const el = els["f"+capitalize(k)];
        if(el){ el.value = ""; }
        apply();
      });
      chip.appendChild(btn);
      frag.appendChild(chip);
    });

    els.chips.innerHTML = "";
    els.chips.appendChild(frag);
  }

  function filterLessons(list){
    return list.filter(l=>{
      if(!state.city) return false;
      if(state.city && l.city !== state.city) return false;
      if(state.direction && l.direction !== state.direction) return false;
      if(state.district && l.district !== state.district) return false;
      if(state.branch && l.branch !== state.branch) return false;
      if(state.age && (l.ageLabel || "").trim() !== state.age) return false;
      return true;
    });
  }

  function groupByDayAndBranch(list){
    const out = {};
    DAY_ORDER.forEach(d=> out[d] = {});
    list.forEach(l=>{
      const d = l.day;
      if(!out[d]) out[d] = {};
      const b = l.branch || "Без филиала";
      if(!out[d][b]) out[d][b] = [];
      out[d][b].push(l);
    });
    // sort
    DAY_ORDER.forEach(d=>{
      Object.keys(out[d]).forEach(b=>{
        out[d][b].sort((a,b)=> (a.startTime||"").localeCompare(b.startTime||""));
      });
    });
    return out;
  }

  function renderDesktop(grouped){
    els.weekGrid.innerHTML = DAY_ORDER.map(d=>{
      const branches = grouped[d] || {};
      const allLessons = Object.values(branches).flat();
      const count = allLessons.length;

      const body = count ? Object.keys(branches).sort().map(branchName=>{
        const lessons = branches[branchName] || [];
        if(!lessons.length) return "";
        return `
          <div class="branch">
            <div class="branch-title">
              <span>${escapeHtml(branchName)}</span>
              <span class="count-badge">${lessons.length}</span>
            </div>
            ${lessons.map(renderLesson).join("")}
          </div>
        `;
      }).join("") : `
        <div class="empty-day fade-in">
          <div>
            <div class="title">${state.city ? "МЕСТ НЕТ" : "Выберите город"}</div>
            ${state.city ? `<div class="muted small mt-1">Попробуйте изменить фильтры</div>` : ``}
          </div>
        </div>
      `;

      const label = (grouped[d] && grouped[d]._label) ? grouped[d]._label : (DAY_LABEL[d]?.short || d);

      return `
        <div class="day-col">
          <div class="day-head">
            <div class="day-name">${DAY_LABEL[d]?.full || label}</div>
            <div class="count-badge">${count}</div>
          </div>
          <div>${body}</div>
        </div>
      `;
    }).join("");
  }

  function renderMobile(grouped){
    const html = DAY_ORDER.map((d, idx)=>{
      const branches = grouped[d] || {};
      const allLessons = Object.values(branches).flat();
      const count = allLessons.length;
      const collapseId = `dayCollapse_${d}`;
      const headingId = `dayHead_${d}`;

      let bodyHtml = "";
      if(!count){
        bodyHtml = `
          <div class="empty-day fade-in">
            <div class="title">${state.city ? "МЕСТ НЕТ" : "Выберите город"}</div>
            ${state.city ? `<div class="muted small mt-1">Попробуйте изменить фильтры</div>` : ``}
          </div>
        `;
      }else{
        bodyHtml = Object.keys(branches).sort().map(branchName=>{
          const lessons = branches[branchName] || [];
          if(!lessons.length) return "";
          return `
            <div class="branch">
              <div class="branch-title">
                <span>${escapeHtml(branchName)}</span>
                <span class="count-badge">${lessons.length}</span>
              </div>
              ${lessons.map(renderLesson).join("")}
            </div>
          `;
        }).join("");
      }

      return `
<div class="accordion-item" style="background: transparent; border: 1px solid rgba(190,255,220,.10); border-radius: 18px; overflow: hidden; margin-bottom: 10px;">
  <h2 class="accordion-header" id="${headingId}">
    <button class="accordion-button ${idx===0?'':'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${idx===0?'true':'false'}" aria-controls="${collapseId}"
      style="background: rgba(12,18,16,.38); color: var(--text-0);">
      <span class="fw-black">${DAY_LABEL[d]?.full}</span>
      <span class="ms-auto count-badge">${count}</span>
    </button>
  </h2>
  <div id="${collapseId}" class="accordion-collapse collapse ${idx===0?'show':''}" aria-labelledby="${headingId}" data-bs-parent="#daysAccordion">
    <div class="accordion-body" style="background: rgba(12,18,16,.30);">
      ${bodyHtml}
    </div>
  </div>
</div>
`;
    }).join("");

    els.daysAccordion.innerHTML = html;
  }

  function renderLesson(l){
    const time = `${l.startTime || ""}${l.endTime ? "–"+l.endTime : ""}`.trim() || "—";
    const dir = l.direction || "";
    const age = l.ageLabel || "";
    const note = (l.note || "").trim();
    const district = (l.district || "").trim();

    const pills = [
      dir ? `<span class="pill-mini">${escapeHtml(dir)}</span>` : "",
      age ? `<span class="pill-mini">${escapeHtml(age)}</span>` : ""
    ].filter(Boolean).join("");

    const noteParts = [district, note].filter(Boolean).join(" • ");

    return `
      <div class="lesson">
        <div class="lesson-time">${escapeHtml(time)}</div>
        <div>
          <div class="lesson-meta">${pills}</div>
          ${noteParts ? `<div class="lesson-note">${escapeHtml(noteParts)}</div>` : ``}
        </div>
      </div>
    `;
  }

  function apply(){
    readState();
    const filtered = filterLessons(raw);
    if(els.foundCount) els.foundCount.textContent = String(filtered.length);
    buildChips();
    const grouped = groupByDayAndBranch(filtered);
    renderDesktop(grouped);
    renderMobile(grouped);
  }

  function capitalize(s){ return s ? s[0].toUpperCase() + s.slice(1) : s; }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
  }

  function normalizeLesson(l){
    // Ensure day codes/labels exist even if JSON came from older file.
    const day = (l.day || "").toLowerCase();
    if(DAY_LABEL[day]){
      l.day = day;
      l.dayLabel = l.dayLabel || DAY_LABEL[day].full;
      l.dayShort = l.dayShort || DAY_LABEL[day].short;
    }
    l.ageLabel = (l.ageLabel || "").trim();
    return l;
  }

  async function load(){
    try{
      const [resFlat, resMeta] = await Promise.all([
        fetch("assets/data/schedule.flat.json", { cache: "no-store" }).catch(()=>null),
        fetch("assets/data/schedule.meta.json", { cache: "no-store" }).catch(()=>null)
      ]);

      if(resFlat && resFlat.ok){
        raw = (await resFlat.json()).map(normalizeLesson);
      } else {
        raw = [];
      }

      if(resMeta && resMeta.ok){
        meta = await resMeta.json();
      } else {
        meta = null;
      }
    }catch(e){
      raw = [];
      meta = null;
    }

    // Populate filter dropdowns (with meta support)
    buildFilterOptions();

    // Listen changes
    if(els.fCity){
      els.fCity.addEventListener("change", ()=>{
        // When city changes — district/branch options must update.
        if(els.fDistrict) els.fDistrict.value = "";
        if(els.fBranch) els.fBranch.value = "";
        buildFilterOptions();
        apply();
      });
    }

    if(els.fDistrict){
      els.fDistrict.addEventListener("change", ()=>{
        // When district changes — branch options must update.
        if(els.fBranch) els.fBranch.value = "";
        buildFilterOptions();
        apply();
      });
    }

    [els.fDirection, els.fBranch, els.fAge].forEach(el=>{
      if(!el) return;
      el.addEventListener("change", ()=>{
        // Direction/Age/Branch do not change lookup lists (except "branch" already set by district)
        apply();
      });
    });

    if(els.reset){
      els.reset.addEventListener("click", ()=>{
        [els.fCity, els.fDirection, els.fDistrict, els.fBranch, els.fAge].forEach(el=>{ if(el) el.value=""; });
        buildFilterOptions();
        apply();
      });
    }

    apply();
  }

  load();
})();
