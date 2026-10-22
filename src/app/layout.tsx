import type { Metadata, Viewport } from "next"
import { Atkinson_Hyperlegible } from "next/font/google"
import "./globals.css"

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Pila to Tapos",
  description:
    "Independent na gabay para sa pag-close ng freelancer registration sa BIR. Hindi opisyal na BIR app.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fil" className={atkinson.variable}>
      <body>{children}</body>
    </html>
  )
}
