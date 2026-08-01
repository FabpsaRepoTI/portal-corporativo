import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationToast.css";

export default function NotificationToast({ notificacion, onClose }) {
  const navigate = useNavigate();
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSaliendo(true), 4000);
    const t2 = setTimeout(() => onClose(), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  function handleClick() {
    onClose();
    navigate(notificacion.urlDestino);
  }

  return (
    <div
      className={`nt-toast ${saliendo ? "nt-toast--out" : ""}`}
      onClick={handleClick}
    >
      <div
        className="nt-toast-icon"
        style={{ background: `${notificacion.colorHex}22` }}
      >
        <i
          className={`ti ti-${notificacion.icono}`}
          style={{ color: notificacion.colorHex }}
          aria-hidden="true"
        />
      </div>
      <div className="nt-toast-body">
        <div className="nt-toast-title">{notificacion.titulo}</div>
        <div className="nt-toast-desc">{notificacion.descripcion}</div>
      </div>
      <button
        className="nt-toast-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <i className="ti ti-x" aria-hidden="true" />
      </button>
    </div>
  );
}
