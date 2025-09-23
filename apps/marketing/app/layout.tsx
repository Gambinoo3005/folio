import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Inter, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Portfolio CMS - Bespoke portfolio websites with built-in CMS",
  description: "Custom full-stack builds tailored to your craft—fast, secure, and effortless to update.",
  generator: "Portfolio CMS",
  openGraph: {
    title: "Portfolio CMS - Bespoke portfolio websites with built-in CMS",
    description: "Custom full-stack builds tailored to your craft—fast, secure, and effortless to update.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${manrope.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
          {/* TODO: Replace with actual Plausible domain */}
        </ThemeProvider>
      </body>
    </html>
  )
}
