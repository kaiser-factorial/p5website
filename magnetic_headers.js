// magnetic_headers.js - Context-aware, proportionate magnetic repel

document.addEventListener("DOMContentLoaded", () => {
    const nameContainers = document.querySelectorAll('header h1, .name-first, .name-last');
    let magSpans = [];

    // Intellectually detect background color contrast
    // Pink = #D23B72, Blue = #4195DE
    let highlightColor = '#4195DE'; // Default blue
    if (document.body.classList.contains('home')) {
        highlightColor = '#ffffff'; // White overlay on home canvas
    } else {
        const bg = window.getComputedStyle(document.body).backgroundColor;
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            let r = parseInt(match[1]);
            let b = parseInt(match[3]);
            // If Blue dominates Red by 10+, background is cool -> use Pink
            if (b > r + 10) highlightColor = '#D23B72';
            // If Red dominates Blue by 10+, background is warm -> use Blue 
            else if (r > b + 10) highlightColor = '#4195DE';
        }
    }

    nameContainers.forEach(container => {
        const text = container.innerText;
        container.innerText = ''; 
        
        // Define scaling context for homepage vs interior pages
        const isBigText = container.classList.contains('name-first') || container.classList.contains('name-last');
        const repulseRadius = isBigText ? 180 : 70;
        const pushMult = isBigText ? 0.25 : 0.12;
        
        text.split('').forEach(char => {
            let span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.25), color 0.3s ease';
            
            // attach physics context directly to the span
            span.dataset.radius = repulseRadius;
            span.dataset.mult = pushMult;
            
            container.appendChild(span);
            magSpans.push(span);
        });
    });

    document.addEventListener('mousemove', e => {
        magSpans.forEach(span => {
            const rect = span.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            const radius = parseFloat(span.dataset.radius);
            const mult = parseFloat(span.dataset.mult);
            
            const dist = Math.hypot(e.clientX - x, e.clientY - y);
            if(dist < radius) {
                const angle = Math.atan2(e.clientY - y, e.clientX - x);
                const push = (radius - dist) * mult;
                span.style.transform = `translate(${-Math.cos(angle)*push}px, ${-Math.sin(angle)*push}px)`;
                span.style.color = highlightColor;
            } else {
                span.style.transform = 'translate(0,0)';
                span.style.color = '';
            }
        });
    });
});
