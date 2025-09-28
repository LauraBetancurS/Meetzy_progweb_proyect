import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { EventModel, EventId, NewEvent } from "../types/Event";
import { mockEvents } from "../mocks/events.mock";

const STORAGE_KEY = "events:v1";

// Actions & State
type Action =
  | { type: "add"; payload: { event: EventModel } }
  | { type: "update"; payload: { id: EventId; changes: Partial<Omit<EventModel, "id" | "createdAtMs">> } }
  | { type: "remove"; payload: { id: EventId } }
  | { type: "set"; payload: { events: EventModel[] } };

type State = { events: EventModel[] };

// Lee desde localStorage si hay datos; si no, usa mocks.
function loadInitial(): EventModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as EventModel[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore parse errors and fall back to mocks
  }
  return mockEvents;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set":
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

    case "remove":
      return { events: state.events.filter((e) => e.id !== action.payload.id) };

    default:
      return state;
  }
}

// Context
type EventsContextValue = {
  events: EventModel[];
  addEvent: (data: NewEvent) => EventModel;
  updateEvent: (id: EventId, changes: Partial<Omit<EventModel, "id" | "createdAtMs">>) => void;
  deleteEvent: (id: EventId) => void;
  // opcional: helper para resetear a mocks si lo necesitas en algún admin
  resetToMocks?: () => void;
};

const EventsContext = createContext<EventsContextValue | undefined>(undefined);

// ID generator
function genId(): EventId {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado inicial desde localStorage o mocks
  const [state, dispatch] = useReducer(reducer, { events: loadInitial() });

  // Persiste cada cambio (crear/editar/eliminar)
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
    return event;
  };

  const updateEvent: EventsContextValue["updateEvent"] = (id, changes) => {
    dispatch({ type: "update", payload: { id, changes } });
  };

  const deleteEvent: EventsContextValue["deleteEvent"] = (id) => {
    dispatch({ type: "remove", payload: { id } });
  };

  const resetToMocks = () => {
    dispatch({ type: "set", payload: { events: mockEvents } });
  };

  const value = useMemo<EventsContextValue>(
    () => ({ events: state.events, addEvent, updateEvent, deleteEvent, resetToMocks }),
    [state.events]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within <EventsProvider>");
  return ctx;
}