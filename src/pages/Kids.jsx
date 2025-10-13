import { useState } from "react";
import { motion } from "framer-motion";
import { SquarePlus, Info } from "lucide-react";
import Modal from "../components/Modal";
import boyImg from "../assets/boy1.png";
import girlImg from "../assets/girl1.png";
import { Alumnos } from "../data/dataNotification";

const Kids = () => {
  const [open, setOpen] = useState(false);
  const [isOpenAddkid, setIsOpenAddkid] = useState(false);
  const [isOpenInfoKid, setisOpenInfoKid] = useState(false);

  // 👇 Ahora Alumnos es un estado local, editable
  const [alumnos, setAlumnos] = useState(Alumnos);

  // Inputs del formulario
  const [nivel, setNivel] = useState("");
  const [nombre, setNombre] = useState("");
  const [grado, setGrado] = useState("");
  const [claveAlumno, setClaveAlumno] = useState("");
  const [numeroControlAlumno, setNumeroControlAlumno] = useState("");
  const [sexo, setSetsexo] = useState("");

  // 👇 Función para agregar un nuevo alumno
  const handleAddAlumno = (e) => {
    e.preventDefault();

    if (!nombre || !nivel || !grado) return;

    const nuevoAlumno = {
      id: Date.now(), // ID único
      nivel: nivel === "secu" ? "Secundaria" : "Preparatoria",
      name: nombre,
      grade: grado,
      imgProfile: sexo === "mujer" ? girlImg : boyImg,
      clave: nivel === "secu" ? claveAlumno : undefined,
      numeroControl: nivel === "prepa" ? numeroControlAlumno : undefined,
      materia: {
        nombre: "Sin asignar",
        horario: "Pendiente",
        maestro: "Pendiente",
        asistencia: "Pendiente",
      },
    };

    setAlumnos((prev) => [...prev, nuevoAlumno]); // agrega a la lista
    setNivel("");
    setNombre("");
    setGrado("");
    setClaveAlumno("");
    setNumeroControlAlumno("");
    setIsOpenAddkid(false);
  };

  return (
    <div className="w-full h-[100vh] overflow-y-auto">
      <header
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[150px] p-4 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9]  text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
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

            <div />
          </div>
        </div>

        <motion.span
          animate={{ rotate: open ? 360 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-6 h-6 ml-auto mt-[70px] mr-5"
          aria-hidden="true"
        >
          <SquarePlus
            className="w-6 h-6  cursor-pointer"
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
            {alumnos.map((alumno) => (
              <div
                key={alumno.id}
                className="flex justify-between items-center p-3 rounded-lg border-l-4 shadow-sm transition hover:shadow-md bg-gray-50"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <img
                      src={alumno.imgProfile}
                      alt="perfil"
                      width={"50"}
                      height={"50"}
                      className="rounded-full mb-2"
                    />
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-blue-600">
                        {alumno.name}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-700 mt-1">
                      Nivel: {alumno.nivel}
                    </p>
                    <p className="text-sm text-gray-700">
                      Grado: {alumno.grade}
                    </p>
                  </div>
                </div>
                <div className="mr-4">
                  <Info
                    onClick={(e) => {
                      e.stopPropagation();
                      setisOpenInfoKid(true);
                    }}
                  ></Info>
                </div>
              </div>
            ))}
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
          <label htmlFor="nombre" className="text-[20px]">
            Sexo:
          </label>
          <div className="flex items-center gap-6">
            <label
              htmlFor="nivel-secu"
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                id="sexoAlumno"
                type="radio"
                name="sexo"
                value="hombre"
                className="h-5 w-5"
                checked={sexo === "hombre"}
                onChange={() => setSetsexo("hombre")}
              />
              <span>Hombre</span>
            </label>

            <label
              htmlFor="nivel-prepa"
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                id="sexoAlumno"
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
          <label htmlFor="nombre" className="text-[20px]">
            Nombre Completo del Alumno
          </label>
          <input
            id="nombre"
            type="text"
            className="border rounded p-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Luis Lopez"
            required
          />

          <span className="text-[20px]">Nivel:</span>
          <div className="flex items-center gap-6">
            <label
              htmlFor="nivel-secu"
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                id="nivel-secu"
                type="radio"
                name="nivel"
                value="secu"
                className="h-5 w-5"
                checked={nivel === "secu"}
                onChange={() => setNivel("secu")}
              />
              <span>Secundaria</span>
            </label>

            <label
              htmlFor="nivel-prepa"
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                id="nivel-prepa"
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

          <label htmlFor="grado" className="text-[20px]">
            Grado
          </label>
          <select
            id="grado"
            name="grado"
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
              <label htmlFor="Clave" className="text-[20px]">
                Clave del alumno
              </label>
              <input
                id="Clave"
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
              <label htmlFor="NumeroDeControl" className="text-[20px]">
                Número de Control
              </label>
              <input
                id="NumeroDeControl"
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

      {/* modal para la info del hijo */}
      <Modal
        isOpen={isOpenInfoKid}
        onClose={() => setisOpenInfoKid(false)}
        title="🟩 Agregar Hijo"
      >
        <h2>hola</h2>
      </Modal>
    </div>
  );
};

export default Kids;
