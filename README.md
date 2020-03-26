# raspberrypi-simple-i2c-lcd
 Simple control of i2c lcd on Raspberry Pi

# Install
Be sure to have enabled I2C on your raspberry, if not use ```sudo raspi-config``` interface to do it
```
npm i raspberrypi-simple-i2c-lcd
```

## Usage
Be sure to use the right address depending on your i2c lcd device, here is an example with 0x3F address
```
const SimpleLCD = require('raspberrypi-simple-i2c-lcd');

// Init a 1602 lcd on 0x3f i2c address on i2c bus 1
const menu = new SimpleLCD(1, 0x3f, 16, 2);

// then

menu.lines = ['Hello', 'World'];

// or

menu.setLine(0, 'Hello');
menu.setLine(1, 'World');
```
## API
- Properties
  - height [read-only] : int - The number of lines
  - lines : array of strings - The lcd lines text content
  - width [read-only] : int - The number of characters on a line
- Methods
  - getLine( lineIndex : int ) : string - Returns the text content of the specified line
  - setLine( lineIndex : int, text : string ) : void - Sets the text content of the specified line
