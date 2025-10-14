import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Home from "../pages/Home";
import BottomNav from "../components/BottomNav";
import Kids from "../pages/Kids";
import RegisterPage from "../pages/Register/RegisterPage";
import CalificacionesMovil from "../pages/CalificacionesMovil";
import CalendarioAsistencias from "../components/CalendarioAsistencias";

export default function AppRouter() {
  return (
    <div>
      {/* Aquí puedes poner un Navbar fijo */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/calificaciones" element={<CalificacionesMovil />} />
        <Route path="/asistencias" element={<CalendarioAsistencias />} />

        {/* Ruta para cuando no se encuentra ninguna coincidencia */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
      <BottomNav />
    </div>
  );
}
