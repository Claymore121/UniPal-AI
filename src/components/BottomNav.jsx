import { NavLink } from "react-router-dom";
import {
  BarChart2,
  Calendar,
  Hammer,
  MoreHorizontal,
  Users,
  House,
  PencilLine,
} from "lucide-react";
import { useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const hiddenRoutes = ["/login", "/register"];

  if (hiddenRoutes.includes(location.pathname)) {
    return null; // No mostrar nada
  }

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] 
               flex justify-around items-center h-16 z-50"
    >
      {/* Herramientas */}
      <NavLink
        to="/tickets"
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
        <PencilLine size={22} />
        <span>Tickets</span>
      </NavLink>

      {/* Estadísticas */}
      <NavLink
        to="/Home"
        className={({ isActive }) =>
          [
            "flex flex-col items-center text-xs font-medium",
            "transition-all duration-200 ease-out",
            isActive
              ? "text-blue-600 scale-130 -translate-y-5 bg-sky-100 rounded-full p-2"
              : "text-gray-500 opacity-80 hover:opacity-100",
          ].join(" ")
        }
      >
        <House size={22} />
        <span>Home</span>
      </NavLink>

      {/* Hijos (botón central normal) */}
      <NavLink
        to="/Kids"
        className={({ isActive }) =>
          [
            "flex flex-col items-center text-xs font-medium",
            "transition-all duration-200 ease-out",
            isActive
              ? "text-blue-600 scale-130 -translate-y-5 bg-sky-100 rounded-full p-2"
              : "text-gray-500 opacity-80 hover:opacity-100",
          ].join(" ")
        }
      >
        <Users size={22} />
        <span>Hijos</span>
      </NavLink>

      {/* Asistencias */}
      <NavLink
        to="/*"
        className={({ isActive }) =>
          [
            "flex flex-col items-center text-xs font-medium",
            "transition-all duration-200 ease-out",
            isActive
              ? "text-blue-600 scale-130 -translate-y-5 bg-sky-100 rounded-full p-2"
              : "text-gray-500 opacity-80 hover:opacity-100",
          ].join(" ")
        }
      >
        <Calendar size={22} />
        <span>Asistencias</span>
      </NavLink>

      {/* Configuración */}
      <NavLink
        to="/login"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs font-medium ${
            isActive ? "text-blue-600" : "text-gray-500"
          }`
        }
      >
        <MoreHorizontal size={22} />
        <span>Config</span>
      </NavLink>
    </nav>
  );
}
