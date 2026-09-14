import { useEffect, useState, type MouseEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { getLeaderboard } from "../../api/userApi";

import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { useQuiz } from "../../context/QuizContext";

import logo from "../../assets/TechlingoALTlogo.png";

import goldMedal from "../../assets/goldmedalTL.png";
import silverMedal from "../../assets/silvermedalTL.png";
import bronzeMedal from "../../assets/bronzemedalTL.png";

import "../../styles/Navbar.css";

interface NavbarProps {
  onLoginClick: () => void;
}

function Navbar({ onLoginClick }: NavbarProps) {
  const navigate = useNavigate();

  const { isAuth, role, logoutUser } = useAuth();
  const { profile } = useUser();

  const { isQuizActive, quitActiveSession } = useQuiz();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [leaderboardPosition, setLeaderboardPosition] = useState<number | null>(
    null,
  );

  useEffect(() => {
    async function loadLeaderboardPosition() {
      if (!isAuth || !profile || role === "Admin") {
        setLeaderboardPosition(null);
        return;
      }

      try {
        const leaderboard = await getLeaderboard();

        const position =
          leaderboard.findIndex((user) => user.username === profile.username) +
          1;

        if (position >= 1 && position <= 3) {
          setLeaderboardPosition(position);
        } else {
          setLeaderboardPosition(null);
        }
      } catch (error) {
        console.error("Failed to load leaderboard position:", error);

        setLeaderboardPosition(null);
      }
    }

    loadLeaderboardPosition();
  }, [isAuth, profile?.username, profile?.totalScore, role]);

  function getLeaderboardMedal() {
    switch (leaderboardPosition) {
      case 1:
        return goldMedal;

      case 2:
        return silverMedal;

      case 3:
        return bronzeMedal;

      default:
        return null;
    }
  }

  function getScoreRankClass() {
    switch (leaderboardPosition) {
      case 1:
        return "navbar__score--gold";

      case 2:
        return "navbar__score--silver";

      case 3:
        return "navbar__score--bronze";

      default:
        return "";
    }
  }

  const leaderboardMedal = getLeaderboardMedal();
  const scoreRankClass = getScoreRankClass();

  const handleNavigation = async (
    event: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (!isQuizActive) {
      setIsMenuOpen(false);
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

      setIsMenuOpen(false);

      navigate(path);
    } catch (error) {
      console.error("Failed to quit quiz before navigation:", error);
    }
  };

  const handleLogout = async () => {
    if (!isQuizActive) {
      setIsMenuOpen(false);
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

      setIsMenuOpen(false);

      logoutUser();
    } catch (error) {
      console.error("Failed to quit quiz before logout:", error);
    }
  };

  return (
    <>
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

          {/* Desktop navigation */}

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

            {isAuth && (
              <NavLink
                to="/profile"
                onClick={(event) => handleNavigation(event, "/profile")}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""}`
                }
              >
                Profile
              </NavLink>
            )}

            {isAuth && role === "Admin" && (
              <NavLink
                to="/admin"
                onClick={(event) => handleNavigation(event, "/admin")}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""}`
                }
              >
                Admin panel
              </NavLink>
            )}
          </nav>

          {/* Desktop actions */}

          <div className="navbar__actions">
            {isAuth && profile && (
              <div className={`navbar__score ${scoreRankClass}`}>
                {leaderboardMedal && (
                  <img
                    src={leaderboardMedal}
                    alt={`Leaderboard position ${leaderboardPosition}`}
                    className="navbar__medal"
                  />
                )}

                <span className="navbar__score-label">Total score:</span>

                <span className="navbar__score-value">
                  {profile.totalScore}
                </span>
              </div>
            )}

            {isAuth ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={(event) => handleNavigation(event, "/profile")}
                  className={({ isActive }) =>
                    `navbar__mobile-link ${
                      isActive ? "navbar__mobile-link--active" : ""
                    }`
                  }
                >
                  <svg
                    className="navbar__login-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                  </svg>
                </NavLink>

              <button
                onClick={handleLogout}
                className="navbar__login"
                type="button"
                >

                <span>Logout</span>
              </button>
                  </>
            ) : (
              <>
                <NavLink
                to="/profile"
                onClick={(event) => handleNavigation(event, "/profile")}
                className={({ isActive }) =>
                  `navbar__mobile-link ${
                    isActive ? "navbar__mobile-link--active" : ""
                  }`
                }
                >
                <svg
                  className="navbar__login-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                </svg>
                </NavLink>
                <button
                  onClick={onLoginClick}
                  className="navbar__login"
                  type="button"
                >

                  <span>Login</span>
                </button>
              </>
            )}
          </div>

          {/* Hamburger button */}

          <button
            className={`navbar__menu-button ${
              isMenuOpen ? "navbar__menu-button--open" : ""
            }`}
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile menu */}

      {isMenuOpen && (
        <nav className="navbar__mobile-menu">
          <div className="navbar__mobile-links">
            <NavLink
              to="/"
              onClick={(event) => handleNavigation(event, "/")}
              className={({ isActive }) =>
                `navbar__mobile-link ${
                  isActive ? "navbar__mobile-link--active" : ""
                }`
              }
            >
              Home
            </NavLink>

            {isAuth && (
              <NavLink
                to="/categories"
                onClick={(event) => handleNavigation(event, "/categories")}
                className={({ isActive }) =>
                  `navbar__mobile-link ${
                    isActive ? "navbar__mobile-link--active" : ""
                  }`
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
                  `navbar__mobile-link ${
                    isActive ? "navbar__mobile-link--active" : ""
                  }`
                }
              >
                Leaderboard
              </NavLink>
            )}

            {isAuth && (
              <NavLink
                to="/profile"
                onClick={(event) => handleNavigation(event, "/profile")}
                className={({ isActive }) =>
                  `navbar__mobile-link ${
                    isActive ? "navbar__mobile-link--active" : ""
                  }`
                }
              >
                Profile
              </NavLink>
            )}

            {isAuth && role === "Admin" && (
              <NavLink
                to="/admin"
                onClick={(event) => handleNavigation(event, "/admin")}
                className={({ isActive }) =>
                  `navbar__mobile-link ${
                    isActive ? "navbar__mobile-link--active" : ""
                  }`
                }
              >
                Admin panel
              </NavLink>
            )}
          </div>

          <div className="navbar__mobile-actions">
            {isAuth && profile && (
              <div
                className={`navbar__score navbar__score--mobile ${scoreRankClass}`}
              >
                {leaderboardMedal && (
                  <img
                    src={leaderboardMedal}
                    alt={`Leaderboard position ${leaderboardPosition}`}
                    className="navbar__medal"
                  />
                )}

                <span className="navbar__score-label">Total score:</span>

                <span className="navbar__score-value">
                  {profile.totalScore}
                </span>
              </div>
            )}

            {isAuth ? (
              <>

              <NavLink
                to="/profile"
                onClick={(event) => handleNavigation(event, "/profile")}
                className={({ isActive }) =>
                  `navbar__mobile-link ${
                    isActive ? "navbar__mobile-link--active" : ""
                  }`
                }
              >
                <svg
                  className="navbar__login-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                </svg>
              </NavLink>

                <button
                  type="button"
                  className="navbar__login navbar__mobile-login"
                  onClick={handleLogout}
                  >

                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
              <NavLink
                to="/profile"
                onClick={(event) => handleNavigation(event, "/profile")}
                className={({ isActive }) =>
                  `navbar__mobile-link ${
                    isActive ? "navbar__mobile-link--active" : ""
                  }`
                }
              >
                <svg
                  className="navbar__login-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                </svg>
              </NavLink>
              <button
                type="button"
                className="navbar__login navbar__mobile-login"
                onClick={() => {
                  setIsMenuOpen(false);
                  onLoginClick();
                }}
                >

                <span>Login</span>
              </button>
                </>
            )}
          </div>
        </nav>
      )}
    </>
  );
}

export default Navbar;
