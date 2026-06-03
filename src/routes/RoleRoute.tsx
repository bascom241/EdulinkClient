
import { Navigate, Outlet } from "react-router-dom";
import { getStoredRole } from "../features/auth/utils/authToken";

const RoleRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const role = getStoredRole();

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to={role ? "/dashboard" : "/select"} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
