// src/pages/Perfil.tsx
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { supabase } from "../services/supabaseClient";
import "./Perfil.css";

type ProfileRow = {
  id: string;
  user_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export default function Perfil() {
  const { user, isLoading: authLoading } = useAppSelector((s) => s.auth);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      // If auth still initializing, wait (prevents double queries + flicker)
      if (authLoading) return;

      // No user? Show a friendly note; ProtectedRoute should already block this
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_name, full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error("Perfil: error loading profile", error);
        setError(error.message);
        setProfile(null);
      } else {
        setProfile(data as ProfileRow);
      }
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="perfil-page">
        <div className="perfil-card">
          <div className="perfil-skel-avatar" />
          <div className="perfil-skel-lines">
            <div className="perfil-skel-line" />
            <div className="perfil-skel-line short" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Shouldn’t happen because of ProtectedRoute, but just in case
    return (
      <div className="perfil-page">
        <div className="perfil-empty">Please sign in to view your profile.</div>
      </div>
    );
  }

  const displayName =
    (profile?.user_name && profile.user_name.trim()) ||
    (profile?.full_name && profile.full_name.trim()) ||
    user.email?.split("@")[0] ||
    "User";

  const avatarUrl = profile?.avatar_url || (user.user_metadata as any)?.avatar_url || "";

  return (
    <div className="perfil-page">
      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} />
            ) : (
              <div className="perfil-avatar-fallback">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="perfil-info">
            <h1 className="perfil-name">{displayName}</h1>
            <p className="perfil-username">
              @{(profile?.user_name || displayName).toLowerCase()}
            </p>
          </div>
        </div>

        {error && <p className="perfil-error">Error: {error}</p>}

        <div className="perfil-grid">
          <div className="perfil-item">
            <span className="perfil-label">Nombre completo</span>
            <span className="perfil-value">{profile?.full_name || "—"}</span>
          </div>

          <div className="perfil-item">
            <span className="perfil-label">Email</span>
            <span className="perfil-value">{user.email ?? "—"}</span>
          </div>

          <div className="perfil-item">
            <span className="perfil-label">Username</span>
            <span className="perfil-value">{profile?.user_name || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
