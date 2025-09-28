import SearchBar from '../components/dashboard/search/SearchBar' // si la usas

export default function Dashboard() {
  function handleSearch(q: string) {
    console.log('Buscar:', q)
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {/* aquí el resto del contenido central */}
    </div>
  )
}
