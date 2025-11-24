import { NavLink } from "react-router-dom";
import "./MobileNavbar.css";

const NAV = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/events", label: "Eventos", icon: "events" },
  { to: "/comunidades", label: "Comunidades", icon: "communities" },
  { to: "/perfil", label: "Perfil", icon: "user" },
] as const;

function Icon({ name }: { name: typeof NAV[number]["icon"] }) {
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      );
    case "events":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );
    case "communities":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="8" r="3" />
          <path d="M4 20c0-3 2.5-5 4-5s4 2 4 5" />
          <path d="M12 20c0-3 2.5-5 4-5s4 2 4 5" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
        </svg>
      );
  }
}

export default function MobileNavbar() {
  return (
    <nav className="mnav__bottombar" role="navigation" aria-label="Mobile bottom navigation">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          aria-label={item.label}
          className={({ isActive }) => "mnav__btn" + (isActive ? " is-active" : "")}
        >
          <Icon name={item.icon} />
        </NavLink>
      ))}
    </nav>
  );
}
