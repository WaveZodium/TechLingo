import "../styles/AboutPage.css";

function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-card">
        <span className="about-card__label">ABOUT</span>

        <h1>About TechLingo</h1>

        <p>
          TechLingo is a quiz-based learning platform for anyone who wants to
          improve their knowledge of common tech terms and concepts.
        </p>

        <p>
          Choose a category, answer questions and earn points as you learn. Your
          results are saved to your profile and your score can be compared with
          other users on the leaderboard.
        </p>

        <div className="about-card__divider" />

        <p className="about-card__small">
          Built as a student project using React, .NET and MongoDB.
        </p>
      </section>
    </main>
  );
}

export default AboutPage;
