import { useReveal } from '../hooks/useReveal';
import { BOLETIN_STATS } from '../data/staticData';

export default function Boletin() {
  return (
    <div className="dash-boletin">
      <div className="sec-header">
        <span className="sec-tag">Insight FABPSA · Junio 2026</span>
      </div>
      <div className="boletin-label">
        <i className="ti ti-news" /> Lo que dicen los números
      </div>
      <div className="boletin-grid">
        {BOLETIN_STATS.map((s, i) => <StatCard key={s.value} stat={s} delay={i} />)}
      </div>
    </div>
  );
}

function StatCard({ stat, delay }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`stat-card reveal d${(delay % 6) + 1} ${visible ? 'visible' : ''}`}
      style={{ '--sc': stat.color }}
    >
      <div className="stat-icon" style={{ color: stat.color }}>
        <i className={`ti ${stat.icon}`} />
      </div>
      <div className="stat-value">{stat.value}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}


