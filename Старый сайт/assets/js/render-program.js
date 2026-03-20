(function(){
  function list(items){
    return items.map(x=>`
      <div class="d-flex gap-2 align-items-start mb-2">
        <i class="bi bi-check2-circle" style="color:var(--accent-3)"></i>
        <div>${x}</div>
      </div>
    `).join("");
  }

  function render(){
    const tech = document.getElementById("progTech");
    const mind = document.getElementById("progMind");
    const phys = document.getElementById("progPhys");
    const fb = document.getElementById("progFb");

    if(tech) tech.innerHTML = list(SITE_DATA.program.tech);
    if(mind) mind.innerHTML = list(SITE_DATA.program.mind);
    if(phys) phys.innerHTML = list(SITE_DATA.program.phys);
    if(fb) fb.innerHTML = list(SITE_DATA.program.feedback);

    const phil = document.getElementById("philosophyCards");
    if(phil){
      phil.innerHTML = SITE_DATA.philosophy.map(p=>`
        <div class="col-md-4">
          <div class="glass p-3 h-100">
            <div class="d-flex gap-3">
              <div class="brand-badge" style="width:46px;height:46px;border-radius:18px;">
                <i class="bi ${p.icon}"></i>
              </div>
              <div>
                <div class="fw-bold">${p.title}</div>
                <div class="muted small">${p.text}</div>
              </div>
            </div>
          </div>
        </div>
      `).join("");
    }

    const chess = document.getElementById("chessBlock");
    if(chess){
      chess.innerHTML = `
        <div class="card-dark p-4">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h2 class="section-title mb-0">${SITE_DATA.chess.title}</h2>
              <div class="section-sub">${SITE_DATA.chess.lead}</div>
            </div>
            <div class="brand-badge" style="width:54px;height:54px;border-radius:20px;">
              <i class="bi bi-grid-3x3-gap-fill" style="font-size:1.25rem"></i>
            </div>
          </div>
          <div class="soft-line my-3"></div>
          <div class="row g-2">
            ${SITE_DATA.chess.bullets.map(b=>`
              <div class="col-md-6">
                <div class="glass p-3 h-100">
                  <i class="bi bi-check2-circle me-1" style="color:var(--accent-3)"></i>${b}
                </div>
              </div>
            `).join("")}
          </div>
          <div class="soft-line my-3"></div>
          <div class="muted">${SITE_DATA.chess.note}</div>
          <div class="mt-3 d-grid d-md-flex gap-2">
            <button class="btn btn-accent px-4 py-2" data-bs-toggle="modal" data-bs-target="#signupModal">Записаться</button>
            <a class="btn btn-outline-accent px-4 py-2" href="locations.html">Выбрать локацию</a>
          </div>
        </div>
      `;
    }

    // Coaches carousel on program.html (reuse data from the main page)
    const coaches = SITE_DATA?.coaches?.team || [];
    const desktopScroller = document.getElementById("programCoachesDesktopScroller");
    const mobileInner = document.getElementById("programCoachesCarouselInner");

    const cardHTML = (c)=>`
      <div class="card-dark p-3 h-100" style="min-height: 320px;">
        <div class="card-image mb-3" style="aspect-ratio: 4/3;">
          <img src="${c.photo}" alt="${c.name}" loading="lazy" />
        </div>
        <div class="fw-bold">${c.name}</div>
        <div class="muted small">${c.edu}</div>
      </div>
    `;

    if(desktopScroller){
      desktopScroller.innerHTML = coaches.map(c=>`
        <div class="snap-item">${cardHTML(c)}</div>
      `).join("");
    }

    if(mobileInner){
      mobileInner.innerHTML = coaches.map((c,i)=>`
        <div class="carousel-item ${i===0?"active":""}">
          ${cardHTML(c)}
        </div>
      `).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();
