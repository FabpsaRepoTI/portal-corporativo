import { NavLink } from "react-router-dom";

const NAV_MAIN = [
  { to: "/", icon: "ti-home", label: "Inicio" },
  { to: "/aplicativos", icon: "ti-layout-grid", label: "Aplicativos" },
  {
    to: "http://201.151.218.138:3550/fabp/Directorio",
    icon: "ti-address-book",
    label: "Directorio",
    external: true,
  },
];

const NAV_OPS = [
  { to: "/cultura-digital", icon: "ti-bulb", label: "Cultura Digital" },
  {
    to: "/mesa-de-servicio",
    icon: "ti-headset",
    label: "Mesa de Servicio",
    badge: "Nuevo",
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo-mark">
        <i className="ti ti-building-factory-2" />
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-group">
          {NAV_MAIN.map((item) => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </ul>

        <div className="sidebar-divider" />
        <span className="sidebar-group-label">Operaciones</span>

        <ul className="sidebar-group">
          {NAV_OPS.map((item) => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SidebarItem({ to, icon, label, badge, external }) {
  if (external) {
    return (
      <li>
        <a href={to} target="_blank" rel="noreferrer" className="sidebar-link">
          <i className={`ti ${icon} sidebar-link-icon`} />
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
        <i className={`ti ${icon} sidebar-link-icon`} />
        <span className="sidebar-link-label">{label}</span>
        {badge && <span className="sidebar-badge-new">{badge}</span>}
      </NavLink>
    </li>
  );

  return (
    <li>
      <NavLink
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          "sidebar-link" + (isActive ? " sidebar-link--active" : "")
        }
      >
        <i className={`ti ${icon} sidebar-link-icon`} />
        <span className="sidebar-link-label">{label}</span>
        {badge && <span className="sidebar-badge-new">{badge}</span>}
      </NavLink>
    </li>
  );
}
