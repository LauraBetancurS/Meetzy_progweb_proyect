// src/types/ui.ts
import type { ReactNode, ButtonHTMLAttributes } from "react";

/** Variantes disponibles por si las necesitas en props más adelante */
export type ButtonVariant = "primary" | "secondary" | "tertiary";

/** Props base reutilizables para cualquier <button> de la UI */
export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean; // ancho completo opcional
}

/** Props específicas por botón (por claridad y para evitar "props fantasma") */
export interface PrimaryButtonProps extends BaseButtonProps {
  showPlusIcon?: boolean;
}

export interface SecondaryButtonProps extends BaseButtonProps {}

export interface TertiaryButtonProps extends BaseButtonProps {}
