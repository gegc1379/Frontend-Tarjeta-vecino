document.addEventListener('DOMContentLoaded', () => {

    // Usamos un bloque try/catch para que si falla la validación, el menú no se rompa
    try {
        if (typeof Auth !== 'undefined' && !Auth.estaAutenticado()) {
            window.location.href = 'login.html';
            return; 
        }
    } catch (error) {
        console.warn("Módulo Auth no cargado. Verifica los scripts en tu HTML.");
    }

    const navLinks = document.querySelectorAll('.nav-link');
    const adminSections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

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
                // Pequeño timeout para permitir animación suave
                setTimeout(() => targetSection.classList.add('active-section'), 10);
            }
        });
    });

    const formTarjeta = document.getElementById('form-crear-tarjeta');
    if (formTarjeta) {
        formTarjeta.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const datosTarjeta = {
                rut: document.getElementById('tarjeta-rut').value.trim(),
                nombres: document.getElementById('tarjeta-nombres').value.trim(),
                apellidos: document.getElementById('tarjeta-apellidos').value.trim(),
                telefono: document.getElementById('tarjeta-telefono').value.trim() || null
            };

            try {
                const URL_API = 'http://localhost:8000/tarjeta/crear'; 

                // Usamos Auth.fetchProtegido en lugar del fetch normal
                const respuesta = await Auth.fetchProtegido(URL_API, {
                    method: 'POST',
                    body: JSON.stringify(datosTarjeta)
                });

                if (!respuesta.ok) {
                    const errorData = await respuesta.json();
                    throw new Error(errorData.detail || "Error al crear la tarjeta");
                }

                const dataJson = await respuesta.json();
                alert(`¡Éxito! Tarjeta creada correctamente. \nN° de Tarjeta: ${dataJson.numero_tarjeta}`);
                formTarjeta.reset();

            } catch (error) {
                console.error("Detalle de conexión:", error);
                alert(`Ocurrió un error: ${error.message}`);
            }
        });
    }

    const formUsuario = document.getElementById('form-crear-usuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Agregamos el serial_number capturando el nuevo input
            const datosUsuario = {
                rut: document.getElementById('vecino-rut').value.trim(),
                nombres: document.getElementById('vecino-nombres').value.trim(),
                apellidos: document.getElementById('vecino-apellidos').value.trim(),
                fecha_nacimiento: document.getElementById('vecino-fecha-nac').value,
                direccion: document.getElementById('vecino-direccion').value.trim(),
                numero_direccion: document.getElementById('vecino-numero').value.trim(),
                telefono: document.getElementById('vecino-telefono').value.trim(),
                email: document.getElementById('vecino-email').value.trim(),
                serial_number: document.getElementById('vecino-serial').value.trim()
            };

            try {
                const URL_API = 'http://localhost:8000/users/usuarios'; 

                // Usamos Auth.fetchProtegido en lugar del fetch normal
                const respuesta = await Auth.fetchProtegido(URL_API, {
                    method: 'POST',
                    body: JSON.stringify(datosUsuario)
                });

                if (!respuesta.ok) {
                    const errorData = await respuesta.json().catch(() => ({})); 
                    throw new Error(errorData.detail || "El RUT ya existe o los datos son inválidos.");
                }

                alert("¡Éxito! El vecino ha sido registrado en la base de datos.");
                formUsuario.reset();

            } catch (error) {
                console.error("Detalle de conexión:", error);
                alert(`Error de registro: ${error.message}`);
            }
        });
    }

    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof Auth !== 'undefined') {
                Auth.cerrarSesion();
            } else {
                // Respaldo por si borras el token manualmente
                window.location.href = 'login.html';
            }
        });
    }

});