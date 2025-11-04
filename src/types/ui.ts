// src/types/ui.ts
import type { ReactNode, ButtonHTMLAttributes } from "react";

/** Variantes disponibles por si las necesitas en props más adelante */
export type ButtonVariant = "primary" | "secondary" | "tertiary";

/** Props base reutilizables para cualquier <button> de la UI */
export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
}

export interface PrimaryButtonProps extends BaseButtonProps {
  showPlusIcon?: boolean;
}

export interface SecondaryButtonProps extends BaseButtonProps {}
export interface TertiaryButtonProps extends BaseButtonProps {}

/* ----------------------------- Forms: Field ----------------------------- */

type BaseField = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
};

// Discriminated union by `type` so TS can narrow correctly
export type TextField =
  | (BaseField & { type?: "text" | "email" | "password" | "number" }); // default text-like
export type TextareaField = BaseField & { type: "textarea" };
export type FileField = BaseField & { type: "file" };

export type Field = TextField | TextareaField | FileField;

/** Form props shared across form components */
export interface FormProps {
  title?: string;
  subtitle?: string;
  fields: Field[];
  // Allow File values (e.g., avatar) -> use any instead of string
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  submitLabel?: string;

  // Botón secundario (opcional)
  secondaryLabel?: string;
  onSecondary?: () => void;

  // Panel derecho (imagen opcional)
  rightImageUrl?: string;

  // Logo arriba del formulario
  logoUrl?: string;

  // Texto y enlace inferior ("You have an account? Login")
  bottomText?: string;       // ejemplo: "You have an account?"
  bottomLinkLabel?: string;  // ejemplo: "Login"
  onBottomLink?: () => void; // acción al hacer click en el enlace
}

/* ------------------------------ Sidebar -------------------------------- */

export interface SidebarItemProps {
  to: string;            // ruta a donde navega
  label: string;         // texto visible
  icon: ReactNode;       // icono (un <svg> o componente)
  onClick?: () => void;  // opcional
  className?: string;    // opcional
  end?: boolean;         // NUEVO
}

/* ----------------------------- Search Bar ------------------------------ */

export interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  className?: string;
}

/* ---------------------------- Right column ----------------------------- */

export interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  startOnMonday?: boolean; // default: true
  className?: string;
}

export interface PromoBannerProps {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

/* ----------------------- Composer (dashboard) -------------------------- */

export interface CommunityOption {
  id: string;
  name: string;
}

export interface ComposerProps {
  /** Lista de comunidades a elegir (si no envías, el componente usa un default) */
  communities?: CommunityOption[];
  /** Callback cuando el usuario postea */
  onPost: (payload: { text: string; communityId: string }) => void;
  className?: string;
}
