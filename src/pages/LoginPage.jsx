import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import robotImg from "../assets/robotLogin.png";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.login(email, password);
      
      // Log para depuración
      console.log('🔐 Login exitoso:', {
        email: result.user.email,
        role: result.user.role,
        id: result.user.id
      });
      
      // Redirigir según rol
      const role = result.user.role;
      console.log('🔄 Redirigiendo según rol:', role);
      
      if (role === "MAESTRO" || role === "PROFESOR") {
        console.log('➡️ Redirigiendo a /profesor');
        navigate("/profesor");
      } else if (role === "ADMINISTRADOR") {
        console.log('➡️ Redirigiendo a /admin');
        navigate("/admin");
      } else {
        console.log('➡️ Redirigiendo a /Home (rol:', role, ')');
        navigate("/Home");
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAccess = async (role) => {
    // Para desarrollo: acceso rápido con credenciales de prueba
    // En producción, esto debería eliminarse
    setLoading(true);
    setError("");
    
    try {
      let email, password;
      
      if (role === "MAESTRO") {
        email = "maestro@test.com";
        password = "1234";
      } else if (role === "PADRE_TUTOR") {
        email = "padre@test.com";
        password = "1234";
      } else {
        setError("Rol no válido");
        setLoading(false);
        return;
      }
      
      const result = await api.login(email, password);
      
      // Log para depuración
      console.log('🔐 Quick Access - Login exitoso:', {
        email: result.user.email,
        role: result.user.role,
        id: result.user.id
      });
      
      // Redirigir según rol
      const userRole = result.user.role;
      console.log('🔄 Quick Access - Redirigiendo según rol:', userRole);
      
      if (userRole === "MAESTRO" || userRole === "PROFESOR") {
        console.log('➡️ Quick Access - Redirigiendo a /profesor');
        navigate("/profesor");
      } else if (userRole === "ADMINISTRADOR") {
        console.log('➡️ Quick Access - Redirigiendo a /admin');
        navigate("/admin");
      } else {
        console.log('➡️ Quick Access - Redirigiendo a /Home (rol:', userRole, ')');
        navigate("/Home");
      }
    } catch (err) {
      console.error('❌ Error en Quick Access:', err);
      setError(err.message || "Error al iniciar sesión");
      setLoading(false);
    }
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
          className="space-y-4"
          onSubmit={handleLogin}
        >
          <div>
            <h1 className="text-2xl mb-4 text-center text-gray-800">
              Bienvenido a UniPal AI
            </h1>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Entrar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/RegisterPage")}
            className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            Crear Cuenta
          </button>
          <a href="#" className="block text-center text-sm text-gray-500 hover:text-blue-400">
            ¿Olvidaste tu contraseña?
          </a>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3">Acceso rápido (desarrollo)</p>
          <button
            onClick={() => handleQuickAccess("MAESTRO")}
            className="w-full mb-2 rounded-lg bg-orange-400 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-500"
          >
            Entrar Como Maestro
          </button>
          <button
            onClick={() => handleQuickAccess("PADRE_TUTOR")}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Entrar Como Padre-Tutor
          </button>
        </div>

        <footer className="flex justify-center text-zinc-400 w-100% mt-2 ">
          <label htmlFor="">°2025 UniPal AI</label>
        </footer>
      </div>
      {/* <div>
        
      </div> */}
    </div>
  );
}
