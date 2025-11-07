import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"

const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hookah Events — Кальянный кейтеринг для мероприятий в Москве",
  description:
    "Премиальный кальянный кейтеринг под ключ для корпоративов, свадеб, вечеринок и конференций в Москве и области. Оборудование, табак, персонал, обслуживание.",
  keywords: "кальян, кейтеринг, мероприятия, Москва, корпоратив, свадьба, события",
  openGraph: {
    title: "Hookah Events — Кальянный кейтеринг",
    description: "Премиальный кальянный кейтеринг под ключ для ваших событий",
    type: "website",
    url: "https://hookah-events.ru",
  },
  authors: [{ name: "Hookah Events" }],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Принудительно устанавливаем светлую тему (белый фон)
              document.documentElement.classList.remove('dark')
              localStorage.setItem('theme', 'light')
            `,
          }}
        />
      </head>
      <body className={`${geistMono.className} bg-background text-foreground antialiased`}>{children}</body>
    </html>
  )
}
