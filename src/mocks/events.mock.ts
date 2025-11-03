import type { EventModel } from "../types/Event";

export const mockEvents: EventModel[] = [
  {
    id: "evt-1",
    name: "UX Meetup Cali",
    description: "Monthly UX talks and networking.",
    place: "Auditorio Icesi A",
    date: "2025-10-05",
    startTime: "18:30",
    
  },
  {
    id: "evt-2",
    name: "Design Systems Workshop",
    description: "Hands-on tokens, components, and docs.",
    place: "Sala DMI 203",
    date: "2025-10-12",
    startTime: "09:00",
  },
];

export default mockEvents;
