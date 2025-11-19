import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * Componente para proteger rutas que requieren autenticación y rol específico
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si el usuario está autorizado
 * @param {string} props.requiredRole - Rol requerido ('MAESTRO', 'PADRE_TUTOR', 'ADMINISTRADOR')
 * @param {boolean} props.requireAuth - Si requiere autenticación (default: true)
 */
export default function ProtectedRoute({ children, requiredRole, requireAuth = true }) {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = cargando, true/false = resultado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Si no hay token y se requiere autenticación
        if (!token && requireAuth) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // Si no se requiere autenticación, permitir acceso
        if (!requireAuth) {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        // Verificar token y obtener perfil
        try {
          const profile = await api.getProfile();
          
          // Log para depuración
          console.log('🔍 ProtectedRoute - Verificando acceso:', {
            userRole: profile.role,
            requiredRole,
            path: window.location.pathname
          });
          
          // Si se requiere un rol específico
          if (requiredRole) {
            // Mapear roles antiguos a nuevos
            const roleMap = {
              'PROFESOR': 'MAESTRO',
              'PADRE_TUTOR': 'PADRE_TUTOR',
              'MAESTRO': 'MAESTRO',
              'ADMINISTRADOR': 'ADMINISTRADOR',
            };
            
            const userRole = roleMap[profile.role] || profile.role;
            const requiredRoleMapped = roleMap[requiredRole] || requiredRole;
            
            console.log('🔍 ProtectedRoute - Comparación de roles:', {
              userRole,
              requiredRoleMapped,
              match: userRole === requiredRoleMapped
            });
            
            if (userRole !== requiredRoleMapped) {
              console.warn('❌ ProtectedRoute - Acceso denegado. Rol del usuario:', userRole, 'Rol requerido:', requiredRoleMapped);
              setIsAuthorized(false);
              setLoading(false);
              return;
            }
          }
          
          console.log('✅ ProtectedRoute - Acceso autorizado');
          setIsAuthorized(true);
        } catch (error) {
          // Token inválido o expirado
          console.error('❌ Error verificando autenticación:', error);
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error en checkAuth:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, requireAuth]);

  // Mostrar loading mientras se verifica
  if (loading || isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, redirigir a login
  if (!isAuthorized) {
    return <Navigate to="/Login" replace />;
  }

  // Si está autorizado, renderizar children
  return <>{children}</>;
}

