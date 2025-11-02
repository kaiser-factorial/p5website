class Guy {
  constructor(x){
    this.x=x
    this.s=60
    this.y=height-this.s-45
    
  
    this.h= 3
  }
  
  
makeGuy(){  
  fill('blue')
  rectMode(CORNER)
  rect(this.x, this.y, this.s, this.s)
}
  
moveGuy(){
if (keyIsDown(LEFT_ARROW) && this.x>2){
  this.x -=5
}  

  if (keyIsDown(RIGHT_ARROW) && this.x<(width-this.s-2)){
    this.x +=5
  }
  
}  
}
