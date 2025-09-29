// src/pages/CreateEvent.tsx
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import { EventForm } from "../components/EventForm/EventForm";
import "./CreateEvent.css";



export default function CreateEventPage() {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  function handleCreate(data: Parameters<typeof addEvent>[0]) {
    const created = addEvent(data);
    navigate("/events", { state: { highlightId: created.id } });
  }

  return (
    <div className="createEventPage">
      <div className="createEventPage__content">
        <div className="createEvent__wrap">
          {/* Izquierda: imagen de referencia */}
          <section className="createEvent__imageCard" aria-label="Event preview">
            <div className="mockImage__frame">
              <img
                src="https://i.pinimg.com/736x/c9/06/bb/c906bbea85c5370a3ea2e056c4bae277.jpg"
                alt="Event mock preview"
              />
              <span className="mockImage__badge">imagen del evento aquí</span>
            </div>
          </section>

          {/* Derecha: formulario */}
          <section className="createEvent__formCard">
            <EventForm onCreate={handleCreate} />
          </section>
        </div>
      </div>
    </div>
  );
}
