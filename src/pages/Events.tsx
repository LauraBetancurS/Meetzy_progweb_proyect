import type { EventRow } from "../redux/slices/EventsSlice";
import type { EventModel } from "../types/Event";

function mapRowToModel(
  row: EventRow,
  isOwnerComputed: boolean,
  isJoinedComputed: boolean
): EventModel {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    place: row.place ?? "",
    date: row.date ?? "",
    startTime: row.start_time ? row.start_time.slice(0, 5) : "",
    imageUrl: row.image_url ?? undefined,
    createdBy: row.created_by,
    createdByProfile: undefined,
    isOwner: isOwnerComputed,
    isJoined: isJoinedComputed,
  };
}
