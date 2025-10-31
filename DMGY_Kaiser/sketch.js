let osc1
let cMaj= [261.63, 293.66, 329.6, 349.23, 392.00, 440.00, 493.88, 523.25]
let note
let mapNote
let sent=["Tom didn't tell us how big your house was",
"Where is the President right now?", 
"Would you like your cash in tens or twenties?", 
"How often do you see George?", 
"It's as clear as mud.", 
"She desperately wanted an order of Kung Pao chicken.",
"The big, yellow bus came hurtling down the street.", 
"He finally answered the question no one asked.", 
"The cat's pajamas are missing again."]

let nextpage

let x=50
let y=50
let xV=10
let yV=10


let rad=50
let fractalX = 0
let fractalY = 0

let hit= false
let phit=false

let clickF=false

let xV1=5
let yV1=20
let xV2=12
let yV2=8
let xV3=20
let yV3=14
let xV4=16
let yV4=2
let xV5=15
let yV5=8
let xV6=18
let yV6=13
let xV7=12
let yV7=19
let xV8=12
let yV8=7
let xV9=11
let yV9=9
let xV0=60
let yV0=13

let x1=3
let y1=32
let x2=4
let y2=422
let x3=5
let y3=52
let x4=63
let y4=6
let x5=7
let y5=7
let x6=82
let y6=8
let x7=9
let y7=9
let x8=103
let y8=102
let x9=11
let y9=112
let x0=122
let y0=12
let click=false

let flyer
let link2
let flyers=[]
let hellos=[]

let enableSoundButton
let sentenceButton
let lastButtonTime = 0
let audioEnabled = false

let col, col1, col2;
let p;

// Canvas variable for z-index control
let cnv;

// Trail arrays for each flyer
let trails = []
let trailLength = 15  // Back to longer trails

// Bold colors with yellows and pure blues
let trailColors = [
  [255, 0, 0],      // Pure red
  [0, 100, 200],    // Dark blue
  [255, 215, 0],    // Gold
  [255, 255, 0],    // Bright yellow
  [255, 255, 255],  // White
  [255, 0, 0],      // Pure red (repeat)
  [0, 0, 139],      // Dark blue
  [255, 193, 7],    // Amber yellow
  [0, 0, 0],        // Black
  [255, 235, 59]    // Light yellow
]

function setup() {
  // Check if p5.js loaded properly
  if (typeof p5 === 'undefined') {
    console.error('p5.js library failed to load');
    return;
  }
  
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('position', 'fixed');
  cnv.style('top', '0');
  cnv.style('left', '0');
  cnv.style('z-index', '0');
  cnv.style('pointer-events', 'none'); // Allow clicks to pass through when not active

  
  flyer1= select("#fly1")
  flyer2= select("#fly2")
  flyer3= select("#fly3")
  flyer4= select("#fly4")
  flyer5= select("#fly5")
  flyer6= select("#fly6")
  flyer7= select("#fly7")
  flyer8= select("#fly8")
  flyer9= select("#fly9")
  flyer0= select("#fly0")
  flyers.push(flyer1, flyer2, flyer3, flyer4, flyer5, flyer6, flyer7, flyer8, flyer9, flyer0)
  
  // Initialize trail arrays for each flyer
  for (let i = 0; i < 10; i++) {
    trails[i] = []
  }
  
  // Initialize oscillator
  osc1 = new p5.Oscillator('triangle')

  osc1.amp(0)    // Start silent
  osc1.start()   // Start the oscillator
  console.log("Oscillator initialized")
  note = cMaj[6]

  // Create enable sound button
  enableSoundButton = createButton('')
  enableSoundButton.style('padding', '10px 20px')
  enableSoundButton.size(100, 50)
  enableSoundButton.style('font-size', '16px')
  enableSoundButton.style('font-family', 'Times New Roman, serif')
  enableSoundButton.style('background-color', 'yellow')
  enableSoundButton.style('color', 'black')
  enableSoundButton.style('border', 'none')
  enableSoundButton.style('border-radius', '5px')
  enableSoundButton.style('cursor', 'pointer')
  enableSoundButton.style('position', 'fixed')
  enableSoundButton.style('top', '50%')
  enableSoundButton.style('left', '50%')
  enableSoundButton.style('transform', 'translate(-50%, -50%)')
  enableSoundButton.style('z-index', '1000')
  enableSoundButton.mousePressed(enableSound)

  col1=color(255,255,255)

  // Add event listeners to navigation links to trigger fractal
  setupLinkFractals()

}

function enableSound() {
  // Start audio context and enable sound
  userStartAudio();
  
  enableSoundButton.html('Welcome!');
  enableSoundButton.style('background-color', 'red');
  enableSoundButton.style('color', 'white');
  
  // Hide button after a short delay
  setTimeout(() => {
    enableSoundButton.hide();
  }, 2000);
}

function draw() {

  // When fractal is active, use a dark background for visibility
  // Otherwise, keep canvas transparent for Vanta clouds
  if (clickF) {
    background(0, 0, 0, 200) // Semi-transparent dark background during fractal
  } else {
    clear() // Makes the canvas transparent when no fractal
  }
  
  try {
    // Update trail positions for each flyer
    let flyerPositions = [
      {x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4}, {x: x5, y: y5},
      {x: x6, y: y6}, {x: x7, y: y7}, {x: x8, y: y8}, {x: x9, y: y9}, {x: x0, y: y0}
    ]
    
    // Add current positions to trails (every 2 frames for smooth trails)
    if (frameCount % 2 == 0) {
      for (let i = 0; i < 10; i++) {
        trails[i].push({x: flyerPositions[i].x, y: flyerPositions[i].y})
        if (trails[i].length > trailLength) {
          trails[i].shift()
        }
      }
    }
    
    // Draw full trails with fade effect
    noStroke()
    for (let i = 0; i < 10; i++) {
      let baseColor = trailColors[i]
      
      // Draw all trail points with fade
      for (let j = 0; j < trails[i].length; j++) {
        let alpha = map(j, 0, trails[i].length - 1, 30, 180)
        fill(baseColor[0], baseColor[1], baseColor[2], alpha)
        let circleSize = map(j, 0, trails[i].length - 1, 3, 10)
        ellipse(trails[i][j].x, trails[i][j].y, circleSize)
      }
    }
    
    
    // Spawn new hellos occasionally (about 2 per second), but limit total number
    if (frameCount % 30 == 0) {
      hellos.push({
        x: random(windowWidth),
        y: random(windowHeight),
        timer: 240, // Will disappear after 240 frames (4 seconds at 60fps)
        size: random(12, 75),
        color: color(255,255,255,255)
       // color: color(random(255), random(255), random(255), 255) // Added alpha value
      })
      
      // Play sound when hello appears
      mapNote = map(hellos[hellos.length-1].y, 0, windowHeight, 7.99, 0)
      note = cMaj[floor(mapNote)]
      let freq1 = note
      osc1.freq(freq1)
      startStop(osc1)
      print("sound - y:", hellos[hellos.length-1].y, "mapNote:", mapNote, "index:", floor(mapNote), "freq:", freq1)
    }
    
    // Draw and update existing hellos
    for (let i = hellos.length - 1; i >= 0; i--) {
      let hello = hellos[i];
      
      // Set text properties
      fill(hello.color)
      textSize(hello.size)
      textAlign(CENTER, CENTER)
      
      // Draw the hello
      text("Hello", hello.x, hello.y);
      
      // Decrease timer
      hello.timer--;
      
      // Remove if timer expired
      if (hello.timer <= 0) {
        hellos.splice(i, 1);
      }
    }
  } catch (error) {
    console.log("Error in hellos/trails:", error)
  }

  phit=hit
  
  // No longer trigger fractal on any mouse press
  // Fractal will only trigger when links are clicked (handled in setup)
  
  // Draw fractal if it's been triggered by a link click
  if (clickF){
    // Boost canvas z-index to appear over navigation and text when fractal is active
    cnv.style('z-index', '2000');
    cnv.style('pointer-events', 'auto');
    console.log('Fractal active - z-index set to 2000, rad:', rad); // Debug
    growFractal(fractalX, fractalY)
  } else {
    // Reset z-index when fractal is not active
    cnv.style('z-index', '0');
    cnv.style('pointer-events', 'none');
  }

  // Position flyers - this should always continue
  if (flyer1) flyer1.position(x1, y1)
  if (flyer2) flyer2.position(x2, y2)
  if (flyer3) flyer3.position(x3, y3)
  if (flyer4) flyer4.position(x4, y4)
  if (flyer5) flyer5.position(x5, y5)
  if (flyer6) flyer6.position(x6, y6)
  if (flyer7) flyer7.position(x7, y7)
  if (flyer8) flyer8.position(x8, y8)
  if (flyer9) flyer9.position(x9, y9)
  if (flyer0) flyer0.position(x0, y0)
   
  // Check boundaries for each flyer individually
  if (x1 < 2 || x1 > windowWidth - 20) { xV1 = -xV1 }
  if (x2 < 2 || x2 > windowWidth - 20) { xV2 = -xV2 }
  if (x3 < 2 || x3 > windowWidth - 20) { xV3 = -xV3 }
  if (x4 < 2 || x4 > windowWidth - 20) { xV4 = -xV4 }
  if (x5 < 2 || x5 > windowWidth - 20) { xV5 = -xV5 }
  if (x6 < 2 || x6 > windowWidth - 20) { xV6 = -xV6 }
  if (x7 < 2 || x7 > windowWidth - 20) { xV7 = -xV7 }
  if (x8 < 2 || x8 > windowWidth - 20) { xV8 = -xV8 }
  if (x9 < 2 || x9 > windowWidth - 20) { xV9 = -xV9 }
  if (x0 < 2 || x0 > windowWidth - 20) { xV0 = -xV0 }
  
  if (y1 < 2 || y1 > windowHeight - 20) { yV1 = -yV1 }
  if (y2 < 2 || y2 > windowHeight - 20) { yV2 = -yV2 }
  if (y3 < 2 || y3 > windowHeight - 20) { yV3 = -yV3 }
  if (y4 < 2 || y4 > windowHeight - 20) { yV4 = -yV4 }
  if (y5 < 2 || y5 > windowHeight - 20) { yV5 = -yV5 }
  if (y6 < 2 || y6 > windowHeight - 20) { yV6 = -yV6 }
  if (y7 < 2 || y7 > windowHeight - 20) { yV7 = -yV7 }
  if (y8 < 2 || y8 > windowHeight - 20) { yV8 = -yV8 }
  if (y9 < 2 || y9 > windowHeight - 20) { yV9 = -yV9 }
  if (y0 < 2 || y0 > windowHeight - 20) { yV0 = -yV0 }


    x1+=xV1
    y1+=yV1
    x2+=xV2
    y2+=yV2
    x3+=xV3
    y3+=yV3
    x4+=xV4
    y4+=yV4
    x5+=xV5
    y5+=yV5
    x6+=xV6
    y6+=yV6
    x7+=xV7
    y7+=yV7
    x8+=xV8
    y8+=yV8
    x9+=xV9
    y9+=yV9
    x0+=xV0
    y0+=yV0

}
function startStop(osc){
 // Make sure oscillator is connected and audible
 osc.amp(1, 0.1);   
 osc.amp(0, 0.3, 1); // fade to 0 amplitude after 0.4s delay, over 0.3s
}

function mousePressed(){
    userStartAudio();
    enableSound()
}   



function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
}

function setupLinkFractals() {
  // Get all navigation links from both columns
  let navLinks = document.querySelectorAll('.nav-links-column a')
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Prevent the default link behavior temporarily
      event.preventDefault()
      
      // Store the link's destination
      let destination = this.getAttribute('href')
      
      // Get the click position relative to the canvas
      let rect = document.querySelector('main canvas').getBoundingClientRect()
      fractalX = event.clientX - rect.left
      fractalY = event.clientY - rect.top
      
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
  
 
  
  // Hide vanta background
  let vantaBg = document.querySelector('#vanta-bg')
  if (vantaBg) vantaBg.style.display = 'none'
  
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
  
  // Hide enable sound button if it exists and is visible
  if (enableSoundButton && enableSoundButton.style('display') !== 'none') {
    enableSoundButton.hide()
  }
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







