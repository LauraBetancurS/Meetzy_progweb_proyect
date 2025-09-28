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
