/*
 * E-Sign Confirmation Page
 * Shows success message after contract is signed
 * Displays booking summary and signature confirmation
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './complete.module.css'

interface BookingData {
  name: string
  email: string
  date: string
  service: string
}

export default function CompletePage() {
  const router = useRouter()
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [signature, setSignature] = useState<string>('')

  useEffect(() => {
    const bookingData = sessionStorage.getItem('bookingData')
    const signatureData = sessionStorage.getItem('signatureData')

    if (bookingData && signatureData) {
      setBooking(JSON.parse(bookingData))
      setSignature(signatureData)
    } else {
      router.push('/')
    }
  }, [router])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleNewBooking = () => {
    sessionStorage.clear()
    router.push('/')
  }

  if (!booking) return null

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.success}>
          <div className={styles.checkmark}>✓</div>
          <h1>Booking Confirmed!</h1>
          <p>Your contract has been signed successfully</p>
        </div>

        <div className={styles.card}>
          <h2>Booking Details</h2>
          
          <div className={styles.details}>
            <div className={styles.row}>
              <span>📧</span>
              <div>
                <strong>{booking.name}</strong>
                <p>{booking.email}</p>
              </div>
            </div>
            <div className={styles.row}>
              <span>📅</span>
              <div>
                <strong>{formatDate(booking.date)}</strong>
                <p>{booking.service}</p>
              </div>
            </div>
          </div>

          {signature && (
            <div className={styles.signaturePreview}>
              <label>Your Signature</label>
              <img src={signature} alt="Signature" />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <p>A confirmation email has been sent to {booking.email}</p>
          <button className={styles.newBtn} onClick={handleNewBooking}>
            Make Another Booking
          </button>
        </div>
      </div>
    </main>
  )
}

