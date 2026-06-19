document.addEventListener('DOMContentLoaded', () => {

    const btnValidar = document.getElementById('btn-validar');
    const contentBeneficios = document.getElementById('content-beneficios');
    
    let beneficiosCargados = false;
    let idPersonaActiva = null; 

    async function cargarBeneficios() {
        if (beneficiosCargados) return;

        try {
            if (contentBeneficios) {
                contentBeneficios.innerHTML = '<p style="text-align:center; padding: 40px;">Cargando beneficios municipales...</p>';
            }

            const URL_API_BENEFICIOS = "http://127.0.0.1:8000/beneficios/";
            const response = await fetch(URL_API_BENEFICIOS, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const beneficios = await response.json();

            if (contentBeneficios) {
                contentBeneficios.innerHTML = '<div class="beneficios-grid" id="grid-dinamico"></div>';
                const grid = document.getElementById('grid-dinamico');

                if (beneficios.length === 0) {
                    grid.innerHTML = '<p style="text-align:center; width:100%;">Por el momento no hay beneficios disponibles.</p>';
                    return;
                }

                beneficios.forEach(elemento => {
                    let icono = "fa-gift"; 
                    if (elemento.categoria === "Salud") icono = "fa-briefcase-medical";
                    if (elemento.categoria === "Educación") icono = "fa-graduation-cap";
                    if (elemento.categoria === "Comercio") icono = "fa-store";
                    if (elemento.categoria === "Deporte") icono = "fa-volleyball";

                    const cardHTML = `
                        <div class="beneficio-item-card">
                            <div class="beneficio-icon-wrapper"><i class="fa-solid ${icono}"></i></div>
                            <div class="beneficio-details">
                                <span class="categoria">${elemento.categoria || 'Convenio'}</span>
                                <h4>${elemento.nombre || elemento.titulo}</h4>
                                <p><i class="fa-solid fa-tag"></i> ${elemento.descripcion}</p>
                            </div>
                            <button class="btn-outline btn-canjear" data-id="${elemento.id_beneficio}">Obtener Beneficio</button>
                        </div>
                    `;
                    grid.insertAdjacentHTML('beforeend', cardHTML);
                });
            }

            beneficiosCargados = true;

        } catch (error) {
            console.error("Error al cargar beneficios:", error.message);
            if (contentBeneficios) {
                contentBeneficios.innerHTML = '<p style="color: red; text-align: center; padding: 40px;">Error al conectar con el servidor de beneficios.</p>';
            }
        }
    }

    async function cargarHistorial() {
        if (!idPersonaActiva) return; 

        const tbody = document.getElementById('tabla-historial-body');
        const mensajeVacio = document.getElementById('mensaje-historial-vacio');
        
        if (!tbody || !mensajeVacio) return;

        try {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Cargando tu historial...</td></tr>';
            
            const params = new URLSearchParams();
            params.append("id_persona", idPersonaActiva);

            const URL_HISTORIAL = `http://127.0.0.1:8000/beneficios/historial/${idPersonaActiva}`;
            const respuesta = await fetch(URL_HISTORIAL, { 
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!respuesta.ok) throw new Error("Error al obtener el historial");

            const historial = await respuesta.json();
            tbody.innerHTML = ''; 

            if (historial.length === 0) {
                mensajeVacio.style.display = 'block';
                return;
            }

            mensajeVacio.style.display = 'none';

            historial.forEach(item => {
                // Formateamos la fecha que viene del backend
                const fechaFormateada = new Date(item.fecha_uso).toLocaleDateString('es-CL', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                });

                // Inyectamos los NUEVOS nombres de las variables:
                // item.beneficio y item.codigo_canje
                const filaHTML = `
                    <tr>
                        <td>
                            <div class="historial-fecha">
                                <i class="fa-regular fa-calendar"></i> ${fechaFormateada}
                            </div>
                        </td>

                        <td>
                            <div class="historial-info">
                                <i class="fa-solid fa-store" style="color: #64748b;"></i>
                                <div class="historial-textos">
                                    <strong>${item.comercio || 'Convenio Municipal'}</strong>
                                    <span>Convenio Directo</span>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="historial-info">
                                <i class="fa-solid fa-gift" style="color: #072E6D;"></i>
                                <div class="historial-textos">
                                    <strong>${item.beneficio}</strong>
                                    <span>Beneficio Municipal</span>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="historial-descuento">
                                ${item.descuento ? `$${item.descuento}` : 'Canjeado'} 
                                <div class="historial-check">
                                    <i class="fa-solid fa-check"></i>
                                </div>
                            </div>
                        </td>

                        <td>
                            <div class="historial-info">
                                <i class="fa-solid fa-ticket" style="color: #0d9488;"></i>
                                <div class="historial-textos">
                                    <strong style="color: #0d9488; font-size: 1.1rem; font-weight: 800;">${item.codigo_canje}</strong>
                                    <span>Código de Uso</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', filaHTML);
            });

        } catch (error) {
            console.error("Error cargando historial:", error);
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Hubo un problema cargando tu historial.</td></tr>';
        }
    }

    if(btnValidar) {
        btnValidar.addEventListener('click', async () => {

            const rutInput = document.getElementById('vecino-rut').value.trim();
            const serieInput = document.getElementById('vecino-serie').value.trim();

            if (!rutInput && !serieInput) {
                alert("Por favor, ingresa tu RUT o el Número de Tarjeta para validar.");
                return;
            }

            try {
                // Volvimos al método original que sí te funcionaba perfectamente
                const params = new URLSearchParams();
                if (rutInput) params.append("rut", rutInput);
                if (serieInput) params.append("numero_tarjeta", serieInput);

                const URL_API = `http://127.0.0.1:8000/tarjeta/buscar?${params.toString()}`;

                const respuesta = await fetch(URL_API, {
                    method: 'GET'
                });

                if (!respuesta.ok) {
                    throw new Error("Vecino no registrado o credenciales inválidas.");
                }

                const dataJson = await respuesta.json();
                
                if (dataJson.estado === 'bloqueada') {
                    alert("Fallo de Validación: Esta Tarjeta Vecino se encuentra BLOQUEADA de forma preventiva.");
                    return;
                } else if (dataJson.estado === 'vencida') {
                    alert("Aviso Municipal: Esta Tarjeta Vecino expiró. Por favor, regularice su situación en el portal.");
                }

                // Guardamos el ID en memoria
                idPersonaActiva = dataJson.id_persona || dataJson.id_vecino;

                const nombreCompleto = `${dataJson.nombres} ${dataJson.apellidos}`.toUpperCase();
                document.getElementById('card-nombre').innerText = nombreCompleto;
                document.getElementById('card-rut').innerText = dataJson.rut;
                document.getElementById('card-numero').innerText = dataJson.numero_tarjeta;
                
                // NOTA: Si en Python cambiaste "vigencia" por "fecha_vencimiento", ajústalo aquí abajo. 
                // Si dejaste la opción A (recomendada) en Python, esto se queda igual:
                document.getElementById('card-vigencia').innerText = dataJson.vigencia;

                const tarjetaContainer = document.getElementById('tarjeta-vecino-container');
                if (tarjetaContainer) {
                    tarjetaContainer.style.display = 'block';
                }

                const qrImageElement = document.getElementById('card-qr-img');
                const prefijoBase64 = "data:image/png;base64,";

                if (dataJson.codigo_qr) {
                    if (dataJson.codigo_qr.startsWith("data:image")) {
                        qrImageElement.src = dataJson.codigo_qr;
                    } else {
                        qrImageElement.src = prefijoBase64 + dataJson.codigo_qr;
                    }
                } else {
                    console.warn("Advertencia: No se detectó la cadena Base64 'codigo_qr'.");
                }

                document.getElementById('flip-toggle').checked = false; 
                
                if (dataJson.estado !== 'bloqueada' && dataJson.estado !== 'vencida') {                        
                    console.log("Estado recibido:", dataJson.estado);
                    const panelDashboard = document.getElementById('dashboard-vecino');
                    if (panelDashboard) {
                        panelDashboard.style.display = 'block';
                        const tarjetaContainerFlip = document.querySelector('.tarjeta-flip-container');
                        if (tarjetaContainerFlip) {
                            tarjetaContainerFlip.classList.remove('d-none');
                        }
                        panelDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });                        
                        await cargarBeneficios(); 
                    }
                }

            } catch (error) {
                console.error("Detalle de la excepción de integración:", error);
                alert("Los datos ingresados no figuran registrados o el servidor local está desconectado.");
            }
        });
    }

    if (contentBeneficios) {
        contentBeneficios.addEventListener('click', async (e) => {
            
            if (e.target.classList.contains('btn-canjear')) {
                const boton = e.target;
                const idBeneficioA_Canjear = boton.getAttribute('data-id');

                if (!idPersonaActiva) {
                    alert("No se pudo identificar tu sesión. Por favor, vuelve a validar tu tarjeta.");
                    return;
                }

                const confirmacion = confirm("¿Deseas canjear este beneficio ahora?");
                if (!confirmacion) return;

                try {
                    boton.innerText = "Procesando...";
                    boton.disabled = true;

                    // NUEVO CÓDIGO: Enviamos los datos por la URL como Query Params (No body)
                    const params = new URLSearchParams();
                    params.append("id_persona", idPersonaActiva);
                    params.append("id_beneficio", idBeneficioA_Canjear);

                    const URL_REGISTRAR = `http://127.0.0.1:8000/beneficios/canjear?${params.toString()}`;

                    const respuestaPOST = await fetch(URL_REGISTRAR, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (!respuestaPOST.ok) {
                        throw new Error(`Error al registrar: ${respuestaPOST.status}`);
                    }

                    alert("¡Beneficio registrado exitosamente en tu historial!");
                    boton.innerText = "¡Canjeado!";
                    boton.style.backgroundColor = "#28a745"; // Verde de éxito
                    boton.style.color = "white";

                } catch (error) {
                    console.error("Error al registrar beneficio:", error);
                    alert("Hubo un problema de conexión. El beneficio no pudo ser registrado.");
                    boton.innerText = "Obtener Beneficio";
                    boton.disabled = false;
                }
            }
        });
    }

    const tabBeneficios = document.getElementById('tab-beneficios');
    const tabHistorial = document.getElementById('tab-historial');
    const contentHistorial = document.getElementById('content-historial');

    if(tabBeneficios && tabHistorial) {
        tabBeneficios.addEventListener('click', () => {
            tabBeneficios.classList.add('active');
            tabHistorial.classList.remove('active');
            if(contentBeneficios) contentBeneficios.style.display = 'block';
            if(contentHistorial) contentHistorial.style.display = 'none';
        });

        tabHistorial.addEventListener('click', () => {
            tabHistorial.classList.add('active');
            tabBeneficios.classList.remove('active');
            if(contentHistorial) contentHistorial.style.display = 'block';
            if(contentBeneficios) contentBeneficios.style.display = 'none';
            
            cargarHistorial(); // Refresca los datos del historial al abrir la pestaña
        });
    }

});