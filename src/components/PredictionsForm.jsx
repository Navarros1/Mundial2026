import { useState } from "react";
import { CATEGORIES, TEAMS, FLAGS } from "../data";

export default function PredictionsForm({ user, existing, onSave, locked }) {
  const [form, setForm]     = useState(existing || {});
  const [saved, setSaved]   = useState(false);
  const [errors, setErrors] = useState({});

  function set(id, val) {
    setForm(f => ({ ...f, [id]: val }));
    setErrors(e => ({ ...e, [id]: false }));
  }

  function handleSave() {
    // Validate all categories filled
    const newErrors = {};
    CATEGORIES.forEach(cat => {
      if (!form[cat.id] || String(form[cat.id]).trim() === "") {
        newErrors[cat.id] = true;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (locked) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
        <h3 style={{ color: "#ffd700", fontSize: "18px", marginBottom: "8px" }}>Predicciones cerradas</h3>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>El plazo para hacer predicciones ha terminado.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <h2 style={{ color: "#ffd700", fontSize: "18px", fontWeight: "800" }}>⚽ Tus Predicciones</h2>
        {existing && <span style={styles.editBadge}>✏️ Editando</span>}
      </div>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "24px" }}>
        Elige bien — solo puedes enviar una vez. Cuando el torneo comience, se bloquean.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {CATEGORIES.map((cat, i) => (
          <CategoryInput
            key={cat.id}
            cat={cat}
            value={form[cat.id] || ""}
            onChange={val => set(cat.id, val)}
            error={errors[cat.id]}
            index={i}
          />
        ))}
      </div>

      {/* Summary */}
      <div style={styles.summary}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Puntos máximos posibles:</span>
        <span style={{ color: "#ffd700", fontWeight: "800", fontSize: "18px" }}>
          {CATEGORIES.reduce((acc, c) => acc + c.points, 0)} pts
        </span>
      </div>

      <button onClick={handleSave} style={{
        ...styles.saveBtn,
        background: saved ? "linear-gradient(135deg,#4ade80,#22c55e)" : "linear-gradient(135deg,#ffd700,#f5a800)",
      }}
        onMouseEnter={e => !saved && (e.target.style.transform = "translateY(-2px)")}
        onMouseLeave={e => !saved && (e.target.style.transform = "none")}
      >
        {saved ? "✅ ¡Guardadas!" : "GUARDAR PREDICCIONES"}
      </button>

      {Object.keys(errors).length > 0 && (
        <p style={{ color: "#ff6b6b", fontSize: "13px", textAlign: "center", marginTop: "12px" }}>
          ⚠️ Completa todas las predicciones antes de guardar
        </p>
      )}
    </div>
  );
}

function CategoryInput({ cat, value, onChange, error, index }) {
  return (
    <div style={{
      padding: "16px 18px",
      background: error ? "rgba(255,107,107,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${error ? "rgba(255,107,107,0.4)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: "14px",
      animation: `slideIn 0.4s ease ${index * 0.05}s both`,
      transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ fontSize: "18px" }}>{cat.emoji}</span>
        <div>
          <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>{cat.label}</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>{cat.description}</div>
        </div>
        <span style={styles.pts}>{cat.points} pts</span>
      </div>

      {cat.type === "single" ? (
        <TeamSelect value={value} onChange={onChange} error={error} />
      ) : cat.type === "text" ? (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={cat.placeholder}
          style={{ ...styles.textInput, borderColor: error ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.12)" }}
          onFocus={e => e.target.style.borderColor = "rgba(255,215,0,0.6)"}
          onBlur={e  => e.target.style.borderColor = error ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.12)"}
        />
      ) : (
        <input
          type="number" min="0" max="20"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={cat.placeholder}
          style={{ ...styles.textInput, width: "120px", borderColor: error ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.12)" }}
          onFocus={e => e.target.style.borderColor = "rgba(255,215,0,0.6)"}
          onBlur={e  => e.target.style.borderColor = error ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.12)"}
        />
      )}
    </div>
  );
}

function TeamSelect({ value, onChange, error }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {TEAMS.map(team => (
        <button
          key={team}
          onClick={() => onChange(team)}
          style={{
            padding: "6px 12px", borderRadius: "8px", cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: "600",
            transition: "all 0.15s",
            background: value === team ? "rgba(255,215,0,0.2)"  : "rgba(255,255,255,0.05)",
            border:     value === team ? "1px solid rgba(255,215,0,0.7)" : "1px solid rgba(255,255,255,0.1)",
            color:      value === team ? "#ffd700" : "rgba(255,255,255,0.7)",
          }}
        >
          {FLAGS[team] || "🏳️"} {team}
        </button>
      ))}
    </div>
  );
}

const styles = {
  editBadge: { background:"rgba(255,215,0,0.1)", color:"#ffd700", fontSize:"12px", padding:"4px 10px", borderRadius:"20px", border:"1px solid rgba(255,215,0,0.3)" },
  pts: { marginLeft:"auto", background:"rgba(255,215,0,0.12)", color:"#ffd700", fontWeight:"800", fontSize:"13px", padding:"4px 10px", borderRadius:"8px", border:"1px solid rgba(255,215,0,0.25)", whiteSpace:"nowrap" },
  textInput: { width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", color:"#fff", fontSize:"14px", outline:"none", fontFamily:"'Outfit',sans-serif", transition:"border-color 0.2s" },
  summary: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px", background:"rgba(255,215,0,0.05)", border:"1px solid rgba(255,215,0,0.15)", borderRadius:"12px", margin:"24px 0 16px" },
  saveBtn: { width:"100%", padding:"16px", border:"none", borderRadius:"14px", color:"#060612", fontSize:"16px", fontWeight:"800", cursor:"pointer", fontFamily:"'Outfit',sans-serif", letterSpacing:"0.5px", transition:"transform 0.15s, background 0.3s", boxShadow:"0 8px 32px rgba(255,215,0,0.2)" },
};
