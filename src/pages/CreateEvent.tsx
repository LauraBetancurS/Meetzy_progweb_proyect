import React from "react";
import "./CreateEvent.css";
import { EventForm } from "../components/EventForm/EventForm";
import { useEvents } from "../context/EventContext";
import { useNavigate } from "react-router-dom";


const CreateEventPage: React.FC = () => {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  return (
    <>
      <div className="createEvent__wrap">
        {/* LEFT: mock image (static for now) */}
        <section className="createEvent__imageCard">
          <div className="mockImage__frame">
            {/* Replace src with your asset if you have one in /public */}
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop"
              alt="Mock del evento"
            />
            <span className="mockImage__badge">imagen del evento aquí</span>
          </div>
        </section>

        {/* RIGHT: styled form */}
        <section className="createEvent__formCard">
          <h1>Crear evento</h1>
          <EventForm
            onCreate={(data) => {
              const created = addEvent(data);
              navigate("/events", {
                replace: false,
                state: { highlightId: created.id },
              });
            }}
          />
        </section>
      </div>
    </>
  );
};

export default CreateEventPage;
