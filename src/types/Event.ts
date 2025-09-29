// src/types/Event.ts

// Identificador de evento (simple alias, útil para autocompletado)
export type EventId = string;

export type EventModel = {
  id: EventId;
  name: string;
  description: string;
  place: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  createdAtMs: number;
  updatedAtMs: number;
  imageUrl?: string;   // opcional, para cards públicas/suscritas
};

// Datos para crear un evento (sin id ni timestamps)
export type NewEvent = Omit<EventModel, "id" | "createdAtMs" | "updatedAtMs">;
