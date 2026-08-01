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
let controlMode = 'keyboard';
let cameraControlsEnabled = false;
let cameraFallbackMessage = '';
let cameraWaitStartedAt = 0;
let gamePaused = false;
let pausedFrame = null;
let musicEnabled = true;
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: true };

const uiHitAreas = {};
const statusState = { model: 'idle', webcam: 'init', audio: 'idle', faces: 0 };
function setStatus(part, value) {
  statusState[part] = value;
}

function catchFallAsset(file){
  let path = window.location.pathname
  return (path.endsWith('/CatchFall/index.html') || path.endsWith('/CatchFall/')) ? file : 'CatchFall/'+file
}

function enableCatchFallCamera(){
  if (video && video.elt && video.elt.srcObject) {
    cameraControlsEnabled = true;
    return true;
  }
  try {
    video = createCapture(VIDEO, { flipped:true });
    video.size(windowWidth, windowHeight);
    video.hide();
    cameraControlsEnabled = true;
    cameraWaitStartedAt = millis();
    setStatus('webcam', 'requesting');
    if (video && video.elt) {
      video.elt.addEventListener('loadedmetadata', () => setStatus('webcam', 'ready'));
      video.elt.addEventListener('canplay', () => {
        setStatus('webcam', 'active');
        cameraFallbackMessage = '';
      });
      video.elt.addEventListener('error', () => handleCameraUnavailable());
    }
    return true;
  } catch (error) {
    console.warn('Camera controls unavailable:', error);
    handleCameraUnavailable();
    return false;
  }
}

function disableCatchFallCamera(){
  if (faceMesh && typeof faceMesh.detectStop === 'function') {
    try { faceMesh.detectStop(); } catch (error) { console.warn('Could not stop face tracking:', error); }
  }
  if (video && video.elt && video.elt.srcObject) {
    video.elt.srcObject.getTracks().forEach(track => track.stop());
  }
  if (video && typeof video.remove === 'function') video.remove();
  video = null;
  faceMesh = null;
  faces = [];
  cameraControlsEnabled = false;
  setStatus('webcam', 'off');
  setStatus('model', 'idle');
  setStatus('faces', 0);
}

function handleCameraUnavailable(){
  setStatus('webcam', 'error');
  setStatus('model', 'error');
  cameraFallbackMessage = 'Camera access is unavailable. Play with arrow keys instead.';
}

window.enableCatchFallCamera = enableCatchFallCamera;

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
  
  setStatus('webcam', 'off');
  // Camera and facemesh stay off until the visitor explicitly enables camera controls.
  // setupLinkFractals()
}

function draw() {

  if (gamePaused && pausedFrame) {
    image(pausedFrame, 0, 0, width, height);
    drawPauseOverlay();
    noLoop();
    return;
  }

  let freq1= note
  osc1.freq(freq1)
  
  drawGeometricBackground()
  
  if (start){
    drawTitleScreen()
    noLoop()
    return
  }

  drawHudFrame()
  drawLevelBanner()

  if (controlMode === 'camera') updateFaceControl()

  if (loadingFace || !gameReady){
    drawLoadingScreen()
    g.makeGuy()
    return
  }

  if (gameReady && cameraControlsEnabled && faces.length === 0){
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
  if (controlMode === 'keyboard') g.moveGuy()
  
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
  drawPauseButton()
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
  loop()
}

function mouseMoved(){
  // Title and pause screens deliberately stop the game loop. Redraw them on
  // pointer movement so their buttons still provide immediate hover feedback.
  if (start || gamePaused) loop()
}

function mouseOut(){
  cursor(ARROW)
}

function mousePressed(event){
  if (event && event.target && event.target.closest('.site-nav')) return false;

  if (gamePaused) {
    handlePauseMenuClick();
    return false;
  }

  if (start) {
    if (pointInUiArea('titleKeyboard')) startNewGame('keyboard');
    if (pointInUiArea('titleCamera')) startNewGame('camera');
    return false;
  }

  if (loadingFace || !gameReady) {
    if (pointInUiArea('cameraFallback')) switchToKeyboardMode();
    return false;
  }

  if (pointInUiArea('pause')) {
    pauseGame();
    return false;
  }

  if (hearts.length === 0) {
    restartGame();
    return false;
  }

  if (win) advanceLevel();
  return false;
}

function keyPressed(){
  const pressed = String(key || '').toLowerCase();

  if (gamePaused) {
    if (pressed === 'p' || keyCode === ENTER || keyCode === RETURN) resumeGame();
    if (pressed === 'm') toggleMusic();
    if (pressed === '1') selectKeyboardMode();
    if (pressed === '2') selectCameraMode();
    return false;
  }

  if (loadingFace && (pressed === 'a' || pressed === 'k')) {
    switchToKeyboardMode();
    return false;
  }

  if (!start && gameReady && !win && hearts.length > 0 && pressed === 'p') {
    pauseGame();
    return false;
  }

  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) return false;
}

function setUiHitArea(name, x, y, w, h){
  uiHitAreas[name] = { x, y, w, h };
}

function pointInUiArea(name){
  const area = uiHitAreas[name];
  return Boolean(area && mouseX >= area.x && mouseX <= area.x + area.w && mouseY >= area.y && mouseY <= area.y + area.h);
}

function startMusic(){
  userStartAudio();
  if (!musicEnabled) {
    setStatus('audio', 'off');
    return;
  }
  if (song) {
    try {
      if (!song.isPlaying()) song.loop();
      song.setVolume(0.5);
      songLoaded = true;
      playing = true;
      setStatus('audio', 'playing');
      return;
    } catch (error) {
      console.warn('Theme playback unavailable:', error);
    }
  }
  setStatus('audio', 'error');
}

function toggleMusic(){
  musicEnabled = !musicEnabled;
  if (!musicEnabled) {
    if (song && song.isPlaying()) song.pause();
    playing = false;
    setStatus('audio', 'off');
  } else {
    startMusic();
  }
  if (gamePaused) {
    loop();
  }
}

function startNewGame(mode){
  start = false;
  win = false;
  gamePaused = false;
  pausedFrame = null;
  fires = [];
  catches = [];
  cameraFallbackMessage = '';
  startMusic();
  if (mode === 'camera') {
    startCameraTracking();
  } else {
    switchToKeyboardMode();
  }
}

function startCameraTracking(){
  controlMode = 'camera';
  loadingFace = true;
  gameReady = false;
  cameraFallbackMessage = 'Allow camera access to use face tracking, or choose arrow keys instead.';

  if (!enableCatchFallCamera()) {
    handleCameraUnavailable();
    loop();
    return;
  }

  if (!faceMesh) {
    try {
      setStatus('model', 'loading');
      faceMesh = ml5.faceMesh(options, () => {
        setStatus('model', 'ready');
        try {
          if (video) {
            faceMesh.detectStart(video, gotFaces);
            setStatus('model', 'detecting');
          }
        } catch (error) {
          console.warn('Face tracking could not start:', error);
          handleCameraUnavailable();
        }
      });
    } catch (error) {
      console.warn('Face mesh could not load:', error);
      handleCameraUnavailable();
    }
  }
  loop();
}

function switchToKeyboardMode(){
  if (controlMode === 'camera' || cameraControlsEnabled || video) disableCatchFallCamera();
  controlMode = 'keyboard';
  loadingFace = false;
  gameReady = true;
  cameraFallbackMessage = '';
  gameplayStartFrame = frameCount;
  levelBannerFrame = frameCount;
  loop();
}

function selectKeyboardMode(){
  if (controlMode === 'camera' || cameraControlsEnabled || video) disableCatchFallCamera();
  controlMode = 'keyboard';
  cameraFallbackMessage = '';
  loop();
}

function selectCameraMode(){
  controlMode = 'camera';
  cameraFallbackMessage = 'Camera access will be requested when you resume.';
  loop();
}

function pauseGame(){
  if (start || loadingFace || !gameReady || win || hearts.length === 0) return;
  pausedFrame = get(0, 0, width, height);
  gamePaused = true;
  loop();
}

function resumeGame(){
  gamePaused = false;
  pausedFrame = null;
  if (controlMode === 'camera') {
    startCameraTracking();
  } else {
    loadingFace = false;
    gameReady = true;
    loop();
  }
}

function handlePauseMenuClick(){
  if (pointInUiArea('pauseKeyboard')) selectKeyboardMode();
  if (pointInUiArea('pauseCamera')) selectCameraMode();
  if (pointInUiArea('pauseMusic')) toggleMusic();
  if (pointInUiArea('pauseResume')) resumeGame();
}

function restartGame(){
  level = 1;
  goal = 4;
  prog = 0;
  fires = [];
  catches = [];
  hearts = [];
  h = 3;
  for (let k = 0; k < h; k++) hearts.push(new Heart(k, h));
  g = new Guy(windowWidth / 2);
  shake = 0;
  bursts = [];
  win = false;
  gameplayStartFrame = frameCount;
  levelBannerFrame = frameCount;
  if (controlMode === 'camera') startCameraTracking();
  else switchToKeyboardMode();
}

function advanceLevel(){
  level += 1;
  goal = getLevelGoal(level);
  prog = 0;
  win = false;
  gameplayStartFrame = frameCount;
  levelBannerFrame = frameCount;
  fires = [];
  catches = [];
  loop();
}

function gotFaces(results) {
  faces = results;
  setStatus('faces', Array.isArray(results) ? results.length : 0)
  if (controlMode === 'camera' && loadingFace && Array.isArray(results) && results.length > 0){
    loadingFace = false
    gameReady = true
    cameraFallbackMessage = ''
    gameplayStartFrame = frameCount
    levelBannerFrame = frameCount
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
  const isNarrow = width < 620
  const panelW = min(width * (isNarrow ? .88 : .78), 760)
  const panelH = min(height * (isNarrow ? .86 : .72), isNarrow ? 560 : 510)
  const panelX = (width - panelW) / 2
  const panelY = max(22, (height - panelH) / 2 - 10)
  const buttonW = panelW - 64
  const buttonH = constrain(height * .105, 56, 76)
  const buttonX = panelX + 32
  const choiceGap = 16
  const choiceW = isNarrow ? buttonW : (buttonW - choiceGap) / 2
  const choiceY = panelY + panelH * (isNarrow ? .54 : .60)
  const keyboardX = buttonX
  const keyboardY = choiceY
  const cameraX = isNarrow ? buttonX : keyboardX + choiceW + choiceGap
  const cameraY = isNarrow ? keyboardY + buttonH + 14 : choiceY
  const choicesBottom = isNarrow ? cameraY + buttonH : choiceY + buttonH
  const footerY = min(panelY + panelH * .92, choicesBottom + 28)

  cursor(ARROW)
  textAlign(CENTER, CENTER)
  stroke(17)
  strokeWeight(3)
  fill(255)
  rect(panelX, panelY, panelW, panelH, 0)
  noStroke()
  fill(0, 69, 173)
  rect(panelX, panelY, panelW, 16)
  fill(235, 26, 38)
  rect(panelX, panelY, 16, panelH)
  fill(255, 214, 0)
  rect(panelX + panelW - 16, panelY, 16, panelH)
  fill(17)
  textStyle(BOLD)
  textSize(constrain(width / 13, 32, 62))
  text('CATCH-FALL', width / 2, panelY + panelH * .16)
  fill(17)
  textStyle(NORMAL)
  textSize(constrain(width / 46, 15, 20))
  text('Move left and right.', width / 2, panelY + panelH * .31)
  text('Catch yellow squares. Avoid red circles.', width / 2, panelY + panelH * .40)
  fill(35)
  textSize(constrain(width / 58, 13, 16))
  text('Choose a control mode:', width / 2, choiceY - 30)

  drawTitleControlChoice(keyboardX, keyboardY, choiceW, buttonH, 'ARROW KEYS (L/R)', 'Start instantly', color(0, 69, 173), 'titleKeyboard')
  drawTitleControlChoice(cameraX, cameraY, choiceW, buttonH, 'FACE TRACKING', 'Camera permission required', color(235, 26, 38), 'titleCamera')

  fill(0, 69, 173)
  textStyle(NORMAL)
  textSize(constrain(width / 62, 11, 14))
  text('You can switch modes later from Pause.', width / 2, footerY)
  pop()
}

function drawTitleControlChoice(x, y, w, h, label, detail, accent, hitArea){
  setUiHitArea(hitArea, x, y, w, h)
  const hovered = pointInUiArea(hitArea)
  const visualY = hovered ? y - 4 : y

  if (hovered) cursor(HAND)

  noStroke()
  fill(17)
  rect(x + 5, visualY + 5, w, h, 0)
  stroke(17)
  strokeWeight(2)
  fill(hovered ? color(255, 214, 0) : accent)
  rect(x, visualY, w, h, 0)
  noStroke()
  fill(hovered ? 17 : 255)
  textAlign(CENTER, CENTER)
  textStyle(BOLD)
  textSize(constrain(w / 16, 11, 19))
  text(label, x + w / 2, visualY + h * .38)
  textStyle(NORMAL)
  textSize(constrain(w / 25, 10, 14))
  text(detail, x + w / 2, visualY + h * .72)
}

function drawControlChoice(x, y, w, h, label, detail, accent, hitArea){
  setUiHitArea(hitArea, x, y, w, h)
  stroke(17)
  strokeWeight(2)
  fill(255)
  rect(x, y, w, h, 0)
  noStroke()
  fill(accent)
  rect(x, y, 12, h)
  fill(17)
  textAlign(LEFT, CENTER)
  textStyle(BOLD)
  textSize(constrain(width / 44, 13, 21))
  text(label, x + 28, y + h * .39)
  textStyle(NORMAL)
  fill(45)
  textSize(constrain(width / 62, 11, 14))
  text(detail, x + 28, y + h * .72)
  textAlign(CENTER, CENTER)
}

function drawLoadingScreen(titleOverride, subtitleOverride){
  push()
  if (statusState.webcam === 'requesting' && millis() - cameraWaitStartedAt > 4500 && !cameraFallbackMessage) {
    cameraFallbackMessage = 'Still waiting for camera access? Arrow keys are ready now.'
  }
  const hasError = statusState.webcam === 'error' || statusState.model === 'error'
  const title = titleOverride || (hasError ? 'FACE TRACKING UNAVAILABLE' : 'PREPARING FACE TRACKING')
  const subtitle = subtitleOverride || (hasError
    ? 'Camera access was not completed.'
    : 'Allow camera access, then center your face to begin.')
  const panelW = min(width * .62, 620)
  const panelH = min(height * .40, 300)
  const panelX = (width - panelW) / 2
  const panelY = (height - panelH) / 2
  const fallbackW = panelW - 48
  const fallbackH = constrain(height * .075, 42, 56)
  const fallbackX = panelX + 24
  const fallbackY = panelY + panelH - fallbackH - 26

  textAlign(CENTER, CENTER)
  stroke(17)
  strokeWeight(3)
  fill(255)
  rect(panelX, panelY, panelW, panelH, 0)
  noStroke()
  fill(hasError ? color(235, 26, 38) : primaryColor(floor(frameCount / 18), 255))
  rect(panelX, panelY, panelW * ((frameCount % 120) / 120), 14)
  fill(17)
  textStyle(BOLD)
  textSize(min(width / 30, 34))
  text(title, width / 2, panelY + panelH * .32)
  textStyle(NORMAL)
  textSize(constrain(width / 55, 13, 18))
  text(subtitle, width / 2, panelY + panelH * .49)
  fill(35)
  textSize(constrain(width / 65, 11, 15))
  text(cameraFallbackMessage || 'Prefer keys? You can switch without granting access.', width / 2, panelY + panelH * .62)
  drawControlChoice(fallbackX, fallbackY, fallbackW, fallbackH, 'PLAY WITH ARROW KEYS', 'Press (A) or click here', color(0, 69, 173), 'cameraFallback')
  pop()
}

function drawPauseButton(){
  const x = 18
  const y = height - 66
  const w = 110
  const h = 42
  setUiHitArea('pause', x, y, w, h)
  stroke(17)
  strokeWeight(2)
  fill(255, 255, 255, 238)
  rect(x, y, w, h, 0)
  noStroke()
  fill(235, 26, 38)
  rect(x, y, 9, h)
  fill(17)
  textAlign(CENTER, CENTER)
  textStyle(BOLD)
  textSize(13)
  text('PAUSE (P)', x + w / 2 + 4, y + h / 2)
  textStyle(NORMAL)
  textAlign(LEFT, BASELINE)
}

function drawPauseOverlay(){
  push()
  noStroke()
  fill(17, 190)
  rect(0, 0, width, height)

  const panelW = min(width * .72, 650)
  const panelH = min(height * .75, 490)
  const panelX = (width - panelW) / 2
  const panelY = (height - panelH) / 2
  const buttonGap = 14
  const buttonW = (panelW - 64 - buttonGap) / 2
  const buttonH = constrain(height * .09, 48, 66)
  const controlY = panelY + panelH * .38
  const musicY = controlY + buttonH + 20
  const resumeY = musicY + buttonH + 20

  stroke(17)
  strokeWeight(3)
  fill(255)
  rect(panelX, panelY, panelW, panelH, 0)
  noStroke()
  fill(0, 69, 173)
  rect(panelX, panelY, panelW, 16)
  fill(255, 214, 0)
  rect(panelX, panelY, 16, panelH)

  textAlign(CENTER, CENTER)
  fill(17)
  textStyle(BOLD)
  textSize(constrain(width / 15, 30, 52))
  text('PAUSED', width / 2, panelY + panelH * .16)
  textStyle(NORMAL)
  fill(45)
  textSize(constrain(width / 60, 11, 15))
  text('Choose controls, set the soundtrack, then resume.', width / 2, panelY + panelH * .26)
  textStyle(BOLD)
  fill(17)
  textSize(constrain(width / 58, 12, 16))
  text('CONTROL MODE', width / 2, panelY + panelH * .32)

  drawPauseChoice(panelX + 24, controlY, buttonW, buttonH, 'ARROW KEYS', controlMode === 'keyboard', 'pauseKeyboard')
  drawPauseChoice(panelX + 40 + buttonW, controlY, buttonW, buttonH, 'FACE TRACKING', controlMode === 'camera', 'pauseCamera')
  drawPauseChoice(panelX + 24, musicY, panelW - 48, buttonH, 'MUSIC: ' + (musicEnabled ? 'ON' : 'OFF'), musicEnabled, 'pauseMusic')
  drawPauseChoice(panelX + 24, resumeY, panelW - 48, buttonH, 'RESUME GAME', true, 'pauseResume')

  textStyle(NORMAL)
  fill(45)
  textSize(constrain(width / 72, 10, 13))
  text('Keyboard: (1) arrow keys · (2) face tracking · (M) music · (P) resume', width / 2, panelY + panelH * .91)
  pop()
}

function drawPauseChoice(x, y, w, h, label, selected, hitArea){
  setUiHitArea(hitArea, x, y, w, h)
  stroke(17)
  strokeWeight(2)
  fill(selected ? color(255, 214, 0) : color(255))
  rect(x, y, w, h, 0)
  noStroke()
  if (selected) {
    fill(0, 69, 173)
    rect(x, y, 10, h)
  }
  fill(17)
  textAlign(CENTER, CENTER)
  textStyle(BOLD)
  textSize(constrain(width / 52, 12, 17))
  text(label, x + w / 2, y + h / 2)
  textStyle(NORMAL)
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
