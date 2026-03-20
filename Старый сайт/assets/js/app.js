/* Global app bootstrap */
(function(){
  // Activate football visual theme
  document.body.classList.add("theme-football");

  // Inject favicon
  if(SITE_CONFIG?.brand?.favicon){
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = SITE_CONFIG.brand.favicon;
    document.head.appendChild(link);
  }

  // Inject nav/footer/modal/sticky CTA
  const navHost = document.getElementById("siteNav");
  const footerHost = document.getElementById("siteFooter");
  const modalHost = document.getElementById("siteModalHost");
  const floatingHost = document.getElementById("siteFloatingHost");

  const current = document.body.getAttribute("data-page") || "index";
  if(navHost) navHost.innerHTML = PARTIALS.nav(current);
  if(footerHost) footerHost.innerHTML = PARTIALS.footer();
  if(modalHost) modalHost.innerHTML = PARTIALS.signupModal() + PARTIALS.quizModal() + PARTIALS.reviewModal() + PARTIALS.parentsModal();
  if(floatingHost) floatingHost.innerHTML = PARTIALS.stickyCta();

  // Desktop snap carousels (trainers & graduates)
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

  // Nav UX: prevent jump on desktop "Родителям" + auto-close mobile menu on link click
  document.addEventListener("click", (e)=>{
    const parentsDesktop = e.target.closest(".nav-parents > a.nav-link");
    if(parentsDesktop){
      e.preventDefault();
    }

    // Close mobile collapse after selecting a link
    const navCollapse = document.getElementById("nav");
    const inNavLink = e.target.closest("#nav .nav-link, #nav .btn");
    if(navCollapse && navCollapse.classList.contains("show") && inNavLink && window.bootstrap?.Collapse){
      try{
        window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }catch(_){}
    }
  });

  bindSnapCarousels();

  // Add lightweight utility classes without changing DOM structure
  function applyFootballUtilityClasses(){
    document.querySelectorAll("h2.section-title, h3.section-title").forEach(el=>{
      el.classList.add("tape-title");
    });

    // Main hero CTA + section CTA buttons styled as tape
    document.querySelectorAll(".hero .btn-accent, section .btn-accent").forEach((btn, idx)=>{
      if(idx < 8) btn.classList.add("btn-tape");
    });
  }
  applyFootballUtilityClasses();



  // Backgrounds (responsive)
  function pickBg(desktop, mobile){
    const isMobile = window.matchMedia && window.matchMedia("(max-width: 767.98px)").matches;
    return (isMobile && mobile) ? mobile : desktop;
  }

  function applyBackgrounds(){
    const media = SITE_CONFIG?.media || {};
    const siteBg = pickBg(media.siteBg || media.heroBg, media.siteBgMobile);

    if(siteBg){
      const absSite = new URL(siteBg, document.baseURI).href;
      document.documentElement.style.setProperty("--site-bg-url", `url('${absSite}')`);
    }

    const hero = document.querySelector("[data-hero-bg]");
    if(hero){
      // Index uses special hero header; inner pages use grass (no harsh boundary).
      const heroSrc = (current === "index")
        ? pickBg(media.heroBg, media.heroBgMobile)
        : siteBg;

      if(heroSrc){
        const absHero = new URL(heroSrc, document.baseURI).href;
        hero.style.setProperty("--hero-bg-url", `url('${absHero}')`);
      } else {
        hero.style.removeProperty("--hero-bg-url");
      }
    }
  }

  applyBackgrounds();
  let __bgT = null;
  window.addEventListener("resize", ()=>{
    clearTimeout(__bgT);
    __bgT = setTimeout(applyBackgrounds, 140);
  }, { passive:true });

// Year
  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();

  // AOS animations (optional)
  if(SITE_CONFIG?.ui?.animations){
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js";
    s.onload = ()=> {
      if(window.AOS) AOS.init({ once:true, offset: 90, duration: 800, easing:"ease-out-cubic" });
    };
    document.body.appendChild(s);
  }

  // Scroll-to-top
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    if(!toTop) return;
    if (window.scrollY > 700) toTop.classList.add("show");
    else toTop.classList.remove("show");
  };
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  // Counter animation (used on index)
  function initCounters(){
    const counters = document.querySelectorAll(".count");
    if(!counters.length) return;

    let started = false;

    // Text counter: reveal one character at a time (e.g. "Тренеры UEFA")
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

  // Run after all page scripts rendered KPIs
  document.addEventListener("DOMContentLoaded", ()=> setTimeout(initCounters, 0));

})();
