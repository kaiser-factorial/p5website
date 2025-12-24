class Brick{
  constructor(x,y){
    this.x=x
    this.y=y
    this.hit=false
  }
  
  drawBrick()
  {
    
    if(this.hit==false){
//    fill('red')
    rect(this.x, this.y, 70, 20 )
  }}
  
}