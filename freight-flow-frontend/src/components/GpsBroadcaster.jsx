import { useEffect, useRef, useState } from "react";
import { Navigation, Square } from "lucide-react";
import { pingLocation } from "../api/tracking";

// Uses the browser's real Geolocation API (navigator.geolocation.watchPosition)
// to stream the driver's live GPS position to the backend for a given tracking id.
function GpsBroadcaster({ trackingId }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [lastSent, setLastSent] = useState(null);
  const watchIdRef = useRef(null);

  const start = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this device/browser.");
      return;
    }
    setError("");
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        pingLocation(trackingId, latitude, longitude)
          .then(() => setLastSent(new Date()))
          .catch((err) => setError(err.response?.data?.error || "Failed to send location"));
      },
      (err) => setError(err.message || "Could not get your location"),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    setActive(true);
  };

  const stop = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setActive(false);
  };

  useEffect(() => () => stop(), []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {!active ? (
        <button className="save-btn" onClick={start} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Navigation size={16} /> Go live
        </button>
      ) : (
        <button className="save-btn" onClick={stop} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#ef4444" }}>
          <Square size={16} /> Stop sharing
        </button>
      )}
      {active && <span style={{ fontSize: "0.78rem", opacity: 0.75 }}>
        {lastSent ? `Last sent ${lastSent.toLocaleTimeString()}` : "Getting GPS fix..."}
      </span>}
      {error && <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>{error}</span>}
    </div>
  );
}

export default GpsBroadcaster;
