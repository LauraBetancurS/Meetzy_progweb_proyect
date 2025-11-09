// src/redux/slices/AuthSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../services/supabaseClient";

/* ----------------------------- Tipos ----------------------------- */

export type RegisterPayload = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean; // true hasta que hagamos el bootstrap
  error: string | null;
}

/* --------------------------- Estado inicial --------------------------- */

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  error: null,
};

/* ------------------------------- Slice ------------------------------- */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ session: Session | null; user: User | null }>
    ) => {
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
});

export const { setAuth, clearAuth, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;

/* ---------------------- Helpers / Thunks manuales ---------------------- */
/**
 * Bootstrap Redux desde la sesión persistida por Supabase (localStorage).
 * Estructura tipo eventsSlice: NO usa createAsyncThunk ni extraReducers.
 */
export const initAuthFromSupabase = () => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        return;
      }
      const session = data.session ?? null;
      dispatch(setAuth({ session, user: session?.user ?? null }));
    } catch (e: any) {
      dispatch(setError(e?.message ?? "Init error"));
      dispatch(setLoading(false));
    }
  };
};

/**
 * Inicia un listener de Supabase para mantener Redux en sync.
 * Devuelve una función para desuscribir.
 */
export function startAuthListener(dispatch: (a: any) => void) {
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    dispatch(setAuth({ session, user: session?.user ?? null }));
  });
  return () => sub.subscription.unsubscribe();
}

/**
 * Registro de usuario (signUp) + upsert en `profiles`.
 */
export const register = (payload: RegisterPayload) => {
  return async (dispatch: any) => {
    const { fullName, userName, email, password, avatarUrl } = payload;
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_name: userName,
            avatar_url: avatarUrl ?? null,
          },
        },
      });

      if (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        // upsert al perfil
        const { error: upsertErr } = await supabase
          .from("profiles")
          .upsert(
            {
              id: userId,
              full_name: fullName,
              user_name: userName,
              avatar_url: avatarUrl ?? null,
            },
            { onConflict: "id" }
          );

        if (upsertErr) {
          // No bloquea el login, pero dejamos el error visible
          dispatch(setError(upsertErr.message));
        }
      }

      // Refrescamos la sesión actual
      const { data: sessionData } = await supabase.auth.getSession();
      dispatch(
        setAuth({
          session: sessionData.session ?? null,
          user: data.user ?? null,
        })
      );
    } catch (e: any) {
      dispatch(setError(e?.message ?? "Register error"));
      dispatch(setLoading(false));
    }
  };
};

/**
 * Login con email y password.
 */
export const login = (payload: LoginPayload) => {
  return async (dispatch: any) => {
    const { email, password } = payload;
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        return;
      }

      dispatch(
        setAuth({
          session: data.session,
          user: data.user ?? null,
        })
      );
    } catch (e: any) {
      dispatch(setError(e?.message ?? "Login error"));
      dispatch(setLoading(false));
    }
  };
};

/**
 * Logout.
 */
export const logout = () => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      await supabase.auth.signOut();
      dispatch(clearAuth());
    } catch (e: any) {
      dispatch(setError(e?.message ?? "Logout error"));
      dispatch(setLoading(false));
    }
  };
};
