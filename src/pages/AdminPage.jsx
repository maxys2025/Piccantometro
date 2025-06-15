import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function AdminPage() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([{ text: "", score: 0 }]);
  const [questionsList, setQuestionsList] = useState([]);
  const [error, setError] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const addAnswerField = () => {
    if (answers.length < 4) {
      setAnswers([...answers, { text: "", score: 0 }]);
    }
  };

  const removeAnswerField = (index) => {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
  };

  const handleAnswerChange = (index, field, value) => {
    const updated = [...answers];
    updated[index][field] = field === "score" ? parseInt(value) : value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || answers.some((a) => !a.text || isNaN(a.score))) {
      setError("Compila tutti i campi prima di salvare.");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "domande", editingId), {
          domanda: question,
          risposte: answers,
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, "domande"), {
          domanda: question,
          risposte: answers,
        });
      }

      setQuestion("");
      setAnswers([{ text: "", score: 0 }]);
      setError("");
      fetchQuestions();
    } catch (err) {
      setError("Errore nel salvataggio: " + err.message);
    }
  };

  const fetchQuestions = async () => {
    const querySnapshot = await getDocs(collection(db, "domande"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setQuestionsList(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteDoc(doc(db, "domande", id));
      setQuestionsList(questionsList.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Errore nella cancellazione:", error);
    }
  };

  const handleEditQuestion = (q) => {
    setQuestion(q.domanda);
    setAnswers(q.risposte);
    setEditingId(q.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pannello Admin - Piccantometro</h1>

      {/* BOX 1: Inserimento */}
      <div style={styles.box}>
        <h2 style={styles.subtitle}>{editingId ? "Modifica la domanda" : "Inserisci una nuova domanda"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Scrivi la domanda..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.question}
          />
          {answers.map((answer, index) => (
            <div key={index} style={styles.answerGroup}>
              <input
                type="text"
                placeholder={`Risposta ${index + 1}`}
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, "text", e.target.value)}
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Punteggio"
                value={answer.score}
                onChange={(e) => handleAnswerChange(index, "score", e.target.value)}
                style={styles.input}
              />
              {answers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAnswerField(index)}
                  style={styles.removeBtn}
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          {answers.length < 4 && (
            <button type="button" onClick={addAnswerField} style={styles.addBtn}>
              + Aggiungi risposta
            </button>
          )}
          <button type="submit" style={styles.saveBtn}>
            {editingId ? "Aggiorna domanda" : "Salva domanda"}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>

      {/* BOX 2: Visualizza domande */}
      <div style={styles.box}>
        <h2 style={styles.subtitle}>
          <button onClick={() => setShowQuestions(!showQuestions)} style={styles.toggleBtn}>
            {showQuestions ? "Nascondi" : "Mostra"} domande caricate
          </button>
        </h2>
        {showQuestions && (
          <div style={styles.questionGrid}>
            {questionsList.map((q, i) => (
              <div key={q.id} style={styles.questionCard}>
                <p style={styles.questionText}><strong>{q.domanda}</strong></p>
                <ul>
                  {q.risposte.map((r, j) => (
                    <li key={j}>{r.text} → {r.score} punti</li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleEditQuestion(q)} style={styles.editBtn}>✏ Modifica</button>
                  <button onClick={() => handleDeleteQuestion(q.id)} style={styles.deleteBtn}>🗑 Elimina</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#111",
    color: "#fff",
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    color: "#FFA500",
    fontSize: "2rem",
    marginBottom: "1rem",
    textAlign: "center",
  },
  subtitle: {
    color: "#FFA500",
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  box: {
    backgroundColor: "#1e1e1e",
    padding: "1.5rem",
    borderRadius: "10px",
    marginBottom: "2rem",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    width: "100%",
  },
  question: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
  },
  answerGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  addBtn: {
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  removeBtn: {
    backgroundColor: "#FF5555",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#FFA500",
    color: "#000",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  toggleBtn: {
    backgroundColor: "#FFA500",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  questionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  questionCard: {
    backgroundColor: "#2c2c2c",
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "left",
    transition: "transform 0.2s",
    position: "relative",
  },
  questionText: {
    marginBottom: "0.5rem",
  },
  deleteBtn: {
    backgroundColor: "#ff4d4d",
    border: "none",
    borderRadius: "6px",
    color: "white",
    padding: "6px 10px",
    cursor: "pointer",
  },
  editBtn: {
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: "6px",
    color: "white",
    padding: "6px 10px",
    cursor: "pointer",
  },
};
