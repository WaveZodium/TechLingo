import type { MouseEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { useQuiz } from "../../context/QuizContext";

import logo from "../../assets/TechlingoALTlogo.png";

import "../../styles/Navbar.css";

interface NavbarProps {
  onLoginClick: () => void;
}

function Navbar({ onLoginClick }: NavbarProps) {
  const navigate = useNavigate();

  const { isAuth, role, logoutUser } = useAuth();
  const { profile } = useUser();

  const { isQuizActive, quitActiveSession } = useQuiz();

  const handleNavigation = async (
    event: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (!isQuizActive) {
      return;
    }

    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to quit? Your quiz progress will be lost.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await quitActiveSession();

      navigate(path);
    } catch (error) {
      console.error("Failed to quit quiz before navigation:", error);
    }
  };

  const handleLogout = async () => {
    if (!isQuizActive) {
      logoutUser();
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to quit? Your quiz progress will be lost.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await quitActiveSession();

      logoutUser();
    } catch (error) {
      console.error("Failed to quit quiz before logout:", error);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__content">
        <Link
          to="/"
          onClick={(event) => handleNavigation(event, "/")}
          aria-label="TechLingo home"
          className="navbar__logo-link"
        >
          <img src={logo} alt="TechLingo" className="navbar__logo" />
        </Link>

        <nav className="navbar__links">
          <NavLink
            to="/"
            onClick={(event) => handleNavigation(event, "/")}
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
            Home
          </NavLink>

          {isAuth && (
            <NavLink
              to="/categories"
              onClick={(event) => handleNavigation(event, "/categories")}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              Categories
            </NavLink>
          )}

          {isAuth && (
            <NavLink
              to="/leaderboard"
              onClick={(event) => handleNavigation(event, "/leaderboard")}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              Leaderboard
            </NavLink>
          )}

          {isAuth &&
            (role === "Admin" ? (
              <NavLink
                to="/admin"
                onClick={(event) => handleNavigation(event, "/admin")}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""}`
                }
              >
                Admin panel
              </NavLink>
            ) : (
              <NavLink
                to="/profile"
                onClick={(event) => handleNavigation(event, "/profile")}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""}`
                }
              >
                Profile
              </NavLink>
            ))}
        </nav>

        <div className="navbar__actions">
          {isAuth && profile && (
            <div className="navbar__score">
              <span className="navbar__score-label">Totalscore:</span>

              <span className="navbar__score-value">{profile.totalScore}</span>
            </div>
          )}

          {isAuth ? (
            <button
              onClick={handleLogout}
              className="navbar__login"
              type="button"
            >
              <svg
                className="navbar__login-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
              </svg>

              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="navbar__login"
              type="button"
            >
              <svg
                className="navbar__login-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
              </svg>

              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
