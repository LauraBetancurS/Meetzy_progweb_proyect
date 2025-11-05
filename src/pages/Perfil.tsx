import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { supabase } from "../services/supabaseClient";
import "./Perfil.css";

type ProfileRow = {
  id: string;
  full_name: string | null;
  user_name: string | null;
  avatar_url: string | null;
};

export default function Perfil() {
  const { user } = useAppSelector((s) => s.auth); // assumes AuthSlice stores supabase user here
  const email = user?.email ?? "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // editable fields (except email)
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // edit mode toggle
  const [isEditing, setIsEditing] = useState(false);

  // simple avatar preview fallback
  const avatarPreview = useMemo(() => {
    const url = (avatarUrl || "").trim();
    return url.length > 0 ? url : "/img/default-avatar.png";
  }, [avatarUrl]);

  // Load profile from Supabase
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      setOkMsg(null);

      // Try profiles first
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("id, full_name, user_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (pErr) {
        setError(pErr.message);
      }

      if (profile) {
        setFullName(profile.full_name ?? "");
        setUserName(profile.user_name ?? "");
        setAvatarUrl(profile.avatar_url ?? "");
      } else {
        // If profile row doesn't exist yet, prefill with auth metadata
        const meta = (user.user_metadata as any) || {};
        setFullName(meta.full_name ?? "");
        setUserName(meta.user_name ?? "");
        setAvatarUrl(meta.avatar_url ?? "");
      }

      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);
    setOkMsg(null);

    // 1) Upsert into profiles (so new users get their row on first save)
    const payload: ProfileRow = {
      id: user.id,
      full_name: fullName.trim() || null,
      user_name: userName.trim() || null,
      avatar_url: avatarUrl.trim() || null,
    };

    const { error: upErr } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
    if (upErr) {
      setError(upErr.message);
      setSaving(false);
      return;
    }

    // 2) Optionally sync auth metadata (handy for quick display elsewhere)
    const { error: metaErr } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim() || null,
        user_name: userName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      },
    });
    if (metaErr) {
      // not fatal for the page—show message but don't revert
      setError(`Guardado en perfil, pero falló metadata: ${metaErr.message}`);
      setSaving(false);
      setIsEditing(false);
      setOkMsg("Perfil guardado.");
      return;
    }

    setSaving(false);
    setIsEditing(false);
    setOkMsg("Perfil guardado.");
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p className="profile-error">No hay sesión activa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-card__header">
          <h1>Mi Perfil</h1>

          {/* ✏️ Edit / Cancel */}
          {!isEditing ? (
            <button
              className="icon-btn"
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label="Editar perfil"
              title="Editar"
            >
              {/* Pencil icon (inline SVG) */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 21l3.75-.75L19.5 7.5l-3.75-3.75L3 16.5V21z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14.25 6.75l3 3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Editar
            </button>
          ) : (
            <button
              className="ghost-btn"
              type="button"
              onClick={() => {
                setIsEditing(false);
                setOkMsg(null);
                setError(null);
              }}
            >
              Cancelar
            </button>
          )}
        </div>

        {loading ? (
          <div className="profile-skeleton" />
        ) : (
          <>
            {error && <div className="profile-banner error">{error}</div>}
            {okMsg && <div className="profile-banner ok">{okMsg}</div>}

            <div className="profile-body">
              <div className="profile-avatar">
                <img src={avatarPreview} alt={userName || fullName || email} />
              </div>

              <div className="profile-fields">
                {/* Email (read-only) */}
                <label className="pf-label">
                  Email
                  <input className="pf-input" value={email} disabled />
                </label>

                <label className="pf-label">
                  Nombre completo
                  <input
                    className="pf-input"
                    type="text"
                    placeholder="Tu nombre"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!isEditing || saving}
                  />
                </label>

                <label className="pf-label">
                  Username
                  <input
                    className="pf-input"
                    type="text"
                    placeholder="@usuario"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={!isEditing || saving}
                  />
                </label>

                <label className="pf-label">
                  Avatar URL
                  <input
                    className="pf-input"
                    type="url"
                    placeholder="https://tu-imagen.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    disabled={!isEditing || saving}
                  />
                </label>

                {isEditing && (
                  <div className="profile-actions">
                    <button
                      className="primary-btn"
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
