import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
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
import PublicEventCard from "../components/PublicEventCard/PublicEventCard";

export default function Events() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const events = useAppSelector((s) => s.events.events);
  const [userId, setUserId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0); // 👈 para forzar re-render tras unirse

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    }
    loadUser();
  }, []);

  function mapRowToModel(
    row: EventRow,
    isOwnerComputed: boolean,
    isJoinedComputed: boolean
  ): EventModel {
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
      isOwner: isOwnerComputed,
      isJoined: isJoinedComputed,
    };
  }

  // 👇 usamos refresh como dependencia adicional
  const { myEvents, subscribedEvents, generalEvents } = useMemo(() => {
    if (!userId) {
      return {
        myEvents: [] as EventModel[],
        subscribedEvents: [] as EventModel[],
        generalEvents: [] as EventModel[],
      };
    }

    const mine = events
      .filter((e) => e.created_by === userId)
      .map((e) => mapRowToModel(e, true, true));

    const subs = events
      .filter(
        (e) =>
          e.created_by !== userId &&
          ((e.subscribers || []).includes(userId) || e.isJoined)
      )
      .map((e) => mapRowToModel(e, false, true));

    const general = events
      .filter(
        (e) =>
          e.created_by !== userId &&
          !(e.subscribers || []).includes(userId) &&
          !e.isJoined // 👈 evita duplicar
      )
      .map((e) => mapRowToModel(e, false, false));

    return { myEvents: mine, subscribedEvents: subs, generalEvents: general };
  }, [events, userId, refresh]); // 👈 dependencia nueva

  // Handlers
  async function handleJoin(ev: EventModel) {
    if (!userId) return;
    await subscribeUserToEventInDb(ev.id, userId);
    dispatch(subscribeToEvent({ eventId: ev.id, userId }));
    setRefresh((r) => r + 1); // 👈 actualiza los grupos al instante
  }

  async function handleUnjoin(ev: EventModel) {
    if (!userId) return;
    await unsubscribeUserFromEventInDb(ev.id, userId);
    dispatch(unsubscribeFromEvent({ eventId: ev.id, userId }));
    setRefresh((r) => r + 1);
  }

  async function handleDelete(ev: EventModel) {
    if (!userId) return;
    if (ev.createdBy !== userId) return;
    await deleteEventInDb(ev.id);
    dispatch(deleteEventAction(ev.id));
  }

  function handleAbout(ev: EventModel) {
    navigate(`/events/${ev.id}`);
  }

  return (
    <main>
      <header>
        <h1>Eventos</h1>
      </header>

      <section aria-labelledby="my-events-title">
        <h2 id="my-events-title">Mis eventos</h2>
        {userId && myEvents.length > 0 ? (
          <ul>
            {myEvents.map((ev) => (
              <li key={ev.id}>
                <PublicEventCard
                  event={ev}
                  onAbout={handleAbout}
                  onDelete={handleDelete}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>
            {userId
              ? "Aún no has creado eventos."
              : "Inicia sesión para ver tus eventos."}
          </p>
        )}
      </section>

      <section aria-labelledby="subs-events-title">
        <h2 id="subs-events-title">Eventos suscritos</h2>
        {userId && subscribedEvents.length > 0 ? (
          <ul>
            {subscribedEvents.map((ev) => (
              <li key={ev.id}>
                <PublicEventCard
                  event={ev}
                  onAbout={handleAbout}
                  onUnjoin={handleUnjoin}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>
            {userId
              ? "Todavía no te has unido a ningún evento."
              : "Inicia sesión para ver tus suscripciones."}
          </p>
        )}
      </section>

      <section aria-labelledby="general-events-title">
        <h2 id="general-events-title">Eventos generales</h2>
        {generalEvents.length > 0 ? (
          <ul>
            {generalEvents.map((ev) => (
              <li key={ev.id}>
                <PublicEventCard
                  event={ev}
                  onAbout={handleAbout}
                  onJoin={handleJoin}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay eventos disponibles ahora mismo.</p>
        )}
      </section>
    </main>
  );
}
