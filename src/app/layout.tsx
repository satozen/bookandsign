/*
 * E-Sign Booking Platform - Root Layout
 * Simple booking + e-signature app for mobile-first contract signing
 */

import '../styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E-Sign | Book & Sign',
  description: 'Simple booking and e-signature platform',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

