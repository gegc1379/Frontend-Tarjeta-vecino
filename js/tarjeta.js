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

    // Datos simulados del usuario de prueba
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
            // Rellenar datos en la tarjeta
            document.getElementById("card-nombre").textContent = USUARIO_PRUEBA.nombre;
            document.getElementById("card-rut").textContent = USUARIO_PRUEBA.rut;
            document.getElementById("card-numero").textContent = USUARIO_PRUEBA.numeroTarjeta;
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
    // 3. CIFRADO Y VISIBILIDAD DE CÓDIGOS
    // ==========================================
    const toggleButtons = document.querySelectorAll(".btn-toggle-codigo");

    toggleButtons.forEach(button => {
        const codigoSpan = button.previousElementSibling;
        const codigoOriginal = codigoSpan.getAttribute("data-codigo");
        
        // Cifrado inicial: Toma las 4 primeras letras y añade asteriscos
        const visibleLength = 4;
        const mascara = codigoOriginal.substring(0, visibleLength) + "-*****";
        
        // Configuración por defecto
        codigoSpan.textContent = mascara;
        codigoSpan.setAttribute("data-visible", "false");

        button.addEventListener("click", (e) => {
            // Evitar cualquier comportamiento secundario
            e.preventDefault();
            
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
