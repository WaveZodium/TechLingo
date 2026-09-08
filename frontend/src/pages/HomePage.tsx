import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import heroImage from "../assets/productutanBox.png";
import "../styles/HomePage.css";
import { useAuth } from "../context/AuthContext";

type OutletContextType = {
  openAuthPanel: () => void;
};

function HomePage() {
  const { openAuthPanel } = useOutletContext<OutletContextType>();
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  function handleGetStarted() {
    if (isAuth) {
      navigate("/categories");
    } else {
      openAuthPanel();
    }
  }

  return (
    <section className="home">
      <div className="home__content">
        <div className="home__text">
          <h1 className="home__title">
            Understand Internet Culture
            <br />
            and IT-Abbreviations.
          </h1>

          <p className="home__description">
            TechLingo helps you understand internet culture, slang, and IT
            abbreviations in a simple and fun way.
          </p>

          <button
            type="button"
            className="home__cta"
            onClick={handleGetStarted}
          >
            <span>Get started</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="home__image-wrapper">
          <img
            src={heroImage}
            alt="TechLingo internet culture and IT abbreviations"
            className="home__image"
          />
        </div>
      </div>
    </section>
  );
}

export default HomePage;
