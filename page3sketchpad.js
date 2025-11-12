let drawingLayer;
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
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640 , 400);
 // video.hide();
 
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
        let note1= cMaj[0]
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
  if (!playing){
    let thumbX = width - (thumb.x * width / video.width);
  let thumbY = thumb.y * height / video.height;
  let pointerX = width - (pointer.x * width / video.width);
  let pointerY = pointer.y * height / video.height;
  
  circle(thumbX, thumbY, 10)
  circle(pointerX, pointerY, 10)
 }
  
  if (clickF){
    // Boost canvas z-index to appear over navigation and text when fractal is active
    cnv.style('z-index', '2000');
    growFractal(fractalX, fractalY)
  } else {
    // Reset z-index when fractal is not active
    cnv.style('z-index', '0');
  }

  if (cont%2==1){
    strokeWeight(sw)   
    line(pointerX, pointerY, thumbX, thumbY)
  } 
}

function doubleClicked(){
  cont++
}

function keyPressed(){
 
  
 // STROKE:  
  if (key == 'b'){
    c = 'blue'
  }
  if (key == 'y'){
    c = 'yellow'
  }
  if (key == 'r'){
    c = 'red'
  }
  if (key == 'g'){
    c = 'green'
  }
  if (key == 'p'){
    c = 'purple'
  }
  if (key == 'o'){
    c = 'orange'
  }
  if (key == 't'){
    c = 'turquoise'
  }
  if (key == '0'){
    c = 'black'
  }
  if (key == 'e'){
    c = 'white'
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
  
 
  
}

function windowResized() {
  let nav = document.querySelector('nav');
  let navHeight = nav ? nav.offsetHeight : 80;
  
  resizeCanvas(windowWidth, windowHeight - navHeight);
  cnv.style('top', navHeight + 'px');
}

function setupLinkFractals() {
  // Get all navigation links - works for both column and horizontal layouts
  let navLinks = document.querySelectorAll('.nav-links a, .nav-links-column a')
  
  console.log('Found', navLinks.length, 'navigation links') // Debug info
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      console.log('Click detected on link:', this.textContent) // Debug info
      
      // Prevent the default link behavior temporarily
      event.preventDefault()
      
      // Store the link's destination
      let destination = this.getAttribute('href')
      
      // Get the click position relative to the canvas
      let canvas = document.querySelector('canvas') || document.querySelector('main canvas')
      if (canvas) {
        let rect = canvas.getBoundingClientRect()
        fractalX = event.clientX - rect.left
        fractalY = event.clientY - rect.top
      } else {
        // Fallback to click position
        fractalX = event.clientX
        fractalY = event.clientY
      }
      
      // Trigger fractal
      clickF = true
      rad = 50 // Reset radius
      
      // Hide HTML elements during fractal
      hideHTMLElements()
      
      console.log('Link clicked:', destination, 'at position:', fractalX, fractalY)
      
      // Navigate to the destination after fractal completes
      setTimeout(() => {

        window.location.href = destination
      }, 2000)
    })
  })
}


function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}


function startStop(osc){

  osc.amp(1, 0.1);   // go to 0.5 amplitude in 0.05s
  osc.amp(0, 0.2, 0.1);

}

    


function drawCircles(x, y, radius) {

  noFill();
  strokeWeight(20)

  circle(x, y, radius * 2*noise(.053*(frameCount%45)));
  if (radius > 50) {
    //{!4} drawCircles() calls itself four times.
 
    stroke('yellow')
    drawCircles(x + radius / 2, y, radius / 2)
    strokeWeight(19)
    stroke('red')
    drawCircles(x - radius / 2, y, radius / 2)
    strokeWeight(20)
    stroke('blue')
    drawCircles(x, y + radius / 2, radius / 2)
    strokeWeight(19)
    stroke('black')
    drawCircles(x, y - radius / 2, radius / 2)
  }
}



function growFractal(x,y){
  print("growing")
  if (rad < windowWidth*3){
    rad += 50
    drawCircles(x, y, rad)
  } else {
    // Reset fractal when it reaches max size
    clickF = false
    rad = 50
  }
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






