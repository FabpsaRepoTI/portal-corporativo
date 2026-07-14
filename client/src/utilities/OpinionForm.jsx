import { useState } from "react";

const TOPICS = [
  { id: "ciberseguridad", label: "Ciberseguridad" },
  { id: "industria40", label: "Industria 4.0" },
  { id: "ia-trabajo", label: "IA en el trabajo" },
  { id: "condimentos", label: "Condimentos" },
  { id: "cultura", label: "Cultura general" },
  { id: "productividad", label: "Productividad" },
];

export default function OpinionForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [topics, setTopics] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleTopic = (id) => {
    setTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    if (!rating) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  };

  const ratingLabels = [
    "",
    "Deficiente",
    "Regular",
    "Buena",
    "Muy buena",
    "Excelente",
  ];

  if (submitted) {
    return (
      <div className="of-wrapper">
        <div className="of-card of-success">
          <div className="of-success-icon">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="24"
                r="23"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M14 24.5l7 7 13-14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="of-check-draw"
              />
            </svg>
          </div>
          <h2 className="of-success-title">Gracias por tu opinión</h2>
          <p className="of-success-sub">
            Tu voz da forma a la próxima edición. Nos vemos en quince días.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="of-wrapper">
      <div className="of-card">
        {/* Header */}
        <div className="of-header">
          <div className="of-eyebrow">Retroalimentación</div>
          <h2 className="of-title">¿Qué te pareció esta edición?</h2>
          <p className="of-subtitle">
            Tu opinión define los temas de la próxima quincena —{" "}
            <span className="of-accent">toma 30 segundos</span>
          </p>
        </div>

        <div className="of-divider" />

        {/* Body: two columns */}
        <div className="of-body">
          {/* Left: Rating */}
          <div className="of-col of-col-rating">
            <span className="of-label">¿Cómo calificarías esta edición?</span>

            <div className="of-stars" onMouseLeave={() => setHovered(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`of-star ${
                    n <= (hovered || rating) ? "of-star--active" : ""
                  }`}
                  onMouseEnter={() => setHovered(n)}
                  onClick={() => setRating(n)}
                  aria-label={`Calificación ${n}`}
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l2.9 6.26L22 9.27l-5 5.14 1.18 7.23L12 18.77l-6.18 2.87L7 14.41 2 9.27l7.1-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>

            <span
              className={`of-rating-label ${rating ? "of-rating-label--visible" : ""}`}
            >
              {ratingLabels[hovered || rating]}
            </span>
          </div>

          <div className="of-col-separator" />

          {/* Right: Topics */}
          <div className="of-col of-col-topics">
            <span className="of-label">
              ¿Qué temas te interesan para la próxima edición?
            </span>
            <div className="of-topics-grid">
              {TOPICS.map((topic) => {
                const checked = topics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    className={`of-topic ${checked ? "of-topic--checked" : ""}`}
                    onClick={() => toggleTopic(topic.id)}
                    aria-pressed={checked}
                  >
                    <span className="of-topic-box">
                      {checked && (
                        <svg
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="of-tick"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="of-topic-label">{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="of-divider" />

        {/* Footer */}
        <div className="of-footer">
          <button
            className={`of-submit ${submitting ? "of-submit--loading" : ""} ${
              !rating ? "of-submit--disabled" : ""
            }`}
            onClick={handleSubmit}
            disabled={!rating || submitting}
          >
            {submitting ? (
              <span className="of-spinner" />
            ) : (
              <>
                Enviar mi opinión
                <svg
                  className="of-arrow"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 10h12M11 5l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
          <span className="of-privacy">
            Tus respuestas son anónimas y se procesan internamente.
          </span>
        </div>
      </div>
    </div>
  );
}
