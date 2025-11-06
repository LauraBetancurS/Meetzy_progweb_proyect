// src/services/events.service.ts
import { supabase } from "./supabaseClient";
import type { EventRow, EventModel, NewEventInput } from "../types/Event";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function rowToModel(
  row: EventRow,
  opts?: {
    profilesById?: Record<string, { user_name: string | null; avatar_url: string | null }>;
    currentUid?: string | null;
  }
): EventModel {
  const createdByProfile = opts?.profilesById?.[row.created_by] ?? undefined;

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    place: row.place,
    date: row.date,                                      // YYYY-MM-DD
    startTime: row.start_time?.slice(0, 5) ?? "00:00",   // HH:mm
    imageUrl: row.image_url ?? undefined,
    createdBy: row.created_by,
    createdByProfile,                                    // { user_name, avatar_url }
    isOwner: opts?.currentUid ? row.created_by === opts.currentUid : undefined,
  };
}

function patchToDb(patch: Partial<NewEventInput>): Record<string, any> {
  const db: Record<string, any> = {};
  if (patch.name !== undefined) db.name = patch.name;
  if (patch.description !== undefined) db.description = patch.description;
  if (patch.place !== undefined) db.place = patch.place;
  if (patch.date !== undefined) db.date = patch.date;
  if (patch.startTime !== undefined) db.start_time = patch.startTime; // HH:mm
  if (patch.imageUrl !== undefined) db.image_url = patch.imageUrl || null;
  return db;
}

async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.id ?? null;
}

async function attachProfiles(rows: EventRow[]): Promise<Record<string, { user_name: string | null; avatar_url: string | null }>> {
  const creatorIds = Array.from(new Set(rows.map(r => r.created_by))).filter(Boolean);
  if (creatorIds.length === 0) return {};

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, user_name, avatar_url")
    .in("id", creatorIds);

  if (error || !profiles) return {};

  const map: Record<string, { user_name: string | null; avatar_url: string | null }> = {};
  for (const p of profiles as Array<{ id: string; user_name: string | null; avatar_url: string | null }>) {
    map[p.id] = { user_name: p.user_name, avatar_url: p.avatar_url };
  }
  return map;
}

/* ------------------------------------------------------------------ */
/* Reads (SELECT)                                                      */
/* ------------------------------------------------------------------ */

/** “Public” = whatever the RLS policies allow any authenticated user to read */
export async function fetchPublicEvents(): Promise<{ data: EventModel[]; error?: string }> {
  return fetchAllEvents();
}

export async function fetchAllEvents(): Promise<{ data: EventModel[]; error?: string }> {
  const currentUid = await getCurrentUserId();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) return { data: [], error: error.message };
  const rows = (data ?? []) as EventRow[];

  // fetch creators' profiles in one shot
  const profilesById = await attachProfiles(rows);

  return {
    data: rows.map((row) => rowToModel(row, { profilesById, currentUid })),
  };
}

export async function fetchEventById(
  eventId: string
): Promise<{ data: EventModel | null; error?: string }> {
  const currentUid = await getCurrentUserId();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null };

  const row = data as EventRow;
  const profilesById = await attachProfiles([row]);

  return { data: rowToModel(row, { profilesById, currentUid }) };
}

export async function fetchMyEvents(): Promise<{ data: EventModel[]; error?: string }> {
  const uid = await getCurrentUserId();
  if (!uid) return { data: [], error: "No authenticated user." };

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("created_by", uid)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  const rows = (data ?? []) as EventRow[];
  const profilesById = await attachProfiles(rows);

  return {
    data: rows.map((row) => rowToModel(row, { profilesById, currentUid: uid })),
  };
}

export async function fetchSubscribedEvents(): Promise<{ data: EventModel[]; error?: string }> {
  const uid = await getCurrentUserId();
  if (!uid) return { data: [], error: "No authenticated user." };

  // JOIN via event_members (we still get full event rows)
  const { data, error } = await supabase
    .from("events")
    .select("*, event_members!inner(user_id)")
    .eq("event_members.user_id", uid)
    .order("date", { ascending: true });

  if (error) return { data: [], error: error.message };

  // strip the joined payload and map as rows
  const rows = (data as any[]).map(({ event_members, ...e }) => e) as EventRow[];
  const profilesById = await attachProfiles(rows);

  return {
    data: rows.map((row) => rowToModel(row, { profilesById, currentUid: uid })),
  };
}

/* ------------------------------------------------------------------ */
/* Mutations (CRUD)                                                    */
/* ------------------------------------------------------------------ */

export async function createEvent(
  input: NewEventInput
): Promise<{ data: EventModel | null; error?: string }> {
  const payload = {
    name: input.name,
    description: input.description?.trim() || null,
    place: input.place,
    date: input.date,                      // YYYY-MM-DD
    start_time: input.startTime,           // HH:mm
    image_url: input.imageUrl?.trim() || null,
    // created_by lo rellena el trigger con auth.uid()
  };

  const { data, error } = await supabase
    .from("events")
    .insert([payload])
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  const row = data as EventRow;
  const profilesById = await attachProfiles([row]);
  const currentUid = await getCurrentUserId();

  return { data: rowToModel(row, { profilesById, currentUid }) };
}

export async function updateEvent(
  eventId: string,
  patch: Partial<NewEventInput>
): Promise<{ data: EventModel | null; error?: string }> {
  const dbPatch = patchToDb(patch);

  const { data, error } = await supabase
    .from("events")
    .update(dbPatch)
    .eq("id", eventId)
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  const row = data as EventRow;
  const profilesById = await attachProfiles([row]);
  const currentUid = await getCurrentUserId();

  return { data: rowToModel(row, { profilesById, currentUid }) };
}

export async function deleteEvent(eventId: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Membership (join/leave)                                             */
/* ------------------------------------------------------------------ */

export async function joinEvent(eventId: string): Promise<{ ok: boolean; error?: string }> {
  const uid = await getCurrentUserId();
  if (!uid) return { ok: false, error: "No authenticated user." };

  const { error } = await supabase
    .from("event_members")
    .insert([{ event_id: eventId, user_id: uid }]);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function leaveEvent(eventId: string): Promise<{ ok: boolean; error?: string }> {
  const uid = await getCurrentUserId();
  if (!uid) return { ok: false, error: "No authenticated user." };

  const { error } = await supabase
    .from("event_members")
    .delete()
    .match({ event_id: eventId, user_id: uid });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function isUserJoined(
  eventId: string
): Promise<{ joined: boolean; error?: string }> {
  const uid = await getCurrentUserId();
  if (!uid) return { joined: false, error: "No authenticated user." };

  const { count, error } = await supabase
    .from("event_members")
    .select("*", { count: "exact", head: true })
    .match({ event_id: eventId, user_id: uid });

  if (error) return { joined: false, error: error.message };
  return { joined: (count ?? 0) > 0 };
}
