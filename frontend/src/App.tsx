import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoriesPage from "./pages/CategoriesPage";
import QuizPage from "./pages/QuizPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";

function App() {
  return (
    <Router>
      {/* Definierar vilka komponenter som ska visas för respektive URL. */}
      <Routes>
        {/* Layout används som gemensam struktur runt sidornas innehåll. */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />

          {/* endast för användare */}
          {/* Dessa routes kräver att användaren är autentiserad. */}
          <Route element={<ProtectedRoute />}>
            <Route path="/categories" element={<CategoriesPage />} />

            {/* categoryId används för att identifiera vilken kategoris frågor som ska hämtas. */}
            <Route path="/quiz/:categoryId" element={<QuizPage />} />

            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>

          {/* Endast admin */}
          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* Visas om användaren går till en route som inte finns. */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
