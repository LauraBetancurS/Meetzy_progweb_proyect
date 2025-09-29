import TertiaryButton from "../../UI/TertiaryButton";
import PublicEventCard from "../../PublicEventCard/PublicEventCard";
import type { EventModel } from "../../../types/Event";
import "./EventsSection.css";

export interface EventsSectionProps {
  events: EventModel[];
  onCreate: () => void;
  className?: string;

  // NUEVO: callbacks opcionales para propagar a la card
  onJoin?: (event: EventModel) => void;
  onAbout?: (event: EventModel) => void;
}

export default function EventsSection({
  events,
  onCreate,
  className = "",
  onJoin,
  onAbout,
}: EventsSectionProps) {
  // no-op por defecto para cumplir con el tipado del hijo si lo exige
  const noop = () => {};

  return (
    <section className={`dash-events ${className}`}>
      <div className="dash-events__head">
        <h2 className="dash-events__title">Events</h2>
        <TertiaryButton onClick={onCreate} className="dash-events__createBtn">
          Create event
        </TertiaryButton>
      </div>

      <div className="dash-events__grid">
        {events.map((ev) => (
          <PublicEventCard
            key={ev.id}
            event={ev}
            // si el hijo requiere onJoin / onAbout, siempre enviamos algo
            onJoin={onJoin ?? noop}
            onAbout={onAbout ?? noop}
          />
        ))}
      </div>
    </section>
  );
}
