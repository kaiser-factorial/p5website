// Clock Arithmetic Rings (mod n circles) - BEZIER CURVE VERSION
// p5.js sketch

let CANVAS_W = 800;
let CANVAS_H = 600;

let MODULUS = 60;
let MULTIPLIER = 2;

let RAD;
let LABEL_RADIUS;
let CENTER_X, CENTER_Y;

function setup() {
    createCanvas(CANVAS_W, CANVAS_H);
    noLoop();

    CENTER_X = CANVAS_W / 2;
    CENTER_Y = CANVAS_H * 0.45;

    RAD = min(CANVAS_W, CANVAS_H) * 0.32;
    LABEL_RADIUS = RAD * 1.08;

    colorMode(HSB, 360, 100, 100);
    textFont("Helvetica");
}

function draw() {
    background(0, 0, 98);

    drawCircleOutline();
    drawCurvedConnections();
    drawPointsAndLabels();
    drawTitleAndLegend();
}

function drawCircleOutline() {
    stroke(0, 0, 10);
    strokeWeight(3);
    noFill();
    circle(CENTER_X, CENTER_Y, 2 * RAD);
}

// --- CURVED CONNECTIONS USING BEZIER ---
function drawCurvedConnections() {
    let n = MODULUS;
    let a = MULTIPLIER;

    for (let k = 0; k < n; k++) {
        let target = (a * k) % n;

        let angle1 = -HALF_PI + TWO_PI * (k / n);
        let angle2 = -HALF_PI + TWO_PI * (target / n);

        let x1 = CENTER_X + RAD * cos(angle1);
        let y1 = CENTER_Y + RAD * sin(angle1);

        let x2 = CENTER_X + RAD * cos(angle2);
        let y2 = CENTER_Y + RAD * sin(angle2);

        // control points: pull toward center, slightly offset angle
        let controlRadius = RAD * 0.5;
        let midAngle1 = lerpAngle(angle1, angle2, 0.3);
        let midAngle2 = lerpAngle(angle1, angle2, 0.7);

        let cx1 = CENTER_X + controlRadius * cos(midAngle1);
        let cy1 = CENTER_Y + controlRadius * sin(midAngle1);

        let cx2 = CENTER_X + controlRadius * cos(midAngle2);
        let cy2 = CENTER_Y + controlRadius * sin(midAngle2);

        let hue = map(k, 0, n, 0, 360);
        stroke(hue, 80, 80, 70);
        strokeWeight(2);
        noFill();

        bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
    }
}

// helper: interpolate angles nicely (avoid jumping across 2π)
function lerpAngle(a1, a2, t) {
    let diff = a2 - a1;
    if (diff > PI) diff -= TWO_PI;
    if (diff < -PI) diff += TWO_PI;
    return a1 + diff * t;
}

function drawPointsAndLabels() {
    let n = MODULUS;

    for (let k = 0; k < n; k++) {
        let angle = -HALF_PI + TWO_PI * (k / n);

        let px = CENTER_X + RAD * cos(angle);
        let py = CENTER_Y + RAD * sin(angle);

        let lx = CENTER_X + LABEL_RADIUS * cos(angle);
        let ly = CENTER_Y + LABEL_RADIUS * sin(angle);

        noStroke();
        fill(0, 0, 10);
        circle(px, py, 8);

        if (n <= 24 || k % 3 === 0) {
            fill(0, 0, 15);
            textSize(18);
            textAlign(CENTER, CENTER);
            text(k, lx, ly);
        }
    }
}

function drawTitleAndLegend() {
    let baseY = CANVAS_H * 0.78;

    textAlign(CENTER, CENTER);
    fill(0, 0, 10);

    //  textSize(48);
    // text("Clock Arithmetic (Bezier Curves)", CANVAS_W / 2, baseY);

    textSize(28);
    text(
        "Curved diagram for k ↦ " + MULTIPLIER + "·k  (mod " + MODULUS + ")",
        CANVAS_W / 2,
        baseY + 40
    );

    textSize(20);
    text(
        "Connections drawn as Bezier curves pulled toward the center.",
        CANVAS_W / 2,
        baseY + 90
    );
}

// optional: tweak with keys again
function keyPressed() {
    let k = key.toLowerCase();

    if (k === 'a') {
        MULTIPLIER++;
    } else if (k === 'z') {
        MULTIPLIER = max(1, MULTIPLIER - 1);
    } else if (k === 's') {
        MODULUS++;
    } else if (k === 'x') {
        MODULUS = max(3, MODULUS - 1);
    }

    MODULUS = constrain(MODULUS, 3, 200);
    MULTIPLIER = constrain(MULTIPLIER, 1, 200);

    redraw();
}
