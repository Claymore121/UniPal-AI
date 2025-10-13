import React, { useState } from "react";
import faceuser from "../assets/user1.png";
import {
  ChevronRight,
  ChevronDown,
  Bell,
  OctagonAlert,
  BadgeCheck,
  TriangleAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import notificationsData from "../data/dataNotification";
import NotificationCard from "../components/NotificationCard";
import { Alumnos } from "../data/dataNotification";
import NotificationIcon from "../components/NotificationIcon";
import Modal from "../components/Modal";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReuniones, setIsOpeReuniones] = useState(false);

  // Estado local pensando en futura BD: simula update de "read"
  const [notifications, setNotifications] = useState(notificationsData);

  const handleToggleRead = (id, nextRead) => {
    // Aquí después harás un fetch/axios a tu API (PATCH /notifications/:id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: nextRead } : n))
    );
  };

  // Funcion para elegir color segun asistencia
  const getBgClass = (asistencia) => {
    switch ((asistencia || "").toLowerCase()) {
      case "presente":
        return "bg-green-100 border-l-4 border-green-500 border-1";
      case "ausente":
        return "bg-red-100 border-l-4 border-red-500 border-1";
      case "retraso":
        return "bg-orange-100 border-l-4 border-orange-500 border-1";
      default:
        return "bg-amber-200";
    }
  };

  return (
    <div className="gap-4.5 flex flex-col mb-10">
      <header
        onClick={() => setOpen((v) => !v)}
        // className="w-full h-[150px] p-4 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9] via-[#5660cd] to-[#295dfc] bg-[length:200%_200%] animate-gradient text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
        className="w-full h-[150px] p-4 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9]  text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
      >
        <img
          src={faceuser}
          alt="Foto de perfil"
          className="h-[50px] mt-[50px] rounded-full border border-white bg-white"
          width="50"
          height="50"
        />

        <div>
          <h2 className="text-2xl mt-[50px] leading-none">Citlali Estrada</h2>
          <span className="text-zinc-200">#10 hijos</span>
        </div>
        {/* 
        |<motion.span
          animate={{ rotate: open ? 360 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-6 h-6 ml-auto mt-[70px] mr-5"
          aria-hidden="true"
        > */}
        <div
          className="w-6 h-6 ml-auto mt-[70px] mr-5 hover:rotate-0 active:rotate-360 transition "
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <Bell
            className="w-6 h-6"
            onClick={() => {
              setIsOpen(true);
            }}
          />
        </div>

        {/* </motion.span> */}
      </header>
      <section className="px-5 py-2 flex flex-col ">
        <h2 className="text-2xl font-semibold">
          Importantes ({notifications.length})
        </h2>

        <motion.div
          id="lista-importantes"
          animate={{ height: expanded ? 400 : 180 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="mt-3 rounded-2xl border border-gray-300 overflow-hidden"
        >
          <div className="h-full overflow-auto p-2 space-y-3">
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                {...n}
                onToggleRead={handleToggleRead}
              />
            ))}
          </div>
        </motion.div>

        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="lista-importantes"
          className="m-auto w-fit mt-3 inline-flex items-center gap-2 rounded-xl  px-3 py-1 text-gray-700 font-medium hover:bg-sky-700 active:scale-[0.98] transition"
        >
          {expanded ? "Ver menos" : "Ver más"}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>
      </section>
      <section className="px-5 flex flex-col ">
        <h2 className="text-2xl font-semibold">Hoy ({Alumnos.length})</h2>
        <div className="flex flex-col gap-1.5 ">
          {Alumnos.map((alumno) => (
            <div
              key={alumno.id}
              className={`${getBgClass(
                alumno.materia.asistencia
              )} rounded-2xl p-2 mt-1.5 flex h-19 gap-2.5 `}
            >
              <span>
                {(() => {
                  const estado =
                    alumno?.materia?.asistencia?.toLowerCase?.() || "";
                  return estado === "ausente" ? (
                    <OctagonAlert className="w-7 h-7 text-red-600 mt-2" />
                  ) : estado === "retraso" ? (
                    <TriangleAlert className="w-7 h-7 text-orange-600 mt-2" />
                  ) : (
                    <BadgeCheck className="w-7 h-7 text-green-600 mt-2" />
                  );
                })()}
              </span>
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline-last gap-2 w-80 justify-between">
                  <h2 className="text-lg font-semibold ">{alumno.name}</h2>
                  <h2 className="text-lg text-black-700 mt-1 bg-white opacity-75 px-1 rounded-lg">
                    {alumno.materia.asistencia}
                  </h2>
                </div>

                <span className="text-xs text-zinc-500">
                  <h1 className="text-sm text-zinc-600">
                    {alumno.materia.nombre}
                  </h1>
                  {alumno.materia.horario}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 flex flex-col mb-3 ">
        <h2 className="text-2xl font-semibold">Proximos (4)</h2>
        <div className=" grid grid-cols-2 gap-1 mt-3">
          <div
            className="bg-sky-100 rounded-2xl p-2 mt-1.5 flex h-30  border-2
           border-sky-300 flex flex-col items-center justify-center hover:scale-[0.10] active:scale-[0.95] transition cursor-pointer  "
            onClick={() => setIsOpeReuniones(true)}
          >
            <NotificationIcon />
            <h2>Reuniones</h2>
          </div>
          <div
            className="bg-amber-100 rounded-2xl p-2 mt-1.5 flex h-30 gap-2 border-4 border-dotted border-amber-300 flex flex-col items-center justify-center
            hover:scale-[0.10] active:scale-[0.95] transition cursor-pointer 
          "
          >
            <h2>Ejemplo</h2>
          </div>
          <div
            className="bg-amber-100 rounded-2xl p-2 mt-1.5 flex h-30 gap-2 border-4 border-dotted border-amber-300 flex flex-col items-center justify-center
          hover:scale-[0.10] active:scale-[0.95] transition cursor-pointer 
          "
          >
            <h2>Ejemplo</h2>
          </div>
          <div
            className="bg-amber-100 rounded-2xl p-2 mt-1.5 flex h-30 gap-2 border-4 border-dotted border-amber-300 flex flex-col items-center justify-center
          hover:scale-[0.10] active:scale-[0.95] transition cursor-pointer 
          "
          >
            <h2>Ejemplo</h2>
          </div>
        </div>
      </section>

      {/* Modal de notificaciones */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="🔔 Notificaciónes"
      >
        <div className=" overflow-y-hidden p-2 space-y-3">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              {...n}
              onToggleRead={handleToggleRead}
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
        <div className=" overflow-y-hidden p-2 space-y-3">
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
