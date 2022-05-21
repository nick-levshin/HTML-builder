const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

const getFileList = async (dirName) => {
  await fs.unlink(
    path.resolve(__dirname, 'project-dist', 'bundle.css'),
    (err) => {
      if (err) {
        return;
      }
    }
  );
  let files = [];
  const items = await fsp.readdir(dirName, {
    withFileTypes: true,
  });

  for (const item of items) {
    if (item.isDirectory()) {
      console.log('Error, programm doesnt work recursively');
    } else {
      if (path.parse(path.resolve(dirName, item.name)).ext === '.css') {
        const readStream = await fs.createReadStream(
          path.resolve(dirName, item.name),
          {
            encoding: 'utf-8',
          }
        );
        const writeStream = await fs.createWriteStream(
          path.resolve(__dirname, 'project-dist', 'bundle.css'),
          {
            encoding: 'utf-8',
            flags: 'a',
          }
        );
        await readStream.on('data', (chunk) => writeStream.write(chunk));
      }
    }
  }

  return files;
};

getFileList(path.resolve(__dirname, 'styles'));
