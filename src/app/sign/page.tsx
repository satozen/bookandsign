/*
 * E-Sign - Page de Signature du Contrat
 * Contrat d'installation laveuse/sécheuse avec détails et tarification
 * L'utilisateur dessine sa signature pour confirmer
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './sign.module.css'

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

export default function SignPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData')
    if (data) {
      setBooking(JSON.parse(data))
    } else {
      router.push('/')
    }

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#2D2926'
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    }
  }, [router])

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const handleSubmit = async () => {
    if (!hasSignature) return
    
    setLoading(true)
    const signatureData = canvasRef.current?.toDataURL()
    sessionStorage.setItem('signatureData', signatureData || '')
    
    setTimeout(() => {
      router.push('/complete')
    }, 800)
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
        <header className={styles.header}>
          <h1>Contrat d'installation</h1>
          <p>Révisez et signez pour confirmer</p>
        </header>

        <div className={styles.contract}>
          <h2>Détails du service</h2>
          
          <div className={styles.details}>
            <div className={styles.row}>
              <span>Client</span>
              <strong>{booking.name}</strong>
            </div>
            <div className={styles.row}>
              <span>Téléphone</span>
              <strong>{booking.phone}</strong>
            </div>
            <div className={styles.row}>
              <span>Service</span>
              <strong>{booking.serviceName}</strong>
            </div>
          </div>

          <div className={styles.addressSection}>
            <span className={styles.label}>📍 Adresse d'installation</span>
            <p className={styles.addressText}>{booking.address}</p>
            <p className={styles.floorText}>Étage: {booking.floor}</p>
          </div>

          <div className={styles.availabilitySection}>
            <span className={styles.label}>📅 Disponibilités</span>
            <div className={styles.slotsList}>
              {Object.entries(groupedAvailability).map(([day, periods]) => (
                <div key={day} className={styles.slotRow}>
                  <span className={styles.slotDay}>{day}:</span>
                  <span className={styles.slotPeriods}>{periods.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.pricing}>
            <div className={styles.priceRow}>
              <span>Sous-total</span>
              <span>{booking.price.toFixed(2)}$</span>
            </div>
            <div className={styles.priceRow}>
              <span>TPS + TVQ</span>
              <span>{taxAmount.toFixed(2)}$</span>
            </div>
            <div className={`${styles.priceRow} ${styles.total}`}>
              <span>Total à payer</span>
              <span>{totalAmount.toFixed(2)}$</span>
            </div>
          </div>

          <div className={styles.terms}>
            <p>
              En signant ci-dessous, je confirme ma demande d'installation et j'accepte 
              les conditions suivantes: le paiement sera effectué lors de l'installation, 
              je m'engage à être présent(e) au moment convenu, et je confirme que 
              l'emplacement est prêt pour l'installation de l'appareil.
            </p>
          </div>
        </div>

        <div className={styles.signatureSection}>
          <div className={styles.signatureHeader}>
            <label>Votre signature</label>
            {hasSignature && (
              <button className={styles.clearBtn} onClick={clearSignature}>
                Effacer
              </button>
            )}
          </div>
          
          <div className={styles.canvasWrapper}>
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className={styles.canvas}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasSignature && (
              <div className={styles.placeholder}>
                ✍️ Dessinez votre signature ici
              </div>
            )}
          </div>
        </div>

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!hasSignature || loading}
        >
          {loading ? 'Envoi en cours...' : 'Confirmer et signer ✓'}
        </button>
      </div>
    </main>
  )
}
