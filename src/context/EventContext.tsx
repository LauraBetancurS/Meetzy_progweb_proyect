import { createContext, useState, useContext } from "react"
import type { ReactNode } from "react"

interface EventContextType {
    events: EventsType[],
    createNewEvent: (newEvent: EventsType) => void,
    deleteEvent: (idToDelete: string) => void,
    editEvent: (editedEvent: EventsType) => void
}

interface EventsType {
    id: string,
    name: string,
    description: string,
    ubication: string,
    startDate: string,
    endDate: string
}

const EventContext = createContext<EventContextType | undefined>(undefined)

interface EventProviderProps {
    children: ReactNode
}

export function EventProvider({ children }: EventProviderProps) {
    const previousEvents = localStorage.getItem("events")
    const [events, setEvents] = useState<EventsType[]>(previousEvents ? JSON.parse(previousEvents) : [])

    const createNewEvent = (newEvent: EventsType): void => {
        const updatedEvents = [...events, newEvent]
        setEvents(updatedEvents)
        localStorage.setItem("events", JSON.stringify(updatedEvents))
    }

    const deleteEvent = (idToDelete: string): void => {
        const updatedEvents = events.filter(event =>
            event.id !== idToDelete
        )
        setEvents(updatedEvents)
        localStorage.setItem("events", JSON.stringify(updatedEvents))
    }

    const editEvent = (editedEvent: EventsType): void => {
        const updatedEvents = events.map(event =>
            event.id === editedEvent.id ? editedEvent : event
        )
        setEvents(updatedEvents)
        localStorage.setItem("events", JSON.stringify(updatedEvents))
    }

    const value: EventContextType = {
        events,
        createNewEvent,
        deleteEvent,
        editEvent
    }

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    )
}

export function useEvents() {
    const context = useContext(EventContext)

    if (context === undefined) {
        throw new Error('useEvents debe ser usado dentro de EventsProvider')
    }

    return context
}