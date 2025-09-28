import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { EventModel, EventId, NewEvent } from "../types/Event";
import { mockEvents } from "../mocks/events.mock";

const STORAGE_KEY = "events:v1";

// Actions & State
type Action =
  | { type: "add"; payload: { event: EventModel } }
  | { type: "update"; payload: { id: EventId; changes: Partial<Omit<EventModel, "id" | "createdAtMs">> } }
  | { type: "remove"; payload: { id: EventId } }
  | { type: "set"; payload: { events: EventModel[] } };

type State = { events: EventModel[] };
