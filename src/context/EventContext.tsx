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