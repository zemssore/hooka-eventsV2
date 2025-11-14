import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

const reviewsFilePath = path.join(process.cwd(), "data", "reviews.json")

// GET - получить все отзывы (для админ-панели)
export async function GET(request: NextRequest) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const fileContents = await fs.readFile(reviewsFilePath, "utf8")
    const reviews = JSON.parse(fileContents)
    
    // Возвращаем все отзывы для админ-панели
    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    console.error("Error reading reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - обновить статус отзыва (одобрить/отклонить)
export async function PATCH(request: NextRequest) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, status } = data

    if (!id || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Читаем существующие отзывы
    const fileContents = await fs.readFile(reviewsFilePath, "utf8")
    const reviews = JSON.parse(fileContents)

    // Обновляем статус отзыва
    const updatedReviews = reviews.map((review: any) =>
      review.id === id ? { ...review, status } : review
    )

    // Сохраняем обратно в файл
    await fs.writeFile(reviewsFilePath, JSON.stringify(updatedReviews, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - удалить отзыв
export async function DELETE(request: NextRequest) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get("id") || "0")

    if (!id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Читаем существующие отзывы
    const fileContents = await fs.readFile(reviewsFilePath, "utf8")
    const reviews = JSON.parse(fileContents)

    // Удаляем отзыв
    const updatedReviews = reviews.filter((review: any) => review.id !== id)

    // Сохраняем обратно в файл
    await fs.writeFile(reviewsFilePath, JSON.stringify(updatedReviews, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

