import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  updateEvent as updateEventAction,
  deleteEvent as deleteEventAction,
} from "../redux/slices/EventsSlice";
import {
  join as joinSubscription,
  leave as leaveSubscription,
} from "../redux/slices/SubscriptionsSlice";

import EventCard from "../components/EventCard";
import PublicEventCard from "../components/PublicEventCard/PublicEventCard";
import SubscribedEventCard from "../components/SubscribedEventCard/SubscribedEventCard";
import { PUBLIC_EVENTS } from "../mocks/publicEvents.mock";
import "./Events.css";

export default function EventsPage() {
  const dispatch = useAppDispatch();

  // eventos creados por el usuario (vienen del slice de eventos)
  const events = useAppSelector((state) => state.events.events);

  // eventos a los que estoy suscrito (vienen del slice de suscripciones)
  const subscribed = useAppSelector((state) => state.subscriptions.subscribed);

  function handleAbout(ev: { name: string }) {
    alert(`Acerca de: ${ev.name}`);
  }

  // handlers que antes venían directo del contexto
  function handleUpdateEvent(id: string, changes: Partial<(typeof events)[number]>) {
    dispatch(updateEventAction({ id, changes }));
  }

  function handleDeleteEvent(id: string) {
    dispatch(deleteEventAction(id));
  }

  function handleJoin(ev: (typeof PUBLIC_EVENTS)[number]) {
    // nuestro slice de subscriptions espera un EventModel;
    // PUBLIC_EVENTS debería tener misma forma, si no, aquí se haría el mapeo
    dispatch(joinSubscription(ev));
  }

  function handleLeave(id: string) {
    dispatch(leaveSubscription(id));
  }

  // para filtrar los públicos que NO tengo en mis suscritos
  const subscribedIds = new Set(subscribed.map((s) => s.id));
  const availablePublic = PUBLIC_EVENTS.filter((pub) => !subscribedIds.has(pub.id));

  return (
    <div className="eventsPage">
      <div className="eventsPage__content">
        <div className="eventsPage__wrap">
          {/* Barra superior en móvil */}
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
                <EventCard
                  key={ev.id}
                  event={ev}
                  onUpdate={handleUpdateEvent}
                  onDelete={handleDeleteEvent}
                />
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
                <SubscribedEventCard
                    key={ev.id}
                    event={ev}
                    onAbout={handleAbout}
                    onUnsubscribe={handleLeave}
                />
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
                <PublicEventCard
                  key={ev.id}
                  event={ev}
                  onJoin={handleJoin}
                  onAbout={handleAbout}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
