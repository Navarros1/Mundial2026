import { useState } from "react";
import { CATEGORIES, TEAMS, FLAGS } from "../data";

export default function AdminPanel({ results, onSave }) {
  const [form, setForm]   = useState(results || {});
  const [saved, setSaved] = useState(false);
  const [locked, setLocked] = useState(false);

  function set(id, val) {
    setForm(f => ({ ...f, [id]: val }));
  }

  function handleSave() {
    onSave({ ...form, _locked: locked });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
        <h2 style={{ color:"#ff6b6b", fontSize:"18px", fontWeight:"800" }}>🔧 Panel Admin</h2>
        <span style={{ background:"rgba(255,107,107,0.1)", color:"#ff6b6b", fontSize:"11px", padding:"3px 8px", borderRadius:"12px", border:"1px solid rgba(255,107,107,0.3)" }}>SOLO TÚ VES ESTO</span>
      </div>
      <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"24px" }}>
        Introduce los resultados conforme avanza el torneo. Los puntos se actualizan automáticamente para todos.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
        {CATEGORIES.map((cat, i) => (
          <div key={cat.id} style={{
            padding:"14px 16px", background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px",
            animation:`slideIn 0.3s ease ${i*0.04}s both`,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
              <span>{cat.emoji}</span>
              <span style={{ color:"#fff", fontWeight:"700", fontSize:"14px" }}>{cat.label}</span>
              <span style={{ marginLeft:"auto", color:"#ffd700", fontWeight:"700", fontSize:"13px" }}>{cat.points}pts</span>
            </div>

            {cat.type === "single" ? (
              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                <button onClick={() => set(cat.id, "")} style={{
                  padding:"5px 10px", borderRadius:"7px", cursor:"pointer",
                  fontFamily:"'Outfit',sans-serif", fontSize:"12px",
                  background: !form[cat.id] ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                  border: !form[cat.id] ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  color: !form[cat.id] ? "#fff" : "rgba(255,255,255,0.4)",
                }}>Sin resultado</button>
                {TEAMS.map(team => (
                  <button key={team} onClick={() => set(cat.id, team)} style={{
                    padding:"5px 10px", borderRadius:"7px", cursor:"pointer",
                    fontFamily:"'Outfit',sans-serif", fontSize:"12px", fontWeight:"600",
                    background: form[cat.id]===team ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.04)",
                    border: form[cat.id]===team ? "1px solid rgba(74,222,128,0.6)" : "1px solid rgba(255,255,255,0.08)",
                    color: form[cat.id]===team ? "#4ade80" : "rgba(255,255,255,0.6)",
                  }}>
                    {FLAGS[team]||"🏳️"} {team}
                  </button>
                ))}
              </div>
            ) : (
              <input
                value={form[cat.id] || ""}
                onChange={e => set(cat.id, e.target.value)}
                type={cat.type === "number" ? "number" : "text"}
                placeholder={cat.placeholder || `Resultado de ${cat.label}`}
                style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", color:"#fff", fontSize:"14px", outline:"none", fontFamily:"'Outfit',sans-serif" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Lock predictions toggle */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px", background:"rgba(255,107,107,0.05)", border:"1px solid rgba(255,107,107,0.15)", borderRadius:"12px", margin:"20px 0 16px" }}>
        <button onClick={() => setLocked(l => !l)} style={{
          width:"44px", height:"24px", borderRadius:"12px", border:"none", cursor:"pointer", position:"relative", transition:"background 0.3s",
          background: locked ? "#ff6b6b" : "rgba(255,255,255,0.15)",
        }}>
          <div style={{ position:"absolute", top:"2px", width:"20px", height:"20px", borderRadius:"50%", background:"#fff", transition:"left 0.3s", left: locked ? "22px" : "2px" }}/>
        </button>
        <div>
          <div style={{ color:"#fff", fontWeight:"700", fontSize:"14px" }}>Cerrar predicciones</div>
          <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px" }}>
            {locked ? "🔒 Nadie más puede editar sus picks" : "🔓 Los participantes todavía pueden editar"}
          </div>
        </div>
      </div>

      <button onClick={handleSave} style={{
        width:"100%", padding:"15px",
        background: saved ? "linear-gradient(135deg,#4ade80,#22c55e)" : "linear-gradient(135deg,#ff6b6b,#e53e3e)",
        border:"none", borderRadius:"14px", color:"#fff", fontSize:"15px", fontWeight:"800",
        cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"background 0.3s",
      }}>
        {saved ? "✅ Guardado" : "ACTUALIZAR RESULTADOS"}
      </button>
    </div>
  );
}
