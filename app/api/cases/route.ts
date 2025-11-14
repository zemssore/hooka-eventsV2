import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

const dataFilePath = path.join(process.cwd(), "data", "cases.json")

// GET - Получить все кейсы
export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading cases:", error)
    return NextResponse.json({ error: "Failed to read cases" }, { status: 500 })
  }
}

// POST - Добавить новый кейс
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, image } = body

    // Валидация
    if (!title || !image) {
      return NextResponse.json({ error: "Title and image are required" }, { status: 400 })
    }

    // Читаем текущие данные
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    // Находим максимальный ID
    const maxId = Math.max(...data.map((caseItem: any) => caseItem.id), 0)

    // Создаем новый кейс
    const newCase = {
      id: maxId + 1,
      title,
      image,
      category: "general", // Можно оставить для совместимости
    }

    // Добавляем в массив
    data.push(newCase)

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, case: newCase }, { status: 201 })
  } catch (error) {
    console.error("Error adding case:", error)
    return NextResponse.json({ error: "Failed to add case" }, { status: 500 })
  }
}

// PATCH - Обновить кейс
export async function PATCH(request: NextRequest) {
  try {
    // Проверка авторизации
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, image } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    // Читаем текущие данные
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    // Находим и обновляем кейс
    const caseIndex = data.findIndex((caseItem: any) => caseItem.id === id)
    if (caseIndex === -1) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    // Обновляем данные
    if (title) data[caseIndex].title = title
    if (image !== undefined) data[caseIndex].image = image

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, case: data[caseIndex] }, { status: 200 })
  } catch (error) {
    console.error("Error updating case:", error)
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 })
  }
}

// DELETE - Удалить кейс
export async function DELETE(request: NextRequest) {
  try {
    // Проверка авторизации
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get("id") || "0")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    // Читаем текущие данные
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    // Удаляем кейс
    const filtered = data.filter((caseItem: any) => caseItem.id !== id)

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting case:", error)
    return NextResponse.json({ error: "Failed to delete case" }, { status: 500 })
  }
}

