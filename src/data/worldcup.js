// ── WORLD CUP 2026 — 48 TEAMS, 3 per group ─────────────────────────────────

export const FLAGS = {
  "Argentina":"🇦🇷","Francia":"🇫🇷","Brasil":"🇧🇷","Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "España":"🇪🇸","Portugal":"🇵🇹","Alemania":"🇩🇪","Países Bajos":"🇳🇱",
  "Bélgica":"🇧🇪","Uruguay":"🇺🇾","Croacia":"🇭🇷","Marruecos":"🇲🇦",
  "Japón":"🇯🇵","Senegal":"🇸🇳","México":"🇲🇽","Polonia":"🇵🇱",
  "Australia":"🇦🇺","EE.UU.":"🇺🇸","Suiza":"🇨🇭","Dinamarca":"🇩🇰",
  "Ecuador":"🇪🇨","Canadá":"🇨🇦","Arabia Saudí":"🇸🇦","Irán":"🇮🇷",
  "Corea del Sur":"🇰🇷","Serbia":"🇷🇸","Camerún":"🇨🇲","Ghana":"🇬🇭",
  "Costa Rica":"🇨🇷","Bolivia":"🇧🇴","Venezuela":"🇻🇪","Paraguay":"🇵🇾",
  "Chile":"🇨🇱","Perú":"🇵🇪","Colombia":"🇨🇴","Panamá":"🇵🇦",
  "Honduras":"🇭🇳","Jamaica":"🇯🇲","Guatemala":"🇬🇹","Cuba":"🇨🇺",
  "Qatar":"🇶🇦","Arabia Saudí":"🇸🇦","Nigeria":"🇳🇬","Costa de Marfil":"🇨🇮",
  "Egipto":"🇪🇬","Argelia":"🇩🇿","Turquía":"🇹🇷","Ucrania":"🇺🇦",
};

// Groups A-L (12 groups of 3 teams for 2026 format — 3 matches per group)
export const GROUPS = {
  A: { teams: ["EE.UU.","México","Panamá"],         matches: [["EE.UU.","Panamá"],["México","EE.UU."],["Panamá","México"]] },
  B: { teams: ["Argentina","Chile","Perú"],          matches: [["Argentina","Chile"],["Perú","Argentina"],["Chile","Perú"]] },
  C: { teams: ["España","Marruecos","Argelia"],      matches: [["España","Argelia"],["Marruecos","España"],["Argelia","Marruecos"]] },
  D: { teams: ["Brasil","Ecuador","Venezuela"],      matches: [["Brasil","Venezuela"],["Ecuador","Brasil"],["Venezuela","Ecuador"]] },
  E: { teams: ["Francia","Bélgica","Turquía"],       matches: [["Francia","Turquía"],["Bélgica","Francia"],["Turquía","Bélgica"]] },
  F: { teams: ["Alemania","Países Bajos","Serbia"],  matches: [["Alemania","Serbia"],["Países Bajos","Alemania"],["Serbia","Países Bajos"]] },
  G: { teams: ["Portugal","Polonia","Ucrania"],      matches: [["Portugal","Ucrania"],["Polonia","Portugal"],["Ucrania","Polonia"]] },
  H: { teams: ["Inglaterra","Senegal","Camerún"],    matches: [["Inglaterra","Camerún"],["Senegal","Inglaterra"],["Camerún","Senegal"]] },
  I: { teams: ["Uruguay","Colombia","Bolivia"],      matches: [["Uruguay","Bolivia"],["Colombia","Uruguay"],["Bolivia","Colombia"]] },
  J: { teams: ["Japón","Corea del Sur","Australia"], matches: [["Japón","Australia"],["Corea del Sur","Japón"],["Australia","Corea del Sur"]] },
  K: { teams: ["Croacia","Dinamarca","Suiza"],       matches: [["Croacia","Suiza"],["Dinamarca","Croacia"],["Suiza","Dinamarca"]] },
  L: { teams: ["Canadá","Arabia Saudí","Ghana"],     matches: [["Canadá","Ghana"],["Arabia Saudí","Canadá"],["Ghana","Arabia Saudí"]] },
};

export const ALL_TEAMS = [...new Set(Object.values(GROUPS).flatMap(g => g.teams))];

// Knockout stage — teams determined by group results
export const KNOCKOUT_ROUNDS = ["Octavos", "Cuartos", "Semifinal", "Final"];

// Scoring system
export const SCORING = {
  // Group stage per match:
  group_winner:    3,  // predict correct winner (or draw)
  group_exact:     5,  // predict exact scoreline
  group_scorer:    2,  // predict goalscorer of that match
  // Knockout per match:
  knockout_winner: 4,
  knockout_exact:  7,
  knockout_scorer: 3,
  // Tournament:
  champion:       15,
  finalist:        8,
  third:           5,
  top_scorer:      8,
  mvp:             6,
};

export const ADMIN_PASS = "Mundial2026!";
