//AIR+WATER-2.0 IN p5 BY GEORGINA YEBOAH

let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1421'; //1411
let inData; // for incoming serial data
let fs;
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


         //OBJECT FOR WAND CLASS
for (var i = 0; i < 3; i++ ) {
wands[i] = new Wand();

}
     //OBJECT FOR BUBBLE CLASS
for (var i = 0; i < length; i++) {
bubble[i] = new Bubble();
}


        bubble = loadImage('img/Air+Water[bubble].png');

        for (let i = 0; i < images.length; i++) {
             imagePath = images[i];
            waterColorImages[i] = loadImage(imagePath);
          }
              
      }
     

function setup() {


       waterColorImages =  images.length;

  


    if (useSensors) {
        serial = new p5.SerialPort();
        // serial = new p5.SerialPort(this, portName, 9600);
        serial.on('list', printList); // set a callback function for the serialport list event
        serial.on('connected', serverConnected);
        serial.on('open', portOpen); // callback for the port opening


        serial.list(); // list the serial ports
        serial.open(portName); // open a serial port
      }
      

fs = fullscreen();
pg = createGraphics(width, height);
c = createGraphics();

frameRate(30);


wands[0] = new Wand(width * 0.25, height * 0.5);
wands[1] = new Wand(width * 0.5, height * 0.5);
wands[2]= new Wand(width * 0.75, height * 0.5);

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

for (let i = 0; i < wands.length; i++) {
    var speed = float(ws[i]);
    Wand; w = wands[i]; //Idunno....
    w.update(speed);
  }
}


function isKeyPressed() {
    if (key == 'j') {
      wands[0].update(1);
    }
    if (key == 'k') {
      wands[1].update(1);
    }
    if (key == 'l') {
      wands[2].update(1);
    }
  }
  
  function KeyReleased() {
    if (key == 'j') {
      wands[0].update(0);
    }
    if (key == 'k') {
      wands[1].update(0);
    }
    if (key == 'l') {
      wands[2].update(0);
    }
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
        Wand; w = wands[i];
        w.update(w.windSpeed);
      }
    }
  
    // Loop through to update.
    // We loop forward to draw so that new bubbles are in front.
    for (b of  bubbles) {
      b.update();
    }
  
    // Loop through backward to remove dead bubbles.
    if (frameCount % 6 == 0) {
      fadeGraphics(pg, 0);
    }
    for (var i = bubbles.length - 1; i >= 0; i--) {
      Bubble; bubble = bubbles.get(i);
      // A Bubbles death.
      if (bubble.isDead) {
        let rand = int(random(waterColorImages.length));
        let img = waterColorImages[rand];
        pg.push();
        pg.imageMode(CENTER);
        pg.image(img, bubble.x, bubble.y, bubble.g, bubble.g);
        pg.pop();
        bubbles.remove(i);
      }
    }
  
    image(pg, 0, 0);
  
    for (let b of bubbles) {
      b.draw();
    }
  
    drawFrameRate();
  }
