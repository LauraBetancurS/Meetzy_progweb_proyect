// src/pages/Events.tsx
import React from "react";
import { useEvents } from "../context/EventContext";
import { useSubscriptions } from "../context/SubscriptionsContext";
import { EventCard } from "../components/EventCard";
import { PublicEventCard } from "../components/PublicEventCard/PublicEventCard";
import { SubscribedEventCard } from "../components/SubscribedEventCard/SubscribedEventCard";
import { PUBLIC_EVENTS } from "../mocks/publicEvents.mock";
import Sidebar from "../components/dashboard/sidebar/sidebar";
import "./Events.css";


const EventsPage: React.FC = () => {
  const { events, updateEvent, deleteEvent } = useEvents();
  const { subscribed, join, leave } = useSubscriptions();

  const handleAbout = (ev: { name: string }) => {
    alert(`About: ${ev.name}`);
  };

  return (
    <div className="eventsPage">
      <Sidebar />

      <div className="eventsPage__content">
        <div className="eventsPage__wrap">
          {/* SECTION 1: My events */}
          <h1 className="eventsPage__title">My events</h1>
          {events.length === 0 ? (
            <p style={{ color: "#cfcfcf", margin: "0 0 16px 6px" }}>
              You haven't created events yet. Go to “Create Event”.
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

          {/* SECTION 2: Subscribed events */}
          <h2 className="eventsPage__title" style={{ marginTop: 28 }}>
            Subscribed events
          </h2>
          {subscribed.length === 0 ? (
            <p style={{ color: "#cfcfcf", margin: "0 0 16px 6px" }}>
              You haven't joined any events yet.
            </p>
          ) : (
            <div className="eventsGrid">
              {subscribed.map((ev) => (
                <SubscribedEventCard
                  key={ev.id}
                  event={ev}
                  onAbout={handleAbout}
                  onUnsubscribe={leave} // ✅ ya no hay comentario aquí
                />
              ))}
            </div>
          )}

          {/* SECTION 3: Public / existing events */}
          <h2 className="eventsPage__title" style={{ marginTop: 28 }}>
            Events
          </h2>
          <div className="eventsGrid">
            {PUBLIC_EVENTS.map((ev) => (
              <PublicEventCard
                key={ev.id}
                event={ev}
                onJoin={join}
                onAbout={handleAbout}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;