import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { loadAllCommunities } from "../redux/slices/CommunitiesSlice";
import PrimaryButton from "../components/UI/PrimaryButton";
import "./Comunidades.css";

export default function Comunidades() {
  const dispatch = useAppDispatch();
  const { communities, loading } = useAppSelector(
    (state) => state.communities
  );

  useEffect(() => {
    dispatch(loadAllCommunities());
  }, [dispatch]);

  return (
    <div className="comunidades">
      
      {/* Título principal */}
      <h1 className="comunidades__title">Comunidades</h1>

      {/* HERO BANNER SOLO IMAGEN + BOTÓN */}
      <section
        className="comunidades__hero"
        style={{
          backgroundImage:
            "url('https://daqupzktljfqadeqbujj.supabase.co/storage/v1/object/sign/Site%20images/comunitypublicity%20card.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZDAzZTgxYy1hMzBhLTQxYzctOGU0Ni1jOTY3ZjIwM2Q0MjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTaXRlIGltYWdlcy9jb211bml0eXB1YmxpY2l0eSBjYXJkLnBuZyIsImlhdCI6MTc2MzI0NDI2OSwiZXhwIjoxNzk0NzgwMjY5fQ.QvxtBs-JGelgsnA2vtp8-CNQNTpY1puu26FExB7mHtU')",
        }}
      >
        <Link
          to="/comunidades/crear"
          className="comunidades__hero-btnWrapper"
        >
          <PrimaryButton>Crear comunidad</PrimaryButton>
        </Link>
      </section>

      {/* ESTADOS / LISTADO */}
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
            <Link
              key={comunity.id}
              to={`/comunidades/${comunity.id}`}
              className="comunidades__card"
            >
              <div className="comunidades__card-image">
                <img src={comunity.image_url} alt={comunity.name} />
              </div>

              <div className="comunidades__card-body">
                <h2>{comunity.name}</h2>

                {comunity.description && (
                  <p className="comunidades__description">
                    {comunity.description}
                  </p>
                )}

                <div className="comunidades__meta">
                  <span>
                    {comunity.members}{" "}
                    {comunity.members === 1 ? "miembro" : "miembros"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
