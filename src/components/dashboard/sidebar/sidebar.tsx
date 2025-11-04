// src/components/layout/sidebar/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import PrimaryButton from "../../UI/PrimaryButton";
import DashboardItem from "../items/DashboardItem";
import EventosItem from "../items/EventosItem";
import ComunidadesItem from "../items/ComunidadesItem";
import NotificacionesItem from "../items/NotificacionesItem";
import PerfilItem from "../items/PerfilItem";
import "./Sidebar.css";

// Import para logout
import { useAppDispatch } from "../../../redux/hooks";
import { logout } from "../../../redux/slices/AuthSlice";

function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

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

        {/* Botón de Logout */}
        <PrimaryButton fullWidth onClick={handleLogout} style={{ marginTop: "1rem", backgroundColor: "#E74C3C" }}>
          Cerrar sesión
        </PrimaryButton>
      </div>
    </aside>
  );
}

export default Sidebar;
