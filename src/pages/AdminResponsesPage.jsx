import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Navbar from "../components/Navbar";

export default function AdminResponsesPage() {
  const [responses, setResponses] = useState([]);
  const [sortOption, setSortOption] = useState("timestamp");

  useEffect(() => {
    async function fetchResponses() {
      const q = query(collection(db, "quizResponses"), orderBy(sortOption, "desc"));
      const querySnapshot = await getDocs(q);
      const loaded = querySnapshot.docs.map(doc => doc.data());
      setResponses(loaded);
    }
    fetchResponses();
  }, [sortOption]);

  return (
    <div style={styles.container}>
      <div className="max-w-6xl w-full mx-auto">
        <h1 style={styles.title}>Risposte degli utenti</h1>

        <div style={styles.filterBox}>
          <label style={{ marginRight: "1rem" }}>Ordina per:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={styles.select}
          >
            <option value="timestamp">Data (più recente)</option>
            <option value="totalScore">Punteggio (più alto)</option>
          </select>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Punteggio Totale</th>
                <th style={styles.th}>Risposte</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((res, index) => (
                <tr key={index} style={styles.row}>
                  <td style={styles.td}>{res.userEmail}</td>
                  <td style={styles.td}>
                    {res.timestamp?.seconds
                      ? new Date(res.timestamp.seconds * 1000).toLocaleString()
                      : "N/A"}
                  </td>
                  <td style={styles.td}>{res.totalScore}</td>
                  <td style={{ ...styles.td, textAlign: "left" }}>
                    <ul style={styles.answerList}>
                      {res.answers?.map((ans, i) => (
                        <li key={i} style={styles.answerItem}>
                          <strong>{ans.questionText}</strong><br />
                          Risposta: <em>{ans.selectedText || "N/A"}</em> — Punti: {ans.selectedScore}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  },
  title: {
    fontSize: "2rem",
    color: "#FFA500",
    marginBottom: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  filterBox: {
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    color: "#fff",
  },
  select: {
    backgroundColor: "#222",
    color: "#FFA500",
    border: "1px solid #FFA500",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "16px",
    outline: "none",
    cursor: "pointer"
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  headerRow: {
    backgroundColor: "#FFA500",
    color: "#111",
  },
  th: {
    border: "1px solid #FFA500",
    padding: "12px",
    fontWeight: "bold",
    textAlign: "left",
  },
  td: {
    border: "1px solid #FFA500",
    padding: "10px",
    verticalAlign: "top",
  },
  row: {
    backgroundColor: "#1a1a1a",
  },
  answerList: {
    listStyle: "disc",
    paddingLeft: "1rem",
  },
  answerItem: {
    marginBottom: "0.5rem",
  },
};
