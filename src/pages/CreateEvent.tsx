import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { createEventInDb } from "../services/supaevents";
import { useAppDispatch } from "../redux/hooks";
import { addEvent, type EventRow } from "../redux/slices/EventsSlice";
import "./CreateEvent.css";

export default function CreateEvent() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);

  // Campos del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Obtener usuario actual
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error("Error obteniendo usuario:", error);
      if (data?.user) setUserId(data.user.id);
    }
    loadUser();
  }, []);

  // Crear evento
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return setErrorMsg("El nombre es obligatorio.");
    if (!date) return setErrorMsg("La fecha es obligatoria.");
    if (!startTime) return setErrorMsg("La hora es obligatoria.");
    if (!userId)
      return setErrorMsg("No se encontró el usuario. Inicia sesión de nuevo.");

    setLoading(true);
    setErrorMsg(null);

    const newEvent = {
      name,
      description: description || null,
      place: place || null,
      date,
      start_time: startTime,
      created_by: userId,
      image_url: imageUrl || null,
    };

    const created = await createEventInDb(newEvent);

    if (!created) {
      setErrorMsg("No se pudo crear el evento. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    const eventForRedux: EventRow = {
      ...created,
      isOwner: true,
      isJoined: false,
    };

    dispatch(addEvent(eventForRedux));
    setLoading(false);
    navigate("/");
  }

  return (
    <div className="createEventPage">
      <div className="createEventPage__content">
        <div className="createEvent__wrap">
          {/* === Imagen del evento === */}
          <div className="createEvent__imageCard">
            <div className="mockImage__frame">
              {imageUrl ? (
                <img src={imageUrl} alt="Vista previa del evento" />
              ) : (
                <span>Imagen<br />aquí</span>
              )}
            </div>
          </div>

          {/* === Formulario === */}
          <div className="createEvent__formCard">
            <h1 className="createEvent__title">Crear evento</h1>

            <form className="createEvent__form" onSubmit={handleSubmit}>
              {errorMsg && <p className="createEvent__error">{errorMsg}</p>}

              <label className="createEvent__label">
                Nombre *
                <input
                  className="createEvent__input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Meetup de React"
                />
              </label>

              <label className="createEvent__label">
                Descripción
                <textarea
                  className="createEvent__textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cuéntanos de qué trata el evento..."
                />
              </label>

              <label className="createEvent__label">
                Lugar
                <input
                  className="createEvent__input"
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Cali, Medellín..."
                />
              </label>

              <div className="createEvent__dateRowTitle">Fecha y hora</div>
              <div className="createEvent__dateRow">
                <label className="createEvent__label">
                  Fecha *
                  <input
                    className="createEvent__input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>

                <label className="createEvent__label">
                  Hora *
                  <input
                    className="createEvent__input"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </label>
              </div>

              <label className="createEvent__label">
                URL de imagen
                <input
                  className="createEvent__input"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </label>

              <button
                className="createEvent__submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear evento"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
