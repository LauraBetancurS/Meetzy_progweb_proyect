import SidebarItem from '../sidebar/sidebaritem'

const Icon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="3"stroke="currentColor"/>
    <path d="M8 2v4M16 2v4"stroke="currentColor" />
    <path d="M3 9h18"stroke="currentColor"/>
    <circle cx="8" cy="13" r="1.2" fill="#d8d8d8"/>
    <circle cx="12" cy="13" r="1.2" fill="#d8d8d8"/>
    <circle cx="16" cy="13" r="1.2" fill="#d8d8d8"/>
  </svg>
)

function EventosItem() {
  return <SidebarItem to="/events" label="Eventos" icon={<Icon />} />
}

export default EventosItem
