import { useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useQuiz } from "../../context/QuizContext";

import "../../styles/Footer.css";

function Footer() {
  const navigate = useNavigate();

  const { isQuizActive, quitActiveSession } = useQuiz();

  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = async (
    event: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (!isQuizActive) {
      return;
    }

    event.preventDefault();

    if (isNavigating) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to quit? Your quiz progress will be lost.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsNavigating(true);

      await quitActiveSession();

      navigate(path);
    } catch (error) {
      console.error("Failed to quit quiz before navigation:", error);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__links">
          <Link
            to="/about"
            onClick={(event) => handleNavigation(event, "/about")}
          >
            About
          </Link>

          <span className="footer__copy">
            <span className="sr-only">Copyright</span>

            <span className="footer__copyright-symbol" aria-hidden="true">
              ©
            </span>

            <span style={{ opacity: 0.75 }}>2026</span>

            <Link to="/" onClick={(event) => handleNavigation(event, "/")}>
              TechLingo
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
