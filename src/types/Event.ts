// src/types/Event.ts

// 🔹 Unique identifier for events
export type EventId = string;

/**
 * 🔹 Event model used in the UI.
 * - Includes derived/optional fields like `isOwner`, `isJoined`.
 * - `createdBy` links to the user who created the event.
 * - `createdByProfile` allows showing name and avatar in the UI.
 */
export type EventModel = {
  id: string;
  name: string;
  description: string;
  place: string;
  date: string;
  startTime: string;
  imageUrl?: string;
  createdBy?: string;
  createdByProfile?: {
    user_name?: string | null;
    avatar_url?: string | null;
  };

  // flags de UI
  isOwner?: boolean;
  isJoined?: boolean;
};


// 🔹 Data to create a new event (without id or createdBy)
export type NewEvent = Omit<EventModel, "id" | "createdBy" | "createdByProfile" | "isOwner" | "isJoined">;

// 🔹 Raw row as it comes from Supabase (matches `events` table)
export type EventRow = {
  id: string;
  name: string;
  description: string | null;
  place: string;
  date: string;          // DATE returned as string
  start_time: string;    // TIME as HH:mm:ss
  image_url: string | null;
  created_by: string;    // FK to auth.users(id)
  created_at: string;
  updated_at: string;
};

// 🔹 Input used when sending to Supabase via service
export type NewEventInput = {
  name: string;
  description?: string;
  place: string;
  date: string;         // YYYY-MM-DD
  startTime: string;    // HH:mm
  imageUrl?: string;    // maps to image_url
};
