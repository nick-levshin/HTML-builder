const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function recursiveReadLine(stream) {
  readline.question('Enter your text:\n', (text) => {
    if (text === 'exit') {
      return readline.close();
    }

    stream.write(text + '\n');
    recursiveReadLine(stream);
  });
}

const stream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});

recursiveReadLine(stream);

stream.on('error', (e) => console.log(e.message));
stream.on('finish', () => console.log('Stream was closed'));
process.on('exit', () => {
  stream.end();
  console.log('Later, bro');
});
