let rad=50
let fractalX = 0
let fractalY = 0

let hit= false
let phit=false

let clickF=false
var cnv;

let x=50
let y=50
let xV=10
let yV=10

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

let click=false

let flyer
let link2
let flyers=[]



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
  [0, 0, 139]       // Dark blue
]

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('position', 'fixed');
  cnv.style('top', '0');
  cnv.style('left', '0');
  cnv.style('z-index', '-1'); // Start behind navigation
  cnv.style('pointer-events', 'none');
  
  flyer1= select("#fly1")
  flyer2= select("#fly2")
  flyer3= select("#fly3")
  flyer4= select("#fly4")
  flyer5= select("#fly5")
  flyer6= select("#fly6")
  flyer7= select("#fly7")

  flyers.push(flyer1, flyer2, flyer3, flyer4, flyer5, flyer6, flyer7)
 for (let i = 0; i < 7; i++) {
    trails[i] = []
  }
  setupLinkFractals()
}

function draw() {
  // When fractal is active, use a dark background for visibility
  // Otherwise, keep canvas transparent

  clear()
  
  if (flyer1) flyer1.position(x1, y1)
  if (flyer2) flyer2.position(x2, y2)
  if (flyer3) flyer3.position(x3, y3)
  if (flyer4) flyer4.position(x4, y4)
  if (flyer5) flyer5.position(x5, y5)
  if (flyer6) flyer6.position(x6, y6)
  if (flyer7) flyer7.position(x7, y7)

   
  // Check boundaries for each flyer individually
  if (x1 < 2 || x1 > windowWidth - 20) { xV1 = -xV1 }
  if (x2 < 2 || x2 > windowWidth - 20) { xV2 = -xV2 }
  if (x3 < 2 || x3 > windowWidth - 20) { xV3 = -xV3 }
  if (x4 < 2 || x4 > windowWidth - 20) { xV4 = -xV4 }
  if (x5 < 2 || x5 > windowWidth - 20) { xV5 = -xV5 }
  if (x6 < 2 || x6 > windowWidth - 20) { xV6 = -xV6 }
  if (x7 < 2 || x7 > windowWidth - 20) { xV7 = -xV7 }

  
  if (y1 < 2 || y1 > windowHeight - 20) { yV1 = -yV1 }
  if (y2 < 2 || y2 > windowHeight - 20) { yV2 = -yV2 }
  if (y3 < 2 || y3 > windowHeight - 20) { yV3 = -yV3 }
  if (y4 < 2 || y4 > windowHeight - 20) { yV4 = -yV4 }
  if (y5 < 2 || y5 > windowHeight - 20) { yV5 = -yV5 }
  if (y6 < 2 || y6 > windowHeight - 20) { yV6 = -yV6 }
  if (y7 < 2 || y7 > windowHeight - 20) { yV7 = -yV7 }



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
let flyerPositions = [
      {x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4}, {x: x5, y: y5},
      {x: x6, y: y6}, {x: x7, y: y7}
    ]
     if (frameCount % 2 == 0) {
      for (let i = 0; i < 7; i++) {
        trails[i].push({x: flyerPositions[i].x, y: flyerPositions[i].y})
        if (trails[i].length > trailLength) {
          trails[i].shift()
        }
      }
    }
  
// Draw full trails with fade effect
    noStroke()
    for (let i = 0; i < 7; i++) {
      let baseColor = trailColors[i]
      
      // Draw all trail points with fade
      for (let j = 0; j < trails[i].length; j++) {
        let alpha = map(j, 0, trails[i].length - 1, 10, 100)
        fill(baseColor[0], baseColor[1], baseColor[2], alpha)
        let circleSize = map(j, 0, trails[i].length - 1, 3, 10)
        ellipse(trails[i][j].x, trails[i][j].y, circleSize)
      }
    }

    if (clickF){
    // Boost canvas z-index to appear over navigation and text when fractal is active
    cnv.style('z-index', '2000');
    cnv.style('pointer-events', 'auto');
    growFractal(fractalX, fractalY)
  } else {
    // Reset z-index when fractal is not active - keep it behind navigation
    cnv.style('z-index', '-1');
    cnv.style('pointer-events', 'none');
  }

}

function setupLinkFractals() {
  // Get all navigation links - works for both column and horizontal layouts
  let navLinks = document.querySelectorAll('.nav-links a, .nav-links-column a')
  
  console.log('Found', navLinks.length, 'navigation links') // Debug info
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
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





