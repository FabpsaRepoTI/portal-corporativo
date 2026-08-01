import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";

const API = "http://localhost:3001/api/notificaciones";

function agruparPorFecha(notifs) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);
  const semana = new Date(hoy);
  semana.setDate(semana.getDate() - 7);

  const grupos = { Hoy: [], Ayer: [], "Esta semana": [], Anteriores: [] };
  notifs.forEach((n) => {
    const f = new Date(n.fechaCreacion);
    f.setHours(0, 0, 0, 0);
    if (f >= hoy) grupos["Hoy"].push(n);
    else if (f >= ayer) grupos["Ayer"].push(n);
    else if (f >= semana) grupos["Esta semana"].push(n);
    else grupos["Anteriores"].push(n);
  });
  return grupos;
}

function tiempoRelativo(fecha) {
  const diff = Math.floor((Date.now() - new Date(fecha)) / 1000);
  if (diff < 60) return "Hace un momento";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return new Date(fecha).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

export function useNotifications() {
  const { user } = useContext(AuthContext);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [toastNotif, setToastNotif] = useState(null);

  const token = () => localStorage.getItem("fabpsa_token");
  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`,
  });

  const cargar = useCallback(async () => {
    try {
      const res = await fetch(`${API}?limite=50`, { headers: headers() });
      const json = await res.json();
      if (json.ok) {
        setNotifs(json.data);
        setUnread(json.data.filter((n) => !n.leida).length);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    cargar();

    const es = new EventSource(`${API}/stream?token=${token()}`);

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.tipo === "nueva_notificacion") {
        setNotifs((prev) => [data.notificacion, ...prev]);
        setUnread((prev) => prev + 1);
        setPulse(true);
        setTimeout(() => setPulse(false), 1000);
        setToastNotif(data.notificacion);
      }
    };

    es.onerror = () => es.close();
    return () => es.close();
  }, [user]);

  const marcarLeida = async (idNotificacion) => {
    await fetch(`${API}/${idNotificacion}/leer`, {
      method: "PATCH",
      headers: headers(),
    });
    setNotifs((prev) =>
      prev.map((n) =>
        n.idNotificacion === idNotificacion ? { ...n, leida: true } : n,
      ),
    );
    setUnread((prev) => Math.max(0, prev - 1));
  };

  const marcarTodas = async () => {
    await fetch(`${API}/leer-todas`, { method: "PATCH", headers: headers() });
    setNotifs((prev) => prev.map((n) => ({ ...n, leida: true })));
    setUnread(0);
  };

  const eliminar = async (idNotificacion) => {
    await fetch(`${API}/${idNotificacion}`, {
      method: "DELETE",
      headers: headers(),
    });
    const eliminada = notifs.find((n) => n.idNotificacion === idNotificacion);
    setNotifs((prev) =>
      prev.filter((n) => n.idNotificacion !== idNotificacion),
    );
    if (eliminada && !eliminada.leida)
      setUnread((prev) => Math.max(0, prev - 1));
  };

  return {
    notifs,
    grupos: agruparPorFecha(notifs),
    unread,
    loading,
    pulse,
    panelOpen,
    setPanelOpen,
    marcarLeida,
    marcarTodas,
    eliminar,
    tiempoRelativo,
    toastNotif,
    setToastNotif,
  };
}
