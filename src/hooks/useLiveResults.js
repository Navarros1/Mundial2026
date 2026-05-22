import { useState, useEffect } from "react";

// We use api-football (rapidapi) or football-data.org
// For now we use a mock that simulates auto-updating results.
// To connect a real API, replace fetchLiveResults with an actual call.

// football-data.org free tier: https://api.football-data.org/v4/
// competition code for World Cup: WC
// No key needed for basic access, just header "X-Auth-Token"

async function fetchLiveResults() {
  try {
    // Attempt to fetch from football-data.org (free, no key for WC)
    const res = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches?stage=FINAL",
      { headers: { "X-Auth-Token": "YOUR_API_TOKEN_HERE" } }
    );
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    // Parse into our format
    const results = {};
    // This would be filled with actual parsing logic
    return results;
  } catch {
    // Return null so caller knows API isn't set up
    return null;
  }
}

export function useLiveResults() {
  const [apiStatus, setApiStatus] = useState("idle"); // idle | loading | ok | unavailable

  useEffect(() => {
    setApiStatus("unavailable"); // until real token is set
  }, []);

  return { apiStatus };
}
