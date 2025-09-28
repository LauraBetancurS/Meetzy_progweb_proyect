import React from "react";
import { useEvents } from "../context/EventContext";
import { EventCard } from "../components/EventCard";


const EventsPage: React.FC = () => {
  const { events, updateEvent, deleteEvent } = useEvents();

  if (events.length === 0) {
    return (
      <div>
        <h1>Events</h1>
        <p>No events yet. Create one in the "Create Event" page.</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gap: 12 }}>
        <h1>Events</h1>
        {events.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            onUpdate={updateEvent}
            onDelete={deleteEvent}
          />
        ))}
      </div>
    </>
  );
};

export default EventsPage;
