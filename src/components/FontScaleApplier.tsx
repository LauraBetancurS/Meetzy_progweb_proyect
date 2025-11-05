import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";

export default function FontScaleApplier() {
  const fontScale = useAppSelector((s) => s.a11y.fontScale);

  useEffect(() => {
    document.documentElement.style.setProperty("--app-font-scale", String(fontScale));
  }, [fontScale]);

  return null; // no UI
}
