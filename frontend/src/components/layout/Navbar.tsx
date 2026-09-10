import { Link, NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";

import logo from "../../assets/TechlingoALTlogo.png";

import "../../styles/Navbar.css";

interface NavbarProps {
  onLoginClick: () => void;
}

function Navbar({ onLoginClick }: NavbarProps) {
  const { isAuth, role, logoutUser } = useAuth();
  const { profile } = useUser();

  const location = useLocation();

  const isQuizActive = location.pathname.startsWith("/quiz/");

  return (
    <header className="navbar">
      <div className="navbar__content">
        <Link
          to="/"
          onClick={(event) => {
            if (isQuizActive) {
              event.preventDefault();
            }
          }}
          aria-label="TechLingo home"
          aria-disabled={isQuizActive}
          tabIndex={isQuizActive ? -1 : 0}
          className={`navbar__logo-link ${
            isQuizActive ? "navbar__logo-link--disabled" : ""
          }`}
        >
          <img src={logo} alt="TechLingo" className="navbar__logo" />
        </Link>

        <nav className="navbar__links">
          <NavLink
            to="/"
            onClick={(event) => {
              if (isQuizActive) {
                event.preventDefault();
              }
            }}
            aria-disabled={isQuizActive}
            tabIndex={isQuizActive ? -1 : 0}
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""} ${
                isQuizActive ? "navbar__link--disabled" : ""
              }`
            }
          >
            Home
          </NavLink>

          {isAuth && (
            <NavLink
              to="/categories"
              onClick={(event) => {
                if (isQuizActive) {
                  event.preventDefault();
                }
              }}
              aria-disabled={isQuizActive}
              tabIndex={isQuizActive ? -1 : 0}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""} ${
                  isQuizActive ? "navbar__link--disabled" : ""
                }`
              }
            >
              Categories
            </NavLink>
          )}

          {isAuth &&
            (role === "Admin" ? (
              <NavLink
                to="/admin"
                onClick={(event) => {
                  if (isQuizActive) {
                    event.preventDefault();
                  }
                }}
                aria-disabled={isQuizActive}
                tabIndex={isQuizActive ? -1 : 0}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""} ${
                    isQuizActive ? "navbar__link--disabled" : ""
                  }`
                }
              >
                Admin panel
              </NavLink>
            ) : (
              <NavLink
                to="/profile"
                onClick={(event) => {
                  if (isQuizActive) {
                    event.preventDefault();
                  }
                }}
                aria-disabled={isQuizActive}
                tabIndex={isQuizActive ? -1 : 0}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""} ${
                    isQuizActive ? "navbar__link--disabled" : ""
                  }`
                }
              >
                Profile
              </NavLink>
            ))}
        </nav>

        <div className="navbar__actions">
          {isAuth && profile && (
            <div className="navbar__score">
              <span className="navbar__score-label">Userscore:</span>

              <span className="navbar__score-value">{profile.totalScore}</span>
            </div>
          )}

          {isAuth ? (
            <button
              onClick={logoutUser}
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
