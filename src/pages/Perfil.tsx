// src/pages/Perfil.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMyProfile } from "../redux/slices/ProfileSlice";
import ProfileHeader from "../components/ProfileHeader";
import "./Perfil.css";

export default function Perfil() {
  const dispatch = useAppDispatch();
  const { me, isLoading, error } = useAppSelector((s) => s.profile);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    // only try to load profile if we have an auth user
    if (user) dispatch(fetchMyProfile());
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="perfil-wrap">
        <p className="perfil-info">Debes iniciar sesión para ver tu perfil.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="perfil-wrap">
        <p className="perfil-info">Cargando perfil…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-wrap">
        <p className="perfil-error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="perfil-wrap">
      <ProfileHeader
        fullName={me?.full_name}
        userName={me?.user_name}
        avatarUrl={me?.avatar_url}
        tagline={me?.tagline || null}
      />

      {/* Below you could list Events / Communities of this user */}
      <div className="perfil-list">
        {/* placeholder rows */}
        <div className="perfil-list__item">
          <div className="perfil-list__thumb" />
          <div className="perfil-list__title">Out of the world</div>
          <div className="perfil-list__pill" />
        </div>

        <div className="perfil-list__item">
          <div className="perfil-list__thumb" />
          <div className="perfil-list__title">Brunch con Runners</div>
          <div className="perfil-list__pill" />
        </div>

        <div className="perfil-list__item">
          <div className="perfil-list__thumb" />
          <div className="perfil-list__title">Puppy Yoga</div>
          <div className="perfil-list__pill" />
        </div>
      </div>
    </div>
  );
}
