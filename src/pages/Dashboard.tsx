import SearchBar from "../components/dashboard/search/SearchBar";
import RightColumn from "../components/dashboard/right/RightColumn";
import Composer from "../components/dashboard/composer/Composer";
import EventsSection from "../components/dashboard/events/EventsSection";
import "./Dashboard.css";

// Auth
import { useAuth } from "../context/AuthContext";

// Router
import { useNavigate } from "react-router-dom";

// Mock de eventos públicos
import { PUBLIC_EVENTS } from "../mocks/publicEvents.mock";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const rawName =
    (user as any)?.name ||
    (user as any)?.username ||
    ((user as any)?.email ? String((user as any).email).split("@")[0] : "") ||
    "Friend";

  const firstName = String(rawName).trim().split(" ")[0];

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

  // Redirección al crear evento
  function goCreateEvent() {
    navigate("/events/new");
  }

  const events = (PUBLIC_EVENTS as any[]) || [];

  return (
    <div className="dash-grid">
      <section className="dash-center">
        <SearchBar onSearch={handleSearch} />

        <div className="dash-hero">
          <h1 className="dash-title">
            Dive in! <span>{firstName}</span>
          </h1>
          <p className="dash-sub">
            Turn plans into moments. Subtitle: Set the details, vote in real time, and keep every memory in one place.
          </p>
        </div>

        <Composer onPost={handlePost} />

        {/* SECCIÓN: Events (usa PublicEventCard) */}
        <EventsSection events={events} onCreate={goCreateEvent} />
      </section>

      <aside className="dash-right">
        <RightColumn />
      </aside>
    </div>
  );
}
