// src/main.tsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";

// Redux hooks
import { useAppDispatch } from "./redux/hooks";

// Auth helpers
import { initAuthFromSupabase, startAuthListener } from "./redux/slices/AuthSlice";

// 👇 NEW: applies and persists --app-font-scale
import FontScaleApplier from "./components/FontScaleApplier";

/**
 * ✅ Bootstraps Supabase authentication when the app starts.
 * Loads session from localStorage, then subscribes to auth changes.
 */
function AuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1️⃣ Initialize session from Supabase (refresh token, localStorage, etc.)
    dispatch(initAuthFromSupabase());

    // 2️⃣ Start Supabase auth state listener (login, logout, refresh)
    const unsubscribe = startAuthListener(dispatch);

    // 3️⃣ Clean up listener when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  return (
    <>
      {/* Ensures the CSS var --app-font-scale is set + persisted */}
      <FontScaleApplier />
      <App />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthBootstrap />
    </Provider>
  </React.StrictMode>
);
