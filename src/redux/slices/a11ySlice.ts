// src/redux/slices/a11ySlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface A11yState {
  fontScale: number;
  dyslexiaMode: boolean;
}

const initialState: A11yState = {
  fontScale: 1,
  dyslexiaMode: false,
};

const MIN_SCALE = 0.6;
const MAX_SCALE = 1.8;
const STEP = 0.15;

const a11ySlice = createSlice({
  name: "a11y",
  initialState,
  reducers: {
    setFontScale: (state, action: PayloadAction<number>) => {
      const newScale = action.payload;
      state.fontScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, +newScale.toFixed(2)));
    },
    increaseFont: (state) => {
      state.fontScale = Math.min(MAX_SCALE, +(state.fontScale + STEP).toFixed(2));
    },
    decreaseFont: (state) => {
      state.fontScale = Math.max(MIN_SCALE, +(state.fontScale - STEP).toFixed(2));
    },
    resetFont: (state) => {
      state.fontScale = 1;
    },
    toggleDyslexiaMode: (state) => {
      state.dyslexiaMode = !state.dyslexiaMode;
    },
  },
});

export const {
  setFontScale,
  increaseFont,
  decreaseFont,
  resetFont,
  toggleDyslexiaMode,
} = a11ySlice.actions;

export default a11ySlice.reducer;

export const selectFontScale = (state: { a11y: A11yState }) => state.a11y.fontScale;
export const selectDyslexiaMode = (state: { a11y: A11yState }) => state.a11y.dyslexiaMode;
