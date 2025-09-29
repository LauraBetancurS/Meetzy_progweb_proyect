import React, { useMemo, useState } from 'react'
import type { CalendarProps } from '../../../types/ui'
import './Calendar.css'

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate()
}

function buildMonthMatrix(year: number, month: number, startOnMonday: boolean) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const daysInMonth = last.getDate()

  // 0=Sun..6=Sat. Si empieza en lunes, convertimos: (0=>6, 1=>0, …)
  const dayIndex = (d: number) => (startOnMonday ? (d + 6) % 7 : d)

  const leading = dayIndex(first.getDay())
  const cells = leading + daysInMonth
  const weeks = Math.ceil(cells / 7)

  const matrix: Array<Array<Date | null>> = []
  let current = 1 - leading

  for (let w = 0; w < weeks; w++) {
    const row: Array<Date | null> = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month, current)
      if (current < 1 || current > daysInMonth) {
        row.push(null)
      } else {
        row.push(date)
      }
      current++
    }
    matrix.push(row)
  }
  return matrix
}

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export default function Calendar({
  value = null,
  onChange,
  startOnMonday = true,
  className = ''
}: CalendarProps) {
  const today = useMemo(() => new Date(), [])
  const [view, setView] = useState<Date>(value ?? today)

  const matrix = useMemo(
    () => buildMonthMatrix(view.getFullYear(), view.getMonth(), startOnMonday),
    [view, startOnMonday]
  )

  const weekLabels = startOnMonday
    ? ['m','t','w','t','f','s','s']
    : ['s','m','t','w','t','f','s']

  function prevMonth() {
    setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
  }
  function nextMonth() {
    setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
  }
  function selectDay(d: Date) {
    onChange?.(d)
  }

  return (
    <div className={`cal ${className}`}>
      <div className="cal__head">
        <button className="cal__nav" type="button" onClick={prevMonth} aria-label="Prev month">‹</button>
        <div className="cal__title">
          {monthNames[view.getMonth()]} <span className="cal__year">{view.getFullYear()}</span>
        </div>
        <button className="cal__nav" type="button" onClick={nextMonth} aria-label="Next month">›</button>
      </div>

      <div className="cal__grid cal__grid--labels">
        {weekLabels.map(l => <div key={l} className="cal__label">{l}</div>)}
      </div>

      <div className="cal__grid">
        {matrix.map((row, ri) => (
          <React.Fragment key={ri}>
            {row.map((d, ci) => {
              if (!d) return <div key={ri + '-' + ci} className="cal__cell cal__cell--empty" />
              const isToday = sameDay(d, today)
              const isSelected = value ? sameDay(d, value) : false
              return (
                <button
                  key={ri + '-' + ci}
                  type="button"
                  className={`cal__cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => selectDay(d)}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
