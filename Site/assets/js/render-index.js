(function(){
  const iconCheck = `<i class="bi bi-check2-circle" style="color:var(--brand-yellow, #f2c400)"></i>`;

  function itemRow(html){
    return `<div class="d-flex gap-2 align-items-start mb-2">${html}</div>`;
  }

  function renderList(host, items){
    if(!host) return;
    host.innerHTML = items.map(s => itemRow(`${iconCheck}<div>${s}</div>`)).join("");
  }

  function renderHero(){
    const h = SITE_DATA.hero;
    const title = document.getElementById("heroTitle");
    const hl = document.getElementById("heroHighlight");
    const sub = document.getElementById("heroSubhead");
    const age = document.getElementById("heroAge");
    const kpiHost = document.getElementById("heroKpis");

    if(title) title.textContent = h.headline;
    if(hl) hl.textContent = h.highlight;
    if(sub) sub.textContent = h.subhead;
    if(age) age.textContent = h.age;

    const cityEl = document.getElementById("heroCity");
    if(cityEl) cityEl.textContent = SITE_CONFIG.contacts.city;

    if(kpiHost){
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 991.98px)').matches;
      const byId = Object.fromEntries((h.kpis || []).map(k => [k.id, k]));
      const kpis = isMobile
        ? [byId.years, byId.transfers].filter(Boolean)
        : (h.kpis || []);

      kpiHost.innerHTML = kpis.map((k)=>{
        const textMode = typeof k.text === 'string' && k.text.trim().length > 0;
        if(textMode){
          return `
        <div class="col-6 col-md-4">
          <div class="stat">
            <div class="num"><span class="count-text" data-target-text="${k.text.replace(/"/g,'&quot;')}">${k.text}</span></div>
            <div class="cap">${k.label || '&nbsp;'}</div>
          </div>
        </div>
      `;
        }
        return `
        <div class="col-6 col-md-4">
          <div class="stat">
            <div class="num"><span class="count" data-target="${k.value}">0</span>${k.suffix || ""}</div>
            <div class="cap">${k.label}</div>
          </div>
        </div>
      `;
      }).join("");
    }
  }

  function renderPricing(){
    const host = document.getElementById("pricingCards");
    if(!host) return;

    host.innerHTML = SITE_DATA.pricing.map(p=>`
      <div class="col-lg-4">
        <div class="card-dark p-4 h-100 ${p.popular ? "card-popular" : ""}">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <div>
              <div class="fw-bold fs-5">${p.title}</div>
              <div class="muted">${p.subtitle}</div>
            </div>
            ${p.popular ? `<span class="badge rounded-pill badge-popular">Топ</span>` : ""}
          </div>
          <div class="soft-line my-3"></div>
          <div class="fw-black" style="font-weight:950; font-size:2rem; letter-spacing:-.7px;">
            ${p.price ? `${new Intl.NumberFormat("ru-RU").format(p.price)} ₽` : "—"}
            <span class="fs-6 fw-bold muted">${p.unit}</span>
          </div>
          <div class="muted mt-2">${p.desc}</div>

          <div class="mt-3">
            <button class="btn btn-accent w-100" data-bs-toggle="modal" data-bs-target="#signupModal">
              Записаться
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderScheduleLocations(){
    const sch = document.getElementById("scheduleText");
    if(sch) sch.textContent = SITE_DATA.schedule.summary;

    const loc = document.getElementById("locationsMini");
    if(loc){
      loc.innerHTML = SITE_DATA.locations.map(l=>{
        return itemRow(`<i class="bi bi-geo-alt-fill" style="color:var(--accent-3)"></i><div>${l.title}</div>`);
      }).join("");
    }
  }

  function renderResult(){
    renderList(document.getElementById("resultStats"), SITE_DATA.result.stats);
  }

  function renderGraduates(){
    const list = (SITE_DATA.result && SITE_DATA.result.trajectories) ? SITE_DATA.result.trajectories : [];
    const scroller = document.getElementById("graduatesDesktopScroller");
    const inner = document.getElementById("graduatesCarouselInner");

    const cardHTML = (t)=>`
      <div class="card-dark p-0 h-100 profile-card">
        <div class="profile-media">
          <img src="${t.photo || "assets/img/graduates/grad-1.svg"}" alt="${t.name}">
        </div>
        <div class="p-3">
          <div class="fw-bold">${t.name}</div>
          <div class="muted small">${t.note}</div>
        </div>
      </div>
    `;

    if(scroller){
      scroller.innerHTML = list.map(t=>`
        <div class="snap-item">
          ${cardHTML(t)}
        </div>
      `).join("");
    }

    if(inner){
      inner.innerHTML = list.map((t,i)=>`
        <div class="carousel-item ${i===0?"active":""}">
          ${cardHTML(t)}
        </div>
      `).join("");
    }
  }

  function renderCoaches(){
    const bullets = (SITE_DATA.coaches && SITE_DATA.coaches.bullets) ? SITE_DATA.coaches.bullets : [];
    renderList(document.getElementById("coachBullets"), bullets);

    const team = (SITE_DATA.coaches && SITE_DATA.coaches.team) ? SITE_DATA.coaches.team : [];
    const scroller = document.getElementById("coachesDesktopScroller");
    const inner = document.getElementById("coachesCarouselInner");

    const cardHTML = (c)=>`
      <div class="card-dark p-0 h-100 profile-card">
        <div class="profile-media">
          <img src="${c.photo || "assets/img/coaches/coach-1.svg"}" alt="${c.name}">
        </div>
        <div class="p-3">
          <div class="fw-bold">${c.name}</div>
          <div class="muted small">${c.education || ""}</div>
        </div>
      </div>
    `;

    if(scroller){
      scroller.innerHTML = team.map(c=>`
        <div class="snap-item">
          ${cardHTML(c)}
        </div>
      `).join("");
    }

    if(inner){
      inner.innerHTML = team.map((c,i)=>`
        <div class="carousel-item ${i===0?"active":""}">
          ${cardHTML(c)}
        </div>
      `).join("");
    }
  }

  function renderReviewsHome(){
    const inner = document.getElementById("reviewsHomeInner");
    if(!inner) return;
    const reviews = SITE_DATA.reviews || [];
    inner.innerHTML = reviews.map((r,i)=>`
      <div class="carousel-item ${i===0?"active":""}">
        <div class="glass p-3">
          <div class="d-flex align-items-start justify-content-between gap-2">
            <div>
              <div class="fw-bold">${r.name || "Родители"}</div>
              <div class="muted small">${r.meta || ""}</div>
            </div>
            <i class="bi bi-chat-left-quote-fill" style="color:var(--accent-3)"></i>
          </div>
          <div class="soft-line my-3"></div>
          <div class="muted">${r.text}</div>
        </div>
      </div>
    `).join("");
  }

  function renderPhilosophy(){
    const host = document.getElementById("philosophyCardsHome");
    if(!host) return;
    const items = SITE_DATA.philosophy || [];
    host.innerHTML = items.map(i=>`
      <div class="col-lg-4">
        <div class="card-dark p-4 h-100">
          <div class="d-flex gap-3 align-items-start">
            <div class="feature-icon"><i class="bi ${i.icon}"></i></div>
            <div>
              <div class="fw-bold fs-5">${i.title}</div>
              <div class="muted">${i.text}</div>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderProgram(){
    const p = SITE_DATA.program || {};
    renderList(document.getElementById("progTech"), p.tech || []);
    renderList(document.getElementById("progMind"), p.mind || []);
    renderList(document.getElementById("progPhys"), p.phys || []);
    renderList(document.getElementById("progFb"), p.feedback || []);
  }

  function renderChess(){
    const host = document.getElementById("chessBlockHome");
    if(!host) return;
    const c = SITE_DATA.chess;
    if(!c) return;

    host.innerHTML = `
      <div class="card-dark p-4 p-lg-5 chess-panel">
        <div class="row g-4 align-items-start">
          <div class="col-lg-6">
            <h3 class="fw-black mb-2" style="font-weight:950;">${c.title || "Шахматы + футбол"}</h3>
            <div class="muted mb-3">${c.lead || ""}</div>
            <div class="glass p-3 chess-note-box chess-note-box--decor">
              <span class="chess-bullet-decor chess-bullet-decor--note" aria-hidden="true"></span>
              <div class="muted small">${c.note || ""}</div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="row g-3">
              ${(c.bullets||[]).map((s, idx)=>`
                <div class="col-sm-6">
                  <div class="chess-bullet-card chess-bullet-card--${idx + 1} h-100">
                    <span class="chess-bullet-decor" aria-hidden="true"></span>
                    <span class="chess-bullet-icon">♟</span>
                    <div>${s}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    renderHero();
    renderPricing();
    renderScheduleLocations();
    renderResult();
    renderGraduates();
    renderCoaches();
    renderReviewsHome();
    renderPhilosophy();
    renderProgram();
    renderChess();

    let heroResizeTimer = null;
    window.addEventListener("resize", ()=>{
      clearTimeout(heroResizeTimer);
      heroResizeTimer = setTimeout(renderHero, 120);
    }, { passive:true });
  });
})();
