import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mini Rally - Registro de Evento",
  description:
    "Regístrate para el Mini Rally. ¡Prepárate para la emoción del rally! Acceso limitado - 26 de Julio 2025 en Quinta America.",
  keywords: ["mini rally", "evento", "registro", "rally", "carreras", "quinta america"],
  authors: [{ name: "Mini Rally Team" }],
  creator: "Mini Rally",
  publisher: "Mini Rally",
  openGraph: {
    title: "Mini Rally - Registro de Evento",
    description: "¡Prepárate para la emoción del rally! Regístrate ahora para el Mini Rally del 26 de Julio 2025.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mini Rally - Registro de Evento",
    description: "¡Prepárate para la emoción del rally! Regístrate ahora para el Mini Rally del 26 de Julio 2025.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
