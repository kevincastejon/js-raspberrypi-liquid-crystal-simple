# raspberrypi-liquid-crystal-simple
 Simple control of i2c lcd on Raspberry Pi

## Overview
This module encapsulates the raspberrypi-liquid-crystal module to make its use easier.
Your screen content is represented by an array of string corresponding to each line, and settings such as cursor, blink, etc... are boolean properties.
You can change them at any moment and the screen will display the changes as soon as possible without overlapping the commands.

## Install
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

## Text alignment
You can specify an alignment for each LCD line. LEFT is default.
```
lcd.setAlignment(0, LCD.CENTER);    // Will center the first line
lcd.setAlignment(1, LCD.RIGHT);     // Will align right the second line
```

## Custom characters
You can create up to 8 custom characters by providing a list of array of number representing your characters dots into the constructor last optional argument. Then use them by inserting LCD.getChar(charId) into any string.
```
const LCD = require('raspberrypi-liquid-crystal-simple');
const customChars = [
  [0x0,0xa,0x1f,0x1f,0xe,0x4,0x0],  // Heart character
  [0x0,0x0,0xa,0x0,0x11,0xe,0x0],  // Smiley character
];
const lcd = new LCD(1, 0x3f, 16, 2, customChars);
lcd.init();
lcd.setLine(0, 'Hello' + LCD.getChar(0) + 'World' + LCD.getChar(1))
```
You can use this online tool to easily generate chars (copy and paste the hexadecimals value)
http://www.quinapalus.com/hd44780udg.html

## API
- **constructor ( bus : int, address : int, cols : int, rows : int [, customChars : [][]int] )**
### Constants
- **LEFT** static [read-only] : string - Shortcut for "left" value, use it along with setAlignement() method.
- **RIGHT** static [read-only] : string - Shortcut for "right" value, use it along with setAlignement() method.
- **CENTER** static [read-only] : string - Shortcut for "center" value, use it along with setAlignement() method.
### Properties
- **address** [read-only] : int - The i2c address declared when instantiating the LCD object.
- **busNumber** [read-only] : int - The bus number declared when instantiating the LCD object.
- **blink** : boolean - If true it will display a white blinking block at the cursor position.
- **cols** [read-only] : int - The number of characters width declared when instantiating the LCD object.
- **cursor** : boolean - If true it will display a underscore line at the cursor position.
- **display** : boolean - If false it will turn off the lcd (backlight). Turns on if true.
- **lines** : []string - The lcd lines text content. Don't modify directly the array content
- **rows** [read-only] : int - The number of lines declared when instantiating the LCD object.
- **ready** [read-only] : boolean - True if the LCD has been initialized, false if not.
### Methods
- **clear ()** : void - Removes any content on the screen.
- **getAlignment ( lineIndex : int )** : string - Returns the text alignment on the specified line.
- **getLine ( lineIndex : int )** : string - Returns the text content of the specified line.
- **init ()** : void - Initializes the lcd so it starts displaying (asynchronous, listen on the "ready" event on the lcd).
- **initSync ()** : void - Synchronous version of init() method.
- **setAlignement ( lineIndex : int, alignment : string )** : void - Sets the text alignment on the specified line. Use the static constants LCD.LEFT, LCD.RIGHT and LCD.CENTER or directly the strings "left", "right" and "center"
- **setLine ( lineIndex : int, text : string )** : void - Sets the text content of the specified line.
- **getChar ( id : int )** - Returns a custom character given on the constructor at specified id (0 to 7).
### Events
- **ready** () - Fires when the lcd is initialized and ready to display.
- **error** (error) - Fires when an error is encountered.
