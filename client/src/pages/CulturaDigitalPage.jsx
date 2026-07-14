import { useNavigate } from 'react-router-dom';

export default function CulturaDigitalPage() {
  const navigate = useNavigate();
  return (
    <div className="construccion-page">
      <div className="construccion-glow" />
      <div className="construccion-grid" />
      <div className="construccion-inner">
        <div className="const-icon"><i className="ti ti-bulb" /></div>
        <span className="const-eyebrow">Próximamente</span>
        <h1 className="const-title">Cultura Digital</h1>
        <p className="const-sub">
          Esta sección está en construcción.<br />
          Pronto encontrarás recursos, capacitaciones y contenido
          para impulsar la transformación digital en FABPSA.
        </p>
        <div className="const-tags">
          <span><i className="ti ti-device-laptop" /> Capacitaciones</span>
          <span><i className="ti ti-book" /> Recursos</span>
          <span><i className="ti ti-certificate" /> Certificaciones</span>
          <span><i className="ti ti-users" /> Comunidad</span>
        </div>
        <button className="btn-gold" onClick={() => navigate('/')}>
          <i className="ti ti-arrow-left" /> Volver al inicio
        </button>
      </div>
    </div>
  );
}
