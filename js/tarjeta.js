document.addEventListener('DOMContentLoaded', () => {

    const btnValidar = document.getElementById('btn-validar');
    
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

            if (dataJson.estado === 'activa') {

                alert("¡Tarjeta Vecino Digital validada y generada correctamente!");

                const panelDashboard = document.getElementById('dashboard-vecino');

                if (panelDashboard) {

                    panelDashboard.style.display = 'block';

                    panelDashboard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

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