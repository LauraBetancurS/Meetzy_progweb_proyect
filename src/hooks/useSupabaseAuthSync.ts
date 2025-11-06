import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../services/supabaseClient";
import { setSession, startLoading } from "../redux/slices/AuthSlice";

export function useSupabaseAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoading());

    // 1) Cargar sesión inicial
    supabase.auth.getSession().then(({ data }) => {
      dispatch(setSession(data.session));
    });

    // 2) Suscribirse a cambios de auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });

    // 3) Cleanup
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);
}
