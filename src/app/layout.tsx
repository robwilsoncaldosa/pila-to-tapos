import type { Metadata, Viewport } from "next"
import { Atkinson_Hyperlegible } from "next/font/google"
import { LocaleProvider } from "@/i18n"
import { getLocale, getT } from "@/i18n/server"

import "./globals.css"

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return { title: "Pila to Tapos", description: t("meta.description") }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={atkinson.variable}>
      <body>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  )
}
