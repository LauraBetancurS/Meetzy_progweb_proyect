import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchEventById,
  isUserJoined,
  joinEvent,
  leaveEvent,
} from "../services/supaevents";
import type { EventModel } from "../types/Event";
import "./EventAbout.css";

export default function EventAboutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load event detail (includes creator profile)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) {
        setError("Evento no encontrado.");
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await fetchEventById(id);
      if (!mounted) return;
      if (res.error) {
        setError(res.error);
        setEvent(null);
      } else {
        setEvent(res.data);
        setError(null);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Is user already joined?
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      const res = await isUserJoined(id);
      if (!mounted) return;
      if (!res.error) setJoined(res.joined);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleJoin() {
    if (!id) return;
    setBusy(true);
    const res = await joinEvent(id);
    if (!res.error) setJoined(true);
    setBusy(false);
  }

  async function handleLeave() {
    if (!id) return;
    setBusy(true);
    const res = await leaveEvent(id);
    if (!res.error) setJoined(false);
    setBusy(false);
  }

  if (loading) {
    return (
      <div className="ea-page">
        <div className="ea-container">
          <div className="ea-skeleton" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="ea-page">
        <div className="ea-container">
          <p className="ea-error">{error ?? "Evento no encontrado."}</p>
          <button className="ea-back" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ea-page">
      <header className="ea-hero">
        <img
          className="ea-hero-img"
          src={event.imageUrl || "/img/default-event.jpg"}
          alt={event.name}
        />
        <div className="ea-hero-overlay" />
        <div className="ea-hero-content">
          <h1 className="ea-title">{event.name}</h1>
          <p className="ea-subtitle">{event.description || "Sin descripción"}</p>

          {/* 🧑‍🎨 Creator info (from event.createdByProfile) */}
          {event.createdByProfile && (
            <div className="ea-creator">
              <div className="ea-creator-avatar">
                {event.createdByProfile.avatar_url ? (
                  <img
                    src={event.createdByProfile.avatar_url}
                    alt={event.createdByProfile.user_name ?? "Creador"}
                  />
                ) : (
                  <div className="ea-creator-placeholder">
                    {(event.createdByProfile.user_name?.[0] ?? "U").toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ea-creator-meta">
                <span className="ea-creator-label">Creado por</span>
                <span className="ea-creator-name">
                  @{event.createdByProfile.user_name ?? "usuario"}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="ea-container">
        <section className="ea-card">
          <div className="ea-meta">
            <div className="ea-meta-item">
              <span className="ea-label">Lugar</span>
              <span className="ea-value">{event.place || "—"}</span>
            </div>
            <div className="ea-meta-item">
              <span className="ea-label">Fecha</span>
              <span className="ea-value">{event.date}</span>
            </div>
            <div className="ea-meta-item">
              <span className="ea-label">Hora</span>
              <span className="ea-value">{event.startTime}</span>
            </div>
          </div>

          <div className="ea-actions">
            {joined ? (
              <>
                <button className="ea-btn danger" onClick={handleLeave} disabled={busy}>
                  {busy ? "Saliendo..." : "Salir del evento"}
                </button>
                <span className="ea-joined-tag">Ya estás suscrito ✅</span>
              </>
            ) : (
              <button className="ea-btn primary" onClick={handleJoin} disabled={busy}>
                {busy ? "Uniéndose..." : "Unirse"}
              </button>
            )}

            <Link to="/events" className="ea-btn ghost">
              Ver más eventos
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
