# Figma handoff (HTML → Figma)

Полностью “идеального” импорта не существует, но можно сделать **максимально близко**.

## Вариант A (самый быстрый): html.to.design
1) Запусти сайт (VS Code Live Server) или выложи на любой временный домен.
2) В Figma поставь плагин **html.to.design**.
3) Импортируй по URL:
   - `index.html`
   - `program.html`
   - `locations.html`
   - `reviews.html`
4) После импорта:
   - Прогони Auto Layout на секциях
   - Вынеси повторяющиеся блоки в Components (Navbar, Footer, Card, Button, Stat, Pill)
   - Подключи Styles (цвета/типографика)

## Вариант B (точнее): собрать дизайн систему руками
1) Импортируй токены из `design-tokens.json` через **Tokens Studio**.
2) Создай стили:
   - Colors: bg-0/bg-1/bg-2, text-0, muted, accent, accent-2, accent-3, line
   - Effects: shadow
   - Radius: 22/16/12
3) Компоненты:
   - Button: primary (accent), outline
   - Card: dark, glass
   - Stat
   - Pill
   - Location Card
4) Сетка:
   - Desktop frame: 1440px
   - Container: ~1200px (как Bootstrap)
   - Grid: 12 columns, gutter ~24px

## Что в этом шаблоне уже сделано “для Figma”
- Цвета и радиусы в CSS variables (можно 1-в-1 перенести в tokens)
- Повторяющиеся блоки (карточки, кнопки, pill)
- Единый стиль отступов (Bootstrap spacing + свои секции)

Если хочешь — скажи:
- какой шрифт ты хочешь (Montserrat/Manrope/Inter)
- есть ли уже логотип и реальные фото

И я подгоню типографику + сделаю отдельную “страницу-дизайн-систему” (styleguide.html), которую импорт в Figma забирает идеально.
