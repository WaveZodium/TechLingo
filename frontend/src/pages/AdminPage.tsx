import { Link } from "react-router-dom";

import "../styles/AdminPage.css";

function AdminPage() {
  return (
    <section className="admin">
      <div className="admin__content">
        <header className="admin__header">
          <h1 className="admin__title">Admin panel</h1>

          <p className="admin__description">
            Manage the content and users that keep TechLingo running smoothly.
          </p>
        </header>

        <div className="admin__cards">
          <article className="admin__card">
            <div className="admin__card-content">
              <h2 className="admin__card-title">Manage categories</h2>

              <p className="admin__card-description">
                Create, update and organize the quiz categories available to
                players.
              </p>

              <Link
                to="/admin/categories"
                className="button-primary admin__button"
              >
                <span>Categories</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </article>

          <article className="admin__card">
            <div className="admin__card-content">
              <h2 className="admin__card-title">Manage questions</h2>

              <p className="admin__card-description">
                Add and maintain questions and answer options for every quiz.
              </p>

              <Link
                to="/admin/questions"
                className="button-primary admin__button"
              >
                <span>Questions</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </article>

          <article className="admin__card">
            <div className="admin__card-content">
              <h2 className="admin__card-title">Manage users</h2>

              <p className="admin__card-description">
                View users, update their roles and keep accounts up to date.
              </p>

              <Link to="/admin/users" className="button-primary admin__button">
                <span>Users</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;
