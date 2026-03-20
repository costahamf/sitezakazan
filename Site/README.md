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


## 6) Как самому менять высоту hero и положение KPI-блоков

### KPI-блоки под hero и рядом с icons
Теперь KPI главной страницы стоят **не внутри hero**, а в белом блоке сразу под ним — слева от блока с иконками/ссылками.

Если нужно двигать их или менять размеры:

1. **Разметка блока** — файл `index.html`
   - Секция под hero находится в блоке:
     - `section.hero-quick-links.hero-quick-links--summary`
   - KPI рендерятся в контейнер:
     - `#heroKpis`
   - Блок с иконками находится рядом в:
     - `.hero-quick-links-grid`

2. **Отступы и высота hero** — файл `assets/css/components.css`
   Меняй эти селекторы:
   - `.hero` — общий верхний/нижний отступ hero
   - `.hero--index` — минимальная высота главного hero
   - `.hero-mobile-actions` — расстояние от мобильных кнопок до низа hero
   - `.hero-quick-links` — верхний/нижний отступ белой секции под hero
   - `.hero-kpis-panel` — внутренние отступы и визуальная “высота” контейнера KPI
   - `.hero-kpis-panel__title` — расстояние между заголовком и карточками KPI

3. **Содержимое KPI** — файл `assets/js/data.js`
   - Блок `hero.kpis` отвечает за сами цифры/подписи.
   - На mobile сейчас выводятся только 2 KPI, на desktop — весь список.

4. **Логика вывода KPI** — файл `assets/js/render-index.js`
   - Функция `renderHero()` вставляет KPI в `#heroKpis`.
   - Если захочешь поменять количество KPI на mobile, ищи там условие:
     - `matchMedia('(max-width: 991.98px)')`

### Что менять, если надо сделать hero выше или ниже

Смотри в `assets/css/components.css`:

- `.hero { padding-top / padding-bottom }`
  - меняет внутренние отступы у всех hero-блоков;
- `.hero--index { min-height: ... }`
  - меняет минимальную высоту hero именно на главной;
- `@media (min-width: 992px) { .hero--index { ... } }`
  - desktop-версия высоты;
- `@media (max-width: 991.98px) { .hero--index { ... } }`
  - tablet/mobile-версия;
- `@media (max-width: 576px) { .hero--index { ... } }`
  - отдельная тонкая настройка для маленьких экранов.

Практически:
- если hero слишком высокий на desktop — уменьши `min-height` в desktop media block;
- если на mobile слишком много пустоты — уменьши `min-height` в mobile media block;
- если нужно только чуть поднять/опустить контент — чаще лучше менять `padding-top` / `padding-bottom`, а не `min-height`.

## 7) Как менять высоту / вертикальное положение siteBg-иконок на mobile

### Почему `top` в `components.css` не меняется
Потому что mobile-декор сайта сейчас управляется **не из `components.css`**, а из JavaScript-конфига:
- `assets/js/config.js`

Именно здесь лежат позиции фоновых иконок:
- `media.siteBgLayers.desktop`
- `media.siteBgLayers.mobile`

Пример mobile-слоя:

```js
{ src: "assets/img/sitebg-decor/Chart.webp", position: "right -24px top 110px", size: "110px auto" }
```

### Что именно менять

Открой `assets/js/config.js` и правь у нужной иконки:

- `position: "... top 110px"`
  - это вертикальная позиция сверху;
- `position: "... bottom 320px"`
  - это вертикальная позиция снизу;
- `size: "110px auto"`
  - это размер самой иконки;
- `left` / `right`
  - это горизонтальное положение.

### Почему left/right меняются, а top как будто нет
Обычно причина одна из двух:

1. Ты менял не тот файл.
   - Для mobile siteBg-иконок надо менять **`assets/js/config.js`**, а не `assets/css/components.css`.

2. У иконки задано `bottom`, а не `top`.
   - Если в объекте стоит `bottom: ...` (в строке `position` это записано как `bottom 320px`), то изменение `top` ничего не даст.
   - Нужно менять именно `bottom` у этого конкретного слоя.

### Как понять, где искать нужную иконку

В `assets/js/config.js` у каждого слоя есть:
- `src` — какая картинка используется;
- `position` — где она стоит;
- `size` — какого она размера.

Например:
- `Chart.webp` — верхняя правая иконка;
- `book.webp` — левая иконка ниже;
- `chess.webp` — правая иконка ещё ниже;
- `test.webp` — нижняя иконка.

### Быстрый алгоритм, если нужно подвинуть mobile-декор

1. Открой `assets/js/config.js`
2. Найди `media.siteBgLayers.mobile`
3. Найди нужный `src`
4. Меняй:
   - `top Npx` — если иконка привязана сверху
   - `bottom Npx` — если иконка привязана снизу
   - `size: "Npx auto"` — если нужно увеличить/уменьшить саму иконку
5. Обнови страницу без кэша

### Если всё-таки хочется управлять через CSS
Сейчас проект устроен так, что эти иконки создаются скриптом в `assets/js/app.js`, а координаты скрипт берет из `assets/js/config.js`.

Поэтому для этого проекта правильная точка изменения — именно `config.js`.
Если захочешь перевести управление в CSS, тогда уже надо будет менять логику в `assets/js/app.js`, где работают функции:
- `renderSiteBgLayers()`
- `parseInsetPosition()`
- `parseLayerSize()`
