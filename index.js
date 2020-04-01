const _LCD = require('raspberrypi-liquid-crystal');
const Emitter = require('events');

class LCD extends Emitter {
  constructor(bus, address, cols, rows, customChars = []) {
    super();
    this._lcd = new _LCD(bus, address, cols, rows);
    this._rows = rows;
    this._cols = cols;
    this._lines = [];
    this._lastLines = [];
    this._lastAlignements = [];
    this._alignements = [];
    this._lastBlinking = false;
    this._lastCursor = false;
    this._lastDisplay = true;
    this._blinking = false;
    this._display = true;
    this._cursor = false;
    this._chars = customChars.map((e) => e.concat());
    for (let i = 0; i < rows; i += 1) {
      this._lines.push('');
      this._lastLines.push('');
      this._alignements.push(LCD.LEFT);
      this._lastAlignements.push(LCD.LEFT);
    }
  }

  static get LEFT() {
    return 'left';
  }

  static get CENTER() {
    return 'center';
  }

  static get RIGHT() {
    return 'right';
  }

  initSync() {
    try {
      this._lcd.beginSync();
      this._lcd.clearSync();
      for (let i = 0; i < this._chars.length && i < 8; i += 1) {
        this._lcd.createCharSync(i, this._chars[i]);
      }
    } catch (e) {
      this.emit('error', e);
      return;
    }
    this.emit('ready');
    this._displayMessage();
  }

  async init() {
    try {
      await this._lcd.begin();
      await this._lcd.clear();
      for (let i = 0; i < this._chars.length && i < 8; i += 1) {
        await this._lcd.createChar(i, this._chars[i]);
      }
    } catch (e) {
      this.emit('error', e);
      return;
    }
    this.emit('ready');
    this._displayMessage();
  }

  get busNumber() {
    return this._lcd._busNumber;
  }

  get address() {
    return this._lcd._address;
  }

  get cols() {
    return this._lcd._cols;
  }

  get rows() {
    return this._lcd._rows;
  }

  get ready() {
    return this._lcd._began;
  }

  get blink() {
    return this._blinking;
  }

  set blink(value) {
    const bool = Boolean(value);
    this._blinking = bool;
  }

  get cursor() {
    return this._cursor;
  }

  set cursor(value) {
    const bool = Boolean(value);
    this._cursor = bool;
  }

  get display() {
    return this._display;
  }

  set display(value) {
    const bool = Boolean(value);
    this._display = bool;
  }

  set lines(newLines) {
    for (let i = 0; i < newLines.length; i += 1) {
      this.setLine(i, newLines[i]);
    }
  }

  get lines() {
    return (this._lines.concat());
  }

  clear() {
    for (let i = 0; i < this._lines.length; i += 1) {
      this._lines[i] = '';
    }
  }

  setLine(line, message) {
    if (line < 0 || line > this._rows - 1) {
      this.emit('error', new Error('line index is out of bounds'));
    } else {
      this._lines[line] = String(message);
    }
  }

  getLine(line) {
    if (line < 0 || line > this._rows - 1) {
      this.emit('error', new Error('line index is out of bounds'));
      return null;
    }
    return (this._lines[line]);
  }

  setAlignement(line, alignement) {
    if (line < 0 || line > this._rows - 1) {
      this.emit('error', new Error('line index is out of bounds'));
    } else {
      this._alignements[line] = alignement;
    }
  }

  getAlignement(line) {
    if (line < 0 || line > this._rows - 1) {
      this.emit('error', new Error('line index is out of bounds'));
      return null;
    }
    return (this._alignements[line]);
  }

  static getChar(charId) {
    return _LCD.getChar(charId);
  }

  _checkNewLines() {
    for (let i = 0; i < this._lines.length; i += 1) {
      if (this._lines[i] !== this._lastLines[i]) {
        return true;
      }
    }
    return false;
  }

  _checkNewAlignements() {
    for (let i = 0; i < this._alignements.length; i += 1) {
      if (this._alignements[i] !== this._lastAlignements[i]) {
        return true;
      }
    }
    return false;
  }

  _checkBlinkChange() {
    return this._lastBlinking !== this._blinking;
  }

  _checkCursorChange() {
    return this._lastCursor !== this._cursor;
  }

  _checkDisplayChange() {
    return this._lastDisplay !== this._display;
  }

  _updateBlinking() {
    this._lastBlinking = this._blinking;
  }

  _updateCursor() {
    this._lastCursor = this._cursor;
  }

  _updateDisplay() {
    this._lastDisplay = this._display;
  }

  _updateLastLines() {
    for (let i = 0; i < this._lines.length; i += 1) {
      this._lastLines[i] = this._lines[i];
    }
  }

  _updateLastAlignements() {
    for (let i = 0; i < this._alignements.length; i += 1) {
      this._lastAlignements[i] = this._alignements[i];
    }
  }

  async _displayMessage() {
    try {
      if (this._checkDisplayChange()) {
        if (this._display) {
          await this._lcd.display();
        } else {
          await this._lcd.noDisplay();
        }
        this._updateDisplay();
      }
      if (this._checkBlinkChange()) {
        if (this._blinking) {
          await this._lcd.blink();
        } else {
          await this._lcd.noBlink();
        }
        this._updateBlinking();
      }
      if (this._checkCursorChange()) {
        if (this._cursor) {
          await this._lcd.cursor();
        } else {
          await this._lcd.noCursor();
        }
        this._updateCursor();
      }
      if (this._checkNewLines() || this._checkNewAlignements()) {
        await this._lcd.clear();
        for (let i = 0; i < this._lines.length; i += 1) {
          let message = this._lines[i];
          if (this._alignements[i] === LCD.LEFT) {
            message = message.length > this._cols ? message.substr(0, this._cols) : message;
          } else if (this._alignements[i] === LCD.CENTER) {
            message = message.length > this._cols ? message.substr(0, this._cols) : Array(parseInt((this._cols - message.length) / 2, 10)).fill(' ').join('').concat(message);
          } else if (this._alignements[i] === LCD.RIGHT) {
            message = message.length > this._cols ? message.substr(0, this._cols) : Array(this._cols - message.length).fill(' ').join('').concat(message);
          }
          await this._lcd.printLine(i, message);
        }
        this._updateLastLines();
        this._updateLastAlignements();
      }
    } catch (e) {
      this.emit('error', e);
      return;
    }
    setTimeout(() => this._displayMessage(), 16);
  }
}
module.exports = LCD;
