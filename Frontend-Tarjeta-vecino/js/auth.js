// auth.js - Manejo centralizado de Autenticación
const Auth = {
    // 1. Guarda el token después del login exitoso
    guardarToken: (token) => {
        localStorage.setItem('access_token', token);
    },

    // 2. Obtiene el token actual
    obtenerToken: () => {
        return localStorage.getItem('access_token');
    },

    // 3. Elimina el token (Cerrar sesión)
    cerrarSesion: () => {
        localStorage.removeItem('access_token');
        window.location.href = 'login.html'; // Redirige al login
    },

    // 4. Verifica si el usuario está logueado
    estaAutenticado: () => {
        return !!localStorage.getItem('access_token');
    },

    // 5. SUPER FUNCIÓN: Un "fetch" personalizado que ya incluye el token
    fetchProtegido: async (url, opciones = {}) => {
        const token = Auth.obtenerToken();
        
        // Configuramos los headers por defecto, añadiendo el token
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...opciones.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Hacemos la petición real
        const respuesta = await fetch(url, { ...opciones, headers });

        // Si el token expiró o es inválido, el backend suele devolver 401 Unauthorized
        if (respuesta.status === 401) {
            alert("Tu sesión ha expirado.");
            Auth.cerrarSesion();
            throw new Error("Sesión expirada");
        }

        return respuesta;
    }
};