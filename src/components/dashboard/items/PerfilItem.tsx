import SidebarItem from '../sidebar/sidebaritem'

const Icon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.2" stroke="currentColor"/>
    <path d="M4 19c1.6-3.2 4.3-5 8-5s6.4 1.8 8 5" stroke="currentColor"/>
  </svg>
)

function PerfilItem() {
  return <SidebarItem to="/perfil" label="Perfil" icon={<Icon />} />
}
export default PerfilItem
