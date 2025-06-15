import React from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: "#FF5555",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: "1rem"
      }}
    >
      Esci
    </button>
  );
}
