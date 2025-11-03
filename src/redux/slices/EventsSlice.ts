import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EventModel, EventId, NewEvent } from "../../types/Event";
import { mockEvents } from "../../mocks/events.mock";

const STORAGE_KEY = "events:v1";

/* ---------- helpers que antes estaban en el contexto ---------- */

// cargar eventos desde localStorage o usar mocks (lo mismo que tu lazy init)
function loadInitialEvents(): EventModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as EventModel[];
    }
  } catch {
    // si falla, seguimos con los mocks
  }
  return mockEvents;
}

// generar id como en el contexto
function genId(): EventId {
  return Math.random().toString(36).slice(2, 10);
}

/* ---------- estado inicial ---------- */

interface EventsState {
  events: EventModel[];
}

const initialState: EventsState = {
  events: loadInitialEvents(),
};

/* ---------- slice ---------- */

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // addEvent(data: NewEvent): EventModel
    addEvent: (state, action: PayloadAction<NewEvent>) => {
      const created: EventModel = {
        id: genId(),
        ...action.payload,
      };
      // lo ponemos al inicio como hacías tú
      state.events.unshift(created);

      // persistimos igual que en el useEffect
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
    },

    // updateEvent(id, changes)
    updateEvent: (
      state,
      action: PayloadAction<{ id: EventId; changes: Partial<EventModel> }>
    ) => {
      const { id, changes } = action.payload;
      state.events = state.events.map((ev) =>
        ev.id === id ? { ...ev, ...changes } : ev
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
    },

    // deleteEvent(id)
    deleteEvent: (state, action: PayloadAction<EventId>) => {
      state.events = state.events.filter((ev) => ev.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
    },
  },
});

/* ---------- exports ---------- */

export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
