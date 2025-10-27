import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Home from "../pages/AlumnoPages/Home";
import BottomNav from "../components/BottomNav";
import Kids from "../pages/AlumnoPages/Kids";
import RegisterPage from "../pages/Register/RegisterPage";
import CalificacionesMovil from "../pages/AlumnoPages/CalificacionesMovil";
import CalendarioAsistencias from "../components/CalendarioAsistencias";
import Profesor from "../pages/ProfesorPages/Profesor";
import Sushi from "../pages/Sushi";

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
        <Route path="/profesor" element={<Profesor />} />
        <Route path="/sushi" element={<Sushi />} />

        {/* Ruta para cuando no se encuentra ninguna coincidencia */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
      <BottomNav />
    </div>
  );
}
