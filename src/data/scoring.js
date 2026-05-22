import { GROUPS, SCORING } from "../data/worldcup";

// ── Score one user's predictions against official results ──────────────────
export function calcScore(predictions, results) {
  if (!predictions || !results) return { total: 0, breakdown: {} };
  let total = 0;
  const breakdown = {};

  // Group stage matches
  Object.entries(GROUPS).forEach(([group, { matches }]) => {
    matches.forEach(([home, away], idx) => {
      const key = `group_${group}_${idx}`;
      const pred = predictions[key] || {};
      const res  = results[key]  || {};
      let pts = 0;

      if (res.homeGoals !== undefined && res.awayGoals !== undefined) {
        const resWinner = res.homeGoals > res.awayGoals ? home : res.homeGoals < res.awayGoals ? away : "draw";
        const predWinner = (pred.homeGoals !== undefined && pred.awayGoals !== undefined)
          ? (pred.homeGoals > pred.awayGoals ? home : pred.homeGoals < pred.awayGoals ? away : "draw")
          : null;

        if (predWinner && predWinner === resWinner) pts += SCORING.group_winner;
        if (pred.homeGoals !== undefined && parseInt(pred.homeGoals) === parseInt(res.homeGoals) &&
            pred.awayGoals !== undefined && parseInt(pred.awayGoals) === parseInt(res.awayGoals)) {
          pts += SCORING.group_exact - SCORING.group_winner; // bonus on top
        }
        if (pred.scorer && res.scorer &&
            pred.scorer.toLowerCase().trim() === res.scorer.toLowerCase().trim()) {
          pts += SCORING.group_scorer;
        }
      }
      breakdown[key] = pts;
      total += pts;
    });
  });

  // Knockout rounds
  ["octavos","cuartos","semi","final"].forEach(round => {
    const numMatches = round === "octavos" ? 16 : round === "cuartos" ? 8 : round === "semi" ? 4 : 2;
    for (let i = 0; i < numMatches; i++) {
      const key = `${round}_${i}`;
      const pred = predictions[key] || {};
      const res  = results[key]  || {};
      let pts = 0;

      if (res.winner) {
        if (pred.winner === res.winner) pts += SCORING.knockout_winner;
        if (pred.homeGoals !== undefined && parseInt(pred.homeGoals) === parseInt(res.homeGoals) &&
            pred.awayGoals !== undefined && parseInt(pred.awayGoals) === parseInt(res.awayGoals)) {
          pts += SCORING.knockout_exact - SCORING.knockout_winner;
        }
        if (pred.scorer && res.scorer &&
            pred.scorer.toLowerCase().trim() === res.scorer.toLowerCase().trim()) {
          pts += SCORING.knockout_scorer;
        }
      }
      breakdown[key] = pts;
      total += pts;
    }
  });

  // Tournament awards
  if (results.champion && predictions.champion === results.champion) {
    breakdown.champion = SCORING.champion; total += SCORING.champion;
  }
  if (results.finalist && predictions.finalist === results.finalist) {
    breakdown.finalist = SCORING.finalist; total += SCORING.finalist;
  }
  if (results.third && predictions.third === results.third) {
    breakdown.third = SCORING.third; total += SCORING.third;
  }
  if (results.top_scorer && predictions.top_scorer &&
      predictions.top_scorer.toLowerCase().trim() === results.top_scorer.toLowerCase().trim()) {
    breakdown.top_scorer = SCORING.top_scorer; total += SCORING.top_scorer;
  }
  if (results.mvp && predictions.mvp &&
      predictions.mvp.toLowerCase().trim() === results.mvp.toLowerCase().trim()) {
    breakdown.mvp = SCORING.mvp; total += SCORING.mvp;
  }

  return { total, breakdown };
}
