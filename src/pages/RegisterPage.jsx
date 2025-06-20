import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isOver18 = (date) => {
    const today = new Date();
    const birth = new Date(date);
    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    return age > 18 || (age === 18 && m >= 0);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!isOver18(birthdate)) {
      setError("Devi avere almeno 18 anni per registrarti.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Utente creato:", user.email);

      await setDoc(doc(db, "utenti", user.uid), {
        email: user.email,
        birthdate: birthdate,
        createdAt: new Date()
      });
      console.log("✅ Utente salvato su Firestore");

      // ✅ Redirect diretto al quiz
      navigate("/quiz");
    } catch (err) {
      let friendlyMessage = "Errore nella registrazione.";

      if (err.code === "auth/email-already-in-use") {
        friendlyMessage = "Errore: Email già in uso.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Errore: Email non valida.";
      } else if (err.code === "auth/weak-password") {
        friendlyMessage = "Errore: La password è troppo debole (minimo 6 caratteri).";
      }

      console.error("❌ Errore registrazione:", err);
      setError(friendlyMessage);
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.title}>Registrati a Piccantometro</h1>
      <form onSubmit={handleRegister} style={styles.form}>
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
        <input
          type="date"
          style={styles.input}
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Registrati</button>
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
    marginBottom: "1rem"
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
