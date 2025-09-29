// src/pages/CreateEvent.tsx
import React from "react";
import "./CreateEvent.css";
import { EventForm } from "../components/EventForm/EventForm";
import { useEvents } from "../context/EventContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/sidebar/sidebar";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";

const CreateEventPage: React.FC = () => {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  return (
    <div className="createEventPage">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content */}
      <div className="createEventPage__content" role="main">
        <div className="createEvent__wrap">
          {/* LEFT: mock image */}
          <section className="createEvent__imageCard" aria-label="Event preview">
            <div className="mockImage__frame">
              <img
                src={
                  "https://i.pinimg.com/736x/c9/06/bb/c906bbea85c5370a3ea2e056c4bae277.jpg" ||
                  FALLBACK_IMG
                }
                alt="Event mock preview"
              />
              <span className="mockImage__badge">imagen del evento aquí</span>
            </div>
          </section>

          {/* RIGHT: form */}
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
      </div>
    </div>
  );
};

export default CreateEventPage;
