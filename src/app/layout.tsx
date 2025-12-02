/*
 * E-Sign Plateforme de Réservation - Layout Principal
 * Application simple de réservation + signature électronique pour mobile
 */

import '../styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E-Sign | Réserver & Signer',
  description: 'Plateforme simple de réservation et signature électronique',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
