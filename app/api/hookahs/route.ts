import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

const dataFilePath = path.join(process.cwd(), "data", "hookahs.json")

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

    const maxId = Math.max(...data.map((hookah: any) => hookah.id), 0)

    const newHookah: any = {
      id: maxId + 1,
      name,
      description,
      image: image || "/placeholder.svg",
    }
    
    if (tobaccos && Array.isArray(tobaccos) && tobaccos.length > 0) {
      newHookah.tobaccos = tobaccos.filter((t: any) => t.brand && t.flavor)
    }

    data.push(newHookah)

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, hookah: newHookah }, { status: 201 })
  } catch (error) {
    console.error("Error adding hookah:", error)
    return NextResponse.json({ error: "Failed to add hookah" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, image, tobaccos } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    const hookahIndex = data.findIndex((hookah: any) => hookah.id === id)
    if (hookahIndex === -1) {
      return NextResponse.json({ error: "Hookah not found" }, { status: 404 })
    }

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

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, hookah: data[hookahIndex] }, { status: 200 })
  } catch (error) {
    console.error("Error updating hookah:", error)
    return NextResponse.json({ error: "Failed to update hookah" }, { status: 500 })
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

    const filtered = data.filter((hookah: any) => hookah.id !== id)

    await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting hookah:", error)
    return NextResponse.json({ error: "Failed to delete hookah" }, { status: 500 })
  }
}

