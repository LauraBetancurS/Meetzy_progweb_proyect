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

  const handleEditEvent = (e: FormEvent<HTMLFormElement>, eventId: string) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    // Obtener datos del formulario
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const ubication = formData.get('ubication') as string
    const date = formData.get('date') as string
    const startTime = formData.get('startTime') as string
    const duration = parseFloat(formData.get('duration') as string)

    const startDate = new Date(`${date}T${startTime}:00`)
    const endDate = new Date(startDate.getTime() + (duration * 60 * 60 * 1000))

    const startDateISO = startDate.toISOString().slice(0, 19)
    const endDateISO = endDate.toISOString().slice(0, 19)

    const updatedEvent = {
      id: eventId, // Mantener el mismo ID
      name,
      description,
      ubication,
      startDate: startDateISO,
      endDate: endDateISO
    }

    editEvent(updatedEvent)

    setEditingEventId(null)
  }

  const getDateTimeFromISO = (isoString: string) => {
    const date = new Date(isoString)
    return {
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      time: date.toTimeString().slice(0, 5)   // HH:MM
    }
  }

  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffMs = end.getTime() - start.getTime()
    return diffMs / (1000 * 60 * 60) // Convertir a horas
  }


  return (
    <section>
      <h1>Eventos</h1>
      <button onClick={() => setIsCreating(true)}>Crear nuevo evento</button>
      {
        isCreating &&
        <NewEventForm handleNewEvent={handleNewEvent} setIsCreating={setIsCreating}/>
      }
      <ul>
        {events.map(e => {
          const startDateTime = getDateTimeFromISO(e.startDate)
          const duration = calculateDuration(e.startDate, e.endDate)

          return (
            <li key={e.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <div>
                <strong>{e.name}</strong> / {new Date(e.startDate).toLocaleString()} - {new Date(e.endDate).toLocaleString()} {e.ubication ? '• ' + e.ubication : ''}
              </div>

              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => deleteEvent(e.id)}
                  style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  🗑️ Eliminar
                </button>

                <button
                  onClick={() => setEditingEventId(editingEventId === e.id ? null : e.id)}
                  style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
                >
                  {editingEventId === e.id ? '❌ Cancelar' : '✏️ Editar'}
                </button>
              </div>

              {editingEventId === e.id && (
                <EditEventForm e={e} handleEditEvent={handleEditEvent} setEditingEventId={setEditingEventId} duration={duration} startDateTime={startDateTime}/>
              )}
            </li>
          )
        })}
      </ul>
      {/* <DevNavButtons /> */}
    </section>
  )
}
