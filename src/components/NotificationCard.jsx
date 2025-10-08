import React from "react";
import { getTypeClasses } from "../styles/notificationStyles";
import { FaCheckDouble } from "react-icons/fa";

// aqui iran los props cuando haya bd xd
const NotificationCard = ({
  id,
  title,
  message,
  time,
  read = false,
  type = "default",
  icon = "🔔",
  onToggleRead,
}) => {
  const t = getTypeClasses(type);

  return (
    <article
      className={[
        "p-3 rounded-lg border-l-4 shadow-sm transition hover:shadow-md",
        t.bg,
        t.border,
        read ? "opacity-45" : "opacity-100",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <span className={`text-xl leading-none ${t.icon}`} aria-hidden="true">
          {icon}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${t.title}`}>{title}</h3>
            {!read ? (
              <span
                className="inline-block w-2 h-2 rounded-full bg-current"
                title="No leído"
              />
            ) : (
              <FaCheckDouble className="text-blue-500" title="Leído" />
            )}
          </div>

          <p className="text-sm text-gray-700 mt-1">{message}</p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{time}</span>

            {typeof onToggleRead === "function" && (
              <button
                onClick={() => onToggleRead(id, !read)}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 underline underline-offset-2"
              >
                {read ? "Marcar como no leído" : "Marcar como leído"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default NotificationCard;
