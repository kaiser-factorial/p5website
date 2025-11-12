// ===== Voice model (Teachable Machine via TFJS SpeechCommands) =====
const TM_BASE = "https://teachablemachine.withgoogle.com/models/m_6QDgLEz/";
let recognizer, tmLabels = [];
let voiceLabel = "loading...", voiceConf = 0;

// small debounce so colors don't flicker on borderline detections
let lastVoiceLabel = "", lastSetMs = 0;
const VOICE_SET_COOLDOWN = 250; // ms


let drawingLayer;
let fractalLayer;
let prevPointerX = null;
let prevPointerY = null;

let handPose;
let video;
let hands = [];

let osc1

let cMaj= [261.63, 293.66, 329.6, 349.23, 392.00, 440.00, 493.88, 523.25]
let aMin= [440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00]
let dDor= [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33]
let ePhr= [329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25]
let fLyd = [349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46]

let cMaj5 = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]
let aMin5=[220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33]
let gMaj5= [196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88]
let dMaj5= [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99]

let thumb
let pointer

let playing
let drawing=false


let rad=50
let fractalX = 0
let fractalY = 0

let hit= false
let phit=false

let clickF=false
var cnv;

let sw=10
let c='black'
let ts=1
let cont=0
 let note1
function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}
function setup() {
  // Get navigation and header heights to position canvas below both
  let nav = document.querySelector('nav');
  let header = document.querySelector('header');
  let navHeight = nav ? nav.offsetHeight : 80;
  let headerHeight = header ? header.offsetHeight : 200;
  let totalOffset = navHeight + headerHeight;
 note1= ePhr[7]
  
  // Canvas positioned below nav and header
  cnv = createCanvas(windowWidth, windowHeight - totalOffset);
  cnv.style('position', 'fixed');
  cnv.style('top', totalOffset + 'px');
  cnv.style('left', '0');
  cnv.style('z-index', '0');
  cnv.style('pointer-events', 'auto'); // Full interaction enabled
  // **********************************************************************
drawingLayer = createGraphics(windowWidth, windowHeight - totalOffset);
  drawingLayer.clear();
   drawingLayer.style('z-index', '2');
 fractalLayer = createGraphics(windowWidth, windowHeight - totalOffset); // <--- NEW
fractalLayer.clear();

  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640 , 400);
  video.hide();
 
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  osc1= new p5.Oscillator('triangle')

  osc1.start()

  osc1.amp(0)
  osc1.disconnect()

  

  
  
  reverb = new p5.Reverb();
  reverb.process(osc1, 2.5, 2);
  //*************************************************************************
  //background(255);
  
  setupLinkFractals()
 initVoice(); 
}

function draw() {
  userStartAudio()
  strokeWeight(.5)
  stroke(c)
  fill(c)
 background('white')
  // Display the persistent drawing layer on top of white background
  image(drawingLayer, 0, 0);
  
 for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
  
  

    if (i==0){

  fill(c)
      thumb=hand.keypoints[4]
      pointer= hand.keypoints[8]
      
      let drawPtX= pointer.x
      let drawPtY= pointer.y


      let pinch= dist(thumb.x,thumb.y ,pointer.x, pointer.y)
      if (pinch<40){
        drawing=true
        if(!playing){
       
      osc1.freq(note1)
        osc1.amp(1,.5)
      playing=true
          
         
          
          
        }
        if (pointer){
        let currentX = width - (pointer.x * width / video.width);
  let currentY = pointer.y * height / video.height;
          
          if (prevPointerX !== null && prevPointerY !== null) {
            // Draw a line connecting the previous point to current point
            drawingLayer.stroke(c);
            drawingLayer.strokeWeight(sw);
         
      //      let steps = dist(prevPointerX, prevPointerY, currentX, currentY) / 5;
      //      interpolatePoints(prevPointerX, prevPointerY, currentX, currentY, steps)
           drawingLayer.strokeCap(ROUND); // Makes line ends rounded
            drawingLayer.line(prevPointerX, prevPointerY, currentX, currentY); 
          }
          
          prevPointerX = currentX;
          prevPointerY = currentY;
          print('drawing T')
        }
        
      } else if(pinch>50) {
        drawing=false
        prevPointerX = null; // Reset when not drawing
        prevPointerY = null;
        if (playing){
          osc1.amp(0,.5)
          playing=false
        }
      }
        
      }else {
   
         
          
                if (playing){
          osc1.amp(0,.5)
          playing=false
          drawing=false
                   
        }}
  if (!playing && thumb && pointer){
      let thumbX = width - (thumb.x * width / video.width);
      let thumbY = thumb.y * height / video.height;
      let pointerX = width - (pointer.x * width / video.width);
      let pointerY = pointer.y * height / video.height;
      
      circle(thumbX, thumbY, 10)
      circle(pointerX, pointerY, 10)
      
      if (cont%2==1){
        strokeWeight(sw)   
        line(pointerX, pointerY, thumbX, thumbY)
      } 
    }
  
  
 
 if (clickF){
    // draw one frame onto the overlay layer
    growFractal(fractalLayer, fractalX, fractalY);
  } else {
    // when not animating, keep overlay cleared
    fractalLayer.clear();
  }

  // Composite overlay last so it appears above drawingLayer and hand dots
  image(fractalLayer, 0, 0);

  if (cont%2==1){
    strokeWeight(sw)   
    line(pointerX, pointerY, thumbX, thumbY)
  }
}
}

function doubleClicked(){
  cont++
}

function keyPressed(){
 
  
 // STROKE:  
  if (key == 'b'){
    c = 'blue'
    note1= ePhr[5]
  }
  if (key == 'y'){
    c = 'yellow'
    note1= ePhr[3]
  }
  if (key == 'r'){
    c = 'red'
    note1= ePhr[1]
  }
  if (key == 'g'){
    c = 'green'
    note1= ePhr[4]
  }
  if (key == 'p'){
    c = 'purple'
    note1= ePhr[6]
  }
  if (key == 'o'){
    c = 'orange'
    note1= ePhr[2]
  }
  if (key == 't'){
    c = 'turquoise'
    note1= thumbX
  }
  if (key == '0'){
    c = 'black'
    note1= ePhr[7]
  }
  if (key == 'e'){
    c = 'white'
    note1= ePhr[0]
  }
  
  // WEIGHT:
  if (keyCode== UP_ARROW){
    sw+=3
  }
  if (keyCode==DOWN_ARROW){
    if (sw>1){
      sw-=1
    }else{
      sw=sw
    }
  }
   if (keyCode==32){
    strokeWeight(.5)
     drawingLayer.clear();
    //resets background when spacebar is pressed

 cont=0 
   }
  
 
  // === Voice HUD ===
push();
const hud = `🎤 ${voiceLabel ? voiceLabel.toUpperCase() : ""}  ${(voiceConf*100|0)}%`;
textSize(16);
noStroke();
fill(0, 160);
rect(10, height - 38, textWidth(hud) + 16, 28, 8);
fill(255);
textAlign(LEFT, CENTER);
text(hud, 18, height - 24);
pop();

}

function windowResized() {
  let nav = document.querySelector('nav');
  let navHeight = nav ? nav.offsetHeight : 80;
  
  resizeCanvas(windowWidth, windowHeight - navHeight);
  cnv.style('top', navHeight + 'px');
}

function setupLinkFractals() {
  const navLinks = document.querySelectorAll('.nav-links a, .nav-links-column a');
  console.log('Found', navLinks.length, 'navigation links');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      // Don’t navigate yet
      event.preventDefault();

      const destination = this.getAttribute('href');

      // Measure the p5 canvas
      const canvas = document.querySelector('#defaultCanvas0') || document.querySelector('canvas');
      const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

      // Compute click relative to the canvas, then CLAMP into the canvas
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      x = Math.max(0, Math.min(x, rect.width  - 1));
      y = Math.max(0, Math.min(y, rect.height - 1));

      // If we somehow don’t have a canvas yet, fall back to center
      if (!canvas) {
        x = window.innerWidth  / 2;
        y = window.innerHeight / 2;
      }

      fractalX = x;
      fractalY = y;

      // Trigger fractal + lift canvas above everything
      clickF = true;
      rad = 50;

      // Hide overlays so canvas is visible
      hideHTMLElements();

      // Force canvas to the very top even if CSS has !important elsewhere
      const el = canvas;
      if (el) el.style.setProperty('z-index', '10000', 'important');

      console.log('Fractal at', { x: fractalX, y: fractalY, rect });

      // Navigate after animation
      setTimeout(() => {
        // (optional) showHTMLElements(); // only if you cancel navigation
        window.location.href = destination;
      }, 2000);
    });
  });
}

function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}


function startStop(osc){

  osc.amp(1, 0.1);   // go to 0.5 amplitude in 0.05s
  osc.amp(0, 0.2, 0.1);

}

    


function drawCircles(g, x, y, radius) {
  g.noFill();
  g.strokeWeight(20);
  g.circle(x, y, radius * 2 * noise(.053*(frameCount % 45)));

  if (radius > 50) {
    g.stroke('yellow');
    drawCircles(g, x + radius / 2, y, radius / 2);

    g.strokeWeight(19);
    g.stroke('red');
    drawCircles(g, x - radius / 2, y, radius / 2);

    g.strokeWeight(20);
    g.stroke('blue');
    drawCircles(g, x, y + radius / 2, radius / 2);

    g.strokeWeight(19);
    g.stroke('black');
    drawCircles(g, x, y - radius / 2, radius / 2);
  }
}


function growFractal(g, x, y){
  if (rad < windowWidth * 3){
    rad += 50;
    drawCircles(g, x, y, rad);
  } else {
    clickF = false;
    rad = 50;
  }
}

// Initialize the Teachable Machine audio model
async function initVoice() {
  try {
    recognizer = speechCommands.create(
      "BROWSER_FFT",
      undefined,
      TM_BASE + "model.json",
      TM_BASE + "metadata.json"
    );
    await recognizer.ensureModelLoaded();
    tmLabels = recognizer.wordLabels(); // class names from your model
    voiceLabel = "listening...";

    recognizer.listen(onVoiceResult, {
      probabilityThreshold: 0.6, // tweak if it misses you; 0.5–0.65 is typical
      overlapFactor: 0.5,
      includeSpectrogram: false
    });
  } catch (e) {
    console.error("Voice init failed:", e);
    voiceLabel = "mic/model error";
  }
}

// Handle audio inference results
function onVoiceResult(result) {
  const { scores } = result; // Float32Array aligned with tmLabels
  if (!scores || !tmLabels || tmLabels.length !== scores.length) return;

  // argmax
  let bestI = 0, bestV = -1;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] > bestV) { bestV = scores[i]; bestI = i; }
  }
  voiceLabel = tmLabels[bestI] || "";
  voiceConf  = bestV || 0;

  // only apply when fairly confident and not spamming changes
  const now = performance.now();
  if (voiceConf >= 0.7 && (voiceLabel !== lastVoiceLabel || (now - lastSetMs) > VOICE_SET_COOLDOWN)) {
    applyVoiceCommand(voiceLabel);
    lastVoiceLabel = voiceLabel;
    lastSetMs = now;
  }
}

// Map labels to your sketchpad controls
function applyVoiceCommand(lbl) {
  const s = (lbl || "").toLowerCase().trim();

  // synonyms + single-letter shortcuts you trained
  if (s.includes("red") || s === "r") {
    c = "red";         note1 = ePhr[1];   return;
  }
  if (s.includes("orange") || s === "o") {
    c = "orange";      note1 = ePhr[2];   return;
  }
  if (s.includes("yellow") || s === "y") {
    c = "yellow";      note1 = ePhr[3];   return;
  }
  if (s.includes("green") || s === "g") {
    c = "green";       note1 = ePhr[4];   return;
  }
  if (s.includes("blue") || s === "b") {
    c = "blue";        note1 = ePhr[5];   return;
  }
  if (s.includes("purple") || s === "p") {
    c = "purple";      note1 = ePhr[6];   return;
  }
  if (s.includes("black") || s === "0" || s === "zero") {
    c = "black";       note1 = ePhr[7];   return;
  }
  if (s.includes("turquoise") || s.includes("teal") || s === "t") {
    c = "turquoise";   note1 = ePhr[4];   return;
  }
  if (s.includes("erase") || s.includes("eraser") || s.includes("white")) {
    c = "white";       note1 = ePhr[0];   return;
  }
  // add more phrases if your model has them (e.g., “thicker”, “thinner”, etc.)
}


function hideHTMLElements() {
  // Hide navigation
  let nav = document.querySelector('nav')
  if (nav) nav.style.display = 'none'
  
  // Hide navigation columns but NOT the main container (which contains the canvas)
  let navColumns = document.querySelectorAll('.nav-links-column')
  navColumns.forEach(col => {
    if (col) col.style.display = 'none'
  })
  
  // Hide instructions overlay (information box)
  let instructionsOverlay = document.querySelector('#instructions-overlay')
  if (instructionsOverlay) instructionsOverlay.style.display = 'none'
  
  // Hide content div
  let content = document.querySelector('.content')
  if (content) content.style.display = 'none'
  
 
  
  // Hide any text content in main but keep the main container visible
  let textElements = document.querySelectorAll('main p, main h1, main h2, main h3, main div:not(canvas)')
  textElements.forEach(el => {
    if (el) el.style.display = 'none'
  })
  
  // Hide any other visible elements
  let header = document.querySelector('header')
  if (header) header.style.display = 'none'
  
  let footer = document.querySelector('.footer')
  if (footer) footer.style.display = 'none'

 let infoUI = document.querySelector('.info-ui');
  if (infoUI) infoUI.style.display = 'none';

 let mlToggle = document.querySelector('#ml-toggle-container')
  if (mlToggle) mlToggle.style.display = 'none'
}

function showHTMLElements() {
  // Show navigation
  let nav = document.querySelector('nav')
  if (nav) nav.style.display = 'block'
  
  // Show navigation columns
  let navColumns = document.querySelectorAll('.nav-links-column')
  navColumns.forEach(col => {
    if (col) col.style.display = 'block'
  })
  
  // Show instructions overlay (information box)
  let instructionsOverlay = document.querySelector('#instructions-overlay')
  if (instructionsOverlay) instructionsOverlay.style.display = 'block'
  
  // Show content div
  let content = document.querySelector('.content')
  if (content) content.style.display = 'block'
  
  // Show vanta background
  let vantaBg = document.querySelector('#vanta-bg')
  if (vantaBg) vantaBg.style.display = 'block'
  
  // Show text content in main
  let textElements = document.querySelectorAll('main p, main h1, main h2, main h3, main div:not(canvas)')
  textElements.forEach(el => {
    if (el) el.style.display = 'block'
  })
  
  // Show other elements
  let header = document.querySelector('header')
  if (header) header.style.display = 'block'
  
  let footer = document.querySelector('.footer')
  if (footer) footer.style.display = 'block'
}






