import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import "../css/cards.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ShipmentChart from "../components/ShipmentChart";
import { getDashboardStats } from "../api/dashboard";
import { getDomesticShipments } from "../api/domesticShipments";

import {
  Truck,
  Package,
  Warehouse,
  Users,
  TrendingUp,
  CircleCheck,
  Clock3,
  TriangleAlert,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [dispatches, setDispatches] = useState([]);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {});
    getDomesticShipments()
      .then((data) => setDispatches(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  const cards = [
    {
      title: "Warehouse Regions",
      value: stats ? String(stats.warehouseRegions) : "-",
      change: "Live from server",
      color: "#2563eb",
      icon: <Package size={28} />,
    },
    {
      title: "Component Stock",
      value: stats ? stats.totalComponentStock.toLocaleString() : "-",
      change: "Live from server",
      color: "#0f766e",
      icon: <Warehouse size={28} />,
    },
    {
      title: "Total Employees",
      value: stats ? String(stats.totalEmployees) : "-",
      change: "Live from server",
      color: "#9333ea",
      icon: <Users size={28} />,
    },
    {
      title: "Wholesale Orders",
      value: stats ? String(stats.totalDomesticDispatches + stats.totalInternationalImports) : "-",
      change: "Live from server",
      color: "#ea580c",
      icon: <Truck size={28} />,
    },
  ];

  const inbox = [
    {
      title: "Supplier delay",
      description: "Component shipment from Korea is delayed by 6 hours.",
      time: "10 min ago",
      status: "info",
    },
    {
      title: "Assembly alert",
      description: "Line 3 needs urgent calibration before next batch.",
      time: "30 min ago",
      status: "urgent",
    },
    {
      title: "Quality pass",
      description: "New batch of phone housings passed inspection.",
      time: "1h ago",
      status: "update",
    },
    {
      title: "Dispatch ready",
      description: "Wholesale order PO-1021 is loaded and ready.",
      time: "2h ago",
      status: "alert",
    },
  ];

  const departments = [
    { name: "Procurement", info: "Manage supplier shipments" },
    { name: "Production", info: "Run assembly lines" },
    { name: "Quality", info: "Oversee inspection" },
    { name: "Logistics", info: "Coordinate dispatch" },
    { name: "Support", info: "Manage customer handoff" },
  ];

  const departmentActions = [
    "Select action",
    "View team",
    "Assign task",
    "Open dashboard",
    "Review metrics",
  ];

  const [departmentSelection, setDepartmentSelection] = useState(
    Array(departments.length).fill("Select action")
  );

  const handleDepartmentChange = (index, event) => {
    const updated = [...departmentSelection];
    updated[index] = event.target.value;
    setDepartmentSelection(updated);
  };

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar title="Manufacturing Dashboard" />

        {/* KPI CARDS */}

        <section className="cards">
          {cards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              change={card.change}
              color={card.color}
              icon={card.icon}
            />
          ))}
        </section>

        {/* CHART + FLEET */}

        <section className="dashboard-grid">

          <div className="panel large">

            <div className="panel-header">
              <h3>Production Performance</h3>
            </div>

            <ShipmentChart />

          </div>

          <div className="panel">

            <div className="panel-header">
              <h3>Transport Fleet</h3>
            </div>

            <div className="status">

              <div className="status-item">

                <CircleCheck color="#22c55e" size={24} />

                <div>
                  <h4>{stats ? stats.vehiclesActive : "-"}</h4>
                  <p>Vehicles Active</p>
                </div>

              </div>

              <div className="status-item">

                <Clock3 color="#f59e0b" size={24} />

                <div>
                  <h4>{stats ? stats.totalVehicles - stats.vehiclesActive - stats.vehiclesInMaintenance : "-"}</h4>
                  <p>In Transit</p>
                </div>

              </div>

              <div className="status-item">

                <TriangleAlert color="#ef4444" size={24} />

                <div>
                  <h4>{stats ? stats.vehiclesInMaintenance : "-"}</h4>
                  <p>Maintenance</p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* TABLE + BUSINESS */}

        <section className="bottom-grid">

          <div className="panel">

            <div className="panel-header">
              <h3>Wholesale Orders</h3>
            </div>

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {dispatches.length > 0 ? dispatches.map((d) => (
                  <tr key={d.id}>
                    <td>{d.orderId}</td>
                    <td>{d.wholesalePartner}</td>
                    <td>
                      <span className={`badge ${d.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} style={{ opacity: 0.6 }}>No dispatches yet</td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          <div className="panel">

            <div className="panel-header">
              <h3>Business Growth</h3>
            </div>

            <div className="growth">

              <TrendingUp
                size={60}
                color="#22c55e"
              />

              <h1>+18.4%</h1>

              <p>Compared to last month</p>

            </div>

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="quick-grid">

          <div className="panel">

            <div className="panel-header">
              <h3>Quick Actions</h3>
            </div>

            <div className="action-buttons">

              <button onClick={() => navigate("/shipments/international")}>➕ Add Component Batch</button>

              <button onClick={() => navigate("/warehouse")}>🛠️ Warehouse Overview</button>

              <button onClick={() => navigate("/shipments/domestic")}>📦 Create Wholesale Order</button>

              <button onClick={() => navigate("/reports")}>📊 View Reports</button>

            </div>

          </div>

          <div className="panel">

            <div className="panel-header">
              <h3>Departments</h3>
            </div>

            <div className="department-list">
              {departments.map((dept, index) => (
                <div className="department-item" key={dept.name}>
                  <div>
                    <h4>{dept.name}</h4>
                    <p>{dept.info}</p>
                  </div>
                  <select
                    value={departmentSelection[index]}
                    onChange={(event) => handleDepartmentChange(index, event)}
                  >
                    {departmentActions.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

          </div>

        </section>

        <section className="inbox-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Operations Inbox</h3>
            </div>

            <div className="message-list">
              {inbox.map((item, index) => (
                <div className={`message-item ${item.status}`} key={index}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                  <span>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}

export default Dashboard;