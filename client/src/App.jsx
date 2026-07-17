import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AplicativosPage from "./pages/AplicativosPage";
import CulturaDigitalPage from "./pages/CulturaDigitalPage";
import LoginPage from "./pages/LoginPage";
import MesaDeServicioPage from "./pages/mesaServicio/MesaDeServicioPage";
import HardwarePage from "./pages/mesaServicio/hardware/HardwarePage";
import HardwareSolicitudesPage from "./pages/mesaServicio/hardware/HardwareSolicitudesPage";
import ReporteIncidentePage from "./pages/mesaServicio/hardware/ReporteIncidentePage";
import SolicitudPage from "./pages/mesaServicio/SolicitudPage";
import PageLoader from "./components/PageLoader";
import "./App.css";

function AppLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <PageLoader>
                  <HomePage />
                </PageLoader>
              }
            />
            <Route
              path="/aplicativos"
              element={
                <PageLoader>
                  <AplicativosPage />
                </PageLoader>
              }
            />
            <Route
              path="/cultura-digital"
              element={
                <PageLoader>
                  <CulturaDigitalPage />
                </PageLoader>
              }
            />
            <Route
              path="/mesa-de-servicio"
              element={
                <PageLoader>
                  <MesaDeServicioPage />
                </PageLoader>
              }
            />
            <Route
              path="/mesa-de-servicio/hardware"
              element={
                <PageLoader>
                  <HardwarePage />
                </PageLoader>
              }
            />
            <Route
              path="/mesa-de-servicio/reporte-incidente"
              element={
                <PageLoader>
                  <ReporteIncidentePage />
                </PageLoader>
              }
            />
            <Route
              path="/mesa-de-servicio/hardware/solicitudes"
              element={
                <PageLoader>
                  <HardwareSolicitudesPage />
                </PageLoader>
              }
            />
            <Route
              path="/mesa-de-servicio/solicitud/:slug"
              element={
                <PageLoader>
                  <SolicitudPage />
                </PageLoader>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
