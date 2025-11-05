import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FontScale = 0.85 | 1 | 1.15 | 1.3;

type A11yState = { fontScale: FontScale };
const initialState: A11yState = { fontScale: 1 };

const a11ySlice = createSlice({
  name: "a11y",
  initialState,
  reducers: {
    setFontScale: (s, a: PayloadAction<FontScale>) => { s.fontScale = a.payload; },
    increaseFont: (s) => { s.fontScale = (Math.min(1.3, +(s.fontScale + 0.15).toFixed(2)) as FontScale); },
    decreaseFont: (s) => { s.fontScale = (Math.max(0.85, +(s.fontScale - 0.15).toFixed(2)) as FontScale); },
    resetFont:    (s) => { s.fontScale = 1; },
  },
});

export const { setFontScale, increaseFont, decreaseFont, resetFont } = a11ySlice.actions;
export default a11ySlice.reducer;
