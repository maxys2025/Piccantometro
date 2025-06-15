import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      const querySnapshot = await getDocs(collection(db, "domande"));
      const loadedQuestions = querySnapshot.docs.map(doc => doc.data());
      setQuestions(loadedQuestions);
    }
    fetchQuestions();
  }, []);

  const handleAnswer = async (selectedScore) => {
    const currentQuestion = questions[currentIndex];
    const rispostaScelta = currentQuestion.risposte.find(r => r.score === selectedScore);

    const selectedAnswer = {
      questionId: currentIndex + 1,
      questionText: currentQuestion.domanda,
      selectedScore,
      selectedText: rispostaScelta?.text || "N/A",
    };

    setScore(prev => prev + selectedScore);
    setUserAnswers(prev => [...prev, selectedAnswer]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);

      if (currentUser) {
        await addDoc(collection(db, "quizResponses"), {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          timestamp: serverTimestamp(),
          answers: [...userAnswers, selectedAnswer],
          totalScore: score + selectedScore
        });
      }
    }
  };

  // ✅ NUOVO sistema di premiazione
  const getPremioMessage = (score) => {
    if (score < 30) {
      return {
        livello: "Innocente",
        messaggio: "Curioso/a ma ancora nel mondo dei sogni 😇"
      };
    } else if (score < 40) {
      return {
        livello: "Timid*",
        messaggio: "Qualche pensierino malizioso lo hai 😉"
      };
    } else if (score < 50) {
      return {
        livello: "Monell* in erba",
        messaggio: "Hai rotto il ghiaccio e ti piace giocare 😏"
      };
    } else if (score < 60) {
      return {
        livello: "Audace",
        messaggio: "L’esperienza non ti manca 😈"
      };
    } else if (score < 70) {
      return {
        livello: "Scatenat*",
        messaggio: "Non hai limiti, segui i tuoi istinti 🔥"
      };
    } else {
      return {
        livello: "Diabolic*",
        messaggio: "Sei puro fuoco. Il sesso è il tuo sport 😈🔥"
      };
    }
  };

  // ✅ BLOCCO FINALE MODIFICATO
  if (questions.length === 0) {
    return <div style={styles.container}><p>Caricamento domande...</p></div>;
  }

  if (finished) {
    const { livello, messaggio } = getPremioMessage(score);

    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Hai completato il Piccantometro!</h1>
        <p style={styles.result}>Punteggio totale: <strong>{score}</strong></p>

        <div style={styles.premioBox}>
          <h3 style={styles.livello}>{livello}</h3>
          <p style={styles.messaggio}>{messaggio}</p>
        </div>

        <button style={styles.button} onClick={() => navigate("/")}>
          Torna alla Home
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Domanda {currentIndex + 1}</h2>
      <p style={styles.questionText}>{currentQuestion.domanda}</p>
      <div style={styles.answersContainer}>
        {currentQuestion.risposte.map((risposta, index) => (
          <button
            key={index}
            style={styles.answerButton}
            onClick={() => handleAnswer(risposta.score)}
          >
            {risposta.text}
          </button>
        ))}
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
    alignItems: "center"
  },
  title: {
    fontSize: "2rem",
    color: "#FFA500",
    marginBottom: "1rem"
  },
  questionText: {
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
    textAlign: "center"
  },
  answersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "400px"
  },
  answerButton: {
    backgroundColor: "#FFA500",
    color: "#000",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px"
  },
  result: {
    fontSize: "1.5rem",
    marginBottom: "1rem"
  },
  button: {
    backgroundColor: "#444",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  },
  premioBox: {
    backgroundColor: "#1e1e1e",
    padding: "1rem",
    borderRadius: "10px",
    border: "1px solid #FFA500",
    marginBottom: "1.5rem",
    maxWidth: "500px",
    textAlign: "center"
  },
  livello: {
    fontSize: "1.7rem",
    color: "#FFA500",
    marginBottom: "0.5rem"
  },
  messaggio: {
    fontSize: "1.2rem",
    fontStyle: "italic"
  }
};
