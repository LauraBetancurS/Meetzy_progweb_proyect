// src/mocks/publicEvents.mock.ts
import type { EventModel } from "../types/Event";

export const PUBLIC_EVENTS: EventModel[] = [
  {
    id: "pub-1",
    name: "Go-Kart Championship",
    description: "Feel the adrenaline on the track with friends.",
    place: "Kartódromo Las Palmas",
    date: "2025-10-15",
    startTime: "16:00",
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    imageUrl:
      "https://i.pinimg.com/1200x/46/94/ae/4694aeb28b22fd387f5f0105097bd8df.jpg",
  },
  {
    id: "pub-2",
    name: "Summer Rooftop Party",
    description: "DJ sets, cocktails and good vibes until dawn.",
    place: "Sky Bar 360",
    date: "2025-10-28",
    startTime: "20:00",
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    imageUrl:
      "https://i.pinimg.com/1200x/c2/3f/2a/c23f2a5ee771d4d8b977e9cef6e36764.jpg",
  },
  {
    id: "pub-3",
    name: "Crochet & Chill",
    description: "Learn crochet basics and create your first piece.",
    place: "Creative Hub Cali",
    date: "2025-11-05",
    startTime: "10:00",
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    imageUrl:
      "https://i.pinimg.com/1200x/54/13/3c/54133c8275b3da1c5a2369ea591f9871.jpg",
  },
  {
    id: "pub-4",
    name: "Indie Rock Concert",
    description: "Live music with emerging local bands.",
    place: "Teatro Metropolitano",
    date: "2025-11-12",
    startTime: "19:30",
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    imageUrl:
      "https://i.pinimg.com/1200x/ba/59/4d/ba594d27552475220f4a3edd2ce99aa0.jpg",
  },
  {
    id: "pub-5",
    name: "Food Truck Festival",
    description: "Street food, desserts and drinks from around the world.",
    place: "Parque de la Música",
    date: "2025-11-18",
    startTime: "12:00",
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    imageUrl:
      "https://i.pinimg.com/736x/34/09/47/3409473854b71f3fd72e519e704534bb.jpg",
  },
];
