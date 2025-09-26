import { useState, FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import { DevNavButtons } from './DevNavButtons'

export default function CrearEvento() {
  const { addEvent, events } = useApp()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if(!title || !date) return
    addEvent({ id: 'e'+(events.length+1), title, date, location })
    setTitle(''); setDate(''); setLocation('')
  }

  return (
    <section>
      <h1>Crear evento</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
        <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} />
        <input placeholder="Lugar" value={location} onChange={e=>setLocation(e.target.value)} />
        <button type="submit">Crear</button>
      </form>
      <DevNavButtons />
    </section>
  )
}
