import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

/*
 * This component returns the user to login page if the user object for auth is missing
 */

const PrivateRoute = () => {
  const user = useAuth();
  if (!user.user) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;

