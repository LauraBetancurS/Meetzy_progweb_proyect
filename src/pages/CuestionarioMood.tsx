// src/pages/CuestionarioMood.tsx
import { useCallback, useEffect, useState } from "react";
import PrimaryButton from "../components/UI/PrimaryButton";
import PromoBanner from "../components/dashboard/right/PromoBanner";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { supabase } from "../services/supabaseClient";
import {
  fetchEventsFromDb,
  subscribeUserToEventInDb, // inserta en event_members
} from "../services/supaevents";
import {
  saveEvents,
  subscribeToEvent,
  type EventRow,
} from "../redux/slices/EventsSlice";
import type { EventModel } from "../types/Event";

import {
  pickRecommendedEvent,
  type EnergyChoice,
  type EnvironmentChoice,
  type PlanChoice,
} from "../utils/scoring";

import "./CuestionarioMood.css";

/* -------------------- Opciones del cuestionario (UI) -------------------- */
const ENERGY = [
  { id: "low", label: "Baja", emoji: "🥱" },
  { id: "mid", label: "Media", emoji: "⚡" },
  { id: "high", label: "Alta", emoji: "🔥" },
] as const;

const ENVIRONMENT = [
  { id: "quiet", label: "Tranquilo / poco ruido", emoji: "🤫🌿" },
  { id: "balanced", label: "Balanceado", emoji: "🟣😊" },
  { id: "loud", label: "Animado / ruidoso", emoji: "🎶🎉" },
] as const;

const PLAN = [
  { id: "calm", label: "Sentados y calmado (juegos / chill)", emoji: "🎲🛋️" },
  { id: "talk", label: "Conversar / retos suaves", emoji: "💬🤝" },
  { id: "move", label: "Moverse (karaoke, baile, deporte)", emoji: "🎤🕺" },
] as const;

type EnergyIdUI = (typeof ENERGY)[number]["id"]; // compatible con EnergyChoice
type EnvIdUI = (typeof ENVIRONMENT)[number]["id"]; // compatible con EnvironmentChoice
type PlanIdUI = (typeof PLAN)[number]["id"]; // compatible con PlanChoice

/* -------------------- Helpers -------------------- */
function isTodayOrFutureDate(d?: string | null) {
  if (!d) return false;
  const event = new Date(d);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return event.getTime() >= startOfToday.getTime();
}

function toEventModel(row: EventRow): EventModel {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    place: row.place ?? "",
    date: row.date ?? "",
    startTime: row.start_time ? row.start_time.slice(0, 5) : "",
    imageUrl: row.image_url ?? undefined,
    createdBy: row.created_by,
    createdByProfile: undefined,
    isOwner: row.isOwner ?? false,
    isJoined: row.isJoined ?? false,
  };
}

/* -------------------- Componente -------------------- */
export default function CuestionarioMood() {
  const dispatch = useAppDispatch();
  const eventRows = useAppSelector((s) => s.events.events);

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [energy, setEnergy] = useState<EnergyIdUI | null>(null);
  const [environment, setEnvironment] = useState<EnvIdUI | null>(null);
  const [plan, setPlan] = useState<PlanIdUI | null>(null);

  const [joinedOk, setJoinedOk] = useState(false);

  // 1) Cargar usuario y, si el store está vacío, traer eventos
  useEffect(() => {
    async function bootstrap() {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      setUserId(uid);

      if (!eventRows || eventRows.length === 0) {
        await refreshEvents(uid);
      }
    }
    void bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Traer eventos de Supabase y guardarlos en Redux
  const refreshEvents = useCallback(
    async (currentUserId: string | null = userId) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const rows = await fetchEventsFromDb();
        const withFlags: EventRow[] = rows.map((ev) => ({
          ...ev,
          isOwner: !!currentUserId && ev.created_by === currentUserId,
          isJoined: !!currentUserId && (ev.subscribers || []).includes(currentUserId),
        }));
        dispatch(saveEvents(withFlags));
      } catch {
        setErrorMsg("No se pudieron cargar los eventos.");
      } finally {
        setLoading(false);
      }
    },
    [dispatch, userId]
  );

  // 2) Convertir filas a EventModel y filtrar futuros (sin useMemo)
  const futureEvents: EventModel[] = (() => {
    if (!eventRows?.length) return [];
    return eventRows.map(toEventModel).filter((e) => isTodayOrFutureDate(e.date));
  })();

  // 3) Calcular recomendación simple con pickRecommendedEvent (sin useMemo)
  const recommended: EventModel | null = (() => {
    if (!energy || !environment || !plan || futureEvents.length === 0) return null;
    return pickRecommendedEvent(futureEvents, {
      energy: energy as EnergyChoice,
      environment: environment as EnvironmentChoice,
      plan: plan as PlanChoice,
    });
  })();

  // 4) Unirse al recomendado (sin validaciones extra solicitadas)
  const handleJoinRecommended = async () => {
    if (!recommended || !userId) return; // asumes rutas protegidas ⇒ userId existe
    await subscribeUserToEventInDb(recommended.id, userId);
    dispatch(subscribeToEvent({ eventId: recommended.id, userId }));
    setJoinedOk(true);
  };

  const canNext1 = energy !== null;
  const canNext2 = environment !== null;
  const canNext3 = plan !== null;

  return (
    <div className="qm-wrap">
      {/* Columna izquierda */}
      <section className="qm-left">
        <header className="qm-header">
          <h1 className="qm-title">Cuestionario 3Q</h1>
          {step === 1 && (
            <p className="qm-sub">
              Responde 3 preguntas y te recomendamos un evento que encaje con tu mood.
            </p>
          )}
        </header>

        {loading && <p className="qm-loading">Cargando eventos…</p>}
        {errorMsg && (
          <div className="qm-error">
            <p>{errorMsg}</p>
            <PrimaryButton onClick={() => refreshEvents(userId)}>Reintentar</PrimaryButton>
          </div>
        )}

        {/* Paso 1 */}
        {step === 1 && (
          <article className="qm-card">
            <h3 className="qm-question">1. ¿Con cuánta energía llegas hoy?</h3>
            <div className="qm-options">
              {ENERGY.map((opt) => (
                <OptionButton
                  key={opt.id}
                  selected={energy === opt.id}
                  onClick={() => setEnergy(opt.id)}
                  label={`${opt.emoji} ${opt.label}`}
                />
              ))}
            </div>
            <div className="qm-actions">
              <PrimaryButton disabled={!canNext1 || loading} onClick={() => setStep(2)}>
                Siguiente
              </PrimaryButton>
            </div>
          </article>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <article className="qm-card">
            <h3 className="qm-question">2. ¿Qué tipo de ambiente prefieres?</h3>
            <div className="qm-options">
              {ENVIRONMENT.map((opt) => (
                <OptionButton
                  key={opt.id}
                  selected={environment === opt.id}
                  onClick={() => setEnvironment(opt.id)}
                  label={`${opt.emoji} ${opt.label}`}
                />
              ))}
            </div>
            <div className="qm-actions qm-actions--split">
              <PrimaryButton onClick={() => setStep(1)}>Atrás</PrimaryButton>
              <PrimaryButton disabled={!canNext2 || loading} onClick={() => setStep(3)}>
                Siguiente
              </PrimaryButton>
            </div>
          </article>
        )}

        {/* Paso 3 */}
        {step === 3 && (
          <article className="qm-card">
            <h3 className="qm-question">3. ¿Qué plan te suena más ahora?</h3>
            <div className="qm-options">
              {PLAN.map((opt) => (
                <OptionButton
                  key={opt.id}
                  selected={plan === opt.id}
                  onClick={() => setPlan(opt.id)}
                  label={`${opt.emoji} ${opt.label}`}
                />
              ))}
            </div>
            <div className="qm-actions qm-actions--split">
              <PrimaryButton onClick={() => setStep(2)}>Atrás</PrimaryButton>
              <PrimaryButton disabled={!canNext3 || loading} onClick={() => setStep(4)}>
                Ver recomendación
              </PrimaryButton>
            </div>
          </article>
        )}

        {/* Paso 4: Resultado */}
        {step === 4 && (
          <article className="qm-card">
            <h3 className="qm-question">Tu recomendación</h3>

            {!recommended && <p className="qm-hint">No hubo match perfecto.</p>}
            {recommended && <RecommendedCard event={recommended} />}

            <div className="qm-actions qm-actions--split">
              <PrimaryButton onClick={() => {
                setStep(1);
                setEnergy(null);
                setEnvironment(null);
                setPlan(null);
                setJoinedOk(false);
              }}>
                Reiniciar
              </PrimaryButton>

              {joinedOk ? (
                <span>¡Te has unido al evento!</span>
              ) : (
                <PrimaryButton onClick={handleJoinRecommended} disabled={!recommended || !userId}>
                  Unirse al evento
                </PrimaryButton>
              )}
            </div>
          </article>
        )}
      </section>

      {/* Columna derecha: banner */}
      <aside className="qm-right">
        <div className="qm-promo">
          <PromoBanner
            imageUrl="https://daqupzktljfqadeqbujj.supabase.co/storage/v1/object/sign/Site%20images/Group%201000011067.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZDAzZTgxYy1hMzBhLTQxYzctOGU0Ni1jOTY3ZjIwM2Q0MjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJTaXRlIGltYWdlcy9Hcm91cCAxMDAwMDExMDY3LnBuZyIsImlhdCI6MTc2MjYyNzk4NCwiZXhwIjoxNzk0MTYzOTg0fQ.3JvxnMAXMCGBKqPl75BjzwgUxAE_Y6zRN3r05pdimEg"
            title="Meetzy"
            subtitle="Plan fast. Vibe together."
            className="promo--vertical promo--nooverlay"
          />
        </div>
      </aside>
    </div>
  );
}

/* -------------------- UI helpers -------------------- */
function OptionButton({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`qm-option ${selected ? "is-selected" : ""}`}
      aria-pressed={selected}
    >
      <span className="qm-option__label">{label}</span>
      {selected && <span className="qm-option__check">✔</span>}
    </button>
  );
}

function RecommendedCard({ event }: { event: EventModel }) {
  return (
    <article className="qm-rec">
      {event.imageUrl && (
        <img className="qm-rec__img" src={event.imageUrl} alt={event.name} />
      )}
      <h4 className="qm-rec__title">{event.name}</h4>
      {event.description && <p className="qm-rec__desc">{event.description}</p>}
      <p className="qm-rec__meta">
        📍 {event.place ?? "Por definir"} · 🗓️{" "}
        {event.date ? new Date(event.date).toLocaleDateString() : "Por confirmar"}
        {event.startTime ? ` · 🕒 ${event.startTime}` : ""}
      </p>
    </article>
  );
}
