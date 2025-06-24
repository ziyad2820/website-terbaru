import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Engineer Portfolio - Data Science & Machine Learning Expert",
  description:
    "Professional portfolio of an AI Engineer and Data Scientist specializing in machine learning, AI integration, and intelligent solutions.",
  keywords: "AI Engineer, Data Scientist, Machine Learning, AI Integration, Portfolio",
  authors: [{ name: "AI Portfolio" }],
  openGraph: {
    title: "AI Engineer Portfolio",
    description: "Transforming data into intelligent solutions",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
