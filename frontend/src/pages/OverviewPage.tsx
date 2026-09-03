import { Link } from "react-router-dom";
import "../styles/OverviewPage.css";

const categories = [
  {
    id: 1,
    title: "Internet culture",
    description:
      "Learn popular internet abbreviations used across social media, chats and memes.",
    path: "/quiz",
  },
  {
    id: 2,
    title: "IT abbreviations",
    description:
      "Explore common IT abbreviations used in tech, networking and programming.",
    path: "/quiz",
  },
];

function OverviewPage() {
  return (
    <section className="overview">
      <div className="overview__content">
        <div className="overview__header">
          <h1 className="overview__title">Choose a category</h1>

          <p className="overview__description">
            Pick a topic you want to master. Each quiz is fun, fast and packed
            with useful knowledge!
          </p>
        </div>

        <div className="overview__categories">
          {categories.map((category, index) => (
            <article
              className="overview__card"
              key={category.id}
              style={{
                animationDelay: `${index * -2}s`,
              }}
            >
              <div className="overview__card-content">
                <h2 className="overview__card-title">{category.title}</h2>

                <p className="overview__card-description">
                  {category.description}
                </p>

                <Link to={category.path} className="overview__button">
                  <span>Start quiz</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OverviewPage;
