import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { createNewEvent } from "../redux/slices/EventsSlice";
import { EventForm } from "../components/EventForm/EventForm";
import type { NewEventInput } from "../types/Event";
import "./CreateEvent.css";

export default function CreateEventPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleCreate(data: NewEventInput) {
    try {
      const resultAction = await dispatch(createNewEvent(data));
      if (createNewEvent.fulfilled.match(resultAction)) {
        navigate("/events"); // success → go back to list
      } else {
        alert("❌ Error al crear el evento: " + (resultAction.payload || "Intenta de nuevo"));
      }
    } catch (err) {
      console.error(err);
      alert("Error inesperado al crear el evento.");
    }
  }

  return (
    <div className="createEventPage">
      <div className="createEventPage__content">
        <div className="createEvent__wrap">
          {/* Imagen de referencia */}
          <section className="createEvent__imageCard" aria-label="Vista previa">
            <div className="mockImage__frame">
              <img
                src="https://i.pinimg.com/736x/c9/06/bb/c906bbea85c5370a3ea2e056c4bae277.jpg"
                alt="Event mock preview"
              />
              <span className="mockImage__badge">imagen del evento aquí</span>
            </div>
          </section>

          {/* Formulario */}
          <section className="createEvent__formCard">
            <EventForm onCreate={handleCreate} />
          </section>
        </div>
      </div>
    </div>
  );
}
