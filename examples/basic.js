const LCD = require('../index');

const lcd = new LCD(1, 0x3f, 16, 2);
lcd.init();
lcd.lines = ['Hello', 'World!'];
lcd.cursor = true;
lcd.blink = true;
