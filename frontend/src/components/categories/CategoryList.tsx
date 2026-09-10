import type { Category } from "../../types/category";
import CategoryCard from "./CategoryCard";

type CategoryListProps = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
};

function CategoryList({ categories, isLoading, error }: CategoryListProps) {
  return (
    <div className="category__categories">
      {isLoading && <p>Loading categories...</p>}

      {error && <p>{error}</p>}

      {!isLoading &&
        !error &&
        categories.map((category, index) => (
          <CategoryCard category={category} index={index} key={category.id} />
        ))}
    </div>
  );
}

export default CategoryList;
