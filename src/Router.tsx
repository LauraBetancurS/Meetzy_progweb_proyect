import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Comunidades from "./pages/Comunidades"

import Perfil from "./pages/Perfil"
import CuestionarioMood from "./pages/CuestionarioMood"
import NotFound from "./pages/NotFound"
import type { ReactNode } from "react"
import { useAuth } from "./context/AuthContext"
import { Login } from "./pages/Login"
import { RegisterPage } from "./pages/Register"

// NEW: events pages
import CreateEventPage from "./pages/CreateEvent"
import EventsPage from "./pages/Events"

interface ProtectedRouteProps {
  children: ReactNode
  user: object | null
}

function ProtectedRoute({ children, user }: ProtectedRouteProps) {
  if (user) return children
  return <Navigate to={"/login"} replace />
}

export function Router() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute user={user}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="comunidades" element={<Comunidades />} />
  
        <Route path="perfil" element={<Perfil />} />
        <Route path="cuestionario-mood" element={<CuestionarioMood />} />

        {/* NEW: /events and /events/new */}
        <Route path="events">
          <Route index element={<EventsPage />} />
          <Route path="new" element={<CreateEventPage />} />
        </Route>

        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="register" element={<RegisterPage />} />
    </Routes>
  )
}
