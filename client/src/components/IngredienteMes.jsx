import { INGREDIENTE_MES } from "../data/staticData";
import { useReveal } from "../hooks/useReveal";

export default function IngredienteMes() {
  const { ref, visible } = useReveal();

  /* return (
    <section
      ref={ref}
      className={`ingrediente-mes reveal ${visible ? 'visible' : ''}`}
    >

      <div className="ingrediente-header">
        <span className="ingrediente-tag">
          🌶️ Ingrediente del Mes
        </span>
      </div>

      <div
        className="ingrediente-card"
        style={{ '--accent': INGREDIENTE_MES.color }}
      >

        <div className="ingrediente-icon">
          <i className={`ti ${INGREDIENTE_MES.icono}`} />
        </div>

        <div className="ingrediente-content">

          <div className="ingrediente-categoria">
            {INGREDIENTE_MES.categoria}
          </div>

          <h3 className="ingrediente-titulo">
            {INGREDIENTE_MES.nombre}
          </h3>

          <p className="ingrediente-desc">
            {INGREDIENTE_MES.descripcion}
          </p>

          <div className="ingrediente-dato">
            💡 {INGREDIENTE_MES.dato}
          </div>

        </div>

      </div>

    </section>
  );*/
}
