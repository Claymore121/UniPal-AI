import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, SquarePlus } from "lucide-react";
import { Alumnos } from "../data/dataNotification";

const Kids = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-[100vh] overflow-y-auto">
      <header
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[150px] p-4 bg-blue-500 text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
      >
        {/* <img
          src={""}
          alt="Foto de perfil"
          className="h-[50px] mt-[50px] rounded-full border border-white bg-white"
          width="50"
          height="50"
        /> */}

        <div>
          <h2 className="text-2xl mt-[50px] leading-none">Hijos</h2>

          <div className="mt-3 flex gap-1.5">
            {Alumnos.map((alumno) => (
              <div
                key={alumno.id}
                className="text-white p-1.5 bg-green-600 rounded-lg"
              >
                {alumno.grade}
              </div>
            ))}
            <div />
          </div>
        </div>

        <motion.span
          animate={{ rotate: open ? 360 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-6 h-6 ml-auto mt-[70px] mr-5"
          aria-hidden="true"
        >
          <SquarePlus className="w-6 h-6" />
        </motion.span>
      </header>
      <section className="p-5 flex flex-col">
        <h2 className="text-2xl font-semibold">Mis hijos</h2>
        <div className="mt-3 rounded-2xl border border-gray-300 overflow-hidden">
          <div className="h-full overflow-auto p-2 space-y-3">
            {Alumnos.map((alumno) => (
              <div
                key={alumno.id}
                className="p-3 rounded-lg border-l-4 shadow-sm transition hover:shadow-md bg-gray-50"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <img
                      src={alumno.imgProfile}
                      alt=""
                      width={"50"}
                      height={"50"}
                    />
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-blue-600">
                        {alumno.name}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-700 mt-1">
                      Grado: {alumno.grade}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kids;
