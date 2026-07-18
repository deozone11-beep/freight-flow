import { useState } from "react";
import "../css/dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Settings() {
  const getSettings = () => {
    try {
      return JSON.parse(localStorage.getItem("appSettings") || "null") || {};
    } catch {
      return {};
    }
  };

  const [settings, setSettings] = useState(() => ({
    language: "English (India)",
    timezone: "Asia/Kolkata",
    defaultDashboard: "Operations Dashboard",
    shipmentAlerts: true,
    maintenanceReminders: true,
    performanceSummaries: false,
    ...getSettings(),
  }));

  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem("appSettings", JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="Settings" />

        {saved && (
          <div style={{
            background: "rgba(34,197,94,0.15)",
            color: "#22c55e",
            padding: "10px 20px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            margin: "0 24px 12px 24px",
            fontWeight: 600,
          }}>
            ✓ Settings saved
          </div>
        )}

        <section className="settings-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Account Preferences</h3>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select
                value={settings.language}
                onChange={(e) => update("language", e.target.value)}
              >
                <option>English (India)</option>
                <option>English (US)</option>
                <option>हिन्दी</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <select
                value={settings.timezone}
                onChange={(e) => update("timezone", e.target.value)}
              >
                <option>Asia/Kolkata</option>
                <option>Asia/Dubai</option>
                <option>Europe/London</option>
              </select>
            </div>
            <div className="form-group">
              <label>Default Dashboard</label>
              <select
                value={settings.defaultDashboard}
                onChange={(e) => update("defaultDashboard", e.target.value)}
              >
                <option>Operations Dashboard</option>
                <option>Fleet Overview</option>
                <option>Warehouse Control</option>
              </select>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Notification Settings</h3>
            </div>
            <div className="form-group toggle-row">
              <span>Shipment alerts</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.shipmentAlerts}
                  onChange={(e) => update("shipmentAlerts", e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
            <div className="form-group toggle-row">
              <span>Maintenance reminders</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.maintenanceReminders}
                  onChange={(e) => update("maintenanceReminders", e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
            <div className="form-group toggle-row">
              <span>Performance summaries</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.performanceSummaries}
                  onChange={(e) => update("performanceSummaries", e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
