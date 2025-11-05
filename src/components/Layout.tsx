// src/Layout.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/AuthSlice";

// ⬇️ use your existing a11y slice
import {
  increaseFont as increaseFontAction,
  decreaseFont as decreaseFontAction,
  resetFont as resetFontAction,
} from "../redux/slices/a11ySlice";

import Sidebar from "../components/dashboard/sidebar/sidebar";
import MobileNavbar from "../components/mobile-navbar/MobileNavbar";
import "./Layout.css";
import { supabase } from "../services/supabaseClient";

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // ⬇️ read scale directly from the a11y slice
  const fontScale = useAppSelector((s) => s.a11y.fontScale);

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
    (displayName && displayName.trim().charAt(0).toUpperCase()) || "U";

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__left">
          <img
            src="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/AUTH%20IMG/MeetzyLogo.png"
            alt="Meetzy"
            className="app-header__logo"
          />
        </div>

        <div className="app-header__right">
          {/* A11y font controls */}
          <div className="app-header__a11y" role="group" aria-label="Controles de tamaño de fuente">
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
              onClick={() => dispatch(increaseFontAction())}
              aria-label="Aumentar tamaño de fuente"
              title="A+"
            >
              A+
            </button>
            <span className="a11y-scale" aria-live="polite">
              {Math.round(fontScale * 100)}%
            </span>
          </div>

          {/* Avatar */}
          <div className="app-header__profile">
            <div className="app-header__avatar-wrapper">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="app-header__avatar" />
              ) : (
                <div className="app-header__avatar-placeholder">{initialLetter}</div>
              )}
            </div>
            <span className="app-header__greet">Hola, {displayName}</span>
          </div>

          <button className="app-header__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <Sidebar />
        </aside>

        <main className="app-outlet">
          <Outlet />
        </main>
      </div>

      <MobileNavbar />
    </div>
  );
}
