import { calcScore } from "../data/scoring";

export default function Leaderboard({ participants, results, currentUser }) {
  const entries = Object.values(participants).map(p => {
    const { total, breakdown } = calcScore(p.predictions, results);
    return { ...p, total, breakdown };
  }).sort((a, b) => b.total - a.total);

  const maxScore = Math.max(...entries.map(e => e.total), 1);
  const hasResults = Object.keys(results).length > 0;

  return (
    <div>
      <div style={s.header}>
        <h2 style={s.title}>Clasificación</h2>
        {!hasResults && <span style={s.pill}>Torneo sin iniciar</span>}
      </div>

      {entries.length === 0 ? (
        <Empty />
      ) : (
        <div style={s.list}>
          {entries.map((e, i) => (
            <Row key={e.name} entry={e} rank={i} maxScore={maxScore} isMe={e.name === currentUser} />
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ entry, rank, maxScore, isMe }) {
  const pct = (entry.total / maxScore) * 100;
  const medals = ["🥇","🥈","🥉"];
  const rankColors = ["#f59e0b","#9ca3af","#b45309"];

  return (
    <div style={{
      ...s.row,
      background: isMe ? "#eff6ff" : "#fff",
      border: isMe ? "1.5px solid #bfdbfe" : "1.5px solid #f3f4f6",
    }}>
      <div style={{ ...s.rank, color: rank < 3 ? rankColors[rank] : "#9ca3af" }}>
        {rank < 3 ? medals[rank] : rank + 1}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{entry.name}</span>
          {isMe && <span style={s.youTag}>tú</span>}
        </div>
        <div style={s.barTrack}>
          <div style={{ ...s.barFill, width: `${pct}%`, background: isMe ? "#2563eb" : "#d1d5db" }} />
        </div>
      </div>
      <div style={s.scoreBox}>
        <span style={{ fontSize: 22, fontWeight: 800, color: rank < 3 ? rankColors[rank] : "#111827" }}>
          {entry.total}
        </span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>pts</span>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>Aún no hay participantes</p>
      <p style={{ fontSize: 13, marginTop: 6 }}>¡Sé el primero en hacer tus predicciones!</p>
    </div>
  );
}

const s = {
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  title:  { fontSize: 20, fontWeight: 800, color: "#111827" },
  pill:   { background: "#f3f4f6", color: "#6b7280", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 },
  list:   { display: "flex", flexDirection: "column", gap: 8 },
  row:    { display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, transition: "transform 0.15s" },
  rank:   { fontSize: 18, fontWeight: 800, minWidth: 28, textAlign: "center" },
  barTrack: { height: 4, background: "#f3f4f6", borderRadius: 2, overflow: "hidden" },
  barFill:  { height: "100%", borderRadius: 2, transition: "width 1s ease" },
  scoreBox: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 },
  youTag:   { background: "#dbeafe", color: "#2563eb", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
};
