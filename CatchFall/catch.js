class Catch{
  constructor(difficulty){
    this.x= random(24, width-24)
    this.y=-20
    this.size=max(12, random(24,36) - difficulty.catchSizeShrink)
    this.speed=random(2.1,6.4) + difficulty.catchSpeedBoost
    this.spin=random(TWO_PI)
    this.drift=random(-difficulty.drift, difficulty.drift)
    this.phase=random(TWO_PI)

  }
  
  rainCatches(){
    push()
    translate(this.x, this.y)
    rotate(this.spin + frameCount*0.025)
    rectMode(CENTER)
    stroke(17)
    strokeWeight(2)
    fill(255, 214, 0)
    let pulse = 1 + .12*sin(frameCount*.12 + this.phase)
    for (let i=0; i<3; i++){
      let s = this.size*pulse - i*this.size*.24
      if (i === 1) fill(255)
      if (i === 2) fill(255, 214, 0)
      rect(0, 0, s, s)
    }
    stroke(0, 69, 173)
    strokeWeight(1.6)
    line(-this.size*.58, 0, this.size*.58, 0)
    line(0, -this.size*.58, 0, this.size*.58)
    pop()
    this.x += this.drift*sin(frameCount*.045 + this.phase)
    this.x = constrain(this.x, 14, width-14)
    this.y +=this.speed*1.5
  }
  
  
}
