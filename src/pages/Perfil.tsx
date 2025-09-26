import { useApp } from '../context/AppContext'
import { DevNavButtons } from './DevNavButtons'

export default function Perfil() {
  const { user } = useApp()
  return (
    <section>
      <h1>Perfil</h1>
      {user ? (<pre>{JSON.stringify(user, null, 2)}</pre>) : (<p>Sin sesión</p>)}
      <DevNavButtons />
    </section>
  )
}
