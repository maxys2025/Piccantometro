import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/quiz");
    } catch (err) {
      setError("Credenziali non valide. Riprova.");
    }
  };



  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Accedi a Piccantometro</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Accedi</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#111",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem"
  },
  title: {
    color: "#FFA500",
    marginBottom: "1rem",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px"
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px"
  },
  button: {
    backgroundColor: "#FFA500",
    color: "#000",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  error: {
    color: "red",
    marginTop: "10px"
  }
};
