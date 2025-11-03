import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/dashboard/sidebar/sidebar'
import MobileNavbar from '../components/mobile-navbar/MobileNavbar'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="app">
      {/* Header fijo */}
      <header className="app-header">
        <div className="app-header__left">
          <img
            src="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/MeetzyLogo.png"
            alt="Meetzy"
            className="app-header__logo"
          />
        </div>
        <div className="app-header__right">
          <span className="app-header__greet">Hola, {user?.userName ?? 'User'}</span>
          <button className="app-header__logout" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Body general: Sidebar (desktop) + Outlet */}
      <div className="app-body">
        <aside className="app-sidebar">
          <Sidebar />
        </aside>

        <main className="app-outlet">
          <Outlet />
        </main>
      </div>

      {/* Navbar solo en mobile (≤768px) */}
      <MobileNavbar />
    </div>
  )
}
