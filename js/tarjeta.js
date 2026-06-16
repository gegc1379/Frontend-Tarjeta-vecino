document.addEventListener('DOMContentLoaded', () => {

    const btnValidar = document.getElementById('btn-validar');
    const contentBeneficios = document.getElementById('content-beneficios');
    let beneficiosCargados = false;

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
                            <button class="btn-outline">Obtener Beneficio</button>
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

    if(btnValidar) {
        btnValidar.addEventListener('click', async () => {

            const rutInput = document.getElementById('vecino-rut').value.trim();
            const serieInput = document.getElementById('vecino-serie').value.trim();

            if (!rutInput && !serieInput) {
                alert("Por favor, ingresa tu RUT o el Número de Tarjeta para validar.");
                return;
            }

            try {
                const params = new URLSearchParams();

                if (rutInput) {
                    params.append("rut", rutInput);
                }

                if (serieInput) {
                    params.append("numero_tarjeta", serieInput);
                }

                const URL_API = `http://localhost:8000/tarjeta/buscar?${params.toString()}`;
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

                const nombreCompleto = `${dataJson.nombres} ${dataJson.apellidos}`.toUpperCase();
                document.getElementById('card-nombre').innerText = nombreCompleto;
                document.getElementById('card-rut').innerText = dataJson.rut;
                document.getElementById('card-numero').innerText = dataJson.numero_tarjeta;
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
                        const tarjetaContainer = document.querySelector('.tarjeta-flip-container');
                        if (tarjetaContainer) {
                            tarjetaContainer.classList.remove('d-none');
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
        });
    }

});