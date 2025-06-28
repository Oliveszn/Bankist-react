import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface CheckAuthProps {
  isAuthenticated: boolean;
  children: ReactNode;
}
const CheckAuth = ({ isAuthenticated, children }: CheckAuthProps) => {
  const location = useLocation();

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return <Navigate to="dashboard/" />;
  }

  // If user is not authenticated and tries to access admin routes, redirect to login
  if (!isAuthenticated && location.pathname.includes("/dashboard")) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default CheckAuth;
