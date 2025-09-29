// src/context/EventContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { EventModel, EventId, NewEvent } from "../types/Event";
// Si tienes un mock inicial opcional, mantenlo; si no, quita esta línea.
import { mockEvents } from "../mocks/events.mock"; // <- si no existe quítalo o crea el archivo

const STORAGE_KEY = "events:v1";

/* =========================
   Actions & State
========================= */
type State = {
  events: EventModel[];
};

type Action =
  | { type: "hydrate"; payload: { events: EventModel[] } }
  | { type: "add"; payload: { event: EventModel } }
  | {
      type: "update";
      payload: { id: EventId; changes: Partial<Omit<EventModel, "id" | "createdAtMs">> };
    }
  | { type: "delete"; payload: { id: EventId } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { events: action.payload.events };
    case "add":
      return { events: [action.payload.event, ...state.events] };
    case "update": {
      const { id, changes } = action.payload;
      return {
        events: state.events.map((ev) =>
          ev.id === id ? { ...ev, ...changes, updatedAtMs: Date.now() } : ev
        ),
      };
    }
    case "delete":
      return { events: state.events.filter((ev) => ev.id !== action.payload.id) };
    default:
      return state;
  }
}

/* =========================
   Context API
========================= */
type EventsContextValue = {
  events: EventModel[];
  addEvent: (data: NewEvent) => EventModel;
  updateEvent: (
    id: EventId,
    changes: Partial<Omit<EventModel, "id" | "createdAtMs">>
  ) => void;
  deleteEvent: (id: EventId) => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);

/* =========================
   Provider
========================= */
function genId(): EventId {
  return Math.random().toString(36).slice(2, 10);
}

const initialState: State = {
  // Si no tienes mockEvents, arranca vacío: events: []
  events: typeof mockEvents !== "undefined" ? mockEvents : [],
};

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as EventModel[];
        dispatch({ type: "hydrate", payload: { events: parsed } });
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistir cambios
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
  }, [state.events]);

  const addEvent: EventsContextValue["addEvent"] = (data) => {
    const now = Date.now();
    const event: EventModel = {
      id: genId(),
      createdAtMs: now,
      updatedAtMs: now,
      ...data,
    };
    dispatch({ type: "add", payload: { event } });
    return event; // útil para navegar con highlightId
  };

  const updateEvent: EventsContextValue["updateEvent"] = (id, changes) => {
    dispatch({ type: "update", payload: { id, changes } });
  };

  const deleteEvent: EventsContextValue["deleteEvent"] = (id) => {
    dispatch({ type: "delete", payload: { id } });
  };

  const value = useMemo<EventsContextValue>(
    () => ({
      events: state.events,
      addEvent,
      updateEvent,
      deleteEvent,
    }),
    [state.events]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

/* =========================
   Hook
========================= */
export const useEvents = (): EventsContextValue => {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
};
