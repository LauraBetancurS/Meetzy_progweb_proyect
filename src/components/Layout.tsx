import { Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Navbar from './Navbar'

export default function Layout() {
  const { user, logout } = useApp()
  return (
    <div>
      <header>
        <div className="brand">Meetzy (dev)</div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>Hola, {user.name}</span>
              <button onClick={logout}>Salir</button>
            </>
          ) : <span>Invitado</span>}
        </div>
      </header>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
