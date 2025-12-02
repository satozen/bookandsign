/*
 * E-Sign - Service d'installation laveuse/sécheuse
 * Formulaire de réservation avec créneaux horaires spécifiques
 * Laveuse ou sécheuse: 35$ | Les deux: 60$ + taxes
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type TimeSlot = {
  day: string
  period: string
}

const SCHEDULE = [
  { day: 'Lundi', periods: ['AM', 'PM'] },
  { day: 'Mardi', periods: ['AM', 'PM'] },
  { day: 'Mercredi', periods: ['19h - 21h'] },
  { day: 'Jeudi', periods: ['AM', 'PM', 'Soir'] },
  { day: 'Samedi', periods: ['AM', 'PM', 'Soir'] },
  { day: 'Dimanche', periods: ['AM', 'PM', 'Soir'] },
]

const SERVICES = [
  { id: 'washer', name: 'Laveuse seulement', price: 35 },
  { id: 'dryer', name: 'Sécheuse seulement', price: 35 },
  { id: 'both', name: 'Laveuse et sécheuse', price: 60 },
]

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    floor: '',
    service: '',
  })
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const selectedService = SERVICES.find(s => s.id === formData.service)
    
    sessionStorage.setItem('bookingData', JSON.stringify({
      ...formData,
      serviceName: selectedService?.name,
      price: selectedService?.price,
      availability: selectedSlots,
    }))
    
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

  const toggleSlot = (day: string, period: string) => {
    const exists = selectedSlots.some(s => s.day === day && s.period === period)
    if (exists) {
      setSelectedSlots(prev => prev.filter(s => !(s.day === day && s.period === period)))
    } else {
      setSelectedSlots(prev => [...prev, { day, period }])
    }
  }

  const isSlotSelected = (day: string, period: string) => {
    return selectedSlots.some(s => s.day === day && s.period === period)
  }

  const selectedService = SERVICES.find(s => s.id === formData.service)
  const taxAmount = selectedService ? selectedService.price * 0.14975 : 0
  const totalAmount = selectedService ? selectedService.price + taxAmount : 0

  const isValid = formData.name && formData.email && formData.phone && 
                  formData.address && formData.floor && formData.service && 
                  selectedSlots.length > 0

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>🔧</div>
          <h1>Installation Laveuse/Sécheuse</h1>
          <p>Réservez votre installation et signez le contrat</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Informations personnelles */}
          <div className={styles.section}>
            <h2>Vos informations</h2>
            
            <div className={styles.field}>
              <label htmlFor="name">Nom complet</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Jean Tremblay"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Courriel</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="jean@exemple.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="514-555-1234"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Adresse */}
          <div className={styles.section}>
            <h2>Adresse d'installation</h2>
            
            <div className={styles.field}>
              <label htmlFor="address">Adresse complète</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="123 rue Exemple, Montréal, H1A 1A1"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="floor">Étage</label>
              <select
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez l'étage...</option>
                <option value="Sous-sol">Sous-sol</option>
                <option value="Rez-de-chaussée">Rez-de-chaussée</option>
                <option value="1er étage">1er étage</option>
                <option value="2e étage">2e étage</option>
                <option value="3e étage">3e étage</option>
                <option value="4e étage ou plus">4e étage ou plus</option>
              </select>
            </div>
          </div>

          {/* Service */}
          <div className={styles.section}>
            <h2>Service désiré</h2>
            
            <div className={styles.serviceOptions}>
              {SERVICES.map(service => (
                <label 
                  key={service.id} 
                  className={`${styles.serviceCard} ${formData.service === service.id ? styles.selected : ''}`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    checked={formData.service === service.id}
                    onChange={handleChange}
                  />
                  <span className={styles.serviceName}>{service.name}</span>
                  <span className={styles.servicePrice}>{service.price}$</span>
                </label>
              ))}
            </div>

            {selectedService && (
              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span>Sous-total</span>
                  <span>{selectedService.price.toFixed(2)}$</span>
                </div>
                <div className={styles.priceRow}>
                  <span>TPS + TVQ (14.975%)</span>
                  <span>{taxAmount.toFixed(2)}$</span>
                </div>
                <div className={`${styles.priceRow} ${styles.total}`}>
                  <span>Total</span>
                  <span>{totalAmount.toFixed(2)}$</span>
                </div>
              </div>
            )}
          </div>

          {/* Disponibilités */}
          <div className={styles.section}>
            <h2>Vos disponibilités</h2>
            <p className={styles.hint}>Sélectionnez tous les créneaux où vous êtes disponible</p>
            
            <div className={styles.scheduleGrid}>
              {SCHEDULE.map(({ day, periods }) => (
                <div key={day} className={styles.dayRow}>
                  <span className={styles.dayName}>{day}</span>
                  <div className={styles.periods}>
                    {periods.map(period => (
                      <button
                        key={`${day}-${period}`}
                        type="button"
                        className={`${styles.periodBtn} ${isSlotSelected(day, period) ? styles.periodSelected : ''}`}
                        onClick={() => toggleSlot(day, period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedSlots.length === 0 && (
              <p className={styles.warning}>⚠️ Veuillez sélectionner au moins un créneau</p>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!isValid || loading}
          >
            {loading ? 'Traitement...' : 'Continuer vers la signature →'}
          </button>
        </form>

        <footer className={styles.footer}>
          <p>Sécurisé • Rapide • Professionnel</p>
        </footer>
      </div>
    </main>
  )
}
