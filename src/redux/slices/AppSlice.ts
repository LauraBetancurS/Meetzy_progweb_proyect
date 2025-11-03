// src/redux/slices/AppSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, Community, Event, MoodAnswer } from "../../types";

/* ---------- Estado inicial (equivalente al AppProvider) ---------- */

const initialCommunities: Community[] = [
  { id: "c1", name: "Diseño de Interacción", description: "UX / UI / HCI", members: 125 },
  { id: "c2", name: "Frontend Cali", description: "React, TS y más", members: 312 },
];

const initialEvents: Event[] = [
  { id: "e1", title: "Meetup React", date: new Date().toISOString(), location: "Auditorio A", communityId: "c2" },
];

interface AppState {
  user: User | null;
  communities: Community[];
  events: Event[];
  moodAnswers: MoodAnswer[];
}

const initialState: AppState = {
  user: { id: "u1", name: "Lau", email: "lau@example.com" },
  communities: initialCommunities,
  events: initialEvents,
  moodAnswers: [],
};

/* ---------- Slice ---------- */

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // login(u: User)
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // logout()
    logout: (state) => {
      state.user = null;
    },

    // addCommunity(c: Community)
    addCommunity: (state, action: PayloadAction<Community>) => {
      state.communities.push(action.payload);
    },

    // addEvent(e: Event)
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },

    // answerMood(a: MoodAnswer)
    answerMood: (state, action: PayloadAction<MoodAnswer>) => {
      state.moodAnswers.push(action.payload);
    },

    // opcional: limpiar respuestas de mood
    resetMoodAnswers: (state) => {
      state.moodAnswers = [];
    },
  },
});

/* ---------- Exports ---------- */

export const {
  login,
  logout,
  addCommunity,
  addEvent,
  answerMood,
  resetMoodAnswers,
} = appSlice.actions;

export default appSlice.reducer;
