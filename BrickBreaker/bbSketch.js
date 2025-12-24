let level=1

let x=300
let y=545
let speed
let diameter=30
let k=0

let paddleTop
let ballC

let rows = 1
let cols = 7
let goal=rows*cols
let hits=0
let win=false

let bricks=[]
let b

play=false
let p
let hitP= false
let hitBr = false

let hearts=[]
let h=3

let gameOver = false

let stuck = true
let restart = true

var song
let playing=false

function preload(){
  song= loadSound("AwayMsg8BB.mp3")
}


// ***************************************

function setup() {
  let cnv = createCanvas(600,600);
  // Place the canvas inside the page <main> so we can center it with CSS
  try {
    cnv.parent(document.querySelector('main'));
  } catch (e) {
    // fallback: if parent fails, leave canvas in body
    console.warn('Could not parent canvas to <main>:', e);
  }

  b = new Ball(width/2, 560)
p = new Paddle()

   for( i=0; i<cols; i++){
    
    for( j=0; j<rows; j++){
    bricks.push(new Brick(40+i*(75), 65+ j*30))
      
    }
     
  }
  
for (let k=0; k<h ; k++){
    hearts.push(new Heart())
}
  h= hearts.length
}

//*************************************************

function draw() {

background(0);
  
// LIVES ******************************************
  


for (let k=0; k<h ; k++){
  
  hearts[k].displayHeart(width/2- 55 + 40*k)
}
  
  if (b.loseLife){
    // A life was just lost. If there are hearts available, remove one and continue.
    // If there are already zero hearts, this triggers game over.
    b.loseLife = false
    if (hearts.length > 0) {
      // remove one heart (last)
      hearts.pop()
      h = hearts.length
      b = new Ball(p.x+50, 565)
      stuck = true
    } else {
      // No hearts left before this loss -> game over now
      gameOver = true
      stuck = false
      textSize(width/15)
      text('You lost on level '+level+ ' :(', width/6, height/2)
      textSize(width/30)
      text('Click to restart', width/6, height/2 + 40)
      noLoop()
    }
  }

  // BALL ******************************************

  b.makeBall()
  
  if (stuck){
    text('Press SPACEBAR to launch.', width/7, height-150)
  b.x=p.x +50
    b.y=560
  }else{
    b.moveBall()
  }
  b.bounds()
  
   if (keyIsPressed && keyCode==32){
    stuck= false
  }
  
  

// PADDLE *******************************************
  p.makePaddle()
  p.movePaddle()
  
// BALL HIT PADDLE ************************************

  hitP= collideRectCircle(p.x, p.y, 100, 10, b.x, b.y, 30)

  
  
  if (hitP){
    b.bounce()
  }
  
 

  
// BALL HIT BRICKS **********************************
  
for(let i=0; i< cols; i++){
    
    for(let j=0; j< rows; j++){

      let index= i*rows+j
      if (bricks[index].hit) continue
hitBr= collideRectCircle(bricks[index].x, bricks[index].y, 70, 20, b.x, b.y, 30)
      
      if(hitBr){
        b.bounce()
        hits++
        bricks[index].hit=true
       break
      }}}
     
 // BRICKS **************************************
  
  
   for(let i=0; i< cols; i++){
    play=true
     
    for(let j=0; j< rows; j++){
      if ((j+1)%3==0 || (j+1)%4==0){
       fill('orange')
     }else if((j+1)%5==0){
       fill('green')
     }else{
       fill('red')
     }
      let index= i*rows+j
     if (bricks[index].hit ==false){
       
bricks[index].drawBrick()}
      
    }       
      
      
// WIN ***************************

  if (hits>=goal && play==true){
    textSize(40)
    text('You completed level '+level+'!\nClick for level '+(level+1)+'.', width/5, height/2)
    win=true
    
  }
if (win){
  stuck=true

  noLoop()

}}}
  
function mousePressed(){
 if (playing==false){
   song.loop()
   playing=true
 }
 
  // If the game has ended and the player clicked, restart the game
  if (gameOver) {
    gameOver = false;
    // Reset level and progress
    level = 1;
    rows = 1;
    cols = 7;
    goal = rows * cols;
    hits = 0;
    win = false;

    // Recreate bricks
    bricks = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        bricks.push(new Brick(40 + i * 75, 65 + j * 30));
      }
    }

    // Rebuild hearts (start with 3)
    hearts = [];
    h = 3;
    for (let k = 0; k < h; k++) {
      hearts.push(new Heart());
    }
    h = hearts.length;

    // Reset ball and paddle
    b = new Ball(width / 2, 560);
    p = new Paddle();
    stuck = true;

    loop();
    return;
  }
  
  
  
  if (win){
    level+=1
    hits=0
    win=false
    
    
    
//********************* remake bricks
    rows = rows+int(random(1,3))
    goal=rows*cols
  
    bricks=[]
     for( i=0; i<cols; i++){
    
    for( j=0; j<rows; j++){
    bricks.push(new Brick(40+i*(75), 65+ j*30))
      
    }
  }
    
    
    loop()
    
  }
}

// Ensure audio starts when the player launches the ball with the SPACEBAR.
// Some browsers block audio until a user gesture; starting audio on key press
// (spacebar) is a valid user interaction and will allow the theme to play.
function keyPressed() {
  if (keyCode === 32) { // SPACEBAR
    // Try to resume the audio context (p5 convenience)
    try { userStartAudio(); } catch (e) { /* ignore if unavailable */ }

    if (!playing) {
      if (song) {
        try {
          song.setVolume(0.5);
          song.loop();
          playing = true;
        } catch (e) {
          console.warn('Could not start song on key press:', e);
        }
      }
    }
  }
}
  
