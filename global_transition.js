// global_transition.js
// A bounded canvas transition that stays inert between navigations.

(function() {
    const COLS = 25;
    const ROWS = 25;
    const PALETTE = ['#FFD600', '#D23B72', '#4195DE', '#fcfcfc'];
    const ENTER_DURATION = 360;
    const EXIT_DURATION = 280;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let canvas;
    let ctx;
    let frameId = null;
    let transition = null;
    let targetLink = '';

    function map(value, min1, max1, min2, max2) {
        return (value - min1) / (max1 - min1) * (max2 - min2) + min2;
    }

    function init() {
        canvas = document.getElementById('global-transition-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'global-transition-canvas';
            canvas.style.position = 'fixed';
            canvas.style.inset = '0';
            canvas.style.zIndex = '-9999';
            canvas.style.pointerEvents = 'none';
            document.body.appendChild(canvas);
        }

        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
        setupNavListeners();

        if (!reduceMotion) startTransition('enter');
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function showCanvas(outbound) {
        canvas.style.zIndex = '2147483647';
        canvas.style.pointerEvents = outbound ? 'auto' : 'none';
    }

    function hideCanvas() {
        if (!canvas || !ctx) return;
        canvas.style.zIndex = '-9999';
        canvas.style.pointerEvents = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function stopAnimation() {
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
        transition = null;
    }

    function restorePageContent() {
        const content = document.querySelector('.content') || document.querySelector('main');
        if (!content || !content.style) return;
        content.style.opacity = '';
        content.style.transition = '';
    }

    function draw(progress, now) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cellWidth = canvas.width / COLS;
        const cellHeight = canvas.height / ROWS;
        const animatedLimit = progress * COLS;
        const modRow = Math.floor(map(Math.sin(now * 0.006), -1, 1, 2, 8));
        const modCol = Math.floor(map(Math.cos(now * 0.0048), -1, 1, 2, 8));

        for (let row = 0; row < ROWS; row += 1) {
            for (let column = 0; column < COLS; column += 1) {
                const distance = Math.hypot(column - COLS / 2, row - ROWS / 2);
                if (distance >= animatedLimit * 1.5) continue;

                const color = (row % modRow + column % modCol) % PALETTE.length;
                ctx.fillStyle = PALETTE[color];
                ctx.fillRect(column * cellWidth, row * cellHeight, cellWidth + 1.5, cellHeight + 1.5);
            }
        }
    }

    function startTransition(direction, href = '') {
        if (reduceMotion && direction === 'enter') {
            hideCanvas();
            return;
        }

        stopAnimation();
        targetLink = href;
        transition = {
            direction,
            startedAt: null,
            duration: direction === 'exit' ? EXIT_DURATION : ENTER_DURATION
        };
        showCanvas(direction === 'exit');
        frameId = requestAnimationFrame(animate);
    }

    function animate(now) {
        if (!transition) return;
        if (transition.startedAt === null) transition.startedAt = now;

        const elapsed = now - transition.startedAt;
        const fraction = Math.min(elapsed / transition.duration, 1);
        const progress = transition.direction === 'exit' ? fraction : 1 - fraction;
        draw(progress, now);

        if (fraction < 1) {
            frameId = requestAnimationFrame(animate);
            return;
        }

        const direction = transition.direction;
        const destination = targetLink;
        stopAnimation();

        if (direction === 'exit' && destination) {
            window.location.assign(destination);
            return;
        }

        hideCanvas();
    }

    function setupNavListeners() {
        document.querySelectorAll('a').forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:|javascript:)/i.test(href) || link.target === '_blank') return;

            link.addEventListener('click', (event) => {
                if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || transition?.direction === 'exit') return;
                event.preventDefault();

                const content = document.querySelector('.content') || document.querySelector('main');
                if (content && content.style) {
                    content.style.transition = 'opacity 0.2s ease';
                    content.style.opacity = '0';
                }

                startTransition('exit', href);
            });
        });
    }

    window.addEventListener('pagehide', () => {
        stopAnimation();
        hideCanvas();
    });

    window.addEventListener('pageshow', (event) => {
        if (!event.persisted) return;
        stopAnimation();
        hideCanvas();
        restorePageContent();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
