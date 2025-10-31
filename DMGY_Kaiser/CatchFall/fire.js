class Fire{
  constructor(){
    this.x= random(width)
    this.y=1
    this.size=random(7,25)
    this.speed=random(1,10)

  }
  
  rainFire(){
    
    fill('red')
    ellipse(this.x, this.y, this.size)
    this.y +=this.speed
  }
}