import React, { useState } from "react";
import faceuser from "../assets/user1.png";
import { ChevronRight, ChevronDown, Bell } from "lucide-react";
import { motion } from "framer-motion";
import notificationsData from "../data/dataNotification";
import NotificationCard from "../components/NotificationCard";
import { Alumnos } from "../data/dataNotification";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Estado local pensando en futura BD: simula update de "read"
  const [notifications, setNotifications] = useState(notificationsData);

  const handleToggleRead = (id, nextRead) => {
    // Aquí después harás un fetch/axios a tu API (PATCH /notifications/:id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: nextRead } : n))
    );
  };

  return (
    <div>
      <header
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[150px] p-4 bg-blue-500 text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
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

        <motion.span
          animate={{ rotate: open ? 360 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-6 h-6 ml-auto mt-[70px] mr-5"
          aria-hidden="true"
        >
          <Bell className="w-6 h-6" />
        </motion.span>
      </header>

      <section className="p-5 flex flex-col">
        <h2 className="text-2xl font-semibold">Importantes</h2>

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

      <section className="p-5 flex flex-col">
        <h2 className="text-2xl font-semibold">Hoy</h2>
        <div className="">
          {/* <div className="bg-amber-200 rounded-2xl p-2 mt-1.5 flex h-19 gap-2.5">
            <h2>Luis</h2>
            <h1>Ausente</h1>
            <h2>matematicas </h2>
            <span>horario</span>
          </div> */}
          {Alumnos.map((alumno) => (
            <div
              key={alumno.id}
              className="bg-amber-200 rounded-2xl p-2 mt-1.5 flex h-19 gap-2.5"
            >
              <h2>{alumno.name}</h2>
              <h1>{alumno.materia.nombre}</h1>
              <h2>{alumno.materia.asistencia} </h2>
              <span>{alumno.materia.horario}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
