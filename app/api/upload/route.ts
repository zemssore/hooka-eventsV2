import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Проверяем тип файла
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 })
    }

    // Проверяем размер файла (максимум 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
    }

    // Генерируем уникальное имя файла
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${timestamp}-${originalName}`

    // Сохраняем файл в public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    
    // Создаем директорию, если её нет
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
      // Создаем .gitkeep файл
      await writeFile(path.join(uploadsDir, ".gitkeep"), "")
    }

    const filePath = path.join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Возвращаем путь к файлу
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({ success: true, url: fileUrl }, { status: 200 })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

