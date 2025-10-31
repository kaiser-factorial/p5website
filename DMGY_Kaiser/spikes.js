let rad=50
let fractalX = 0
let fractalY = 0

let hit= false
let phit=false

let clickF=false
let ct=12
let swap = false
let r;
let g;
let b;
let p
let q
let s
var cnv;

function centerCanvas() {
  // Position canvas to start right after the navigation bar
  cnv.position(0, 0);
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('position', 'fixed');
  cnv.style('top', '0');
  cnv.style('left', '0');
  cnv.style('z-index', '-1'); // Start behind navigation
  
  background(255, 0, 200);
  r=random(85)
  g=random(85)
  b=random(85)
  p=r
  q=g
  s=b

  setupLinkFractals()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {
  background(255);

  for (let i=0; i<2*PI; i+= PI/ct){
    line(width/2, height/2, width/2+mouseX*cos(i), height/2+mouseY*sin(i))
    fill(color(i*r, i*g, i*b));
    ellipse(width/2+mouseX*cos(i), height/2+mouseY*sin(i), 30)

  }
  
  if (mouseIsPressed){
    ct=int(random(2,36))
    strokeWeight(random(1, 5))
    r=random(85)
g=random(85)
b=random(85)
p=r
q=g
s+=random(-10,10)
  }
  
  autoswap()

  if (clickF){
    // Boost canvas z-index to appear over nav when fractal is active
    cnv.style('z-index', '2000');
    growFractal(fractalX, fractalY)
  } else {
    // Reset z-index when fractal is not active - keep it behind navigation
    cnv.style('z-index', '-1');
  }
}

function autoswap(){
  if(swap == true){
p= ((frameCount%56)*noise(frameCount*.01))
q= ((frameCount%50)*cos(frameCount))
s= ((frameCount%31)*sin((PI/360)*frameCount))
    r= (p*1.5)+noise(frameCount)- noise(frameCount*.1)
    g= p+noise(frameCount)- noise(frameCount*.1)
    b= 2*p+noise(frameCount)- noise(frameCount*.1)
    ct = abs(int(noise(frameCount*.001)*p-int(noise(frameCount*.001)*s)));
  }
}
function keyTyped(){

    swap=!swap
    autoswap()

}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
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
      let canvas = document.querySelector('canvas')
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
      
      setTimeout(() => {
        showHTMLElements() // Show elements again before navigation
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
  
  // Hide navigation links but NOT the main container (which contains the canvas)
  let navLinks = document.querySelectorAll('.nav-links')
  navLinks.forEach(links => {
    if (links) links.style.display = 'none'
  })
  
  // Hide instructions overlay (information box)
  let instructionsOverlay = document.querySelector('#instructions-overlay')
  if (instructionsOverlay) instructionsOverlay.style.display = 'none'
  
  // Hide content div
  let content = document.querySelector('.content')
  if (content) content.style.display = 'none'
  
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
  
  // Hide audio button if it exists
  let audioButton = document.querySelector('.audio-button, #audioButton')
  if (audioButton) audioButton.style.display = 'none'
}

function showHTMLElements() {
  // Show navigation
  let nav = document.querySelector('nav')
  if (nav) nav.style.display = 'block'
  
  // Show navigation links
  let navLinks = document.querySelectorAll('.nav-links')
  navLinks.forEach(links => {
    if (links) links.style.display = 'block'
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
  
  // Show audio button if it exists
  let audioButton = document.querySelector('.audio-button, #audioButton')
  if (audioButton) audioButton.style.display = 'block'
}





