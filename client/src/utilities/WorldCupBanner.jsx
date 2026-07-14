export default function RadarBanner() {

  const noticias = [
    '📰 Microsoft expande Copilot para empresas',
    '🔒 Nueva campaña de phishing detectada en LATAM',
    '🌶️ Crece la demanda de ingredientes naturales',
    '🤖 La IA acelera la transformación digital',
    '🏭 Industria 4.0 sigue creciendo en manufactura'
  ];

  return (
    <section className="radar-banner">

      <div className="radar-info">

        <span>🌤️ 28°C</span>

        <span>💵 USD 18.92</span>

        <span>📅 16 Jun</span>

        <span>🔒 Riesgo Bajo</span>

      </div>

      <div className="ticker">

        <div className="ticker-track">

          {[...noticias, ...noticias].map((n, i) => (
            <span key={i} className="ticker-item">
              {n}
            </span>
          ))}

        </div>

      </div>

    </section>
  );
}