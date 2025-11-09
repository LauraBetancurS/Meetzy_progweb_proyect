import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { loadAllCommunities } from "../redux/slices/CommunitiesSlice";
import PrimaryButton from "../components/UI/PrimaryButton";
import "./Comunidades.css";

export default function Comunidades() {
  const dispatch = useAppDispatch();
  const { communities, loading } = useAppSelector((state) => state.communities);

  useEffect(() => {
    dispatch(loadAllCommunities());
  }, [dispatch]);

  return (
    <div className="comunidades">
      <div className="comunidades__header">
        <h1>Comunidades</h1>
        <Link to="/comunidades/crear">
          <PrimaryButton>Crear comunidad</PrimaryButton>
        </Link>
      </div>

      {loading ? (
        <div className="comunidades__empty">
          <p>Cargando comunidades...</p>
        </div>
      ) : communities.length === 0 ? (
        <div className="comunidades__empty">
          <p>No hay comunidades aún. ¡Crea una para comenzar!</p>
        </div>
      ) : (
        <div className="comunidades__grid">
          {communities.map((comunity) => (
            <Link key={comunity.id} to={`/comunidades/${comunity.id}`} className="comunidades__card">
              <img src={comunity.image_url} alt="" />
              <h2>{comunity.name}</h2>
              {comunity.description && <p className="comunidades__description">{comunity.description}</p>}
              <div className="comunidades__meta">
                <span>{comunity.members} {comunity.members === 1 ? "miembro" : "miembros"}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
