import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")

    if (session && session.value.startsWith("admin_session_")) {
      return NextResponse.json({ authenticated: true }, { status: 200 })
    } else {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}

