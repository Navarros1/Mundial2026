import { ALL_TEAMS, FLAGS } from "../data/worldcup";

const ROUNDS = [
  { id: "octavos", label: "Octavos de Final",  matches: 16 },
  { id: "cuartos", label: "Cuartos de Final",  matches: 8  },
  { id: "semi",    label: "Semifinales",        matches: 4  },
  { id: "final",   label: "Final & 3er Puesto", matches: 2  },
];

export default function Knockout({ predictions, onChange }) {
  return (
    <div>
      <h3 style={s.sectionTitle}>🏆 Eliminatorias</h3>
      <p style={s.hint}>Predice quién avanza, con qué resultado y quién marca</p>

      {ROUNDS.map(round => (
        <div key={round.id} style={{ marginBottom: 28 }}>
          <h4 style={s.roundTitle}>{round.label}</h4>
          <div style={s.grid}>
            {Array.from({ length: round.matches }).map((_, i) => {
              const key = `${round.id}_${i}`;
              const pred = predictions[key] || {};
              return (
                <KnockoutMatch
                  key={key}
                  matchNum={i + 1}
                  pred={pred}
                  onChange={val => onChange(key, val)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function KnockoutMatch({ matchNum, pred, onChange }) {
  return (
    <div style={s.card}>
      <div style={s.matchHeader}>Partido {matchNum}</div>

      {/* Team selects */}
      <div style={s.teamsRow}>
        <TeamSelect
          value={pred.homeTeam || ""}
          onChange={v => onChange({ ...pred, homeTeam: v })}
          placeholder="Equipo local"
        />
        <div style={s.scoreInputs}>
          <input type="number" min="0" max="20" value={pred.homeGoals ?? ""} onChange={e => onChange({ ...pred, homeGoals: e.target.value })} style={s.scoreInput} placeholder="0" />
          <span style={s.vs}>—</span>
          <input type="number" min="0" max="20" value={pred.awayGoals ?? ""} onChange={e => onChange({ ...pred, awayGoals: e.target.value })} style={s.scoreInput} placeholder="0" />
        </div>
        <TeamSelect
          value={pred.awayTeam || ""}
          onChange={v => onChange({ ...pred, awayTeam: v })}
          placeholder="Equipo visitante"
        />
      </div>

      {/* Winner */}
      <div style={s.row}>
        <span style={s.rowLabel}>🏆 Ganador</span>
        <TeamSelect
          value={pred.winner || ""}
          onChange={v => onChange({ ...pred, winner: v })}
          placeholder="¿Quién pasa?"
          small
        />
      </div>

      {/* Scorer */}
      <div style={s.row}>
        <span style={s.rowLabel}>⚡ Goleador</span>
        <input
          value={pred.scorer || ""}
          onChange={e => onChange({ ...pred, scorer: e.target.value })}
          placeholder="Nombre del jugador..."
          style={s.textInput}
        />
      </div>
    </div>
  );
}

function TeamSelect({ value, onChange, placeholder, small }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ ...s.select, fontSize: small ? 12 : 13 }}
    >
      <option value="">{placeholder}</option>
      {ALL_TEAMS.map(t => (
        <option key={t} value={t}>{FLAGS[t] || "🏳️"} {t}</option>
      ))}
    </select>
  );
}

const s = {
  sectionTitle: { fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 4 },
  hint: { fontSize: 13, color: "#6b7280", marginBottom: 20 },
  roundTitle: { fontSize: 14, fontWeight: 700, color: "#2563eb", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 },
  card: { background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 12, padding: "12px 14px" },
  matchHeader: { fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 },
  teamsRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 },
  scoreInputs: { display: "flex", alignItems: "center", gap: 4 },
  scoreInput: { width: 38, height: 36, textAlign: "center", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: "inherit" },
  vs: { color: "#9ca3af", fontWeight: 700, fontSize: 12 },
  row: { display: "flex", alignItems: "center", gap: 8, marginTop: 8, paddingTop: 8, borderTop: "1px solid #f9fafb" },
  rowLabel: { fontSize: 12, color: "#6b7280", fontWeight: 600, minWidth: 68 },
  select: { flex: 1, padding: "6px 8px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "inherit", color: "#111827", background: "#fff" },
  textInput: { flex: 1, padding: "6px 10px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#111827" },
};
