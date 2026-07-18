import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Employees from "./pages/Employees";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import DomesticShipment from "./pages/DomesticShipment";
import InternationalShipment from "./pages/InternationalShipment";
import Fleet from "./pages/Fleet";
import Warehouse from "./pages/Warehouse";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ResetPassword from "./pages/ResetPassword";
import CustomerDashboard from "./pages/CustomerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminLogistics from "./pages/AdminLogistics";
import ProtectedRoute from "./components/ProtectedRoute";
import { roleHome } from "./utils/roleHome";

const ADMIN_ROLES = ["ADMIN", "MANAGER", "STAFF"];
const ALL_ROLES = ["ADMIN", "MANAGER", "STAFF", "CUSTOMER", "COMPANY", "DRIVER", "WAREHOUSE_MANAGER"];

function App() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin-only pages */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Dashboard /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Employees /></ProtectedRoute>} />
      <Route path="/shipments" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Shipments /></ProtectedRoute>} />
      <Route path="/shipments/domestic" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><DomesticShipment /></ProtectedRoute>} />
      <Route path="/shipments/international" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><InternationalShipment /></ProtectedRoute>} />
      <Route path="/fleet" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Fleet /></ProtectedRoute>} />
      <Route path="/warehouse" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Warehouse /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><Reports /></ProtectedRoute>} />
      <Route path="/logistics" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminLogistics /></ProtectedRoute>} />

      {/* Shared pages — all roles can access */}
      <Route path="/settings" element={<ProtectedRoute allowedRoles={ALL_ROLES}><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={ALL_ROLES}><Profile /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute allowedRoles={ALL_ROLES}><ChangePassword /></ProtectedRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Role-specific dashboards */}
      <Route path="/customer" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/company" element={<ProtectedRoute allowedRoles={["COMPANY"]}><CompanyDashboard /></ProtectedRoute>} />
      <Route path="/driver" element={<ProtectedRoute allowedRoles={["DRIVER"]}><DriverDashboard /></ProtectedRoute>} />
      <Route path="/manager" element={<ProtectedRoute allowedRoles={["WAREHOUSE_MANAGER"]}><ManagerDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={storedUser ? roleHome(storedUser.role) : "/"} replace />} />
    </Routes>
  );
}

export default App;
