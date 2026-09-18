import { Link } from "react-router-dom";

import type { Category } from "../../types/category";
import { ArrowRightIcon } from "@phosphor-icons/react";

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
          <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default CategoryCard;
