import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
  const user = useAuth();
  if (!user.user) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;

