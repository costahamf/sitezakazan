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
