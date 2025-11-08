// src/pages/Dashboard.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/dashboard/search/SearchBar";
import RightColumn from "../components/dashboard/right/RightColumn";
import EventsSection from "../components/dashboard/events/EventsSection";

import "./Dashboard.css";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { supabase } from "../services/supabaseClient";

import { fetchEventsFromDb } from "../services/supaevents";

// 👇 tu slice (con isOwner e isJoined opcionales)
import {
  saveEvents,
  addEvent,
  editEvent,
  deleteEvent,
  subscribeToEvent,
  type EventRow,
} from "../redux/slices/EventsSlice";

// 👇 este es el tipo que usa tu UI / EventsSection
import type { EventModel } from "../types/Event";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // eventos crudos (como están en redux, con nombres de la BD)
  const eventsFromStore = useAppSelector((s) => s.events.events);

useEffect(() => {
  console.log("📦 Eventos en el store:", eventsFromStore);
}, [eventsFromStore]);
  

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // helper: convertir EventRow (BD) -> EventModel (UI)
  function mapRowToModel(row: EventRow): EventModel {
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? "",
      place: row.place ?? "",
      date: row.date ?? "",
      // la BD tiene start_time (time), la UI quiere startTime (HH:mm)
      startTime: row.start_time ? row.start_time.slice(0, 5) : "",
      imageUrl: row.image_url ?? undefined,
      createdBy: row.created_by,
      createdByProfile: undefined,
      isOwner: row.isOwner ?? false,
      // si quieres manejar isJoined en la UI
      isJoined: row.isJoined ?? false,
    };
  }

  // 1. traer usuario desde supabase (sesión)
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

  // 2. traer eventos y guardarlos en redux
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

      // aquí solo enriquecemos lo que viene de la BD
      const enriched: EventRow[] = eventsFromDb.map((ev) => ({
        ...ev,
        isOwner: userId ? ev.created_by === userId : false,
        isJoined: false,
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

  // 3. listener en tiempo real
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
              isOwner: userId ? base.created_by === userId : false,
              isJoined: false,
            };
            dispatch(addEvent(newEvent));
          }

          if (payload.eventType === "UPDATE") {
            const base = payload.new as EventRow;
            const updatedEvent: EventRow = {
              ...base,
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

  // 4. acciones UI
  function handleSearch(q: string) {
    console.log("Buscar:", q);
  }

  function goCreateEvent() {
    navigate("/events/new");
  }

  function handleJoin(ev: EventModel) {
    if (!userId) return;
    dispatch(
      subscribeToEvent({
        eventId: ev.id,
        userId,
      })
    );
  }

  // 5. convertir lo que hay en redux (EventRow[]) a lo que necesita la UI (EventModel[])
  const uiEvents: EventModel[] = eventsFromStore.map(mapRowToModel);

  // 6. render
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
          events={uiEvents}              // 👈 ahora sí es EventModel[]
          onCreate={goCreateEvent}
          loading={loadingEvents}
          error={eventsError || undefined}
          onRetry={loadEvents}
          onAbout={(ev) => navigate(`/events/${ev.id}`)}
          onJoin={handleJoin}
        />
      </section>

      <aside className="dash-right">
        <RightColumn />
      </aside>
    </div>
  );
}
