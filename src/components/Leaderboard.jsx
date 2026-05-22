import { calculateScore, CATEGORIES } from "../data";

const MEDAL = ["🥇","🥈","🥉"];
const PODIUM_COLOR = ["#ffd700","#c0c0c0","#cd7f32"];

export default function Leaderboard({ participants, results, currentUser }) {
  const entries = Object.values(participants).map(p => {
    const { total, breakdown } = calculateScore(p.predictions, results);
    return { ...p, total, breakdown };
  });
  entries.sort((a, b) => b.total - a.total);

  const maxScore = Math.max(...entries.map(e => e.total), 1);
  const hasResults = Object.keys(results).length > 0;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.sectionTitle}>🏆 Clasificación</h2>
        {!hasResults && (
          <span style={styles.badge}>Torneo no iniciado</span>
        )}
      </div>

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={styles.list}>
          {entries.map((entry, i) => (
            <PlayerRow
              key={entry.name}
              entry={entry}
              rank={i}
              maxScore={maxScore}
              isCurrentUser={entry.name === currentUser}
              results={results}
            />
          ))}
        </div>
      )}

      {hasResults && (
        <ResultsSummary results={results} />
      )}
    </div>
  );
}

function PlayerRow({ entry, rank, maxScore, isCurrentUser, results }) {
  const pct = maxScore > 0 ? (entry.total / maxScore) * 100 : 0;
  const isTop3 = rank < 3;

  return (
    <div style={{
      ...styles.row,
      background: isCurrentUser ? "rgba(255,215,0,0.07)" : "rgba(255,255,255,0.03)",
      border: isCurrentUser ? "1px solid rgba(255,215,0,0.35)" : "1px solid rgba(255,255,255,0.07)",
      animation: `slideIn 0.4s ease ${rank * 0.07}s both`,
    }}>
      {/* Rank */}
      <div style={{ ...styles.rank, color: isTop3 ? PODIUM_COLOR[rank] : "rgba(255,255,255,0.25)" }}>
        {isTop3 ? MEDAL[rank] : `${rank + 1}`}
      </div>

      {/* Name & bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <span style={{
            color: isCurrentUser ? "#ffd700" : "#fff",
            fontWeight: "700", fontSize: "15px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {entry.name}
          </span>
          {isCurrentUser && <span style={styles.youBadge}>tú</span>}
        </div>
        {/* Progress bar */}
        <div style={styles.barTrack}>
          <div style={{ ...styles.barFill, width: `${pct}%`,
            background: isCurrentUser
              ? "linear-gradient(90deg,#ffd700,#f5a800)"
              : "linear-gradient(90deg,rgba(255,255,255,0.3),rgba(255,255,255,0.15))"
          }} />
        </div>
      </div>

      {/* Score */}
      <div style={styles.scoreBox}>
        <span style={{ fontSize: "22px", fontWeight: "900", color: isTop3 ? PODIUM_COLOR[rank] : "#fff" }}>
          {entry.total}
        </span>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>pts</span>
      </div>
    </div>
  );
}

function ResultsSummary({ results }) {
  return (
    <div style={{ marginTop: "28px" }}>
      <h3 style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
        Resultados confirmados
      </h3>
      <div style={{ display: "grid", gap: "8px" }}>
        {CATEGORIES.filter(c => results[c.id]).map(cat => (
          <div key={cat.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 14px", background: "rgba(74,222,128,0.06)",
            border: "1px solid rgba(74,222,128,0.2)", borderRadius: "10px",
          }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{cat.emoji} {cat.label}</span>
            <span style={{ color: "#4ade80", fontWeight: "700", fontSize: "14px" }}>{results[cat.id]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)" }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
      <p style={{ fontSize: "15px" }}>Aún no hay participantes.</p>
      <p style={{ fontSize: "13px", marginTop: "8px" }}>¡Sé el primero en hacer tus predicciones!</p>
    </div>
  );
}

const styles = {
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" },
  sectionTitle: { color: "#ffd700", fontSize: "18px", fontWeight: "800", letterSpacing: "-0.3px" },
  badge: { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontSize: "11px", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" },
  list: { display: "flex", flexDirection: "column", gap: "8px" },
  row: { display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "14px", transition: "transform 0.15s" },
  rank: { fontSize: "20px", fontWeight: "900", minWidth: "30px", textAlign: "center" },
  barTrack: { height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "2px", transition: "width 0.8s ease" },
  scoreBox: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1px" },
  youBadge: { background: "rgba(255,215,0,0.15)", color: "#ffd700", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", border: "1px solid rgba(255,215,0,0.3)" },
};
