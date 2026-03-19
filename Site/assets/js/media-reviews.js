/*
  Video Reviews slider (reviews.html)
  Data: assets/data/gallery.json → reviewVideoSlides: [ { type, src, caption, loop? } ]
*/
(function(){
  const stage = document.getElementById('reviewVideoStage');
  const cap = document.getElementById('reviewVideoCaption');
  const prevBtn = document.getElementById('reviewVideoPrev');
  const nextBtn = document.getElementById('reviewVideoNext');
  if(!stage || !prevBtn || !nextBtn) return;

  const state = { i: 0, slides: [] };

  function esc(s){
    return String(s||"").replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  function extractIframeSrc(input){
    const s = String(input||"");
    if(!/<iframe/i.test(s)) return s;
    const m = s.match(/src\s*=\s*['"]([^'"]+)['"]/i);
    return m ? m[1] : s;
  }

  function sanitizeEmbedSrc(src, opts){
    const raw = extractIframeSrc(src);
    const s = String(raw||"");
    const o = opts || {};
    try{
      const u = new URL(s, window.location.href);
      u.searchParams.set('autoplay','0');
      if(/youtube\.com\/embed/i.test(u.href)){
        u.searchParams.set('rel','0');
        u.searchParams.set('playsinline','1');
      }
      if(/vk\.com/i.test(u.hostname) && /video_ext\.php/i.test(u.pathname)){
        u.searchParams.set('js_api','1');
        u.searchParams.set('loop', (o.loop === true) ? '1' : '0');
      }
      return u.toString();
    }catch(e){
      return s.replace(/([?&])autoplay=1(&|$)/i, "$1autoplay=0$2");
    }
  }

  function clampIndex(i, len){
    if(!len) return 0;
    const m = ((i % len) + len) % len;
    return m;
  }

  function emptyHtml(){
    return `
      <div class="empty-day fade-in" style="min-height: 260px;">
        <div>
          <div class="title">СКОРО</div>
          <div class="muted small mt-1">Добавьте видео в assets/data/gallery.json → reviewVideoSlides</div>
        </div>
      </div>
    `;
  }

  function render(){
    const items = state.slides || [];
    const len = items.length;
    state.i = clampIndex(state.i, len);
    const it = items[state.i] || null;

    if(!it){
      stage.innerHTML = emptyHtml();
      if(cap){ cap.textContent = ""; cap.style.display = "none"; }
      return;
    }

    const allow = it.allow ? it.allow : (it.type === 'vk'
      ? 'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;'
      : 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

    if(it.type === 'mp4'){
      stage.innerHTML = `
        <div class="media-stage fade-in">
          <video class="media-video" controls playsinline preload="metadata">
            <source src="${esc(it.src)}" type="video/mp4"/>
          </video>
        </div>
      `;
    }else{
      stage.innerHTML = `
        <div class="media-stage fade-in">
          <iframe src="${esc(sanitizeEmbedSrc(it.src, { loop: it.loop }))}" title="${esc(it.caption || 'Видео отзыв')}" allow="${esc(allow)}" frameborder="0" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
      `;

      // VK: stop slightly before the end to avoid end-screen recommendations
      const iframe = stage.querySelector('iframe');
      if(iframe && window.VK_EMBED_HELPER){
        window.VK_EMBED_HELPER.bindStopBeforeEnd(iframe);
      }
    }

    if(cap){
      cap.textContent = it?.caption ? String(it.caption) : "";
      cap.style.display = it?.caption ? "block" : "none";
    }
  }

  function next(){ state.i += 1; render(); }
  function prev(){ state.i -= 1; render(); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Optional swipe support (mobile)
  let x0 = null;
  stage.addEventListener('touchstart', (e)=>{ x0 = e.touches?.[0]?.clientX ?? null; }, { passive: true });
  stage.addEventListener('touchend', (e)=>{
    if(x0 === null) return;
    const x1 = e.changedTouches?.[0]?.clientX ?? null;
    if(x1 === null) return;
    const dx = x1 - x0;
    if(Math.abs(dx) > 42){ dx < 0 ? next() : prev(); }
    x0 = null;
  }, { passive: true });

  fetch('assets/data/gallery.json', { cache: 'no-store' })
    .then(r=>r.json())
    .then(data=>{
      state.slides = data.reviewVideoSlides || [];
      render();
    })
    .catch(()=>{
      state.slides = [];
      render();
    });
})();
