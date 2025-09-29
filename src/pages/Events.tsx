// src/pages/Events.tsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom"; // 👈 nuevo
import { useEvents } from "../context/EventContext";
import { useSubscriptions } from "../context/SubscriptionsContext";
import { EventCard } from "../components/EventCard";
import { PublicEventCard } from "../components/PublicEventCard/PublicEventCard";
import { SubscribedEventCard } from "../components/SubscribedEventCard/SubscribedEventCard";
import { PUBLIC_EVENTS } from "../mocks/publicEvents.mock";
import "./Events.css";

export default function EventsPage() {
  const { events, updateEvent, deleteEvent } = useEvents();
  const { subscribed, join, leave } = useSubscriptions();

  const handleAbout = (ev: { name: string }) => {
    alert(`About: ${ev.name}`);
  };

  const availablePublic = useMemo(
    () => PUBLIC_EVENTS.filter((pub) => !subscribed.some((s) => s.id === pub.id)),
    [subscribed]
  );

  return (
    <div className="eventsPage">
      <div className="eventsPage__content">
        <div className="eventsPage__wrap">
          {/* === Mobile-only top bar === */}
          <div className="eventsPage__mobileBar">
            <h1>Events</h1>
            <Link to="/events/new" className="eventsPage__createBtnMobile" aria-label="Create event">
              Crear evento
            </Link>
          </div>

          {/* 1) My events */}
          <h1 className="eventsPage__title">My events</h1>
          {events.length === 0 ? (
            <p style={{ color: "#cfcfcf", margin: "0 0 16px 6px" }}>
              You haven't created events yet. Go to “Create Event”.
            </p>
          ) : (
            <div className="eventsGrid">
              {events.map((ev) => (
                <EventCard key={ev.id} event={ev} onUpdate={updateEvent} onDelete={deleteEvent} />
              ))}
            </div>
          )}

          {/* 2) Subscribed events */}
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
                <SubscribedEventCard key={ev.id} event={ev} onAbout={handleAbout} onUnsubscribe={leave} />
              ))}
            </div>
          )}

          {/* 3) Public / existing events (filtered) */}
          <h2 className="eventsPage__title" style={{ marginTop: 28 }}>
            Events
          </h2>
          {availablePublic.length === 0 ? (
            <p style={{ color: "#cfcfcf", margin: "0 0 16px 6px" }}>
              All caught up! You’ve joined every available event.
            </p>
          ) : (
            <div className="eventsGrid">
              {availablePublic.map((ev) => (
                <PublicEventCard key={ev.id} event={ev} onJoin={join} onAbout={handleAbout} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
