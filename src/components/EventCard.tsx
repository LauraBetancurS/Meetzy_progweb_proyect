import { useState } from "react";
import type { EventModel } from "../types/Event";
import "./EventCard.css";

export type EventCardProps = {
  event: EventModel;
  onUpdate: (id: string, changes: Partial<Omit<EventModel, "id" | "createdAtMs">>) => void;
  onDelete: (id: string) => void;
};

const DEFAULT_IMG =
  "https://media.istockphoto.com/id/1330424071/es/foto/gran-grupo-de-personas-en-una-fiesta-de-concierto.jpg?s=612x612&w=0&k=20&c=D-c2OQ-qk7g7CXHDWXz_qLWLffiJYSYb6lj1hYGQxGw=";

export default function EventCard({ event, onUpdate, onDelete }: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: event.name,
    description: event.description,
    place: event.place,
    date: event.date,
    startTime: event.startTime,
  });

  function save() {
    onUpdate(event.id, draft);
    setIsEditing(false);
  }

  function cancel() {
    setDraft({
      name: event.name,
      description: event.description,
      place: event.place,
      date: event.date,
      startTime: event.startTime,
    });
    setIsEditing(false);
  }

  return (
    <div className="eventCard">
      {!isEditing && (
        <div className="eventCard__media">
          <img className="eventCard__img" src={DEFAULT_IMG} alt={event.name} />
          <button className="eventCard__delete" onClick={() => onDelete(event.id)}>
            Eliminar
          </button>
        </div>
      )}

      <div className="eventCard__body">
        {isEditing ? (
          <div className="eventCard__editGrid">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Nombre del evento"
            />
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Descripción"
            />
            <input
              value={draft.place}
              onChange={(e) => setDraft({ ...draft, place: e.target.value })}
              placeholder="Lugar"
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
              <button className="eventCard__editBtn" onClick={save}>
                Guardar
              </button>
              <button className="eventCard__cancelBtn" onClick={cancel}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="eventCard__title">{event.name}</h3>
            <p className="eventCard__description">{event.description || "Sin descripción"}</p>
            <p className="eventCard__meta">
              <strong>Lugar:</strong> {event.place || "—"} ·{" "}
              <strong>Fecha:</strong> {event.date} ·{" "}
              <strong>Hora:</strong> {event.startTime}
            </p>

            <div className="eventCard__footer">
              <button className="eventCard__editBtn" onClick={() => setIsEditing(true)}>
                Editar evento
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
