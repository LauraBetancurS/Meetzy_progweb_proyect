import { NavLink } from 'react-router-dom'
import type { SidebarItemProps } from '../../../types/ui'

function SidebarItem({ to, label, icon, onClick, className, end }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => `sb__link ${isActive ? 'active' : ''} ${className || ''}`}
    >
      <span className="sb__icon">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export default SidebarItem