import { ReactNode } from 'react';
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FloatingContact from "@/components/floating-contact"
import Providers from "./providers"

const inter = localFont({
  src: "../public/fonts/Inter-Regular.ttf",
  weight: "400",
  style: "normal",
})

export const metadata: Metadata = {
  title: "Motion Muse",
  description: "Innovative marketing solutions with AI-powered video generation",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <FloatingContact />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
