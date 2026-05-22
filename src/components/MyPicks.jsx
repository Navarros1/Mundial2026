import { CATEGORIES, FLAGS, calculateScore } from "../data";

export default function MyPicks({ user, participants, results }) {
  const me = participants[user];
  if (!me) {
    return (
      <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(255,255,255,0.3)" }}>
        <div style={{ fontSize:"48px", marginBottom:"16px" }}>📋</div>
        <p style={{ fontSize:"15px" }}>Aún no has hecho tus predicciones.</p>
        <p style={{ fontSize:"13px", marginTop:"8px" }}>Ve a la pestaña "Mis picks" para hacerlas.</p>
      </div>
    );
  }

  const { total, breakdown } = calculateScore(me.predictions, results);
  const maxPossible = CATEGORIES.reduce((a,c) => a + c.points, 0);
  const hasResults = Object.keys(results).length > 0;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
        <h2 style={{ color:"#ffd700", fontSize:"18px", fontWeight:"800" }}>📋 Mis predicciones</h2>
        {hasResults && (
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"24px", fontWeight:"900", color:"#ffd700", lineHeight:1 }}>{total}</div>
            <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)" }}>de {maxPossible} pts</div>
          </div>
        )}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        {CATEGORIES.map((cat, i) => {
          const pick  = me.predictions?.[cat.id];
          const res   = results[cat.id];
          const pts   = breakdown[cat.id] || 0;
          const isHit = pts > 0;
          const hasResult = res !== undefined && res !== "";

          return (
            <div key={cat.id} style={{
              padding:"14px 16px",
              background: isHit ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isHit ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius:"12px",
              animation:`slideIn 0.4s ease ${i*0.05}s both`,
            }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:"10px" }}>
                <span style={{ fontSize:"18px", marginTop:"1px" }}>{cat.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", marginBottom:"4px" }}>{cat.label}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                    <span style={{ color:"#fff", fontWeight:"700", fontSize:"14px" }}>
                      {pick ? (
                        <>
                          {cat.type === "single" && FLAGS[pick] ? `${FLAGS[pick]} ` : ""}
                          {pick}
                        </>
                      ) : (
                        <span style={{ color:"rgba(255,255,255,0.2)", fontStyle:"italic" }}>—</span>
                      )}
                    </span>
                    {hasResult && (
                      <>
                        <span style={{ color:"rgba(255,255,255,0.2)", fontSize:"12px" }}>→</span>
                        <span style={{ color: isHit ? "#4ade80" : "rgba(255,255,255,0.4)", fontWeight:"700", fontSize:"13px" }}>
                          {cat.type === "single" && FLAGS[res] ? `${FLAGS[res]} ` : ""}
                          {res}
                        </span>
                        <span style={{ fontSize:"14px" }}>{isHit ? "✅" : "❌"}</span>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  {hasResult ? (
                    <>
                      <div style={{ fontSize:"18px", fontWeight:"900", color: isHit ? "#4ade80" : "rgba(255,255,255,0.2)" }}>
                        {isHit ? `+${pts}` : "0"}
                      </div>
                      <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.2)" }}>de {cat.points}</div>
                    </>
                  ) : (
                    <div style={{ fontSize:"13px", color:"rgba(255,215,0,0.4)", fontWeight:"700" }}>{cat.points}pts</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ color:"rgba(255,255,255,0.2)", fontSize:"12px", textAlign:"center", marginTop:"20px" }}>
        Guardadas el {new Date(me.savedAt).toLocaleDateString("es-ES", { day:"numeric", month:"long", hour:"2-digit", minute:"2-digit" })}
      </p>
    </div>
  );
}
