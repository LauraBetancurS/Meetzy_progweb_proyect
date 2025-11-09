import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/dashboard/search/SearchBar";
import RightColumn from "../components/dashboard/right/RightColumn";
import EventsSection from "../components/dashboard/events/EventsSection";

import "./Dashboard.css";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { supabase } from "../services/supabaseClient";

import {
  fetchEventsFromDb,
  subscribeUserToEventInDb,
  unsubscribeUserFromEventInDb,
  deleteEventInDb,
} from "../services/supaevents";

import {
  saveEvents,
  addEvent,
  editEvent,
  deleteEvent,
  subscribeToEvent,
  unsubscribeFromEvent,
  type EventRow,
} from "../redux/slices/EventsSlice";

import type { EventModel } from "../types/Event";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const eventsFromStore = useAppSelector((s) => s.events.events);

  useEffect(() => {
    console.log("📦 Eventos en el store:", eventsFromStore);
  }, [eventsFromStore]);

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  function mapRowToModel(row: EventRow): EventModel {
    const joined = userId ? (row.subscribers || []).includes(userId) : false;
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
      isOwner: userId ? row.created_by === userId : false,
      isJoined: joined,
    };
  }

  // 1. user
  useEffect(() => {
    let mounted = true;

    async function loadSessionUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log("Error cargando usuario:", error);
        return;
      }

      const user = data.user;
      if (!user) return;

      if (mounted) {
        setUserId(user.id);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("user_name, full_name")
        .eq("id", user.id)
        .maybeSingle();

      const name =
        profile?.user_name?.trim() ||
        profile?.full_name?.trim() ||
        (user.email ? user.email.split("@")[0] : "");

      if (mounted) {
        setUsername(name);
      }
    }

    loadSessionUser();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. eventos
  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    setEventsError(null);

    try {
      const eventsFromDb = await fetchEventsFromDb();

      if (!eventsFromDb || eventsFromDb.length === 0) {
        setEventsError("No hay eventos disponibles por ahora.");
        dispatch(saveEvents([]));
        setLoadingEvents(false);
        return;
      }

      const enriched: EventRow[] = eventsFromDb.map((ev) => ({
        ...ev,
        isOwner: userId ? ev.created_by === userId : false,
        isJoined: userId ? (ev.subscribers || []).includes(userId) : false,
      }));

      dispatch(saveEvents(enriched));
    } catch (error) {
      console.log("Error al traer eventos:", error);
      setEventsError("Ocurrió un error al cargar los eventos.");
      dispatch(saveEvents([]));
    } finally {
      setLoadingEvents(false);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // 3. realtime sobre events (ojo: no sobre event_members)
  useEffect(() => {
    const channel = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const base = payload.new as EventRow;
            const newEvent: EventRow = {
              ...base,
              subscribers: [],
              isOwner: userId ? base.created_by === userId : false,
              isJoined: false,
            };
            dispatch(addEvent(newEvent));
          }

          if (payload.eventType === "UPDATE") {
            const base = payload.new as EventRow;
            const updatedEvent: EventRow = {
              ...base,
              // si quieres, aquí podrías volver a pedir members del evento específico
              subscribers: [],
              isOwner: userId ? base.created_by === userId : false,
              isJoined: false,
            };
            dispatch(editEvent(updatedEvent));
          }

          if (payload.eventType === "DELETE") {
            dispatch(deleteEvent(payload.old.id as string));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dispatch, userId]);

  function handleSearch(q: string) {
    console.log("Buscar:", q);
  }

  function goCreateEvent() {
    navigate("/events/new");
  }

  // unirse desde dashboard
  async function handleJoin(ev: EventModel) {
    if (!userId) return;
    await subscribeUserToEventInDb(ev.id, userId);
    dispatch(subscribeToEvent({ eventId: ev.id, userId }));
  }

  async function handleUnjoin(ev: EventModel) {
    if (!userId) return;
    await unsubscribeUserFromEventInDb(ev.id, userId);
    dispatch(unsubscribeFromEvent({ eventId: ev.id, userId }));
  }

  async function handleDelete(ev: EventModel) {
    if (!userId) return;
    if (ev.createdBy !== userId) return;
    await deleteEventInDb(ev.id);
    dispatch(deleteEvent(ev.id));
  }

  const uiEvents: EventModel[] = eventsFromStore.map(mapRowToModel);

  return (
    <div className="dash-grid">
      <section className="dash-center">
        <SearchBar onSearch={handleSearch} />

        <div className="dash-hero">
          <h1 className="dash-title">
            Dive in! <span>{username}</span>
          </h1>
          <p className="dash-sub">
            Turn plans into moments. Subtitle: Set the details, vote in real
            time, and keep every memory in one place.
          </p>
        </div>

        <EventsSection
          events={uiEvents}
          onCreate={goCreateEvent}
          loading={loadingEvents}
          error={eventsError || undefined}
          onRetry={loadEvents}
          onAbout={(ev) => navigate(`/events/${ev.id}`)}
          onJoin={handleJoin}
          onUnjoin={handleUnjoin}
          onDelete={handleDelete}
        />
      </section>

      <aside className="dash-right">
        <RightColumn />
      </aside>
    </div>
  );
}
