// src/providers/AuthProvider.tsx
import { useEffect, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { initAuthFromSupabase, startAuthListener } from "../redux/slices/AuthSlice";
import { fetchMyProfile } from "../redux/slices/ProfileSlice";

/**
 * Keeps Redux in sync with Supabase auth state and loads the user's profile.
 * Renders children immediately; routes can read auth.loading if they need.
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const profile = useAppSelector((s) => s.profile.me);

  // 1) Initialize auth and subscribe to changes once.
  useEffect(() => {
    dispatch(initAuthFromSupabase());
    const unsubscribe = startAuthListener(dispatch);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // 2) When a user exists and we don't have a profile yet, fetch it.
  useEffect(() => {
    if (user && !profile) {
      (dispatch as any)(fetchMyProfile());
    }
  }, [dispatch, user, profile]);

  return <>{children}</>;
}
