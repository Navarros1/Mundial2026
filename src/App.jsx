import { useState } from "react";
import Login       from "./components/Login";
import Leaderboard from "./components/Leaderboard";
import GroupStage  from "./components/GroupStage";
import Knockout    from "./components/Knockout";
import Awards      from "./components/Awards";
import AdminPanel  from "./components/AdminPanel";
import { useParticipants, useResults, useLocked, savePredictions } from "./hooks/useFirebase";

export default function App() {
  const [user, setUser] = useState(null);
  const [tab,  setTab]  = useState("ranking");
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  const { participants } = useParticipants();
  const { results, saveResults } = useResults();
  const { locked, setLocked } = useLocked();

  const isAdmin = user?.role === "admin";
  const me = user?.name;

  // Load my predictions when I log in
  function handleLogin(u) {
    setUser(u);
    const myPreds = participants[u.name]?.predictions || {};
    setForm(myPreds);
    setTab("ranking");
  }

  function setMatch(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function setAward(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    await savePredictions(me, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!user) return <Login onLogin={handleLogin} />;

  const tabs = [
    { id: "ranking",  label: "🏆 Ranking"  },
    { id: "grupos",   label: "⚽ Grupos"   },
    { id: "elim",     label: "🔥 Elim."    },
    { id: "premios",  label: "⭐ Premios"  },
    ...(isAdmin ? [{ id: "admin", label: "🔧 Admin" }] : []),
  ];

  const isPredictTab = ["grupos","elim","premios"].includes(tab);

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f9fafb; }
        input, select { outline: none; }
        input:focus, select:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        input::placeholder { color: #9ca3af; }
        button:active { opacity: 0.85; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>
            <span style={{ fontSize: 22 }}>⚽</span>
            <div>
              <div style={s.logoTitle}>Mundial 2026</div>
              <div style={s.logoSub}>Predictions</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {locked && <span style={s.lockedBadge}>🔒 Cerrado</span>}
            <span style={s.userTag}>{isAdmin ? "🔧 Admin" : `👤 ${me}`}</span>
            <button onClick={() => setUser(null)} style={s.logoutBtn}>Salir</button>
          </div>
        </div>
      </header>

      {/* ── TABS ── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              ...s.navBtn,
              color:      tab === t.id ? "#2563eb" : "#6b7280",
              fontWeight: tab === t.id ? 700 : 500,
              borderBottom: tab === t.id ? "2px solid #2563eb" : "2px solid transparent",
            }}>{t.label}</button>
          ))}
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main style={s.main}>
        <div style={s.content}>

          {tab === "ranking" && (
            <Leaderboard participants={participants} results={results} currentUser={me} />
          )}

          {tab === "grupos" && (
            locked && !isAdmin ? <Locked /> :
            <GroupStage predictions={form} onChange={setMatch} />
          )}

          {tab === "elim" && (
            locked && !isAdmin ? <Locked /> :
            <Knockout predictions={form} onChange={setMatch} />
          )}

          {tab === "premios" && (
            locked && !isAdmin ? <Locked /> :
            <Awards predictions={form} onChange={setAward} />
          )}

          {tab === "admin" && isAdmin && (
            <AdminPanel
              results={results}
              onSave={saveResults}
              locked={locked}
              onLock={setLocked}
            />
          )}

          {/* Save bar for prediction tabs */}
          {isPredictTab && !locked && (
            <div style={s.saveBar}>
              <span style={s.saveInfo}>
                {participants[me] ? "✏️ Editando tus predicciones" : "📝 Predicciones nuevas"}
              </span>
              <button onClick={handleSave} style={{
                ...s.saveBtn,
                background: saved ? "#22c55e" : "#2563eb",
              }}>
                {saved ? "✅ Guardado" : "Guardar predicciones"}
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function Locked() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Predicciones cerradas</h3>
      <p style={{ fontSize: 14, color: "#6b7280" }}>El torneo ya ha comenzado. Ya no se pueden cambiar las predicciones.</p>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter', sans-serif" },
  header: { background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100 },
  headerInner: { maxWidth: 700, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoTitle: { fontSize: 17, fontWeight: 800, color: "#111827", lineHeight: 1 },
  logoSub:   { fontSize: 11, color: "#9ca3af", fontWeight: 500 },
  userTag:   { fontSize: 13, color: "#6b7280", fontWeight: 500 },
  logoutBtn: { background: "#f3f4f6", border: "none", color: "#6b7280", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 500 },
  lockedBadge: { background: "#fee2e2", color: "#ef4444", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20 },
  nav: { background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 58, zIndex: 99 },
  navInner: { maxWidth: 700, margin: "0 auto", display: "flex", padding: "0 20px" },
  navBtn: { flex: 1, padding: "12px 6px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "inherit", transition: "all 0.15s" },
  main: { padding: "24px 20px 100px" },
  content: { maxWidth: 700, margin: "0 auto" },
  saveBar: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e5e7eb", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 200 },
  saveInfo: { fontSize: 13, color: "#6b7280" },
  saveBtn: { padding: "10px 24px", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "background 0.3s" },
};
