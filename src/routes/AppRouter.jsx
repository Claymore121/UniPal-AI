import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import Home from "../pages/AlumnoPages/Home";
import BottomNav from "../components/BottomNav";
import Kids from "../pages/AlumnoPages/Kids";
import RegisterPage from "../pages/Register/RegisterPage";
import CalificacionesMovil from "../pages/AlumnoPages/CalificacionesMovil";
import CalendarioAsistencias from "../components/CalendarioAsistencias";
import Profesor from "../pages/ProfesorPages/Profesor";
import ConfigProfesor from "../pages/ProfesorPages/Config";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfesorBottomNav from "../components/ProfesorBottomNav";

export default function AppRouter() {
  return (
    <div>
      {/* Aquí puedes poner un Navbar fijo */}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />

        {/* Rutas protegidas para padres/tutores */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="PADRE_TUTOR">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home"
          element={
            <ProtectedRoute requiredRole="PADRE_TUTOR">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kids"
          element={
            <ProtectedRoute requiredRole="PADRE_TUTOR">
              <Kids />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calificaciones"
          element={
            <ProtectedRoute requiredRole="PADRE_TUTOR">
              <CalificacionesMovil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asistencias"
          element={
            <ProtectedRoute requiredRole="PADRE_TUTOR">
              <CalendarioAsistencias />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas para maestros */}
        <Route
          path="/profesor"
          element={
            <ProtectedRoute requiredRole="MAESTRO">
              <Profesor />
              {/* <ProfesorBottomNav /> */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profesor/config"
          element={
            <ProtectedRoute requiredRole="MAESTRO">
              <ConfigProfesor />
              {/* <ProfesorBottomNav /> */}
            </ProtectedRoute>
          }
        />

        {/* Ruta para cuando no se encuentra ninguna coincidencia */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
      <BottomNav />
    </div>
  );
}
