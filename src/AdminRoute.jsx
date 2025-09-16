
import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user && user.isAdmin) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
