// 🔹 Community model used in the UI
export type CommunityModel = {
  events: string[];
  id: string;
  name: string;
  description?: string;
  members: number;
  image_url:string;
  memberIds?: string[]; // Array of user IDs who are members
  owner_id?: string; // User ID of the creator
  selectedEventIds?: string[]; // Array of event IDs selected for this community
  createdByProfile?: { // 👈 extra info from `profiles`
    user_name?: string | null;
    avatar_url?: string | null;
  };
  isOwner?: boolean;
  isMember?: boolean;
};

// 🔹 Raw row as it comes from Supabase (matches `communities` table)
export type CommunityRow = {
  id: string;
  name: string;
  description: string | null;
  members_id: string[];
  image_url: string; // Array of user IDs (text[] or jsonb in Supabase)
  owner_id: string; // FK to auth.users(id)
  selected_event_ids?: string[] | null; // Array of event IDs (text[] or jsonb)
  created_at: string;
  updated_at: string;
};

// 🔹 Input used when sending to Supabase via service
export type NewCommunityInput = {
  name: string;
  description?: string;
  selectedEventIds?: string[];
  imageUrl?: string;
};

// 🔹 Input for updating a community
export type UpdateCommunityInput = {
  name?: string;
  description?: string;
  selectedEventIds?: string[];
};

