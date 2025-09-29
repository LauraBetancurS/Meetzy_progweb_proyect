// src/components/SubscribedEventCard.tsx
import React from "react";
import type { EventModel } from "../../types/Event";
import "./SubscribedEventCard.css";  // 👈 nuevo css solo para este componente

export type SubscribedEventCardProps = {
  event: EventModel;
  onAbout?: (ev: EventModel) => void;
  onUnsubscribe?: (id: string) => void;
};

export const SubscribedEventCard: React.FC<SubscribedEventCardProps> = ({
  event,
  onAbout,
  onUnsubscribe,
}) => {
  return (
    <div className="subscribedCard">
      <div className="subscribedCard__media">
        <img
          className="subscribedCard__img"
          src={event.imageUrl || "/img/default-event.jpg"}
          alt={event.name}
        />
      </div>

      <div className="subscribedCard__body">
        <h3 className="subscribedCard__title">{event.name}</h3>
        <p className="subscribedCard__description">{event.description}</p>
        <p className="subscribedCard__meta">
          <strong>Date:</strong> {event.date} · <strong>Start:</strong>{" "}
          {event.startTime}
        </p>

        <div className="subscribedCard__footer">
          <button
            className="subscribedCard__aboutBtn"
            onClick={() => onAbout?.(event)}
          >
            About
          </button>
          {onUnsubscribe && (
            <button
              className="subscribedCard__leaveBtn"
              onClick={() => onUnsubscribe(event.id)}
            >
              Unsubscribe
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
