document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. SISTEMA DE AUTENTICACIÓN (FRONTEND)
    // ==========================================
    const btnValidar = document.getElementById("btn-validar");
    const inputRut = document.getElementById("vecino-rut");
    const inputSerie = document.getElementById("vecino-serie");
    
    const tarjetaContainer = document.getElementById("tarjeta-vecino-container");
    const dashboardVecino = document.getElementById("dashboard-vecino");
    const inputGroup = document.querySelector(".rut-input-group");

    // Datos simulados del usuario de prueba (Simula la respuesta del Backend)
    const USUARIO_PRUEBA = {
        rut: "12345678-9",
        serie: "2026",
        nombre: "Constanza Silva Ossa",
        numeroTarjeta: "STGO-9948271",
        vigencia: "31/12/2027",
        qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STGO-9948271"
    };

    btnValidar.addEventListener("click", () => {
        const rutIngresado = inputRut.value.trim();
        const serieIngresada = inputSerie.value.trim();

        if (rutIngresado === USUARIO_PRUEBA.rut && serieIngresada === USUARIO_PRUEBA.serie) {
            
            // 1.1 CONFIGURACIÓN DE DATOS MUNICIPALES (CON ENMASCARAMIENTO)
            const spanRut = document.getElementById("card-rut");
            const spanNumero = document.getElementById("card-numero");

            // Guardar los datos reales en atributos personalizados
            spanRut.setAttribute("data-original", USUARIO_PRUEBA.rut);
            spanNumero.setAttribute("data-original", USUARIO_PRUEBA.numeroTarjeta);

            // Generar máscaras dinámicas según el largo del dato que venga del backend
            // Ejemplo RUT: "12345678-9" -> "1234-*****"
            const mascaraRut = USUARIO_PRUEBA.rut.substring(0, 4) + "-*****";
            // Ejemplo Tarjeta: "STGO-9948271" -> "STGO-*******"
            const mascaraTarjeta = USUARIO_PRUEBA.numeroTarjeta.substring(0, 5) + "*******";

            spanRut.setAttribute("data-mascara", mascaraRut);
            spanNumero.setAttribute("data-mascara", mascaraTarjeta);

            // Inyectar datos iniciales (Ocultos por defecto)
            document.getElementById("card-nombre").textContent = USUARIO_PRUEBA.nombre;
            spanRut.textContent = mascaraRut;
            spanRut.setAttribute("data-visible", "false");
            
            spanNumero.textContent = mascaraTarjeta;
            spanNumero.setAttribute("data-visible", "false");

            document.getElementById("card-vigencia").textContent = USUARIO_PRUEBA.vigencia;
            document.getElementById("card-qr-img").src = USUARIO_PRUEBA.qrUrl;

            // Transiciones de interfaz
            inputGroup.style.display = "none";
            tarjetaContainer.style.display = "block";
            dashboardVecino.style.display = "block";
            
            // Desplazar suavemente hasta el panel recién activado
            dashboardVecino.scrollIntoView({ behavior: "smooth" });
        } else {
            alert("Credenciales incorrectas.\nUse el usuario de prueba:\nRUT: 12345678-9\nN° Tarjeta: 2026");
        }
    });

    // ==========================================
    // 2. CONMUTADOR DE PESTAÑAS (TABS)
    // ==========================================
    const tabBeneficios = document.getElementById("tab-beneficios");
    const tabHistorial = document.getElementById("tab-historial");
    const contentBeneficios = document.getElementById("content-beneficios");
    const contentHistorial = document.getElementById("content-historial");

    tabBeneficios.addEventListener("click", () => {
        tabBeneficios.classList.add("active");
        tabHistorial.classList.remove("active");
        contentBeneficios.style.display = "block";
        contentHistorial.style.display = "none";
    });

    tabHistorial.addEventListener("click", () => {
        tabHistorial.classList.add("active");
        tabBeneficios.classList.remove("active");
        contentHistorial.style.display = "block";
        contentBeneficios.style.display = "none";
    });

    // ==========================================
    // 3. CIFRADO Y VISIBILIDAD GENERAL (CÓDIGOS Y TARJETA)
    // ==========================================
    // Modificado para capturar tanto los botones de beneficios como los de la tarjeta
    const toggleButtons = document.querySelectorAll(".btn-toggle-codigo, .btn-toggle-tarjeta");

    toggleButtons.forEach(button => {
        // Buscamos el span que está inmediatamente antes del botón
        const codigoSpan = button.previousElementSibling;
        
        button.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Obtener dinámicamente los valores guardados en los atributos del elemento de texto
            const codigoOriginal = codigoSpan.getAttribute("data-codigo") || codigoSpan.getAttribute("data-original");
            const mascara = codigoSpan.getAttribute("data-mascara") || (codigoOriginal.substring(0, 4) + "-*****");
            
            const isVisible = codigoSpan.getAttribute("data-visible") === "true";
            const icon = button.querySelector("i");

            if (isVisible) {
                // Volver a ocultar/cifrar
                codigoSpan.textContent = mascara;
                codigoSpan.setAttribute("data-visible", "false");
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
                button.style.color = "#64748b";
            } else {
                // Mostrar código completo
                codigoSpan.textContent = codigoOriginal;
                codigoSpan.setAttribute("data-visible", "true");
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
                button.style.color = "#0284c7"; // Resaltado azul municipal
            }
        });
    });
});
