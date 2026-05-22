import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "../data";

const CHANNEL_NAME = "mundial2026_sync";

// Simple localStorage-based storage with cross-tab sync
export function useParticipants() {
  const read = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };

  const [participants, setParticipants] = useState(read);

  useEffect(() => {
    // Listen for updates from other tabs
    let channel;
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (e) => {
        if (e.data.type === "participants_updated") {
          setParticipants(read());
        }
      };
    } catch {}

    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.PARTICIPANTS) setParticipants(read());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);

  const saveParticipant = useCallback((name, predictions) => {
    const current = read();
    current[name] = { name, predictions, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(current));
    setParticipants({ ...current });
    try {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage({ type: "participants_updated" });
      ch.close();
    } catch {}
  }, []);

  return { participants, saveParticipant };
}

export function useResults() {
  const read = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };

  const [results, setResults] = useState(read);

  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (e) => {
        if (e.data.type === "results_updated") setResults(read());
      };
    } catch {}

    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.RESULTS) setResults(read());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);

  const saveResults = useCallback((newResults) => {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(newResults));
    setResults({ ...newResults });
    try {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage({ type: "results_updated" });
      ch.close();
    } catch {}
  }, []);

  return { results, saveResults };
}
