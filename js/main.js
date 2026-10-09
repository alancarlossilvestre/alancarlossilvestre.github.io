const contactForm = document.querySelector('#contact-form');
const preparedEmail = document.querySelector('#prepared-email');
const formStatus = document.querySelector('#form-status');
const serviceSelect = document.querySelector('#form-service');
const contactSection = document.querySelector('#form');

function clearPreparedEmail() {
    preparedEmail.hidden = true;
    preparedEmail.href = contactForm.action;
    formStatus.textContent = '';
}

contactForm.addEventListener('input', clearPreparedEmail);

document.querySelectorAll('a[data-service]').forEach((link) => {
    link.addEventListener('click', (event) => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
        }
        clearPreparedEmail();
        const service = link.dataset.service;
        if (![...serviceSelect.options].some((option) => option.value === service)) {
            formStatus.textContent = 'No se pudo seleccionar el servicio. Elige el motivo de tu consulta en el formulario.';
            return;
        }
        // Avoid competing fragment-navigation and focus scrolls.
        event.preventDefault();
        serviceSelect.value = service;
        if (window.location.hash !== link.hash) {
            window.history.pushState(null, '', link.hash);
        }
        serviceSelect.focus({ preventScroll: true });
        contactSection.scrollIntoView({ block: 'start' });
    });
});

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const service = formData.get('service');
    const message = formData.get('message').trim();

    const subject = `${service} - ${name}`;
    const body = `Consulta: ${service}\r\nNombre: ${name}\r\nCorreo: ${email}\r\n\r\n${message}`;
    preparedEmail.href = `mailto:alancarlossilvestre1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    preparedEmail.hidden = false;
    formStatus.textContent = 'Tu mensaje está preparado, pero aún no se ha enviado. Si tu aplicación de correo no se abrió, usa el enlace de abajo o escribe directamente al correo indicado.';
    preparedEmail.click();
});

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroVisual = document.querySelector('.hero-visual');
const orbitToggle = document.querySelector('.orbit-toggle');
const orbitSymbol = document.querySelector('.visual-code-mark');
const orbitSupported = CSS.supports('offset-path', 'ellipse(clamp(82px, calc(50% - 56px), 170px) 96px at 50% 50%)');

function setOrbitPaused(paused) {
    heroVisual.classList.toggle('is-orbit-paused', paused);
    orbitToggle.setAttribute('aria-pressed', String(paused));
    const label = paused ? 'Reanudar animación orbital' : 'Pausar animación orbital';
    orbitToggle.setAttribute('aria-label', label);
    orbitToggle.title = label;
}

orbitToggle.addEventListener('click', () => {
    setOrbitPaused(!heroVisual.classList.contains('is-orbit-paused'));
});

const revealedElements = new WeakSet();
const entranceAnimations = new Set();
let revealObserver;

function configureMotion() {
    const canOrbit = orbitSupported && !motionPreference.matches;
    heroVisual.classList.toggle('is-orbit-enabled', canOrbit);
    orbitToggle.hidden = !canOrbit;
    orbitSymbol.hidden = canOrbit;
    if (!canOrbit) {
        setOrbitPaused(false);
    }

    if (revealObserver) {
        revealObserver.disconnect();
    }
    entranceAnimations.forEach((animation) => animation.cancel());
    entranceAnimations.clear();

    if (motionPreference.matches || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) {
        return;
    }

    revealObserver = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
            revealObserver.unobserve(entry.target);
            revealedElements.add(entry.target);
            if (motionPreference.matches || entry.target.contains(document.activeElement)) {
                return;
            }

            const animation = entry.target.animate([
                { opacity: 0, transform: 'translateY(12px)' },
                { opacity: 1, transform: 'none' },
            ], {
                duration: 480,
                delay: Math.min(index, 2) * 65,
                easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
                fill: 'backwards',
            });
            entranceAnimations.add(animation);
            const cleanup = () => entranceAnimations.delete(animation);
            animation.addEventListener('finish', cleanup, { once: true });
            animation.addEventListener('cancel', cleanup, { once: true });
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    document.querySelectorAll(
        '.hero-description, .hero-visual, .section-heading, .profile-card, .skills-panel, .experience-card, .background-card, .service-card, .credential-card, .audience-card, .contact-panel, .footer'
    ).forEach((element) => {
        if (!revealedElements.has(element)) {
            revealObserver.observe(element);
        }
    });
}

document.addEventListener('focusin', () => {
    entranceAnimations.forEach((animation) => {
        if (animation.effect.target.contains(document.activeElement)) {
            animation.cancel();
        }
    });
});

if ('IntersectionObserver' in window) {
    const orbitObserver = new IntersectionObserver(([entry]) => {
        heroVisual.classList.toggle('is-orbit-offscreen', !entry.isIntersecting);
    });
    orbitObserver.observe(heroVisual);
}

document.addEventListener('visibilitychange', () => {
    heroVisual.classList.toggle('is-tab-hidden', document.hidden);
});
heroVisual.classList.toggle('is-tab-hidden', document.hidden);
motionPreference.addEventListener('change', configureMotion);
configureMotion();
