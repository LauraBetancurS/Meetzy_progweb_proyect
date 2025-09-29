import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/dashboard/sidebar/sidebar'
import RightColumn from './dashboard/right/RightColumn'  // ← derecha
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="app">
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

      <div className="app-shell">
        <aside className="shell-left">
          <Sidebar />
        </aside>

        <main className="shell-main">
          <Outlet />   {/* ← la página (Dashboard) renderiza aquí */}
        </main>

        <aside className="shell-right">
          <RightColumn />  {/* ← calendario + banner a la derecha */}
        </aside>
      </div>
    </div>
  );
}
