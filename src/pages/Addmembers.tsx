// src/pages/Addmembers.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { loadCommunityById, addMemberThunk } from "../redux/slices/CommunitiesSlice";
import { supabase } from "../services/supabaseClient";
import PrimaryButton from "../components/UI/PrimaryButton";
import "./Addmembers.css";
import TertiaryButton from "../components/UI/TertiaryButton";

export default function Addmemberspage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { currentCommunity, communities, loading } = useAppSelector((s) => s.communities);
  const community = currentCommunity || communities.find((c) => c.id === id);

  useEffect(() => {
    if (id && !community) {
      dispatch(loadCommunityById(id));
    }
  }, [id, community, dispatch]);

  const [userId, setUserId] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<{ id: string; user_name: string | null; full_name: string | null ; avatar_url: string | undefined} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [usernames, setUsernames] = useState<string[]>([]);

useEffect(() => {
  const fetchUsernames = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_name");
    if (error) {
      console.error("Error fetching usernames:", error);
      return;
    } else {
      const names = data?.map((profile) => profile.user_name).filter((name): name is string => !!name) || [];
      setUsernames(names);
    }};
  fetchUsernames();
}, []);
    

  async function handleSearch() {
    if (!userId.trim()) {
      setError("Por favor ingresa un ID de usuario");
      return;
    }

    setSearching(true);
    setError(null);
    setFoundUser(null);

    try {
      // Search for user by ID in profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, user_name, full_name,avatar_url")
        .eq("user_name", userId.trim())
        .maybeSingle();

      if (profileError) {
        setError("Error al buscar usuario: " + profileError.message);
        return;
      }

      if (!profile) {
        setError("No se encontró un usuario con ese ID");
        return;
      }
      
      setFoundUser({
          id: profile.id,
          user_name: profile.user_name,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        });
        console.log(foundUser);
    } catch (err) {
      setError("Error al buscar usuario");
    } finally {
      setSearching(false);
    }
  }

  async function handleAddMember() {
    if (!foundUser || !community || !user) {
      return;
    }

    // Check if user is the creator
    if (user.id !== community.owner_id) {
      setError("Solo el creador de la comunidad puede agregar miembros");
      return;
    }

    // Check if user is already a member
    if (community.memberIds?.includes(foundUser.id)) {
      setError("Este usuario ya es miembro de la comunidad");
      return;
    }

    setAdding(true);
    setError(null);

    try {
      const result = await dispatch(addMemberThunk({ communityId: community.id, userId: foundUser.id }));
      
      if (addMemberThunk.fulfilled.match(result)) {
        // Reload community
        await dispatch(loadCommunityById(community.id));
        // Navigate back to community detail
        navigate(`/comunidades/${community.id}`);
      } else {
        setError(result.payload as string || "Error al agregar miembro");
      }
    } catch (err) {
      setError("Error al agregar miembro");
    } finally {
      setAdding(false);
    }
  }

  if (loading && !community) {
    return (
      <div className="addmembers">
        <p>Cargando comunidad...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="addmembers">
        <p>Comunidad no encontrada</p>
        <button onClick={() => navigate("/comunidades")}>Volver</button>
      </div>
    );
  }

  // Check if user is the creator
  const isCreator = user?.id === community.owner_id;
  if (!isCreator) {
    return (
      <div className="addmembers">
        <p>No tienes permiso para agregar miembros a esta comunidad</p>
        <button onClick={() => navigate(`/comunidades/${community.id}`)}>Volver</button>
      </div>
    );
  }

  return (
    <div className="addmembers">
      <div className="addmembers__container">
        

        <h1>Agregar miembro a {community.name}</h1>

        <div className="addmembers__form">
          <div className="addmembers__field">
            <label htmlFor="userId">Añade un nuevo miembro a la comunidad</label>
            <p className="addmembers__help">
              Ingresa el nombre del usurio que deseas agregar a la comunidad.
            </p>
            <div className="addmembers__search">
              <input
                id="userId"
                type="text"
                value={userId}
                list="data"
                placeholder="Busca por nombre de usuario"
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <datalist id="data">
                {
                  usernames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))                  
                }
              </datalist>

             
              <PrimaryButton onClick={handleSearch} disabled={searching}>
                {searching ? "Buscando..." : "Buscar"}
              </PrimaryButton>
            </div>
          </div>

          {error && <div className="addmembers__error">{error}</div>}

          {foundUser && (
            <div className="addmembers__foundUser">
              <div className="addmembers__userInfo">

                <div className="addmembers__userInfo">
              <img src={foundUser.avatar_url} alt="" className="addmembers_img" />
                <p> {foundUser.user_name || "Sin nombre de usuario"}</p>
                </div>
              <PrimaryButton onClick={handleAddMember} disabled={adding}>
                {adding ? "Agregando..." : "Agregar a la comunidad"}
              </PrimaryButton>
              </div>
            </div>
          )}
        <TertiaryButton onClick={() => navigate(`/comunidades/${community.id}`)} className="addmembers__back">
          Finalizar
        </TertiaryButton>
        </div>
      </div>
    </div>
  );
}
