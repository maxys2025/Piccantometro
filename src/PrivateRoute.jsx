import './index.css'; //
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";

export default function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="flame"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}
