const { program } = require('commander');
const fs = require('fs');
const readerStream = fs.createReadStream('input.txt');
const writerStream = fs.createWriteStream('output.txt', { flags: 'a' });
const { pipeline } = require('stream');
const CaesarCipherDecoder = require('./caesarCipherDecoder');

let SHIFT_VALUE = null;
let isInputFile = false;
let isOutputFile = false;
const ENCODE_MODE = 'encode';
const DECODE_MODE = 'decode';
let mode = '';

program.storeOptionsAsProperties(false).passCommandToAction(false);

program
  .requiredOption('-a, --action <action>', 'an action encode/decode')
  .requiredOption('-s, --shift <num>', 'a shift')
  .option('-i, --input <filename>', 'an input file')
  .option('-o, --output <filename>', 'an output file')
  .action(options => {
    if (options.shift) {
      if (
        typeof +options.shift !== 'number' ||
        +options.shift !== +options.shift
      ) {
        process.stderr.write(
          'error: argument of shift option should be a number'
        );
        process.exit();
      }
      SHIFT_VALUE = +options.shift;
    }

    if (options.action) {
      if (options.action !== ENCODE_MODE && options.action !== DECODE_MODE) {
        process.stderr.write(
          "error: argument of action option should be only 'encode' or 'decode'"
        );
        process.exit();
      }

      console.log(`mode: ${options.action}`);
      mode = options.action === ENCODE_MODE ? ENCODE_MODE : DECODE_MODE;
    } else {
      process.on('exit', code => console.log(`Exit code: ${code}`));
      process.stderr.write('Caught Exception. Err: ');
      process.exit();
    }

    if (options.input) {
      const path = options.input;

      fs.access(path, fs.F_OK, err => {
        if (err) {
          process.on('exit', code => console.log(`Exit code: ${code}`));
          process.stderr.write('error: input file is does not exist. ');
          process.exit(1);
        }
      });

      isInputFile = true;
    } else {
      isInputFile = false;
      console.log('- write input message and press Enter: ');
    }

    if (options.output) {
      const path = options.output;

      fs.access(path, fs.F_OK, err => {
        if (err) {
          process.on('exit', code => console.log(`Exit code: ${code}`));
          process.stderr.write('error: output file is does not exist. ');
          process.exit(1);
        }
      });

      isOutputFile = true;
    } else {
      isOutputFile = false;
    }
  });

program.parse(process.argv);
process.stdin.setEncoding('utf8');

process.stdin.on('end', () => {
  process.stdout.write('output: ');
  process.stdout.write('end');
});

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

module.exports.mode = mode;
module.exports.SHIFT_VALUE = SHIFT_VALUE;
