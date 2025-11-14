import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

const dataFilePath = path.join(process.cwd(), "data", "mixes.json")

// GET - Получить все миксы
export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading mixes:", error)
    return NextResponse.json({ error: "Failed to read mixes" }, { status: 500 })
  }
}

// POST - Добавить новый микс
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, image, tobaccos } = body

    // Валидация
    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    // Читаем текущие данные
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    // Находим максимальный ID
    const maxId = Math.max(...data.classic.map((mix: any) => mix.id), 0)

    // Создаем новый микс
    const newMix = {
      id: maxId + 1,
      name,
      description,
      image: image || null,
      tobaccos: tobaccos || [],
    }

    // Добавляем в массив
    data.classic.push(newMix)

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, mix: newMix }, { status: 201 })
  } catch (error) {
    console.error("Error adding mix:", error)
    return NextResponse.json({ error: "Failed to add mix" }, { status: 500 })
  }
}

// DELETE - Удалить микс
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

    // Удаляем микс
    data.classic = data.classic.filter((mix: any) => mix.id !== id)

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting mix:", error)
    return NextResponse.json({ error: "Failed to delete mix" }, { status: 500 })
  }
}

