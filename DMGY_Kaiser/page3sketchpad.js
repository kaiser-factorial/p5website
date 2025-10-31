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
  
  background(255);
  
  setupLinkFractals()
}

function draw() {
print(cont)
  strokeWeight(.5)
  stroke(c)
  
  if (mouseIsPressed){
    strokeWeight(sw)
    line(mouseX, mouseY, pmouseX, pmouseY)
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
    line(mouseX, mouseY, pmouseX, pmouseY)
  } 
}

function doubleClicked(){
  cont++
}

function keyPressed(){
 
  
 // STROKE:  
  if (key == 'b'){
    c='blue'
    
  }
  if (key == 'y'){
    c='yellow'
  }
  if (key == 'r'){
    c='red'
  }
  if (key=='g'){
    c='green'
  }
  if (key=='p'){
    c='purple'
  }
  if (key=='o'){
    c='orange'
  }
  if (key =='t'){
    c='turquoise'
  }
  if (key=='0'){
    c='black'
  }
  if (key== 'e'){
    c='white'
  }
  
  // WEIGHT:
  if (keyCode== UP_ARROW){
    sw++
  }
  if (keyCode==DOWN_ARROW){
    if (sw>1){
      sw--
    }else{
      sw=sw
    }
  }
   if (keyCode==32){
    strokeWeight(.5)
     background(255)
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





