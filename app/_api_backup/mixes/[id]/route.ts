import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

const dataFilePath = path.join(process.cwd(), "data", "mixes.json")

// PATCH - Обновить микс
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверка авторизации
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = parseInt(params.id)
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
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

    // Находим микс по ID
    const mixIndex = data.classic.findIndex((mix: any) => mix.id === id)
    if (mixIndex === -1) {
      return NextResponse.json({ error: "Mix not found" }, { status: 404 })
    }

    // Обновляем микс
    data.classic[mixIndex] = {
      ...data.classic[mixIndex],
      name,
      description,
      image: image || data.classic[mixIndex].image,
      tobaccos: tobaccos || [],
    }

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, mix: data.classic[mixIndex] }, { status: 200 })
  } catch (error) {
    console.error("Error updating mix:", error)
    return NextResponse.json({ error: "Failed to update mix" }, { status: 500 })
  }
}

