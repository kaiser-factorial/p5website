class Catch{
  constructor(){
    this.x= random(width)
    this.y=1
    this.size=random(7,20)
    this.speed=random(1,8)

  }
  
  rainCatches(){
    rectMode(CORNER)
    fill('yellow')
    rect(this.x, this.y, this.size, this.size)
    this.y +=this.speed*1.5
  }
  
  
}
