import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

export const metadata: Metadata = {
  title: "BoostGram - Get 1000 Free Instagram Followers Every 24 Hours",
  description:
    "Boost your Instagram account with 1000 free followers every 24 hours. Premium packages available. Trusted by 500K+ users worldwide.",
  keywords: "instagram followers, free followers, instagram growth, social media marketing, instagram boost",
  generator: "v0.app",
  openGraph: {
    title: "BoostGram - Free Instagram Followers",
    description: "Get 1000 free Instagram followers every 24 hours. Join 500K+ satisfied users.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BoostGram - Free Instagram Followers",
    description: "Get 1000 free Instagram followers every 24 hours.",
  },
  icons: {
    icon: "/icon.png",              
    shortcut: "/icon.png",    
    apple: "/icon.png",    
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
