import { useRef, useEffect } from "react";
import { useNotifications } from "../hooks/useNotifications";
import NotificationPanel from "./NotificationPanel";
import NotificationToast from "./NotificationToast";
import "./NotificationBell.css";

export default function NotificationBell() {
  const {
    grupos,
    unread,
    pulse,
    panelOpen,
    setPanelOpen,
    marcarLeida,
    marcarTodas,
    eliminar,
    tiempoRelativo,
    toastNotif,
    setToastNotif,
  } = useNotifications();

  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setPanelOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div className="nt-bell-wrap" ref={ref}>
        <button
          className="nt-bell-btn"
          onClick={() => setPanelOpen((p) => !p)}
          aria-label="Notificaciones"
        >
          <i className="ti ti-bell" aria-hidden="true" />
          {unread > 0 && (
            <span className={`nt-badge${pulse ? " nt-badge--pulse" : ""}`}>
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>

        {panelOpen && (
          <NotificationPanel
            grupos={grupos}
            marcarLeida={marcarLeida}
            marcarTodas={marcarTodas}
            eliminar={eliminar}
            tiempoRelativo={tiempoRelativo}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </div>

      {/* Toast fuera del bell-wrap para que no quede dentro del panel */}
      {toastNotif && (
        <NotificationToast
          notificacion={toastNotif}
          onClose={() => setToastNotif(null)}
        />
      )}
    </>
  );
}
