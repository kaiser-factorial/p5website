let osc1
let cMaj= [261.63, 293.66, 329.6, 349.23, 392.00, 440.00, 493.88, 523.25]
let note

// Fractal variables
let rad=50
let fractalX = 0
let fractalY = 0
let clickF=false
var cnv;

let g
let fires=[]
let catches=[]
let hearts=[]
let index=0
let h=3
//let goalSq=[]
let goal=4
let prog=0
let level = 1
let win= false
let start= true

var hit= false

var song
var song2
let playing=false
let songLoaded=false
let song2Loaded=false

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: true };

// Simple on-screen status HUD
let statusEl;
const statusState = { model: 'idle', webcam: 'init', audio: 'idle', faces: 0 };
function renderStatus() {
  if (!statusEl) return;
  statusEl.textContent = `Model: ${statusState.model} | Webcam: ${statusState.webcam} | Audio: ${statusState.audio} | Faces: ${statusState.faces}`;
}
function setStatus(part, value) {
  statusState[part] = value;
  renderStatus();
}

// Avoid heavy loads in preload to prevent hanging on some browsers
function preload(){
  song = loadSound('CatchFall/NikomasTheme8BB.mp3');
  song2 = loadSound('CatchFall/womp.mp3');
}

function setup() {
  // Get navigation height to calculate canvas size and position
  let nav = document.querySelector('nav');
  let navHeight = nav ? nav.offsetHeight : 80;
  
  cnv = createCanvas(windowWidth, windowHeight - navHeight);
  cnv.style('position', 'fixed');
  cnv.style('top', navHeight + 'px');
  cnv.style('left', '0');
  cnv.style('z-index', '0');
  cnv.style('pointer-events', 'auto'); // Keep auto for game interaction
  
  osc1= new p5.Oscillator('triangle')
  osc1.start()
  osc1.amp(0)
  g = new Guy(windowWidth/2)
  for (let k=0; k<h ; k++){
    hearts.push(new Heart(k, h))
  }
  // Create status HUD
  statusEl = document.createElement('div');
  statusEl.style.position = 'fixed';
  statusEl.style.left = '10px';
  statusEl.style.bottom = '10px';
  statusEl.style.padding = '6px 10px';
  statusEl.style.background = 'rgba(0,0,0,0.6)';
  statusEl.style.color = '#fff';
  statusEl.style.fontFamily = 'monospace';
  statusEl.style.fontSize = '12px';
  statusEl.style.borderRadius = '6px';
  statusEl.style.zIndex = '9999';
  statusEl.style.pointerEvents = 'none';
  document.body.appendChild(statusEl);
  renderStatus();
  
  video = createCapture(VIDEO, { flipped:true });
  video.size(windowWidth, windowHeight);
  video.hide();
  setStatus('webcam', 'requesting');
  // Webcam readiness events
  if (video && video.elt) {
    video.elt.addEventListener('loadedmetadata', () => setStatus('webcam', 'ready'));
    video.elt.addEventListener('canplay', () => setStatus('webcam', 'active'));
    video.elt.addEventListener('error', () => setStatus('webcam', 'error'));
  }
  
  // Defer facemesh start until model is created (after user gesture)
  setupLinkFractals()
}

function draw() {

  let freq1= note
  osc1.freq(freq1)
  
  
  if (level==1 || level== 6 || level==12){
  background(0)} 
  else if (level % 2 ==0){
    background('turquoise') }
    else if (level%3==0){ 
      background('green')}
      else{
        background(255)
      }
  
    
  
  if (start){

    fill('yellow')
    textSize(windowWidth/15)
    text('Move head L/R to move.\nCatch Yellow, Avoid Red.\nClick to Start.', windowWidth/6, windowHeight/3)
    noLoop()
  }
  
  g.makeGuy()
  g.moveGuy()
  
for (let i = 0; i < faces.length; i++) {
  let face = faces[i];
 {
      let keypoint = face.keypoints[10]
      
      g.x= keypoint.x
//      g.y= keypoint.y
 }}
  
h= hearts.length

for (let k=0; k<h ; k++){
  
  hearts[k].displayHeart(hearts.length)
}
if (h==0){
  song2.play()
  // Play the loss sound if it's loaded
  if (song2Loaded && song2) {
    song2.play()
  }
  textSize(windowWidth/15)
  text('You Lost on Level '+level+ ' :(', windowWidth/5, windowHeight/2)
  noLoop()
  
}
  
  
  
 for (let i=0; i<fires.length ; i++)
    {
       
      fires[i].rainFire()
      hit = collideRectCircle(g.x, g.y, g.s, g.s, fires[i].x, fires[i].y, fires[i].size)
      
      if (hit){
      fires.splice(i,1)
      hearts.pop()
        
      note= cMaj[1]
      let freq1= note
      osc1.freq(freq1)
      startStop(osc1)
      }
      
      if (fires[i].y > windowHeight){
        fires.splice(i, 1)
      }

    }
  
  if (frameCount%(45-(3*(level-1)))==0) {
    fires.push(new Fire())
    
    
  }
  
  for (let j=0; j< catches.length ; j++)
    {
       
      catches[j].rainCatches()
      caught = collideRectCircle(g.x, g.y, g.s, g.s, catches[j].x, catches[j].y, catches[j].size, catches[j].size)
      if (caught){
        prog+=1
        catches.splice(j,1)
        
        note= cMaj[6]
      let freq1= note
      osc1.freq(freq1)
      startStop(osc1)
        
      }

      if (catches.length>j && catches[j].y > windowHeight+60){
        catches.splice(j,1)
      }
    }
  
  for (let m=0 ; m< prog; m++){
          rect(m*(windowWidth/goal), windowHeight-100, windowWidth/goal, 30)
        }
  if (prog== goal){
    textSize(windowWidth/15)
    text('Level '+level+ ' Complete!\nClick for Level '+(level+1)+'.', windowWidth/4, windowHeight/3)
    win =true 
    note= cMaj[4]
      let freq1= note
      osc1.freq(freq1)
      startStop(osc1)
    
  }
  if (win){
    noLoop()
  }

      
  
  if (frameCount%(60-2*level)==0){
     catches.push(new Catch())
  }
  
  // Handle fractal animations
  if (clickF){
    // Boost canvas z-index to appear over navigation and text when fractal is active
    cnv.style('z-index', '2000');
    growFractal(fractalX, fractalY)
  } else {
    // Reset z-index when fractal is not active
    cnv.style('z-index', '0');
  }
 
}

function windowResized(){
  let nav = document.querySelector('nav');
  let navHeight = nav ? nav.offsetHeight : 80;
  
  resizeCanvas(windowWidth, windowHeight - navHeight);
  cnv.style('top', navHeight + 'px');
}

function mousePressed(){
  userStartAudio();
  if (song && !song.isPlaying()) {
    song.setVolume(0.5);
    song.loop();
    setStatus('audio','playing');
    songLoaded = true;
    playing = true;
  } else if (!song) {
    setStatus('audio','error');
  }
  // Lazy-load audio buffers on first user interaction to satisfy autoplay policies
  if (!songLoaded){
    console.log('>> Entering audio loading block')
    if (!song){
      console.log('>> Song is null, attempting to load...')
      setStatus('audio','loading')
      console.log('Attempting to load: CatchFall/NikomasTheme8BB.mp3')
      console.log('Current window location:', window.location.href)
      // Try loading with correct relative path for catchfallgame folder
      song = loadSound('CatchFall/NikomasTheme8BB.mp3', 
        () => { 
          console.log('Theme song loaded successfully!')
          songLoaded=true
          playing=true
          song.setVolume(0.5) // Set volume before looping
          song.loop()
          setStatus('audio','playing')
        }, 
        (e)=>{ 
          console.error('Theme load error:', e)
          console.error('Error details:', e.message || e)
          console.error('Tried to load from:', 'CatchFall/NikomasTheme8BB.mp3')
          setStatus('audio','error') 
        }
      );
      console.log('>> loadSound called, waiting for callback...')
    } else {
      console.log('>> Song exists but not loaded yet, waiting...')
    }
    if (!song2){ 
      console.log('Attempting to load: CatchFall/womp.mp3')
      song2 = loadSound('CatchFall/womp.mp3', 
        ()=>{ 
          console.log('SFX loaded successfully!')
          song2Loaded=true 
        }, 
        (e)=>{ 
          console.error('SFX load error:', e)
        }
      )
    }
  } else {
    console.log('>> Song already loaded and playing')
  }
  
  if (start){
    start=false
    // Create the facemesh model after a user gesture to avoid blocking preload/network
    if (!faceMesh){
      try{
        setStatus('model','loading')
        faceMesh = ml5.faceMesh(options, () => {
          setStatus('model','ready')
          try{ faceMesh.detectStart(video, gotFaces); setStatus('model','detecting') }catch(err){ console.warn('detectStart failed', err); setStatus('model','error') }
        })
      }catch(e){
        console.warn('ml5 faceMesh init failed:', e)
        setStatus('model','error')
      }
    }
    loop()
  }
  
  if (win){
    
  
    level+=1
      
      goal += ceil(noise(frameCount)*level)
      prog=0
    win=false
      loop() 
}
}

function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
  setStatus('faces', Array.isArray(results) ? results.length : 0)
}

function startStop(osc){

 osc.amp(0.5, 0.1);   // go to 0.5 amplitude in 0.05s
  osc.amp(0, 0.2, 0.1);
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
}

