import { Link } from "react-router-dom";

import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__links">
          <Link to="/about">About</Link>

          <span className="footer__copy">
            <span className="sr-only">Copyright</span>

            <span className="footer__copyright-symbol" aria-hidden="true">
              ©
            </span>

            <span style={{ opacity: 0.75 }}>2026</span>

            <Link to="/">TechLingo</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
