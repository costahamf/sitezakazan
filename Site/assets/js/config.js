/**
 * === SITE CONFIG (edit this file) ===
 * Здесь ты меняешь логотип, фон hero, контакты, соцсети, и endpoint формы.
 */
window.SITE_CONFIG = {
  brand: {
    name: "Футбекс",
    showName: false, // если логотип уже содержит текст — лучше false
    tagline: "Футбольная школа для детей • Новосибирск • Тольятти",
    logo: "assets/img/brand-logo.webp",   // ← замени файл или путь
    favicon: "assets/img/favicon.png"
  },

  media: {
    // siteBgLayers:
    // - position: сначала горизонталь (left/right), потом высота (top/bottom)
    //   пример: "right -24px top 72px"
    // - size: первое значение = ширина картинки, второе можно оставить auto
    // - mobile: меняй именно здесь положение decor-картинок на телефоне
    siteBgLayers: {
      desktop: [
        { src: "assets/img/sitebg-decor/Chart.webp", position: "right 3vw top 180px", size: "220px auto" },
        { src: "assets/img/sitebg-decor/book.webp", position: "left 4vw top 760px", size: "180px auto" },
        { src: "assets/img/sitebg-decor/coach.webp", position: "right 2vw top 1380px", size: "220px auto" },
        { src: "assets/img/sitebg-decor/chess.webp", position: "left 3vw top 1980px", size: "190px auto" },
        { src: "assets/img/sitebg-decor/test.webp", position: "right 4vw bottom 260px", size: "220px auto" },
        { src: "assets/img/sitebg-decor/conus.webp", position: "left 5vw bottom 180px", size: "170px auto" }
      ],
      mobile: [
        { src: "assets/img/sitebg-decor/Chart.webp", position: "right -24px top 72px", size: "110px auto" },
        { src: "assets/img/sitebg-decor/book.webp", position: "left -18px top 680px", size: "96px auto" },
        { src: "assets/img/sitebg-decor/chess.webp", position: "right -20px top 1500px", size: "102px auto" },
        { src: "assets/img/sitebg-decor/test.webp", position: "left -14px bottom 420px", size: "110px auto" }
      ]
    },
    siteBg: "assets/img/sitebg-decor/swistl.webp",
    siteBgMobile: "assets/img/sitebg-decor/swistl.webp",
    heroBg: "assets/img/heroBg.webp",
    heroBgMobile: "assets/img/heroBgMobile.webp",
    galleryFolder: "assets/img/gallery/",
  },

  contacts: {
    city: "Новосибирск",
    phoneDisplay: "+7 (900) 000-00-00",     // ← замени
    phoneTel: "+79000000000",               // ← замени
    whatsappLink: "https://wa.me/79000000000", // ← замени
    telegramLink: "https://t.me/your_username", // ← замени
    email: "hello@example.com"              // ← замени (опционально)
  },

  
  socials: {
    instagram: "https://instagram.com/your_profile",     // ← замени
    vk: "https://vk.com/your_page",                      // ← замени
    youtube: "https://youtube.com/@your_channel",        // ← замени
    telegramChannel: "https://t.me/your_channel",        // ← замени
    maxLink: ""                                          // ← замени при необходимости
  },

forms: {
    mode: "demo", 
    /**
     * mode:
     *  - "demo"      -> ничего не отправляем, показываем успех
     *  - "webhook"   -> POST на forms.endpoint (твоя функция/сервер)
     *  - "formspree" -> POST на Formspree endpoint (быстро, без сервера)
     */
    endpoint: "https://example.com/api/lead", // ← твой endpoint
    successRedirect: ""                       // ← опционально, например /thanks.html
  },

  nav: {
    // Меню "Родителям" (можно расширять: добавляй новые {label, href})
    parents: [
      { label: "Буллинг", href: "parents-bullying.html" },
      { label: "Программа тренировок", href: "program.html" }
    ],
    cabinetHref: "cabinet.html"
  },

  ui: {
    stickyCta: true,
    animations: true
  }
};
