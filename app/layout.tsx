import type React from "react"
import type { Metadata } from "next"
import { Geist, Libre_Baskerville } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "RealFlow – AI Engine for Real Estate Deals",
  description:
    "RealFlow sources, qualifies, and connects you with high-intent real estate owners, buyers, and borrowers using AI-driven outreach.",
  keywords: [
    "Real Estate AI",
    "Deal Finder",
    "Real Estate Automation",
    "Commercial Real Estate",
    "RealFlow",
    "AI for Real Estate",
  ],
  authors: [{ name: "RealFlow" }],
  generator: "v0.app",
  metadataBase: new URL("https://realflow.co"),
  openGraph: {
    title: "RealFlow – AI Engine for Real Estate Deals",
    description: "Source, qualify, and book high-intent real estate meetings automatically.",
    url: "https://realflow.co",
    siteName: "RealFlow",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealFlow – AI Engine for Real Estate Deals",
    description: "Source, qualify, and book high-intent real estate meetings automatically.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${libreBaskerville.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <Script
          id="warmly-script-loader"
          src="https://opps-widget.getwarmly.com/warmly.js?clientId=836ca9aa13d9d04cd9583d4ca9da4fe9"
          defer
        />
      </body>
    </html>
  )
}
