import { useState } from "react";
import { Bell, Megaphone } from "lucide-react"; // librería de íconos opcional

export default function NotificationIcon() {
  const [notifications, setNotifications] = useState(4); // Ejemplo

  return (
    <div className="relative inline-block bg-gray-100 rounded-full p-2 border-2 border-sky-300">
      {/* Icono */}
      <Megaphone size={38} className="text-gray-700" />

      {/* Badge (solo si hay notificaciones) */}
      {notifications > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-white  text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center 
        border-2 border-red-600 justify-center"
        >
          {notifications}
        </span>
      )}
    </div>
  );
}
