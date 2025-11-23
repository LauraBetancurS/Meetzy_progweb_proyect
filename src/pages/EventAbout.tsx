import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  subscribeToEvent,
  unsubscribeFromEvent,
  deleteEvent as deleteEventAction,
  type EventRow,
} from "../redux/slices/EventsSlice";
import {
  subscribeUserToEventInDb,
  unsubscribeUserFromEventInDb,
  deleteEventInDb,
} from "../services/supaevents";
import type { EventModel } from "../types/Event";
import "./EventAbout.css";

export default function EventAbout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const eventsFromStore = useAppSelector((s) => s.events.events);
  const [userId, setUserId] = useState<string | null>(null);
  const [event, setEvent] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapRowToModel(row: EventRow): EventModel {
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? "",
      place: row.place ?? "",
      date: row.date ?? "",
      startTime: row.start_time ? row.start_time.slice(0, 5) : "",
      imageUrl: row.image_url ?? undefined,
      createdBy: row.created_by,
      createdByProfile: undefined,
      isOwner: row.isOwner ?? false,
      isJoined: row.isJoined ?? false,
    };
  }

  // Load user
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    }
    loadUser();
  }, []);

  // Load event (store → DB fallback)
  useEffect(() => {
    if (!id) {
      setError("No se encontró el evento.");
      setLoading(false);
      return;
    }

    const inStore = eventsFromStore.find((ev) => ev.id === id);
    if (inStore) {
      setEvent(mapRowToModel(inStore));
      setLoading(false);
      return;
    }

    async function fetchEvent() {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        setError("No pudimos cargar el evento.");
        setLoading(false);
        return;
      }

      const row = data as EventRow;
      setEvent(mapRowToModel(row));
      setLoading(false);
    }

    fetchEvent();
  }, [id, eventsFromStore]);

  // Join
  async function handleJoin() {
    if (!event || !userId) return;
    setLoadingJoin(true);
    await subscribeUserToEventInDb(event.id, userId);
    dispatch(subscribeToEvent({ eventId: event.id, userId }));
    setEvent({ ...event, isJoined: true });
    setLoadingJoin(false);
  }

  // Unjoin
  async function handleUnjoin() {
    if (!event || !userId) return;
    setLoadingJoin(true);
    await unsubscribeUserFromEventInDb(event.id, userId);
    dispatch(unsubscribeFromEvent({ eventId: event.id, userId }));
    setEvent({ ...event, isJoined: false });
    setLoadingJoin(false);
  }

  // Delete
  async function handleDelete() {
    if (!event || !userId) return;
    if (event.createdBy !== userId) return;
    await deleteEventInDb(event.id);
    dispatch(deleteEventAction(event.id));
    navigate(-1);
  }

  /* LOADING / ERROR */
  if (loading) return <p className="eventAbout__loading">Cargando evento...</p>;
  if (error || !event)
    return (
      <>
        <div className="page-bg"></div>
        <div className="animation-wrapper">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>

        <div className="eventAbout">
          <div className="eventAbout__card eventAbout__error">
            <p>{error || "Evento no encontrado."}</p>
            <button onClick={() => navigate(-1)}>Volver</button>
          </div>
        </div>
      </>
    );

  const isOwner = event.createdBy === userId || event.isOwner;
  const showJoin = !isOwner && !event.isJoined;

  /* ==========================================================
     FINAL UI WITH PARTICLES + GLASS CARD + CENTERED LAYOUT
     ========================================================== */

  return (
    <>
      {/* PARTICLE BACKGROUND */}
      <div className="page-bg"></div>
      <div className="animation-wrapper">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      {/* MAIN WRAPPER */}
      <div className="eventAbout">
        <div className="eventAbout__card">
          
          <div className="eventAbout__image">
            <img
              src={event.imageUrl || "/img/default-event.jpg"}
              alt={event.name}
            />
          </div>

          <h1 className="eventAbout__title">{event.name}</h1>
          <p className="eventAbout__description">
            {event.description || "Sin descripción"}
          </p>

          <div className="eventAbout__details">
            <p><strong>Creador:</strong> {event.createdBy}</p>
            <p><strong>Lugar:</strong> {event.place || "—"}</p>
            <p><strong>Fecha:</strong> {event.date || "—"}</p>
            <p><strong>Hora:</strong> {event.startTime || "—"}</p>
          </div>

          <div className="eventAbout__buttons">
            {isOwner ? (
              <button className="eventAbout__joinBtn" onClick={handleDelete}>
                Eliminar evento
              </button>
            ) : showJoin ? (
              <button
                className="eventAbout__joinBtn"
                onClick={handleJoin}
                disabled={loadingJoin}
              >
                {loadingJoin ? "Uniendo..." : "Unirse al evento"}
              </button>
            ) : (
              <button
                className="eventAbout__joinBtn"
                onClick={handleUnjoin}
                disabled={loadingJoin}
              >
                {loadingJoin ? "Saliendo..." : "Salir del evento"}
              </button>
            )}

            <button className="eventAbout__backBtn" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
