/**
 * JS partials so you can maintain nav/footer once for all pages.
 * Figma import tip: for "html.to.design" plugin, it will render final DOM (partials included).
 */
window.PARTIALS = {
  nav(current){
    const showName = (SITE_CONFIG?.brand?.showName !== false);
    const nameHtml = showName ? `<span>${SITE_CONFIG.brand.name}</span>` : ``;
    const maxLink = (SITE_CONFIG.contacts?.maxLink || SITE_CONFIG.socials?.maxLink || "").trim();

    const cur = current || "index";
    const isParents = cur.startsWith("parents");
    const parents = (SITE_CONFIG?.nav?.parents || []);
    const parentsLinks = parents.length
      ? parents.map(i=>`<a class="dropdown-item parents-item" href="${i.href}">${i.label}</a>`).join("")
      : `<div class="dropdown-item muted small">Скоро</div>`;

    const coachesHref = (cur === "index") ? "#coaches" : "index.html#coaches";
    const chessHref   = (cur === "index") ? "#chess"   : "index.html#chess";
    const cabinetHref = (SITE_CONFIG?.nav?.cabinetHref || "cabinet.html");

    return `
<nav class="navbar navbar-expand-x1 navbar-dark fixed-top nav-glass">
  <div class="container">
    <a class="navbar-brand brand-mark" href="index.html">
      <img class="brand-logo" src="${SITE_CONFIG.brand.logo}" alt="${SITE_CONFIG.brand.name}" />
      ${nameHtml}
    </a>

    <!-- Mobile: cabinet + burger -->
    <div class="d-flex align-items-center gap-2 ms-auto d-x1-none">
      <a class="nav-icon-link nav-icon-link--mobile" href="${cabinetHref}" aria-label="Личный кабинет">
        <i class="bi bi-person-circle"></i>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Меню">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>

    <div id="nav" class="collapse navbar-collapse">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
        <li class="nav-item"><a class="nav-link ${cur==='index'?'active':''}" href="index.html#home">Главная</a></li>
        <li class="nav-item"><a class="nav-link ${cur==='locations'?'active':''}" href="locations.html">Локации</a></li>
        <li class="nav-item"><a class="nav-link ${cur==='schedule'?'active':''}" href="schedule.html">Расписание</a></li>
        <li class="nav-item"><a class="nav-link ${cur==='reviews'?'active':''}" href="reviews.html">Отзывы</a></li>

        <!-- Родителям (desktop hover dropdown) -->
        <li class="nav-item nav-parents d-none d-x1-block">
          <a class="nav-link d-inline-flex align-items-center ${isParents?'active':''}" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            Родителям <i class="bi bi-chevron-down ms-1 small"></i>
          </a>
          <div class="parents-dropdown" role="menu">
            ${parentsLinks}
          </div>
        </li>

        <!-- Родителям (mobile popup) -->
        <li class="nav-item d-x1-none">
          <a class="nav-link ${isParents?'active':''}" href="#" data-bs-toggle="modal" data-bs-target="#parentsModal">
            Родителям <i class="bi bi-chevron-right ms-1 small"></i>
          </a>
        </li>

        <li class="nav-item"><a class="nav-link" href="${coachesHref}">Тренеры</a></li>
        <li class="nav-item"><a class="nav-link" href="${chessHref}">Шахматы</a></li>
        <li class="nav-item"><a class="nav-link ${cur==='camps'?'active':''}" href="camps.html">Сборы</a></li>
        <li class="nav-item"><a class="nav-link" href="#contacts">Контакты</a></li>

        <li class="nav-item d-x1-none mt-2 pt-2 border-top border-light border-opacity-10">
          <div class="d-flex gap-2">
            <a class="mini-contact" href="tel:${SITE_CONFIG.contacts.phoneTel}" aria-label="Позвонить"><i class="bi bi-telephone-fill"></i><span>Телефон</span></a>
            <a class="mini-contact" href="${maxLink || '#'}" target="_blank" rel="noopener" aria-label="Написать в MAX"><span class="brand-badge">MAX</span><span>MAX</span></a>
            <a class="mini-contact" href="${SITE_CONFIG.contacts.telegramLink}" target="_blank" rel="noopener" aria-label="Написать в Telegram"><i class="bi bi-telegram"></i><span>Telegram</span></a>
          </div>
        </li>

<!-- Cabinet icon (desktop) -->
        <li class="nav-item ms-x1-1 d-none d-x1-block">
          <a class="nav-link nav-icon-link" href="${cabinetHref}" aria-label="Личный кабинет">
            <i class="bi bi-person-circle"></i>
          </a>
        </li>

        <li class="nav-item ms-x1-2 d-none d-x1-block">
          <button class="btn btn-accent px-4" data-bs-toggle="modal" data-bs-target="#signupModal">
            <i class="bi bi-lightning-charge-fill me-1"></i> Записаться
          </button>
        </li>
      </ul>
    </div>
  </div>
</nav>
`;
  },


  footer(){
    const showName = (SITE_CONFIG?.brand?.showName !== false);
    const nameHtml = showName ? `<span>${SITE_CONFIG.brand.name}</span>` : ``;
    const socials = (SITE_CONFIG.socials || {});
    const maxLink = (SITE_CONFIG.contacts?.maxLink || socials.maxLink || "").trim();
    const maxHtml = maxLink
      ? `<a class="link-accent fw-bold" href="${maxLink}" target="_blank" rel="noopener">MAX</a>`
      : `<a class="link-accent fw-bold" href="javascript:void(0)" title="Укажите ссылку MAX в assets/js/config.js">MAX</a>`;

    return `<footer id="contacts" class="footer-strong py-4">
  <div class="container">
    <div class="row g-2">
      <div class="col-lg-4">
        <div class="brand-mark mb-2">
          <img class="brand-logo brand-logo--footer" src="${SITE_CONFIG.brand.logo}" alt="${SITE_CONFIG.brand.name}" />
          ${nameHtml}
        </div>
        <div class="muted">Футбольная школа для детей • Новосибирск • Тольятти</div>
      </div>

      <div class="col-lg-4">
        <div class="fw-bold mb-2">Контакты</div>

        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="icon-pill"><i class="bi bi-telephone-fill"></i></span>
          <div>
            <a class="link-accent fw-bold" href="tel:${SITE_CONFIG.contacts.phoneTel}">${SITE_CONFIG.contacts.phoneDisplay}</a>
            <div class="muted small">Ежедневно 10:00–20:00</div>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="icon-pill"><i class="bi bi-telegram"></i></span>
          <div>
            <a class="link-accent fw-bold" href="${SITE_CONFIG.contacts.telegramLink}" target="_blank" rel="noopener">Telegram</a>
            <div class="muted small">Написать тренеру</div>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <span class="icon-pill icon-pill--text">MAX</span>
          <div>
            ${maxHtml}
            <div class="muted small">Если используете MAX</div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="fw-bold mb-2">Мы в соцсетях</div>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <a class="social-btn" href="${socials.instagram}" target="_blank" rel="noopener" aria-label="Instagram">
            <i class="bi bi-instagram"></i>
          </a>
          <a class="social-btn" href="${socials.telegramChannel}" target="_blank" rel="noopener" aria-label="Telegram канал">
            <i class="bi bi-telegram"></i>
          </a>
          <a class="social-btn" href="${socials.vk}" target="_blank" rel="noopener" aria-label="VK">
            <span class="social-text">VK</span>
          </a>
          <a class="social-btn" href="${socials.youtube}" target="_blank" rel="noopener" aria-label="YouTube">
            <i class="bi bi-youtube"></i>
          </a>
        </div>

        

      </div>
    </div>

    <div class="soft-line my-3"></div>

    <div class="d-flex flex-wrap justify-content-between gap-2 align-items-center">
      <div class="muted small">© <span id="year"></span> • ${SITE_CONFIG.brand.name}</div>
      <div class="muted small">
        <a class="link-accent" href="index.html">Главная</a> •
        <a class="link-accent" href="locations.html">Локации</a> •
        <a class="link-accent" href="schedule.html">Расписание</a>
      </div>
    </div>
  </div>
</footer>`;
  },

  stickyCta(){
    if(!SITE_CONFIG.ui.stickyCta) return "";
    return `
<a class="fab-call" href="#" data-bs-toggle="modal" data-bs-target="#signupModal" aria-label="Записаться на пробное занятие">
  <i class="bi bi-telephone-fill"></i>
</a>

<a href="#home" class="to-top" id="toTop" aria-label="Наверх">
  <i class="bi bi-arrow-up"></i>
</a>
`;
  },

  signupModal(){
    const cityOptions = (SITE_DATA.cities || ["Новосибирск"]).map(c => `<option value="${c}">${c}</option>`).join("");
    const phone = SITE_CONFIG.contacts.phoneDisplay;
    const tel = SITE_CONFIG.contacts.phoneTel;
    const maxLink = (SITE_CONFIG.contacts?.maxLink || SITE_CONFIG.socials?.maxLink || "").trim();

    return `
<div class="modal fade" id="signupModal" tabindex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-fullscreen-sm-down">
    <div class="modal-content" style="background: linear-gradient(180deg, rgba(14,23,20,.95), rgba(7,11,9,.92)); border:1px solid rgba(190,255,220,.12); border-radius: 22px;">
      <div class="modal-header" style="border-bottom:1px solid rgba(190,255,220,.10);">
        <h5 class="modal-title fw-bold" id="signupModalLabel">Запись на пробное занятие / Тестирование</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Закрыть"></button>
      </div>

      <div class="modal-body">
        <div class="row g-2">
          <div class="col-lg-7">
            <div class="glass p-3 signup-whatnext">
              <div class="fw-bold mb-1">Что будет дальше</div>
              <div class="muted small">
                Уточним возраст и уровень, подберём локацию и время. После занятия — разбор и рекомендации.
              </div>
            </div>

            <form id="signupForm" class="mt-3">
              <div class="row g-2"><div class="col-md-6">
                  <label class="form-label muted small">Город</label>
                  <select id="signupCity" name="city" class="form-select" required style="background:rgba(10,16,14,.55); border:1px solid rgba(190,255,220,.14); color:var(--text-0); border-radius:14px;">
                    <option value="" selected disabled>Выберите город</option>
                    ${cityOptions}
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label muted small">Район</label>
                  <select id="signupDistrict" name="district" class="form-select" required disabled style="background:rgba(10,16,14,.55); border:1px solid rgba(190,255,220,.14); color:var(--text-0); border-radius:14px;">
                    <option value="" selected disabled>Сначала выберите город</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label muted small">Имя</label>
                  <input name="parent_name" class="form-control" required placeholder="Например, Анна" style="background:rgba(10,16,14,.55); border:1px solid rgba(190,255,220,.14); color:var(--text-0); border-radius:14px;">
                </div>
                <div class="col-md-6">
                  <label class="form-label muted small">Телефон</label>
                  <input name="phone" class="form-control" required placeholder="+7 (___) ___-__-__" style="background:rgba(10,16,14,.55); border:1px solid rgba(190,255,220,.14); color:var(--text-0); border-radius:14px;">
                </div>
                <div class="col-md-6">
                  <label class="form-label muted small">Возраст ребёнка</label>
                  <select name="child_age" class="form-select" required style="background:rgba(10,16,14,.55); border:1px solid rgba(190,255,220,.14); color:var(--text-0); border-radius:14px;">
                    <option value="" selected disabled>Выберите</option>
                    <option>3–5</option>
                    <option>6–8</option>
                    <option>9–11</option>
                    <option>12–14</option>
                    <option>15–16</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label muted small">Формат</label>
                  <select name="format" class="form-select" required style="background:rgba(10,16,14,.55); border:1px solid rgba(190,255,220,.14); color:var(--text-0); border-radius:14px;">
                    <option value="" selected disabled>Выберите</option>
                    <option value="team">Групповые (700 ₽)</option>
                    <option value="mini">Мини-группа (800 ₽)</option>
                    <option value="solo">Индивидуально (от 2500 ₽)</option>
                    <option value="chess">Шахматы + футбол</option>
                    <option value="testing">Тестирование</option>
                  </select>
                </div>
                <div class="col-12 signup-comment">
                  <label class="form-label muted small">Комментарий (необязательно)</label>
                  <textarea name="comment" class="form-control" rows="3" placeholder="Например: играл/не играл, цель — техника / академия" style="background:rgba(10,16,14,.55); border:1px solid rgba(190,255,220,.14); color:var(--text-0); border-radius:14px;"></textarea>
                </div>

                <div class="col-12">
                  <div class="d-grid">
                    <button class="btn btn-accent py-2" type="submit">
                      <i class="bi bi-send-fill me-1"></i> Отправить заявку
                    </button>
                  </div>
                  <div class="muted small mt-2">
                    Нажимая «Отправить заявку тренеру», вы соглашаетесь с обработкой персональных данных и политикой конфиденциальности.
                  </div>

                  <div class="signup-mini-contacts" aria-label="Контакты">
                    <a class="mini-contact" href="tel:${tel}" aria-label="Позвонить"><i class="bi bi-telephone-fill"></i><span>Телефон</span></a>
                    <a class="mini-contact" href="${maxLink || '#'}" target="_blank" rel="noopener" aria-label="Написать в MAX"><span class="brand-badge">MAX</span><span>MAX</span></a>
                    <a class="mini-contact" href="${SITE_CONFIG.contacts.telegramLink}" target="_blank" rel="noopener" aria-label="Написать в Telegram"><i class="bi bi-telegram"></i><span>Telegram</span></a>
                  </div>

                </div>
              </div>
            </form>
          </div>

          <div class="col-lg-5 signup-side">
            <div class="card-dark p-4 h-100">
              <div class="fw-bold">Контакты</div>
              <div class="muted small">Замените на реальные в assets/js/config.js</div>
              <div class="soft-line my-3"></div>

              <div class="d-flex gap-2 align-items-center mb-2">
                <div class="brand-badge" style="width:42px;height:42px;border-radius:16px;"><i class="bi bi-telephone-fill"></i></div>
                <div>
                  <a class="link-accent fw-bold" href="tel:${tel}">${phone}</a>
                  <div class="muted small">Ежедневно 10:00–20:00</div>
                </div>
              </div>

              
<div class="d-flex gap-2 align-items-center mb-2">
  <div class="brand-badge" style="width:42px;height:42px;border-radius:16px; font-weight:900; letter-spacing:.6px; font-size:12px;">MAX</div>
  <div>
    <a class="link-accent fw-bold" href="${maxLink || '#'}" target="_blank" rel="noopener">MAX</a>
    <div class="muted small">Быстрая запись</div>
  </div>
</div>


              <div class="d-flex gap-2 align-items-center">
                <div class="brand-badge" style="width:42px;height:42px;border-radius:16px;"><i class="bi bi-telegram"></i></div>
                <div>
                  <a class="link-accent fw-bold" href="${SITE_CONFIG.contacts.telegramLink}" target="_blank" rel="noreferrer">Telegram</a>
                  <div class="muted small">Вопросы/расписание</div>
                </div>
              </div>

              <div class="soft-line my-3"></div>
              <div class="glass p-3">
                <div class="fw-bold">Почему дети остаются</div>
                <div class="muted small">
                  Понятный прогресс, интенсивность без пустого времени, уверенность в 1-на-1 и перенос навыков в матч.
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div class="modal-footer" id="quizFooter" style="border-top:1px solid rgba(190,255,220,.10);">
        <button type="button" class="btn btn-outline-accent" data-bs-dismiss="modal">Закрыть</button>
      </div>
    </div>
  </div>
</div>
`;
  },

  quizModal(){
      return `
  <div class="modal fade" id="quizModal" tabindex="-1" aria-labelledby="quizModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg modal-fullscreen-sm-down">
      <div class="modal-content quiz-modal">
        <div class="modal-header" style="border-bottom:1px solid rgba(190,255,220,.10);">
          <h5 class="modal-title visually-hidden" id="quizModalLabel">Рекомендация тренера</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
  
        <div class="modal-body">
          <div class="quiz-progress mb-3">
            
            <div class="progress" style="height:10px; background: rgba(190,255,220,.08); border-radius:999px; border:1px solid rgba(190,255,220,.10); overflow:hidden;">
              <div class="progress-bar" id="quizProgressBar" role="progressbar" style="width: 20%; background: linear-gradient(180deg, rgba(173,229,255,.92), rgba(89,170,255,.92));"></div>
            </div>
          </div>
  
          <!-- Step 1 -->
          <div class="quiz-step" data-step="1">
            <h3 class="fw-black mb-2" style="font-weight:950;">1) Город</h3>
            <div class="muted mb-3">Выберите город — это нужно, чтобы показать подходящие районы.</div>

            <div class="quiz-options">
              <label class="quiz-option">
                <input class="form-check-input" type="radio" name="quiz_city" value="Новосибирск">
                <span class="quiz-option-text">Новосибирск</span>
              </label>
              <label class="quiz-option">
                <input class="form-check-input" type="radio" name="quiz_city" value="Тольятти">
                <span class="quiz-option-text">Тольятти</span>
              </label>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="quiz-step d-none" data-step="2">
            <h3 class="fw-black mb-2" style="font-weight:950;">2) Возраст ребёнка</h3>
            <div class="muted mb-3">Выберите возраст ребёнка — подберём группу и нагрузку.</div>

            <label class="form-label muted small">Возраст</label>
            <button type="button" class="quiz-picker" data-quiz-picker="age" id="quizAgeTrigger">
              <span class="quiz-picker-text" id="quizAgeDisplay">Выберите возраст</span>
              <i class="bi bi-chevron-down"></i>
            </button>
            <input type="hidden" id="quizAge" value="">
            <div class="muted small mt-2">От 3 до 15 лет, или 16+.</div>
          </div>

          <!-- Step 2 -->
          <div class="quiz-step d-none" data-step="3">
            <h3 class="fw-black mb-2" style="font-weight:950;">3) Район проживания</h3>
            <div class="muted mb-3">Выберите район, чтобы мы предложили ближайшие локации.</div>

            <label class="form-label muted small">Район</label>
            <button type="button" class="quiz-picker" data-quiz-picker="district" id="quizDistrictTrigger">
              <span class="quiz-picker-text" id="quizDistrictDisplay">Выберите район</span>
              <i class="bi bi-chevron-down"></i>
            </button>
            <input type="hidden" id="quizDistrict" value="">
          </div>

          <!-- Step 3 -->
          <div class="quiz-step d-none" data-step="4">
            <h3 class="fw-black mb-2" style="font-weight:950;">4) Опыт</h3>
            <div class="muted mb-3">Это поможет подобрать нагрузку и формат.</div>
  
            <div class="quiz-options">
              ${[
                ["Спортивная школа","Спортивная школа"],
                ["Коммерческий клуб","Коммерческий клуб"],
                ["Играл во дворе","Играл во дворе"],
                ["Не занимался","Не занимался"]
              ].map(([val,label])=>`
                <label class="quiz-option">
                  <input class="form-check-input" type="radio" name="quiz_exp" value="${val}">
                  <span class="quiz-option-text">${label}</span>
                </label>
              `).join("")}
            </div>
          </div>
  
          <!-- Step 4 -->
          <div class="quiz-step d-none" data-step="5">
            <h3 class="fw-black mb-2" style="font-weight:950;">5) Цель ребёнка</h3>
            <div class="muted mb-3">Выберите самую близкую цель.</div>
  
            <div class="quiz-options">
              ${[
                ["Улучшить навыки","Улучшить навыки"],
                ["Играть на турнирах","Играть на турнирах"],
                ["Играть профессионально","Играть профессионально"],
                ["Для себя","Для себя"],
                ["Научиться финтить","Научиться финтить"],
                ["Чтобы девчонки в обморок падали","Чтобы девчонки в обморок падали 😄"]
              ].map(([val,label])=>`
                <label class="quiz-option">
                  <input class="form-check-input" type="radio" name="quiz_goal" value="${val}">
                  <span class="quiz-option-text">${label}</span>
                </label>
              `).join("")}
            </div>
          </div>
  
          <!-- Result -->
          <div class="quiz-step d-none" data-step="6">
            <h3 class="fw-black mb-2 quiz-rec-title" style="font-weight:950;"><span class="quiz-title-gradient">Рекомендация тренера</span></h3>
            <div class="muted mb-3">На основе ответов — ориентир по формату и частоте занятий.</div>
  
            <div class="card-dark p-4 quiz-result-card">
              <div class="row g-2">
                <div class="col-lg-6">
                  <div class="fw-bold mb-2">Ваши ответы</div>
                  <div class="list-check" id="quizSummary"></div>
                </div>
                <div class="col-lg-6">
                  <div class="fw-bold mb-2">Рекомендация</div>
                  <div class="glass p-3" id="quizRecommendation"></div>
                  <div class="muted small mt-2 quiz-orient-note">* Это ориентир. Точную группу и нагрузку уточняем на пробном занятии.</div>
                </div>
              </div>
  
              <div class="soft-line my-3"></div>
  
              <div class="quiz-result-actions">
                <div class="muted small quiz-orient-note-mobile">* Это ориентир. Точную группу и нагрузку уточняем на пробном занятии.</div>
                <div class="quiz-submit-error" id="quizSubmitError" aria-live="polite"></div>
                <div class="row g-2">
                  <div class="col-md-6">
                    <label class="form-label muted small">Имя</label>
                    <input id="quizParentName" type="text" class="form-control quiz-input" placeholder="Имя">
                    <div class="quiz-error-inline" id="quizParentNameError" aria-live="polite"></div>
                    <div class="invalid-feedback">Заполните поле «Имя».</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label muted small">Телефон</label>
                    <input id="quizPhone" type="tel" class="form-control quiz-input" placeholder="+7 (___) ___‑__‑__">
                    <div class="quiz-error-inline" id="quizPhoneError" aria-live="polite"></div>
                    <div class="invalid-feedback">Введите телефон полностью.</div>
                  </div>
                </div>
                <div class="muted small mt-2">Нажимая «Отправить заявку тренеру», вы соглашаетесь с обработкой персональных данных и политикой конфиденциальности.</div>

                <div class="d-grid d-md-flex gap-2 mt-3">
                  <button class="btn btn-accent px-4" id="quizSubmitBtn" type="button">
                    Отправить заявку тренеру
                  </button>
                  <button class="btn btn-outline-accent px-4" type="button" data-bs-dismiss="modal">
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
  

          <!-- Picker sheet (scrollable list for age/district) -->
          <div class="quiz-picker-sheet d-none" id="quizPickerSheet" aria-hidden="true">
            <div class="quiz-picker-panel">
              <div class="quiz-picker-header">
                <div class="fw-bold" id="quizPickerTitle">Выберите</div>
                <button type="button" class="btn btn-outline-accent btn-sm px-3" id="quizPickerClose" aria-label="Закрыть">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
              <div class="quiz-picker-options" id="quizPickerOptions"></div>
            </div>
          </div>

        </div>
  
        <div class="modal-footer" style="border-top:1px solid rgba(190,255,220,.10);">
          <button type="button" class="btn btn-outline-accent" id="quizPrevBtn">Назад</button>
          <button type="button" class="btn btn-accent" id="quizNextBtn">Далее</button>
        </div>
      </div>
    </div>
  </div>
  `;
    },
  
  reviewModal(){
    return `
<div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
    <div class="modal-content" style="background: linear-gradient(180deg, rgba(12,18,16,.96), rgba(6,10,9,.96)); border:1px solid rgba(190,255,220,.12); border-radius: 22px;">
      <div class="modal-header" style="border-bottom:1px solid rgba(190,255,220,.10);">
        <div>
          <div class="fw-bold" id="reviewModalLabel">Отзыв</div>
          <div class="muted small" id="reviewModalMeta"></div>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Закрыть"></button>
      </div>
      <div class="modal-body">
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="brand-badge" style="width:48px;height:48px;border-radius:18px;">
            <i class="bi bi-person-fill"></i>
          </div>
          <div>
            <div class="fw-bold" id="reviewModalName"></div>
            <div class="muted small">Нажмите Esc, чтобы закрыть</div>
          </div>
        </div>
        <div class="card-dark p-4">
          <div class="muted" style="font-size:1.05rem; line-height:1.75;" id="reviewModalText"></div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
  },

parentsModal(){
    const items = (SITE_CONFIG?.nav?.parents || []);
    const links = items.length
      ? items.map(i=>`
        <a class="parents-modal-link" href="${i.href}">
          ${i.label} <i class="bi bi-arrow-right-short"></i>
        </a>
      `).join("")
      : `<div class="muted small">Скоро</div>`;

    return `
<div class="modal fade" id="parentsModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-sm modal-fullscreen-sm-down">
    <div class="modal-content parents-modal">
      <div class="modal-header" style="border-bottom:1px solid rgba(190,255,220,.10);">
        <h5 class="modal-title fw-bold">Родителям</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Закрыть"></button>
      </div>
      <div class="modal-body">
        <div class="parents-modal-list">
          ${links}
        </div>
      </div>
    </div>
  </div>
</div>
`;
  }

};



