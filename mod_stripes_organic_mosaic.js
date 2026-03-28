// Organic Noise Mosaic (Based on Modulo Stripes)
// p5.js sketch (global mode)
//
// - Sweeps diagonally using linear modulus mapping
// - Injects Perlin noise to modulate size and hue
// - Click anywhere to trigger animation

let transitionActive = false;
let transitionProgress = 0;

let COLS = 35;
let ROWS = 35;
let MODULUS = 7;
let palette = ['#D23B72', '#4195DE', '#FFD600', '#fbe6ee', '#e5eff8'];

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
}

function draw() {
    clear();
    background('#fcfcfc'); // Neutral background
    
    if (!transitionActive) {
        fill('#333');
        textAlign(CENTER, CENTER);
        textSize(24);
        text("Click to trigger Organic Mosaic transition", windowWidth/2, windowHeight/2);
        return;
    }
    
    let cellW = width / COLS;
    let cellH = height / ROWS;
    let animatedLimit = transitionProgress * (COLS + ROWS);
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (r + c < animatedLimit) {
                let linearIndex = r * COLS + c;
                let idx = ((linearIndex % MODULUS) + MODULUS) % MODULUS;
                
                // Add perlin noise for organic variation
                let n = noise(c * 0.1, r * 0.1, frameCount * 0.05);
                let colorIdx = Math.floor(idx + n * 3) % palette.length;
                
                fill(palette[colorIdx]);
                // Modulate size with noise
                let sizeMod = map(n, 0, 1, 0.4, 1.2);
                rect(c * cellW + cellW*(1-sizeMod)/2, r * cellH + cellH*(1-sizeMod)/2, cellW * sizeMod + 1, cellH * sizeMod + 1);
            }
        }
    }
    
    if (transitionProgress < 1.0) {
       transitionProgress += 0.035;
       if (frameCount % 8 === 0) MODULUS = (MODULUS + 1) % 15 + 3;
    } else if (transitionProgress < 1.5) {
       transitionProgress += 0.02;
    } else {
       transitionActive = false;
    }
}

function mousePressed() {
    transitionActive = true;
    transitionProgress = 0;
    MODULUS = 7;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
