const fsp = require('fs').promises;
const path = require('path');

async function deleteDir(dir) {
  await fsp.rmdir(dir, { recursive: true });
  return dir;
}

async function createDir(dir) {
  fsp.mkdir(dir, (err) => {
    if (err) {
      console.log('Error', err);
    }
  });

  return dir;
}

async function copyDir(dir, copy) {
  const dirInfo = await fsp.readdir(dir, { withFileTypes: true });

  for (const file of dirInfo) {
    if (file.isDirectory()) {
      await fsp.mkdir(path.resolve(copy, file.name));
      await copyDir(
        path.resolve(dir, file.name),
        path.resolve(copy, file.name)
      );
    } else {
      fsp.copyFile(path.resolve(dir, file.name), path.resolve(copy, file.name));
    }
  }
}

if (fsp.access(path.resolve(__dirname, 'files-copy'))) {
  deleteDir(path.resolve(__dirname, 'files-copy'))
    .then((dir) => createDir(dir))
    .then((dir) => copyDir(path.resolve(__dirname, 'files'), dir));
} else {
  createDir(path.resolve(__dirname, 'files-copy')).then((dir) =>
    copyDir(path.resolve(__dirname, 'files'), dir)
  );
}
