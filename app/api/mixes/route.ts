import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

export const dynamic = 'force-dynamic'

const dataFilePath = path.join(process.cwd(), "data", "mixes.json")

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

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, image, tobaccos } = body

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    const maxId = Math.max(...data.classic.map((mix: any) => mix.id), 0)

    const newMix = {
      id: maxId + 1,
      name,
      description,
      image: image || null,
      tobaccos: tobaccos || [],
    }

    data.classic.push(newMix)

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, mix: newMix }, { status: 201 })
  } catch (error) {
    console.error("Error adding mix:", error)
    return NextResponse.json({ error: "Failed to add mix" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get("id") || "0")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    data.classic = data.classic.filter((mix: any) => mix.id !== id)

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting mix:", error)
    return NextResponse.json({ error: "Failed to delete mix" }, { status: 500 })
  }
}

