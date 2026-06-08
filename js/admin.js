document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const adminSections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Evitamos que salte el scroll hacia arriba

            // Quitamos la clase 'active' de todos los links
            navLinks.forEach(l => l.classList.remove('active'));
            // Agregamos 'active' al link clickeado
            this.classList.add('active');

            // Capturamos el ID de la sección que queremos mostrar
            const targetId = this.getAttribute('data-target');

            // Ocultamos todas las secciones
            adminSections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active-section');
            });

            // Mostramos la sección seleccionada
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                // Pequeño timeout para permitir animación si la agregamos después
                setTimeout(() => targetSection.classList.add('active-section'), 10);
            }
        });
    });

    // Formulario: Crear Tarjeta
    const formTarjeta = document.getElementById('form-crear-tarjeta');
    if (formTarjeta) {
        // IMPORTANTE: Agregamos la palabra 'async' antes de (e) =>
        formTarjeta.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const datosTarjeta = {
                rut: document.getElementById('tarjeta-rut').value.trim(),
                nombres: document.getElementById('tarjeta-nombres').value.trim(),
                apellidos: document.getElementById('tarjeta-apellidos').value.trim(),
                telefono: document.getElementById('tarjeta-telefono').value.trim() || null
            };

            try {
                // 1. URL del endpoint (Pídele esta ruta exacta a tu equipo Backend)
                const URL_API = 'http://localhost:8000/tarjeta/crear'; 

                // 2. Realizamos la petición POST
                const respuesta = await fetch(URL_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        // Nota: Si el backend pide Token de seguridad, se envía aquí.
                    },
                    body: JSON.stringify(datosTarjeta) // Convertimos los datos a texto JSON
                });

                // 3. Evaluamos si el Backend nos respondió con error (Ej: 400 o 500)
                if (!respuesta.ok) {
                    const errorData = await respuesta.json();
                    throw new Error(errorData.detail || "Error al crear la tarjeta");
                }

                // 4. Si todo salió bien, capturamos los datos que nos devuelve el endpoint
                const dataJson = await respuesta.json();

                // 5. Mostramos éxito y limpiamos el formulario
                alert(`¡Éxito! Tarjeta creada correctamente. \nN° de Tarjeta: ${dataJson.numero_tarjeta}`);
                formTarjeta.reset();

            } catch (error) {
                console.error("Detalle de conexión:", error);
                alert(`Ocurrió un error: ${error.message}`);
            }
        });
    }
})

// Formulario: Crear Usuario/Vecino
    const formUsuario = document.getElementById('form-crear-usuario');
    if (formUsuario) {
        // Agregamos 'async'
        formUsuario.addEventListener('submit', async (e) => {
            e.preventDefault();

            const datosUsuario = {
                rut: document.getElementById('vecino-rut').value.trim(),
                nombres: document.getElementById('vecino-nombres').value.trim(),
                apellidos: document.getElementById('vecino-apellidos').value.trim(),
                fecha_nacimiento: document.getElementById('vecino-fecha-nac').value,
                direccion: document.getElementById('vecino-direccion').value.trim(),
                numero_direccion: document.getElementById('vecino-numero').value.trim(),
                telefono: document.getElementById('vecino-telefono').value.trim(),
                email: document.getElementById('vecino-email').value.trim()
            };

            try {
                // 1. URL del endpoint para guardar vecino
                const URL_API = 'http://localhost:8000/users/crear'; 

                // 2. Ejecutar Fetch
                const respuesta = await fetch(URL_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosUsuario)
                });

                // 3. Manejo de errores de servidor
                if (!respuesta.ok) {
                    // Intentamos leer el mensaje de error del backend si existe
                    const errorData = await respuesta.json().catch(() => ({})); 
                    throw new Error(errorData.detail || "El RUT ya existe o los datos son inválidos.");
                }

                // 4. Respuesta exitosa
                const dataJson = await respuesta.json();
                console.log("Respuesta del servidor:", dataJson);

                alert("¡Éxito! El vecino ha sido registrado en la base de datos.");
                formUsuario.reset();

            } catch (error) {
                console.error("Detalle de conexión:", error);
                alert(`Error de registro: ${error.message}`);
            }
        });
    }