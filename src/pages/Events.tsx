import { Link } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import { useSubscriptions } from "../context/SubscriptionsContext";
import EventCard from "../components/EventCard"; // 👈 default import
import PublicEventCard from "../components/PublicEventCard/PublicEventCard"; // 👈 default import
import { SubscribedEventCard } from "../components/SubscribedEventCard/SubscribedEventCard";
import { PUBLIC_EVENTS } from "../mocks/publicEvents.mock";
import "./Events.css";

export default function EventsPage() {
  const { events, updateEvent, deleteEvent } = useEvents();
  const { subscribed, join, leave } = useSubscriptions();

  function handleAbout(ev: { name: string }) {
    alert(`Acerca de: ${ev.name}`);
  }

  const subscribedIds = new Set(subscribed.map((s) => s.id));
  const availablePublic = PUBLIC_EVENTS.filter((pub) => !subscribedIds.has(pub.id));

  return (
    <div className="eventsPage">
      <div className="eventsPage__content">
        <div className="eventsPage__wrap">
          <div className="eventsPage__mobileBar">
            <h1>Eventos</h1>
            <Link to="/events/new" className="eventsPage__createBtnMobile" aria-label="Crear evento">
              Crear evento
            </Link>
          </div>

          {/* Mis eventos */}
          <h1 className="eventsPage__title">Mis eventos</h1>
          {events.length === 0 ? (
            <p className="eventsPage__empty">Aún no has creado eventos. Ve a “Crear evento”.</p>
          ) : (
            <div className="eventsGrid">
              {events.map((ev) => (
                <EventCard key={ev.id} event={ev} onUpdate={updateEvent} onDelete={deleteEvent} />
              ))}
            </div>
          )}

          {/* Suscripciones */}
          <h2 className="eventsPage__title" style={{ marginTop: 28 }}>
            Eventos suscritos
          </h2>
          {subscribed.length === 0 ? (
            <p className="eventsPage__empty">No te has unido a ningún evento.</p>
          ) : (
            <div className="eventsGrid">
              {subscribed.map((ev) => (
                <SubscribedEventCard key={ev.id} event={ev} onAbout={handleAbout} onUnsubscribe={leave} />
              ))}
            </div>
          )}

          {/* Públicos */}
          <h2 className="eventsPage__title" style={{ marginTop: 28 }}>
            Eventos disponibles
          </h2>
          {availablePublic.length === 0 ? (
            <p className="eventsPage__empty">¡Ya te uniste a todos los eventos!</p>
          ) : (
            <div className="eventsGrid">
              {availablePublic.map((ev) => (
                <PublicEventCard key={ev.id} event={ev} onJoin={join} onAbout={handleAbout} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
