import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, Bell, Shield } from "lucide-react";
import api from "../../services/api";
import { useState, useEffect } from "react";

export default function ConfigProfesor() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const profile = await api.getProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      api.logout();
      navigate("/Login");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-gradient-to-r from-[#295dfc] to-[#1f3fa9] backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl text-white font-semibold">
                  Configuración
                </h1>
                <p className="text-sm text-zinc-200">
                  Gestiona tu cuenta y preferencias
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/profesor")}
              className="px-4 py-2 rounded-lg bg-white text-zinc-700 font-medium hover:bg-zinc-100 transition"
            >
              Regresar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Perfil del Usuario */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-semibold">
              {userProfile ? (
                userProfile.nombre?.charAt(0).toUpperCase() || "M"
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>
            <div className="flex-1">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-5 w-48 animate-pulse rounded bg-zinc-200"></div>
                  <div className="h-4 w-32 animate-pulse rounded bg-zinc-200"></div>
                </div>
              ) : userProfile ? (
                <>
                  <h2 className="text-xl font-semibold text-zinc-900">
                    {userProfile.nombre} {userProfile.apellidos || ""}
                  </h2>
                  <p className="text-sm text-zinc-500">{userProfile.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {userProfile.role === "MAESTRO"
                      ? "Maestro"
                      : userProfile.role}
                  </span>
                </>
              ) : (
                <p className="text-zinc-500">Error al cargar perfil</p>
              )}
            </div>
          </div>
        </div>

        {/* Opciones de Configuración */}
        <div className="space-y-4">
          {/* Cuenta */}
          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-zinc-900">Cuenta</h3>
            </div>
            <div className="divide-y divide-zinc-200">
              <button className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-zinc-50 transition-colors">
                <User className="h-5 w-5 text-zinc-500" />
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">Editar Perfil</p>
                  <p className="text-sm text-zinc-500">
                    Actualiza tu información personal
                  </p>
                </div>
              </button>
              <button className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-zinc-50 transition-colors">
                <Bell className="h-5 w-5 text-zinc-500" />
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">Notificaciones</p>
                  <p className="text-sm text-zinc-500">
                    Gestiona tus preferencias de notificaciones
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Seguridad */}
          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-zinc-900">Seguridad</h3>
            </div>
            <div className="divide-y divide-zinc-200">
              <button className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-zinc-50 transition-colors">
                <Shield className="h-5 w-5 text-zinc-500" />
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">
                    Cambiar Contraseña
                  </p>
                  <p className="text-sm text-zinc-500">
                    Actualiza tu contraseña de acceso
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Cerrar Sesión */}
          <div className="rounded-lg border border-red-200 bg-white shadow-sm">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-red-600">Cerrar Sesión</p>
                <p className="text-sm text-red-500">
                  Salir de tu cuenta de forma segura
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

