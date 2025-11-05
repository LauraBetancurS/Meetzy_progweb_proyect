// src/main.tsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";

// ✅ use the typed dispatch hook
import { useAppDispatch } from "./redux/hooks";

// your thunks/helpers
import { initAuthFromSupabase, startAuthListener } from "./redux/slices/AuthSlice";

function AuthBootstrap() {
  const dispatch = useAppDispatch(); // <-- typed to AppDispatch

  useEffect(() => {
    dispatch(initAuthFromSupabase());        // no TS error now ✅
    const unsubscribe = startAuthListener(dispatch);
    return () => unsubscribe?.();
  }, [dispatch]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthBootstrap />
    </Provider>
  </React.StrictMode>
);
