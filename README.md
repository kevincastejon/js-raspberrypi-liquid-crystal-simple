# raspberrypi-liquid-crystal-simple
 Simple control of i2c lcd on Raspberry Pi

# Overview
This module encapsulates the raspberrypi-liquid-crystal module to make its use easier.
Your screen content is represented by an array of string corresponding to each line, and settings such as cursor, blink, etc... are boolean properties.
You can change them at any moment and the screen will display the changes as soon as possible without overlapping the commands.

# Install
Be sure to have enabled I2C on your raspberry, if not use ```sudo raspi-config``` interface to do it
```
npm i raspberrypi-liquid-crystal-simple
```

## Usage
Be sure to use the right address depending on your i2c lcd device, here is an example with 0x3F address
```
const LCD = require('raspberrypi-liquid-crystal-simple');

// Init a 1602 lcd on 0x3f i2c address on i2c bus 1 with 16 characters width and 2 lines
const lcd = new LCD(1, 0x3f, 16, 2);

// then change all the lines at once

lcd.lines = ['Hello', 'World'];

// or separately

lcd.setLine(0, 'Hello');
lcd.setLine(1, 'World');

// Change the different LCD settings
lcd.blink = true;
lcd.cursor = true;
lcd.display = true;
```
## API
- **constructor ( bus : int, address : int, width : int, height : int )**
### Properties
- **address** [read-only] : int - The i2c address declared when instantiating the LCD object.
- **busNumber** [read-only] : int - The bus number declared when instantiating the LCD object.
- **blink** : boolean - If true it will display a white blinking block at the cursor position.
- **cols** [read-only] : int - The number of characters width declared when instantiating the LCD object.
- **cursor** : boolean - If true it will display a underscore line at the cursor position.
- **display** : boolean - If false it will turn off the lcd (backlight). Turns on if true.
- **height** [read-only] : int - The number of lines.
- **lines** : array of strings - The lcd lines text content.
- **rows** [read-only] : int - The number of lines declared when instantiating the LCD object.
- **ready** [read-only] : boolean - True if the LCD has been initialized, false if not.
- **width** [read-only] : int - The number of characters on a line.
### Methods
- **clear ()** : void - Removes any content on the screen.
- **getLine ( lineIndex : int )** : string - Returns the text content of the specified line.
- **init ()** : void - Initializes the lcd so it starts displaying (asynchronous, listen on the "ready" event on the lcd).
- **initSync ()** : void - Initializes the lcd so it starts displaying (synchronous).
- **setLine ( lineIndex : int, text : string )** : void - Sets the text content of the specified line.
### Events
- **ready** () - Fires when the lcd is initialized and ready to display.
- **error** (error) - Fires when an error is encountered.
