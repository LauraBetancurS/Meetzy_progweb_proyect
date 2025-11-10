// src/utils/scoring.ts
import type { EventModel } from "../types/Event";

/* ------------------------- Tipos de respuesta ------------------------- */
// (nombres claros para las opciones del cuestionario)
export type EnergyChoice = "low" | "mid" | "high";
export type EnvironmentChoice = "quiet" | "balanced" | "loud";
export type PlanChoice = "calm" | "talk" | "move";

/* --------------------------- Pesos del score -------------------------- */
// (simplificado: solo 3 pesos; sin bonus por fecha)
export const SCORING_WEIGHTS = {
  energy: 1,
  environment: 1,
  plan: 2, // el plan pesa un poco más
};

/* --------------------------- Palabras clave --------------------------- */
// (sin Record<...>; objetos simples con nombres explícitos)
const ENERGY_KEYWORDS: { low: string[]; mid: string[]; high: string[] } = {
  low: [
    "chill","tranquilo","relax","relajado",
    "crochet","tejer","tejido","costura","bordado","manualidades","artesania",
    "museo","lectura","cafe","café","pelicula","cine","board","mesa",
  ],
  mid: ["charla","talk","taller","workshop","brunch","meetup","quiz","trivia"],
  high: ["karaoke","baile","dance","deporte","run","correr","futbol","party","fiesta","concierto"],
};

const ENVIRONMENT_KEYWORDS: { quiet: string[]; balanced: string[]; loud: string[] } = {
  quiet: [
    "biblioteca","library","cafe","café","museo","parque",
    "casa","hogar","apartamento","mi casita",
  ],
  balanced: [], // puedes llenarlo cuando quieras distinguir más
  loud: ["club","bar","pub","karaoke","concierto","estadio","fiesta"],
};

const PLAN_KEYWORDS: { calm: string[]; talk: string[]; move: string[] } = {
  calm: [
    "chill","tranquilo","relax",
    "crochet","tejer","tejido","costura","bordado","manualidades","artesania",
    "cafe","café","museo","pelicula","cine","board","mesa",
  ],
  talk: ["charla","talk","conversar","networking","meetup","taller","workshop","debate"],
  move: ["karaoke","baile","dance","deporte","run","correr","futbol","gym"],
};

/* ------------------------------ Helpers ------------------------------- */
// Limpia texto: minúsculas + sin tildes (para comparar fácil)
function cleanText(s: string | undefined): string {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

// Cuenta cuántas palabras clave aparecen en el texto
function countMatches(text: string, keywords: string[]): number {
  return keywords.reduce((sum, k) => (text.includes(k) ? sum + 1 : sum), 0);
}

/* ------------------------------- API ---------------------------------- */
/**
 * pickRecommendedEvent: devuelve el evento con mayor puntaje
 * Reglas: score = (hits_energy * weight) + (hits_environment * weight) + (hits_plan * weight)
 * Sin bonus por fecha. Si empatan, queda el primero que esté en la lista.
 */
export function pickRecommendedEvent(
  events: EventModel[],
  answers: { energy: EnergyChoice; environment: EnvironmentChoice; plan: PlanChoice }
): EventModel | null {
  if (!events.length) return null;

  const { energy, environment, plan } = answers;

  const scored = events.map((ev, index) => {
    const text = cleanText(`${ev.name} ${ev.description} ${ev.place}`);

    const energyHits = countMatches(text, ENERGY_KEYWORDS[energy]);
    const envHits = countMatches(text, ENVIRONMENT_KEYWORDS[environment]);
    const planHits = countMatches(text, PLAN_KEYWORDS[plan]);

    const score =
      SCORING_WEIGHTS.energy * energyHits +
      SCORING_WEIGHTS.environment * envHits +
      SCORING_WEIGHTS.plan * planHits;

    return { ev, score, index }; // index nos permite mantener orden original en empate
  });

  scored.sort((a, b) => b.score - a.score || a.index - b.index);

  return scored[0]?.ev ?? null;
}
