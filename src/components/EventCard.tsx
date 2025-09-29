import React, { useState } from "react";

import type { EventModel } from "../types/Event";
import "./EventCard.css"; 

export type EventCardProps = {
  event: EventModel;
  onUpdate: (id: string, changes: Partial<Omit<EventModel, "id" | "createdAtMs">>) => void;
  onDelete: (id: string) => void;
};

// Imagen por defecto (pon un archivo en public/img/default-event.jpg)
// O usa esta URL temporal:
const DEFAULT_IMG =
  "https://media.istockphoto.com/id/1330424071/es/foto/gran-grupo-de-personas-en-una-fiesta-de-concierto.jpg?s=612x612&w=0&k=20&c=D-c2OQ-qk7g7CXHDWXz_qLWLffiJYSYb6lj1hYGQxGw="; // ejemplo local: coloca una imagen en public/img/default-event.jpg
  // "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";

export const EventCard: React.FC<EventCardProps> = ({ event, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: event.name,
    description: event.description,
    place: event.place,
    date: event.date,
    startTime: event.startTime,
  });

  const save = () => {
    onUpdate(event.id, draft);
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft({
      name: event.name,
      description: event.description,
      place: event.place,
      date: event.date,
      startTime: event.startTime,
    });
    setIsEditing(false);
  };

  return (
    <div className="eventCard">
      {/* MEDIA superior (solo en vista normal) */}
      {!isEditing && (
        <div className="eventCard__media">
          <img
            className="eventCard__img"
            src={DEFAULT_IMG}
            alt={event.name}
          />
          <button
            className="eventCard__delete"
            onClick={() => onDelete(event.id)}
          >
            Delete
          </button>
        </div>
      )}

      {/* BODY */}
      <div className="eventCard__body">
        {isEditing ? (
          <div className="eventCard__editGrid">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Event name"
            />
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Description"
            />
            <input
              value={draft.place}
              onChange={(e) => setDraft({ ...draft, place: e.target.value })}
              placeholder="Place"
            />
            <div className="eventCard__row">
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
              <input
                type="time"
                value={draft.startTime}
                onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
              />
            </div>

            <div className="eventCard__footer">
              <button className="eventCard__editBtn" onClick={save}>Save</button>
              <button className="eventCard__cancelBtn" onClick={cancel}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="eventCard__title">{event.name}</h3>
            <p className="eventCard__description">
              {event.description || "No description"}
            </p>
            <p className="eventCard__meta">
              <strong>Fecha:</strong> {event.date}
            </p>

            <div className="eventCard__footer">
              <button
                className="eventCard__editBtn"
                onClick={() => setIsEditing(true)}
              >
                Edit event
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};