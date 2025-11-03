import type { EventModel } from "../../types/Event";
import "./SubscribedEventCard.css";

type SubscribedEventCardProps = {
  event: EventModel;
  onAbout?: (ev: EventModel) => void;
  onUnsubscribe?: (id: string) => void;
};

export default function SubscribedEventCard({ event, onAbout, onUnsubscribe }: SubscribedEventCardProps) {
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
        <p className="subscribedCard__description">{event.description || "Sin descripción"}</p>
        <p className="subscribedCard__meta">
          <strong>Lugar:</strong> {event.place || "—"} ·{" "}
          <strong>Fecha:</strong> {event.date} ·{" "}
          <strong>Hora:</strong> {event.startTime}
        </p>

        <div className="subscribedCard__footer">
          {onAbout && (
            <button className="subscribedCard__aboutBtn" onClick={() => onAbout(event)}>
              Acerca de
            </button>
          )}
          {onUnsubscribe && (
            <button className="subscribedCard__leaveBtn" onClick={() => onUnsubscribe(event.id)}>
              Cancelar suscripción
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
