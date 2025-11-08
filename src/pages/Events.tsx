// // src/pages/Events.tsx
// import { useEffect, useMemo, useState, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../redux/hooks";

// import {
//   loadMyEvents,
//   loadSubscribedEvents,
//   updateExistingEvent,
//   deleteExistingEvent,
//   joinEventThunk,
//   leaveEventThunk,
// } from "../redux/slices/EventsSlice";

// import { fetchPublicEvents } from "../services/supaevents";

// import EventCard from "../components/EventCard";
// import PublicEventCard from "../components/PublicEventCard/PublicEventCard";
// import SubscribedEventCard from "../components/SubscribedEventCard/SubscribedEventCard";

// import type { EventModel, NewEventInput } from "../types/Event";
// import "./Events.css";

// export default function EventsPage() {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const { user } = useAppSelector((s) => s.auth);
//   const { events, subscribed, loading } = useAppSelector((s) => s.events);

//   // Public events (all)
//   const [publicEvents, setPublicEvents] = useState<EventModel[]>([]);
//   const [loadingPublic, setLoadingPublic] = useState<boolean>(false);
//   const [publicError, setPublicError] = useState<string | null>(null);

//   const loadPublic = useCallback(async () => {
//     setLoadingPublic(true);
//     setPublicError(null);
//     const { data, error } = await fetchPublicEvents();
//     if (error) setPublicError(error);
//     setPublicEvents(data || []);
//     setLoadingPublic(false);
//   }, []);

//   // Initial load: my events + subscriptions + public
//   useEffect(() => {
//     dispatch(loadMyEvents());
//     dispatch(loadSubscribedEvents());
//     loadPublic();
//   }, [dispatch, loadPublic]);

//   // Re-sync public list whenever my events or subscriptions change
//   useEffect(() => {
//     loadPublic();
//   }, [events.length, subscribed.length, loadPublic]);

//   // Public “available” = not subscribed and not created by me
//   const myId = user?.id ?? null;
//   const subscribedIds = useMemo(() => new Set(subscribed.map((e) => e.id)), [subscribed]);
//   const availablePublic = useMemo(
//     () =>
//       publicEvents.filter(
//         (ev) => !subscribedIds.has(ev.id) && (ev as any).createdBy !== myId
//       ),
//     [publicEvents, subscribedIds, myId]
//   );

//   // Actions
//   function handleAbout(ev: Pick<EventModel, "id" | "name">) {
//     navigate(`/events/${ev.id}`);
//   }

//   async function handleUpdateEvent(id: string, patch: Partial<NewEventInput>) {
//     await dispatch(updateExistingEvent({ id, patch }));
//     // refresh my events list
//     dispatch(loadMyEvents());
//   }

//   async function handleDeleteEvent(id: string) {
//     await dispatch(deleteExistingEvent(id));
//     // refresh lists
//     dispatch(loadMyEvents());
//     loadPublic();
//   }

//   async function handleJoin(ev: EventModel) {
//     await dispatch(joinEventThunk(ev));
//     // refresh subs + public (so it disappears from available)
//     dispatch(loadSubscribedEvents());
//     loadPublic();
//   }

//   async function handleLeave(id: string) {
//     await dispatch(leaveEventThunk(id));
//     // refresh subs + public (so it reappears)
//     dispatch(loadSubscribedEvents());
//     loadPublic();
//   }

//   return (
//     <div className="eventsPage">
//       <div className="eventsPage__content">
//         <div className="eventsPage__wrap">
//           {/* Barra superior en móvil */}
//           <div className="eventsPage__mobileBar">
//             <h1>Eventos</h1>
//             <Link to="/events/new" className="eventsPage__createBtnMobile" aria-label="Crear evento">
//               Crear evento
//             </Link>
//           </div>

//           {/* Mis eventos */}
//           <h1 className="eventsPage__title">Mis eventos</h1>
//           {loading ? (
//             <p className="eventsPage__empty">Cargando…</p>
//           ) : events.length === 0 ? (
//             <p className="eventsPage__empty">Aún no has creado eventos. Ve a “Crear evento”.</p>
//           ) : (
//             <div className="eventsGrid">
//               {events.map((ev) => (
//                 <EventCard
//                   key={ev.id}
//                   event={ev}
//                   onUpdate={handleUpdateEvent}
//                   onDelete={handleDeleteEvent}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Suscripciones */}
//           <h2 className="eventsPage__title" style={{ marginTop: 28 }}>
//             Eventos suscritos
//           </h2>
//           {subscribed.length === 0 ? (
//             <p className="eventsPage__empty">No te has unido a ningún evento.</p>
//           ) : (
//             <div className="eventsGrid">
//               {subscribed.map((ev) => (
//                 <SubscribedEventCard
//                   key={ev.id}
//                   event={ev}
//                   onAbout={handleAbout}
//                   onUnsubscribe={handleLeave}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Públicos */}
//           <h2 className="eventsPage__title" style={{ marginTop: 28 }}>
//             Eventos disponibles
//           </h2>
//           {loadingPublic ? (
//             <p className="eventsPage__empty">Cargando…</p>
//           ) : publicError ? (
//             <p className="eventsPage__empty">Error: {publicError}</p>
//           ) : availablePublic.length === 0 ? (
//             <p className="eventsPage__empty">¡Ya te uniste a todos los eventos!</p>
//           ) : (
//             <div className="eventsGrid">
//               {availablePublic.map((ev) => (
//                 <PublicEventCard
//                   key={ev.id}
//                   event={ev}
//                   onJoin={handleJoin}
//                   onAbout={handleAbout}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
