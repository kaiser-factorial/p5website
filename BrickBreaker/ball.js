class Ball{
  constructor(x, y){
    this.x=x
    this.y=y
    this.dX=7
    this.dY=-8
    this.loseLife=false
    
  }
  
  makeBall(){
   
   fill('blue')
    ellipse(this.x, this.y, 30)
  }
  
  moveBall(){
    this.x+=this.dX
    this.y+=this.dY
  }
  
  bounce(){
//    this.dX=-this.dX
    this.dY=-this.dY
  }
  
  bounds(){
    
    if (this.x>width - 15){
    this.dX= -this.dX
   
  }
  if  (this.x<15){
    this.dX=-this.dX
  }
  if (this.y>height-15){
    this.loseLife=true
  }
  if (this.y<15){
    this.dY=-this.dY
  }
  }
  
}
