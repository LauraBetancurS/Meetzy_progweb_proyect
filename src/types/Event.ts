// src/types/Event.ts

// 🔹 Identificador de evento (alias útil para autocompletado)
export type EventId = string;

// 🔹 Modelo de evento principal (tal como lo manejan los componentes)
export type EventModel = {
  id: EventId;
  name: string;
  description: string;
  place: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  imageUrl?: string;   // ✅ URL opcional de la imagen del evento
};

// 🔹 Estructura para crear un evento (sin id)
export type NewEvent = Omit<EventModel, "id">;

// 🔹 Representación del registro real en Supabase
// (coincide con la tabla "events" en la base de datos)
export type EventRow = {
  id: string;
  name: string;
  description: string | null;
  place: string;
  date: string;         // YYYY-MM-DD
  start_time: string;   // HH:mm:ss (como lo devuelve Postgres)
  image_url: string | null; // ✅ nuevo campo en BD
  created_by: string;
  created_at: string;
  updated_at: string;
};

// 🔹 Entrada normalizada para enviar al servicio Supabase
export type NewEventInput = {
  name: string;
  description?: string;
  place: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  imageUrl?: string;   // ✅ se mapea a image_url en la BD
};
