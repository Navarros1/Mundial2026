// ── TEAMS ──────────────────────────────────────────────────────────────────
export const TEAMS = [
  "Argentina","Francia","Brasil","Inglaterra","España","Portugal",
  "Alemania","Países Bajos","Bélgica","Uruguay","Croacia","Marruecos",
  "Japón","Senegal","México","Polonia","Australia","EE.UU.","Suiza",
  "Dinamarca","Ecuador","Qatar","Irán","Arabia Saudí","Túnez","Camerún",
  "Ghana","Serbia","Costa Rica","Corea del Sur","Canadá","Gales"
];

export const FLAGS = {
  "Argentina":"🇦🇷","Francia":"🇫🇷","Brasil":"🇧🇷","Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "España":"🇪🇸","Portugal":"🇵🇹","Alemania":"🇩🇪","Países Bajos":"🇳🇱",
  "Bélgica":"🇧🇪","Uruguay":"🇺🇾","Croacia":"🇭🇷","Marruecos":"🇲🇦",
  "Japón":"🇯🇵","Senegal":"🇸🇳","México":"🇲🇽","Polonia":"🇵🇱",
  "Australia":"🇦🇺","EE.UU.":"🇺🇸","Suiza":"🇨🇭","Dinamarca":"🇩🇰",
  "Ecuador":"🇪🇨","Qatar":"🇶🇦","Irán":"🇮🇷","Arabia Saudí":"🇸🇦",
  "Túnez":"🇹🇳","Camerún":"🇨🇲","Ghana":"🇬🇭","Serbia":"🇷🇸",
  "Costa Rica":"🇨🇷","Corea del Sur":"🇰🇷","Canadá":"🇨🇦","Gales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿",
};

// ── PREDICTION CATEGORIES ───────────────────────────────────────────────────
export const CATEGORIES = [
  {
    id: "winner",
    label: "Campeón del Mundo",
    emoji: "🏆",
    points: 15,
    type: "single", // single team pick
    description: "El equipo que levante el trofeo"
  },
  {
    id: "finalist",
    label: "Finalista",
    emoji: "🥈",
    points: 8,
    type: "single",
    description: "El equipo que llegue a la final pero no gane"
  },
  {
    id: "third",
    label: "3er Clasificado",
    emoji: "🥉",
    points: 5,
    type: "single",
    description: "El ganador del partido por el tercer puesto"
  },
  {
    id: "semi1",
    label: "Semifinalista 1",
    emoji: "⚽",
    points: 3,
    type: "single",
    description: "Un equipo que llegue a semis"
  },
  {
    id: "semi2",
    label: "Semifinalista 2",
    emoji: "⚽",
    points: 3,
    type: "single",
    description: "Otro equipo que llegue a semis"
  },
  {
    id: "topscorer",
    label: "Máximo Goleador",
    emoji: "👟",
    points: 7,
    type: "text",
    description: "El jugador que más goles marque",
    placeholder: "Ej: Mbappé, Vinicius Jr..."
  },
  {
    id: "surprise",
    label: "Sorpresa del Torneo",
    emoji: "🎉",
    points: 6,
    type: "single",
    description: "El equipo que más sorprenda (llega a cuartos sin esperarse)"
  },
  {
    id: "topgoals",
    label: "Total de Goles (Final)",
    emoji: "🎯",
    points: 4,
    type: "number",
    description: "Goles totales en el partido de la final",
    placeholder: "Ej: 3"
  },
];

// ── SCORING ─────────────────────────────────────────────────────────────────
export function calculateScore(predictions, results) {
  if (!predictions || !results) return { total: 0, breakdown: {} };
  let total = 0;
  const breakdown = {};

  CATEGORIES.forEach(cat => {
    const pred = predictions[cat.id];
    const res  = results[cat.id];
    let pts = 0;

    if (pred && res) {
      if (cat.type === "text") {
        // fuzzy match for player names
        const normalize = s => s?.toLowerCase().trim().replace(/\s+/g, " ");
        if (normalize(pred) === normalize(res)) pts = cat.points;
      } else if (cat.type === "number") {
        if (parseInt(pred) === parseInt(res)) pts = cat.points;
      } else {
        if (pred === res) pts = cat.points;
      }
    }
    breakdown[cat.id] = pts;
    total += pts;
  });

  return { total, breakdown };
}

// ── STORAGE KEY ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  PARTICIPANTS: "mundial2026:participants",
  RESULTS:      "mundial2026:results",
};

// ── ADMIN PASSWORD ──────────────────────────────────────────────────────────
export const ADMIN_PASSWORD = "admin2026";
