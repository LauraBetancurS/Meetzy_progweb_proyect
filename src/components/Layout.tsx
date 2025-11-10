// src/Layout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/AuthSlice";

// a11y controls
import {
  increaseFont as increaseFontAction,
  decreaseFont as decreaseFontAction,
  
  toggleDyslexiaMode,
  selectDyslexiaMode,
} from "../redux/slices/a11ySlice";

import Sidebar from "../components/dashboard/sidebar/sidebar";
import MobileNavbar from "../components/mobile-navbar/MobileNavbar";
import "./Layout.css";

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ✅ Auth user (email, uid)
  const authUser = useAppSelector((state) => state.auth.user);

  // ✅ Profile from Redux (avatar_url, user_name, full_name)
  const profile = useAppSelector((state) => state.profile.me);

  // A11y
  const fontScale = useAppSelector((s) => s.a11y.fontScale);
  const dyslexiaMode = useAppSelector(selectDyslexiaMode);

  // ✅ Username fallback
  const displayName =
    profile?.user_name?.trim() ||
    profile?.full_name?.trim() ||
    authUser?.email?.split("@")[0] ||
    "User";

  // ✅ Avatar fallback
  const avatarUrl =
    profile?.avatar_url ||
    authUser?.user_metadata?.avatar_url ||
    "";

  const initialLetter =
    displayName.trim().charAt(0).toUpperCase() || "U";

  // ✅ Logout
  async function handleLogout() {
    await dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__left">
          <img
            src="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/MeetzyLogo.png"
            alt="Meetzy"
            className="app-header__logo"
          />
        </div>

        <div className="app-header__right">
          {/* A11y controls */}
          <div
            className="app-header__a11y"
            role="group"
            aria-label="Controles de accesibilidad"
          >
            <button
              type="button"
              className="a11y-btn"
              onClick={() => dispatch(decreaseFontAction())}
              title="A−"
            >
              A−
            </button>

            

            <button
              type="button"
              className="a11y-btn"
              onClick={() => dispatch(increaseFontAction())}
              title="A+"
            >
              A+
            </button>

            <span className="a11y-scale">{Math.round(fontScale * 100)}%</span>

            <button
              type="button"
              className={`a11y-btn dyslexia-toggle ${dyslexiaMode ? "is-on" : ""}`}
              onClick={() => dispatch(toggleDyslexiaMode())}
              aria-pressed={dyslexiaMode}
            >
              Dyslexia {dyslexiaMode ? "ON" : "OFF"}
            </button>
          </div>

          {/* Avatar + greet */}
          <div className="app-header__profile">
            <div className="app-header__avatar-wrapper">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="app-header__avatar"
                />
              ) : (
                <div className="app-header__avatar-placeholder">
                  {initialLetter}
                </div>
              )}
            </div>
            <span className="app-header__greet">Hola, {displayName}</span>
          </div>

          <button className="app-header__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Body general: Sidebar (desktop) + Outlet */}
      <div className="app-body">
        <aside className="app-sidebar">
          <Sidebar />
        </aside>

        <main className="app-outlet">
          <Outlet />
        </main>
      </div>

      {/* Navbar solo en mobile */}
      <MobileNavbar />
    </div>
  );
}
