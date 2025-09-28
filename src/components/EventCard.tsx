import React, { useState } from "react";

import type { EventModel } from "../types/Event";

export type EventCardProps = {
  event: EventModel;
  onUpdate: (id: string, changes: Partial<Omit<EventModel, "id" | "createdAtMs">>) => void;
  onDelete: (id: string) => void;
};

export const EventCard: React.FC<EventCardProps> = ({ event, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: event.name,
    description: event.description,
    place: event.place,
    date: event.date,
    startTime: event.startTime,
  });

  const save = () => { onUpdate(event.id, draft); setIsEditing(false); };
  const cancel = () => {
    setDraft({ name: event.name, description: event.description, place: event.place, date: event.date, startTime: event.startTime });
    setIsEditing(false);
  };

  return (
    <div className="card">
      {isEditing ? (
        <div className="grid">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          <input value={draft.place} onChange={(e) => setDraft({ ...draft, place: e.target.value })} />
          <div className="row">
            <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            <input type="time" value={draft.startTime} onChange={(e) => setDraft({ ...draft, startTime: e.target.value })} />
          </div>
          <div className="actions">
            <button className="primary" onClick={save}>Save</button>
            <button onClick={cancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="grid">
          <h3>{event.name}</h3>
          <p className="muted">{event.description || "No description"}</p>
          <p><strong>Place:</strong> {event.place}</p>
          <p><strong>Date:</strong> {event.date} · <strong>Start:</strong> {event.startTime}</p>
          <p className="meta"><small>Created: {new Date(event.createdAtMs).toLocaleString()}</small></p>
          <div className="actions">
            <button className="primary" onClick={() => setIsEditing(true)}>Edit Event</button>
            <button className="danger" onClick={() => onDelete(event.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};
