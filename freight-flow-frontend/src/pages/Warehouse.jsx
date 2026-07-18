import { useState, useEffect } from "react";
import "../css/dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getWarehouseRegions } from "../api/warehouse";
import { getDashboardStats } from "../api/dashboard";

function Warehouse() {
  const [storage, setStorage] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getWarehouseRegions()
      .then(setStorage)
      .catch(() => {});
    getDashboardStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const totalStock = storage.reduce((sum, r) => sum + (r.componentStock || 0), 0);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="Spare Parts Warehouse" />

        <section className="cards">
          <div className="dashboard-card">
            <div className="card-left">
              <p>Warehouse Regions</p>
              <h2>{storage.length || "-"}</h2>
              <span className="change">Live from server</span>
            </div>
            <div className="icon" style={{ background: "#9333ea" }}>
              W
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-left">
              <p>Component Stock</p>
              <h2>{totalStock.toLocaleString()}</h2>
              <span className="change">Spare parts available</span>
            </div>
            <div className="icon" style={{ background: "#2563eb" }}>
              S
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-left">
              <p>Total Vehicles</p>
              <h2>{stats ? stats.totalVehicles : "-"}</h2>
              <span className="change">Fleet count from server</span>
            </div>
            <div className="icon" style={{ background: "#0f766e" }}>
              I
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-left">
              <p>Total Orders</p>
              <h2>{stats ? stats.totalDomesticDispatches + stats.totalInternationalImports : "-"}</h2>
              <span className="change">Domestic + International</span>
            </div>
            <div className="icon" style={{ background: "#ea580c" }}>
              D
            </div>
          </div>
        </section>

        <section className="warehouse-options">
          <div className="dashboard-card">
            <div className="card-left">
              <p>Electricals</p>
              <h2>Mobile Phone Spare Parts</h2>
              <span className="change">Import and stock critical components</span>
            </div>
            <div className="icon" style={{ background: "#2563eb" }}>
              E
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-left">
              <p>Mechanical</p>
              <h2>Assembly & Packing</h2>
              <span className="change">Build phones and prep wholesale loads</span>
            </div>
            <div className="icon" style={{ background: "#0f766e" }}>
              M
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Inventory Snapshot</h3>
            </div>
            <div className="status">
              <div className="status-item">
                <div>
                  <h4>12,340</h4>
                  <p>Parts in storage</p>
                </div>
              </div>
              <div className="status-item">
                <div>
                  <h4>3,210</h4>
                  <p>Units ready for assembly</p>
                </div>
              </div>
              <div className="status-item">
                <div>
                  <h4>82%</h4>
                  <p>Quality compliance rate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Storage Health</h3>
            </div>
            <div className="status">
              {storage.length === 0 && (
                <div className="status-item"><p>No regions yet</p></div>
              )}
              {storage.map((item) => (
                <div className="status-item" key={item.id}>
                  <div>
                    <h4>{item.region}</h4>
                    <p>{item.occupancyPercent}% occupancy</p>
                  </div>
                  <span>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Distribution Pipeline</h3>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <span className="dot blue"></span>
                18 component shipments arriving from overseas suppliers.
              </div>
              <div className="timeline-item">
                <span className="dot green"></span>
                Assembly batch 24 completed and moved to packing.
              </div>
              <div className="timeline-item">
                <span className="dot orange"></span>
                Wholesale boxes loaded for delivery to retail partners.
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Warehouse Notes</h3>
            </div>
            <div className="message-list">
              <div className="message-item info">
                <div>
                  <h4>Component QC passed</h4>
                  <p>Electrical parts batch from Korea cleared inspection.</p>
                </div>
                <span>45m ago</span>
              </div>
              <div className="message-item urgent">
                <div>
                  <h4>Packing line ready</h4>
                  <p>Mechanical assembly is complete for 120 phones.</p>
                </div>
                <span>2h ago</span>
              </div>
            </div>
          </div>
        </section>

        <section className="warehouse-options">
          <div className="dashboard-card">
            <div className="card-left">
              <p>Electricals</p>
              <h2>Mobile Phone Spare Parts</h2>
              <span className="change">Import and stock electrical components</span>
            </div>
            <div className="icon" style={{ background: "#2563eb" }}>
              E
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-left">
              <p>Mechanical</p>
              <h2>Phone Assembly & Transport</h2>
              <span className="change">Manage assembly, setup, and logistics</span>
            </div>
            <div className="icon" style={{ background: "#0f766e" }}>
              M
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Warehouse;
