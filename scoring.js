import { useState } from "react";
import { ADMIN_PASS } from "../data/worldcup";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err,  setErr]  = useState("");

  function submit() {
    const n = name.trim();
    if (!n) { setErr("Introduce tu nombre"); return; }
    if (n.toLowerCase() === "admin" && pass === ADMIN_PASS) {
      onLogin({ name: "admin", role: "admin" });
    } else {
      onLogin({ name: n, role: "user" });
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.logoArea}>
          <div style={s.ball}>⚽</div>
          <h1 style={s.title}>Mundial 2026</h1>
          <p style={s.subtitle}>Predictions</p>
        </div>

        {/* Form */}
        <div style={s.form}>
          <label style={s.label}>Tu nombre</label>
          <input
            value={name}
            onChange={e => { setName(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Ej: Carlos"
            style={s.input}
            autoFocus
          />
          <label style={{ ...s.label, marginTop: 16 }}>Contraseña</label>
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Cualquiera vale"
            style={s.input}
          />
          {err && <p style={s.err}>{err}</p>}
          <button onClick={submit} style={s.btn}>Entrar →</button>
        </div>

        <p style={s.hint}>Admin: nombre "admin" + contraseña especial</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f5f5f5; }
        input:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        input::placeholder { color: #9ca3af; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)", padding: 20,
  },
  card: {
    background: "#fff", borderRadius: 20, padding: "40px 36px",
    width: "100%", maxWidth: 400,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 60px -10px rgba(0,0,0,0.1)",
    animation: "fadeUp 0.5s ease both",
  },
  logoArea: { textAlign: "center", marginBottom: 32 },
  ball: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" },
  subtitle: { fontSize: 14, color: "#6b7280", fontWeight: 500, marginTop: 2 },
  form: { display: "flex", flexDirection: "column" },
  label: { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  input: {
    padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10,
    fontSize: 15, color: "#111827", transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  },
  btn: {
    marginTop: 24, padding: "13px", background: "#2563eb", color: "#fff",
    border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
  },
  err:  { color: "#ef4444", fontSize: 13, marginTop: 8 },
  hint: { color: "#9ca3af", fontSize: 12, textAlign: "center", marginTop: 20 },
};
