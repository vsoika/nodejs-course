const { program } = require('commander');

let SHIFT_VALUE = null;
const NUMBER_OF_LETTERS_IN_ALPHABET = 26;
let isInputFile = false;
let isOutputFile = false;
const ENCODE_MODE = 'encode';
const DECODE_MODE = 'decode';
let mode = '';

program.storeOptionsAsProperties(false).passCommandToAction(false);

program
  .requiredOption('-s, --shift <num>', 'a shift')
  .option('-i, --input <filename>', 'an input file')
  .option('-o, --output <filename>', 'an output file')
  .option('-a, --action <action>', 'an action encode/decode')
  .action(options => {
    if (options.shift) {
      SHIFT_VALUE = +options.shift;
    }

    options.output ? (isOutputFile = true) : (isOutputFile = false);
    if (options.action) {
      console.log(`mode: ${options.action}`);
      mode = options.action === ENCODE_MODE ? ENCODE_MODE : DECODE_MODE;
    } else {
      process.on('exit', code => console.log(`Exit code: ${code}`));
      process.stderr.write('Caught Exception. Err: ');
      // process.exit();
    }

    if (options.input) {
      isInputFile = true;
    } else {
      isInputFile = false;
      console.log('- write input message and press Enter: ');
    }

    if (options.input) {
      console.log(options.input.slice(2));
    }
  });

program.parse(process.argv);

const fs = require('fs');
const readerStream = fs.createReadStream('input.txt');
const writerStream = fs.createWriteStream('output.txt');

const { pipeline, Transform } = require('stream');
const { StringDecoder } = require('string_decoder');

// Handle the raw output from standard input
// (characters, not lines, as is the default).
// process.stdin.setRawMode(true);
// process.stdin.resume();

process.stdin.setEncoding('utf8');

// process.stdin.on('readable', () => {
//   let chunk;
//   // Use a loop to make sure we read all available data.
//   while ((chunk = process.stdin.read()) !== null) {
//     process.stdout.write(`input data: ${chunk}`);
//   }
// });

process.stdin.on('end', () => {
  process.stdout.write('output: ');
  process.stdout.write('end');
});

class CaesarCipherDecoder extends Transform {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder('utf-8');
  }

  decode(item, plain) {
    const indexInPlain = plain.indexOf(item);

    if (mode === ENCODE_MODE) {
      if (indexInPlain + SHIFT_VALUE < NUMBER_OF_LETTERS_IN_ALPHABET) {
        item = plain[indexInPlain + SHIFT_VALUE];
      } else {
        item =
          plain[indexInPlain + SHIFT_VALUE - NUMBER_OF_LETTERS_IN_ALPHABET];
      }
    }

    if (mode === DECODE_MODE) {
      if (indexInPlain - SHIFT_VALUE >= 0) {
        item = plain[indexInPlain - SHIFT_VALUE];
      } else {
        item =
          plain[indexInPlain - SHIFT_VALUE + NUMBER_OF_LETTERS_IN_ALPHABET];
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
      // process.exit();
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

pipeline(
  isInputFile ? readerStream : process.stdin,
  new CaesarCipherDecoder(),
  isOutputFile ? writerStream : process.stdout,
  err => {
    if (err) {
      console.log('Pipeline failed: ', err.statusCode);
    } else {
      console.log('Pipeline succeeded.');
    }
  }
);
