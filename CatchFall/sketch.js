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
let stars=[]
let bursts=[]
let shake=0
let loadingFace=false
let gameReady=false
let gameplayStartFrame=0
let levelBannerFrame=0

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

const statusState = { model: 'idle', webcam: 'init', audio: 'idle', faces: 0 };
function setStatus(part, value) {
  statusState[part] = value;
}

function catchFallAsset(file){
  let path = window.location.pathname
  return (path.endsWith('/CatchFall/index.html') || path.endsWith('/CatchFall/')) ? file : 'CatchFall/'+file
}

// Avoid heavy loads in preload to prevent hanging on some browsers
function preload(){
  song = loadSound(catchFallAsset('NikomasTheme8BB.mp3'));
  song2 = loadSound(catchFallAsset('womp.mp3'), () => {
    song2Loaded = true
  });
}

function setup() {
  // Get navigation height to calculate canvas size and position
  let nav = document.querySelector('nav');
  let navHeight = nav ? nav.offsetHeight : 0;
  
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
  initStars()
  for (let k=0; k<h ; k++){
    hearts.push(new Heart(k, h))
  }
  
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
  // setupLinkFractals()
}

function draw() {

  let freq1= note
  osc1.freq(freq1)
  
  drawGeometricBackground()
  drawHudFrame()
  drawLevelBanner()
  
  if (start){

    drawTitleScreen()
    noLoop()
    return
  }

  updateFaceControl()

  if (loadingFace || !gameReady){
    drawLoadingScreen()
    g.makeGuy()
    return
  }

  if (gameReady && faces.length === 0){
    drawLoadingScreen('TRACKING PAUSED', 'Center your face to continue.')
    g.makeGuy()
    return
  }

  if (shake > 0){
    translate(random(-shake, shake), random(-shake, shake))
    shake *= 0.82
    if (shake < 0.2) shake = 0
  }
  
  g.makeGuy()
  g.moveGuy()
  
h= hearts.length

for (let k=0; k<h ; k++){
  
  hearts[k].displayHeart(hearts.length)
}
if (h==0){
  // Play the loss sound if it's loaded
  if (song2Loaded && song2) {
    song2.play()
  }
  drawEndScreen('GAME OVER', 'You reached level '+level+'.', 'Click to restart')
  noLoop()
  return
  
}
  
  
  
 for (let i=fires.length-1; i>=0 ; i--)
    {
       
      fires[i].rainFire()
      hit = collideRectCircle(g.x, g.y, g.s, g.s, fires[i].x, fires[i].y, fires[i].size)
      
      if (hit){
      bursts.push(new Burst(fires[i].x, fires[i].y, color(255,75,75)))
      fires.splice(i,1)
      hearts.pop()
      shake=9
        
      note= cMaj[1]
      let freq1= note
      osc1.freq(freq1)
      startStop(osc1)
      continue
      }
      
      if (fires[i].y > height+60){
        fires.splice(i, 1)
      }

    }
  
  let elapsed = frameCount-gameplayStartFrame
  let difficulty = getDifficulty()

  if (elapsed > 35 && elapsed % difficulty.fireInterval === 0) {
    fires.push(new Fire(difficulty))
    if (difficulty.doubleFire && frameCount % 2 === 0){
      fires.push(new Fire(difficulty))
    }
    
    
  }
  
  for (let j=catches.length-1; j>=0 ; j--)
    {
       
      catches[j].rainCatches()
      caught = collideRectCircle(g.x, g.y, g.s, g.s, catches[j].x, catches[j].y, catches[j].size, catches[j].size)
      if (caught){
        prog+=1
        bursts.push(new Burst(catches[j].x, catches[j].y, color(255,224,83)))
        catches.splice(j,1)
        
        note= cMaj[6]
      let freq1= note
      osc1.freq(freq1)
      startStop(osc1)
      continue
        
      }

      if (catches[j].y > height+60){
        catches.splice(j,1)
      }
    }
  
  drawProgress()
  updateBursts()
  if (prog>= goal){
    drawEndScreen('LEVEL '+level+' CLEARED', 'Goal captured: '+prog+' / '+goal, 'Click for level '+(level+1))
    win =true 
    note= cMaj[4]
      let freq1= note
      osc1.freq(freq1)
      startStop(osc1)
    
  }
  if (win){
    noLoop()
    return
  }

      
  
  if (elapsed > 35 && elapsed % difficulty.catchInterval === 0){
     catches.push(new Catch(difficulty))
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
  let navHeight = nav ? nav.offsetHeight : 0;
  
  resizeCanvas(windowWidth, windowHeight - navHeight);
  cnv.style('top', navHeight + 'px');
  initStars()
  if (g) g.y = height-g.s-72
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
      console.log('Attempting to load:', catchFallAsset('NikomasTheme8BB.mp3'))
      console.log('Current window location:', window.location.href)
      // Try loading with correct relative path for catchfallgame folder
      song = loadSound(catchFallAsset('NikomasTheme8BB.mp3'),
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
          console.error('Tried to load from:', catchFallAsset('NikomasTheme8BB.mp3'))
          setStatus('audio','error') 
        }
      );
      console.log('>> loadSound called, waiting for callback...')
    } else {
      console.log('>> Song exists but not loaded yet, waiting...')
    }
    if (!song2){ 
      console.log('Attempting to load:', catchFallAsset('womp.mp3'))
      song2 = loadSound(catchFallAsset('womp.mp3'),
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
    loadingFace=true
    gameReady=false
    fires=[]
    catches=[]
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
    } else if (faces.length > 0){
      loadingFace=false
      gameReady=true
      gameplayStartFrame=frameCount
    }
    loop()
  }
  
  // If the player has no hearts left, treat the click as a restart command.
  // Reset the game back to level 1 and rebuild initial state.
  if (hearts.length === 0) {
    // Reset level and progress
    level = 1;
    goal = 4;
    prog = 0;

    // Clear any existing falling objects
    fires = [];
    catches = [];

    // Rebuild hearts (start with 3)
    hearts = [];
    h = 3;
    for (let k = 0; k < h; k++) {
      hearts.push(new Heart(k, h));
    }

    // Reset player position by re-creating the Guy at canvas center
    g = new Guy(windowWidth/2);
    shake = 0;
    bursts = [];

    // Ensure flags are reset and resume draw loop
    win = false;
    start = false;
    loadingFace = faces.length === 0;
    gameReady = faces.length > 0;
    gameplayStartFrame = frameCount;
    levelBannerFrame = frameCount;
    loop();

    // Stop here so the click doesn't also trigger other branches
    return;
  }

  if (win){
    level+=1
    goal = getLevelGoal(level)
    prog=0
    win=false
    gameplayStartFrame = frameCount
    levelBannerFrame = frameCount
    fires = []
    catches = []
    loop()
  }
}

function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
  setStatus('faces', Array.isArray(results) ? results.length : 0)
  if (loadingFace && Array.isArray(results) && results.length > 0){
    loadingFace = false
    gameReady = true
    gameplayStartFrame = frameCount
    levelBannerFrame = frameCount
    fires = []
    catches = []
  }
}

function startStop(osc){

 osc.amp(0.5, 0.1);   // go to 0.5 amplitude in 0.05s
  osc.amp(0, 0.2, 0.1);
}

function getDifficulty(){
  let ramp = max(0, level-1)
  return {
    fireInterval: max(14, 46 - ramp*3),
    catchInterval: max(24, 62 - ramp*2),
    fireSpeedBoost: min(7, ramp*.55),
    catchSpeedBoost: min(3.5, ramp*.25),
    fireSizeBoost: min(16, ramp*1.4),
    catchSizeShrink: min(8, ramp*.55),
    doubleFire: level >= 5,
    drift: min(2.4, ramp*.22)
  }
}

function getLevelGoal(lvl){
  return min(16, 3 + lvl + floor(lvl/3))
}

function initStars(){
  stars = []
  let count = floor(constrain(width * height / 26000, 24, 80))
  for (let i=0; i<count; i++){
    stars.push({
      x: random(width),
      y: random(height),
      s: random(10, 46),
      kind: floor(random(3)),
      col: floor(random(3))
    })
  }
}

function primaryColor(i, alpha=255){
  let palette = [
    color(235, 26, 38, alpha),
    color(0, 69, 173, alpha),
    color(255, 214, 0, alpha)
  ]
  return palette[i%3]
}

function drawGeometricBackground(){
  background(250)
  let mode = (level - 1) % 6
  if (mode === 0) drawModStripes()
  if (mode === 1) drawBezierClock()
  if (mode === 2) drawCantorField()
  if (mode === 3) drawHalftoneRings()
  if (mode === 4) drawWaveMarks()
  if (mode === 5) drawPrimaryGrid()
  drawPlayFieldLine()
}

function drawPlayFieldLine(){
  stroke(17)
  strokeWeight(3)
  line(0, height-78, width, height-78)
  noStroke()
}

function drawModStripes(){
  noStroke()
  let cols = 38
  let rows = 28
  let cellW = width / cols
  let cellH = (height-78) / rows
  let mod = 7 + (level % 6)
  for (let r=0; r<rows; r++){
    for (let c=0; c<cols; c++){
      let idx = (r*cols + c + floor(frameCount*.06)) % mod
      if (idx < 3){
        fill(primaryColor(idx, 36))
        rect(c*cellW, r*cellH, cellW+1, cellH+1)
      }
    }
  }
  stroke(17, 34)
  strokeWeight(1)
  for (let c=0; c<=cols; c+=2) line(c*cellW, 0, c*cellW, height-78)
}

function drawBezierClock(){
  push()
  translate(width*.5, height*.43)
  let rad = min(width, height)*.34
  let n = 54
  let mult = 2 + (level % 7)
  noFill()
  stroke(17)
  strokeWeight(2)
  circle(0, 0, rad*2)
  for (let k=0; k<n; k++){
    let target = (mult*k) % n
    let a1 = -HALF_PI + TWO_PI * (k/n)
    let a2 = -HALF_PI + TWO_PI * (target/n)
    let x1 = rad*cos(a1)
    let y1 = rad*sin(a1)
    let x2 = rad*cos(a2)
    let y2 = rad*sin(a2)
    stroke(primaryColor(k, 82))
    strokeWeight(1.6)
    bezier(x1, y1, rad*.35*cos(a1), rad*.35*sin(a1), rad*.35*cos(a2), rad*.35*sin(a2), x2, y2)
  }
  pop()
}

function drawCantorField(){
  push()
  translate(width*.5, (height-78)*.5)
  let span = min(width*.82, (height-120)*1.42)
  drawCantorCluster(-span/2, -height*.31, span, 0, 54)
  scale(1, -1)
  drawCantorCluster(-span/2, -height*.31, span, 1, 54)
  pop()
  stroke(17, 45)
  strokeWeight(1)
  line(width*.5, 22, width*.5, height-100)
}

function drawCantorCluster(x, y, len, depth, gap){
  if (len < 10 || abs(y) > height*.42) return
  stroke(primaryColor(depth, 150))
  strokeWeight(max(1, 4-depth*.38))
  for (let i=0; i<20; i+=4){
    line(x, y+i, x+len, y+i)
  }
  drawCantorCluster(x, y+gap, len/3, depth+1, gap*.82)
  drawCantorCluster(x+len*2/3, y+gap, len/3, depth+2, gap*.82)
}

function drawHalftoneRings(){
  noFill()
  strokeWeight(1.5)
  let spacing = 78
  for (let x=spacing*.55; x<width; x+=spacing){
    for (let y=spacing*.45; y<height-90; y+=spacing){
      for (let i=0; i<4; i++){
        stroke(primaryColor(i + floor(x/spacing), 118))
        let size = i*14 + noise(x*.01, y*.01, frameCount*.012+i)*30
        ellipse(x, y, size)
      }
    }
  }
}

function drawWaveMarks(){
  noFill()
  let rowSpacing = 44
  for (let r=0; r<ceil(height/rowSpacing); r++){
    stroke(primaryColor(r, 120))
    strokeWeight(2)
    for (let x=0; x<width; x+=11){
      let y = r*rowSpacing + 22*sin(x/34 + frameCount*.018 + r*.6) + 9*cos(x/55 + r)
      if (r%2===0){
        circle(x, y, 9)
      } else {
        line(x-5, y, x+5, y)
      }
    }
  }
}

function drawPrimaryGrid(){
  noStroke()
  let cols = 7
  let rows = 9
  let cellW = width / cols
  let cellH = (height-86) / rows
  for (let c=0; c<cols; c++){
    for (let r=0; r<rows; r++){
      if ((c+r+level)%3 !== 0) continue
      fill(primaryColor(c+r, 55))
      rect(c*cellW+12, r*cellH+12, cellW-24, cellH-24)
    }
  }
  stroke(17, 90)
  strokeWeight(1)
  for (let c=0; c<=cols; c++) line(c*cellW, 0, c*cellW, height-86)
  for (let r=0; r<=rows; r++) line(0, r*cellH, width, r*cellH)
  noStroke()
  for (let mark of stars){
    fill(primaryColor(mark.col, 80))
    if (mark.kind === 0) rect(mark.x, mark.y, mark.s, mark.s)
    if (mark.kind === 1) circle(mark.x, mark.y, mark.s)
    if (mark.kind === 2){
      push()
      translate(mark.x, mark.y)
      rotate(QUARTER_PI)
      rect(-mark.s*.4, -mark.s*.4, mark.s*.8, mark.s*.8)
      pop()
    }
  }
}

function updateFaceControl(){
  if (!Array.isArray(faces) || faces.length === 0) return
  let keypoint = faces[0].keypoints[10]
  if (!keypoint) return
  g.x = constrain(keypoint.x - g.s/2, 0, width-g.s)
}

function drawHudFrame(){
  noStroke()
  fill(255, 255, 255, 232)
  rect(18, 18, 206, 54, 0)
  stroke(17)
  strokeWeight(2)
  noFill()
  rect(18, 18, 206, 54, 0)
  noStroke()
  fill(17)
  textAlign(LEFT, CENTER)
  textStyle(BOLD)
  textSize(14)
  text('LEVEL '+level, 36, 37)
  textStyle(NORMAL)
  textSize(12)
  fill(35)
  text('Catch yellow. Avoid red.', 36, 57)
  textAlign(LEFT, BASELINE)
}

function drawLevelBanner(){
  if (!gameReady || frameCount-levelBannerFrame > 90) return
  let t = 1 - (frameCount-levelBannerFrame)/90
  push()
  textAlign(CENTER, CENTER)
  noStroke()
  fill(255, 255, 255, 210*t)
  rect(width*.34, height*.12, width*.32, 46, 0)
  stroke(17, 255*t)
  strokeWeight(2)
  noFill()
  rect(width*.34, height*.12, width*.32, 46, 0)
  noStroke()
  fill(17, 255*t)
  textStyle(BOLD)
  textSize(18)
  text('LEVEL '+level+'  /  GOAL '+goal, width/2, height*.12+23)
  pop()
}

function drawTitleScreen(){
  push()
  textAlign(CENTER, CENTER)
  stroke(17)
  strokeWeight(3)
  fill(255)
  rect(width*0.2, height*0.25, width*0.6, height*0.32, 0)
  noStroke()
  fill(0, 69, 173)
  rect(width*0.2, height*0.25, width*0.6, 16)
  fill(235, 26, 38)
  rect(width*0.2, height*0.25, 16, height*0.32)
  fill(255, 214, 0)
  rect(width*0.8-16, height*0.25, 16, height*0.32)
  fill(17)
  textStyle(BOLD)
  textSize(min(width/15, 68))
  text('CATCHFALL', width/2, height*0.34)
  fill(17)
  textStyle(NORMAL)
  textSize(min(width/42, 24))
  text('Move your head left and right', width/2, height*0.43)
  fill(35)
  textSize(min(width/50, 19))
  text('Collect yellow squares. Avoid red circles.', width/2, height*0.48)
  fill(0, 69, 173)
  textStyle(BOLD)
  textSize(min(width/44, 22))
  text('Click to start', width/2, height*0.55)
  pop()
}

function drawLoadingScreen(){
  push()
  textAlign(CENTER, CENTER)
  stroke(17)
  strokeWeight(3)
  fill(255)
  rect(width*.24, height*.3, width*.52, height*.24, 0)
  noStroke()
  fill(primaryColor(floor(frameCount/18), 255))
  rect(width*.24, height*.3, width*.52 * ((frameCount%120)/120), 14)
  fill(17)
  textStyle(BOLD)
  textSize(min(width/30, 34))
  let message = statusState.model === 'error' ? 'FACE TRACKING ERROR' : 'LOADING FACEMESH'
  if (statusState.model === 'detecting' && faces.length === 0) message = 'CENTER YOUR FACE'
  text(message, width/2, height*.39)
  textStyle(NORMAL)
  textSize(min(width/55, 18))
  text('Gameplay begins when your face is detected.', width/2, height*.46)
  pop()
}

function drawProgress(){
  let barX = width*0.18
  let barW = width*0.64
  let barY = height-48
  let barH = 16
  stroke(17)
  strokeWeight(2)
  fill(255)
  rect(barX, barY, barW, barH, 0)
  let pct = constrain(prog / max(goal, 1), 0, 1)
  noStroke()
  fill(255, 214, 0)
  rect(barX, barY, barW*pct, barH, 0)
  fill(17)
  textAlign(CENTER, CENTER)
  textStyle(BOLD)
  textSize(11)
  text(prog+' / '+goal, width/2, barY+barH/2+0.5)
  textAlign(LEFT, BASELINE)
  textStyle(NORMAL)
}

function drawEndScreen(title, subtitle, action){
  push()
  textAlign(CENTER, CENTER)
  stroke(17)
  strokeWeight(3)
  fill(255)
  rect(width*0.22, height*0.28, width*0.56, height*0.28, 0)
  noStroke()
  fill(235, 26, 38)
  rect(width*0.22, height*0.28, width*0.56, 16)
  fill(17)
  textStyle(BOLD)
  textSize(min(width/18, 56))
  text(title, width/2, height*0.37)
  fill(35)
  textStyle(NORMAL)
  textSize(min(width/42, 23))
  text(subtitle, width/2, height*0.45)
  fill(0, 69, 173)
  textStyle(BOLD)
  textSize(min(width/48, 20))
  text(action, width/2, height*0.51)
  pop()
}

function updateBursts(){
  for (let i=bursts.length-1; i>=0; i--){
    bursts[i].update()
    bursts[i].draw()
    if (bursts[i].done()){
      bursts.splice(i, 1)
    }
  }
}

class Burst{
  constructor(x,y,c){
    this.x=x
    this.y=y
    this.c=c
    this.life=24
    this.pieces=[]
    for (let i=0; i<10; i++){
      this.pieces.push({
        a: random(TWO_PI),
        d: random(8, 34),
        s: random(2, 5)
      })
    }
  }
  update(){
    this.life--
  }
  draw(){
    push()
    strokeWeight(2)
    let alpha = map(this.life, 0, 24, 0, 220)
    for (let p of this.pieces){
      stroke(red(this.c), green(this.c), blue(this.c), alpha)
      let px = this.x + cos(p.a)*p.d*(1-this.life/24)
      let py = this.y + sin(p.a)*p.d*(1-this.life/24)
      line(px-p.s, py, px+p.s, py)
      line(px, py-p.s, px, py+p.s)
    }
    pop()
  }
  done(){
    return this.life <= 0
  }
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
