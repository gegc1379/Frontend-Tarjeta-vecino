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
        formTarjeta.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const datosTarjeta = {
                rut: document.getElementById('tarjeta-rut').value.trim(),
                nombres: document.getElementById('tarjeta-nombres').value.trim(),
                apellidos: document.getElementById('tarjeta-apellidos').value.trim(),
                telefono: document.getElementById('tarjeta-telefono').value.trim() || null
            };

            console.log("Datos listos para enviar a Backend (Tarjeta):", datosTarjeta);
            alert("Vista de Frontend: Formulario capturado correctamente. (Falta integrar API)");
        });
    }

    // Formulario: Crear Usuario/Vecino
    const formUsuario = document.getElementById('form-crear-usuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', (e) => {
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

            console.log("Datos listos para enviar a Backend (Usuario):", datosUsuario);
            alert("Vista de Frontend: Formulario capturado correctamente. (Falta integrar API)");
        });
    }

});