// src/components/FontScaleApplier.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectFontScale,
  setFontScale,
  selectDyslexiaMode,
  toggleDyslexiaMode,
} from "../redux/slices/a11ySlice";

const STORAGE_FONT = "a11y:fontScale";
const STORAGE_DYS  = "a11y:dyslexiaMode";

export default function FontScaleApplier() {
  const dispatch = useAppDispatch();
  const fontScale = useAppSelector(selectFontScale);
  const dyslexiaMode = useAppSelector(selectDyslexiaMode);

  // 1) On mount, hydrate from localStorage if present
  useEffect(() => {
    // font scale
    const savedScale = localStorage.getItem(STORAGE_FONT);
    if (savedScale) {
      const parsed = Number(savedScale);
      if (!Number.isNaN(parsed)) dispatch(setFontScale(parsed));
    }

    // dyslexia mode (stored as "true"/"false")
    const savedDys = localStorage.getItem(STORAGE_DYS);
    if (savedDys !== null) {
      const wantDyslexia = savedDys === "true";
      // If stored preference differs from current, toggle to match
      if (wantDyslexia !== dyslexiaMode) {
        dispatch(toggleDyslexiaMode());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Apply font scale to CSS var + persist
  useEffect(() => {
    document.documentElement.style.setProperty("--app-font-scale", String(fontScale));
    localStorage.setItem(STORAGE_FONT, String(fontScale));
  }, [fontScale]);

  // 3) Apply Dyslexia Mode class + persist
  useEffect(() => {
    const cls = "dyslexia-mode";
    if (dyslexiaMode) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    localStorage.setItem(STORAGE_DYS, String(dyslexiaMode));
  }, [dyslexiaMode]);

  return null;
}
