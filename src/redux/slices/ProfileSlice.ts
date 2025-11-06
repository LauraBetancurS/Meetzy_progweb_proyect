// src/redux/slices/ProfileSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabaseClient";

export type Profile = {
  id: string;
  full_name: string | null;
  user_name: string | null;
  avatar_url: string | null;
  tagline?: string | null;
};

export type UpdateProfileInput = {
  full_name?: string | null;
  user_name?: string | null;
  avatar_url?: string | null;
  tagline?: string | null; // keep optional if you add it later
};

interface ProfileState {
  me: Profile | null;
  isLoading: boolean; // fetch loading
  isSaving: boolean;  // save/persist loading
  error: string | null;
}

const initialState: ProfileState = {
  me: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

/** Fetch the profile row for the currently logged-in user */
export const fetchMyProfile = createAsyncThunk<Profile, void, { rejectValue: string }>(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
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

    const metaTagline = (auth.user?.user_metadata as any)?.tagline ?? null;

    return { ...data, tagline: metaTagline } as Profile;
  }
);

/** Save (upsert) partial profile fields for the current user */
export const saveMyProfile = createAsyncThunk<Profile, UpdateProfileInput, { rejectValue: string }>(
  "profile/saveMyProfile",
  async (partial, { rejectWithValue }) => {
    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr) return rejectWithValue(authErr.message);
    const userId = auth.user?.id;
    if (!userId) return rejectWithValue("No logged-in user.");

    const payload: Record<string, any> = { id: userId };
    if ("full_name" in partial) payload.full_name = partial.full_name;
    if ("user_name" in partial) payload.user_name = partial.user_name;
    if ("avatar_url" in partial) payload.avatar_url = partial.avatar_url;

    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload)
      .select("id, full_name, user_name, avatar_url")
      .single();

    if (error) return rejectWithValue(error.message);

    // optionally persist tagline in auth metadata (if you use it)
    if ("tagline" in partial) {
      const { error: mErr } = await supabase.auth.updateUser({
        data: { tagline: partial.tagline ?? null },
      });
      if (mErr) {
        // not fatal; continue
        console.warn("Failed to update auth metadata:", mErr.message);
      }
    }

    return {
      ...data,
      tagline: (auth.user?.user_metadata as any)?.tagline ?? null,
    } as Profile;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.me = null;
      state.isLoading = false;
      state.isSaving = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
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
      })
      // save
      .addCase(saveMyProfile.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveMyProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.isSaving = false;
        state.me = action.payload;
      })
      .addCase(saveMyProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.error = (action.payload as string) || "Failed to save profile";
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

// ✅ Selectors
export const selectMyProfile       = (s: { profile: ProfileState }) => s.profile.me;
export const selectProfileLoading  = (s: { profile: ProfileState }) => s.profile.isLoading;
export const selectProfileSaving   = (s: { profile: ProfileState }) => s.profile.isSaving;
export const selectProfileError    = (s: { profile: ProfileState }) => s.profile.error;
