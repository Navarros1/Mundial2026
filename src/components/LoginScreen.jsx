import { useState } from "react";
import { ADMIN_PASSWORD } from "../data";

export default function LoginScreen({ onLogin }) {
  const [name, setName]   = useState("");
  const [pass, setPass]   = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Introduce tu nombre");
      triggerShake();
      return;
    }
    // Admin login
    if (trimmed.toLowerCase() === "admin" && pass === ADMIN_PASSWORD) {
      onLogin({ name: "admin", role: "admin" });
      return;
    }
    // Regular user — any name + any password
    onLogin({ name: trimmed, role: "user" });
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  return (
    <div style={styles.bg}>
      <Stars />
      <div style={{ ...styles.card, animation: shake ? "shake 0.4s ease" : "fadeUp 0.7s ease both" }}>
        <div style={styles.trophy}>🏆</div>
        <h1 style={styles.title}>MUNDIAL 2026</h1>
        <p style={styles.subtitle}>PREDICTIONS</p>
        <p style={styles.hint}>Introduce tu nombre para entrar</p>

        <input
          value={name}
          onChange={e => { setName(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="Tu nombre"
          style={styles.input}
          onFocus={e => e.target.style.borderColor = "rgba(255,215,0,0.7)"}
          onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />
        <input
          type="password"
          value={pass}
          onChange={e => { setPass(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="Contraseña (cualquiera)"
          style={{ ...styles.input, marginTop: "12px" }}
          onFocus={e => e.target.style.borderColor = "rgba(255,215,0,0.7)"}
          onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleSubmit} style={styles.btn}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 16px 48px rgba(255,215,0,0.45)"; }}
          onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 8px 32px rgba(255,215,0,0.25)"; }}
        >
          ENTRAR ⚽
        </button>

        <p style={styles.adminHint}>Admin: usa "admin" + contraseña especial</p>
      </div>

      <style>{`
        @keyframes fadeUp  { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }
        @keyframes twinkle { 0%,100%{opacity:0.2} 50%{opacity:1} }
        input::placeholder { color: rgba(255,255,255,0.22); }
      `}</style>
    </div>
  );
}

function Stars() {
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
      {[...Array(55)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width:  i % 4 === 0 ? "3px" : "2px",
          height: i % 4 === 0 ? "3px" : "2px",
          borderRadius: "50%",
          background: i % 6 === 0 ? "#ffd700" : "rgba(255,255,255,0.55)",
          top:  `${(i * 37.3) % 100}%`,
          left: `${(i * 61.8) % 100}%`,
          animation: `twinkle ${2 + (i % 4)}s ease-in-out infinite`,
          animationDelay: `${(i * 0.17) % 3}s`,
        }} />
      ))}
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(145deg, #060612 0%, #120820 45%, #060e06 100%)",
    fontFamily: "'Outfit', sans-serif", position: "relative", overflow: "hidden", padding: "20px",
  },
  card: {
    background: "rgba(255,255,255,0.035)", backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,215,0,0.22)", borderRadius: "28px",
    padding: "52px 44px", width: "100%", maxWidth: "400px", textAlign: "center",
    boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(255,215,0,0.04)",
    position: "relative", zIndex: 1,
  },
  trophy: { fontSize: "52px", marginBottom: "10px", display: "block" },
  title:  { fontFamily: "'Bebas Neue', sans-serif", fontSize: "42px", color: "#ffd700", letterSpacing: "3px", margin: 0, textShadow: "0 0 40px rgba(255,215,0,0.35)" },
  subtitle: { fontFamily:"'Bebas Neue', sans-serif", fontSize:"18px", color:"rgba(255,255,255,0.4)", letterSpacing:"6px", margin:"2px 0 28px" },
  hint:   { color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "24px" },
  input: {
    width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "14px",
    color: "#fff", fontSize: "15px", outline: "none", fontFamily: "'Outfit', sans-serif",
    transition: "border-color 0.2s", display: "block",
  },
  btn: {
    width: "100%", marginTop: "24px", padding: "16px",
    background: "linear-gradient(135deg, #ffd700 0%, #f5a800 100%)",
    border: "none", borderRadius: "14px", color: "#060612",
    fontSize: "16px", fontWeight: "800", cursor: "pointer",
    fontFamily: "'Outfit', sans-serif", letterSpacing: "1px",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 8px 32px rgba(255,215,0,0.25)",
  },
  error:     { color: "#ff6b6b", fontSize: "13px", marginTop: "12px" },
  adminHint: { color: "rgba(255,255,255,0.15)", fontSize: "11px", marginTop: "20px" },
};
