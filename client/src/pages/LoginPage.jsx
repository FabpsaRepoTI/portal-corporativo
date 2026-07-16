import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService, saveSession } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import logo from "../logo-fabpsa.png";
import "./Loggin.css";

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginService(loginInput, password);
      saveSession(data.token, data.user);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.error || "Error de conexión. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="login-root">
        {/* ── LADO IZQUIERDO — Formulario ── */}
        <div className="login-left">
          <div className="login-brand">
            <div className="login-brand-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="login-brand-name">Portal Corporativo</span>
          </div>

          <h1 className="login-heading">Bienvenido</h1>
          <p className="login-sub">
            Ingresa tus credenciales corporativas
            <br />
            para acceder al portal.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Usuario */}
            <div className="login-field">
              <label className="login-label">Usuario</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Ej. PFV7315"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value.toUpperCase())}
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="login-field">
              <label className="login-label">Contraseña</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  className="login-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Botón */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="login-spinner" /> : "Iniciar sesión"}
            </button>
          </form>

          <p className="login-footer">
            ¿Problemas para acceder?{" "}
            <span className="login-footer-link">Contacta a Sistemas</span>
          </p>
        </div>

        {/* ── LADO DERECHO — Visual ── */}
        <div className="login-right">
          <div className="login-right-orb1" />
          <div className="login-right-orb2" />
          <div className="login-right-orb3" />

          {/* Esferas flotantes decorativas */}
          <div
            className="orb-float"
            style={{
              width: 80,
              height: 80,
              top: "12%",
              left: "15%",
              background:
                "radial-gradient(circle at 35% 35%, rgba(45,212,202,0.6), rgba(10,107,101,0.3))",
              animationDuration: "5s",
              boxShadow: "0 8px 32px rgba(45,212,202,0.2)",
            }}
          />
          <div
            className="orb-float"
            style={{
              width: 44,
              height: 44,
              top: "20%",
              right: "18%",
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15), rgba(45,212,202,0.1))",
              animationDuration: "7s",
              animationDelay: "1s",
            }}
          />
          <div
            className="orb-float"
            style={{
              width: 120,
              height: 120,
              bottom: "18%",
              right: "12%",
              background:
                "radial-gradient(circle at 35% 35%, rgba(45,212,202,0.25), rgba(10,107,101,0.1))",
              animationDuration: "6s",
              animationDelay: "2s",
              boxShadow: "0 8px 40px rgba(45,212,202,0.15)",
            }}
          />
          <div
            className="orb-float"
            style={{
              width: 28,
              height: 28,
              bottom: "30%",
              left: "20%",
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2), transparent)",
              animationDuration: "4s",
              animationDelay: "0.5s",
            }}
          />
          <div
            className="orb-float"
            style={{
              width: 60,
              height: 60,
              top: "55%",
              left: "10%",
              background:
                "radial-gradient(circle at 35% 35%, rgba(45,212,202,0.2), transparent)",
              animationDuration: "8s",
              animationDelay: "3s",
            }}
          />

          {/* Logo + glow */}
          <div className="login-logo-wrap">
            <div className="login-logo-glow" />
            <img src={logo} alt="FABPSA" className="login-logo-img" />
          </div>

          {/* Texto de bienvenida */}
          <div className="login-welcome-text">
            <div className="login-welcome-tag">Nuevo · 2026</div>
            <h2 className="login-welcome-title">
              Bienvenido al nuevo
              <br />
              Portal Corporativo
              <br />
              <span>FABPSA</span>
            </h2>
            <p className="login-welcome-sub">
              Tu espacio de trabajo digital. Accede a sistemas, comunicados y
              recursos desde un solo lugar.
            </p>
          </div>

          {/* Dots decorativos */}
          <div className="login-dots">
            <div className="login-dot on" />
            <div className="login-dot" />
            <div className="login-dot" />
          </div>
        </div>
      </div>
    </>
  );
}
