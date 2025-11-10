import { supabase } from "./supabaseClient";
import type { CommunityRow, CommunityModel, NewCommunityInput } from "../types/Community";

/** Obtiene el id del usuario autenticado en Supabase */
export async function getCurrentUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.id ?? null;
}

/** Trae los perfiles (nombre y avatar) de los dueños de las comunidades y los mapea por id */
async function attachProfiles(
  rows: Array<{ owner_id: string }>
): Promise<Record<string, { user_name: string | null; avatar_url: string | null }>> {
  const creatorIds = Array.from(new Set(rows.map(r => r.owner_id))).filter(Boolean);
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

/** Convierte una fila de la tabla communities al modelo que usa el front */
function rowToModel(
  row: CommunityRow,
  opts?: {
    profilesById?: Record<string, { user_name: string | null; avatar_url: string | null }>;
    currentUid?: string | null;
  }
): CommunityModel {
  const createdByProfile = opts?.profilesById?.[row.owner_id] ?? undefined;

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    members: row.members_id?.length ?? 0,
    memberIds: row.members_id ?? [],
    image_url: row.image_url,
    owner_id: row.owner_id,
    selectedEventIds: row.selected_event_ids ?? [],
    createdByProfile,
    // flags según el usuario actual
    isOwner: opts?.currentUid ? row.owner_id === opts.currentUid : undefined,
    isMember: opts?.currentUid ? row.members_id?.includes(opts.currentUid) : undefined,
    events: row.selected_event_ids ?? []
  };
}

/** Trae todas las comunidades, con info del usuario actual y perfiles de dueños */
export async function fetchAllCommunities(): Promise<{ data: CommunityModel[]; error?: string }> {
  const currentUid = await getCurrentUserId();

  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  const rows = (data ?? []) as CommunityRow[];

  const profilesById = await attachProfiles(rows);

  return {
    data: rows.map((row) => rowToModel(row, { profilesById, currentUid })),
  };
}

/** Trae una comunidad por id y la convierte al modelo */
export async function fetchCommunityById(
  communityId: string
): Promise<{ data: CommunityModel | null; error?: string }> {
  const currentUid = await getCurrentUserId();

  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("id", communityId)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null };

  const row = data as CommunityRow;
  const profilesById = await attachProfiles([row]);

  return { data: rowToModel(row, { profilesById, currentUid }) };
}

/** Trae solo las comunidades donde el usuario autenticado es miembro */
export async function fetchMyCommunities(): Promise<{ data: CommunityModel[]; error?: string }> {
  const uid = await getCurrentUserId();
  if (!uid) return { data: [], error: "No authenticated user." };

  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  const rows = (data ?? []) as CommunityRow[];
  
  // filtra las que sí contienen al usuario
  const myCommunities = rows.filter((row) => 
    row.members_id && Array.isArray(row.members_id) && row.members_id.includes(uid)
  );

  const profilesById = await attachProfiles(myCommunities);

  return {
    data: myCommunities.map((row) => rowToModel(row, { profilesById, currentUid: uid })),
  };
}

/** Crea una nueva comunidad con el usuario actual como dueño y primer miembro */
export async function createCommunity(
  input: NewCommunityInput
): Promise<{ data: CommunityModel | null; error?: string }> {
  try {
    const uid = await getCurrentUserId();
    if (!uid) return { data: null, error: "Debes iniciar sesión para crear una comunidad." };

    if (!input.name?.trim()) {
      return { data: null, error: "El nombre de la comunidad es requerido." };
    }

    const payload = {
      name: input.name.trim(),
      description: input.description?.trim() || null,
      members_id: [uid],
      selected_event_ids: input.selectedEventIds || [],
      owner_id: uid,
      image_url: input.imageUrl?.trim() || null,
    };

    const { data, error } = await supabase
      .from("communities")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return { 
        data: null, 
        error: error.message === 'JSON object requested, multiple (or no) rows returned'
          ? 'Error al crear la comunidad. Por favor, inténtalo de nuevo.'
          : error.message 
      };
    }

    const row = data as CommunityRow;
    const profilesById = await attachProfiles([row]);

    return { data: rowToModel(row, { profilesById, currentUid: uid }) };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { data: null, error: 'Error inesperado al crear la comunidad.' };
  }
}

/** Agrega un usuario al array de miembros de una comunidad */
//Revisar si el usuario que queremos agregar ya está ahí. y Si no está, lo mete en esa lista y actualiza la comunidad en la base de datos.
export async function addMemberToCommunity(
  communityId: string,
  userId: string
): Promise<{ ok: boolean; error?: string }> {

  // primero trae los miembros actuales
  const { data: community, error: fetchError } = await supabase
    .from("communities")
    .select("members_id")
    .eq("id", communityId)
    .single();

  if (fetchError) return { ok: false, error: fetchError.message };
  if (!community) return { ok: false, error: "Community not found" };

  const currentMembers = (community.members_id as string[]) || [];
  if (currentMembers.includes(userId)) {
    return { ok: true }; // ya estaba
  }

  // actualiza con el nuevo miembro
  const { error } = await supabase
    .from("communities")
    .update({ members_id: [...currentMembers, userId] })
    .eq("id", communityId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Saca a un usuario del array de miembros de una comunidad */
export async function removeMemberFromCommunity(
  communityId: string,
  userId: string
): Promise<{ ok: boolean; error?: string }> {

  const { data: community, error: fetchError } = await supabase
    .from("communities")
    .select("members_id")
    .eq("id", communityId)
    .single();

  if (fetchError) return { ok: false, error: fetchError.message };
  if (!community) return { ok: false, error: "Community not found" };

  const currentMembers = (community.members_id as string[]) || [];
  const updatedMembers = currentMembers.filter((id) => id !== userId);

  // actualiza la lista sin ese usuario
  const { error } = await supabase
    .from("communities")
    .update({ members_id: updatedMembers })
    .eq("id", communityId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Asocia un evento a la comunidad y suscribe a todos los miembros al evento */
export async function selectEventForCommunity(
  communityId: string,
  eventId: string
): Promise<{ ok: boolean; error?: string }> {
 
  // trae eventos ya seleccionados y miembros
  const { data: community, error: fetchError } = await supabase
    .from("communities")
    .select("selected_event_ids, members_id")
    .eq("id", communityId)
    .single();

  if (fetchError) return { ok: false, error: fetchError.message };
  if (!community) return { ok: false, error: "Community not found" };

  const currentEvents = (community.selected_event_ids as string[]) || [];
  if (currentEvents.includes(eventId)) {
    return { ok: true };
  }

  // 1. actualiza la comunidad con el nuevo evento
  const { error: updateError } = await supabase
    .from("communities")
    .update({ selected_event_ids: [...currentEvents, eventId] })
    .eq("id", communityId);

  if (updateError) return { ok: false, error: updateError.message };

  // 2. suscribe a todos los miembros al evento
  const members = (community.members_id as string[]) || [];
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("subscribers")
    .eq("id", eventId)
    .single();

  if (!eventError && event) {
    const currentSubscribers = (event.subscribers as string[]) || [];
    const newSubscribers = Array.from(new Set([...currentSubscribers, ...members]));

    const { error: subscribeError } = await supabase
      .from("events")
      .update({ subscribers: newSubscribers })
      .eq("id", eventId);

    if (subscribeError) {
      console.error("Error subscribing members:", subscribeError);
    }
  }

  return { ok: true };
}
