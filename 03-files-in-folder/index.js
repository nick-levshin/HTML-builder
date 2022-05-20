const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

const getFileList = async (dirName) => {
  let files = [];
  const items = await fsp.readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`))];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
};

const printStat = (files) => {
  console.log('---------------');
  files.forEach((file) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        console.log(err);
      } else {
        console.log(
          `Name: ${path.parse(file).name}\nExtention: ${
            path.parse(file).ext
          }\nSize: ${(stats.size / 1024).toFixed(2)}kb`
        );
        console.log('---------------');
      }
    });
  });
};

getFileList(path.resolve(__dirname, 'secret-folder')).then((files) => {
  printStat(files);
});
