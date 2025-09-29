import type { ReactNode, ButtonHTMLAttributes } from "react";

/** Variantes disponibles por si las necesitas en props más adelante */
export type ButtonVariant = "primary" | "secondary" | "tertiary";

/** Props base reutilizables para cualquier <button> de la UI */
export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
}

export interface PrimaryButtonProps extends BaseButtonProps {
  showPlusIcon?: boolean;
}

export interface SecondaryButtonProps extends BaseButtonProps {}

export interface TertiaryButtonProps extends BaseButtonProps {}

export type FieldType = "text" | "email" | "password" | "textarea";

export interface Field {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
}

export interface FormProps {
  title?: string;
  subtitle?: string;
  fields: Field[];
  initialValues: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  submitLabel?: string;

  // Botón secundario (opcional)
  secondaryLabel?: string;
  onSecondary?: () => void;

  // Panel derecho (imagen opcional)
  rightImageUrl?: string;

  // NUEVO: logo arriba del formulario
  logoUrl?: string;

  // NUEVO: texto y enlace inferior ("You have an account? Login")
  bottomText?: string;        // ejemplo: "You have an account?"
  bottomLinkLabel?: string;   // ejemplo: "Login"
  onBottomLink?: () => void;  // acción al hacer click en el enlace
}

// ---- Sidebar ----
export interface SidebarItemProps {
  to: string;           // ruta a donde navega
  label: string;        // texto visible
  icon: React.ReactNode;// icono (un <svg> o componente)
  onClick?: () => void; // opcional
  className?: string;   // opcional
    end?: boolean           // <--- NUEVO
}

// ---- SearchBar ----
export interface SearchBarProps {
  placeholder?: string
  defaultValue?: string
  onSearch: (query: string) => void
  className?: string
}

// ---- Right column ----
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
