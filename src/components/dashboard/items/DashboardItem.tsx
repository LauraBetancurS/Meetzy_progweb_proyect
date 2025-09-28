import SidebarItem from '../sidebar/sidebaritem'

const Icon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor"/>
    <rect x="13" y="3" width="8" height="6" rx="2" stroke="currentColor"/>
    <rect x="13" y="11" width="8" height="10" rx="2" stroke="currentColor"/>
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor"/>
  </svg>
)

function DashboardItem() {
  return <SidebarItem to="/" end label="Dashboard" icon={<Icon />} />
}

export default DashboardItem
