let rows=7
let cols=7
let counter=0
let n

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER)
}

function draw() {
  background(255, 10);
  translate(width/(2*cols), height/(2*rows))
  n=1.5*noise(0.01*frameCount)
  for (let x=0; x<cols ; x++){
    for (let y=0; y< rows; y++){
      for (let i=0; i<8; i++){
        
        if (i%3==0){
          r=255*cos(map(i,0,6, 0, 2*PI))
          b=255-r

          fill(r, 0, 0)
        } if(i%3==1){

          fill(0,0,b)
        } if(i%3==2){
          fill('yellow')
        }

        rect(x*width/cols, y*height/rows, n*width/cols-i*9, n*height/rows-i*7)
        }}
      
    }}
counter+=.01