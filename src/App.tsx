// src/App.tsx
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";
import type { ReactNode } from "react";

import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/Events";
import CreateEventPage from "./pages/CreateEvent";
import Comunidades from "./pages/Comunidades";
import CommunityDetail from "./pages/CommunityDetail";
import CrearComunidad from "./pages/CrearComunidad";
import CuestionarioMood from "./pages/CuestionarioMood";
import Perfil from "./pages/Perfil";
import { Login } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import EventAboutPage from "./pages/EventAbout";

/** If already logged in, redirect away from /login or /register */
function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAppSelector((s) => s.auth);
  if (isLoading) return <div>Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <RegisterPage />
            </RedirectIfAuthenticated>
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/comunidades" element={<Comunidades />} />
          <Route path="/comunidades/crear" element={<CrearComunidad />} />
          <Route path="/comunidades/:id" element={<CommunityDetail />} />
          <Route path="/mood" element={<CuestionarioMood />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/events/:id" element={<EventAboutPage />} />
          <Route path="/events/new" element={<CreateEventPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
