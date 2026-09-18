import { Link } from "react-router-dom";
import "../../styles/AdminBreadcrumb.css";
import { CaretRight } from "@phosphor-icons/react";

interface AdminBreadcrumbProps {
  currentPage: string;
}

function AdminBreadcrumb({ currentPage }: AdminBreadcrumbProps) {
  return (
    <nav className="admin-breadcrumb" aria-label="Breadcrumb">
      <Link to="/admin" className="admin-breadcrumb__link">
        Admin panel
      </Link>

      <CaretRight
        className="admin-breadcrumb__separator"
        size={18}
        weight="bold"
        aria-hidden="true"
      />

      <span className="admin-breadcrumb__current" aria-current="page">
        {currentPage}
      </span>
    </nav>
  );
}

export default AdminBreadcrumb;
