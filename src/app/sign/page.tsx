/*
 * E-Sign Page de Signature de Contrat
 * Affiche les termes du contrat avec les disponibilités sélectionnées
 * L'utilisateur dessine sa signature et soumet pour compléter la réservation
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './sign.module.css'

interface BookingData {
  name: string
  email: string
  dates: string[]
  service: string
}

export default function SignPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Récupérer les données de réservation depuis sessionStorage
    const data = sessionStorage.getItem('bookingData')
    if (data) {
      setBooking(JSON.parse(data))
    } else {
      router.push('/')
    }

    // Configurer le canvas
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
    
    // Récupérer la signature en URL de données
    const signatureData = canvasRef.current?.toDataURL()
    
    // Stocker la signature et naviguer vers la confirmation
    sessionStorage.setItem('signatureData', signatureData || '')
    
    setTimeout(() => {
      router.push('/complete')
    }, 800)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-CA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  if (!booking) return null

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Signer le contrat</h1>
          <p>Révisez et signez pour confirmer votre réservation</p>
        </header>

        <div className={styles.contract}>
          <h2>Contrat de location</h2>
          
          <div className={styles.details}>
            <div className={styles.row}>
              <span>Client</span>
              <strong>{booking.name}</strong>
            </div>
            <div className={styles.row}>
              <span>Service</span>
              <strong>{booking.service}</strong>
            </div>
          </div>

          <div className={styles.datesSection}>
            <span className={styles.datesLabel}>Disponibilités</span>
            <div className={styles.datesList}>
              {booking.dates.map(date => (
                <span key={date} className={styles.dateTag}>
                  {formatDate(date)}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.terms}>
            <p>
              En signant ci-dessous, j'accepte les termes et conditions de location. 
              J'accepte la responsabilité de l'équipement pendant la période de location 
              et j'accepte les modalités de paiement spécifiées. Je confirme mes disponibilités 
              pour les dates indiquées ci-dessus.
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
