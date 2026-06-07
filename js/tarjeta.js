document.addEventListener('DOMContentLoaded', () => {

    const btnValidar = document.getElementById('btn-validar');
    
    if(btnValidar) {
        btnValidar.addEventListener('click', async () => {
            // 1. Capturamos ambos inputs
            const rutInput = document.getElementById('vecino-rut').value.trim();
            const serieInput = document.getElementById('vecino-serie').value.trim();
            const params = new URLSearchParams();

            // 2. Validación Frontend: Al menos uno debe tener datos
            if (!rutInput && !serieInput) {
                alert("Por favor, ingresa tu RUT o el Número de Tarjeta para validar.");
                return;
            }

            // 3. Armamos el JSON de envío (Payload)
            const payloadBusqueda = {
                rut: rutInput !== "" ? rutInput : null,
                numero_tarjeta: serieInput !== "" ? serieInput : null
            };

            try {
                // 4. URL limpia: Ya no necesitas params en la URL, los datos van en el cuerpo
                const URL_API = `http://localhost:8000/tarjeta/buscar/${params.toString()}`; 

                // 5. Petición POST
                const respuesta = await fetch(URL_API, {
                    method: 'GET', // Asegúrate de que sea POST
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payloadBusqueda) // Aquí viajan los datos de forma segura
                });

                if (!respuesta.ok) {
                    throw new Error("Vecino no registrado o credenciales inválidas.");
                }
                
                // ... el resto de tu código sigue igual ...

                const dataJson = await respuesta.json();

                // 6. Evaluación de estados centralizada
                if (dataJson.estado === 'bloqueada') {
                    alert("Fallo de Validación: Esta Tarjeta Vecino se encuentra BLOQUEADA de forma preventiva.");
                    return; 
                } else if (dataJson.estado === 'vencida') {
                    alert("Aviso Municipal: Esta Tarjeta Vecino expiró. Por favor, regularice su situación en el portal.");
                }

                // 7. Relleno Dinámico de la Tarjeta
                const nombreCompleto = `${dataJson.nombres} ${dataJson.apellidos}`.toUpperCase();
                document.getElementById('card-nombre').innerText = nombreCompleto;
                document.getElementById('card-rut').innerText = dataJson.rut;
                document.getElementById('card-numero').innerText = dataJson.numero_tarjeta;
                document.getElementById('card-vigencia').innerText = dataJson.vigencia;

                // 8. Lógica del Código QR
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

                // 9. Animación de volteo hacia el frente
                document.getElementById('flip-toggle').checked = false; 

                if (dataJson.estado === 'activa') {
                    alert("¡Tarjeta Vecino Digital validada y generada correctamente!");
                    
                    // MOSTRAR EL NUEVO PANEL DASHBOARD
                    const panelDashboard = document.getElementById('dashboard-vecino');
                    if (panelDashboard) {
                        panelDashboard.style.display = 'block';
                        // Hacer un scroll suave hacia el panel para que el usuario lo vea
                        panelDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const contentBeneficios = document.getElementById('content-beneficios');
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