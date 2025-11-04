// src/redux/slices/AuthSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../services/supabaseClient";

/* ------------------ Payloads ------------------ */
type RegisterPayload = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  avatarUrl?: string; // optional
};

type LoginPayload = {
  email: string;
  password: string;
};

/* ------------------ State ------------------ */
interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true, // stays true until first auth hydration
  error: null,
};

/* ------------------ Thunks ------------------ */

// REGISTER: create auth user, put full_name/user_name/avatar_url in metadata,
// and upsert public.profiles (trigger will also mirror metadata on user creation).
export const register = createAsyncThunk(
  "auth/register",
  async (
    { fullName, userName, email, password, avatarUrl }: RegisterPayload,
    { rejectWithValue }
  ) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_name: userName,
          avatar_url: avatarUrl || null, // critical
        },
      },
    });
    if (signUpError) return rejectWithValue(signUpError.message);

    const userId = signUpData.user?.id;
    if (!userId) return rejectWithValue("No user returned by Supabase.");

    // Optional immediate upsert (ok if RLS blocks; DB trigger should still populate it)
    await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: fullName,
          user_name: userName,
          avatar_url: avatarUrl || null,
        },
        { onConflict: "id" }
      );

    // Session can be null if email confirmation is ON
    const { data: sessionRes } = await supabase.auth.getSession();

    return { session: sessionRes.session, user: signUpData.user || null };
  }
);

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return rejectWithValue(error.message);
    return { session: data.session, user: data.user || null };
  }
);

// LOGOUT
export const logout = createAsyncThunk("auth/logout", async () => {
  await supabase.auth.signOut();
  return true;
});

/* ------------------ Slice ------------------ */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // For hydration via useSupabaseAuthSync (getSession/onAuthStateChange)
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
      state.isLoading = false;
      state.error = null;
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.session = action.payload.session;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Register failed";
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.session = action.payload.session;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Login failed";
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { setSession, startLoading, clearError } = authSlice.actions;
export default authSlice.reducer;
