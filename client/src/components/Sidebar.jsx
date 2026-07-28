import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import logoFabpsa from "../logo-fabpsa.png";

const NAV_SECTIONS = [
  {
    label: "General",
    items: [{ to: "/", icon: "ti-home", label: "Inicio" }],
  },
  {
    label: "Mesa de Servicio",
    items: [
      {
        to: "/mesa-de-servicio",
        icon: "ti-device-laptop",
        label: "Mesa de Servicio",
        color: "#10b981",
      },
    ],
  },
  {
    label: "Recursos",
    items: [
      { to: "/aplicativos", icon: "ti-layout-grid", label: "Aplicativos" },
      {
        to: "http://201.151.218.138:3550/fabp/Directorio",
        icon: "ti-address-book",
        label: "Directorio",
        external: true,
      },
      {
        to: "/cultura-digital",
        icon: "ti-bulb",
        label: "Cultura Digital",
      },
    ],
  },
];

export default function Sidebar() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark",
  );

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
  };

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".sb-help-card")) setSupportOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sb-logo-area">
        <div className="sidebar-logo-mark">
          <img className="logoFabpsa" src={logoFabpsa} alt="FABPSA" />
        </div>
        <div className="sb-logo-text">
          <span className="sb-logo-name">FABPSA</span>
          <span className="sb-logo-sub">Mesa de Servicio</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="sb-section">
            <span className="sidebar-group-label">{section.label}</span>
            <ul className="sidebar-group">
              {section.items.map((item) => (
                <SidebarItem key={item.to} {...item} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-bottom-inner">
          <div style={{ position: "relative" }}>
            <div className="sb-help-card">
              <div className="sb-help-card-header">
                <span className="sb-help-ico">
                  <i className="ti ti-headset" />
                </span>
                <span className="sb-help-card-title">¿Necesitas ayuda?</span>
              </div>
              <p className="sb-help-card-desc">
                Nuestro equipo está listo para asistirte.
              </p>
              <button
                className="sb-help-btn"
                onClick={() => setSupportOpen((v) => !v)}
              >
                <i className="ti ti-message-circle" />
                Contactar a soporte
                <i
                  className={`ti ${supportOpen ? "ti-chevron-up" : "ti-chevron-down"} sb-help-chev`}
                />
              </button>
            </div>

            <div className={`sb-support-popover${supportOpen ? " open" : ""}`}>
              <div className="sb-pop-label">Selecciona tu sitio</div>

              <a
                className="sb-support-pop-item"
                href="https://teams.microsoft.com/l/chat/0/0?users=jorge.gonzalez@fabpsa.com.mx"
                target="_blank"
                rel="noreferrer"
                onClick={() => setSupportOpen(false)}
              >
                <div
                  className="sb-pop-avatar"
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    color: "#059669",
                  }}
                >
                  JG
                </div>
                <div>
                  <div className="sb-pop-site">Planta</div>
                  <div className="sb-pop-name">Jorge González</div>
                </div>
                <i className="ti ti-arrow-right sb-pop-arrow" />
              </a>

              <a
                className="sb-support-pop-item"
                href="https://teams.microsoft.com/l/chat/0/0?users=lizbet.hernandez@fabpsa.com.mx"
                target="_blank"
                rel="noreferrer"
                onClick={() => setSupportOpen(false)}
              >
                <div
                  className="sb-pop-avatar"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    color: "#2563eb",
                  }}
                >
                  LH
                </div>
                <div>
                  <div className="sb-pop-site">Sur 121</div>
                  <div className="sb-pop-name">Lizbet Hernández J.</div>
                </div>
                <i className="ti ti-arrow-right sb-pop-arrow" />
              </a>
            </div>
          </div>

          <div className="sb-theme-row">
            <i
              className={`ti ${darkMode ? "ti-moon" : "ti-sun"} sb-theme-icon`}
            />
            <span className="sb-theme-label">
              {darkMode ? "Modo oscuro" : "Modo claro"}
            </span>
            <button
              className={`sb-theme-toggle${darkMode ? " on" : ""}`}
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              role="switch"
              aria-checked={darkMode}
            >
              <span className="sb-theme-knob" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ to, icon, label, badge, external, color }) {
  if (external) {
    return (
      <li>
        <a href={to} target="_blank" rel="noreferrer" className="sidebar-link">
          <span className="sb-icon-wrap">
            <i className={`ti ${icon} sidebar-link-icon`} />
          </span>
          <span className="sidebar-link-label">{label}</span>
        </a>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          "sidebar-link" + (isActive ? " sidebar-link--active" : "")
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="sb-icon-wrap"
              style={
                color && isActive ? { background: `${color}18`, color } : {}
              }
            >
              <i className={`ti ${icon} sidebar-link-icon`} />
            </span>
            <span className="sidebar-link-label">{label}</span>
            {badge && <span className="sidebar-badge-new">{badge}</span>}
          </>
        )}
      </NavLink>
    </li>
  );
}
