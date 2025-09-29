import { useState } from 'react'
import Calendar from './Calendar'
import PromoBanner from './PromoBanner'
import './RightColumn.css'

export default function RightColumn() {
  const [selected, setSelected] = useState<Date | null>(null)

  return (
    <div className="right-col">
      <Calendar value={selected ?? undefined} onChange={setSelected} />

      <PromoBanner
        imageUrl="https://jzlxkxxstoryjoifaeak.supabase.co/storage/v1/object/public/PROMO%20BANNERS/Captura%20de%20pantalla%202025-09-28%20190118.png"
        title="Meetzy"
        subtitle="Plan fast. Vibe together."
        className="promo--vertical promo--nooverlay" 
      />
    </div>
  )
}