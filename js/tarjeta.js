document.addEventListener('DOMContentLoaded', () => {

    const btnValidar = document.getElementById('btn-validar');
    
    if(btnValidar) {
        btnValidar.addEventListener('click', async () => {
            // 1. Capturamos ambos inputs
            const rutInput = document.getElementById('vecino-rut').value.trim();
            const serieInput = document.getElementById('vecino-serie').value.trim();

            // 2. Validación Frontend: Al menos uno debe tener datos
            if (!rutInput && !serieInput) {
                alert("Por favor, ingresa tu RUT o el Número de Tarjeta para validar.");
                return;
            }

            // 3. Armamos el JSON de envío (Payload)
            // Si el input está vacío, enviamos null para que el backend sepa que debe ignorarlo
            const payloadBusqueda = {
                rut: rutInput !== "" ? rutInput : null,
                numero_tarjeta: serieInput !== "" ? serieInput : null
            };

            try {
                // 4. URL del único Endpoint (Ej: /tarjeta/validar o /tarjeta/buscar)
                const URL_API = `http://localhost:8000/tarjeta/validar`; 

                // 5. Petición POST enviando el JSON
                const respuesta = await fetch(URL_API, {
                    method: 'POST', // Cambiamos a POST para poder enviar el Body
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payloadBusqueda)
                });

                if (!respuesta.ok) {
                    throw new Error("Vecino no registrado o credenciales inválidas.");
                }

                const dataJson = await respuesta.json();

                // 6. Evaluación de estados centralizada (La misma de siempre)
                if (dataJson.estado === 'bloqueada') {
                    alert("Fallo de Validación: Esta Tarjeta Vecino se encuentra BLOQUEADA de forma preventiva.");
                    return; 
                } else if (dataJson.estado === 'vencida') {
                    alert("Aviso Municipal: Esta Tarjeta Vecino expiró. Por favor, regularice su situación en el portal.");
                }

                // 7. Relleno Dinámico de la Tarjeta (Intacto)
                const nombreCompleto = `${dataJson.nombres} ${dataJson.apellidos}`.toUpperCase();
                document.getElementById('card-nombre').innerText = nombreCompleto;
                document.getElementById('card-rut').innerText = dataJson.rut;
                document.getElementById('card-numero').innerText = dataJson.numero_tarjeta;
                document.getElementById('card-vigencia').innerText = dataJson.vigencia;

                // 8. Lógica del Código QR (Intacta)
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

                // 9. Animación de volteo
                document.getElementById('flip-toggle').checked = false; 

                if (dataJson.estado === 'activa') {
                    alert("¡Tarjeta Vecino Digital validada y generada correctamente!");
                }

            } catch (error) {
                console.error("Detalle de la excepción de integración:", error);
                alert("Los datos ingresados no figuran registrados o el servidor local está desconectado.");
            }
        });
    }

    const modalBeneficios = document.getElementById('modal-beneficios');
    const btnAbrirBeneficios = document.getElementById('btn-abrir-beneficios');
    const btnCerrarBeneficios = document.getElementById('btn-cerrar-beneficios');

    if(btnAbrirBeneficios) {
        btnAbrirBeneficios.addEventListener('click', () => {
            modalBeneficios.style.display = 'flex';
        });
    }

    if(btnCerrarBeneficios) {
        btnCerrarBeneficios.addEventListener('click', () => {
            modalBeneficios.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalBeneficios) {
            modalBeneficios.style.display = 'none';
        }
    });

});