// src/Layout.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/AuthSlice";

// a11y controls
import {
  increaseFont as increaseFontAction,
  decreaseFont as decreaseFontAction,
  resetFont as resetFontAction,      // keep reset (optional)
  toggleDyslexiaMode,
  selectDyslexiaMode,
} from "../redux/slices/a11ySlice";

import Sidebar from "../components/dashboard/sidebar/sidebar";
import MobileNavbar from "../components/mobile-navbar/MobileNavbar";
import "./Layout.css";
import { supabase } from "../services/supabaseClient";

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // current font scale (for the % label)
  const fontScale = useAppSelector((s) => s.a11y.fontScale);
  // dyslexia mode state
  const dyslexiaMode = useAppSelector(selectDyslexiaMode);

  const [displayName, setDisplayName] = useState<string>("User");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function loadUserData() {
      if (!user) {
        if (mounted) {
          setDisplayName("User");
          setAvatarUrl("");
        }
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_name, full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && profile) {
        const pickedName =
          (profile.user_name && profile.user_name.trim()) ||
          (profile.full_name && profile.full_name.trim()) ||
          (user.email ? user.email.split("@")[0] : "User");

        if (mounted) {
          setDisplayName(pickedName);
          setAvatarUrl(profile.avatar_url || "");
        }
        return;
      }

      // fallback to auth metadata
      const meta = (user.user_metadata as any) || {};
      const metaName =
        meta.user_name ||
        meta.full_name ||
        (user.email ? user.email.split("@")[0] : "User");

      if (mounted) {
        setDisplayName(String(metaName));
        setAvatarUrl(meta.avatar_url || "");
      }
    }

    loadUserData();
    return () => {
      mounted = false;
    };
  }, [user]);

  async function handleLogout() {
    await dispatch(logout());
    navigate("/login");
  }

  const initialLetter =
    (displayName?.trim?.().charAt(0).toUpperCase()) || "U";

  return (
    <div className="app">
      {/* Header fijo */}
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
            {/* Font size */}
            <button
              type="button"
              className="a11y-btn"
              onClick={() => dispatch(decreaseFontAction())}
              aria-label="Reducir tamaño de fuente"
              title="A−"
            >
              A−
            </button>

            <button
              type="button"
              className="a11y-btn"
              onClick={() => dispatch(resetFontAction())}
              aria-label="Restablecer tamaño de fuente"
              title="100%"
            >
              100%
            </button>

            <button
              type="button"
              className="a11y-btn"
              onClick={() => dispatch(increaseFontAction())}
              aria-label="Aumentar tamaño de fuente"
              title="A+"
            >
              A+
            </button>

            <span className="a11y-scale" aria-live="polite">
              {Math.round(fontScale * 100)}%
            </span>

            {/* Dyslexia Mode */}
            <button
              type="button"
              className={`a11y-btn dyslexia-toggle ${dyslexiaMode ? "is-on" : ""}`}
              onClick={() => dispatch(toggleDyslexiaMode())}
              aria-pressed={dyslexiaMode}
              aria-label="Alternar modo dislexia"
              title="Modo dislexia"
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

      {/* Navbar solo en mobile (≤768px) */}
      <MobileNavbar />
    </div>
  );
}
