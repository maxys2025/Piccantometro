import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Errore nel logout:", error);
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* 🔥 Logo cliccabile */}
      <h1 style={styles.logo} onClick={() => navigate("/")}>
        🔥 <span style={styles.logoText}>Piccantometro</span>
      </h1>

      {/* 👤 Info utente o pulsanti login */}
      <div style={styles.rightSide}>
        {currentUser ? (
          <>
            <span style={styles.userInfo}>
              👤 <span style={styles.emailText}>{currentUser.email}</span>
            </span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Esci
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} style={styles.loginButton}>
              Accedi
            </button>
            <button onClick={() => navigate("/register")} style={styles.registerButton}>
              Registrati
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "1rem 2rem",
    display: "flex",
    flexWrap: "wrap", // 👈 permette di andare a capo su mobile
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem"
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#FFA500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  logoText: {
    color: "#FFA500"
  },
  rightSide: {
    display: "flex",
    flexWrap: "wrap", // 👈 per non rompere layout
    alignItems: "center",
    gap: "1rem"
  },
  userInfo: {
    fontSize: "0.9rem",
    color: "#ccc",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem"
  },
  emailText: {
    maxWidth: "150px", // 👈 limita la larghezza
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "inline-block"
  },
  logoutButton: {
    backgroundColor: "#FFA500",
    color: "#000",
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  loginButton: {
    backgroundColor: "#FFA500",
    color: "#000",
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  registerButton: {
    backgroundColor: "#333",
    color: "#FFA500",
    padding: "8px 14px",
    border: "1px solid #FFA500",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};
