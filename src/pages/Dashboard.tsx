import SearchBar from '../components/dashboard/search/SearchBar'

export default function Dashboard() {
  function handleSearch(q: string) {
    console.log('Buscar:', q)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SearchBar onSearch={handleSearch} />
      {/* aquí luego: “Dive in! Melanie”, composer, Events, etc. */}
    </div>
  )
}