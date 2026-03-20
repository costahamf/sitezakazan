# SKILL+ — multipage landing (Bootstrap 5)

Это готовый многостраничный сайт:
- `index.html` — главная (hero, результат, CTA, быстрые блоки)
- `program.html` — программа + философия + шахматы
- `locations.html` — интерактивный выбор филиала: поиск + карта + выбор в форму
- `reviews.html` — отзывы + траектории + галерея
- Модалка записи (`Записаться`) подключена на всех страницах

## 1) Где менять логотип, фон, контакты
Открой:
- `assets/js/config.js`

Там:
- `brand.logo` — логотип (замени файл `assets/img/logo.svg`)
- `media.heroBg` — фон hero (замени `assets/img/hero-bg.svg` на JPG/PNG/WebP)
- `contacts` — телефон/WhatsApp/Telegram
- `forms` — способ отправки заявок

## 2) Где менять контент (цены, локации, отзывы)
Открой:
- `assets/js/data.js`

Особенно:
- `pricing` — цены
- `locations` — филиалы
  - Можно заполнить `area` (район) и `coords: {lat, lng}` для карты
  - Если `coords` пустые — `locations.html` попробует геокодить адрес через Nominatim (OSM) и закэширует в браузере.
- `reviews`, `gallery`, `trajectories`

## 3) Запуск локально
Самый простой вариант:
- VS Code → Extensions → **Live Server**
- Открой `index.html` → “Go Live”

(Можно просто открыть HTML двойным кликом, но некоторые браузеры ограничивают запросы при `file://`.)

## 4) Подключение формы в Telegram/CRM
Смотри папку:
- `integrations/`

Там есть готовый пример:
- Cloudflare Worker (Telegram)
- Netlify Function (Telegram)

Важно: токены нельзя держать в фронтенде.

## 5) Перенос в Figma (быстрый путь)
Лучший практичный вариант:
1) Запусти сайт локально (Live Server) или выложи на тестовый домен.
2) В Figma поставь плагин **html.to.design** (или аналогичный “HTML to Figma”).
3) Импортируй страницы по URL:
   - /index.html, /program.html, /locations.html, /reviews.html
4) После импорта:
   - Применяй Auto Layout, компоненты, стили
   - Импортируй токены из `design-tokens.json` через плагин **Tokens Studio**

### Примечание
HTML → Figma всегда требует небольшой “доводки” (автолэйаут, компоненты, текстовые стили),
но этот проект сделан с повторяемыми блоками и токенами — так переносится легче.


## 6) Где менять sitebg-иконки и их высоту на mobile
Открой:
- `assets/js/config.js`

Нужный блок:
- `media.siteBgLayers.desktop` — декор для ПК
- `media.siteBgLayers.mobile` — декор для телефона

Пример одной записи:
```js
{ src: "assets/img/sitebg-decor/Chart.webp", position: "right -24px top 72px", size: "110px auto" }
```

Что именно менять:
- `src` — какая картинка используется.
- `position` — положение картинки.
  - `right -24px` или `left -18px` двигает картинку по горизонтали.
  - `top 72px` двигает картинку по высоте сверху вниз.
  - `bottom 420px` двигает картинку по высоте от низа страницы.
- `size` — размер картинки.
  - первое значение, например `110px`, это ширина.
  - второе значение можно оставить `auto`, чтобы высота считалась автоматически.

### Как поднять картинку выше на mobile
Меняй `top` на меньшее значение:
- было: `top 1500px`
- стало: `top 1380px`

Или меняй `bottom` на большее значение:
- было: `bottom 420px`
- стало: `bottom 520px`

### В каких файлах что отвечает за sitebg
- `assets/js/config.js` — здесь задаются сами позиции и размеры decor-иконок.
- `assets/js/app.js` — здесь эти настройки читаются и рендерятся в отдельные DOM-слои, чтобы `top` / `bottom` на mobile реально работали.
- `assets/css/theme.css` — здесь находятся стили слоя `.site-bg-layer-host` и картинок `.site-bg-layer`.

### Где меняется приклейка KPI к icons на desktop
Открой:
- `assets/css/components.css`

Смотри блоки:
- `.hero--index`
- `.hero--index #heroKpis`
- `.hero--index + .hero-quick-links`

Именно там настраивается, насколько близко KPI-блок hero стоит к блоку icons на ПК.
