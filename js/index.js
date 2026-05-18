document.addEventListener('DOMContentLoaded', () => {
    
    const root = document.documentElement;

    const btnAumentar = document.getElementById('btn-aumentar');
    const btnReducir = document.getElementById('btn-reducir');
    let fontSizeActiva = 16;

    if (btnAumentar) {
        btnAumentar.addEventListener('click', () => {
            if (fontSizeActiva < 22) {
                fontSizeActiva += 1;
                root.style.fontSize = fontSizeActiva + 'px';
            }
        });
    }

    if (btnReducir) {
        btnReducir.addEventListener('click', () => {
            if (fontSizeActiva > 13) {
                fontSizeActiva -= 1;
                root.style.fontSize = fontSizeActiva + 'px';
            }
        });
    }

    const btnContraste = document.getElementById('btn-contraste');
    if (btnContraste) {
        btnContraste.addEventListener('click', function() {
            document.body.classList.toggle('alto-contraste');
            
            const activo = document.body.classList.contains('alto-contraste');
            this.setAttribute('aria-pressed', activo);
            this.setAttribute('aria-label', activo ? 'Desactivar alto contraste' : 'Activar alto contraste');
        });
    }

    const btnOscuro = document.getElementById('btn-oscuro');
    if (btnOscuro) {
        btnOscuro.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            const activo = document.body.classList.contains('dark-mode');
            this.setAttribute('aria-pressed', activo);
            this.setAttribute('aria-label', activo ? 'Desactivar modo oscuro' : 'Activar modo oscuro');
            
            this.querySelector('i').className = activo ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        });
    }

    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            const abierto = mainNav.classList.toggle('open');
            
            this.setAttribute('aria-expanded', abierto);
            this.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
            
            this.querySelector('i').className = abierto ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
        
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.setAttribute('aria-label', 'Abrir menú');
                    navToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }

    const btnScrollTop = document.getElementById('scroll-top');

    if (btnScrollTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btnScrollTop.classList.add('visible');
            } else {
                btnScrollTop.classList.remove('visible');
            }
        }, { passive: true }); 

        btnScrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});