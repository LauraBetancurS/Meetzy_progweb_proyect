// src/context/EventContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { EventModel, EventId, NewEvent } from "../types/Event";
import { mockEvents } from "../mocks/events.mock";

const STORAGE_KEY = "events:v1";

/* =========================
   State & Reducer
========================= */
type State = {
  events: EventModel[];
};

type Action =
  | { type: "hydrate"; payload: EventModel[] }
  | { type: "add"; payload: EventModel }
  | { type: "update"; payload: { id: EventId; changes: Partial<EventModel> } }
  | { type: "delete"; payload: EventId };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { events: action.payload };
    case "add":
      return { events: [action.payload, ...state.events] };
    case "update":
      return {
        events: state.events.map((ev) =>
          ev.id === action.payload.id
            ? { ...ev, ...action.payload.changes, updatedAtMs: Date.now() }
            : ev
        ),
      };
    case "delete":
      return { events: state.events.filter((ev) => ev.id !== action.payload) };
    default:
      return state;
  }
}

/* =========================
   Context
========================= */
type EventsContextValue = {
  events: EventModel[];
  addEvent: (data: NewEvent) => EventModel;
  updateEvent: (id: EventId, changes: Partial<EventModel>) => void;
  deleteEvent: (id: EventId) => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);

function genId(): EventId {
  return Math.random().toString(36).slice(2, 10);
}

/* =========================
   Provider
========================= */
export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ Initialize directly from localStorage (or mock if empty)
  const initializer = (): State => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { events: JSON.parse(raw) as EventModel[] };
      }
    } catch (err) {
      console.error("Failed to parse localStorage", err);
    }
    return { events: mockEvents }; // fallback
  };

  const [state, dispatch] = useReducer(reducer, { events: [] }, initializer);

  // ✅ Persist every time events change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
  }, [state.events]);

  const addEvent = (data: NewEvent): EventModel => {
    const now = Date.now();
    const newEvent: EventModel = {
      id: genId(),
      createdAtMs: now,
      updatedAtMs: now,
      ...data,
    };
    dispatch({ type: "add", payload: newEvent });
    return newEvent;
  };

  const updateEvent = (id: EventId, changes: Partial<EventModel>) => {
    dispatch({ type: "update", payload: { id, changes } });
  };

  const deleteEvent = (id: EventId) => {
    dispatch({ type: "delete", payload: id });
  };

  return (
    <EventsContext.Provider value={{ events: state.events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

/* =========================
   Hook
========================= */
export const useEvents = () => {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
};
