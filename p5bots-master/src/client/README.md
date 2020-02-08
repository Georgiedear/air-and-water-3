# p5.bots API

* [Setting Up](#setting-up)  
* [Using p5.Bots with p5.js](#using-p5bots-with-p5js)  
  - [Basic Functions](#basic-functions)  
    - [Initialize Board](#initialize-board)  
    - [Initialize Pin](#initialize-pin)  
    - [Constants](#constants)  
    - [Basic Pin Methods](#basic-pin-methods)  
  - [Special Write Modes](#special-write-modes)  
    - [LED Methods](#led-methods)  
    - [RGB LED Methods](#rgb-led-methods)  
    - [MOTOR Methods](#motor-methods)  
    - [SERVO Methods](#servo-methods) 
    - [PIEZO Methods: Tone](#piezo-methods-tone)   
  - [Special Read Modes](#special-read-modes)  
    - [BUTTON Methods](#button-methods)  
    - [VRES Methods](#vres-methods)  
    - [TEMP Methods](#temp-methods)  
    - [PIEZO Methods: Knock](#piezo-methods-knock)  
  - [Other Special Methods](#other-special-methods)  
    - [Serial](#serial)  
  - [Create Your Own Methods](#create-your-own-methods)  

## Setting Up

There are two steps to get up and running with p5.bots.

### Bots in the Browser: The Client
In addition to including `p5.js` in your html file, you will need two other scripts to get p5.bots going: a link to `socket.io`'s CDN or to a version you can download at [socket.io](http://socket.io/download/) and a pointer to the `p5bots.js` file from the [lib directory](https://github.com/sarahgp/p5bots/tree/master/lib).

```html
<script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
<script src="/p5_scripts/p5bots.js"></script>
```


### But Wait, There's More: Server-Side Files
To send messages from the client to the board, you also need to run the p5.bots server files. For more detail on setting up the server and making sure it's working check out the README at [p5bots-server](https://github.com/sarahgp/p5bots/tree/master/src/p5bots-server) & download [p5bots-server from NPM](https://www.npmjs.com/package/p5bots-server).

## Using p5.Bots with p5.js

### Basic Functions

To start communicating with your device, you must first create a board and at least one pin. To do this, first call `p5.board()`. This will return a board object that has the pin method and other functionality attached.

#### Initialize Board
```js
// returns a reference to the board object
p5.board(port, type)
```
 
-- PORT: string, see [example README](https://github.com/sarahgp/p5bots/tree/master/examples) for ways to identify your port
-- TYPE: string, probably 'arduino' 

*Example*
```js
var b = p5.board('/dev/cu.usbmodem1421', 'arduino');
```  

#### Initialize Pin
Once you have a board, you will create at least one pin to let the program know where to send or find  information. This can be called with all the information entered manually or with shorthand. It returns a reference to a pin with the methods suited to its type. (See modes below for details.)

```js
// returns a reference to the pin object
board.pin(num, mode, direction) 
```
-- NUM: pin #  
-- MODE: digital | analog | pwm || any special method
-- DIRECTION: input | output  
  
```js
// shorthand pin initialization
pin = board.pin(num) 
```
-- default to (NUM, 'DIGITAL', 'OUTPUT')

#### Constants
Properties such as type and direction can be indicated with strings, as we saw above, e.g.: `'HIGH'`, or with constants attached to the board object: `b.HIGH`.

The following constants are available:
```js
// values
board.HIGH
board.LOW

// direction
board.INPUT 
board.OUTPUT

// basic mode types
board.ANALOG
board.DIGITAL
board.PWM 

// special mode types
board.SERVO
board.BUTTON
board.KNOCK 
board.LED 
board.MOTOR 
board.PIEZO 
board.RGBLED
board.TEMP
board.TONE
board.VRES
```

#### Basic Pin Methods
All pins have read and write methods. These basic methods are sometimes overwritten by special methods suited to the mode.

`Write` will always send a value to a pin. If the pin is set to input, this may have the effect of setting the pin to pull high or low.

`Read` works differently from the Arduino or Processing `read` methods in that rather than returning a value directly, it takes a function that will be called each time the value changes. p5.bots also sets the `pin.val` property on each value change, though, because this is asynchronous, it may have a small lag.

```js
// each time a value changes pin.val will be updated + optional callback function will be called 
pin.read([callback fn]) 

// send a value to the pin
pin.write(val) 
```

*Example*
```js
// Will log the value each time it changes
p.read(function(val){console.log(val);});
```  

### Special Write Modes
When calling special modes, the direction does not need to be indicated.

#### LED Methods
In addition to read and write, LEDs can be turned on and off, they can blink, and they can fade.

```js
// initialize the pin
led = board.pin(num, 'LED')

// basic functions work as on any other pin
led.write()
led.read()

// write high or low
led.on()
led.off()

// starts the blinking, duration indication how long it stays on/off, in ms
led.blink(duration)

// stops the blinking
led.noBlink()

// fades the pin from the start to stop brightness
// brightness is pwm, 0 to 255; time is in ms
// default total is 3000, interval is 200
led.fade([start, stop, [, total time, interval]])
```

#### RGB LED Methods
Like LEDs, RGB LEDs can be turned on and off, they can blink, and they can fade. When initialized, RGB LEDs take a hash/object listing the pin number for each color as well as the type of LED it is.

```js
// initialize with hash of led options
rgb = board.pin({ r: int, g: int, b: int, common: 'anode' || 'cathode' }, 'RGBLED');

// sets color, takes a p5 color obj or array of values
rgb.write() 
rgb.read()

```

`Write` accepts a p5.Color object or an array of three numbers 0-255 describing an RGB color.

*Example*

These lines create the same color.
```js

var c = color(255, 204, 0);
rgb.write(c);

colorMode(hsla);
var h = color(48, 100, 50);
rgb.write(h);

var a = [255, 204, 0];
rgb.write(a);

```
`On` and `off` toggle high & low, but maintain the previous color value in memory.

```js

// Turns led to previously given color or white
rgb.on()

// Writes low but retains previous color
rgb.off()

// starts the blinking, duration indication how long it stays on/off
rgb.blink(duration)

// stops the blinking, funnily enough
rgb.noBlink()

// fades the pin from the start to stop brightness
// brightness is pwm, 0 to 255; time is in ms
// default total is 3000, interval is 200
// each pin is specified separately
rgb.fade([start, stop, [, total time, interval]], [start, stop, [, total time, interval]], [start, stop, [, total time, interval]])
```

#### MOTOR Methods
```js
// initialize the pin
motor = board.pin(num, 'MOTOR')

// set motor to highest speed, lowest speed
motor.start()
motor.stop()

// set motor to a given speed, pwm 0 to 255
motor.write(int)
```

#### SERVO Methods
```js
// initialize the pin
servo = board.pin(num, 'SERVO')

// range in degrees, default is 0 to 180
servo.range([int, int])

// set to specific position, in degrees
servo.write(int)

// servo moves back and forth, across range; stops
servo.sweep()
servo.noSweep()
```

#### PIEZO Methods: Tone
When set as an output pin, the piezo works as a sound element.

```js
// initialize the pin
t = board.pin(num, 'TONE') || board.pin(num, 'PIEZO')

// sends a single value
t.write()
```
Sounds can be sent to the piezo as a note string or as a frequency.

```js
// sends a note or a frequency for the given duration, in ms
t.tone(note || freq, duration)
t.noTone()
```
*Example*

These will both sound the same tone for half a second.

```js
t.tone('c#2', 500)
t.tone(69, 500)
```

### Special Read Modes
As with special write modes, the direction does not need to be indicated.

#### BUTTON Methods
All three button methods work as special `read` methods by taking functions to be called when the method is invoked, that is, when the button is pressed, released, or held.

```js
// initialize the pin
button = board.pin(num, 'BUTTON')

// each method takes a callback to be called when the button is pressed or released
button.pressed(cb)
button.released(cb)

// hold also requires a threshold to trigger, a time specified in ms
button.held(cb, int)
```

#### VRES Methods

These methods can be used with any variable resistor: for instance, a potentiometer, or a photo- or touch-sensitive sensor.

```js
// initialize the pin
vr = board.pin(num, 'VRES')

// sets the range of values for methods to work with, defaults to 0 to 1023
vr.range([int, int]) 

// works like standard read function: sets vr.val and calls callback on each value change
vr.read([cb])

// sets threshold value
vr.threshold(int)

// once a threshold has been set, this returns boolean (true or false) 
vr.overThreshold 
```

#### TEMP Methods
Initial implementation is for sensors that read voltage change for temperature. Initialization requires both the pin number and the voltage that will be read in: 3.3 or 5.

```js
// initialize the pin with number and voltage
temp = board.pin({pin: num, voltsIn: 5})

// will return raw value always, if you want it to return in a different mode 
// you can call temp.read( function(val) { console.log(temp.f(val)) } );
temp.read() 

// return temp in given system
temp.C
temp.F
temp.K
```

#### PIEZO Methods: Knock
When set as an input pin, the piezo works as a knock sensor.

```js
// initialize the pin
k = board.pin(num, 'KNOCK') || board.pin(num, 'PIEZO')

// standard read function
k.read()

// sets threshold value
k.threshold()

// once a threshold has been set, this returns boolean (true or false) 
k.overThreshold() // returns boolean
```

### Other Special Methods
#### Serial

In addition to the Firmata-based methods above, p5 has a loose [`node-serialport`](https://www.npmjs.com/package/serialport) wrapper.

```js
// Access with
serial = p5.serial()

// To get a list of ports on your machine, you can use list(). 
// Serial does not have to be connected to get a list of ports
serial.list()

// Otherwise you must first connect
// Config object takes options listed at: https://github.com/voodootikigod/node-serialport#serialport-path-options-openimmediately-callback

serial.connect(path [, { config obj } ]) 

// Basic read and write events
serial.read()
serial.write()
```

Because `serial.read` works in the node style of accepting a callback function instead of returning a function, two additional functions have been provided.

```js
// Like the processing API
serial.readEvent([callback function])

// Returns data value
serial.readData()
```


### Create Your Own Methods

If you are familiar with node, you can write your own server-side listeners to call from the client. To do so:

1. Set up a server file where each function you would like to access is its property on the exports object. Each function has access to the socket and the Firmata board instance.

```js

exports.mine = function mine(board, socket) {
  socket.on('event', function(data){ .. });
  socket.emit('another', { name: 'data-object' });
}

```

2. Tell the server about this file when you start using one of the following options. 

```
-p, --ufilepath <p>  Path to file containing user-defined server-side listeners.
-n, --ufilename <n>  Path, inluding file name, to user-defined server-side listeners.
```

Path defaults to the current directory and filename to `user.js`.
