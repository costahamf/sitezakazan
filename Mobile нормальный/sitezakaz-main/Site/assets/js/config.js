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
    siteBg: "assets/img/44.png",
    siteBgMobile: "assets/img/44.png",
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
