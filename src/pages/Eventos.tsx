import { useApp } from '../context/AppContext'
import { DevNavButtons } from './DevNavButtons'

export default function Eventos() {
  const { events } = useApp()
  return (
    <section>
      <h1>Eventos</h1>
      <ul>
        {events.map(e => (
          <li key={e.id}>
            <strong>{e.title}</strong> — {new Date(e.date).toLocaleString()} {e.location ? '• '+e.location : ''}
          </li>
        ))}
      </ul>
      <DevNavButtons />
    </section>
  )
}
import { EditEventForm } from '../components/events/EditEventForm'
import { NewEventForm } from '../components/events/NewEventForm'
import { useEvents } from '../context/EventContext'
import { DevNavButtons } from './DevNavButtons'
import { useState, type FormEvent } from 'react'


export default function Eventos() {

  const { events, createNewEvent, deleteEvent, editEvent } = useEvents()
  const [isCreating, setIsCreating] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  const handleNewEvent = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const ubication = formData.get('ubication') as string
    const date = formData.get('date') as string
    const startTime = formData.get('startTime') as string
    const duration = parseFloat(formData.get('duration') as string)

    // ✅ CALCULAR automáticamente la hora de fin
    const startDate = new Date(`${date}T${startTime}:00`)
    const endDate = new Date(startDate.getTime() + (duration * 60 * 60 * 1000)) // Sumar duración en milisegundos

    // Convertir a formato ISO
    const startDateISO = startDate.toISOString().slice(0, 19) // Sin la Z
    const endDateISO = endDate.toISOString().slice(0, 19)

    // Crear el nuevo evento
    const newEvent = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      description,
      ubication,
      startDate: startDateISO,
      endDate: endDateISO
    }

    createNewEvent(newEvent)
    setIsCreating(false)
  }