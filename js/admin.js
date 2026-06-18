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
                    window.location.href = 'login.html';
                }
            });
        }

        // ── MÓDULO: DIRECTORIO DE VECINOS (editar / eliminar) ──────────────────

// GET /users/ (sin /usuarios — así está definido en el router)
    const URL_API_USUARIOS = 'http://localhost:8000/users/';
    let vecinosCargados = [];

    async function cargarTablaVecinos() {
        const tbody = document.getElementById('tbody-vecinos');
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="6" class="tabla-loading">Cargando...</td></tr>';
        try {
            const resp = await Auth.fetchProtegido(URL_API_USUARIOS);
            if (!resp.ok) throw new Error('Error al obtener vecinos');
            vecinosCargados = await resp.json();
            renderizarTabla(vecinosCargados);
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="6" class="tabla-loading tabla-error">Error: ${err.message}</td></tr>`;
        }
    }

    function renderizarTabla(lista) {
        const tbody = document.getElementById('tbody-vecinos');
        if (!tbody) return;
        if (lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="tabla-loading">No se encontraron vecinos.</td></tr>';
            return;
        }
        // Usamos data-id con id_persona (int) que es lo que recibe el backend
        tbody.innerHTML = lista.map(v => `
            <tr>
                <td>${v.rut}</td>
                <td>${v.nombres} ${v.apellidos}</td>
                <td>${v.email || '—'}</td>
                <td>${v.telefono || '—'}</td>
                <td>${v.direccion || '—'} ${v.numero_direccion || ''}</td>
                <td class="acciones-celda">
                    <button class="btn-accion btn-editar" data-id="${v.id_persona}" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-accion btn-eliminar" data-id="${v.id_persona}" data-rut="${v.rut}" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        asignarEventosBotones();
    }

    function asignarEventosBotones() {
        document.querySelectorAll('.btn-editar').forEach(btn => {
            // Buscamos el vecino por id_persona para abrir el modal
            btn.addEventListener('click', () => abrirModalEditar(parseInt(btn.dataset.id)));
        });
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => eliminarVecino(parseInt(btn.dataset.id), btn.dataset.rut));
        });
    }

    function abrirModalEditar(idPersona) {
            // Buscamos por id_persona (int)
            const vecino = vecinosCargados.find(v => v.id_persona === idPersona);
            if (!vecino) return;

            // Guardamos el id_persona en el campo hidden para usarlo en el submit
            document.getElementById('edit-rut-original').value = vecino.id_persona;
            document.getElementById('edit-rut').value = vecino.rut;
            document.getElementById('edit-nombres').value = vecino.nombres || '';
            document.getElementById('edit-apellidos').value = vecino.apellidos || '';
            document.getElementById('edit-fecha-nac').value = vecino.fecha_nacimiento || '';
            document.getElementById('edit-direccion').value = vecino.direccion || '';
            document.getElementById('edit-numero').value = vecino.numero_direccion || '';
            document.getElementById('edit-telefono').value = vecino.telefono || '';
            document.getElementById('edit-email').value = vecino.email || '';

            document.getElementById('modal-editar').style.display = 'flex';
        }

        function cerrarModal() {
            document.getElementById('modal-editar').style.display = 'none';
        }

        document.getElementById('btn-cerrar-modal')?.addEventListener('click', cerrarModal);
        document.getElementById('btn-cancelar-modal')?.addEventListener('click', cerrarModal);
        document.getElementById('modal-editar')?.addEventListener('click', (e) => {
            if (e.target.id === 'modal-editar') cerrarModal();
        });

        const formEditar = document.getElementById('form-editar-vecino');
        if (formEditar) {
            formEditar.addEventListener('submit', async (e) => {
                e.preventDefault();
        // id_persona guardado en el campo hidden
                    const idPersona = document.getElementById('edit-rut-original').value;
                    const rutActual = document.getElementById('edit-rut').value;
                    const datosActualizados = {
                        // El modelo User requiere rut y serial_number como obligatorios
                        rut: rutActual,
                        serial_number: "SIN_CAMBIO",   // el backend no lo revalida en update
                        nombres: document.getElementById('edit-nombres').value.trim(),
                        apellidos: document.getElementById('edit-apellidos').value.trim(),
                        fecha_nacimiento: document.getElementById('edit-fecha-nac').value || null,
                        direccion: document.getElementById('edit-direccion').value.trim(),
                        numero_direccion: document.getElementById('edit-numero').value.trim(),
                        telefono: document.getElementById('edit-telefono').value.trim(),
                        email: document.getElementById('edit-email').value.trim(),
                    };
                    try {
                        // PUT /users/{id_persona}  ← entero, no RUT
                        const resp = await Auth.fetchProtegido(`http://localhost:8000/users/${idPersona}`, {
                            method: 'PUT',
                            body: JSON.stringify(datosActualizados)
                        });
                    if (!resp.ok) {
                        const err = await resp.json().catch(() => ({}));
                        throw new Error(err.detail || 'Error al actualizar');
                    }
                    alert('¡Vecino actualizado correctamente!');
                    cerrarModal();
                    cargarTablaVecinos();
                } catch (err) {
                    alert(`Error: ${err.message}`);
                }
            });
        }

        async function eliminarVecino(idPersona, rut) {
                if (!confirm(`¿Estás seguro de eliminar al vecino con RUT ${rut}?\nEsta acción no se puede deshacer.`)) return;
                try {
                    // DELETE /users/{id_persona}  ← entero, no RUT
                    const resp = await Auth.fetchProtegido(`http://localhost:8000/users/${idPersona}`, {
                        method: 'DELETE'
                    });
                if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    throw new Error(err.detail || 'Error al eliminar');
                }
                alert('Vecino eliminado correctamente.');
                cargarTablaVecinos();
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }

        // Buscador en tiempo real
        document.getElementById('buscar-vecino-tabla')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            const filtrados = vecinosCargados.filter(v =>
                v.rut.toLowerCase().includes(q) ||
                `${v.nombres} ${v.apellidos}`.toLowerCase().includes(q)
            );
            renderizarTabla(filtrados);
        });

        // Cargar tabla al hacer clic en el nav-link de "Directorio de Vecinos"
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-target') === 'seccion-lista-usuarios') {
                link.addEventListener('click', cargarTablaVecinos);
            }
        });

});