/*
 * E-Sign Booking Platform - Home Page
 * Landing page with booking form - collects name, email, date, and service
 * Redirects to contract signing page after submission
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    service: '',
  })
  const [loading, setLoading] = useState(false)

  const services = [
    'Bounce House Rental',
    'Party Package',
    'Event Setup',
    'Full Day Rental',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Store booking data in sessionStorage for the contract page
    sessionStorage.setItem('bookingData', JSON.stringify(formData))
    
    // Navigate to contract signing
    setTimeout(() => {
      router.push('/sign')
    }, 500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const isValid = formData.name && formData.email && formData.date && formData.service

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>✍️</div>
          <h1>Book & Sign</h1>
          <p>Reserve your spot and sign instantly</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Smith"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="date">Event Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="service">Service</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select a service...</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!isValid || loading}
          >
            {loading ? 'Processing...' : 'Continue to Sign →'}
          </button>
        </form>

        <footer className={styles.footer}>
          <p>Secure • Fast • Mobile-friendly</p>
        </footer>
      </div>
    </main>
  )
}

