import SearchBar from "../components/dashboard/search/SearchBar";
import RightColumn from "../components/dashboard/right/RightColumn";
import Composer from "../components/dashboard/composer/Composer";
import EventsSection from "../components/dashboard/events/EventsSection";
import "./Dashboard.css";

// ⬇️ usa el mock correcto de eventos públicos.
//   Si tu mock exporta "publicEvents" como named export:
  import { PUBLIC_EVENTS  } from "../mocks/publicEvents.mock";
//   Si en tu mock agregaste export default, podrías usar:
// import publicEvents from "../mocks/publicEvents.mock";

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
    console.log("Crear evento");
    // aquí podrías: navigate("/events/new")
  }

  // ⬇️ eventos a mostrar en la sección (vienen del mock público)
  const events = (PUBLIC_EVENTS as any[]) || [];

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
            Turn plans into moments. Subtitle: Set the details, vote in real time, and keep every memory in one place.
          </p>
        </div>

        <Composer onPost={handlePost} />

        {/* SECCIÓN: Events (usa PublicEventCard) */}
        <EventsSection events={events} onCreate={goCreateEvent} />
      </section>

      {/* DERECHA */}
      <aside className="dash-right">
        <RightColumn />
      </aside>
    </div>
  );
}
