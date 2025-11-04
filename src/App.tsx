// src/App.tsx
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// Pages (públicas)
import { Login } from "./pages/Login";
import { RegisterPage } from "./pages/Register";

// Pages (privadas)
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/Events";
import CreateEventPage from "./pages/CreateEvent";
import Comunidades from "./pages/Comunidades";
import CuestionarioMood from "./pages/CuestionarioMood";
import Perfil from "./pages/Perfil";

// Auth sync + ProtectedRoute
import { useSupabaseAuthSync } from "./hooks/useSupabaseAuthSync";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  // Mantiene Redux sincronizado con Supabase (sesión)
  useSupabaseAuthSync();

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas privadas (requieren sesión) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/new" element={<CreateEventPage />} />
            <Route path="/comunidades" element={<Comunidades />} />
            <Route path="/mood" element={<CuestionarioMood />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
