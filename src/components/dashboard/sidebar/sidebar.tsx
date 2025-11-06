// src/components/layout/sidebar/Sidebar.tsx
import { NavLink } from "react-router-dom";
import PrimaryButton from "../../UI/PrimaryButton";
import DashboardItem from "../items/DashboardItem";
import EventosItem from "../items/EventosItem";
import ComunidadesItem from "../items/ComunidadesItem";
import NotificacionesItem from "../items/NotificacionesItem";
import PerfilItem from "../items/PerfilItem";
import "./Sidebar.css";


function Sidebar() {

  return (
    <aside className="sb">
      <img
        className="sb__logo"
        src="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/MeetzyLogo.png"
        alt="Meetzy"
      />

      <nav className="sb__nav">
        <DashboardItem />
        <EventosItem />
        <ComunidadesItem />
        <NotificacionesItem />
        <PerfilItem />
      </nav>

      <div className="sb__actions">
        <NavLink to="/events/new">
          <PrimaryButton fullWidth>Crea un evento</PrimaryButton>
        </NavLink>
        <NavLink to="/crear-comunidad">
          <PrimaryButton fullWidth>Crea una comunidad</PrimaryButton>
        </NavLink>

      </div>
    </aside>
  );
}

export default Sidebar;
