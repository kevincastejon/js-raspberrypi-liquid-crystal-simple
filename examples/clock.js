const LCD = require('../index');

const lcd = new LCD(1, 0x3f, 16, 2);
lcd.init();
setInterval(() => {
  const date = new Date();
  lcd.lines = [`     ${date.getHours()}h${date.getMinutes()}m`,
    `    ${date.getSeconds()}s${date.getMilliseconds()}ms`];
}, 20);
