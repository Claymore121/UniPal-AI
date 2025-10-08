import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import robotImg from "../assets/robotLogin.png";
import wave from "../assets/wave.svg";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías validar login antes...
    navigate("/Home");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Iniciar Sesión
        </h1>
        <img
          src={robotImg}
          alt=""
          width="150"
          height="100"
          className="m-auto"
        />

        <form
          className="space-y-4  bg-cover bg-center min-h-[300px] p-4"
          style={{ backgroundImage: `url(${wave})` }}
          onSubmit={handleSubmit}
        >
          <div>
            <h1 className="text-3xl m-auto mb-2.5 text-center">
              Bienvenido a UniPal AI
            </h1>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => navigate("/RegisterPage")}
            className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            Crear Cuenta
          </button>
          <a href="#" className="hover:text-blue-400">
            <label htmlFor="">¿Olvido su contraseña?</label>
          </a>
        </form>

        <footer className="flex justify-center text-zinc-400 w-100% mt-2 ">
          <label htmlFor="">°2025 UniPal AI</label>
        </footer>
      </div>
    </div>
  );
}
