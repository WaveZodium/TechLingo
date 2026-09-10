import { Link } from "react-router-dom";

import type { Category } from "../../types/category";

type CategoryCardProps = {
  category: Category;
  index: number;
};

function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <article
      className="category__card"
      style={{
        animationDelay: `${index * -2}s`,
      }}
    >
      <div className="category__card-content">
        <h2 className="category__card-title">{category.name}</h2>

        <p className="category__card-description">{category.description}</p>

        <Link to={`/quiz/${category.id}`} className="category__button">
          <span>Start quiz</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default CategoryCard;
