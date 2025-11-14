import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

export const dynamic = 'force-dynamic'

const dataFilePath = path.join(process.cwd(), "data", "brands.json")

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading brands:", error)
    return NextResponse.json({ error: "Failed to read brands" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, logo } = body

    if (!name || !logo) {
      return NextResponse.json({ error: "Name and logo are required" }, { status: 400 })
    }

    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    const maxId = Math.max(...data.map((brand: any) => brand.id), 0)

    const newBrand = {
      id: maxId + 1,
      name,
      logo,
    }

    data.push(newBrand)

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, brand: newBrand }, { status: 201 })
  } catch (error) {
    console.error("Error adding brand:", error)
    return NextResponse.json({ error: "Failed to add brand" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, logo } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)

    const brandIndex = data.findIndex((brand: any) => brand.id === id)
    if (brandIndex === -1) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    if (name) data[brandIndex].name = name
    if (logo !== undefined) data[brandIndex].logo = logo

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, brand: data[brandIndex] }, { status: 200 })
  } catch (error) {
    console.error("Error updating brand:", error)
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 })
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

    const filtered = data.filter((brand: any) => brand.id !== id)

    await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting brand:", error)
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 })
  }
}

