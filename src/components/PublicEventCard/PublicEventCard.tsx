import type { EventModel } from "../../types/Event";
import "../EventCard.css";

type PublicEventCardProps = {
  event: EventModel;
  onJoin?: (ev: EventModel) => void;
  onUnjoin?: (ev: EventModel) => void;
  onAbout?: (ev: EventModel) => void;
  onDelete?: (ev: EventModel) => void;
};

export default function PublicEventCard({
  event,
  onJoin,
  onUnjoin,
  onAbout,
  onDelete,
}: PublicEventCardProps) {
  const handleJoin = () => onJoin && onJoin(event);
  const handleUnjoin = () => onUnjoin && onUnjoin(event);
  const handleAbout = () => onAbout && onAbout(event);
  const handleDelete = () => onDelete && onDelete(event);

  const isOwner = !!event.isOwner;
  const isJoined = !!event.isJoined;

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
        <p className="eventCard__description">
          {event.description || "Sin descripción"}
        </p>
        <p className="eventCard__meta">
          <strong>Lugar:</strong> {event.place || "—"} · <strong>Fecha:</strong>{" "}
          {event.date} · <strong>Hora:</strong> {event.startTime}
        </p>

        <div className="eventCard__footer">
          {onAbout && (
            <button
              className="eventCard__cancelBtn"
              onClick={handleAbout}
              aria-label="Acerca de"
            >
              Acerca de
            </button>
          )}

          {isOwner && onDelete ? (
            <button
              className="eventCard__editBtn"
              onClick={handleDelete}
              aria-label="Eliminar evento"
            >
              Eliminar
            </button>
          ) : null}

          {!isOwner ? (
            isJoined ? (
              <button
                className="eventCard__editBtn"
                onClick={handleUnjoin}
                aria-label="Salir del evento"
              >
                Salir
              </button>
            ) : (
              onJoin && (
                <button
                  className="eventCard__editBtn"
                  onClick={handleJoin}
                  aria-label="Unirse"
                >
                  Unirse
                </button>
              )
            )
          ) : (
            <button className="eventCard__editBtn" disabled>
              Tu evento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
