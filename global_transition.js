// global_transition.js
// Vanilla HTML5 Canvas port of the Checker transition to fix p5.js global/instance conflicts.

(function() {
    let transitionActive = true;
    let isOutbound = false;
    let transitionProgress = 1.6;
    let targetLink = "";
    
    let COLS = 25;
    let ROWS = 25;
    let palette = ['#FFD600', '#D23B72', '#4195DE', '#fcfcfc'];
    
    let canvas, ctx;
    let frameCount = 0;
    
    // P5 math recreations natively
    function map(v, mn1, mx1, mn2, mx2) {
        return (v - mn1) / (mx1 - mn1) * (mx2 - mn2) + mn2;
    }
    
    function dist(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    function init() {
        if (document.getElementById('global-transition-canvas')) return;
        
        canvas = document.createElement('canvas');
        canvas.id = 'global-transition-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '2147483647';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
        
        ctx = canvas.getContext('2d');
        
        window.addEventListener('resize', resize);
        resize(); // Match initial size
        setupNavListeners();
        
        requestAnimationFrame(draw);
    }
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function draw() {
        frameCount++;
        
        if (!transitionActive) {
            canvas.style.zIndex = '-9999';
            canvas.style.pointerEvents = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Idle cleanly
            requestAnimationFrame(draw);
            return;
        } else {
            canvas.style.zIndex = '2147483647'; // Pin top securely
            canvas.style.pointerEvents = isOutbound ? 'auto' : 'none'; // Lock clicks out
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let cellW = canvas.width / COLS;
        let cellH = canvas.height / ROWS;
        let animatedLimit = transitionProgress * COLS; 
        
        let modRow = Math.floor(map(Math.sin(frameCount * 0.1), -1, 1, 2, 8));
        let modCol = Math.floor(map(Math.cos(frameCount * 0.08), -1, 1, 2, 8));
        
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                let distFromCenter = dist(c, r, COLS/2, ROWS/2);
                if (distFromCenter < animatedLimit * 1.5) {
                    let rowResidue = r % modRow;
                    let colResidue = c % modCol;
                    let colorIdx = (rowResidue + colResidue) % palette.length;
                    
                    ctx.fillStyle = palette[colorIdx];
                    ctx.fillRect(c * cellW, r * cellH, cellW + 1.5, cellH + 1.5);
                }
            }
        }
        
        // Handling transition animation logic
        if (isOutbound) {
            // Expand, then fire redirect immediately at apex — no hold
            transitionProgress += 0.04;
            if (transitionProgress >= 1.0 && targetLink) {
                window.location.href = targetLink;
                targetLink = "";
            }
        } else {
            // Un-expansion mapping
            if (transitionProgress > 0) {
                transitionProgress -= 0.05; 
            } else {
                transitionProgress = 0;
                transitionActive = false;
            }
        }
        
        requestAnimationFrame(draw);
    }

    function setupNavListeners() {
        let navLinks = document.querySelectorAll('a');
        navLinks.forEach(link => {
            let href = link.getAttribute('href');
            // Intercept local anchors exclusively
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
            
            link.addEventListener('click', function(event) {
                event.preventDefault();
                targetLink = href;
                
                if(transitionActive && isOutbound) return;
                
                // Dim page quickly upon leaving
                let content = document.querySelector('.content') || document.querySelector('main');
                if (content && content.style) {
                    content.style.transition = 'opacity 0.3s';
                    content.style.opacity = '0'; 
                }
                
                isOutbound = true;
                transitionActive = true;
                transitionProgress = 0;
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
