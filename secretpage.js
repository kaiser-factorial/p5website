let rad=50
let fractalX = 0
let fractalY = 0

let hit= false
let phit=false

let clickF=false

let sent=["Tom didn't tell us how big your house was",
"Where is the President right now?", 
"Would you like your cash in tens or twenties?", 
"How often do you see George?", 
"It's as clear as mud.", 
"She desperately wanted an order of Kung Pao chicken.",
"The big, yellow bus came hurtling down the street.", 
"He finally answered the question no one asked.", 
"The cat's pajamas are missing again."]

let sentenceButton
let lastButtonTime = 0

function setup() {
  createCanvas(windowWidth, windowHeight-75);
setupLinkFractals()
}

function draw() {
    background(220);
    // Create random sentence button every 5 seconds
    if (millis() - lastButtonTime > 5000 && !sentenceButton) {
      createRandomSentenceButton()
      lastButtonTime = millis()
    }

    if (clickF){
    growFractal(fractalX, fractalY)
  }
}

function randomButton(){
    randomButton = createButton(sent[frameCount%sent.length])
  randomButton.style('padding', '10px 20px')
  randomButton.size(200, 50)
  randomButton.style('font-size', '16px')
  randomButton.style('background-color', 'yellow')
  randomButton.style('color', 'black')
  randomButton.style('border', 'none')
  randomButton.style('border-radius', '5px')
  randomButton.style('cursor', 'pointer')
  randomButton.style('position', 'fixed')
  randomButton.style('top', '50%')
  randomButton.style('left', '50%')
  randomButton.style('transform', 'translate(-50%, -50%)')
  randomButton.style('z-index', '1000')
  randomButton.mousePressed(enableSound)
}

function createRandomSentenceButton(){
  // Remove existing sentence button if it exists
  if (sentenceButton) {
    sentenceButton.remove()
  }
  
  sentenceButton = createButton(sent[Math.floor(Math.random() * sent.length)])

  sentenceButton.size(150, 50)
  sentenceButton.style('font-size', '10px')
  sentenceButton.style('background-color', 'red')
  sentenceButton.style('color', 'white')


  sentenceButton.style('cursor', 'pointer')
  sentenceButton.style('position', 'fixed')
  sentenceButton.style('top', random(30, windowHeight - 50) + 'px')
  sentenceButton.style('left', random(30, windowWidth - 150) + 'px')
  sentenceButton.style('z-index', '500')
  
  sentenceButton.mousePressed(() => {
    sentenceButton.remove()
    sentenceButton = null
    
    // Play sound when button is clicked

      let freq = random(cMaj)
      osc1.freq(freq)
      startStop(osc1)
      console.log("Button click sound at frequency:", freq)
    
  })
  
  // Auto-remove button after 3 seconds if not clicked
  setTimeout(() => {
    if (sentenceButton) {
      sentenceButton.remove()
      sentenceButton = null
    }
  }, 3000)
}

function setupLinkFractals() {
  // Get all navigation links from both columns
  let navLinks = document.querySelectorAll('.nav-links-column a')
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Prevent the default link behavior temporarily
      event.preventDefault()
      
      // Store the link's destination
      let destination = this.getAttribute('href')
      
      // Get the click position relative to the canvas
      let rect = document.querySelector('main canvas').getBoundingClientRect()
      fractalX = event.clientX - rect.left
      fractalY = event.clientY - rect.top
      
      // Trigger fractal
      clickF = true
      rad = 50 // Reset radius
      
      console.log('Link clicked:', destination, 'at position:', fractalX, fractalY)
      
      // Navigate to the destination after fractal completes
      setTimeout(() => {
        window.location.href = destination
      }, 2000)
    })
  })
}




    


function drawCircles(x, y, radius) {

  noFill();
   strokeWeight(2)
  circle(x, y, radius * 2*noise(.053*(frameCount%45)));
  if (radius > 16) {
    //{!4} drawCircles() calls itself four times.
 
    stroke('yellow')
drawCircles(x + radius / 2, y, radius / 2)

    stroke('red')
drawCircles(x - radius / 2, y, radius / 2)
strokeWeight(2)
    stroke('blue')
drawCircles(x, y + radius / 2, radius / 2)

  stroke('black')
drawCircles(x, y - radius / 2, radius / 2)
  }
}



function growFractal(x,y, nextpage){
  print("growing")
  if (rad< windowWidth*3){
    rad+=50
  drawCircles(x,y,rad)
  }else{
    window.location.href="page1.html"
  }
}





