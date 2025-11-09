import { supabase } from "./supabaseClient";
import type { EventRow } from "../redux/slices/EventsSlice";

// Traer todos los eventos y construir subscribers desde event_members
export async function fetchEventsFromDb(): Promise<EventRow[]> {
  // 1. eventos
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  if (eventsError || !eventsData) {
    console.error("Error fetching events:", eventsError);
    return [];
  }

  // 2. miembros de eventos
  const { data: membersData, error: membersError } = await supabase
    .from("event_members")
    .select("event_id, user_id");

  if (membersError) {
    console.error("Error fetching event members:", membersError);
    // devolvemos solo los eventos
    return eventsData as EventRow[];
  }

  // 3. agrupar por evento
  const membersByEvent = new Map<string, string[]>();
  for (const m of membersData) {
    const arr = membersByEvent.get(m.event_id) ?? [];
    arr.push(m.user_id);
    membersByEvent.set(m.event_id, arr);
  }

  // 4. devolver eventos enriquecidos
  const enriched: EventRow[] = (eventsData as EventRow[]).map((ev) => ({
    ...ev,
    subscribers: membersByEvent.get(ev.id) ?? [],
  }));

  return enriched;
}

// Crear evento
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

// Editar evento
export async function updateEventInDb(
  event: Partial<Omit<EventRow, "isOwner" | "isJoined" | "subscribers">> & {
    id: string;
  }
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

// SUSCRIBIR: insert en event_members
export async function subscribeUserToEventInDb(
  eventId: string,
  userId: string
) {
  // evitar duplicado
  const { data: existing, error: selectError } = await supabase
    .from("event_members")
    .select("event_id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError) {
    console.error("Error checking existing membership:", selectError);
  }

  if (!existing) {
    const { error: insertError } = await supabase
      .from("event_members")
      .insert({ event_id: eventId, user_id: userId });
    if (insertError) {
      console.error("Error subscribing user to event:", insertError);
      return null;
    }
  }

  return { event_id: eventId, user_id: userId };
}

// DESUSCRIBIR: delete en event_members
export async function unsubscribeUserFromEventInDb(
  eventId: string,
  userId: string
) {
  const { error } = await supabase
    .from("event_members")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error unsubscribing user from event:", error);
    return null;
  }

  return { event_id: eventId, user_id: userId };
}
