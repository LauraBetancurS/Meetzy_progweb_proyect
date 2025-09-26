import React, { createContext, useContext, useMemo, useState } from 'react'
import type { User, Community, Event, MoodAnswer } from '../types'

type AppState = {
  user: User | null
  communities: Community[]
  events: Event[]
  moodAnswers: MoodAnswer[]
}

type AppContextValue = AppState & {
  login: (u: User) => void
  logout: () => void
  addCommunity: (c: Community) => void
  addEvent: (e: Event) => void
  answerMood: (a: MoodAnswer) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const initialCommunities: Community[] = [
  { id: 'c1', name: 'Diseño de Interacción', description: 'UX / UI / HCI', members: 125 },
  { id: 'c2', name: 'Frontend Cali', description: 'React, TS y más', members: 312 },
]

const initialEvents: Event[] = [
  { id: 'e1', title: 'Meetup React', date: new Date().toISOString(), location: 'Auditorio A', communityId: 'c2' },
]

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>({ id: 'u1', name: 'Lau', email: 'lau@example.com' })
  const [communities, setCommunities] = useState<Community[]>(initialCommunities)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [moodAnswers, setMoodAnswers] = useState<MoodAnswer[]>([])

  const value = useMemo(() => ({
    user, communities, events, moodAnswers,
    login: (u: User) => setUser(u),
    logout: () => setUser(null),
    addCommunity: (c: Community) => setCommunities(p => [...p, c]),
    addEvent: (e: Event) => setEvents(p => [...p, e]),
    answerMood: (a: MoodAnswer) => setMoodAnswers(p => [...p, a]),
  }), [user, communities, events, moodAnswers])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}
