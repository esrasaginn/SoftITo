export default function Home({ setPage }) {
  return (
    <>
      <section className="hero">

        <div className="hero-content">

          <p className="hero-subtitle">
            Artemis Architecture & Interior
          </p>

          <h1>
            Mekanlara Estetik,
            Fonksiyon ve Kimlik Katıyoruz.
          </h1>

          <p className="hero-text">
            Konut, ofis, otel ve ticari alanlarda
            modern iç mimarlık çözümleri sunuyoruz.
          </p>

          <button
            className="hero-btn"
            onClick={() => setPage("projects")}
          >
            Projeleri İncele
          </button>

        </div>

      </section>
    </>
  );
}