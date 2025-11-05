// src/components/PublicEventCard/PublicEventCard.tsx
import type { EventModel } from "../../types/Event";
import "../EventCard.css";

type PublicEventCardProps = {
  event: EventModel;              // may include isOwner / isJoined
  onJoin?: (ev: EventModel) => void;
  onAbout?: (ev: EventModel) => void;
};

export default function PublicEventCard({ event, onJoin, onAbout }: PublicEventCardProps) {
  const handleJoin = () => onJoin && onJoin(event);
  const handleAbout = () => onAbout && onAbout(event);

  const showJoin = !event.isOwner && !event.isJoined;

  return (
    <div className="eventCard">
      <div className="eventCard__media">
        <img className="eventCard__img" src={event.imageUrl || "/img/default-event.jpg"} alt={event.name} />
      </div>

      <div className="eventCard__body">
        <h3 className="eventCard__title">{event.name}</h3>
        <p className="eventCard__description">{event.description || "Sin descripción"}</p>
        <p className="eventCard__meta">
          <strong>Lugar:</strong> {event.place || "—"} · <strong>Fecha:</strong> {event.date} ·{" "}
          <strong>Hora:</strong> {event.startTime}
        </p>

        <div className="eventCard__footer">
          {onAbout && (
            <button className="eventCard__cancelBtn" onClick={handleAbout} aria-label="Acerca de">
              Acerca de
            </button>
          )}

          {showJoin ? (
            <button className="eventCard__editBtn" onClick={handleJoin} aria-label="Unirse">
              Unirse
            </button>
          ) : (
            <button className="eventCard__editBtn" disabled>
              {event.isOwner ? "Tu evento" : "Ya unido"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
