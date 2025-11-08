import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  subscribeToEvent,
  type EventRow,
} from "../redux/slices/EventsSlice";
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

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    }
    loadUser();
  }, []);

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

  async function handleJoin() {
    if (!event || !userId) return;
    setLoadingJoin(true);
    dispatch(subscribeToEvent({ eventId: event.id, userId }));
    setEvent({ ...event, isJoined: true });
    setLoadingJoin(false);
  }

  if (loading) return <p className="eventAbout__loading">Cargando evento...</p>;
  if (error || !event)
    return (
      <div className="eventAbout__error">
        <p>{error || "Evento no encontrado."}</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );

  const showJoin = !event.isOwner && !event.isJoined;

  return (
    <div className="eventAbout">
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
        <p>
          <strong>Creador:</strong> {event.createdBy}
        </p>
        <p>
          <strong>Lugar:</strong> {event.place || "—"}
        </p>
        <p>
          <strong>Fecha:</strong> {event.date || "—"}
        </p>
        <p>
          <strong>Hora:</strong> {event.startTime || "—"}
        </p>
      </div>

      <div className="eventAbout__buttons">
        {showJoin ? (
          <button
            className="eventAbout__joinBtn"
            onClick={handleJoin}
            disabled={loadingJoin}
          >
            {loadingJoin ? "Uniendo..." : "Unirse al evento"}
          </button>
        ) : (
          <button className="eventAbout__joinedBtn" disabled>
            {event.isOwner ? "Tu evento" : "Ya unido"}
          </button>
        )}

        <button className="eventAbout__backBtn" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    </div>
  );
}
