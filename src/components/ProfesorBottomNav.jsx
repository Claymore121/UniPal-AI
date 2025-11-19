import { NavLink, useNavigate } from "react-router-dom";
import { Settings, Home, FileText, Calendar, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

export default function ProfesorBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Solo mostrar en rutas del profesor
  if (!location.pathname.startsWith("/profesor")) {
    return null;
  }

  const handleConfigClick = () => {
    console.log("Navegando a /profesor/config");
    navigate("/profesor/config");
  };

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] 
               flex justify-around items-center h-16 z-50"
    >
      <NavLink
        to="/profesor"
        className={({ isActive }) =>
          [
            "flex flex-col items-center text-xs font-medium",
            "transition-all duration-200 ease-out",
            isActive
              ? "text-blue-600 scale-130 -translate-y-5 bg-blue-100 rounded-full p-2"
              : "text-gray-500 opacity-80 hover:opacity-100",
          ].join(" ")
        }
      >
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/profesor/calificaciones"
        className={({ isActive }) =>
          [
            "flex flex-col items-center text-xs font-medium",
            "transition-all duration-200 ease-out",
            isActive
              ? "text-orange-600 scale-130 -translate-y-5 bg-orange-100 rounded-full p-2"
              : "text-gray-500 opacity-80 hover:opacity-100",
          ].join(" ")
        }
      >
        <FileText size={22} />
        <span>Calificaciones</span>
      </NavLink>

      <NavLink
        to="/profesor/asistencias"
        className={({ isActive }) =>
          [
            "flex flex-col items-center text-xs font-medium",
            "transition-all duration-200 ease-out",
            isActive
              ? "text-green-600 scale-130 -translate-y-5 bg-green-100 rounded-full p-2"
              : "text-gray-500 opacity-80 hover:opacity-100",
          ].join(" ")
        }
      >
        <Calendar size={22} />
        <span>Asistencias</span>
      </NavLink>

      <button
        onClick={handleConfigClick}
        type="button"
        className={`flex flex-col items-center text-xs font-medium transition-all duration-200 ease-out ${
          location.pathname === "/profesor/config"
            ? "text-purple-600 scale-130 -translate-y-5 bg-purple-100 rounded-full p-2"
            : "text-gray-500 opacity-80 hover:opacity-100"
        }`}
      >
        <Settings size={22} />
        <span>Config</span>
      </button>
    </nav>
  );
}

