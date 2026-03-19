/**
 * Netlify Function: netlify/functions/telegram.js
 * Env vars:
 *  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 200, body: "OK" };
  }

  const data = JSON.parse(event.body || "{}");

  const lines = [
    "⚽️ Новая заявка (пробное занятие)",
    "",
    `👤 Родитель: ${data.parent_name || "-"}`,
    `📞 Телефон: ${data.phone || "-"}`,
    `🧒 Возраст: ${data.child_age || data.quiz_age || "-"}`,
      `🏷️ Район: ${data.quiz_district || data.district || "-"}`,
      `🎮 Опыт: ${data.quiz_exp || data.exp || "-"}`,
      `🎯 Цель: ${data.quiz_goal || data.goal || "-"}`,
      `🧠 Рекомендация: ${data.quiz_recommendation_format || data.quiz_recommendation || data.format || "-"}${data.quiz_recommendation_freq ? " • " + data.quiz_recommendation_freq : ""}`, 
    `🎯 Формат: ${data.format || "-"}`,
    `📍 Локация: ${data.location_title || data.location_id || "-"}`,
    "",
    `💬 Комментарий: ${data.comment || "-"}`,
    "",
    `🌐 Страница: ${data.page || "-"}`,
    `🕒 Время: ${data.timestamp || "-"}`,
  ];

  const text = lines.join("\n");

  const tgUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  const res = await fetch(tgUrl, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
      disable_web_page_preview: true
    })
  });

  if (!res.ok) {
    const t = await res.text();
    return { statusCode: 500, body: "Telegram error: " + t };
  }

  return { statusCode: 200, body: JSON.stringify({ ok:true }) };
};
