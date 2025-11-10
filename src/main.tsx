import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";

import FontScaleApplier from "./components/FontScaleApplier";
import AuthProvider from "./providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <FontScaleApplier />
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
