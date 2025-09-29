import SearchBar from '../components/dashboard/search/SearchBar'
import RightColumn from '../components/dashboard/right/RightColumn'
import './Dashboard.css'

export default function Dashboard() {
  function handleSearch(q: string) {
    console.log('Buscar:', q)
  }

  return (
    <div className="dash-grid">
      {/* Columna CENTRAL */}
      <section className="dash-center">
        <SearchBar onSearch={handleSearch} />

        {/* Hero / “Dive in! Melanie” (placeholder simple) */}
        <div className="dash-hero">
          <h1 className="dash-title">Dive in! <span>Melanie</span></h1>
          <p className="dash-sub">
            Turn plans into moments. Subtitle: Set the details, vote in real time, and keep every memory in one place.
          </p>
          {/* Aquí luego: selector de community, composer, etc. */}
        </div>

        {/* Aquí tus secciones “Events”, “Communities”, etc. */}
        {/* <EventsSection /> */}
      </section>

      {/* Columna DERECHA: calendario + banner */}
      <aside className="dash-right">
        <RightColumn />
      </aside>
    </div>
  )
}
