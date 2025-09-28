// src/pages/CreateEvent.tsx
import React from "react";
import "./CreateEvent.css";
import { EventForm } from "../components/EventForm/EventForm";
import { useEvents } from "../context/EventContext";
import { useNavigate } from "react-router-dom";

const CreateEventPage: React.FC = () => {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  return (
    <div className="createEvent__wrap">
      {/* LEFT: imagen mock */}
      <section className="createEvent__imageCard">
        <div className="mockImage__frame">
          <img
            src="https://i.pinimg.com/736x/c9/06/bb/c906bbea85c5370a3ea2e056c4bae277.jpg"
            alt="Mock del evento"
          />
          <span className="mockImage__badge">imagen del evento aquí</span>
        </div>
      </section>

      {/* RIGHT: formulario */}
      <section className="createEvent__formCard">
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
  );
};

export default CreateEventPage;
