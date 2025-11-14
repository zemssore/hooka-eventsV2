import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.phone) {
      return NextResponse.json({ error: "Имя и телефон обязательны" }, { status: 400 })
    }

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    if (telegramBotToken && telegramChatId) {
      const message = `
🎯 <b>Новая заявка</b>

👤 <b>Имя:</b> ${data.name}
📱 <b>Телефон:</b> ${data.phone}
💬 <b>Сообщение:</b>
${data.message}

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

    return NextResponse.json({ success: true, message: "Lead received" }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
