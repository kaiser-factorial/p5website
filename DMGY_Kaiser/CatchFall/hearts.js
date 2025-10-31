class Heart{
  constructor(k,h){
    this.k=k
    this.h = h 
  }


displayHeart(h)
{
  for (let i=0 ; i< h ; i++){
    textSize(40)
    text('❤️', (width/2 - 75) +i*80, 50)
}}
}