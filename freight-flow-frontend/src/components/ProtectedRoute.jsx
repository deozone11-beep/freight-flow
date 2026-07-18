import { Navigate } from "react-router-dom";
import { roleHome } from "../utils/roleHome";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If allowedRoles is specified, check if user's role is in the list
  if (allowedRoles && storedUser?.role && !allowedRoles.includes(storedUser.role)) {
    return <Navigate to={roleHome(storedUser.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
