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

function App() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
      <Route path="/shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
      <Route path="/shipments/domestic" element={<ProtectedRoute><DomesticShipment /></ProtectedRoute>} />
      <Route path="/shipments/international" element={<ProtectedRoute><InternationalShipment /></ProtectedRoute>} />
      <Route path="/fleet" element={<ProtectedRoute><Fleet /></ProtectedRoute>} />
      <Route path="/warehouse" element={<ProtectedRoute><Warehouse /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/company" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
      <Route path="/driver" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
      <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/logistics" element={<ProtectedRoute><AdminLogistics /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={storedUser ? roleHome(storedUser.role) : "/"} replace />} />

    </Routes>
  );
}

export default App;
