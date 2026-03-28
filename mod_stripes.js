// Modulus as Texture: Stripes & Grids
// p5.js sketch (portrait)
//
// - Draws a grid of rectangles
// - Colors based on modulus to create stripey / grid textures
// - Press 'd' to toggle pattern mode
// - Press 's' / 'x' to adjust modulus

let CANVAS_W = 1000;
let CANVAS_H = 1400;

let COLS = 40;  // grid width in cells
let ROWS = 56;  // grid height in cells

let cellW, cellH;

// main modulus (used in diagonal mode)
let MODULUS = 12;

// extra moduli for "grid mode"
let MODULUS_ROW = 6;
let MODULUS_COL = 8;

// 0 = diagonal stripes, 1 = grid pattern
let mode = 0;

function setup() {
    createCanvas(CANVAS_W, CANVAS_H);
    noLoop();
    colorMode(HSB, 360, 100, 100);
    textFont("Helvetica");

    cellW = CANVAS_W / COLS;
    cellH = (CANVAS_H * 0.9) / ROWS;  // leave space at top for title
}

function draw() {
    background(0, 0, 98);

    drawTexture();
    drawTitle();
}

function drawTexture() {
    noStroke();

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            // map grid cell to a color index based on modulus
            let idx, hue, sat, bri;

            if (mode === 0) {
                // --- Mode 0: diagonal stripes via linear index ---
                let linearIndex = r * COLS + c;      // 0..(ROWS*COLS-1)
                idx = ((linearIndex % MODULUS) + MODULUS) % MODULUS;

                // map residue to hue + brightness
                hue = map(idx, 0, MODULUS, 0, 360);
                sat = 70;
                bri = 80;
            } else {
                // --- Mode 1: grid / checker pattern ---
                let rowResidue = ((r % MODULUS_ROW) + MODULUS_ROW) % MODULUS_ROW;
                let colResidue = ((c % MODULUS_COL) + MODULUS_COL) % MODULUS_COL;

                // combine the two residues for color
                hue = map(colResidue, 0, MODULUS_COL, 0, 360);
                sat = 60 + 40 * (rowResidue / max(1, MODULUS_ROW - 1));
                bri = 60 + 40 * (colResidue / max(1, MODULUS_COL - 1));
            }

            fill(hue, sat, bri);

            let x = c * cellW;
            let y = CANVAS_H * 0.08 + r * cellH; // start a bit below top
            rect(x, y, cellW + 1, cellH + 1);    // +1 to avoid gaps
        }
    }
}

function drawTitle() {
    fill(0, 0, 10);
    textAlign(CENTER, CENTER);

    textSize(30);
    let title = "Modulus as Texture: Stripes & Grids";
    text(title, CANVAS_W / 2, CANVAS_H * 0.035);

    textSize(18);
    let modeText = (mode === 0)
        ? "Mode: Diagonal stripes — color from (row*cols + col) mod " + MODULUS
        : "Mode: Grid pattern — color from (row mod " + MODULUS_ROW +
        ", col mod " + MODULUS_COL + ")";

    text(modeText, CANVAS_W / 2, CANVAS_H * 0.065);

    textSize(16);
    text(
        "Press 'd' to toggle mode.  In diagonal mode: 's' / 'x' adjust modulus.\n" +
        "In grid mode: 's' / 'x' tweak row modulus; shift + 's'/'x' tweak column modulus.",
        CANVAS_W / 2,
        CANVAS_H * 0.09
    );
}

// -------- interaction ----------

function keyPressed() {
    let k = key.toLowerCase();

    if (k === 'd') {
        mode = 1 - mode; // toggle 0 <-> 1
    } else if (k === 's') {
        if (mode === 0) {
            MODULUS++;
        } else {
            MODULUS_ROW++;
        }
    } else if (k === 'x') {
        if (mode === 0) {
            MODULUS--;
        } else {
            MODULUS_ROW--;
        }
    } else if (key === 'S') { // shift + s
        MODULUS_COL++;
    } else if (key === 'X') { // shift + x
        MODULUS_COL--;
    }

    // keep values sensible
    MODULUS = constrain(MODULUS, 2, 60);
    MODULUS_ROW = constrain(MODULUS_ROW, 2, ROWS);
    MODULUS_COL = constrain(MODULUS_COL, 2, COLS);

    redraw();
}
