import { Link, useNavigate } from 'react-router-dom'

export function DevNavButtons() {
  const navigate = useNavigate()
  return (
    <div className="btns">
      <button onClick={()=>navigate('/')}>Dashboard</button>
      <button onClick={()=>navigate('/comunidades')}>Comunidades</button>
      <button onClick={()=>navigate('/unirte-comunidad')}>Unirte</button>
      <button onClick={()=>navigate('/crear-comunidad')}>Crear comunidad</button>
      <button onClick={()=>navigate('/eventos')}>Eventos</button>
      <button onClick={()=>navigate('/crear-evento')}>Crear evento</button>
      <button onClick={()=>navigate('/cuestionario-mood')}>Mood</button>
      <button onClick={()=>navigate('/perfil')}>Perfil</button>
      <Link to="/404" className="btn-link">Ir al 404</Link>
    </div>
  )
}
