import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import heroImage from "../assets/productutanBox.png";
import "../styles/HomePage.css";
import { useAuth } from "../context/AuthContext";
import { ArrowRightIcon } from "@phosphor-icons/react";

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
            TechLingo makes tech language easier to understand — from internet
            culture and IT abbreviations to cybersecurity basics and programming
            languages.
            {/* TechLingo helps you understand internet culture, slang, and IT
            abbreviations in a simple and fun way. */}
          </p>

          <button
            type="button"
            className="home__cta"
            onClick={handleGetStarted}
          >
            <span>Get started</span>
            <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
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
