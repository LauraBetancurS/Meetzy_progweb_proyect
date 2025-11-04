// src/redux/slices/ProfileSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { supabase } from "../../services/supabaseClient";

export type Profile = {
  id: string;
  full_name: string | null;
  user_name: string | null;
  avatar_url: string | null;
  tagline?: string | null; // optional if you add this column later
};

interface ProfileState {
  me: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  me: null,
  isLoading: false,
  error: null,
};

/** Fetch the profile row for the currently logged-in user */
export const fetchMyProfile = createAsyncThunk("profile/fetchMyProfile", async (_, { rejectWithValue }) => {
  // current auth user (needs to be logged in)
  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr) return rejectWithValue(authErr.message);
  const userId = auth.user?.id;
  if (!userId) return rejectWithValue("No logged-in user.");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, user_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) return rejectWithValue(error.message);
  if (!data) return rejectWithValue("Profile not found.");

  // If you want to read an optional tagline from metadata as fallback:
  const metaTagline = (auth.user?.user_metadata as any)?.tagline ?? null;

  return {
    ...data,
    tagline: metaTagline,
  } as Profile;
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.me = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.isLoading = false;
        state.me = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to load profile";
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
