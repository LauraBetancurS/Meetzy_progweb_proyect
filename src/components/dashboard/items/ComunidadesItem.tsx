import SidebarItem from '../sidebar/sidebaritem'

const Icon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="8" r="3" stroke="currentColor"/>
    <circle cx="16" cy="8" r="3" stroke="currentColor"/>
    <path d="M3 19c.8-3 3.6-5 5-5s4.2 2 5 5" stroke="currentColor"/>
    <path d="M11 19c.7-2.5 2.9-4 5-4 2.1 0 4.3 1.5 5 4" stroke="currentColor"/>
  </svg>
)

function ComunidadesItem() {
  return <SidebarItem to="/comunidades" label="Comunidades" icon={<Icon />} />
}

export default ComunidadesItem
