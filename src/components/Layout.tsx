import { Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Layout.css";

export default function Layout() {
  const { user, logout } = useApp();

  return (
    <div className="layout">
      <header>
        <div className="brand">Meetzy (dev)</div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>Hola, {user.name}</span>
              <button onClick={logout}>Salir</button>
            </>
          ) : (
            <span>Invitado</span>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
