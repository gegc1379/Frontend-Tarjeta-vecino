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

            // Si la tarjeta NO está bloqueada ni vencida, mostramos el Dashboard
            if (dataJson.estado !== 'bloqueada' && dataJson.estado !== 'vencida') {
                    
                // console.log para ver qué estado llegó realmente (opcional, para depurar)
                console.log("Estado recibido:", dataJson.estado);

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

    //***VALIDAR Y MOSTRAR MIS BENEFICIOS***
    //Simular acción tab Mis Beneficios
    const btnMisBeneficios = document.getElementById('tab-beneficios');
    
    if(btnMisBeneficios) {
    btnMisBeneficios.addEventListener('click', async () => {
    
        async function mostrarBeneficios() {

        try {
            // Obtener Beneficios
            URL_API = "http://localhost:8000/beneficios/";
            const response = await fetch(URL_API);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const beneficios = await response.json();

            //Recorrer y mostrar beneficios
            let indice = 0;
            let cicloActual = 1;
            const maxCiclos = 3; // 1 ejecución inicial + 2 repeticiones

            const intervalo = setInterval(() => {

                const grupo = beneficios.slice(indice, indice + 4);
                
                const grid = document.getElementById("beneficios-grid");
                grid.innerHTML = "";

                grupo.forEach(beneficio => {
                    const card = document.createElement("div");
                    card.className = "beneficio-item-card";
                    // Inserción íconos y datos consulta API
                    //Line 137: <i class="fa-solid ${beneficio.icono}"></i>
                    card.innerHTML = `
                        <div class="beneficio-icon-wrapper"> 
                            <i class="fa-solid ${beneficio.nombre}"></i>
                        </div>

                        <div class="beneficio-details">
                            <span class="categoria">${beneficio.nombre}</span>
                            <h4>${beneficio.descripcion}</h4>
                            <p>
                                <i class="fa-solid fa-location-dot"></i>
                                ${beneficio.comercio}
                            </p>
                        </div>

                        <button class="btn-outline">
                            Obtener Beneficio
                        </button>
               `;

                grid.appendChild(card);
                });

                indice += 4;

                // Iniciar un nuevo ciclo
                if (indice >= beneficios.length) {

                if (cicloActual >= maxCiclos) {
                    clearInterval(intervalo);
                    return;
                }

                cicloActual++;
                indice = 0;

                console.log("\n--- Reiniciando listado de beneficios ---");
                }
            //Aumentar segs entre muestra de beneficios
            }, 3000);

        } catch (error) {
            console.error("Error:", error.message);
    }

}

    //mostrarBeneficios();
        
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
