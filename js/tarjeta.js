document.addEventListener('DOMContentLoaded', () => {

    const btnValidar = document.getElementById('btn-validar');
    
    if(btnValidar) {
        btnValidar.addEventListener('click', async () => {
            const rutInput = document.getElementById('vecino-rut').value.trim();

            if (!rutInput) {
                alert("Por favor, ingresa un RUT válido.");
                return;
            }

            try {
                const URL_API = `http://localhost:8000/tarjeta/rut/${rutInput}`; 

                const respuesta = await fetch(URL_API, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!respuesta.ok) {
                    throw new Error("Vecino no registrado o error en la comunicación de red.");
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

                const qrImageElement = document.getElementById('card-qr-img');
                const prefijoBase64 = "data:image/png;base64,";
                
                if (dataJson.codigo_qr) {
                    if (dataJson.codigo_qr.startsWith("data:image")) {
                        qrImageElement.src = dataJson.codigo_qr;
                    } else {
                        qrImageElement.src = prefijoBase64 + dataJson.codigo_qr;
                    }
                } else {
                    console.warn("Advertencia: No se detectó la cadena Base64 'codigo_qr' en la respuesta.");
                }

                document.getElementById('flip-toggle').checked = false; 

                if (dataJson.estado === 'activa') {
                    alert("¡Tarjeta Vecino Digital validada y generada correctamente!");
                }

            } catch (error) {
                console.error("Detalle de la excepción de integración:", error);
                alert("El RUT ingresado no figura registrado como vecino o el servidor local está desconectado.");
            }
        });
    }

    const modalRegistro = document.getElementById('modal-registro');
    const btnAbrirRegistro = document.getElementById('btn-abrir-registro');
    const btnCerrarRegistro = document.getElementById('btn-cerrar-registro');
    const formRegistro = document.getElementById('form-registro');

    if(btnAbrirRegistro) {
        btnAbrirRegistro.addEventListener('click', () => {
            modalRegistro.style.display = 'flex';
        });
    }

    if(btnCerrarRegistro) {
        btnCerrarRegistro.addEventListener('click', () => {
            modalRegistro.style.display = 'none';
            formRegistro.reset(); 
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalRegistro) {
            modalRegistro.style.display = 'none';
            formRegistro.reset();
        }
    });

    if(formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const nuevoVecino = {
                rut: document.getElementById('reg-rut').value.trim(),
                nombres: document.getElementById('reg-nombres').value.trim(),
                apellidos: document.getElementById('reg-apellidos').value.trim(),
                telefono: document.getElementById('reg-telefono').value.trim()
            };

            try {
                // URL de tu API para CREAR vecinos (POST)
                const URL_POST = 'http://localhost:8000/tarjeta/crear'; 
                
                const respuesta = await fetch(URL_POST, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoVecino)
                });

                if (respuesta.ok) {
                    alert("¡Solicitud enviada con éxito! Tu tarjeta ha sido generada.");
                    
                    modalRegistro.style.display = 'none';
                    formRegistro.reset();

                    document.getElementById('vecino-rut').value = nuevoVecino.rut;
                    
                } else {
                    const errorData = await respuesta.json();
                    alert("Hubo un error al registrar: " + (errorData.detail || "Intenta nuevamente."));
                }

            } catch (error) {
                console.error("Error en el POST:", error);
                alert("No se pudo conectar con el servidor. Verifica que FastAPI esté corriendo.");
            }
        });
    }
});