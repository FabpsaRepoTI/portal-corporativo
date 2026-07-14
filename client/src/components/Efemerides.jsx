import { useReveal } from '../hooks/useReveal';
import { EFEMERIDES } from '../data/staticData';

export default function Efemerides() {
  const { ref, visible } = useReveal();
  return (
    <div className="dash-efe" ref={ref}>
      <div className="sec-header">
        <span className="sec-tag">Junio 2026</span>
      </div>
      <ul className={`efe-list reveal ${visible ? 'visible' : ''}`}>
        {EFEMERIDES.map((e) => (
          <li key={e.day + e.title} className="efe-row">
            <span className="efe-num">{e.day}</span>
            <div className="efe-body">
              <div className="efe-title">{e.title}</div>
              <div className="efe-desc">{e.desc}</div>
              <span className="efe-pill">{e.tag}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
