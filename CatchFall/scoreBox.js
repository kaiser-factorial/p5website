class scoreBox{
  constructor(){
    this.g=10
    this.y = 75
    
  }
  
openBoxes(y, Q){
if (Q==0){
  fill('white')
  rect(50, 70+y, 30)
 }else{
   fill('yellow')
       rect(50, 70+y, 30)
 }
}}
