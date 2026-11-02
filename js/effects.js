(() => {
    const root = document.documentElement;
    root.classList.add('js');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const boot = document.querySelector('#boot');
    const bootLog = document.querySelector('#boot-log');
    const terminal = document.querySelector('#terminal');
    const pipeline = document.querySelector('.pipeline');
    const toggle = document.querySelector('.orbit-toggle');

    // Pausa manual de animaciones continuas.
    toggle.addEventListener('click', () => {
        const paused = root.classList.toggle('is-paused');
        toggle.setAttribute('aria-pressed', String(paused));
        const label = paused ? 'Reanudar animaciones' : 'Pausar animaciones';
        toggle.setAttribute('aria-label', label);
        toggle.title = label;
    });

    async function runBoot() {
        const lines = [
            '> git clone alancarlossilvestre/portfolio',
            '> npm run build ........ [ok]',
            '> docker compose up -d ... [ok]',
            '> deploy --env=prod ..... [ok]',
            '> bienvenido, dev 👋',
        ];
        for (const line of lines) {
            bootLog.textContent += `${line}\n`;
            await sleep(260);
        }
        await sleep(250);
        boot.classList.add('is-done');
    }

    async function typeTerminal() {
        const paragraphs = [...terminal.querySelectorAll('p')];
        const originals = paragraphs.map((p) => p.innerHTML);
        paragraphs.forEach((p) => { p.innerHTML = ''; });
        for (let i = 0; i < paragraphs.length; i++) {
            const p = paragraphs[i];
            const holder = document.createElement('span');
            holder.innerHTML = originals[i];
            const text = holder.textContent;
            const prompt = holder.querySelector('.code-prompt');
            p.classList.add('is-typing');
            if (prompt) {
                p.innerHTML = '';
                p.append(prompt.cloneNode(true), ' ');
            }
            const typed = document.createTextNode('');
            p.append(typed);
            const body = prompt ? text.replace(/^\$\s?/, '') : text;
            for (const char of body) {
                typed.data += char;
                await sleep(prompt ? 38 : 12);
            }
            p.classList.remove('is-typing');
            await sleep(prompt ? 250 : 120);
        }
    }

    function startHero() {
        if (reduceMotion.matches) {
            return;
        }
        pipeline.classList.add('pipeline-run');
        typeTerminal();
    }

    function reveal() {
        const targets = document.querySelectorAll(
            '.section-heading, .profile-card, .skills-panel, .experience-card, .background-card, .service-card, .credential-card, .audience-card, .contact-panel'
        );
        targets.forEach((el) => el.setAttribute('data-reveal', ''));
        if (reduceMotion.matches || !('IntersectionObserver' in window)) {
            targets.forEach((el) => el.classList.add('is-in'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
                entry.target.style.transitionDelay = `${Math.min(index, 3) * 90}ms`;
                entry.target.classList.add('is-in');
                observer.unobserve(entry.target);
                setTimeout(() => { entry.target.style.transitionDelay = ''; }, 900);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        targets.forEach((el) => observer.observe(el));
    }

    function scrollEffects() {
        const bar = document.querySelector('#scroll-bar');
        const header = document.querySelector('.site-header');
        let lastY = window.scrollY;
        let ticking = false;
        const update = () => {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
            if (y > 160 && y > lastY + 4) {
                header.classList.add('is-hidden');
            } else if (y < lastY - 4 || y <= 160) {
                header.classList.remove('is-hidden');
            }
            lastY = y;
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });
        header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
        update();
    }

    function pointerEffects() {
        if (!finePointer.matches || reduceMotion.matches) {
            return;
        }
        const cursor = document.querySelector('#cursor');
        let x = 0;
        let y = 0;
        let cx = 0;
        let cy = 0;
        window.addEventListener('pointermove', (event) => {
            x = event.clientX;
            y = event.clientY;
            cursor.classList.add('is-on');
        }, { passive: true });
        document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
        const loop = () => {
            cx += (x - cx) * 0.2;
            cy += (y - cy) * 0.2;
            cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
            requestAnimationFrame(loop);
        };
        loop();

        const interactive = 'a, button, input, select, textarea, .tags li';
        document.addEventListener('pointerover', (event) => {
            cursor.classList.toggle('is-hover', Boolean(event.target.closest(interactive)));
        });

        // Botones magnéticos: usa la propiedad `translate` para no chocar con el hover.
        document.querySelectorAll('.button, .button-icon').forEach((el) => {
            el.addEventListener('pointermove', (event) => {
                const rect = el.getBoundingClientRect();
                const dx = (event.clientX - (rect.left + rect.width / 2)) * 0.25;
                const dy = (event.clientY - (rect.top + rect.height / 2)) * 0.25;
                el.style.translate = `${dx}px ${dy}px`;
            });
            el.addEventListener('pointerleave', () => { el.style.translate = ''; });
        });

        // Tilt 3D de la terminal.
        const hero = document.querySelector('.hero-visual');
        hero.addEventListener('pointermove', (event) => {
            const rect = hero.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            hero.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
        });
        hero.addEventListener('pointerleave', () => { hero.style.transform = ''; });
    }

    scrollEffects();
    reveal();
    pointerEffects();

    if (reduceMotion.matches || sessionStorage.getItem('booted')) {
        boot.remove();
        startHero();
    } else {
        sessionStorage.setItem('booted', '1');
        runBoot().then(startHero);
    }
})();
