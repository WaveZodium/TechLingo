import { Link } from "react-router-dom";
import heroImage from "../assets/productutanBox.png";
import "../styles/HomePage.css";

function HomePage() {
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

          <Link to="/loginregister" className="home__cta">
            <span>Get started</span>
            <span aria-hidden="true">→</span>
          </Link>
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
