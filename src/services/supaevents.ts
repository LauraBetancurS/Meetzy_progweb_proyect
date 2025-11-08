// src/services/supaevents.ts
import { supabase } from "./supabaseClient";
import type { EventRow } from "../redux/slices/EventsSlice";

// Traer todos los eventos
export async function fetchEventsFromDb(): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data as EventRow[];
}

// Crear evento (solo campos que existen en la tabla)
export async function createEventInDb(
  input: Omit<
    EventRow,
    "id" | "created_at" | "updated_at" | "isOwner" | "isJoined" | "subscribers"
  >
) {
  const { data, error } = await supabase
    .from("events")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    return null;
  }

  return data as EventRow;
}

// Editar evento (también solo lo que existe en la tabla)
export async function updateEventInDb(
  event: Partial<
    Omit<EventRow, "isOwner" | "isJoined" | "subscribers">
  > & { id: string }
) {
  const { data, error } = await supabase
    .from("events")
    .update(event)
    .eq("id", event.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating event:", error);
    return null;
  }

  return data as EventRow;
}

// Borrar evento
export async function deleteEventInDb(eventId: string) {
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) {
    console.error("Error deleting event:", error);
  }
}
