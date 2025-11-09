import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createNewCommunity } from "../redux/slices/CommunitiesSlice";
import type { NewCommunityInput } from "../types/Community";
import "./CrearComunidad.css";
import { fetchEventsFromDb } from "../services/supaevents";
import { saveEvents } from "../redux/slices/EventsSlice";

export default function CrearComunidad() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEventid, setSelectedEventid] = useState<string[]>([]);
  const [imageUrl, setimageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {events} = useAppSelector((state) => state.events)

  useEffect(() => {
    if (events.length > 0) {
      setSelectedEventid([events[0].id]);
    } else {
      const fetchAndSaveEvents = async () => {
        try {
          const eventsFromDb = await fetchEventsFromDb();
          if (eventsFromDb) {
            dispatch(saveEvents(eventsFromDb));
          }
        } catch (error) {
          console.error('Failed to fetch events:', error);
        }
      };
      fetchAndSaveEvents();
    }
  }, [events, dispatch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Por favor ingresa un nombre para la comunidad");
      return;
    }

    if (!user?.id) {
      alert("Debes estar autenticado para crear una comunidad");
      return;
    }

    setIsSubmitting(true);

    const input: NewCommunityInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      selectedEventIds: selectedEventid,
      imageUrl: imageUrl.trim() || undefined,
    };
    
    try {
      const result = await dispatch(createNewCommunity(input)).unwrap();
      navigate(`/comunidades/${result.id}`);
    } catch (error: any) {
      console.error('Failed to create community:', error);
      alert(error?.message || "Error al crear la comunidad. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="crearComunidad">

      <h1>Crear nueva comunidad</h1>
      <div className="crearComunidad__container">
        <div>
          <section className="createEvent__imageCard" aria-label="Vista previa">
            <div className="mockImage__frame">
              <img 
                src={
                  imageUrl && imageUrl.startsWith("https")
                    ? imageUrl
                    : "https://i.pinimg.com/736x/c9/06/bb/c906bbea85c5370a3ea2e056c4bae277.jpg"
                }
                alt="Event mock preview"
              />
              <span className="mockImage__badge">imagen de la comunidad aquí</span>
            </div>
          </section>
        </div>
        <form onSubmit={handleSubmit} className="crearComunidad__form">
          <div className="crearComunidad__field">
            <label htmlFor="name">Nombre de la comunidad *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Frontend Cali"
              required
            />
          </div>

          <div className="crearComunidad__field">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu comunidad..."
              rows={4}
            />
          </div>
          <div className="crearComunidad__field">
            <label htmlFor="imageUrl" className="crearComunidad__field">Url de la imagen de la comunidad</label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setimageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          <div className="crearComunidad__field">
            <label htmlFor="events" >Selecciona un evento</label>
            <select className="crearComunidad__field" id="events" name="events" onChange={(e) => {
              console.log(e.target.value)
              , setSelectedEventid([e.target.value])
            }}>
              {events.map((event) =>(
                <option key={event.id} value={event.id}>{event.name}</option>
              ))
              }
            </select>
          </div>

          <div>
            <button className="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear comunidad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

