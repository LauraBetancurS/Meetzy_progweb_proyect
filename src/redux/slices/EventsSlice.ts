import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { EventModel, NewEventInput } from "../../types/Event";
import {
  fetchMyEvents,
  fetchSubscribedEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} from "../../services/supaevents";

/* ---------------------- Estado inicial ---------------------- */

export interface EventsState {
  events: EventModel[];        // creados por el usuario
  subscribed: EventModel[];    // eventos a los que el usuario se unió
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  subscribed: [],
  loading: false,
  error: null,
};

/* ---------------------- Thunks async ---------------------- */

// Obtener eventos del usuario
export const loadMyEvents = createAsyncThunk("events/loadMyEvents", async (_, { rejectWithValue }) => {
  const { data, error } = await fetchMyEvents();
  if (error) return rejectWithValue(error);
  return data;
});

// Obtener eventos suscritos
export const loadSubscribedEvents = createAsyncThunk("events/loadSubscribedEvents", async (_, { rejectWithValue }) => {
  const { data, error } = await fetchSubscribedEvents();
  if (error) return rejectWithValue(error);
  return data;
});

// Crear evento
export const createNewEvent = createAsyncThunk(
  "events/createNewEvent",
  async (input: NewEventInput, { rejectWithValue }) => {
    const { data, error } = await createEvent(input);
    if (error || !data) return rejectWithValue(error || "Error al crear evento");
    return data;
  }
);

// Actualizar evento
export const updateExistingEvent = createAsyncThunk(
  "events/updateExistingEvent",
  async ({ id, patch }: { id: string; patch: Partial<NewEventInput> }, { rejectWithValue }) => {
    const { data, error } = await updateEvent(id, patch);
    if (error || !data) return rejectWithValue(error || "Error al actualizar evento");
    return data;
  }
);

// Eliminar evento
export const deleteExistingEvent = createAsyncThunk(
  "events/deleteExistingEvent",
  async (id: string, { rejectWithValue }) => {
    const { ok, error } = await deleteEvent(id);
    if (!ok) return rejectWithValue(error || "Error al eliminar evento");
    return id;
  }
);

// Unirse a evento
export const joinEventThunk = createAsyncThunk(
  "events/joinEvent",
  async (event: EventModel, { rejectWithValue }) => {
    const { ok, error } = await joinEvent(event.id);
    if (!ok) return rejectWithValue(error || "Error al unirse al evento");
    return event;
  }
);

// Salir de evento
export const leaveEventThunk = createAsyncThunk(
  "events/leaveEvent",
  async (id: string, { rejectWithValue }) => {
    const { ok, error } = await leaveEvent(id);
    if (!ok) return rejectWithValue(error || "Error al salir del evento");
    return id;
  }
);

/* ---------------------- Slice ---------------------- */

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearEvents: (state) => {
      state.events = [];
      state.subscribed = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Mis eventos
      .addCase(loadMyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMyEvents.fulfilled, (state, action: PayloadAction<EventModel[]>) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(loadMyEvents.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Suscripciones
      .addCase(loadSubscribedEvents.fulfilled, (state, action: PayloadAction<EventModel[]>) => {
        state.subscribed = action.payload;
      })

      // 🔹 Crear
      .addCase(createNewEvent.fulfilled, (state, action: PayloadAction<EventModel>) => {
        state.events.unshift(action.payload);
      })

      // 🔹 Actualizar
      .addCase(updateExistingEvent.fulfilled, (state, action: PayloadAction<EventModel>) => {
        const idx = state.events.findIndex((e) => e.id === action.payload.id);
        if (idx >= 0) state.events[idx] = action.payload;
      })

      // 🔹 Eliminar
      .addCase(deleteExistingEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
      })

      // 🔹 Unirse
      .addCase(joinEventThunk.fulfilled, (state, action: PayloadAction<EventModel>) => {
        const already = state.subscribed.some((e) => e.id === action.payload.id);
        if (!already) state.subscribed.push(action.payload);
      })

      // 🔹 Salir
      .addCase(leaveEventThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.subscribed = state.subscribed.filter((e) => e.id !== action.payload);
      });
  },
});

export const { clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
