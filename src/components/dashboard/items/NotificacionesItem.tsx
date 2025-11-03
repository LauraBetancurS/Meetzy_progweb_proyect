import SidebarItem from '../sidebar/sidebaritem'

const Icon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M19 17H5l1.2-1.5A6 6 0 0 0 7 12V10a5 5 0 0 1 10 0v2c0 1 .2 2 .8 3.5L19 17Z" stroke="currentColor"/>
    <path d="M9.5 18a2.5 2.5 0 0 0 5 0" stroke="currentColor"/>
  </svg>
)

function NotificacionesItem() {
  return <SidebarItem to="/notificaciones" label="Notificaciones" icon={<Icon />} />
}

export default NotificacionesItem
