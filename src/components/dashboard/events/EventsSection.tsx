import React from "react";
import TertiaryButton from "../../UI/TertiaryButton";
import EventCard from "../../EventCard";
import "./EventsSection.css";

export interface EventsSectionProps {
  events: any[];
  onCreate?: () => void;
  // si quieres manejar edición/borrado desde arriba:
  onUpdate?: (id: string, changes: Partial<any>) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export default function EventsSection({
  events,
  onCreate,
  onUpdate,
  onDelete,
  className = "",
}: EventsSectionProps) {
  // no-ops por si no mandan handlers
  const noopUpdate = React.useCallback(() => {}, []);
  const noopDelete = React.useCallback(() => {}, []);

  return (
    <section className={`dash-events ${className}`}>
      <div className="dash-events__head">
        <h2 className="dash-events__title">Events</h2>
        <TertiaryButton onClick={onCreate} className="dash-events__createBtn">
          Create event
        </TertiaryButton>
      </div>

      <div className="dash-events__grid">
        {(events || []).filter(Boolean).map((ev: any, idx: number) => (
          <EventCard
            key={ev?.id ?? idx}
            event={ev}                         
            onUpdate={onUpdate ?? noopUpdate}  
            onDelete={onDelete ?? noopDelete}
          />
        ))}
      </div>
    </section>
  );
}
