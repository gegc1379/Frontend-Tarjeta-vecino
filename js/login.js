document.addEventListener('DOMContentLoaded', () => {
    // 1. Capturamos el formulario con el ID exacto de tu HTML
    const formLogin = document.getElementById('form-admin-login');

    if(formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue al presionar el botón
            
            // 2. Capturamos los valores de los inputs usando los IDs correctos
            const correo = document.getElementById('admin-email').value.trim();
            const password = document.getElementById('admin-password').value.trim();

            try {
                // 3. Hacemos la petición de Login al backend
                const respuesta = await fetch('http://localhost:8000/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Enviamos las variables al backend
                    body: JSON.stringify({ email: correo, password: password })
                });

                // Si el backend rechaza la petición (ej. contraseña incorrecta)
                if (!respuesta.ok) {
                    throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
                }

                // 4. Extraemos los datos si el login fue exitoso
                const data = await respuesta.json();

                // 5. Guardamos el Token usando nuestro módulo de seguridad (auth.js)
                Auth.guardarToken(data.access_token);
                
                // 6. Redirigimos al usuario al panel de administración
                window.location.href = 'admin.html';

            } catch (error) {
                console.error("Fallo el login:", error);
                alert(error.message);
            }
        });
    } else {
        console.error("Error crítico: No se encontró el formulario 'form-admin-login' en el HTML.");
    }
});