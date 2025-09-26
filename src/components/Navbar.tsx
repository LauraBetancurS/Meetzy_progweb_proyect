import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const items = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/comunidades', label: 'Comunidades' },
    { to: '/unirte-comunidad', label: 'Unirte' },
    { to: '/crear-comunidad', label: 'Crear comunidad' },
    { to: '/eventos', label: 'Eventos' },
    { to: '/crear-evento', label: 'Crear evento' },
    { to: '/cuestionario-mood', label: 'Mood' },
    { to: '/perfil', label: 'Perfil' },
  ]
  return (
    <nav className="devbar">
      {items.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end as any}
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
