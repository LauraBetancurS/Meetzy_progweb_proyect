// src/components/PublicEventCard.tsx
import React from "react";
import type { EventModel } from "../../types/Event";
import "../EventCard.css";

export type PublicEventCardProps = {
  event: EventModel;
  onJoin: (ev: EventModel) => void;
  onAbout?: (ev: EventModel) => void;
};

export const PublicEventCard: React.FC<PublicEventCardProps> = ({ event, onJoin, onAbout }) => {
  return (
    <div className="eventCard">
      <div className="eventCard__media">
        <img
          className="eventCard__img"
          src={event.imageUrl || "/img/default-event.jpg"}
          alt={event.name}
        />
        {/* 👇 Eliminamos el badge "Productos" */}
      </div>

      <div className="eventCard__body">
        <h3 className="eventCard__title">{event.name}</h3>
        <p className="eventCard__description">{event.description}</p>
        <p className="eventCard__meta">
          <strong>Fecha:</strong> {event.date}
        </p>

        <div className="eventCard__footer" style={{ gap: 10 }}>
          <button
            className="eventCard__cancelBtn"
            onClick={() => onAbout?.(event)}
            aria-label="About"
          >
            About
          </button>
          <button
            className="eventCard__editBtn"
            onClick={() => onJoin(event)}
            aria-label="Join"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};
