/*
 * E-Sign Page de Confirmation
 * Affiche un message de succès après la signature du contrat
 * Affiche le résumé avec les disponibilités et la signature
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './complete.module.css'

interface BookingData {
  name: string
  email: string
  dates: string[]
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
    return new Date(dateStr).toLocaleDateString('fr-CA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
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
          <h1>Réservation confirmée!</h1>
          <p>Votre contrat a été signé avec succès</p>
        </div>

        <div className={styles.card}>
          <h2>Détails de la réservation</h2>
          
          <div className={styles.details}>
            <div className={styles.row}>
              <span>📧</span>
              <div>
                <strong>{booking.name}</strong>
                <p>{booking.email}</p>
              </div>
            </div>
            <div className={styles.row}>
              <span>🎉</span>
              <div>
                <strong>{booking.service}</strong>
                <p>Service sélectionné</p>
              </div>
            </div>
          </div>

          <div className={styles.datesSection}>
            <label>📅 Vos disponibilités</label>
            <div className={styles.datesList}>
              {booking.dates.map(date => (
                <span key={date} className={styles.dateTag}>
                  {formatDate(date)}
                </span>
              ))}
            </div>
          </div>

          {signature && (
            <div className={styles.signaturePreview}>
              <label>Votre signature</label>
              <img src={signature} alt="Signature" />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <p>Un courriel de confirmation a été envoyé à {booking.email}</p>
          <button className={styles.newBtn} onClick={handleNewBooking}>
            Faire une autre réservation
          </button>
        </div>
      </div>
    </main>
  )
}
