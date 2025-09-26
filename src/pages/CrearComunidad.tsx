import { useState, FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import { DevNavButtons } from './DevNavButtons'

export default function CrearComunidad() {
  const { addCommunity, communities } = useApp()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if(!name.trim()) return
    addCommunity({ id: 'c'+(communities.length+1), name, description, members: 1 })
    setName(''); setDescription('')
  }

  return (
    <section>
      <h1>Crear comunidad</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Descripción" value={description} onChange={e=>setDescription(e.target.value)} />
        <button type="submit">Crear</button>
      </form>
      <DevNavButtons />
    </section>
  )
}
