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

