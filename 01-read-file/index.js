const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});

stream.on('data', (chunk) => console.log(chunk));
stream.on('error', (e) => console.log(e.message));
