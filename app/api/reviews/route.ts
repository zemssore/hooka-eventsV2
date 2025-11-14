import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { checkAdminAuth } from "@/lib/auth"

export const dynamic = 'force-dynamic'

const reviewsFilePath = path.join(process.cwd(), "data", "reviews.json")

export async function GET(request: NextRequest) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const fileContents = await fs.readFile(reviewsFilePath, "utf8")
    const reviews = JSON.parse(fileContents)
    
    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    console.error("Error reading reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { id, status } = data

    if (!id || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const fileContents = await fs.readFile(reviewsFilePath, "utf8")
    const reviews = JSON.parse(fileContents)

    const updatedReviews = reviews.map((review: any) =>
      review.id === id ? { ...review, status } : review
    )

    await fs.writeFile(reviewsFilePath, JSON.stringify(updatedReviews, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const isAuthenticated = await checkAdminAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get("id") || "0")

    if (!id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const fileContents = await fs.readFile(reviewsFilePath, "utf8")
    const reviews = JSON.parse(fileContents)

    const updatedReviews = reviews.filter((review: any) => review.id !== id)

    await fs.writeFile(reviewsFilePath, JSON.stringify(updatedReviews, null, 2), "utf8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

