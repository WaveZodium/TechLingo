import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/TechlingoALTlogo.png";
import "../../styles/Navbar.css";

interface NavbarProps {
  onLoginClick: () => void;
}

function Navbar({ onLoginClick }: NavbarProps) {
  const { isAuth, logoutUser } = useAuth();
  return (
    <header className="navbar">
      <div className="navbar__content">
        <Link to="/" className="navbar__logo-link" aria-label="TechLingo home">
          <img src={logo} alt="TechLingo" className="navbar__logo" />
        </Link>

        <nav className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
            Home
          </NavLink>

          {isAuth && (
            <>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""}`
                }
              >
                Categories
              </NavLink>
            </>
          )}
        </nav>

        {isAuth ? (
          <button onClick={logoutUser} className="navbar__login" type="button">
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
    </header>
  );
}

export default Navbar;
