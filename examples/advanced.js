const LCD = require('../index');

function wait(delay) {
  return (new Promise((res) => {
    setTimeout(() => { res(); }, delay);
  }));
}

const lcd = new LCD(1, 0x3f, 16, 2);
lcd.on('error', (error) => console.log(error));
lcd.on('ready', async () => {
  lcd.lines = ['hello', 'world'];
  await wait(1000);
  lcd.setLine(1, 'world!');
  await wait(500);
  lcd.setLine(1, 'world!!');
  await wait(500);
  lcd.setLine(1, 'world!!!');
  await wait(1000);
  lcd.cursor = true;
  await wait(1000);
  lcd.cursor = false;
  await wait(1000);
  lcd.blink = true;
  await wait(1000);
  lcd.blink = false;
  await wait(1000);
  lcd.display = false;
  await wait(1000);
  lcd.display = true;
});
lcd.init();
