import { createContext, useContext, useEffect, useState } from "react";
import type { EventModel, EventId, NewEvent } from "../types/Event";
import { mockEvents } from "../mocks/events.mock";

const STORAGE_KEY = "events:v1";

/** --------- Tipos del contexto (básicos) ---------- */
type EventsContextValue = {
  events: EventModel[];
  addEvent: (data: NewEvent) => EventModel;
  updateEvent: (id: EventId, changes: Partial<EventModel>) => void;
  deleteEvent: (id: EventId) => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);

/** --------- Util: ID simple ---------- */
function genId(): EventId {
  return Math.random().toString(36).slice(2, 10);
}

/** --------- Provider (sin React.FC) ---------- */
export function EventsProvider({ children }: { children: React.ReactNode }) {
  // Lazy init: intenta cargar de localStorage, si no, usa mocks
  const [events, setEvents] = useState<EventModel[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as EventModel[];
    } catch {
  
    }
    return mockEvents;
  });

  // Persistir en localStorage cuando cambien los eventos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // Crear
  function addEvent(data: NewEvent): EventModel {
    const now = Date.now();
    const created: EventModel = {
      id: genId(),
      createdAtMs: now,
      updatedAtMs: now,
      ...data,
    };
    setEvents((prev) => [created, ...prev]);
    return created;
  }

  // Actualizar
  function updateEvent(id: EventId, changes: Partial<EventModel>) {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, ...changes, updatedAtMs: Date.now() } : ev
      )
    );
  }

  // Eliminar
  function deleteEvent(id: EventId) {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  }

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

/** --------- Hook ---------- */
export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
