/*
 * E-Sign Contract Signing Page
 * Displays contract terms and provides touch-optimized signature pad
 * User draws signature and submits to complete booking
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './sign.module.css'

interface BookingData {
  name: string
  email: string
  date: string
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
    // Get booking data from sessionStorage
    const data = sessionStorage.getItem('bookingData')
    if (data) {
      setBooking(JSON.parse(data))
    } else {
      router.push('/')
    }

    // Set up canvas
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
    
    // Get signature as data URL
    const signatureData = canvasRef.current?.toDataURL()
    
    // Store signature and navigate to confirmation
    sessionStorage.setItem('signatureData', signatureData || '')
    
    setTimeout(() => {
      router.push('/complete')
    }, 800)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!booking) return null

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Sign Contract</h1>
          <p>Review and sign to confirm your booking</p>
        </header>

        <div className={styles.contract}>
          <h2>Rental Agreement</h2>
          
          <div className={styles.details}>
            <div className={styles.row}>
              <span>Client</span>
              <strong>{booking.name}</strong>
            </div>
            <div className={styles.row}>
              <span>Service</span>
              <strong>{booking.service}</strong>
            </div>
            <div className={styles.row}>
              <span>Date</span>
              <strong>{formatDate(booking.date)}</strong>
            </div>
          </div>

          <div className={styles.terms}>
            <p>
              By signing below, I agree to the rental terms and conditions. 
              I accept responsibility for the equipment during the rental period 
              and agree to the payment terms specified.
            </p>
          </div>
        </div>

        <div className={styles.signatureSection}>
          <div className={styles.signatureHeader}>
            <label>Your Signature</label>
            {hasSignature && (
              <button className={styles.clearBtn} onClick={clearSignature}>
                Clear
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
                ✍️ Draw your signature here
              </div>
            )}
          </div>
        </div>

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!hasSignature || loading}
        >
          {loading ? 'Submitting...' : 'Confirm & Sign ✓'}
        </button>
      </div>
    </main>
  )
}

