import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EventModel } from "../../types/Event";

const STORAGE_KEY = "meetzy.subscribed";

/* ---------- Estado inicial ---------- */

interface SubscriptionsState {
  subscribed: EventModel[];
}

// Cargar desde localStorage (igual que tu useState inicial)
function loadInitialSubscriptions(): EventModel[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EventModel[]) : [];
  } catch {
    return [];
  }
}

const initialState: SubscriptionsState = {
  subscribed: loadInitialSubscriptions(),
};

/* ---------- Slice ---------- */

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    // join(ev: EventModel)
    join: (state, action: PayloadAction<EventModel>) => {
      const event = action.payload;
      const alreadyJoined = state.subscribed.some((e) => e.id === event.id);

      if (!alreadyJoined) {
        state.subscribed.push(event);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.subscribed));
      }
    },

    // leave(id: string)
    leave: (state, action: PayloadAction<string>) => {
      state.subscribed = state.subscribed.filter((e) => e.id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.subscribed));
    },

    // opcional: reemplazar todo el listado (por ejemplo al sincronizar)
    setSubscriptions: (state, action: PayloadAction<EventModel[]>) => {
      state.subscribed = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.subscribed));
    },
  },
});

/* ---------- Exports ---------- */

export const { join, leave, setSubscriptions } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
