import { Link } from "react-router-dom";

interface AdminBreadcrumbProps {
  currentPage: string;
}

function AdminBreadcrumb({ currentPage }: AdminBreadcrumbProps) {
  return (
    <nav className="admin-breadcrumb" aria-label="Breadcrumb">
      <Link to="/admin" className="admin-breadcrumb__link">
        Admin panel
      </Link>

      <span className="admin-breadcrumb__separator" aria-hidden="true">
        /
      </span>

      <span className="admin-breadcrumb__current" aria-current="page">
        {currentPage}
      </span>
    </nav>
  );
}

export default AdminBreadcrumb;
