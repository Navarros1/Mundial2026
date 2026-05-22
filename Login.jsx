import { useState } from "react";
import { GROUPS, ALL_TEAMS, FLAGS } from "../data/worldcup";

export default function AdminPanel({ results, onSave, locked, onLock }) {
  const [form, setForm]   = useState(results || {});
  const [tab,  setTab]    = useState("groups");
  const [saved, setSaved] = useState(false);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function setNested(key, field, val) {
    setForm(f => ({ ...f, [key]: { ...(f[key] || {}), [field]: val } }));
  }

  function save() {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const tabs = [
    { id: "groups",  label: "Grupos"     },
    { id: "knockout",label: "Eliminatoria" },
    { id: "awards",  label: "Premios"    },
    { id: "settings",label: "⚙️ Config"  },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Panel Admin</h2>
        <span style={s.adminBadge}>SOLO TÚ</span>
      </div>
      <p style={s.hint}>Mete los resultados conforme avanza el torneo. Los puntos se calculan automáticamente.</p>

      <div style={s.tabs}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            ...s.tab,
            background: tab === t.id ? "#2563eb" : "#f3f4f6",
            color: tab === t.id ? "#fff" : "#374151",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "groups" && (
        <GroupResults form={form} setNested={setNested} />
      )}

      {tab === "knockout" && (
        <KnockoutResults form={form} set={set} setNested={setNested} />
      )}

      {tab === "awards" && (
        <AwardResults form={form} set={set} />
      )}

      {tab === "settings" && (
        <div style={s.settingsCard}>
          <h4 style={s.settingsTitle}>Cerrar predicciones</h4>
          <p style={s.settingsDesc}>Cuando el torneo empiece, bloquea las predicciones para que nadie pueda cambiarlas.</p>
          <button onClick={() => onLock(!locked)} style={{
            ...s.lockBtn,
            background: locked ? "#fee2e2" : "#f0fdf4",
            color: locked ? "#ef4444" : "#22c55e",
            border: `1.5px solid ${locked ? "#fecaca" : "#bbf7d0"}`,
          }}>
            {locked ? "🔒 Predicciones CERRADAS — clic para abrir" : "🔓 Predicciones ABIERTAS — clic para cerrar"}
          </button>
        </div>
      )}

      <button onClick={save} style={{
        ...s.saveBtn,
        background: saved ? "#22c55e" : "#2563eb",
      }}>
        {saved ? "✅ Guardado" : "Guardar resultados"}
      </button>
    </div>
  );
}

function GroupResults({ form, setNested }) {
  const [openGroup, setOpenGroup] = useState("A");
  return (
    <div>
      <div style={s.groupTabs}>
        {Object.keys(GROUPS).map(g => (
          <button key={g} onClick={() => setOpenGroup(g)} style={{
            ...s.groupTab,
            background: openGroup === g ? "#2563eb" : "#f3f4f6",
            color: openGroup === g ? "#fff" : "#374151",
          }}>{g}</button>
        ))}
      </div>
      {GROUPS[openGroup].matches.map(([home, away], idx) => {
        const key = `group_${openGroup}_${idx}`;
        const res = form[key] || {};
        return (
          <div key={key} style={s.matchCard}>
            <div style={s.matchLabel}>{FLAGS[home]||"🏳️"} {home} vs {FLAGS[away]||"🏳️"} {away}</div>
            <div style={s.matchInputs}>
              <input type="number" min="0" max="20" value={res.homeGoals ?? ""} onChange={e => setNested(key,"homeGoals",e.target.value)} style={s.numInput} placeholder="0" />
              <span style={s.dash}>—</span>
              <input type="number" min="0" max="20" value={res.awayGoals ?? ""} onChange={e => setNested(key,"awayGoals",e.target.value)} style={s.numInput} placeholder="0" />
              <input value={res.scorer||""} onChange={e => setNested(key,"scorer",e.target.value)} placeholder="Goleador del partido..." style={s.textInput} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KnockoutResults({ form, set, setNested }) {
  const rounds = [
    { id:"octavos", label:"Octavos", n:16 },
    { id:"cuartos", label:"Cuartos", n:8  },
    { id:"semi",    label:"Semifinal", n:4 },
    { id:"final",   label:"Final", n:2    },
  ];
  const [round, setRound] = useState("octavos");
  const cur = rounds.find(r => r.id === round);

  return (
    <div>
      <div style={s.groupTabs}>
        {rounds.map(r => (
          <button key={r.id} onClick={() => setRound(r.id)} style={{
            ...s.groupTab, background: round===r.id?"#2563eb":"#f3f4f6", color: round===r.id?"#fff":"#374151",
          }}>{r.label}</button>
        ))}
      </div>
      {Array.from({length: cur.n}).map((_,i) => {
        const key = `${round}_${i}`;
        const res = form[key] || {};
        return (
          <div key={key} style={s.matchCard}>
            <div style={s.matchLabel}>Partido {i+1}</div>
            <div style={s.matchInputs}>
              <select value={res.homeTeam||""} onChange={e => setNested(key,"homeTeam",e.target.value)} style={s.select}>
                <option value="">Local</option>
                {ALL_TEAMS.map(t => <option key={t} value={t}>{FLAGS[t]||"🏳️"} {t}</option>)}
              </select>
              <input type="number" min="0" value={res.homeGoals??""} onChange={e => setNested(key,"homeGoals",e.target.value)} style={s.numInput} placeholder="0" />
              <span style={s.dash}>—</span>
              <input type="number" min="0" value={res.awayGoals??""} onChange={e => setNested(key,"awayGoals",e.target.value)} style={s.numInput} placeholder="0" />
              <select value={res.awayTeam||""} onChange={e => setNested(key,"awayTeam",e.target.value)} style={s.select}>
                <option value="">Visitante</option>
                {ALL_TEAMS.map(t => <option key={t} value={t}>{FLAGS[t]||"🏳️"} {t}</option>)}
              </select>
            </div>
            <div style={s.matchInputs}>
              <select value={res.winner||""} onChange={e => setNested(key,"winner",e.target.value)} style={{...s.select, flex:1}}>
                <option value="">Ganador</option>
                {ALL_TEAMS.map(t => <option key={t} value={t}>{FLAGS[t]||"🏳️"} {t}</option>)}
              </select>
              <input value={res.scorer||""} onChange={e => setNested(key,"scorer",e.target.value)} placeholder="Goleador..." style={s.textInput} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AwardResults({ form, set }) {
  const awards = [
    { id:"champion",   label:"🏆 Campeón",       type:"team"   },
    { id:"finalist",   label:"🥈 Finalista",      type:"team"   },
    { id:"third",      label:"🥉 3er Clasificado", type:"team"  },
    { id:"top_scorer", label:"👟 Máximo Goleador", type:"player" },
    { id:"mvp",        label:"⭐ MVP",             type:"player" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {awards.map(a => (
        <div key={a.id} style={s.matchCard}>
          <div style={s.matchLabel}>{a.label}</div>
          {a.type === "team" ? (
            <select value={form[a.id]||""} onChange={e => set(a.id, e.target.value)} style={{...s.select, width:"100%"}}>
              <option value="">Sin resultado aún</option>
              {ALL_TEAMS.map(t => <option key={t} value={t}>{FLAGS[t]||"🏳️"} {t}</option>)}
            </select>
          ) : (
            <input value={form[a.id]||""} onChange={e => set(a.id, e.target.value)} placeholder="Nombre del jugador..." style={{...s.textInput, width:"100%"}} />
          )}
        </div>
      ))}
    </div>
  );
}

const s = {
  hint: { fontSize: 13, color: "#6b7280", marginBottom: 16 },
  adminBadge: { background:"#fee2e2", color:"#ef4444", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:20 },
  tabs: { display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 },
  tab: { padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:700, transition:"all 0.15s" },
  groupTabs: { display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 },
  groupTab: { padding:"5px 12px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:700 },
  matchCard: { background:"#fff", border:"1.5px solid #f3f4f6", borderRadius:12, padding:"12px 14px", marginBottom:8 },
  matchLabel: { fontSize:13, fontWeight:700, color:"#374151", marginBottom:8 },
  matchInputs: { display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" },
  numInput: { width:44, height:36, textAlign:"center", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:14, fontWeight:700, fontFamily:"inherit" },
  dash: { color:"#9ca3af", fontWeight:700 },
  textInput: { flex:1, padding:"7px 10px", border:"1.5px solid #e5e7eb", borderRadius:8, fontSize:13, fontFamily:"inherit", color:"#111827", minWidth:120 },
  select: { padding:"7px 8px", border:"1.5px solid #e5e7eb", borderRadius:8, fontFamily:"inherit", fontSize:12, color:"#111827", background:"#fff" },
  saveBtn: { width:"100%", marginTop:20, padding:14, border:"none", borderRadius:10, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"background 0.3s" },
  settingsCard: { background:"#fff", border:"1.5px solid #f3f4f6", borderRadius:12, padding:20, marginBottom:16 },
  settingsTitle: { fontSize:15, fontWeight:700, color:"#111827", marginBottom:4 },
  settingsDesc: { fontSize:13, color:"#6b7280", marginBottom:12 },
  lockBtn: { width:"100%", padding:12, borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight:700, transition:"all 0.2s" },
};
