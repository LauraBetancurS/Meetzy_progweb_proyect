// src/context/SubscriptionsContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { EventModel } from "../types/Event";

type SubscriptionsCtx = {
  subscribed: EventModel[];
  join: (ev: EventModel) => void;
  leave: (id: string) => void;
};

const SubscriptionsContext = createContext<SubscriptionsCtx | null>(null);
const LS_KEY = "meetzy.subscribed";

export const SubscriptionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscribed, setSubscribed] = useState<EventModel[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as EventModel[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(subscribed));
  }, [subscribed]);

  const value = useMemo<SubscriptionsCtx>(() => ({
    subscribed,
    join: (ev) =>
      setSubscribed((prev) => (prev.some((e) => e.id === ev.id) ? prev : [...prev, ev])),
    leave: (id) => setSubscribed((prev) => prev.filter((e) => e.id !== id)),
  }), [subscribed]);

  return <SubscriptionsContext.Provider value={value}>{children}</SubscriptionsContext.Provider>;
};

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) throw new Error("useSubscriptions must be used within SubscriptionsProvider");
  return ctx;
};
