import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Comunidades from './pages/Comunidades'
import UnirteComunidad from './pages/UnirteComunidad'
import CrearComunidad from './pages/CrearComunidad'
import Perfil from './pages/Perfil'
import CrearEvento from './pages/CrearEvento'
import CuestionarioMood from './pages/CuestionarioMood'
import Eventos from './pages/Eventos'
import NotFound from './pages/NotFound'
import type { ReactNode } from 'react'
import { useAuth } from './context/AuthContext'
import { Login } from './pages/Login'
import { RegisterPage } from './pages/Register'

interface ProtectedRouteProps {
    children: ReactNode
    user: object | null
}

function ProtectedRoute({ children, user }: ProtectedRouteProps) {
    if (user) {
        return children
    } else {
        return <Navigate to={"/login"} replace />
    }
}

export function Router() {

    const {user} = useAuth()

    return (
        <Routes>
            <Route element={
                <ProtectedRoute user={user}>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="comunidades" element={<Comunidades />} />
                <Route path="unirte-comunidad" element={<UnirteComunidad />} />
                <Route path="crear-comunidad" element={<CrearComunidad />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="crear-evento" element={<CrearEvento />} />
                <Route path="cuestionario-mood" element={<CuestionarioMood />} />
                <Route path="eventos" element={<Eventos />} />
                <Route path="404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
            <Route path="login" element={<Login/>} />
            <Route path="register" element={<RegisterPage/>} />
        </Routes>
    )
}