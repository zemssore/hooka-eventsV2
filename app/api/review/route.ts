import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Валидация
    if (!data.name || !data.company || !data.text || !data.rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Здесь можно сохранить в БД или отправить на модерацию
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    if (telegramBotToken && telegramChatId) {
      const stars = "⭐".repeat(data.rating)
      const message = `
📝 <b>Новый отзыв</b>

${stars}

👤 <b>Автор:</b> ${data.name}
🏢 <b>Компания:</b> ${data.company}
💬 <b>Отзыв:</b>
${data.text}

⏰ <i>${new Date().toLocaleString("ru-RU")}</i>
      `.trim()

      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: "HTML",
        }),
      }).catch((err) => console.error("Telegram error:", err))
    }

    return NextResponse.json({ success: true, message: "Review submitted for moderation" }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
