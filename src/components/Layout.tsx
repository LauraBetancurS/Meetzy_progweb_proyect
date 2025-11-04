// src/Layout.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/AuthSlice";
import Sidebar from "../components/dashboard/sidebar/sidebar";
import MobileNavbar from "../components/mobile-navbar/MobileNavbar";
import "./Layout.css";
import { supabase } from "../services/supabaseClient";

export default function Layout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [displayName, setDisplayName] = useState<string>("User");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // Fetch user data (name + avatar) from Supabase
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

      // fallback: metadata
      const metaName =
        (user.user_metadata as any)?.user_name ||
        (user.user_metadata as any)?.full_name ||
        (user.email ? user.email.split("@")[0] : "User");

      if (mounted) {
        setDisplayName(metaName);
        setAvatarUrl((user.user_metadata as any)?.avatar_url || "");
      }
    }

    loadUserData();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Logout logic
  async function handleLogout() {
    await dispatch(logout());
    navigate("/login");
  }

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
          {/* Avatar */}
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
                  {displayName.charAt(0).toUpperCase()}
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
