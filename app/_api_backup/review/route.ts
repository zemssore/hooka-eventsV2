import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const reviewsFilePath = path.join(process.cwd(), "data", "reviews.json")

export async function GET() {
  try {
    const fileContents = await fs.readFile(reviewsFilePath, "utf8")
    const reviews = JSON.parse(fileContents)
    
    // Возвращаем только одобренные отзывы
    const approvedReviews = reviews.filter((review: any) => review.status === "approved")
    
    return NextResponse.json(approvedReviews, { status: 200 })
  } catch (error) {
    console.error("Error reading reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Валидация
    if (!data.name || !data.text || !data.rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Читаем существующие отзывы
    const fileContents = await fs.readFile(reviewsFilePath, "utf8")
    const reviews = JSON.parse(fileContents)

    // Создаем новый отзыв со статусом "pending"
    const newReview = {
      id: Math.max(...reviews.map((r: any) => r.id), 0) + 1,
      name: data.name,
      company: "", // Оставляем пустым для совместимости со старыми данными
      rating: data.rating,
      text: data.text,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Добавляем новый отзыв
    reviews.push(newReview)

    // Сохраняем обратно в файл
    await fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2), "utf8")

    // Отправляем уведомление в Telegram (если настроено)
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    if (telegramBotToken && telegramChatId) {
      const stars = "⭐".repeat(data.rating)
      const message = `
📝 <b>Новый отзыв на модерацию</b>

${stars}

👤 <b>Автор:</b> ${data.name}
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
