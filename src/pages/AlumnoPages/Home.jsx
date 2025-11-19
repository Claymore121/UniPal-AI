import React, { useState, useRef, useEffect } from "react";
import faceuser from "../../assets/user1.png";
import {
  ChevronDown,
  Bell,
  OctagonAlert,
  BadgeCheck,
  TriangleAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationCard from "../../components/NotificationCard";
import NotificationIcon from "../../components/NotificationIcon";
import Modal from "../../components/Modal";
import api from "../../services/api";

const DISMISS_MS = 2300;

const Home = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReuniones, setIsOpeReuniones] = useState(false);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // ids ocultos SOLO en el feed (no afecta al modal)
  const [hideFeed, setHideFeed] = useState({});
  const timeoutsRef = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notifs, hijos, profile] = await Promise.all([
          api.getNotificaciones().catch(() => []),
          api.getHijos().catch(() => []),
          api.getProfile().catch(() => null),
        ]);
        
        // Transformar notificaciones del backend al formato esperado
        const transformedNotifs = notifs.map((n) => ({
          id: n.id,
          title: n.titulo,
          message: n.mensaje,
          time: new Date(n.createdAt).toLocaleDateString('es-MX'),
          read: n.leida,
          type: n.tipo,
          icon: n.icono || "🔔",
        }));
        
        setNotifications(transformedNotifs);
        setAlumnos(hijos);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error cargando datos:", error);
        // En caso de error, usar datos mock como fallback
        const { default: notificationsData } = await import("../../data/dataNotification");
        const { Alumnos: AlumnosMock } = await import("../../data/dataNotification");
        setNotifications(notificationsData);
        setAlumnos(AlumnosMock);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
      timeoutsRef.current = {};
    };
  }, []);

  // ——— Manejadores ———
  const handleToggleReadFeed = async (id, nextRead) => {
    // Actualizar estado local inmediatamente
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: nextRead } : n))
    );

    // Actualizar en el backend
    try {
      if (nextRead) {
        await api.marcarNotificacionLeida(id);
      } else {
        await api.marcarNotificacionNoLeida(id);
      }
    } catch (error) {
      console.error("Error actualizando notificación:", error);
    }

    if (nextRead) {
      if (timeoutsRef.current[id]) clearTimeout(timeoutsRef.current[id]);
      timeoutsRef.current[id] = setTimeout(() => {
        setHideFeed((prev) => ({ ...prev, [id]: true }));
        delete timeoutsRef.current[id];
      }, DISMISS_MS);
    } else {
      setHideFeed((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      if (timeoutsRef.current[id]) {
        clearTimeout(timeoutsRef.current[id]);
        delete timeoutsRef.current[id];
      }
    }
  };

  // En MODAL: NO ocultamos, solo cambiamos estado read
  const handleToggleReadModal = async (id, nextRead) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: nextRead } : n))
    );

    // Actualizar en el backend
    try {
      if (nextRead) {
        await api.marcarNotificacionLeida(id);
      } else {
        await api.marcarNotificacionNoLeida(id);
      }
    } catch (error) {
      console.error("Error actualizando notificación:", error);
    }
  };

  const getBgClass = (asistencia) => {
    switch ((asistencia || "").toUpperCase()) {
      case "PRESENTE":
        return "bg-green-100 border-l-4 border-green-500";
      case "AUSENTE":
        return "bg-red-100 border-l-4 border-red-500";
      case "RETRASO":
        return "bg-orange-100 border-l-4 border-orange-500";
      default:
        return "bg-amber-200";
    }
  };

  return (
    <div className="flex flex-col gap-5 mb-10 max-w-7xl mx-auto sm:px-6 lg:px-8">
      {/* Header */}
      <header
        onClick={() => setOpen((v) => !v)}
        className="w-full h-40 md:h-44 p-4 md:p-6 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9] text-white flex items-center gap-4 rounded-b-3xl cursor-pointer select-none"
      >
        <img
          src={faceuser}
          alt="Foto de perfil"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white bg-white object-cover"
          width="64"
          height="64"
        />

        <div className="min-w-0">
          <h2 className="text-2xl md:text-3xl leading-tight truncate">
            {userProfile ? `${userProfile.nombre} ${userProfile.apellidos || ""}`.trim() : "Cargando..."}
          </h2>
          <span className="text-zinc-200 text-sm md:text-base">
            {alumnos.length} {alumnos.length === 1 ? "hijo" : "hijos"}
          </span>
        </div>

        <button
          type="button"
          className="ml-auto mr-2 md:mr-4 inline-flex items-center justify-center rounded-full p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          aria-label="Abrir notificaciones"
        >
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-12 gap-5 p-2">
        <section className="md:col-span-7 xl:col-span-8">
          <div className="px-1 md:px-0">
            <h2 className="text-2xl font-semibold">
              Importantes ({notifications.length})
            </h2>

            <motion.div
              id="lista-importantes"
              animate={{ height: expanded ? 480 : 200 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="mt-3 rounded-2xl border border-gray-200 overflow-hidden bg-white"
            >
              <div className="h-full overflow-auto p-2 md:p-3 space-y-3">
                <AnimatePresence mode="popLayout">
                  {notifications
                    .filter((n) => !hideFeed[n.id])
                    .map((n) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                      >
                        <NotificationCard
                          {...n}
                          onToggleRead={handleToggleReadFeed}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="flex justify-center">
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls="lista-importantes"
                className="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-[0.98] transition"
              >
                {expanded ? "Ver menos" : "Ver más"}
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </button>
            </div>
          </div>
        </section>

        <section className="md:col-span-5 xl:col-span-4">
          <div className="px-1 md:px-0">
            <h2 className="text-2xl font-semibold">Hoy ({alumnos.length})</h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Cargando...</div>
            ) : alumnos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No hay hijos registrados</div>
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                {alumnos.map((alumno) => {
                  // Obtener la primera inscripción/clase
                  const primeraInscripcion = alumno.inscripciones?.[0];
                  if (!primeraInscripcion) {
                    return (
                      <div
                        key={alumno.id}
                        className="bg-gray-100 rounded-2xl p-3 flex gap-3 border"
                      >
                        <div className="flex flex-col justify-center w-full">
                          <h3 className="text-base md:text-lg font-semibold">
                            {alumno.nombre} {alumno.apellidos}
                          </h3>
                          <div className="text-xs md:text-sm text-zinc-600 mt-0.5">
                            Sin materias asignadas
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const clase = primeraInscripcion.clase;
                  // Obtener la última asistencia de hoy
                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);
                  const asistenciaHoy = alumno.asistencias?.find(
                    (a) =>
                      new Date(a.fecha).toDateString() === hoy.toDateString() &&
                      a.claseId === clase.id
                  );

                  const estado = asistenciaHoy?.estado || "PRESENTE";

                  return (
                    <div
                      key={alumno.id}
                      className={`${getBgClass(estado)} rounded-2xl p-3 flex gap-3 border`}
                    >
                      <span className="shrink-0">
                        {estado === "AUSENTE" ? (
                          <OctagonAlert className="w-7 h-7 text-red-600 mt-1" />
                        ) : estado === "RETRASO" ? (
                          <TriangleAlert className="w-7 h-7 text-orange-600 mt-1" />
                        ) : (
                          <BadgeCheck className="w-7 h-7 text-green-600 mt-1" />
                        )}
                      </span>

                      <div className="flex flex-col justify-center w-full">
                        <div className="flex items-center gap-2 justify-between">
                          <h3 className="text-base md:text-lg font-semibold">
                            {alumno.nombre} {alumno.apellidos}
                          </h3>
                          <span className="text-xs md:text-sm text-black/70 bg-white/80 px-2 py-0.5 rounded-md border">
                            {estado}
                          </span>
                        </div>

                        <div className="text-xs md:text-sm text-zinc-600 mt-0.5">
                          <div className="font-medium">{clase.materia}</div>
                          <div>{clase.horario}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="md:col-span-5 xl:col-span-4 md:row-start-2">
          <div className="px-1 md:px-0">
            <h2 className="text-2xl font-semibold">Próximos (4)</h2>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mt-3">
              <button
                type="button"
                className="bg-sky-100 rounded-2xl p-3 flex h-28 border-2 border-sky-300 flex-col items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
                onClick={() => setIsOpeReuniones(true)}
              >
                <NotificationIcon />
                <h3 className="mt-1 text-sm md:text-base font-medium">
                  Reuniones
                </h3>
              </button>

              <div className="bg-amber-100 rounded-2xl p-3 flex h-28 border-4 border-dotted border-amber-300 flex-col items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer">
                <h3 className="text-sm md:text-base font-medium">Ejemplo</h3>
              </div>

              <div className="bg-amber-100 rounded-2xl p-3 flex h-28 border-4 border-dotted border-amber-300 flex-col items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer">
                <h3 className="text-sm md:text-base font-medium">Ejemplo</h3>
              </div>

              <div className="bg-amber-100 rounded-2xl p-3 flex h-28 border-4 border-dotted border-amber-300 flex-col items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer">
                <h3 className="text-sm md:text-base font-medium">Ejemplo</h3>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de notificaciones */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="🔔 Notificaciones"
      >
        <div className="max-h-[70vh] overflow-y-auto p-2 space-y-3">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              {...n}
              onToggleRead={handleToggleReadModal}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cerrar
          </button>
        </div>
      </Modal>

      {/* Modal para Reuniones */}
      <Modal
        isOpen={isOpenReuniones}
        onClose={() => setIsOpeReuniones(false)}
        title="Reuniones 📅"
      >
        <div className="p-2">
          <p>Aquí van las reuniones próximas...</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsOpeReuniones(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
