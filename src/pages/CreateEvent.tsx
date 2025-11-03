import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { addEvent } from "../redux/slices/EventsSlice";
import { EventForm } from "../components/EventForm/EventForm";
import type { NewEvent } from "../types/Event";
import "./CreateEvent.css";

export default function CreateEventPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleCreate(data: NewEvent) {
    // crea y persiste en redux (el slice ya guarda en localStorage)
    dispatch(addEvent(data));
    // redirige a la lista de eventos
    navigate("/events");
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
