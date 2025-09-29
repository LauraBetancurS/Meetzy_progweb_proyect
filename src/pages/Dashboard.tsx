import SearchBar from "../components/dashboard/search/SearchBar";
import RightColumn from "../components/dashboard/right/RightColumn";
import Composer from "../components/dashboard/composer/Composer";
import EventsSection from "../components/dashboard/events/EventsSection";
import "./Dashboard.css";

// Mocks (cámbialo por tu EventContext cuando quieras)
import eventsMock from "../mocks/events.json";

export default function Dashboard() {
  function handleSearch(q: string) {
    console.log("Buscar:", q);
  }

  function handlePost({
    text,
    communityId,
  }: {
    text: string;
    communityId: string;
  }) {
    console.log("Post enviado:", { text, communityId });
  }

  function goCreateEvent() {
    // Si tienes router: navigate("/events/new");
    console.log("Crear evento");
  }

  // Handlers opcionales para las cards (edición/borrado)
  function handleUpdate(id: string, changes: Partial<any>) {
    console.log("update event", id, changes);
  }

  function handleDelete(id: string) {
    console.log("delete event", id);
  }

  // Si usas contexto: const { events } = useEventContext();
  const events = (eventsMock as any[]) || [];

  return (
    <div className="dash-grid">
      {/* CENTRO */}
      <section className="dash-center">
        <SearchBar onSearch={handleSearch} />

        <div className="dash-hero">
          <h1 className="dash-title">
            Dive in! <span>Melanie</span>
          </h1>
          <p className="dash-sub">
            Turn plans into moments. Subtitle: Set the details, vote in real time,
            and keep every memory in one place.
          </p>
        </div>

        <Composer onPost={handlePost} />

        {/* Sección Events usando EventCard correctamente */}
        <EventsSection
          events={events}
          onCreate={goCreateEvent}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </section>

      {/* DERECHA */}
      <aside className="dash-right">
        <RightColumn />
      </aside>
    </div>
  );
}
