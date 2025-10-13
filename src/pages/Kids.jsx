import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SquarePlus, ChevronDown } from "lucide-react";
import Modal from "../components/Modal";
import boyImg from "../assets/boy1.png";
import girlImg from "../assets/girl1.png";
import { Alumnos } from "../data/dataNotification";

const Kids = () => {
  const [open, setOpen] = useState(false);
  const [isOpenAddkid, setIsOpenAddkid] = useState(false);
  const [expandedKidId, setExpandedKidId] = useState(null);

  const [alumnos, setAlumnos] = useState(Alumnos);

  const [nivel, setNivel] = useState("");
  const [nombre, setNombre] = useState("");
  const [grado, setGrado] = useState("");
  const [claveAlumno, setClaveAlumno] = useState("");
  const [numeroControlAlumno, setNumeroControlAlumno] = useState("");
  const [sexo, setSetsexo] = useState("");

  const handleAddAlumno = (e) => {
    e.preventDefault();
    if (!nombre || !nivel || !grado) return;

    const nuevoAlumno = {
      id: Date.now(),
      nivel: nivel === "secu" ? "Secundaria" : "Preparatoria",
      name: nombre,
      grade: grado,
      imgProfile: sexo === "mujer" ? girlImg : boyImg,
      clave: nivel === "secu" ? claveAlumno : undefined,
      numeroControl: nivel === "prepa" ? numeroControlAlumno : undefined,
      materias: [
        {
          nombre: "Matemáticas",
          horario: "Lunes y Miércoles 10:00 - 11:30",
          maestro: "Prof. Ramírez",
          asistencia: "85%",
        },
        {
          nombre: "Inglés",
          horario: "Martes y Jueves 09:00 - 10:30",
          maestro: "Profa. López",
          asistencia: "90%",
        },
        {
          nombre: "Ciencias",
          horario: "Lunes y Miércoles 11:00 - 12:30",
          maestro: "Prof. Villacasas",
          asistencia: "80%",
        },
      ],
    };

    setAlumnos((prev) => [...prev, nuevoAlumno]);
    setNivel("");
    setNombre("");
    setGrado("");
    setClaveAlumno("");
    setNumeroControlAlumno("");
    setIsOpenAddkid(false);
  };

  const toggleExpand = (id) => {
    setExpandedKidId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full h-[100vh] overflow-y-auto">
      <header
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[150px] p-4 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9] text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
      >
        <div>
          <h2 className="text-2xl mt-[50px] leading-none">Hijos</h2>
          <div className="mt-3 flex gap-1.5">
            <div className="text-white p-1.5 bg-green-600 rounded-lg">
              <h2>Secundaria</h2>
            </div>
            <div className="text-white p-1.5 bg-green-600 rounded-lg">
              <h2>Preparatoria</h2>
            </div>
          </div>
        </div>

        <motion.span
          animate={{ rotate: open ? 360 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-6 h-6 ml-auto mt-[70px] mr-5"
          aria-hidden="true"
        >
          <SquarePlus
            className="w-6 h-6 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenAddkid(true);
            }}
          />
        </motion.span>
      </header>

      <section className="p-5 flex flex-col">
        <h2 className="text-2xl font-semibold">Mis hijos</h2>
        <div className="mt-3 rounded-2xl border border-gray-300 overflow-hidden">
          <div className="h-full overflow-auto p-2 space-y-3">
            {alumnos.map((alumno) => {
              const isExpanded = expandedKidId === alumno.id;
              return (
                <div
                  key={alumno.id}
                  className="rounded-lg border-l-4 shadow-sm bg-gray-50 cursor-pointer overflow-hidden transition hover:shadow-md"
                  onClick={() => toggleExpand(alumno.id)}
                >
                  <div className="flex justify-between items-center p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={alumno.imgProfile}
                        alt="perfil"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-blue-600">
                          {alumno.name}
                        </h3>
                        <p className="text-sm text-gray-700">
                          Nivel: {alumno.nivel}
                        </p>
                        <p className="text-sm text-gray-700">
                          Grado: {alumno.grade}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="px-5 pb-4 bg-white border-t border-gray-200 text-sm"
                      >
                        {alumno.materias.map((mat, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded-lg text-white mb-3 ${
                              mat.nombre.toLowerCase() === "matemáticas"
                                ? "bg-red-200 border-2 border-red-400 text-black"
                                : mat.nombre.toLowerCase() === "inglés"
                                ? "bg-yellow-100 border-2 border-yellow-400 text-black"
                                : mat.nombre.toLowerCase() === "ciencias"
                                ? "bg-green-200 border-2 border-green-400 text-black"
                                : "bg-gray-300"
                            }`}
                          >
                            <p className="text-black">
                              <strong>{mat.nombre}</strong> - {mat.horario}
                            </p>
                            <p className="text-black">
                              Asistencia: {mat.asistencia}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal para agregar hijo */}
      <Modal
        isOpen={isOpenAddkid}
        onClose={() => setIsOpenAddkid(false)}
        title="🟩 Agregar Hijo"
      >
        <form className="flex flex-col gap-3" onSubmit={handleAddAlumno}>
          <label className="text-[20px]">Sexo:</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sexo"
                value="hombre"
                className="h-5 w-5"
                checked={sexo === "hombre"}
                onChange={() => setSetsexo("hombre")}
              />
              <span>Hombre</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sexo"
                value="mujer"
                className="h-5 w-5"
                checked={sexo === "mujer"}
                onChange={() => setSetsexo("mujer")}
              />
              <span>Mujer</span>
            </label>
          </div>

          <label className="text-[20px]">Nombre Completo del Alumno</label>
          <input
            type="text"
            className="border rounded p-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Luis Lopez"
            required
          />

          <span className="text-[20px]">Nivel:</span>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="nivel"
                value="secu"
                className="h-5 w-5"
                checked={nivel === "secu"}
                onChange={() => setNivel("secu")}
              />
              <span>Secundaria</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="nivel"
                value="prepa"
                className="h-5 w-5"
                checked={nivel === "prepa"}
                onChange={() => setNivel("prepa")}
              />
              <span>Preparatoria</span>
            </label>
          </div>

          <label className="text-[20px]">Grado</label>
          <select
            className="border rounded p-2 w-full"
            disabled={!nivel}
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            required
          >
            <option value="" disabled>
              {nivel ? "Selecciona un grado" : "Selecciona primero el nivel"}
            </option>
            {nivel === "secu" && (
              <>
                <option value="1ro Secundaria">1ro Secundaria</option>
                <option value="2do Secundaria">2do Secundaria</option>
                <option value="3ro Secundaria">3ro Secundaria</option>
              </>
            )}
            {nivel === "prepa" && (
              <>
                <option value="1ro Preparatoria">1ro Preparatoria</option>
                <option value="2do Preparatoria">2do Preparatoria</option>
                <option value="3ro Preparatoria">3ro Preparatoria</option>
              </>
            )}
          </select>

          {nivel === "secu" && (
            <>
              <label className="text-[20px]">Clave del alumno</label>
              <input
                type="text"
                className="border rounded p-2"
                value={claveAlumno}
                onChange={(e) => setClaveAlumno(e.target.value)}
                placeholder="Ej. 23421"
                required
              />
            </>
          )}

          {nivel === "prepa" && (
            <>
              <label className="text-[20px]">Número de Control</label>
              <input
                type="text"
                className="border rounded p-2"
                value={numeroControlAlumno}
                onChange={(e) => setNumeroControlAlumno(e.target.value)}
                placeholder="Ej. L21490873"
                required
              />
            </>
          )}

          <button
            className="bg-[#295dfc] rounded-[6px] p-2 text-white"
            type="submit"
          >
            Agregar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Kids;
