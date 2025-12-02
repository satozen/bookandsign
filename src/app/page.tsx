/*
 * E-Sign Plateforme de Réservation - Page d'accueil
 * Formulaire de réservation - collecte nom, courriel, disponibilités et service
 * L'utilisateur peut sélectionner plusieurs dates de disponibilité
 * Redirige vers la page de signature après soumission
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
    service: '',
  })
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [currentDate, setCurrentDate] = useState('')
  const [loading, setLoading] = useState(false)

  const services = [
    'Location de jeux gonflables',
    'Forfait fête',
    'Installation événement',
    'Location journée complète',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Stocker les données de réservation dans sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify({
      ...formData,
      dates: availableDates
    }))
    
    // Naviguer vers la signature du contrat
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

  const addDate = () => {
    if (currentDate && !availableDates.includes(currentDate)) {
      setAvailableDates(prev => [...prev, currentDate].sort())
      setCurrentDate('')
    }
  }

  const removeDate = (dateToRemove: string) => {
    setAvailableDates(prev => prev.filter(d => d !== dateToRemove))
  }

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-CA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  const isValid = formData.name && formData.email && availableDates.length > 0 && formData.service

  // Date minimum = aujourd'hui
  const today = new Date().toISOString().split('T')[0]

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>✍️</div>
          <h1>Réserver & Signer</h1>
          <p>Réservez votre place et signez instantanément</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name">Votre nom</label>
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
            <label>Vos disponibilités</label>
            <div className={styles.dateInput}>
              <input
                type="date"
                value={currentDate}
                min={today}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
              <button 
                type="button" 
                className={styles.addBtn}
                onClick={addDate}
                disabled={!currentDate}
              >
                + Ajouter
              </button>
            </div>
            
            {availableDates.length > 0 && (
              <div className={styles.datesList}>
                {availableDates.map(date => (
                  <div key={date} className={styles.dateTag}>
                    <span>{formatDateShort(date)}</span>
                    <button 
                      type="button"
                      onClick={() => removeDate(date)}
                      className={styles.removeBtn}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {availableDates.length === 0 && (
              <p className={styles.hint}>Ajoutez au moins une date de disponibilité</p>
            )}
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
              <option value="">Choisir un service...</option>
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
            {loading ? 'Traitement...' : 'Continuer vers la signature →'}
          </button>
        </form>

        <footer className={styles.footer}>
          <p>Sécurisé • Rapide • Mobile</p>
        </footer>
      </div>
    </main>
  )
}
