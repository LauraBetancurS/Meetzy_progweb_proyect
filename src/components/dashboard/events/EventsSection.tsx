import TertiaryButton from "../../UI/TertiaryButton";
import PublicEventCard from "../../PublicEventCard/PublicEventCard";
import type { EventModel } from "../../../types/Event";
import "./EventsSection.css";

export interface EventsSectionProps {
  events: EventModel[];
  onCreate?: () => void;
  className?: string;
  onJoin?: (event: EventModel) => void;
  onUnjoin?: (event: EventModel) => void;
  onAbout?: (event: EventModel) => void;
  onDelete?: (event: EventModel) => void;

  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export default function EventsSection({
  events,
  onCreate,
  className = "",
  onJoin,
  onUnjoin,
  onAbout,
  onDelete,
  loading = false,
  error,
  onRetry,
}: EventsSectionProps) {
  const handleJoin = onJoin ?? (() => {});
  const handleUnjoin = onUnjoin ?? (() => {});
  const handleAbout = onAbout ?? (() => {});
  const handleDelete = onDelete ?? (() => {});

  return (
    <section className={`dash-events ${className}`}>
      <div className="dash-events__head">
        <h2 className="dash-events__title">Eventos</h2>

        {onCreate && (
          <TertiaryButton
            type="button"
            onClick={onCreate}
            className="dash-events__createBtn"
            aria-label="Crear un nuevo evento"
          >
            Crear evento
          </TertiaryButton>
        )}
      </div>

      {loading ? (
        <div className="dash-events__state dash-events__loading">
          <p>Cargando eventos...</p>
        </div>
      ) : error ? (
        <div className="dash-events__state dash-events__error">
          <p>{error}</p>
          {onRetry && (
            <button className="dash-events__retry" onClick={onRetry}>
              Reintentar
            </button>
          )}
        </div>
      ) : events?.length ? (
        <div className="dash-events__grid">
          {events.map((ev) => (
            <PublicEventCard
              key={ev.id}
              event={ev}
              onJoin={handleJoin}
              onUnjoin={handleUnjoin}
              onAbout={handleAbout}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="dash-events__state dash-events__empty">
          <p>No hay eventos públicos aún.</p>
        </div>
      )}
    </section>
  );
}
