import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 })
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const sessionToken = `admin_session_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const cookieStore = await cookies()
      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })

      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Ошибка при входе" }, { status: 500 })
  }
}

