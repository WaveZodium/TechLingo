import { useEffect, useState } from "react";

import { getCategories } from "../api/categoryApi";
import CategoriesHeader from "../components/categories/CategoriesHeader";
import CategoryList from "../components/categories/CategoryList";
import type { Category } from "../types/category";

import "../styles/CategoriesPage.css";

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        setError(null);

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

  return (
    <section className="category">
      <div className="category__content">
        <CategoriesHeader />

        <CategoryList
          categories={categories}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </section>
  );
}

export default CategoriesPage;
