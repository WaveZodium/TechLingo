import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import OverviewPage from "./pages/OverviewPage";
import QuizPage from "./pages/QuizPage";

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
            <Route path="/overview" element={<OverviewPage />} />

            {/* categoryId används för att identifiera vilken kategoris frågor som ska hämtas. */}
            <Route path="/quiz/:categoryId" element={<QuizPage />} />
          </Route>

          {/* Visas om användaren går till en route som inte finns. */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
