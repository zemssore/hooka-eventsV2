import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "prices.json")

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading prices:", error)
    return NextResponse.json({ error: "Failed to read prices" }, { status: 500 })
  }
}

