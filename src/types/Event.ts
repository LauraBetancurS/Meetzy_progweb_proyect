export type EventId = string;

export type EventModel = {
  id: EventId;
  name: string;
  description: string;
  place: string;
  /** Date as YYYY-MM-DD */
  date: string;
  /** Time as HH:MM (24h) */
  startTime: string;

  /** Timestamps (ms since epoch), no ISO strings */
  createdAtMs: number;
  updatedAtMs: number;
};

export type NewEvent = Omit<EventModel, "id" | "createdAtMs" | "updatedAtMs">;
