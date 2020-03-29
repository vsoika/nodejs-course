const { Transform } = require('stream');
const { StringDecoder } = require('string_decoder');
const indexFile = require('./index');

const ENCODE_MODE = 'encode';
const DECODE_MODE = 'decode';
const NUMBER_OF_LETTERS_IN_ALPHABET = 26;

class CaesarCipherDecoder extends Transform {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder('utf-8');
  }

  decode(item, plain) {
    const indexInPlain = plain.indexOf(item);

    if (indexFile.mode === ENCODE_MODE) {
      if (
        indexInPlain + indexFile.SHIFT_VALUE <
        NUMBER_OF_LETTERS_IN_ALPHABET
      ) {
        item = plain[indexInPlain + indexFile.SHIFT_VALUE];
      } else {
        item =
          plain[
            indexInPlain + indexFile.SHIFT_VALUE - NUMBER_OF_LETTERS_IN_ALPHABET
          ];
      }
    }

    if (indexFile.mode === DECODE_MODE) {
      if (indexInPlain - indexFile.SHIFT_VALUE >= 0) {
        item = plain[indexInPlain - indexFile.SHIFT_VALUE];
      } else {
        item =
          plain[
            indexInPlain - indexFile.SHIFT_VALUE + NUMBER_OF_LETTERS_IN_ALPHABET
          ];
      }
    }
    return item;
  }

  _transform(chunk, encoding, callback) {
    const plain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }

    // Exit on CTRL + C.
    if (chunk === '\u0003') {
      process.exit();
    }

    if (chunk) {
      chunk = chunk
        .split('')
        .map(n => {
          if (/[A-Z]/.test(n)) {
            n = this.decode(n, plain);
          }

          if (/[a-z]/.test(n)) {
            n = this.decode(n, plain.toLowerCase());
          }

          return n;
        })
        .join('');
    }
    callback(null, chunk);
  }
}

module.exports = CaesarCipherDecoder;
