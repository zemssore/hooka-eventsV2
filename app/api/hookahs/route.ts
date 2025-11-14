import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

const dataFilePath = path.join(process.cwd(), "data", "hookahs.json")

// GET - Получить все кальяны
export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading hookahs:", error)
    return NextResponse.json({ error: "Failed to read hookahs" }, { status: 500 })
  }
}

// POST - Добавить новый кальян
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
    const maxId = Math.max(...data.map((hookah: any) => hookah.id), 0)

    // Создаем новый кальян
    const newHookah: any = {
      id: maxId + 1,
      name,
      description,
      image: image || "/placeholder.svg",
    }
    
    // Добавляем табаки, если они есть
    if (tobaccos && Array.isArray(tobaccos) && tobaccos.length > 0) {
      newHookah.tobaccos = tobaccos.filter((t: any) => t.brand && t.flavor)
    }

    // Добавляем в массив
    data.push(newHookah)

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, hookah: newHookah }, { status: 201 })
  } catch (error) {
    console.error("Error adding hookah:", error)
    return NextResponse.json({ error: "Failed to add hookah" }, { status: 500 })
  }
}

// PATCH - Обновить кальян
export async function PATCH(request: NextRequest) {
  try {
    // Проверка авторизации
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, image, tobaccos } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    // Читаем текущие данные
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    // Находим и обновляем кальян
    const hookahIndex = data.findIndex((hookah: any) => hookah.id === id)
    if (hookahIndex === -1) {
      return NextResponse.json({ error: "Hookah not found" }, { status: 404 })
    }

    // Обновляем данные
    if (name) data[hookahIndex].name = name
    if (description) data[hookahIndex].description = description
    if (image !== undefined) data[hookahIndex].image = image
    if (tobaccos !== undefined) {
      if (Array.isArray(tobaccos) && tobaccos.length > 0) {
        data[hookahIndex].tobaccos = tobaccos.filter((t: any) => t.brand && t.flavor)
      } else {
        delete data[hookahIndex].tobaccos
      }
    }

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, hookah: data[hookahIndex] }, { status: 200 })
  } catch (error) {
    console.error("Error updating hookah:", error)
    return NextResponse.json({ error: "Failed to update hookah" }, { status: 500 })
  }
}

// DELETE - Удалить кальян
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

    // Удаляем кальян
    const filtered = data.filter((hookah: any) => hookah.id !== id)

    // Сохраняем обратно в файл
    await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting hookah:", error)
    return NextResponse.json({ error: "Failed to delete hookah" }, { status: 500 })
  }
}

