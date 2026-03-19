# Integrations (Telegram/CRM)

## Telegram (Cloudflare Worker) — самый простой прод вариант
Файл: `telegram-cloudflare-worker.js`

1) Создай Worker в Cloudflare
2) Добавь ENV переменные:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

3) Деплой Worker
4) В `assets/js/config.js`:
- `forms.mode = "webhook"`
- `forms.endpoint = "https://<твоя_воркер_ссылка>"`

## Telegram (Netlify Function)
Файл: `telegram-netlify-function.js`

1) Добавь в Netlify `netlify/functions/telegram.js`
2) Укажи ENV переменные:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
3) В `config.js` укажи endpoint:
`/.netlify/functions/telegram`

## CRM (amoCRM / Bitrix / др.)
Самый практичный путь:
- отправлять лид в Make.com / Zapier webhook
- дальше распределять в CRM

Фронт уже умеет POST JSON на endpoint — нужен только твой приемник.
