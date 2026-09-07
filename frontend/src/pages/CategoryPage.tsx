import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/CategoryPage.css";

import { getCategories } from "../api/categoryApi";
import type { Category } from "../types/category";

function CategoryPage() {
  // Sparar kategorierna som hämtas från backend.
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hämtar kategorier när sidan laddas första gången.
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setError("Could not load categories.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  // Visas medan kategorierna hämtas från backend.
  if (isLoading) {
    return (
      <section className="category">
        <div className="category__content">
          <p>Loading categories...</p>
        </div>
      </section>
    );
  }

  // Visas om hämtningen av kategorier misslyckas.
  if (error) {
    return (
      <section className="category">
        <div className="category__content">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="category">
      <div className="category__content">
        <div className="category__header">
          <h1 className="category__title">Choose a category</h1>

          <p className="category__description">
            Pick a topic you want to master. Each quiz is fun, fast and packed
            with useful knowledge!
          </p>
        </div>

        <div className="category__categories">
          {/* Skapar ett kort för varje kategori som hämtats från backend. */}
          {categories.map((category, index) => (
            <article
              className="category__card"
              key={category.id}
              style={{
                animationDelay: `${index * -2}s`,
              }}
            >
              <div className="category__card-content">
                <h2 className="category__card-title">{category.name}</h2>

                <p className="category__card-description">
                  {category.description}
                </p>

                {/* Skickar kategori-id i URL:en så att QuizPage kan hämta rätt frågor. */}
                <Link to={`/quiz/${category.id}`} className="category__button">
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

export default CategoryPage;
