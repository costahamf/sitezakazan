(function(){
  function escapeHtml(str){
    return String(str||"").replace(/[&<>"']/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]));
  }

  function renderReviews(){
    const inner = document.getElementById("reviewsInner");
    if(!inner) return;

    const hint = document.getElementById("reviewsHint");

    // Mobile (<992px): 1 отзыв на слайд (компактно)
    // Desktop: 3 отзыва на слайд
    // NB: используем реальную ширину viewport (на мобильных matchMedia иногда даёт неверный результат при загрузке)
    const vw = Math.min(
      window.innerWidth || 0,
      document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : Infinity
    ) || (window.innerWidth || (document.documentElement ? document.documentElement.clientWidth : 0) || 0);
    const perSlide = (vw < 992) ? 1 : 3;
    const colClass = (perSlide === 1) ? "col-12" : "col-12 col-md-6 col-lg-4";
    if(hint){
      hint.textContent = perSlide === 1 ? "Листайте — по одному отзыву" : "Листайте — по 3 отзыва";
    }

    const items = SITE_DATA.reviews || [];
    const chunk = (arr, n) => Array.from({length: Math.ceil(arr.length/n)}, (_,i)=> arr.slice(i*n, i*n+n));
    const slides = chunk(items, perSlide);

    inner.innerHTML = slides.map((slide, idx)=>`
      <div class="carousel-item ${idx===0?'active':''}">
        <div class="row g-3">
          ${slide.map(r=>{
            const name = encodeURIComponent(r.name || "");
            const meta = encodeURIComponent(r.meta || "");
            const text = encodeURIComponent(r.text || "");
            return `
            <div class="${colClass}">
              <button type="button" class="card-dark p-4 h-100 review-btn text-start w-100"
                data-name="${name}" data-meta="${meta}" data-text="${text}">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="brand-badge" style="width:44px;height:44px;border-radius:16px;">
                    <i class="bi bi-person-fill"></i>
                  </div>
                  <div>
                    <div class="fw-bold">${escapeHtml(r.name)}</div>
                    <div class="muted small">${escapeHtml(r.meta)}</div>
                  </div>
                </div>
                <div class="muted" style="font-size:1.02rem;">“${escapeHtml(r.text)}”</div>
                <div class="muted small mt-3"><i class="bi bi-arrows-angle-expand me-1"></i>Открыть полностью</div>
              </button>
            </div>
            `;
          }).join("")}
        </div>
      </div>
    `).join("");

    // Click-to-open modal (event delegation)
    if(inner.dataset.bound) return;
    inner.dataset.bound = "1";
    inner.addEventListener("click", (e)=>{
      const btn = e.target.closest(".review-btn");
      if(!btn) return;

      const name = decodeURIComponent(btn.getAttribute("data-name") || "");
      const meta = decodeURIComponent(btn.getAttribute("data-meta") || "");
      const text = decodeURIComponent(btn.getAttribute("data-text") || "");

      const elName = document.getElementById("reviewModalName");
      const elMeta = document.getElementById("reviewModalMeta");
      const elText = document.getElementById("reviewModalText");
      if(elName) elName.textContent = name;
      if(elMeta) elMeta.textContent = meta;
      if(elText) elText.textContent = text;

      const modalEl = document.getElementById("reviewModal");
      if(modalEl && window.bootstrap){
        const m = bootstrap.Modal.getOrCreateInstance(modalEl);
        m.show();
      }
    });
  }


  function renderTrajectories(){
    const list = (SITE_DATA.result && SITE_DATA.result.trajectories) ? SITE_DATA.result.trajectories : [];
    const scroller = document.getElementById("trajDesktopScroller");
    const inner = document.getElementById("trajCarouselInner");

    const cardHTML = (t)=>`
      <div class="card-dark p-0 h-100 profile-card">
        <div class="profile-media">
          <img src="${t.photo || 'assets/img/graduates/grad-1.svg'}" alt="${escapeHtml(t.name)}">
        </div>
        <div class="p-3">
          <div class="fw-bold">${escapeHtml(t.name)}</div>
          <div class="muted small">${escapeHtml(t.note)}</div>
        </div>
      </div>
    `;

    if(scroller){
      scroller.innerHTML = list.map(t=>`
        <div class="snap-item">${cardHTML(t)}</div>
      `).join("");
    }

    if(inner){
      inner.innerHTML = list.map((t,i)=>`
        <div class="carousel-item ${i===0?'active':''}">
          ${cardHTML(t)}
        </div>
      `).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    renderReviews();
    renderTrajectories();

    // If the viewport mode changes (rotate / resize), rebuild slides so mobile stays "1 per page".
    let lastIsMobile = (Math.min(window.innerWidth || 0, document.documentElement?.clientWidth || Infinity) || window.innerWidth || 0) < 992;
    window.addEventListener("resize", ()=>{
      const isMobile = (Math.min(window.innerWidth || 0, document.documentElement?.clientWidth || Infinity) || window.innerWidth || 0) < 992;
      if(isMobile !== lastIsMobile){
        lastIsMobile = isMobile;
        renderReviews();
      }
    }, { passive:true });

    // Some mobile browsers finalize viewport sizes a moment after DOMContentLoaded.
    setTimeout(()=> renderReviews(), 120);
  });
})();
