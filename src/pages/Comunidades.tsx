import { useApp } from '../context/AppContext'
import { DevNavButtons } from './DevNavButtons'

export default function Comunidades() {
  const { communities } = useApp()
  return (
    <section>
      <h1>Comunidades</h1>
      <ul>
        {communities.map(c => <li key={c.id}><strong>{c.name}</strong> — {c.members} miembros</li>)}
      </ul>
      <DevNavButtons />
    </section>
  )
}
