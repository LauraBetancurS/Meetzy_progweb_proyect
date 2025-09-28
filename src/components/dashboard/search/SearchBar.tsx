import React, { useState } from 'react'
import type { SearchBarProps } from '../../../types/ui'
import './SearchBar.css'

function SearchBar({ placeholder = 'Buscar ...', defaultValue = '', onSearch, className = '' }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={`sb-search ${className}`}>
      <div className="sb-search__icon">
        {/* icono simple de lupa */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="6" stroke="#fff" strokeWidth="2"/>
          <path d="M20 20l-3.5-3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <input
        className="sb-search__input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar"
      />

      {/* botón submit oculto (permite Enter) */}
      <button type="submit" className="sb-search__submit" aria-label="Buscar" />
    </form>
  )
}

export default SearchBar
