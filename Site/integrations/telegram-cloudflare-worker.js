/**
 * Cloudflare Worker: receive lead JSON and forward to Telegram.
 * Deploy and set secrets:
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    const data = await request.json().catch(()=> ({}));

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

    const tgUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        disable_web_page_preview: true
      })
    });

    if (!res.ok) {
      const t = await res.text().catch(()=> "");
      return new Response("Telegram error: " + t, { status: 500 });
    }

    return new Response(JSON.stringify({ ok:true }), {
      status: 200,
      headers: { "Content-Type":"application/json" }
    });
  }
};
