// src/components/ProtectedRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.user.role)) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
