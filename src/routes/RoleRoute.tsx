
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const role = localStorage.getItem("role");

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/select" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;