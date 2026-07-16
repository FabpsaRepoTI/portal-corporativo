import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import logoFabpsa from "../logo-fabpsa.png";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { theme, toggle } = useTheme();

  const { user, logout } = useAuth();
  //const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user?.name
    ? user.name
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [usd, setUsd] = useState(null);
  const [prevUsd, setPrevUsd] = useState(null);
  const [trend, setTrend] = useState(null);

  const [temp, setTemp] = useState(null);
  const [city, setCity] = useState("Ubicación");
  /*guardo el valo de la colonia */
  const [neighborhood, setNeighborhood] = useState("");
  const [weatherCode, setWeatherCode] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);

    window.addEventListener("scroll", fn, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const getRate = () => {
      fetch("https://fxapi.app/api/USD/MXN.json")
        .then((res) => res.json())
        .then((data) => {
          const newRate = data.rate;
          console.log(newRate);
          if (prevUsd !== null) {
            if (newRate > prevUsd) {
              setTrend("up");
            } else if (newRate < prevUsd) {
              setTrend("down");
            } else {
              setTrend(null);
            }
          }

          setPrevUsd(newRate);
          setUsd(newRate);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getRate();

    const interval = setInterval(getRate, 10000);

    return () => clearInterval(interval);
  }, []);

  /*useEffect(() => {
    console.log("ME renderice una vez");
  },[])

  console.log("me renderizo siempre");*/

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        console.log(lat);
        console.log(lon);

        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`,
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data);

            setTemp(Math.round(data.current.temperature_2m));
            setWeatherCode(data.current.weather_code);
          })
          .catch(console.error);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data);

            setCity(
              data.address.city || data.address.town || data.address.state,
            );

            setNeighborhood(
              data.address.suburb || data.address.neighbourhood || "",
            );
          })
          .catch(console.error);
      },
      (error) => {
        console.error(error);
      },
    );
  }, []);

  let weatherIcon = "ti ti-cloud";

  if (weatherCode === 0) {
    weatherIcon = "ti ti-sun";
  } else if ([1, 2].includes(weatherCode)) {
    weatherIcon = "ti ti-cloud-sun";
  } else if (weatherCode === 3) {
    weatherIcon = "ti ti-cloud";
  } else if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    weatherIcon = "ti ti-cloud-rain";
  } else if (weatherCode >= 95) {
    weatherIcon = "ti ti-cloud-storm";
  }

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      {/*<button className="navbar-logo" onClick={() => navigate("/")}>
        <div className="navbar-logo-img">
          <img src={logoFabpsa} alt="FABPSA" />
        </div>

        <div className="navbar-brand-text"></div>
      </button>*/}

      <li>
        <button
          className="directory-btn"
          onClick={() =>
            window.open(
              "http://201.151.218.138:3550/fabp/Directorio",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <i className="ti ti-address-book" />
          Directorio Corporativo
        </button>
      </li>

      {/*<div className="navbar-news">
        <div className="navbar-news-track">
          <span>🤖 Microsoft expande Copilot para empresas</span>
          <span>🔒 Nueva campaña de phishing detectada en LATAM</span>
          <span>🌶️ Crece la demanda de ingredientes naturales</span>
          <span>🏭 Industria 4.0 continúa acelerando la manufactura</span>
          <span>📊 La IA impulsa la productividad empresarial</span>
          <span>🤖 Microsoft expande Copilot para empresas</span>
          <span>🔒 Nueva campaña de phishing detectada en LATAM</span>
        </div>
      </div>*/}

      <div className="navbar-right">
        <div
          className="weather-chip"
          title={`${city}${neighborhood ? ` · ${neighborhood}` : ""}`}
        >
          <i className={weatherIcon} />
          <span>
            {temp ?? "--"}° · {city}
          </span>
        </div>

        <span className="brand-usd">
          💵 USD/MXN{" "}
          {usd !== null
            ? (Math.floor(usd * 100) / 100).toFixed(2)
            : "Cargando..."}
          {trend === "up" && " 🔺"}
          {trend === "down" && " 🔻"}
        </span>

        <div className="theme-toggle">
          <button
            className={`theme-btn ${theme === "dark" ? "active" : ""}`}
            onClick={() => toggle("dark")}
            title="Modo Oscuro"
          >
            <i className="ti ti-moon" />
          </button>

          <button
            className={`theme-btn ${theme === "light" ? "active" : ""}`}
            onClick={() => toggle("light")}
            title="Modo Claro"
          >
            <i className="ti ti-sun" />
          </button>
        </div>

        {/* ── USUARIO + DROPDOWN ── */}
        <div className="navbar-user" style={{ position: "relative" }}>
          <div
            className="navbar-user-trigger"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="navbar-user-avatar"
              />
            ) : (
              <div className="navbar-user-avatar navbar-user-initials">
                {initials}
              </div>
            )}
            <i
              className={`ti ${menuOpen ? "ti-chevron-up" : "ti-chevron-down"} navbar-user-chevron`}
            />
          </div>

          {menuOpen && (
            <>
              <div
                className="navbar-user-backdrop"
                onClick={() => setMenuOpen(false)}
              />
              <div className="navbar-user-dropdown">
                <div className="nud-head">
                  <div className="nud-avatar">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="nud-avatar-img"
                      />
                    ) : (
                      <div className="nud-avatar-initials">{initials}</div>
                    )}
                  </div>
                  <div className="nud-info">
                    <div className="nud-name">{user?.name ?? "Usuario"}</div>
                    <div className="nud-role">
                      {user?.role || user?.area || "Colaborador"}
                    </div>
                    <div className="nud-site">
                      <i className="ti ti-map-pin" style={{ fontSize: 10 }} />
                      {user?.sitio ?? ""}
                    </div>
                  </div>
                </div>

                <div className="nud-body">
                  <button className="nud-item">
                    <i className="ti ti-user" />
                    Mi perfil
                  </button>
                  <button className="nud-item">
                    <i className="ti ti-settings" />
                    Configuración
                  </button>
                  <div className="nud-sep" />
                  <button
                    className="nud-item nud-item-danger"
                    onClick={handleLogout}
                  >
                    <i className="ti ti-logout" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* 

*/
