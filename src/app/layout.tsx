/*
 * E-Sign - Service d'installation Laveuse/Sécheuse
 * Application de réservation et signature électronique
 * Laveuse ou sécheuse: 35$ | Les deux: 60$ + taxes
 */

import '../styles/globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Installation Laveuse/Sécheuse | Réservation',
  description: 'Réservez votre installation de laveuse ou sécheuse et signez le contrat en ligne',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
