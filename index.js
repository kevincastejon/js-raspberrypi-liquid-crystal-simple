const LCD = require('raspberrypi-i2c-lcd');

class SimpleLCD {
  constructor(bus, address, width, height) {
    this.lcd = new LCD(bus, address, width, height);
    this._height = height;
    this._width = width;
    this._lines = [];
    this._lastLines = [];
    for (let i = 0; i < height.length; i += 1) {
      this._lines.push('');
      this._lastLines.push('');
    }
    this.lcd.clearAsync(() => {
      this._displayMessage();
    });
  }

  get height() {
    return (this._height);
  }

  get width() {
    return (this._width);
  }

  set lines(value) {
    for (let i = 0; i < this._lines.length; i += 1) {
      if (value.length - 1 < i) {
        break;
      } else {
        this._lines[i] = value[i].substr(0, this._width);
      }
    }
  }

  get lines() {
    return (this._lines.concat());
  }

  setLine(line, message) {
    if (line < 0 || line > this._height - 1) {
      throw new Error('line index is out of bounds');
    } else {
      this._lines[line] = message.substr(0, this._width);
    }
  }

  getLine(line) {
    if (line < 0 || line > this._height - 1) {
      throw new Error('line index is out of bounds');
    } else {
      return (this._lines[line]);
    }
  }

  _checkNewLines() {
    for (let i = 0; i < this._lines.length; i += 1) {
      if (this._lines[i] !== this._lastLines[i]) {
        return true;
      }
    }
    return false;
  }

  _updateLastLines() {
    for (let i = 0; i < this._lines.length; i += 1) {
      this._lastLines[i] = this._lines[i];
    }
  }

  _printLine(line, message) {
    return new Promise((res, rej) => {
      this.lcd.printlnAsync(message, line, (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  _displayMessage() {
    if (this._checkNewLines()) {
      this._updateLastLines();
      this.lcd.clearAsync(async () => {
        for (let i = 0; i < this._lines.length; i += 1) {
          await this._printLine(i, this._lines[i]);
        }
        this._displayMessage();
      });
    } else {
      setTimeout(() => this._displayMessage(), 16);
    }
  }
}
module.exports = SimpleLCD;
