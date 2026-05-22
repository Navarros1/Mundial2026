import { useState } from "react";
import LoginScreen    from "./components/LoginScreen";
import Leaderboard    from "./components/Leaderboard";
import PredictionsForm from "./components/PredictionsForm";
import MyPicks         from "./components/MyPicks";
import AdminPanel      from "./components/AdminPanel";
import { useParticipants, useResults } from "./hooks/useStorage";

export default function App() {
  const [user, setUser] = useState(null);
  const [tab,  setTab]  = useState("ranking");

  const { participants, saveParticipant } = useParticipants();
  const { results, saveResults }          = useResults();

  const isAdmin  = user?.role === "admin";
  const locked   = results?._locked === true;
  const username = user?.name;

  const tabs = [
    { id:"ranking",  label:"🏆 Ranking"   },
    { id:"predict",  label:"⚽ Mis picks"  },
    { id:"mypicks",  label:"📋 Resumen"   },
    ...(isAdmin ? [{ id:"admin", label:"🔧 Admin" }] : []),
  ];

  if (!user) return <LoginScreen onLogin={u => { setUser(u); setTab("ranking"); }} />;

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        input::placeholder { color:rgba(255,255,255,0.2); }
        button:active { transform:scale(0.97) !important; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={{ fontSize:"22px" }}>⚽</span>
            <div>
              <div style={styles.logoTitle}>MUNDIAL 2026</div>
              <div style={styles.logoSub}>PREDICTIONS</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={styles.userTag}>
              {isAdmin ? "🔧 Admin" : `👤 ${username}`}
            </span>
            <button onClick={() => setUser(null)} style={styles.logoutBtn}>Salir</button>
          </div>
        </div>
      </header>

      {/* ── NAV ────────────────────────────────────────────── */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              ...styles.navBtn,
              color:        tab===t.id ? "#ffd700" : "rgba(255,255,255,0.38)",
              fontWeight:   tab===t.id ? "800" : "600",
              borderBottom: tab===t.id ? "2px solid #ffd700" : "2px solid transparent",
            }}>{t.label}</button>
          ))}
        </div>
      </nav>

      {/* ── CONTENT ────────────────────────────────────────── */}
      <main style={styles.main}>
        <div style={styles.content}>

          {tab === "ranking" && (
            <Leaderboard
              participants={participants}
              results={results}
              currentUser={username}
            />
          )}

          {tab === "predict" && (
            <PredictionsForm
              user={username}
              existing={participants[username]?.predictions}
              onSave={preds => saveParticipant(username, preds)}
              locked={locked}
            />
          )}

          {tab === "mypicks" && (
            <MyPicks
              user={username}
              participants={participants}
              results={results}
            />
          )}

          {tab === "admin" && isAdmin && (
            <AdminPanel
              results={results}
              onSave={saveResults}
            />
          )}

        </div>
      </main>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #060612 0%, #0f0820 50%, #060e06 100%)",
    fontFamily: "'Outfit', sans-serif", color: "#fff",
  },
  header: {
    background: "rgba(0,0,0,0.45)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,215,0,0.12)",
    position: "sticky", top: 0, zIndex: 100,
  },
  headerInner: {
    maxWidth: "600px", margin: "0 auto", padding: "0 20px",
    display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px",
  },
  logo: { display:"flex", alignItems:"center", gap:"10px" },
  logoTitle: { fontFamily:"'Bebas Neue',sans-serif", fontSize:"20px", color:"#ffd700", letterSpacing:"2px", lineHeight:1, textShadow:"0 0 20px rgba(255,215,0,0.3)" },
  logoSub:   { fontFamily:"'Bebas Neue',sans-serif", fontSize:"11px", color:"rgba(255,255,255,0.3)", letterSpacing:"4px", lineHeight:1 },
  userTag:   { color:"rgba(255,255,255,0.5)", fontSize:"13px" },
  logoutBtn: { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.45)", padding:"6px 12px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontFamily:"inherit" },
  nav: { background:"rgba(0,0,0,0.25)", borderBottom:"1px solid rgba(255,255,255,0.05)", position:"sticky", top:"60px", zIndex:99 },
  navInner: { maxWidth:"600px", margin:"0 auto", display:"flex", padding:"0 20px" },
  navBtn: { flex:1, padding:"14px 6px", background:"none", border:"none", cursor:"pointer", fontSize:"13px", fontFamily:"inherit", transition:"all 0.2s" },
  main: { padding:"28px 20px 60px" },
  content: { maxWidth:"600px", margin:"0 auto" },
};
