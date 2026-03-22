/**
 * Media cards: PHOTO + VIDEO with simple arrows slider.
 * Data: assets/data/gallery.json  (photoSlides[], videoSlides[])
 */
(function(){
  const photoStage = document.getElementById("mediaPhotoStage");
  const videoStage = document.getElementById("mediaVideoStage");
  const testingStage = document.getElementById("testingStage");

  // Optional captions (kept OUTSIDE the media-frame so arrows stay centered)
  const photoCapEl = document.getElementById("mediaPhotoCaption");
  const videoCapEl = document.getElementById("mediaVideoCaption");
  const testingCapEl = document.getElementById("testingCaption");

  // Modules can exist on different pages. If none exist — nothing to do.
  if(!photoStage && !videoStage && !testingStage) return;

  const state = { p:0, v:0, t:0, data:null, _applyTestingAspect:null, _testingResizeBound:false, _lightbox:null };

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

      // Always disable autoplay by default (prevents autoplay on scroll/load)
      u.searchParams.set("autoplay","0");

      // YouTube: reduce related videos where possible
      if(/youtube\.com\/embed/i.test(u.href)) {
        u.searchParams.set("rel","0");
        u.searchParams.set("playsinline","1");
      }

      // VK: enable JS API + disable autoplay/loop by default.
      // We will stop playback slightly before the end via VK.VideoPlayer
      // to prevent VK “recommended video” end screens (see assets/js/vk-embed.js).
      if(/vk\.com/i.test(u.hostname) && /video_ext\.php/i.test(u.pathname)){
        u.searchParams.set("js_api","1");
        u.searchParams.set("loop", (o.loop === true) ? "1" : "0");
      }

      return u.toString();
    }catch(e){
      // Fallback: at least remove autoplay=1
      return s.replace(/([?&])autoplay=1(&|$)/i, "$1autoplay=0$2");
    }
  }

function clampIndex(i, len){
    if(!len) return 0;
    return (i%len + len)%len;
  }

  function renderPhoto(){
    if(!photoStage) return;
    const items = state.data?.photoSlides || [];
    const len = items.length;
    state.p = clampIndex(state.p, len);
    const it = items[state.p] || null;

    photoStage.innerHTML = it ? `
      <div class="media-stage media-stage--photo fade-in">
        <img class="media-img" src="${esc(it.src)}" alt="${esc(it.caption || "Фото")}" loading="lazy" />
      </div>
    ` : emptyHtml();

    if(photoCapEl){
      photoCapEl.textContent = it?.caption ? String(it.caption) : "";
      photoCapEl.style.display = it?.caption ? "block" : "none";
    }
  }

  function renderVideo(){
    if(!videoStage) return;
    const items = state.data?.videoSlides || [];
    const len = items.length;
    state.v = clampIndex(state.v, len);
    const it = items[state.v] || null;

    if(!it){
      videoStage.innerHTML = emptyHtml();
      if(videoCapEl){ videoCapEl.textContent = ""; videoCapEl.style.display = "none"; }
      return;
    }

    // Allow list
    const allow = it.allow ? it.allow : (it.type === 'vk'
      ? 'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;'
      : 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

    if(it.type === "mp4"){
      videoStage.innerHTML = `
        <div class="media-stage media-stage--video fade-in">
          <video class="media-video" controls playsinline preload="metadata">
            <source src="${esc(it.src)}" type="video/mp4"/>
          </video>
        </div>
      `;
    }else{
      videoStage.innerHTML = `
        <div class="media-stage media-stage--video fade-in">
          <iframe src="${esc(sanitizeEmbedSrc(it.src, { loop: it.loop }))}" title="${esc(it.caption || 'Видео')}" allow="${esc(allow)}" frameborder="0" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
      `;

      // VK: stop slightly before the end to avoid end-screen recommendations
      const iframe = videoStage.querySelector('iframe');
      if(iframe && window.VK_EMBED_HELPER){
        window.VK_EMBED_HELPER.bindStopBeforeEnd(iframe);
      }
    }

    if(videoCapEl){
      videoCapEl.textContent = it?.caption ? String(it.caption) : "";
      videoCapEl.style.display = it?.caption ? "block" : "none";
    }
  }



  function openTestingLightbox(src, alt){
    if(!src) return;
    closeTestingLightbox();
    const box = document.createElement('div');
    box.className = 'testing-lightbox';
    box.innerHTML = `
      <button type="button" class="testing-lightbox-close" aria-label="Закрыть">×</button>
      <img src="${esc(src)}" alt="${esc(alt || 'Карточка тестирования')}" />
    `;
    document.body.appendChild(box);
    state._lightbox = box;
    box.addEventListener('click', (e)=>{
      if(e.target === box || (e.target instanceof HTMLElement && e.target.classList.contains('testing-lightbox-close'))){
        closeTestingLightbox();
      }
    });
    document.addEventListener('keydown', onEscClose);
  }

  function onEscClose(e){
    if(e.key === 'Escape') closeTestingLightbox();
  }

  function closeTestingLightbox(){
    if(!state._lightbox) return;
    state._lightbox.remove();
    state._lightbox = null;
    document.removeEventListener('keydown', onEscClose);
  }

  function renderTesting(){
    if(!testingStage) return;
    const items = state.data?.testingSlides || [];
    const len = items.length;
    state.t = clampIndex(state.t, len);
    const it = items[state.t] || null;

    testingStage.innerHTML = it ? `
      <div class="media-stage fade-in" id="testingStageInner">
        <img class="media-img" src="${esc(it.src)}" alt="${esc(it.caption || "Карточка тестирования")}" loading="lazy" />
      </div>
    ` : emptyHtml();

    // Make the stage match the actual image aspect.
    // This avoids big empty gaps ("letterboxing") while still keeping `object-fit: contain`.
    // On mobile we clamp the ratio so the card doesn't become too tall.
    const stage = testingStage.querySelector('.media-stage');
    const img = stage?.querySelector('img');
    if(img){
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', ()=> openTestingLightbox(img.getAttribute('src'), img.getAttribute('alt')));
    }
    if(stage && img){
      const applyAspect = ()=>{
        const w = img.naturalWidth || 16;
        const h = img.naturalHeight || 9;
        const r = w / h;

        // Desktop can accept a wider range because the block is spacious.
        // Mobile should avoid getting too tall, but we still want the image to sit tight
        // in the rounded frame (no big empty gaps).
        const isDesktop = window.matchMedia && window.matchMedia('(min-width: 992px)').matches;
        const minR = isDesktop ? 1.3 : 1.2;
        const maxR = 2.2;

        if(r >= minR && r <= maxR){
          stage.style.aspectRatio = `${w} / ${h}`;
        }else{
          stage.style.aspectRatio = '16 / 9';
        }
      };
      if(img.complete) applyAspect();
      else img.addEventListener('load', applyAspect, { once:true });
      state._applyTestingAspect = applyAspect;
      if(!state._testingResizeBound){
        state._testingResizeBound = true;
        window.addEventListener('resize', ()=>{
          // Re-apply when crossing breakpoints
          try{ state._applyTestingAspect && state._applyTestingAspect(); }catch(e){}
        }, { passive:true });
      }
    }

    if(testingCapEl){
      testingCapEl.textContent = it?.caption ? String(it.caption) : "";
      testingCapEl.style.display = it?.caption ? "block" : "none";
    }
  }

  function emptyHtml(){
    return `
      <div class="empty-day fade-in" style="min-height: 260px;">
        <div>
          <div class="title">СКОРО</div>
          <div class="muted small mt-1">Добавьте ссылки в assets/data/gallery.json</div>
        </div>
      </div>
    `;
  }

  function bind(){
    document.getElementById("photoPrev")?.addEventListener("click", ()=>{ state.p--; renderPhoto(); });
    document.getElementById("photoNext")?.addEventListener("click", ()=>{ state.p++; renderPhoto(); });
    document.getElementById("videoPrev")?.addEventListener("click", ()=>{ state.v--; renderVideo(); });
    document.getElementById("videoNext")?.addEventListener("click", ()=>{ state.v++; renderVideo(); });
    document.getElementById("testingPrev")?.addEventListener("click", ()=>{ state.t--; renderTesting(); });
    document.getElementById("testingNext")?.addEventListener("click", ()=>{ state.t++; renderTesting(); });
  }

  async function load(){
    try{
      const res = await fetch("assets/data/gallery.json", { cache: "no-store" });
      state.data = await res.json();
    }catch(e){
      state.data = { photoSlides: [], videoSlides: [], testingSlides: [] };
    }
    renderPhoto();
    renderVideo();
    renderTesting();
  }

  bind();
  load();
})();
