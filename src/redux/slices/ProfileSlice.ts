// src/redux/slices/ProfileSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../services/supabaseClient";

/* -------------------- Types -------------------- */
export type Profile = {
  id: string;
  full_name: string | null;
  user_name: string | null;
  avatar_url: string | null;
};

export type UpdateProfileInput = {
  full_name?: string | null;
  user_name?: string | null;
  avatar_url?: string | null;
};

/* -------------------- State -------------------- */
interface ProfileState {
  me: Profile | null;
  isLoading: boolean;   // fetching
  isSaving: boolean;    // saving
  error: string | null;
}

const initialState: ProfileState = {
  me: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

/* -------------------- Slice -------------------- */
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setMe: (state, action: PayloadAction<Profile | null>) => {
      state.me = action.payload;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProfileSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setProfileError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.me = null;
      state.isLoading = false;
      state.isSaving = false;
      state.error = null;
    },
  },
});

export const {
  setMe,
  setProfileLoading,
  setProfileSaving,
  setProfileError,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;

/* -------------------- Simple async actions (arrow functions) -------------------- */
/** Fetch current user's profile (very basic checks). */
export const fetchMyProfile = () => {
  return async (dispatch: any): Promise<Profile> => {
    dispatch(setProfileLoading(true));
    dispatch(setProfileError(null));

    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) {
        const msg = "No logged-in user.";
        dispatch(setProfileError(msg));
        dispatch(setProfileLoading(false));
        throw new Error(msg);
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, user_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (error || !data) {
        const msg = error?.message || "Profile not found.";
        dispatch(setProfileError(msg));
        dispatch(setProfileLoading(false));
        throw new Error(msg);
      }

      const profile: Profile = {
        id: data.id,
        full_name: data.full_name,
        user_name: data.user_name,
        avatar_url: data.avatar_url,
      };

      dispatch(setMe(profile));
      dispatch(setProfileLoading(false));
      return profile;
    } catch (e: any) {
      dispatch(setProfileError(e?.message || "Failed to load profile"));
      dispatch(setProfileLoading(false));
      throw e;
    }
  };
};

/** Save partial profile; store is updated so UI refreshes. */
export const saveMyProfile = (partial: UpdateProfileInput) => {
  return async (dispatch: any): Promise<Profile> => {
    dispatch(setProfileSaving(true));
    dispatch(setProfileError(null));

    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) {
        const msg = "No logged-in user.";
        dispatch(setProfileError(msg));
        dispatch(setProfileSaving(false));
        throw new Error(msg);
      }

      // minimal payload
      const payload: Record<string, any> = { id: userId };
      if ("full_name" in partial) payload.full_name = partial.full_name;
      if ("user_name" in partial) payload.user_name = partial.user_name;
      if ("avatar_url" in partial) payload.avatar_url = partial.avatar_url;

      const { data, error } = await supabase
        .from("profiles")
        .upsert(payload)
        .select("id, full_name, user_name, avatar_url")
        .single();

      if (error || !data) {
        const msg = error?.message || "Failed to save profile";
        dispatch(setProfileError(msg));
        dispatch(setProfileSaving(false));
        throw new Error(msg);
      }

      const updated: Profile = {
        id: data.id,
        full_name: data.full_name,
        user_name: data.user_name,
        avatar_url: data.avatar_url,
      };

      dispatch(setMe(updated));          // ✅ updates Redux -> UI re-renders
      dispatch(setProfileSaving(false)); // stop spinner
      return updated;
    } catch (e: any) {
      dispatch(setProfileError(e?.message || "Failed to save profile"));
      dispatch(setProfileSaving(false));
      throw e;
    }
  };
};

/* -------------------- Selectors -------------------- */
export const selectMyProfile      = (s: { profile: ProfileState }) => s.profile.me;
export const selectProfileLoading = (s: { profile: ProfileState }) => s.profile.isLoading;
export const selectProfileSaving  = (s: { profile: ProfileState }) => s.profile.isSaving;
export const selectProfileError   = (s: { profile: ProfileState }) => s.profile.error;
