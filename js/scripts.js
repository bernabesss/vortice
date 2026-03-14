document.addEventListener('DOMContentLoaded', () => {
    
    /* --- LÓGICA DEL MENÚ DE NAVEGACIÓN --- */
    const menuToggleBtn = document.getElementById('menuToggle');
    const body = document.body;

    if(menuToggleBtn) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            body.classList.toggle('menu-open');
        });
    }

    document.addEventListener('click', (e) => {
        if (body.classList.contains('menu-open') && !e.target.closest('.menu-container')) {
            body.classList.remove('menu-open');
        }
    });

    document.querySelectorAll('.dropdown-menu-custom a').forEach(link => {
        link.addEventListener('click', () => body.classList.remove('menu-open'));
    });

    /* --- LÓGICA DEL MENÚ DE ACCESIBILIDAD --- */
    const a11yBtnOpen = document.querySelector('.accessibility-btn');
    const a11yPanel = document.getElementById('menu-accesibilidad');
    const a11yBtnClose = document.getElementById('btn-cerrar-a11y');

    if(a11yBtnOpen && a11yPanel) {
        a11yBtnOpen.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            a11yPanel.classList.add('open');
        });
    }

    if(a11yBtnClose && a11yPanel) {
        a11yBtnClose.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            a11yPanel.classList.remove('open');
        });
    }

    const toggleClass = (btnId, className) => {
        const btn = document.getElementById(btnId);
        if(btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.body.classList.toggle(className);
                btn.classList.toggle('active');
            });
        }
    };

    toggleClass('a11y-grayscale', 'a11y-grayscale-active');
    toggleClass('a11y-contrast', 'a11y-contrast-active');
    toggleClass('a11y-cursor', 'a11y-cursor-active');
    toggleClass('a11y-dyslexia', 'a11y-dyslexia-active');
    toggleClass('a11y-v-spacing', 'a11y-vspace-active');
    toggleClass('a11y-h-spacing', 'a11y-hspace-active');
    toggleClass('a11y-links', 'a11y-links-active');

    let currentFontSize = 100;
    const htmlElement = document.documentElement;
    document.getElementById('a11y-text-plus')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if(currentFontSize < 150) { currentFontSize += 10; htmlElement.style.fontSize = currentFontSize + '%'; }
    });
    document.getElementById('a11y-text-minus')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if(currentFontSize > 70) { currentFontSize -= 10; htmlElement.style.fontSize = currentFontSize + '%'; }
    });

    let guideActive = false, maskActive = false;
    const guideBtn = document.getElementById('a11y-guide');
    const maskBtn = document.getElementById('a11y-mask');
    const guideDiv = document.getElementById('a11y-reading-guide');
    const maskTop = document.getElementById('a11y-reading-mask-top');
    const maskBottom = document.getElementById('a11y-reading-mask-bottom');
    const maskHeight = 100;

    if (guideBtn && guideDiv) {
        guideBtn.addEventListener('click', (e) => {
            e.stopPropagation(); guideActive = !guideActive;
            guideBtn.classList.toggle('active'); guideDiv.classList.toggle('d-none', !guideActive);
        });
    }
    if (maskBtn && maskTop && maskBottom) {
        maskBtn.addEventListener('click', (e) => {
            e.stopPropagation(); maskActive = !maskActive;
            maskBtn.classList.toggle('active'); maskTop.classList.toggle('d-none', !maskActive); maskBottom.classList.toggle('d-none', !maskActive);
        });
    }

    document.addEventListener('mousemove', (e) => {
        if (guideActive && guideDiv) guideDiv.style.top = e.clientY + 'px'; 
        if (maskActive && maskTop && maskBottom) {
            maskTop.style.height = (e.clientY - maskHeight/2) + 'px';
            maskBottom.style.height = (window.innerHeight - e.clientY - maskHeight/2) + 'px';
        }
    });

    /* --- LECTOR DE PANTALLA (Mouse + Teclado) --- */
    let readerActive = false;
    const readerBtn = document.getElementById('a11y-reader');
    let speechSynth = window.speechSynthesis;

    readerBtn?.addEventListener('click', (e) => {
        e.stopPropagation(); 
        readerActive = !readerActive;
        readerBtn.classList.toggle('active');
        
        if(readerActive) {
            // Hacemos enfocables los textos al encender
            document.querySelectorAll('h1, h2, h3, h4, p, span, li').forEach(el => {
                if(!el.hasAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
                    el.setAttribute('tabindex', '0');
                    el.classList.add('a11y-tabbable'); 
                }
            });
        } else {
            speechSynth.cancel();
            // Quitamos el foco al apagar
            document.querySelectorAll('.a11y-tabbable').forEach(el => {
                el.removeAttribute('tabindex');
                el.classList.remove('a11y-tabbable');
            });
        }
    });

    // Función unificada para leer texto
    const leerTexto = (elemento) => {
        if (readerActive) {
            const tagsToRead = ['H1', 'H2', 'H3', 'H4', 'P', 'SPAN', 'A', 'BUTTON', 'LI'];
            if (tagsToRead.includes(elemento.tagName) && elemento.innerText.trim() !== '') {
                speechSynth.cancel(); 
                let locucion = new SpeechSynthesisUtterance(elemento.innerText);
                locucion.lang = 'es-MX'; 
                locucion.rate = 0.9; 
                speechSynth.speak(locucion);
            }
        }
    };

    // Escuchamos el ratón y la tecla Tab (focusin)
    document.addEventListener('mouseover', (e) => leerTexto(e.target));
    document.addEventListener('focusin', (e) => leerTexto(e.target));

    /* --- RESTABLECER --- */
    document.getElementById('a11y-reset')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.remove('a11y-grayscale-active', 'a11y-contrast-active', 'a11y-cursor-active', 'a11y-dyslexia-active', 'a11y-vspace-active', 'a11y-hspace-active', 'a11y-links-active');
        
        currentFontSize = 100; htmlElement.style.fontSize = '100%';
        
        guideActive = false; maskActive = false;
        if(guideDiv) guideDiv.classList.add('d-none');
        if(maskTop) maskTop.classList.add('d-none'); if(maskBottom) maskBottom.classList.add('d-none');
        
        readerActive = false; speechSynth.cancel();
        document.querySelectorAll('.a11y-tabbable').forEach(el => {
            el.removeAttribute('tabindex');
            el.classList.remove('a11y-tabbable');
        });

        document.querySelectorAll('.a11y-btn').forEach(btn => btn.classList.remove('active'));
    });

    /* --- LÓGICA DEL CARRUSEL --- */
    const carouselContainer = document.getElementById('carouselContainer');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    if(btnNext && carouselContainer) btnNext.addEventListener('click', () => carouselContainer.scrollBy({ left: 344, behavior: 'smooth' }));
    if(btnPrev && carouselContainer) btnPrev.addEventListener('click', () => carouselContainer.scrollBy({ left: -344, behavior: 'smooth' }));

    /* --- EFECTO GOTA (RIPPLE) --- */
    document.addEventListener('click', function(e) {
        if (e.target.closest('#header-principal') || e.target.closest('#footer-principal') || e.target.closest('#menu-accesibilidad')) return; 
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        const size = 60; 
        ripple.style.width = size + 'px'; ripple.style.height = size + 'px';
        ripple.style.left = (e.pageX - size / 2) + 'px'; ripple.style.top = (e.pageY - size / 2) + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800); 
    });
});