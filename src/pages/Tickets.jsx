import { Bell } from "lucide-react";
import React, { useState } from "react";
import boyImg from "../assets/boy1.png";
import { FaRandom } from "react-icons/fa";

const Tickets = () => {
  const [form, setform] = useState({
    id: "",
    nivel: "",
    name: "",
    grade: "",
    imgProfile: boyImg,
    materia: {
      nombre: "matematicas",
      horario: "por definir",
      maestro: "por definir",
      asistencia: "aun no",
    },
  });
  const [setNiños, setSetNiños] = useState({});
  const [nombre, setNombre] = useState("");
  const [inputchange, setInputchange] = useState("");

  const hanldeChange = (e) => {
    const { nombre, value } = e.target;
    setNiños((prev) => ({ ...prev, [nombre]: value }));
  };

  return (
    <div>
      <header
        // onClick={() => setOpen((v) => !v)}
        // className="w-full h-[150px] p-4 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9] via-[#5660cd] to-[#295dfc] bg-[length:200%_200%] animate-gradient text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
        className="w-full h-[150px] p-4 bg-gradient-to-r from-[#fca129] to-[#a9761f]  text-white flex gap-3.5 rounded-b-3xl cursor-pointer select-none"
      >
        <div>
          <h2 className="text-2xl mt-[50px] leading-none">
            Sistema de Tickets
          </h2>
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
          {/* <Bell
            className="w-6 h-6"
            onClick={() => {
              // setIsOpen(true);
            }}
          /> */}
        </div>

        {/* </motion.span> */}
      </header>

      <form action="" className="p-4 flex flex-col gap-3">
        <label htmlFor="">nombre</label>
        <input
          name={nombre}
          type="text"
          className="border-2"
          value={nombre}
          onChange={hanldeChange}
        />
        <button className="bg-sky-400">enviar</button>
        <label htmlFor="">nombre</label>
        <input
          name={nombre}
          type="text"
          className="border-2"
          value={nombre}
          onChange={hanldeChange}
        />
        <button className="bg-sky-400">enviar</button>
        <label htmlFor="">nombre</label>
        <input
          name={nombre}
          type="text"
          className="border-2"
          value={nombre}
          onChange={hanldeChange}
        />
        <button className="bg-sky-400">enviar</button>
        <label htmlFor="">nombre</label>
        <input
          name={nombre}
          type="text"
          className="border-2"
          value={nombre}
          onChange={hanldeChange}
        />
        <button className="bg-sky-400">enviar</button>
        <label htmlFor="">nombre</label>
        <input
          name={nombre}
          type="text"
          className="border-2"
          value={nombre}
          onChange={hanldeChange}
        />
        <button className="bg-sky-400">enviar</button>
        <label htmlFor="">nombre</label>
        <input
          name={nombre}
          type="text"
          className="border-2"
          value={nombre}
          onChange={hanldeChange}
        />
        <button className="bg-sky-400">enviar</button>
        <label htmlFor="">nombre</label>
        <input
          name={nombre}
          type="text"
          className="border-2"
          value={nombre}
          onChange={hanldeChange}
        />
        <button className="bg-sky-400">enviar</button>
        <label htmlFor="">nombre</label>
        <input
          name={nombre}
          type="text"
          className="border-2"
          value={nombre}
          onChange={hanldeChange}
        />
        <button className="bg-sky-400">enviar</button>
      </form>
    </div>
  );
};

export default Tickets;
