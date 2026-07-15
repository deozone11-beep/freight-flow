import { useEffect, useRef, useState } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import { getLiveLocation } from "../api/tracking";

// Polls the backend every 5s for the driver's latest GPS ping and shows it
// on an embedded OpenStreetMap frame. Visibility is enforced server-side:
// customer/company only see their own order, warehouse manager only their
// warehouse, and admin sees everything.
function LiveTrackMap({ trackingId }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  const fetchLocation = async () => {
    try {
      const data = await getLiveLocation(trackingId);
      setLocation(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "No live location yet.");
    }
  };

  useEffect(() => {
    if (!trackingId) return;
    fetchLocation();
    timerRef.current = setInterval(fetchLocation, 5000);
    return () => clearInterval(timerRef.current);
  }, [trackingId]);

  if (!trackingId) return null;

  const bboxDelta = 0.01;
  const mapSrc = location
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - bboxDelta}%2C${location.latitude - bboxDelta}%2C${location.longitude + bboxDelta}%2C${location.latitude + bboxDelta}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`
    : null;

  return (
    <div style={{ border: "1px solid var(--hairline-08, #333)", borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--surface-2, #1a1a1a)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}>
          <MapPin size={16} />
          <span>Tracking ID: <strong>{trackingId}</strong></span>
          {location?.status && <span style={{ opacity: 0.7 }}> · {location.status}</span>}
        </div>
        <button onClick={fetchLocation} title="Refresh now" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
          <RefreshCw size={16} />
        </button>
      </div>

      {mapSrc ? (
        <>
          <iframe
            title={`live-map-${trackingId}`}
            src={mapSrc}
            style={{ width: "100%", height: "280px", border: "none" }}
            loading="lazy"
          />
          <div style={{ padding: "8px 14px", fontSize: "0.78rem", opacity: 0.75 }}>
            Lat {location.latitude.toFixed(5)}, Lng {location.longitude.toFixed(5)} · updated{" "}
            {new Date(location.updatedAt).toLocaleTimeString()}
          </div>
        </>
      ) : (
        <div style={{ padding: "24px", fontSize: "0.85rem", opacity: 0.75 }}>
          {error || "Waiting for the driver's first GPS ping..."}
        </div>
      )}
    </div>
  );
}

export default LiveTrackMap;
