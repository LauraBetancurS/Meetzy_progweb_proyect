import TertiaryButton from "../../UI/TertiaryButton";
import PublicEventCard from "../../PublicEventCard/PublicEventCard";
import type { EventModel } from "../../../types/Event";
import "./EventsSection.css";

export interface EventsSectionProps {
  events: EventModel[];
  onCreate?: () => void;
  className?: string;

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
  
  const handleJoin = onJoin ?? (() => {});
  const handleAbout = onAbout ?? (() => {});

  return (
    <section className={`dash-events ${className}`}>
      <div className="dash-events__head">
        <h2 className="dash-events__title">Events</h2>

        <TertiaryButton
          type="button"
          onClick={onCreate}
          className="dash-events__createBtn"
          aria-label="Create a new event"
        >
          Create event
        </TertiaryButton>
      </div>

      {events?.length ? (
        <div className="dash-events__grid">
          {events.map((ev) => (
            <PublicEventCard
              key={ev.id}
              event={ev}
              onJoin={handleJoin}
              onAbout={handleAbout}
            />
          ))}
        </div>
      ) : (
        <div className="dash-events__empty">
          <p>No public events yet.</p>
        </div>
      )}
    </section>
  );
}
