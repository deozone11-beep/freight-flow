import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../css/navbar.css";
import {
  Search,
  Bell,
  CalendarDays,
  Sun,
  Moon,
  UserCircle,
  LogOut
} from "lucide-react";

const sampleNotifications = [
  {
    title: "Supplier delay",
    message: "Component shipment from Korea is delayed by 6 hours.",
    time: "10 min ago",
  },
  {
    title: "Assembly alert",
    message: "Line 3 needs urgent calibration before next batch.",
    time: "30 min ago",
  },
  {
    title: "Dispatch ready",
    message: "Wholesale order PO-1021 is loaded and ready.",
    time: "2h ago",
  },
];

function Navbar({ title }) {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const [isLight, setIsLight] = useState(
    localStorage.getItem("theme") === "light"
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const notifyRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isLight ? "light" : "dark"
    );
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }, [isLight]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifyRef.current && !notifyRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="navbar">

      <div className="navbar-left">

        <h1>{title}</h1>

        <p>
          Welcome back! Here's today's logistics overview.
        </p>

      </div>

      <div className="navbar-right">

        {/* Search */}

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search shipments, vehicles..."
          />

        </div>

        {/* Date */}

        <div className="date-box">

          <CalendarDays size={18} />

          <span>{today}</span>

        </div>

        {/* Theme */}

        <button
          className="theme-btn"
          onClick={() => setIsLight((prev) => !prev)}
          title={isLight ? "Switch to dark mode" : "Switch to light mode"}
        >
          {isLight ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notification */}

        <div style={{ position: "relative" }} ref={notifyRef}>
          <button
            className="notify-btn"
            onClick={() => setShowNotifications((prev) => !prev)}
          >

            <Bell size={19} />

            <span>{sampleNotifications.length}</span>

          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: "300px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                zIndex: 500,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>
                Notifications
              </div>
              {sampleNotifications.map((n, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 16px",
                    borderBottom:
                      i !== sampleNotifications.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{n.title}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: "4px 0" }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}

        <div
          className="profile-box"
          onClick={() => navigate("/profile")}
        >
          <UserCircle size={42} />

          <div>
            <h4>{storedUser?.fullName || "Administrator"}</h4>
            <p>{storedUser?.role || "Operations Head"}</p>
          </div>
        </div>

        {/* Logout */}

        <button className="theme-btn" onClick={handleLogout} title="Log out">
          <LogOut size={18} />
        </button>

      </div>

    </header>
  );
}

export default Navbar;
