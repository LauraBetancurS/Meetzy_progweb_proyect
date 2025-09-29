import { createContext, useContext, useEffect, useState } from "react";
import type { EventModel } from "../types/Event";

type SubscriptionsContextValue = {
  subscribed: EventModel[];
  join: (ev: EventModel) => void;
  leave: (id: string) => void;
};

const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(null);
const STORAGE_KEY = "meetzy.subscribed";

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {
  // Estado inicial: cargamos de localStorage si existe, si no, []
  const [subscribed, setSubscribed] = useState<EventModel[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as EventModel[]) : [];
    } catch {
      return [];
    }
  });

  // Guardar en localStorage cada vez que cambia "subscribed"
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribed));
  }, [subscribed]);

  // Funciones para modificar la lista
  function join(ev: EventModel) {
    setSubscribed((prev) =>
      prev.some((e) => e.id === ev.id) ? prev : [...prev, ev]
    );
  }

  function leave(id: string) {
    setSubscribed((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <SubscriptionsContext.Provider value={{ subscribed, join, leave }}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) throw new Error("useSubscriptions must be used within SubscriptionsProvider");
  return ctx;
}
