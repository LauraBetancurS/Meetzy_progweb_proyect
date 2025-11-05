// src/App.tsx
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import EventsPage from "./pages/Events";
import CreateEventPage from "./pages/CreateEvent";
import Comunidades from "./pages/Comunidades";
import CuestionarioMood from "./pages/CuestionarioMood";
import Perfil from "./pages/Perfil";
import { Login } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import EventAboutPage from "./pages/EventAbout"; // 👈 NUEVO

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/new" element={<CreateEventPage />} />
          <Route path="/events/:id" element={<EventAboutPage />} /> {/* 👈 NUEVO */}
          <Route path="/comunidades" element={<Comunidades />} />
          <Route path="/mood" element={<CuestionarioMood />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}
