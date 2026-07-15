import { useState, useEffect } from "react";
import "../css/dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getFleet } from "../api/fleet";
import {
  Truck,
  Wrench,
  Clock3,
  ShieldCheck,
} from "lucide-react";

function Fleet() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    getFleet()
      .then(setVehicles)
      .catch(() => {});
  }, []);

  const activeCount = vehicles.filter((v) => v.status === "Active").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "Maintenance").length;
  const inTransitCount = vehicles.filter((v) => v.status === "In Transit").length;
  const avgSafety = vehicles.length
    ? (vehicles.reduce((sum, v) => sum + (v.safetyScore || 0), 0) / vehicles.length).toFixed(1)
    : "-";

  const fleetSummary = [
    {
      title: "Vehicles Active",
      value: String(activeCount),
      subtitle: "Active on route",
      color: "#0f766e",
      icon: <Truck size={28} />,
    },
    {
      title: "In Maintenance",
      value: String(maintenanceCount),
      subtitle: "Scheduled service",
      color: "#9333ea",
      icon: <Wrench size={28} />,
    },
    {
      title: "In Transit",
      value: String(inTransitCount),
      subtitle: "Currently moving",
      color: "#2563eb",
      icon: <Clock3 size={28} />,
    },
    {
      title: "Avg Safety Score",
      value: `${avgSafety}/10`,
      subtitle: "Fleet compliance",
      color: "#22c55e",
      icon: <ShieldCheck size={28} />,
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="Fleet Operations" />

        <section className="cards">
          {fleetSummary.map((card, index) => (
            <div className="dashboard-card" key={index}>
              <div className="card-left">
                <p>{card.title}</p>
                <h2>{card.value}</h2>
                <span className="change">{card.subtitle}</span>
              </div>
              <div className="icon" style={{ background: card.color }}>
                {card.icon}
              </div>
            </div>
          ))}
        </section>

        <section className="dashboard-grid">
          <div className="panel large">
            <div className="panel-header">
              <h3>Vehicle Dispatch Board</h3>
            </div>
            <div className="status">
              {vehicles.length === 0 && (
                <div className="status-item"><p>No vehicles yet</p></div>
              )}
              {vehicles.map((vehicle) => (
                <div className="status-item" key={vehicle.id}>
                  <div>
                    <h4>{vehicle.vehicleNumber}</h4>
                    <p>{vehicle.route} · {vehicle.driverName}</p>
                  </div>
                  <div className="fleet-chip">
                    <span>{vehicle.status}</span>
                    <small>Safety: {vehicle.safetyScore ?? "-"}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Fleet Status Summary</h3>
            </div>
            <div className="status">
              <div className="status-item">
                <Truck size={24} />
                <div>
                  <h4>128</h4>
                  <p>On Route</p>
                </div>
              </div>
              <div className="status-item">
                <Clock3 size={24} />
                <div>
                  <h4>24</h4>
                  <p>Awaiting Dispatch</p>
                </div>
              </div>
              <div className="status-item">
                <Wrench size={24} />
                <div>
                  <h4>12</h4>
                  <p>In Maintenance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Maintenance Schedule</h3>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <span className="dot blue"></span>
                TR-2156 service check in 4h.
              </div>
              <div className="timeline-item">
                <span className="dot orange"></span>
                TR-1984 tire replacement tomorrow.
              </div>
              <div className="timeline-item">
                <span className="dot green"></span>
                TR-2222 inspection complete.
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Driver Alerts</h3>
            </div>
            <div className="message-list">
              <div className="message-item info">
                <div>
                  <h4>Route diversion alert</h4>
                  <p>Heavy rain on NH48. Update dispatch instructions.</p>
                </div>
                <span>1h ago</span>
              </div>
              <div className="message-item urgent">
                <div>
                  <h4>Fuel fill reminder</h4>
                  <p>TR-2031 needs fuel before next departure.</p>
                </div>
                <span>3h ago</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Fleet;
