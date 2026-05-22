import { ALL_TEAMS, FLAGS, SCORING } from "../data/worldcup";

export default function Awards({ predictions, onChange }) {
  const awards = [
    { id: "champion",   label: "🏆 Campeón del Mundial",  pts: SCORING.champion,   type: "team",   desc: "El equipo que levante el trofeo" },
    { id: "finalist",   label: "🥈 Finalista",             pts: SCORING.finalist,   type: "team",   desc: "El equipo que llegue a la final" },
    { id: "third",      label: "🥉 3er Clasificado",       pts: SCORING.third,      type: "team",   desc: "Ganador del partido por el bronce" },
    { id: "top_scorer", label: "👟 Máximo Goleador",       pts: SCORING.top_scorer, type: "player", desc: "El jugador con más goles del torneo" },
    { id: "mvp",        label: "⭐ MVP del Torneo",        pts: SCORING.mvp,        type: "player", desc: "El mejor jugador del torneo" },
  ];

  return (
    <div>
      <h3 style={s.sectionTitle}>⭐ Premios del Torneo</h3>
      <p style={s.hint}>Las predicciones más importantes — las que más puntos dan</p>

      <div style={s.grid}>
        {awards.map(award => (
          <div key={award.id} style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.awardLabel}>{award.label}</span>
              <span style={s.pts}>{award.pts} pts</span>
            </div>
            <p style={s.desc}>{award.desc}</p>
            {award.type === "team" ? (
              <select
                value={predictions[award.id] || ""}
                onChange={e => onChange(award.id, e.target.value)}
                style={s.select}
              >
                <option value="">Selecciona un equipo...</option>
                {ALL_TEAMS.map(t => (
                  <option key={t} value={t}>{FLAGS[t] || "🏳️"} {t}</option>
                ))}
              </select>
            ) : (
              <input
                value={predictions[award.id] || ""}
                onChange={e => onChange(award.id, e.target.value)}
                placeholder="Nombre del jugador..."
                style={s.input}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  sectionTitle: { fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 4 },
  hint: { fontSize: 13, color: "#6b7280", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 },
  card: { background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 12, padding: "14px 16px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  awardLabel: { fontSize: 14, fontWeight: 700, color: "#111827" },
  pts: { background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 20 },
  desc: { fontSize: 12, color: "#6b7280", marginBottom: 10 },
  select: { width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#111827", background: "#fff" },
  input: { width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "inherit", fontSize: 13, color: "#111827" },
};
