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

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
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
    </Routes>
  )
}
