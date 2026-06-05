class Heart{
  constructor(k,h){
    this.k=k
    this.h = h 
  }


displayHeart(h)
{
  push()
  let size = 24
  let spacing = 38
  let startX = width - (h*spacing) - 28
  let x = startX + this.k*spacing
  let y = 38
  rectMode(CENTER)
  stroke(17)
  strokeWeight(2)
  fill(235, 26, 38)
  rect(x-size*.45, y-size*.45, size*.9, size*.9)
  fill(255)
  rect(x-size*.18, y-size*.18, size*.36, size*.36)
  pop()
}
}
