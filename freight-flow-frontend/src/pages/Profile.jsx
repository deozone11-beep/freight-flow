import { useEffect, useState } from "react";
import "../css/dashboard.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../api/auth";
import { User, Mail, Shield, MapPin, Phone, Calendar } from "lucide-react";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUserData)
      .catch(() => {});
  }, []);

  const displayUser = userData || storedUser || {};

  const roleLabels = {
    ADMIN: "Administrator",
    MANAGER: "Manager",
    STAFF: "Staff",
    CUSTOMER: "Customer",
    COMPANY: "Company",
    DRIVER: "Driver",
    WAREHOUSE_MANAGER: "Warehouse Manager",
  };

  const inbox = [
    {
      title: "Pending approval",
      message: "Your profile change request needs review.",
      time: "5m ago",
    },
    {
      title: "New assignment",
      message: "You have been assigned to the Mumbai logistics plan.",
      time: "25m ago",
    },
    {
      title: "Password reminder",
      message: "Update your account password every 90 days.",
      time: "1h ago",
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar title="User Profile" />

        <section className="profile-grid">
          <div className="panel profile-card">
            <div className="panel-header">
              <h3>{roleLabels[displayUser.role] || displayUser.role || "User"}</h3>
            </div>
            <div className="profile-details">
              <p>
                <User size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
                <strong>Name:</strong> {displayUser.fullName || "—"}
              </p>
              <p>
                <Shield size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
                <strong>Username:</strong> {displayUser.username || "—"}
              </p>
              <p>
                <Mail size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
                <strong>Role:</strong> {roleLabels[displayUser.role] || displayUser.role || "—"}
              </p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Inbox & Alerts</h3>
            </div>
            <div className="message-list">
              {inbox.map((item, index) => (
                <div className="message-item info" key={index}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.message}</p>
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

export default Profile;
