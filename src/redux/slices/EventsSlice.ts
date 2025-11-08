// src/redux/slices/eventsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type EventRow = {
  id: string;
  name: string;
  description: string | null;
  place: string | null;
  date: string | null;
  start_time: string | null;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
  image_url: string | null;
  subscribers?: string[];

  // 👇 estas dos son solo para la app (no vienen de supabase)
  isOwner?: boolean;
  isJoined?: boolean;
};

type EventsState = {
  events: EventRow[];
};

const initialState: EventsState = {
  events: [],
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    saveEvents: (state, action: PayloadAction<EventRow[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<EventRow>) => {
      state.events.push(action.payload);
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((ev) => ev.id !== action.payload);
    },
    subscribeToEvent: (
      state,
      action: PayloadAction<{ eventId: string; userId: string }>
    ) => {
      const { eventId, userId } = action.payload;
      const ev = state.events.find((e) => e.id === eventId);
      if (!ev) return;
      if (!ev.subscribers) ev.subscribers = [];
      if (!ev.subscribers.includes(userId)) {
        ev.subscribers.push(userId);
      }
    },
    editEvent: (state, action: PayloadAction<EventRow>) => {
      const index = state.events.findIndex(
        (ev) => ev.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
  },
});

export const {
  saveEvents,
  addEvent,
  deleteEvent,
  subscribeToEvent,
  editEvent,
} = eventsSlice.actions;

export default eventsSlice.reducer;
