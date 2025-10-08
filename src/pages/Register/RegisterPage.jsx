import React, { useState } from "react";
import database from "../../assets/database.png";

const RegistroSchoolAgent = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    correo: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    password: "",
    confirmar: "",
    rol: "",
    nombreAlumno: "",
    nombreEscuela: "",
    nivel: "",
    materias: 0,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleRegister = () => {
    // Aquí iría el submit final
    setStep(5);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 w-80 rounded-lg shadow-lg text-center">
        {step === 1 && (
          <>
            <img
              src={database}
              alt="registro"
              className="w-24 mx-auto"
              width="100"
              height="250"
            />
            <h2 className="text-2xl font-semibold mt-4">Registration</h2>
            <input
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Correo Electronico"
              className="form-input mt-4 p-2 border-1 rounded-[10px]"
            />
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre(s)"
              className="form-input mt-2 p-2 border-1 rounded-[10px]"
            />
            <input
              name="apellido1"
              value={form.apellido1}
              onChange={handleChange}
              placeholder="Primer Apellido"
              className="form-input mt-2 p-2 border-1 rounded-[10px]"
            />
            <input
              name="apellido2"
              value={form.apellido2}
              onChange={handleChange}
              placeholder="Segundo Apellido"
              className="form-input mt-2 p-2 border-1 rounded-[10px]"
            />
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              type="password"
              className="form-input mt-2 p-2 border-1 rounded-[10px]"
            />
            <input
              name="confirmar"
              value={form.confirmar}
              onChange={handleChange}
              placeholder="Confirme Contraseña"
              type="password"
              className="form-input mt-2 p-2 border-1 rounded-[10px]"
            />
            <br />
            <button
              onClick={handleNext}
              className="bg-blue-500 mt-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-[10px]"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <img src="/images/roles.png" alt="roles" className="w-24 mx-auto" />
            <h2 className="font-semibold text-xl mt-4">Choose your role</h2>
            <p className="text-sm">¿Are you a caregiver or a professor?</p>
            <div className="flex justify-around mt-4">
              <label>
                <input
                  type="radio"
                  name="rol"
                  value="caregiver"
                  checked={form.rol === "caregiver"}
                  onChange={handleChange}
                />
                Caregiver
              </label>
              <label>
                <input
                  type="radio"
                  name="rol"
                  value="professor"
                  checked={form.rol === "professor"}
                  onChange={handleChange}
                />
                Professor
              </label>
            </div>
            <button onClick={handleNext} className="btn-primary mt-6">
              Register and login
            </button>
          </>
        )}

        {step === 3 && form.rol === "caregiver" && (
          <>
            <h2 className="font-semibold text-xl">Choose your role</h2>
            <p className="text-sm">¿Cuál es el nombre del alumno?</p>
            <input
              name="nombreAlumno"
              value={form.nombreAlumno}
              onChange={handleChange}
              placeholder="Nombre(s)"
              className="form-input mt-3"
            />
            <input
              name="apellido1"
              value={form.apellido1}
              onChange={handleChange}
              placeholder="Primer Apellido"
              className="form-input mt-2"
            />
            <input
              name="apellido2"
              value={form.apellido2}
              onChange={handleChange}
              placeholder="Segundo Apellido"
              className="form-input mt-2"
            />
            <p className="text-sm mt-3">¿Nombre de la institución?</p>
            <input
              name="nombreEscuela"
              value={form.nombreEscuela}
              onChange={handleChange}
              placeholder="Nombre de la escuela"
              className="form-input mt-2"
            />
            <div className="flex justify-around mt-2">
              <label>
                <input
                  type="radio"
                  name="nivel"
                  value="secundaria"
                  checked={form.nivel === "secundaria"}
                  onChange={handleChange}
                />
                Secundaria
              </label>
              <label>
                <input
                  type="radio"
                  name="nivel"
                  value="preparatoria"
                  checked={form.nivel === "preparatoria"}
                  onChange={handleChange}
                />
                Preparatoria
              </label>
            </div>
            <button onClick={handleRegister} className="btn-primary mt-4">
              Register and login
            </button>
          </>
        )}

        {step === 4 && form.rol === "professor" && (
          <>
            <h2 className="font-semibold text-xl">Choose your role</h2>
            <p className="text-sm">¿Nombre de la institución?</p>
            <input
              name="nombreEscuela"
              value={form.nombreEscuela}
              onChange={handleChange}
              placeholder="Nombre de la escuela"
              className="form-input mt-2"
            />
            <div className="flex justify-around mt-2">
              <label>
                <input
                  type="radio"
                  name="nivel"
                  value="secundaria"
                  checked={form.nivel === "secundaria"}
                  onChange={handleChange}
                />
                Secundaria
              </label>
              <label>
                <input
                  type="radio"
                  name="nivel"
                  value="preparatoria"
                  checked={form.nivel === "preparatoria"}
                  onChange={handleChange}
                />
                Preparatoria
              </label>
            </div>
            <p className="text-sm mt-3">¿Número de materias que imparte?</p>
            <input
              type="number"
              name="materias"
              value={form.materias}
              onChange={handleChange}
              className="form-input mt-2"
            />
            <button onClick={handleRegister} className="btn-primary mt-4">
              Register and login
            </button>
          </>
        )}

        {step === 5 && (
          <>
            <img
              src="/images/check.png"
              alt="Success"
              className="w-24 mx-auto"
            />
            <h2 className="text-xl font-semibold mt-3">
              successful registration!!!
            </h2>
            <p className="text-sm mt-1">
              Now you can create and access your classes and subjects.
            </p>
            <button className="btn-primary mt-4">Let's Go</button>
          </>
        )}

        <footer className="mt-6 text-sm text-gray-400">
          © 2025 School Agent
        </footer>
      </div>
    </div>
  );
};

export default RegistroSchoolAgent;
