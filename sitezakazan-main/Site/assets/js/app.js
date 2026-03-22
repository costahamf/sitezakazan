(function(){
  document.body.classList.add("theme-football");

  if(SITE_CONFIG?.brand?.favicon){
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = SITE_CONFIG.brand.favicon;
    document.head.appendChild(link);
  }

  const navHost = document.getElementById("siteNav");
  const footerHost = document.getElementById("siteFooter");
  const modalHost = document.getElementById("siteModalHost");
  const floatingHost = document.getElementById("siteFloatingHost");

  const current = document.body.getAttribute("data-page") || "index";
  if(navHost) navHost.innerHTML = PARTIALS.nav(current);
  if(footerHost) footerHost.innerHTML = PARTIALS.footer();
  if(modalHost) modalHost.innerHTML = PARTIALS.signupModal() + PARTIALS.quizModal() + PARTIALS.reviewModal() + PARTIALS.parentsModal();
  if(floatingHost) floatingHost.innerHTML = PARTIALS.stickyCta();

  function bindSnapCarousels(){
    const buttons = document.querySelectorAll(".js-snap-prev, .js-snap-next");
    buttons.forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const sel = btn.getAttribute("data-snap-target");
        const scroller = sel ? document.querySelector(sel) : null;
        if(!scroller) return;
        const dir = btn.classList.contains("js-snap-prev") ? -1 : 1;
        const first = scroller.querySelector(".snap-item");
        const gap = 12;
        const step = first ? (first.getBoundingClientRect().width + gap) : Math.round(scroller.clientWidth * 0.8);
        scroller.scrollBy({ left: dir * step, behavior: "smooth" });
      });
    });
  }

  document.addEventListener("click", (e)=>{
    const parentsDesktop = e.target.closest(".nav-parents > a.nav-link");
    if(parentsDesktop){
      e.preventDefault();
    }

    const navCollapse = document.getElementById("nav");
    const inNavLink = e.target.closest("#nav .nav-link, #nav .btn");
    if(navCollapse && navCollapse.classList.contains("show") && inNavLink && window.bootstrap?.Collapse){
      try{
        window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }catch(_){}
    }
  });

  bindSnapCarousels();

  function applyFootballUtilityClasses(){
    document.querySelectorAll("h2.section-title, h3.section-title").forEach(el=>{
      el.classList.add("tape-title");
    });

    document.querySelectorAll(".hero .btn-accent, section .btn-accent").forEach((btn, idx)=>{
      if(idx < 8) btn.classList.add("btn-tape");
    });
  }
  applyFootballUtilityClasses();

  function pickBg(desktop, mobile){
    const isMobile = window.matchMedia && window.matchMedia("(max-width: 767.98px)").matches;
    return (isMobile && mobile) ? mobile : desktop;
  }

  function parseInsetPosition(position){
    if(typeof position !== "string") return null;
    const matches = [...position.matchAll(/(left|right|top|bottom)\s*(-?(?:\d+\.?\d*|\d*\.?\d+)(?:px|vw|vh|%|rem|em)?|0)?/g)];
    if(!matches.length) return null;
    const style = {};
    matches.forEach(([, edge, value])=>{
      style[edge] = value || "0";
    });
    return style;
  }

  function parseLayerSize(size){
    if(typeof size !== "string" || !size.trim()) return {};
    const [width, height] = size.trim().split(/\s+/, 2);
    const style = {};
    if(width && width !== "auto") style.width = width;
    if(height && height !== "auto") style.height = height;
    return style;
  }

  function getLayerHost(){
    let host = document.getElementById("siteBgLayerHost");
    if(host) return host;
    host = document.createElement("div");
    host.id = "siteBgLayerHost";
    host.className = "site-bg-layer-host";
    host.setAttribute("aria-hidden", "true");
    document.body.prepend(host);
    return host;
  }

  function clearSiteBgLayers(){
    const host = document.getElementById("siteBgLayerHost");
    if(host) host.innerHTML = "";
    document.body.classList.remove("site-bg-layers-active");
  }

  function renderSiteBgLayers(layers){
    if(!Array.isArray(layers) || !layers.length) {
      clearSiteBgLayers();
      return false;
    }

    const host = getLayerHost();
    host.innerHTML = "";

    layers.forEach((layer, index)=>{
      if(!layer?.src) return;
      const img = document.createElement("img");
      img.className = "site-bg-layer";
      img.src = new URL(layer.src, document.baseURI).href;
      img.alt = "";
      img.decoding = "async";
      img.loading = index === 0 ? "eager" : "lazy";

      const pos = parseInsetPosition(layer.position);
      if(pos) Object.assign(img.style, pos);
      Object.assign(img.style, parseLayerSize(layer.size));
      if(layer.opacity != null) img.style.opacity = String(layer.opacity);
      if(layer.transform) img.style.transform = layer.transform;

      host.appendChild(img);
    });

    document.body.classList.add("site-bg-layers-active");
    return host.childElementCount > 0;
  }

  function applyBackgrounds(){
    const media = SITE_CONFIG?.media || {};
    const isIndex = current === "index";
    const desktopSiteBg = isIndex ? (media.heroBg || media.siteBg) : null;
    const mobileSiteBg = isIndex ? (media.heroBgMobile || media.siteBgMobile || desktopSiteBg) : null;
    const siteBg = isIndex ? pickBg(desktopSiteBg, mobileSiteBg) : null;
    const hasSectionDecor = isIndex && document.querySelector(".section-decor") !== null;
    const activeLayers = (isIndex && !hasSectionDecor)
      ? pickBg(media.siteBgLayers?.desktop, media.siteBgLayers?.mobile)
      : null;
    const hasRenderedLayers = renderSiteBgLayers(activeLayers);

    if(hasRenderedLayers){
      document.documentElement.style.setProperty("--site-bg-url", 'none');
      document.documentElement.style.setProperty("--site-bg-position", 'center top');
      document.documentElement.style.setProperty("--site-bg-size", 'cover');
      document.documentElement.style.setProperty("--site-bg-repeat", 'no-repeat');
    } else if(siteBg){
      const absSite = new URL(siteBg, document.baseURI).href;
      document.documentElement.style.setProperty("--site-bg-url", `url('${absSite}')`);
      document.documentElement.style.setProperty("--site-bg-position", 'center top');
      document.documentElement.style.setProperty("--site-bg-size", 'cover');
      document.documentElement.style.setProperty("--site-bg-repeat", 'no-repeat');
    } else {
      clearSiteBgLayers();
      document.documentElement.style.setProperty("--site-bg-url", 'none');
      document.documentElement.style.setProperty("--site-bg-position", 'center top');
      document.documentElement.style.setProperty("--site-bg-size", 'cover');
      document.documentElement.style.setProperty("--site-bg-repeat", 'no-repeat');
    }

    const hero = document.querySelector("[data-hero-bg]");
    if(hero){
      const heroSrc = isIndex ? pickBg(media.heroBg, media.heroBgMobile) : null;

      if(heroSrc){
        const absHero = new URL(heroSrc, document.baseURI).href;
        hero.style.setProperty("--hero-bg-url", `url('${absHero}')`);
        document.documentElement.style.setProperty("--index-hero-bg-url", `url('${absHero}')`);
      } else {
        hero.style.setProperty("--hero-bg-url", 'none');
        document.documentElement.style.setProperty("--index-hero-bg-url", 'none');
      }
    } else {
      document.documentElement.style.setProperty("--index-hero-bg-url", 'none');
    }
  }

  function adjustHeroCutoff() {
    const hero = document.querySelector('[data-hero-bg]');
    if (!hero) return;
    
    const isMobile = window.matchMedia('(max-width: 991.98px)').matches;
    const kpis = document.getElementById('heroKpis');
    
    if (!isMobile && kpis) {
      const heroRect = hero.getBoundingClientRect();
      const kpisRect = kpis.getBoundingClientRect();
      const kpisBottom = kpisRect.bottom - heroRect.top;
      hero.style.setProperty('--hero-kpis-bottom', kpisBottom + 'px');
      
    } else if (isMobile) {
      const stats = document.querySelectorAll('#heroKpis .stat');
      if (stats.length >= 3) {
        const lastStat = stats[stats.length - 1];
        const heroRect = hero.getBoundingClientRect();
        const statRect = lastStat.getBoundingClientRect();
        const uefaBottom = statRect.bottom - heroRect.top;
        hero.style.setProperty('--hero-uefa-bottom', uefaBottom + 'px');
      }
    }
  }

  applyBackgrounds();
  
  window.addEventListener('load', function() {
    setTimeout(adjustHeroCutoff, 100);
  });
  
  window.addEventListener('resize', adjustHeroCutoff);
  
  let __bgT = null;
  window.addEventListener("resize", ()=>{
    clearTimeout(__bgT);
    __bgT = setTimeout(applyBackgrounds, 140);
  }, { passive:true });

  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();

  if(SITE_CONFIG?.ui?.animations){
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js";
    s.onload = ()=> {
      if(window.AOS) AOS.init({ once:true, offset: 90, duration: 800, easing:"ease-out-cubic" });
    };
    document.body.appendChild(s);
  }

  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    if(!toTop) return;
    if (window.scrollY > 700) toTop.classList.add("show");
    else toTop.classList.remove("show");
  };
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  function initCounters(){
    const counters = document.querySelectorAll(".count");
    if(!counters.length) return;

    let started = false;

    function animateText(el, target, dur){
      const text = String(target || "");
      const total = Math.max(1, text.length);
      const chars = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЭЮЯABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const t0 = performance.now();
      el.textContent = "";

      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const locked = Math.min(total, Math.max(0, Math.floor(eased * total)));
        const spinFrame = Math.floor((now - t0) / 35);
        el.textContent = text.split("").map((ch, i) => {
          if(ch === " ") return " ";
          if(i < locked) return ch;
          return chars[(spinFrame + i * 7) % chars.length];
        }).join("");
        if(p < 1) requestAnimationFrame(tick);
        else el.textContent = text;
      };
      requestAnimationFrame(tick);
    }

    const animate = (el, target) => {
      const dur = 2400;
      const t0 = performance.now();
      const start = 0;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(start + (target - start) * eased);
        el.textContent = val.toString();
        if(p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting && !started){
          started = true;
          counters.forEach(c=>{
            const t = parseInt(c.getAttribute("data-target") || "0", 10);
            if(!Number.isNaN(t)) animate(c, t);
          });
          document.querySelectorAll('.count-text').forEach(c=>{
            const txt = c.getAttribute('data-target-text') || c.textContent || '';
            animateText(c, txt, 2400);
          });
        }
      });
    }, { threshold: 0.25 });

    obs.observe(counters[0]);
  }

  document.addEventListener("DOMContentLoaded", ()=> setTimeout(initCounters, 0));

})();
