// src/utils/scoring.ts
import type { EventModel } from "../types/Event";

export type EnergyId = "low" | "mid" | "high";
export type EnvId = "quiet" | "balanced" | "loud";
export type PlanId = "calm" | "talk" | "move";

// ✅ Export nombrado (lo que te faltaba)
export const WEIGHTS = {
  energy: 1,
  env: 1,
  plan: 2,     // el plan pesa doble
  near_1d: 2,  // bonus por ≤ 1 día
  near_3d: 1,  // bonus por ≤ 3 días
};

// Keywords
const KW_ENERGY: Record<EnergyId, string[]> = {
  low: [
    "chill","tranquilo","relax","relajado",
    "crochet","tejer","tejido","costura","bordado","manualidades","artesania",
    "museo","lectura","cafe","café","pelicula","cine","board","mesa",
  ],
  mid: ["charla","talk","taller","workshop","brunch","meetup","quiz","trivia"],
  high: ["karaoke","baile","dance","deporte","run","correr","futbol","party","fiesta","concierto"],
};

const KW_ENV: Record<EnvId, string[]> = {
  quiet: [
    "biblioteca","library","cafe","café","museo","parque",
    "casa","hogar","apartamento","mi casita",
  ],
  balanced: [],
  loud: ["club","bar","pub","karaoke","concierto","estadio","fiesta"],
};

const KW_PLAN: Record<PlanId, string[]> = {
  calm: [
    "chill","tranquilo","relax",
    "crochet","tejer","tejido","costura","bordado","manualidades","artesania",
    "cafe","café","museo","pelicula","cine","board","mesa",
  ],
  talk: ["charla","talk","conversar","networking","meetup","taller","workshop","debate"],
  move: ["karaoke","baile","dance","deporte","run","correr","futbol","gym"],
};

// Helpers
const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

const toDateTime = (date?: string | null, time?: string | null) => {
  if (!date) return null;
  const t = (time ?? "00:00").slice(0, 5); // HH:MM
  const d = new Date(`${date}T${t}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

const scoreFrom = (haystack: string, arr: string[]) =>
  arr.reduce((acc, k) => (haystack.includes(k) ? acc + 1 : acc), 0);

// API
export function recommendEvent(
  events: EventModel[],
  energy: EnergyId,
  env: EnvId,
  plan: PlanId,
  now = new Date()
) {
  if (!events.length) return null;

  const scored = events.map((e) => {
    const txt = normalize(`${e.name ?? ""} ${e.description ?? ""} ${e.place ?? ""}`);
    let score = 0;

    score += WEIGHTS.energy * scoreFrom(txt, KW_ENERGY[energy]);
    score += WEIGHTS.env * scoreFrom(txt, KW_ENV[env]);
    score += WEIGHTS.plan * scoreFrom(txt, KW_PLAN[plan]);

    // Bonus por cercanía futura
    const when = toDateTime(e.date, e.startTime);
    let whenTs = Number.MAX_SAFE_INTEGER;
    if (when && when >= now) {
      whenTs = when.getTime();
      const days = (whenTs - now.getTime()) / (1000 * 60 * 60 * 24);
      if (days <= 1) score += WEIGHTS.near_1d;
      else if (days <= 3) score += WEIGHTS.near_3d;
    }

    return { e, score, whenTs };
  });

  const anyMatch = scored.some((s) => s.score > 0);

  // Si hay match: mayor score; si empatan, más próximo.
  // Si no hay match: el más próximo por fecha.
  scored.sort((a, b) =>
    anyMatch ? (b.score - a.score) || (a.whenTs - b.whenTs) : (a.whenTs - b.whenTs)
  );

  return scored[0]?.e ?? null;
}
