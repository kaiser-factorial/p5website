class Guy {
  constructor(x){
    this.x=x
    this.s=70
    this.y=height-this.s-72
    
  
    this.h= 3
  }
  
  
makeGuy(){  
  push()
  rectMode(CORNER)
  stroke(17)
  strokeWeight(3)
  fill(0, 69, 173)
  rect(this.x, this.y+14, this.s, this.s-14)
  fill(255)
  rect(this.x+10, this.y+24, this.s-20, this.s-34)
  fill(255, 214, 0)
  rect(this.x+8, this.y, this.s-16, 20)
  fill(235, 26, 38)
  rect(this.x+this.s-18, this.y+14, 18, this.s-14)
  pop()
}
  
moveGuy(){
if (keyIsDown(LEFT_ARROW) && this.x>2){
  this.x -=7
}  

  if (keyIsDown(RIGHT_ARROW) && this.x<(width-this.s-2)){
    this.x +=7
  }
  this.x = constrain(this.x, 0, width-this.s)
  
}  
}
