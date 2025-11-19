// Detectar automáticamente la URL del backend
// Si se accede desde localhost, usa localhost. Si se accede desde IP de red, usa esa IP
const getApiUrl = () => {
  // Si hay una variable de entorno, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Detectar si estamos en localhost o en IP de red
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  } else {
    // Si accedemos desde IP de red, usar esa misma IP para el backend
    return `http://${hostname}:3001/api`;
  }
};

const API_URL = getApiUrl();

// Verificar conexión al iniciar
if (typeof window !== 'undefined') {
  fetch(`${API_URL.replace('/api', '')}/api/health`)
    .then(() => console.log('✅ Backend conectado'))
    .catch(() => console.warn(`⚠️ Backend no disponible. Asegúrate de que el servidor esté corriendo en ${API_URL.replace('/api', '')}`));
}

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Verificar si la respuesta es JSON
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || 'Error en la respuesta del servidor');
      }

      if (!response.ok) {
        // Si el token expiró, limpiar y redirigir a login
        if (response.status === 401) {
          this.setToken(null);
          if (window.location.pathname !== '/Login') {
            window.location.href = '/Login';
          }
        }
        throw new Error(data.error || data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Mejorar mensajes de error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3001');
      }
      
      throw error;
    }
  }

  // ========== AUTH ==========
  async login(email, password) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    this.setToken(result.token);
    return result;
  }

  async register(userData) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    return result;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  logout() {
    this.setToken(null);
  }

  // ========== ALUMNOS (Padres/Tutores) ==========
  async getHijos() {
    return this.request('/alumnos');
  }

  async getAlumnoById(id) {
    return this.request(`/alumnos/${id}`);
  }

  async crearHijo(hijoData) {
    return this.request('/alumnos', {
      method: 'POST',
      body: hijoData,
    });
  }

  async getAsistencias(alumnoId) {
    return this.request(`/alumnos/${alumnoId}/asistencias`);
  }

  async getCalificaciones(alumnoId) {
    return this.request(`/alumnos/${alumnoId}/calificaciones`);
  }

  // ========== PROFESORES ==========
  async getClases() {
    return this.request('/profesores/clases');
  }

  async getAlumnosByClase(claseId) {
    return this.request(`/profesores/clases/${claseId}/alumnos`);
  }

  async registrarAsistencia(data) {
    return this.request('/profesores/asistencias', {
      method: 'POST',
      body: data,
    });
  }

  async registrarCalificacion(data) {
    return this.request('/profesores/calificaciones', {
      method: 'POST',
      body: data,
    });
  }

  async enviarComunicado(data) {
    return this.request('/profesores/comunicados', {
      method: 'POST',
      body: data,
    });
  }

  // ========== REUNIONES ==========
  async getReuniones() {
    return this.request('/reuniones');
  }

  async crearReunion(data) {
    return this.request('/reuniones', {
      method: 'POST',
      body: data,
    });
  }

  async actualizarReunion(id, data) {
    return this.request(`/reuniones/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async eliminarReunion(id) {
    return this.request(`/reuniones/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== NOTIFICACIONES ==========
  async getNotificaciones() {
    return this.request('/notificaciones');
  }

  async marcarNotificacionLeida(id) {
    return this.request(`/notificaciones/${id}/leida`, {
      method: 'PATCH',
    });
  }

  async marcarNotificacionNoLeida(id) {
    return this.request(`/notificaciones/${id}/no-leida`, {
      method: 'PATCH',
    });
  }

  async eliminarNotificacion(id) {
    return this.request(`/notificaciones/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();

