import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoriesPage from "./pages/CategoriesPage";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AboutPage from "./pages/AboutPage";

// Admin pages
import AdminPage from "./pages/AdminPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminQuestionsPage from "./pages/admin/AdminQuestionsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

function App() {
  return (
    <Router>
      {/* Definierar vilka komponenter som ska visas för respektive URL. */}
      <Routes>
        {/* Layout används som gemensam struktur runt sidornas innehåll. */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />

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
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/questions" element={<AdminQuestionsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>

          {/* Visas om användaren går till en route som inte finns. */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
