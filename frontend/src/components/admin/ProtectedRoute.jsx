import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(store => store.auth);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only allow recruiters for admin routes
  if (user.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;