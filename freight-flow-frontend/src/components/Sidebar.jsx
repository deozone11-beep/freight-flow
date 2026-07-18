import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Warehouse,
  BarChart3,
  Settings,
  User,
  LogOut,
  ClipboardList,
  MapPinned,
  Boxes,
} from "lucide-react";

import "../css/sidebar.css";

const MENUS = {
  ADMIN: [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={22} /> },
    { name: "Logistics Control", path: "/logistics", icon: <ClipboardList size={22} /> },
    { name: "Parts Logistics", path: "/shipments", icon: <Package size={22} /> },
    { name: "Fleet", path: "/fleet", icon: <Truck size={22} /> },
    { name: "User Management", path: "/employees", icon: <Users size={22} /> },
    { name: "Warehouse Regions", path: "/warehouse", icon: <Warehouse size={22} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={22} /> },
    { name: "Profile", path: "/profile", icon: <User size={22} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={22} /> },
  ],
  WAREHOUSE_MANAGER: [
    { name: "Warehouse Control", path: "/manager", icon: <Boxes size={22} /> },
    { name: "Profile", path: "/profile", icon: <User size={22} /> },
  ],
  DRIVER: [
    { name: "My Tasks", path: "/driver", icon: <MapPinned size={22} /> },
    { name: "Profile", path: "/profile", icon: <User size={22} /> },
  ],
  CUSTOMER: [
    { name: "My Storage & Rentals", path: "/customer", icon: <Package size={22} /> },
    { name: "Profile", path: "/profile", icon: <User size={22} /> },
  ],
  COMPANY: [
    { name: "Request Deliveries", path: "/company", icon: <Truck size={22} /> },
    { name: "Profile", path: "/profile", icon: <User size={22} /> },
  ],
};

function Sidebar() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = MENUS[storedUser?.role] || MENUS.ADMIN;

  return (
    <aside className="sidebar">
      {/* Logo */}

      <div className="sidebar-logo">
        <img src={logo} alt="PhoneForge" className="logo-img" />

        <div className="logo-text">
          <h2>PhoneForge</h2>
          <p>Mobile Parts Ops</p>
        </div>
      </div>

      {/* Menu */}

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <span className="menu-icon">
              {item.icon}
            </span>

            <span className="menu-label">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Bottom */}

      <div className="sidebar-bottom">
        <div className="sidebar-profile-card" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
          <div className="avatar">
            {storedUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="profile-info">
            <h4>{storedUser?.fullName || "Admin"}</h4>
            <p>{storedUser?.role || "Operations Head"}</p>
          </div>
        </div>

        <button className="logout" onClick={handleLogout}>
          <LogOut size={20} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
