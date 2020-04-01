const LCD = require('../index');

function wait(delay) {
  return (new Promise((res) => {
    setTimeout(() => { res(); }, delay);
  }));
}

const lcd = new LCD(1, 0x3f, 16, 2, [[0x0, 0x0, 0xa, 0x1f, 0x1f, 0xe, 0x4, 0x0]]);
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
  await wait(1000);
  lcd.setLine(1, `world!!!${LCD.getChar(0)}`);
  lcd.setAlignement(0, LCD.CENTER);
  lcd.setAlignement(1, LCD.RIGHT);
});
lcd.init();
