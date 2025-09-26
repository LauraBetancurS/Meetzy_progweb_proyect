import { useApp } from '../context/AppContext'
import { useState, FormEvent } from 'react'
import { DevNavButtons } from './DevNavButtons'

export default function UnirteComunidad() {
  const { communities } = useApp()
  const [selected, setSelected] = useState('')
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); if(!selected) return; alert('Te uniste a '+ selected) }
  return (
    <section>
      <h1>Unirte a una comunidad</h1>
      <form onSubmit={handleSubmit}>
        <select value={selected} onChange={e=>setSelected(e.target.value)}>
          <option value="" disabled>Selecciona</option>
          {communities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <button type="submit">Unirme</button>
      </form>
      <DevNavButtons />
    </section>
  )
}
