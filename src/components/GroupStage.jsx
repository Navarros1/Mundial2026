import { useState } from "react";
import { GROUPS, FLAGS } from "../data/worldcup";

export default function GroupStage({ predictions, onChange }) {
  const [openGroup, setOpenGroup] = useState("A");

  return (
    <div>
      <h3 style={s.sectionTitle}>⚽ Fase de Grupos</h3>
      <p style={s.hint}>Predice el marcador y quién marcará en cada partido</p>

      {/* Group tabs */}
      <div style={s.tabs}>
        {Object.keys(GROUPS).map(g => (
          <button key={g} onClick={() => setOpenGroup(g)} style={{
            ...s.tab, background: openGroup === g ? "#2563eb" : "#f3f4f6",
            color: openGroup === g ? "#fff" : "#374151",
          }}>
            {g}
          </button>
        ))}
      </div>

      {/* Matches */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {GROUPS[openGroup].matches.map(([home, away], idx) => {
          const key = `group_${openGroup}_${idx}`;
          const pred = predictions[key] || {};
          return (
            <MatchCard
              key={key}
              home={home} away={away}
              pred={pred}
              onChange={val => onChange(key, val)}
            />
          );
        })}
      </div>
    </div>
  );
}

function MatchCard({ home, away, pred, onChange }) {
  return (
    <div style={s.card}>
      <div style={s.matchRow}>
        {/* Home */}
        <div style={s.team}>
          <span style={s.flag}>{FLAGS[home] || "🏳️"}</span>
          <span style={s.teamName}>{home}</span>
        </div>

        {/* Score */}
        <div style={s.scoreInputs}>
          <input
            type="number" min="0" max="20"
            value={pred.homeGoals ?? ""}
            onChange={e => onChange({ ...pred, homeGoals: e.target.value })}
            style={s.scoreInput}
            placeholder="0"
          />
          <span style={s.vs}>—</span>
          <input
            type="number" min="0" max="20"
            value={pred.awayGoals ?? ""}
            onChange={e => onChange({ ...pred, awayGoals: e.target.value })}
            style={s.scoreInput}
            placeholder="0"
          />
        </div>

        {/* Away */}
        <div style={{ ...s.team, flexDirection: "row-reverse" }}>
          <span style={s.flag}>{FLAGS[away] || "🏳️"}</span>
          <span style={{ ...s.teamName, textAlign: "right" }}>{away}</span>
        </div>
      </div>

      {/* Scorer */}
      <div style={s.scorerRow}>
        <span style={s.scorerLabel}>⚡ Goleador del partido</span>
        <input
          value={pred.scorer || ""}
          onChange={e => onChange({ ...pred, scorer: e.target.value })}
          placeholder="Nombre del jugador..."
          style={s.scorerInput}
        />
      </div>
    </div>
  );
}

const s = {
  sectionTitle: { fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 4 },
  hint: { fontSize: 13, color: "#6b7280", marginBottom: 16 },
  tabs: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  tab: { padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, transition: "all 0.15s" },
  card: { background: "#fff", border: "1.5px solid #f3f4f6", borderRadius: 12, padding: "14px 16px" },
  matchRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  team: { flex: 1, display: "flex", alignItems: "center", gap: 6 },
  flag: { fontSize: 20 },
  teamName: { fontSize: 13, fontWeight: 600, color: "#374151", flex: 1 },
  scoreInputs: { display: "flex", alignItems: "center", gap: 6 },
  scoreInput: { width: 44, height: 40, textAlign: "center", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 16, fontWeight: 700, color: "#111827", fontFamily: "inherit" },
  vs: { color: "#9ca3af", fontWeight: 700 },
  scorerRow: { display: "flex", alignItems: "center", gap: 10, paddingTop: 10, borderTop: "1px solid #f3f4f6" },
  scorerLabel: { fontSize: 12, color: "#6b7280", fontWeight: 600, whiteSpace: "nowrap" },
  scorerInput: { flex: 1, padding: "7px 10px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "#111827" },
};
