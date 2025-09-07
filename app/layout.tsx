// app/layout.tsx
import React, { Suspense } from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const keywordsList = [
  // English core + long-tail
  "free instagram followers",
  "get free instagram followers",
  "1k free instagram followers",
  "1000 free instagram followers daily",
  "claim free instagram followers",
  "free followers daily",
  "free followers every 24 hours",
  "how to get instagram followers free",
  "instant instagram followers free",
  "safe instagram followers",
  "verified free followers",
  "free followers no password",
  "free followers no survey",
  "free followers offer",
  "free followers 2025",
  "daily free followers claim",
  "get followers without login",
  "free followers without verification",
  "real instagram followers free",
  "organic-like followers free",
  "free followers for instagram account",
  "best free instagram followers service",
  "claim 1k followers daily",
  "boost instagram followers free",
  "increase instagram followers free",
  "how to increase followers for free",
  "free followers app",
  "free followers website",
  "free followers tool",
  "free followers generator",
  "free followers tips",
  "free instagram likes and followers",
  "free followers for influencers",
  "free followers for business instagram",
  "get followers fast free",
  "free followers worldwide",
  "free followers usa",
  "free followers uk",
  "free followers morocco",
  "safe instagram growth",
  "grow instagram followers free",
  "instagram growth hacks free",
  "free followers without risk",
  "1k followers giveaway",
  "free followers promo",
  "free followers campaign",
  "claim free followers now",
  "daily followers reward",
  "free followers for creators",
  "free followers for personal account",
  "free followers exchange",
  "free followers community",
  // Arabic terms (long-tail + variations)
  "متابعين انستقرام مجاناً",
  "الحصول على متابعين مجاناً",
  "1000 متابع مجاني يومياً",
  "١٠٠٠ متابع مجاني كل ٢٤ ساعة",
  "متابعين مجانيين كل 24 ساعة",
  "ازاي اجيب متابعين مجانا",
  "متابعين انستا مجانا بدون باسورد",
  "اربح متابعين مجانا",
  "زيادة متابعين انستا مجانا",
  "خدمة متابعين مجانية",
  "متابعين مجانيين موثوقين",
  "مواقع متابعين مجاني",
  "برنامج متابعين مجاني",
  "تطبيق متابعين مجاني",
  "كيف احصل على متابعين انستا مجانا",
  "متابعين حقيقيين مجانا",
  "زيادة المتابعين بسرعة",
  "متابعين مجانيين يوميا",
  "مطالبة متابعين يومية",
  "احصل على 1k متابع مجاني",
  "طرق آمنة لزيادة المتابعين",
  "عرض متابعين مجاني",
  "موزع متابعين مجاني",
  "خدمات نمو انستجرام مجاناً"
].join(", ")

export const metadata: Metadata = {
  title: "BoostGram — Get 1K Free Instagram Followers Every 24 Hours",
  description:
    "Boost your Instagram account with 1,000 free followers every 24 hours. Fast delivery after verification. Safe methods and daily claims.",
  keywords: keywordsList,
  openGraph: {
    title: "BoostGram — Get 1K Free Instagram Followers",
    description:
      "Claim 1,000 free Instagram followers every 24 hours. Fast delivery after completing the quick verification.",
    url: "https://www.boostgram.site",
    siteName: "BoostGram",
  },
  twitter: {
    card: "summary_large_image",
    title: "BoostGram — Get 1K Free Instagram Followers",
    description: "Claim 1,000 free Instagram followers every 24 hours."
  },
  alternates: { canonical: "https://www.boostgram.site/" }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#4f46e5" />
          <link rel="canonical" href="https://www.boostgram.site/" />
          <meta name="robots" content="index, follow" />

          {/* <-- فقط الروابط التي قلت أنك تتوفر عليها --> */}
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" href="/icon.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </head>

        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
