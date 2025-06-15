import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import QuizPage from "./pages/QuizPage";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import AdminResponsesPage from "./pages/AdminResponsesPage";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/quiz" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/admin-risposte" element={<AdminRoute><AdminResponsesPage /></AdminRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
