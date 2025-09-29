import type { EventModel } from "../../types/Event";
import "../EventCard.css";

type PublicEventCardProps = {
  event: EventModel;
  onJoin: (ev: EventModel) => void;
  onAbout?: (ev: EventModel) => void;
};

export default function PublicEventCard({ event, onJoin, onAbout }: PublicEventCardProps) {
  return (
    <div className="eventCard">
      <div className="eventCard__media">
        <img
          className="eventCard__img"
          src={event.imageUrl || "/img/default-event.jpg"}
          alt={event.name}
        />
      </div>

      <div className="eventCard__body">
        <h3 className="eventCard__title">{event.name}</h3>
        <p className="eventCard__description">{event.description || "Sin descripción"}</p>
        <p className="eventCard__meta">
          <strong>Lugar:</strong> {event.place || "—"} ·{" "}
          <strong>Fecha:</strong> {event.date} ·{" "}
          <strong>Hora:</strong> {event.startTime}
        </p>

        <div className="eventCard__footer">
          {onAbout && (
            <button className="eventCard__cancelBtn" onClick={() => onAbout(event)} aria-label="Acerca de">
              Acerca de
            </button>
          )}
          <button className="eventCard__editBtn" onClick={() => onJoin(event)} aria-label="Unirse">
            Unirse
          </button>
        </div>
      </div>
    </div>
  );
}
