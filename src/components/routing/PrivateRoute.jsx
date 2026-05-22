// src/components/routing/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  // Show a loading state if Redux is still parsing localStorage
  if (loading) {
    return <div style={{ padding: "30px" }}>Verifying access...</div>;
  }

  // 1. Guard Rule: If not logged in, redirect straight to Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  // 2. Guard Rule: If roles are specified, ensure user's role matches
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they don't have the authorization, bounce them back to their own dashboard safely
    return <Navigate to="/dashboard" />;
  }

  // If they pass all checks, let them view the page!
  return children;
};

export default PrivateRoute;
