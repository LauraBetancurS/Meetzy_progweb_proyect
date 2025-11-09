// src/types/Poll.ts

// 🔹 Poll model used in the UI
export type PollModel = {
  id: string;
  communityId: string;
  title: string;
  options: PollOption[];
  createdBy: string; // User ID
  createdAt: string;
  expiresAt?: string; // Optional expiration date
  createdByProfile?: { // 👈 extra info from `profiles`
    user_name?: string | null;
    avatar_url?: string | null;
  };
  isOwner?: boolean;
};

// 🔹 Poll option model
export type PollOption = {
  id: string;
  text: string;
  voteCount: number;
};

// 🔹 Raw row as it comes from Supabase (matches `polls` table)
export type PollRow = {
  id: string;
  community_id: string; // FK to communities(id)
  title: string;
  options: PollOption[]
  created_by: string; // FK to auth.users(id)
  expires_at: string | null;
  created_at: string;
  voters: {}
  
};

// 🔹 Raw row for poll options (matches `poll_options` table)
export type PollOptionRow = {
  id: string;
  poll_id: string; // FK to polls(id)
  text: string;
  created_at: string;
};

// 🔹 Input used when creating a poll
export type NewPollInput = {
  communityId: string;
  question: string;
  options: string[]; // Array of option texts
  expiresAt?: string; // ISO date string
};

// 🔹 Vote model
export type VoteModel = {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: string;
};

// 🔹 Raw row for votes (matches `votes` table)
export type VoteRow = {
  id: string;
  poll_id: string; // FK to polls(id)
  option_id: string; // FK to poll_options(id)
  user_id: string; // FK to auth.users(id)
  created_at: string;
};

