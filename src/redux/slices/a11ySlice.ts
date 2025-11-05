import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface A11yState {
  fontScale: number; // more flexible than fixed union
}

const initialState: A11yState = {
  fontScale: 1,
};

const MIN_SCALE = 0.6; // smaller than before
const MAX_SCALE = 1.8; // bigger than before
const STEP = 0.15; // each button press changes by 15%

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
  },
});

export const { setFontScale, increaseFont, decreaseFont, resetFont } = a11ySlice.actions;
export default a11ySlice.reducer;

// Selector helper
export const selectFontScale = (state: { a11y: A11yState }) => state.a11y.fontScale;
