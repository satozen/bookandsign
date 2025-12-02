/*
 * E-Sign - Page de Confirmation
 * Confirmation de la demande d'installation laveuse/sécheuse
 * Affiche le résumé complet avec signature
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './complete.module.css'

interface TimeSlot {
  day: string
  period: string
}

interface BookingData {
  name: string
  email: string
  phone: string
  address: string
  floor: string
  service: string
  serviceName: string
  price: number
  availability: TimeSlot[]
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

  const handleNewBooking = () => {
    sessionStorage.clear()
    router.push('/')
  }

  if (!booking) return null

  const taxAmount = booking.price * 0.14975
  const totalAmount = booking.price + taxAmount

  // Group availability by day
  const groupedAvailability = booking.availability.reduce((acc, slot) => {
    if (!acc[slot.day]) acc[slot.day] = []
    acc[slot.day].push(slot.period)
    return acc
  }, {} as Record<string, string[]>)

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.success}>
          <div className={styles.checkmark}>✓</div>
          <h1>Demande confirmée!</h1>
          <p>Votre contrat a été signé avec succès</p>
        </div>

        <div className={styles.card}>
          <h2>Résumé de l'installation</h2>
          
          <div className={styles.details}>
            <div className={styles.row}>
              <span>👤</span>
              <div>
                <strong>{booking.name}</strong>
                <p>{booking.phone}</p>
              </div>
            </div>
            <div className={styles.row}>
              <span>🔧</span>
              <div>
                <strong>{booking.serviceName}</strong>
                <p>{totalAmount.toFixed(2)}$ (taxes incluses)</p>
              </div>
            </div>
            <div className={styles.row}>
              <span>📍</span>
              <div>
                <strong>{booking.address}</strong>
                <p>{booking.floor}</p>
              </div>
            </div>
          </div>

          <div className={styles.availabilitySection}>
            <label>📅 Vos disponibilités</label>
            <div className={styles.slotsList}>
              {Object.entries(groupedAvailability).map(([day, periods]) => (
                <div key={day} className={styles.slotItem}>
                  <strong>{day}:</strong> {periods.join(', ')}
                </div>
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

        <div className={styles.nextSteps}>
          <h3>Prochaines étapes</h3>
          <ul>
            <li>✅ Nous avons reçu votre demande</li>
            <li>📞 Nous vous contacterons sous 24h pour confirmer la date</li>
            <li>💳 Paiement à effectuer lors de l'installation</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <p>Un courriel de confirmation a été envoyé à {booking.email}</p>
          <button className={styles.newBtn} onClick={handleNewBooking}>
            Faire une autre demande
          </button>
        </div>
      </div>
    </main>
  )
}
