import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./../css/shipments.css";

function Shipments() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar title="Parts Logistics" />

        <div className="shipment-home">
          <div className="page-intro">
            <h1>📦 Parts Logistics</h1>
            <p>Manage global part imports and local wholesale dispatch for mobile phones.</p>
          </div>

          <div className="shipment-cards">
            <div
              className="shipment-card"
              onClick={() => navigate("/shipments/international")}
            >
              <h2>🌍 Global Imports</h2>
              <p>Track overseas components arriving for assembly.</p>
              <button>Open →</button>
            </div>

            <div
              className="shipment-card"
              onClick={() => navigate("/shipments/domestic")}
            >
              <h2>🏪 Local Dispatch</h2>
              <p>Coordinate finished phone deliveries to wholesale partners.</p>
              <button>Open →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shipments;