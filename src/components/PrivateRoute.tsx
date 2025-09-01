import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) return null; // ou un spinner

  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  return children;
};

export default PrivateRoute;
