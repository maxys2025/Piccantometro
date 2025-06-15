import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";

export default function AdminRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  const adminEmail = "tony_2oo9@hotmail.it"; // Sostituisci con la tua vera email

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/login" />;
  }

  return children;
}
