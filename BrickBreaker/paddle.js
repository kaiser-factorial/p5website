class Paddle{
  constructor(){
    this.x=275
    this.y=height-20
  }
makePaddle(){
  fill('yellow')
  rect(this.x, this.y, 100, 10)
}
  
  movePaddle(){
    if (this.x>0 && keyIsDown(LEFT_ARROW)){
      this.x-=random(5,7)
    }
    if (this.x< width-100 && keyIsDown(RIGHT_ARROW)){
      this.x+=7
    }
  }
}