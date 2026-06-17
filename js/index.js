// Manejo de herramientas de accesibilidad global
document.addEventListener("DOMContentLoaded", () => {
    const btnAumentar = document.getElementById("btn-aumentar");
    const btnReducir = document.getElementById("btn-reducir");
    const btnContraste = document.getElementById("btn-contraste");
    
    let currentSize = 100;

    if (btnAumentar && btnReducir) {
        btnAumentar.addEventListener("click", () => {
            if (currentSize < 130) {
                currentSize += 10;
                document.documentElement.style.fontSize = `${currentSize}%`;
            }
        });

        btnReducir.addEventListener("click", () => {
            if (currentSize > 90) {
                currentSize -= 10;
                document.documentElement.style.fontSize = `${currentSize}%`;
            }
        });
    }

    if (btnContraste) {
        btnContraste.addEventListener("click", () => {
            document.body.classList.toggle("alto-contraste");
        });
    }
});
