// src/redux/slices/AuthSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../services/supabaseClient";

type RegisterPayload = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
};

type LoginPayload = {
  email: string;
  password: string;
};

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;  // true until we bootstrap from Supabase
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  error: null,
};

/* ----------------------- Thunks you already had ----------------------- */

export const register = createAsyncThunk(
  "auth/register",
  async ({ fullName, userName, email, password, avatarUrl }: RegisterPayload, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, user_name: userName, avatar_url: avatarUrl ?? null } },
    });
    if (error) return rejectWithValue(error.message);

    const userId = data.user?.id;
    if (userId) {
      await supabase
        .from("profiles")
        .upsert({ id: userId, full_name: fullName, user_name: userName, avatar_url: avatarUrl ?? null }, { onConflict: "id" });
    }
    return { session: (await supabase.auth.getSession()).data.session, user: data.user ?? null };
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return rejectWithValue(error.message);
    return { session: data.session, user: data.user ?? null };
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await supabase.auth.signOut();
  return true;
});

/* -------------------- NEW: bootstrap + listener helpers -------------------- */

/** 1) Bootstrap Redux from the session Supabase saved in localStorage. */
export const initAuthFromSupabase = createAsyncThunk("auth/init", async () => {
  const { data } = await supabase.auth.getSession();
  // if user previously logged in, data.session will exist on refresh
  return { session: data.session ?? null, user: data.session?.user ?? null };
});

/** 2) Start a Supabase listener that keeps Redux in sync. */
export function startAuthListener(dispatch: (a: any) => void) {
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    // Whenever Supabase session changes, reflect it in Redux:
    dispatch(authSlice.actions.setAuth({ session, user: session?.user ?? null }));
  });
  return () => sub.subscription.unsubscribe();
}

/* -------------------------------- Slice -------------------------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ session: Session | null; user: User | null }>) => {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.isLoading = false;
      state.error = null;
    },
    clearAuth: (state) => {
      state.session = null;
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // init
      .addCase(initAuthFromSupabase.fulfilled, (state, { payload }) => {
        state.session = payload.session;
        state.user = payload.user;
        state.isLoading = false;
      })
      .addCase(initAuthFromSupabase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initAuthFromSupabase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Init error";
      })

      // login
      .addCase(login.fulfilled, (state, { payload }) => {
        state.session = payload.session;
        state.user = payload.user;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })

      // register
      .addCase(register.fulfilled, (state, { payload }) => {
        state.session = payload.session;
        state.user = payload.user;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { setAuth, clearAuth, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
