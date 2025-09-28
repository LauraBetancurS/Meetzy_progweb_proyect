import React from "react";
import { useEvents } from "../context/EventContext";
import { EventCard } from "../components/EventCard";
import Sidebar from "../components/dashboard/sidebar/sidebar";
import "./Events.css";
const EventsPage: React.FC = () => {
  const { events, updateEvent, deleteEvent } = useEvents();

  return (
    <div className="eventsPage">
      <Sidebar />

      <div className="eventsPage__content">
        <div className="eventsPage__wrap">
          <h1 className="eventsPage__title">Eventos</h1>

          {events.length === 0 ? (
            <p style={{ color: "#cfcfcf", marginLeft: 6 }}>
              No hay eventos aún. Crea uno en la página “Create Event”.
            </p>
          ) : (
            <div className="eventsGrid">
              {events.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onUpdate={updateEvent}
                  onDelete={deleteEvent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;