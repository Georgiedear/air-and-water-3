//AIR+WATER-2.0 IN p5 BY GEORGINA YEBOAH

let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1421'; //1411
let inData; // for incoming serial data
let fs;
let speedX; 
let speedY;
let useSensors = false;
let waterColorImages = [];
let bubbles = [];
let wands =[];
let pg;
let fadeAmount;
let c;
let x;
let y;


//IMAGES
let bubbleImg;

let  images = [
    'img/Air+Water[breeze_green].png', 
    'img/Air+Water[cherry_red].png', 
    'img/Air+Water[cloud].png', 
    'img/Air+Water[cool_blue].png', 
    'img/Air+Water[pink_hush].png', 
    'img/Air+Water[yellow_splash].png' ];



    function preload() {


        bubble = loadImage('img/Air+Water[bubble].png');

        for (let i = 0; i < images.length; i++) {
             imagePath = images[i];
            waterColorImages[i] = loadImage(imagePath);
          }
              
      }
     

function setup() {


       waterColorImages =  images.length;
       speedX = random(-0.4, 0.4); 
        speedY = random(-0.4, 0.4);
  

         //OBJECT FOR WAND CLASS
         for (var i = 0; i < 3; i++ ) {
            wands[i] = new Wand();
            
            }
                 //OBJECT FOR BUBBLE CLASS
            for (var i = 0; i < length; i++) {
            bubble[i] = new Bubble();
            }

    if (useSensors) {
        serial = new p5.SerialPort();
        // serial = new p5.SerialPort(this, portName, 9600);
        serial.on('list', printList); // set a callback function for the serialport list event
        serial.on('connected', serverConnected);
        serial.on('open', portOpen); // callback for the port opening


        serial.list(); // list the serial ports
        serial.open(portName); // open a serial port
      }
      

// fs = fullscreen();
createCanvas = (800, 800);

pg = createGraphics(width, height);
c = createGraphics();

frameRate(30);


wands[0] = new Wand(width * 0.25, height * 0.5);
wands[1] = new Wand(width * 0.5, height * 0.5);
wands[2]= new Wand(width * 0.75, height * 0.5);

}



function windowResized() {

    resizeCanvas(windowWidth, windowHeight);
  }  
function updateWands() {
    var inComData = serial.readLine();

    if (inComData.length == 0) {
        inData = Number(inString);

      return;
    }

    trim(inComData);                    // remove any trailing whitespace
    if (!inComData) return;             // if the string is empty, do no more
    inComData = int(inComData);


let data;
let validData = null;

while ((data = serial.readLine !=null)) {

validData = data;

}

if (validData == null) {
    return;
  };

let ws = [];
ws = split(validData, ':');

if(ws.length !=3) {
    return;
}

for (var i = 0; i < wands.length; i++) {
    var speed = float(ws[i]);
    let w  = new Wand();
    wands.push(w);
    // Wand; w = wands[i]; //Idunno....
     
    w.update(speed);
  }
}


function keyIsPressed() {
    if (keyCode === 74) {
      wands[0].update(1);
    }
    if (keyCode === 75) {
      wands[1].update(1);
    }
    if (keyCode === 76) {
      wands[2].update(1);
    }
  }
  
  function keyReleased() {
    if (keyCode === 74) {
      wands[0].update(0);
    }
    if (keyCode === 75) {
      wands[1].update(0);
    }
    if (keyCode === 76) {
      wands[2].update(0);
    }
  }

  function move() {
    x = x+speedX;
    y = y+speedY;
  }
  function drawFrameRate() {
    fill(150);
    text(str(int(frameRate)), 10, 10, 200.0, 100.0);
  }

  function fadeGraphics(c, fadeAmount) {
    c.loadPixels();
  
    // iterate over pixels
    for (let i =0; i<c.pixels.length; i++) {
  
      // get alpha value
      let alpha = (c.pixels[i] >> 24) & 0xFF ;
  
      // reduce alpha value
      alpha = max(0, alpha-fadeAmount);
  
      // assign color with new alpha-value
      c.pixels[i] = alpha<<24 | (c.pixels[i]) & 0xFFFFFF ;
    }
  
    c.updatePixels();
  }
  

function draw() {
    background(255);

    if (useSensors) {
      updateWands();
    } else {
      for (let i = 0; i < wands.length; i++) {
           let w  = new Wand();
        //   wands.push(w);
        w.update(w.windSpeed);
      }
    }
  
    // Loop through to update.
    // We loop forward to draw so that new bubbles are in front.
    for (let i = bubbles.length; i >= 0; i++) {
        let b = new Bubble();
        bubbles.push(b);
        b.update();
    }
  
    // Loop through backward to remove dead bubbles.
    if (frameCount % 6 == 0) {
      fadeGraphics(pg, 0);
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
        if(bubbles[i].contains(x,y)) {
            bubbles.splice(i,1);
        }
   
      // A Bubbles death.
      if (bubble.isDead) {
        let rand = int(random(waterColorImages.length));
        let img = waterColorImages[rand];
        pg.push();
        pg.imageMode(CENTER);
        pg.image(img, bubble.x, bubble.y, bubble.g, bubble.g);
        pg.pop();
        bubbles.splice(i,1);

        // bubbles.remove(i);
      }
    }
  
    image(pg, 0, 0);
     for (let i = bubbles.length; i >= 0; i++) {
          let b = new Bubble();
         bubbles.push(b);
         b.draw();

     }
  
    drawFrameRate();
  }
