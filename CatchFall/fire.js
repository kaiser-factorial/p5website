class Fire{
  constructor(difficulty){
    this.x= random(24, width-24)
    this.y=-20
    this.size=random(18,34) + difficulty.fireSizeBoost
    this.speed=random(2.6,8.8) + difficulty.fireSpeedBoost
    this.wobble=random(TWO_PI)
    this.drift=random(-difficulty.drift, difficulty.drift)

  }
  
  rainFire(){
    push()
    stroke(17)
    strokeWeight(2)
    fill(235, 26, 38)
    circle(this.x + sin(frameCount*.07+this.wobble)*2, this.y, this.size)
    noFill()
    stroke(17, 120)
    circle(this.x + sin(frameCount*.07+this.wobble)*2, this.y, this.size*.62)
    stroke(255, 214, 0)
    line(this.x-this.size*.35, this.y, this.x+this.size*.35, this.y)
    line(this.x, this.y-this.size*.35, this.x, this.y+this.size*.35)
    pop()
    this.x += this.drift*cos(frameCount*.04 + this.wobble)
    this.x = constrain(this.x, 18, width-18)
    this.y +=this.speed
  }
}
