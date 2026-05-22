import { useState, useEffect } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { db } from "../firebase";

// ── Generic real-time hook ──────────────────────────────────────────────────
export function useFirebase(path) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = ref(db, path);
    const unsub = onValue(r, snap => {
      setData(snap.val());
      setLoading(false);
    });
    return () => unsub();
  }, [path]);

  const write = async (value) => {
    await set(ref(db, path), value);
  };

  return { data, loading, write };
}

// ── Participants (all users' predictions) ──────────────────────────────────
export function useParticipants() {
  const { data, loading } = useFirebase("participants");
  return { participants: data || {}, loading };
}

// ── Save one user's predictions ────────────────────────────────────────────
export async function savePredictions(username, predictions) {
  await set(ref(db, `participants/${username}`), {
    name: username,
    predictions,
    savedAt: new Date().toISOString(),
  });
}

// ── Official results (set by admin) ────────────────────────────────────────
export function useResults() {
  const { data, loading, write } = useFirebase("results");
  return { results: data || {}, loading, saveResults: write };
}

// ── Lock state ─────────────────────────────────────────────────────────────
export function useLocked() {
  const { data, write } = useFirebase("locked");
  return { locked: data === true, setLocked: write };
}
