import "../css/dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Settings() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="Settings" />

        <section className="settings-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Account Preferences</h3>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select>
                <option>English (India)</option>
                <option>English (US)</option>
                <option>हिन्दी</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <select>
                <option>Asia/Kolkata</option>
                <option>Asia/Dubai</option>
                <option>Europe/London</option>
              </select>
            </div>
            <div className="form-group">
              <label>Default Dashboard</label>
              <select>
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
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
            <div className="form-group toggle-row">
              <span>Maintenance reminders</span>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
            <div className="form-group toggle-row">
              <span>Performance summaries</span>
              <label className="toggle-switch">
                <input type="checkbox" />
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
