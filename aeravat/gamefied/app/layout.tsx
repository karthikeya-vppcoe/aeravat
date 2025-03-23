import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { XPProvider } from "@/lib/xp-context"
import { XPNotifications } from "@/components/xp-notifications"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkillQuest - Gamified Learning Platform",
  description: "Level up your coding skills with AI-powered challenges",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <XPProvider>
          {children}
          <XPNotifications />
        </XPProvider>
      </body>
    </html>
  )
}



import './globals.css'