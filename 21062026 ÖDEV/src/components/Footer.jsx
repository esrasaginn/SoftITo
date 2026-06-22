export default function Footer({ setPage }) {
  return (
    <>
      <footer className="footer">

        <div className="footer-logo">
          Artemis Architecture & Interior
        </div>

        <div className="footer-links">

          <span onClick={() => setPage("home")}>
            Anasayfa
          </span>

          <span onClick={() => setPage("about")}>
            Hakkımızda
          </span>

          <span onClick={() => setPage("projects")}>
            Projeler
          </span>

          <span onClick={() => setPage("offer")}>
            Teklif Al
          </span>

          <span onClick={() => setPage("contact")}>
            İletişim
          </span>

        </div>

        <p>
          © 2026 Artemis Architecture & Interior
        </p>

      </footer>
    </>
  );
}