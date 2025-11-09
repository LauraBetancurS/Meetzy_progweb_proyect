// src/pages/Perfil.tsx
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import "./Perfil.css";

import {
  selectMyProfile,
  selectProfileLoading,
  selectProfileSaving,
  selectProfileError,
  fetchMyProfile,
  saveMyProfile,
} from "../redux/slices/ProfileSlice";

export default function Perfil() {
  const dispatch = useAppDispatch();

  // auth (email read-only)
  const authUser = useAppSelector((s) => s.auth.user);

  // profile state
  const profile = useAppSelector(selectMyProfile);
  const isLoading = useAppSelector(selectProfileLoading);
  const isSaving = useAppSelector(selectProfileSaving);
  const error = useAppSelector(selectProfileError);

  // local edit state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // initial load
  useEffect(() => {
    if (!profile && !isLoading) {
      (dispatch as any)(fetchMyProfile());
    }
  }, [dispatch, profile, isLoading]);

  // hydrate inputs (only when not editing)
  useEffect(() => {
    if (profile && !isEditing) {
      setFullName(profile.full_name ?? "");
      setUserName(profile.user_name ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
    }
  }, [profile, isEditing]);

  const email = useMemo(() => authUser?.email ?? "", [authUser]);

  // ✅ SAVE HANDLER WITH FULL PAGE REFRESH
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      full_name: fullName.trim() || null,
      user_name: userName.trim() || null,
      avatar_url: avatarUrl.trim() || null,
    };

    try {
      // save to Supabase
      await (dispatch as any)(saveMyProfile(payload));

      // close edit mode
      setIsEditing(false);

      // ✅ refresh entire page to show updated data
      window.location.reload();

    } catch {
      // error is already in Redux
    }
  }

  if (isLoading && !profile) {
    return (
      <div className="perfil-page">
        <div className="perfil-card">
          <div className="perfil-skel" />
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <div className="perfil-card">
        <header className="perfil-header">
          <div className="perfil-avatar-wrap">
            {avatarUrl ? (
              <img
                className="perfil-avatar"
                src={avatarUrl}
                alt={userName || fullName || "Avatar"}
              />
            ) : (
              <div className="perfil-avatar placeholder">
                {(userName || fullName || email || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="perfil-title">
            <h1>Perfil</h1>
            <p className="perfil-sub">Administra tu información personal</p>
          </div>

          <div className="perfil-actions">
            {!isEditing ? (
              <button
                className="perfil-icon-btn"
                onClick={() => setIsEditing(true)}
                title="Editar perfil"
                aria-label="Editar perfil"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
                  <path d="M20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.29a1 1 0 0 0-1.41 0L15.13 5.12l3.75 3.75 1.83-1.83z" fill="currentColor" />
                </svg>
                <span>Editar</span>
              </button>
            ) : (
              <button
                className="perfil-icon-btn ghost"
                onClick={() => {
                  setFullName(profile?.full_name ?? "");
                  setUserName(profile?.user_name ?? "");
                  setAvatarUrl(profile?.avatar_url ?? "");
                  setIsEditing(false);
                }}
                title="Cancelar"
                aria-label="Cancelar edición"
              >
                ✕ <span>Cancelar</span>
              </button>
            )}
          </div>
        </header>

        {error && <div className="perfil-error">⚠️ {error}</div>}

        {!isEditing ? (
          // ---------- READ-ONLY VIEW ----------
          <section className="perfil-grid">
            <div className="perfil-field">
              <label>Nombre completo</label>
              <div className="perfil-value">{profile?.full_name || "—"}</div>
            </div>

            <div className="perfil-field">
              <label>Usuario</label>
              <div className="perfil-value">{profile?.user_name || "—"}</div>
            </div>

            <div className="perfil-field">
              <label>Avatar URL</label>
              <div className="perfil-value">{profile?.avatar_url || "—"}</div>
            </div>

            <div className="perfil-field">
              <label>Email</label>
              <div className="perfil-value">{email || "—"}</div>
            </div>
          </section>
        ) : (
          // ---------- EDIT FORM ----------
          <form className="perfil-form" onSubmit={handleSave}>
            <div className="perfil-field">
              <label htmlFor="full_name">Nombre completo</label>
              <input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                disabled={isSaving}
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="user_name">Usuario</label>
              <input
                id="user_name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="@usuario"
                autoComplete="username"
                disabled={isSaving}
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="avatar_url">Avatar URL</label>
              <input
                id="avatar_url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
                autoComplete="url"
                disabled={isSaving}
              />
            </div>

            <div className="perfil-field">
              <label>Email</label>
              <input value={email} disabled />
              <small className="perfil-hint">El email no se puede editar.</small>
            </div>

            <div className="perfil-actions-row">
              <button className="perfil-btn primary" type="submit" disabled={isSaving}>
                {isSaving ? "Guardando…" : "Guardar cambios"}
              </button>
              <button
                type="button"
                className="perfil-btn ghost"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
