import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleStartQuiz = () => {
    if (currentUser) {
      navigate("/quiz");
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={styles.container} className="flex flex-col items-center justify-center min-h-screen text-center bg-[#111] text-white px-4">
      <h1 style={styles.title}>
        Sei pront* a scoprire quanto sei piccante?
      </h1>
      <p style={styles.subtitle}>
        Fai subito il test del Piccantometro!
      </p>

      <button onClick={handleStartQuiz} style={styles.button}>
        Inizia il Quiz
      </button>

      {!currentUser && (
        <p className="mt-6 text-sm text-gray-300">
          Non hai un account?{" "}
          <span style={styles.linkStyle} onClick={() => navigate("/register")}>
            Registrati
          </span>
        </p>
      )}
    </div>
  );
};

export default HomePage;

const styles = {
  container: {
    backgroundColor: "#111",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    textAlign: "center"
  },
  fireEffect: {
    position: "relative",
    marginBottom: "1rem"
  },
  title: {
    color: "#FFA500",
    fontSize: "2.8rem",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem"
  },

  linkStyle: {
    color: '#FFA500',
    marginBottom: "2rem",
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: "pointer"
  },

  button: {
    backgroundColor: "#FFA500",
    color: "#000",
    padding: "14px 24px",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out"
  }
};