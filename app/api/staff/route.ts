import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

const dataFilePath = path.join(process.cwd(), "data", "staff.json")

// GET - Получить всех мастеров
export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading staff:", error)
    return NextResponse.json({ error: "Failed to read staff" }, { status: 500 })
  }
}

// POST - Добавить нового мастера
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, role, image } = body

    // Валидация
    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 })
    }

    // Читаем текущие данные
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    // Находим максимальный ID
    const maxId = Math.max(...data.map((staff: any) => staff.id), 0)

    // Создаем нового мастера
    const newStaff = {
      id: maxId + 1,
      name,
      role,
      image: image || "/placeholder-user.jpg",
    }

    // Добавляем в массив
    data.push(newStaff)

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, staff: newStaff }, { status: 201 })
  } catch (error) {
    console.error("Error adding staff:", error)
    return NextResponse.json({ error: "Failed to add staff" }, { status: 500 })
  }
}

// DELETE - Удалить мастера
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

    // Удаляем мастера
    const filtered = data.filter((staff: any) => staff.id !== id)

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting staff:", error)
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 })
  }
}

